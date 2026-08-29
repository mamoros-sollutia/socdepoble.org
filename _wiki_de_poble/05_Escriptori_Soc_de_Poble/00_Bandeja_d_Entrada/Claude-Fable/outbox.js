/**
 * outbox.js — Cua durable d'eixida damunt d'IndexedDB natiu.
 * Sense 'idb'. Sense promeses damunt de local-storage.
 *
 * ---------------------------------------------------------------------------
 * CORRECCIONS RESPECTE DE LA VERSIÓ AUDITADA (27/08/2026)
 *
 *  P0-1  DEADLOCK DE MUNTATGE. Cap transacció registrava `onabort`. Quan una
 *        transacció avorta SENSE peticions pendents (fallada de commit per
 *        quota a WebKit, `db.close()` forçat, `versionchange`), l'especificació
 *        només dispara `abort`: ni `complete` ni `error`. La promesa no es
 *        resolia mai i `loadAppData` quedava penjada per sempre, deixant
 *        `status === 'loading'` i la pantalla en blanc. Un `try/catch` NO pot
 *        atrapar una promesa que no es resol. Ara tota transacció passa per
 *        `transaccio()`, que registra els TRES esdeveniments i porta a més un
 *        rellotge vigilant per al cas en què WebKit no en dispare cap.
 *
 *  P0-4  EL CIRCUIT BREAKER DESTRUÏA ELS SNAPSHOTS. `deleteDatabase(DB)` mata
 *        també el magatzem `snapshots`: tres errors transitoris i la persona
 *        perdia tot el contingut offline, no només la cua. Ara el disparador
 *        només buida `pendents`. L'esborrat total existix, però és explícit i
 *        no automàtic (`esborraTot`).
 *
 *  P0-5  FUITA DE CONNEXIÓ. Quan `obri()` esgotava el temps, posava
 *        `dbPromesa = null` però la petició seguia viva: en arribar tard,
 *        `onsuccess` resolia una promesa ja rebutjada i la connexió quedava
 *        oberta per sempre. Ara, si la promesa ja està tancada, es fa
 *        `db.close()`.
 *
 *  P1-1  ARRENDAMENT SENSE COMPTADOR. Un registre que feia petar l'enviador a
 *        mitjan camí es reclamava indefinidament sense arribar mai al límit
 *        d'intents: bucle etern amb missatge verinós. Ara la reclamació per
 *        arrendament caducat incrementa `intents` i respecta el límit.
 *
 *  P1-2  `signe-vida` CONTAMINAVA LA CUA. El sentinella s'escrivia dins de
 *        `pendents` i inflava per sempre el comptador de missatges pendents.
 *        Ara viu a `snapshots` sota `meta:signe-vida`. Sense pujar de versió
 *        d'esquema: cap migració per als qui ja tenen la BD creada.
 *
 *  P1-9  CONFIRMACIÓ NO ATÒMICA. Si l'esborrat fallava després d'un enviament
 *        correcte, el registre tornava a la cua i es reenviava: missatges
 *        duplicats. Ara hi ha una làpida (`estat: 'confirmat'`) com a segona
 *        línia de defensa, i `escombra()` la recull més tard.
 *
 *  NO LLEVES CAP `onabort` NI CAP RELLOTGE VIGILANT.
 *  `tooling/gates/tractor-outbox.mjs` t'aturarà.
 * ---------------------------------------------------------------------------
 */
import { setVal } from '../config/storage.js';

const DB = 'sdp-outbox';
const VERSIO = 2;                 // NO pujar: no cal migració per als instal·lats
const MAGATZEM = 'pendents';
const SNAPSHOTS = 'snapshots';

const ARRENDAMENT_MS = 60_000;    // reclamació de registres encallats
const OBERTURA_MS = 5_000;        // WebKit pot no disparar mai res en obrir
const VIGILANT_MS = 8_000;        // ni dins d'una transacció
const LLINDAR_ERRORS = 3;         // errors consecutius abans de buidar la cua
const MAX_INTENTS = 8;
const LOT_MAX = 20;
const RETARDS = [1000, 4000, 15000, 60000, 300000];

let dbPromesa = null;
let engineErrors = 0;
let purgant = false;

/* ───────────────────────────── Circuit Breaker ─────────────────────────── */

function resetCircuitBreaker() {
  engineErrors = 0;
}

function isRecoverableError(err) {
  const name = err?.name || '';
  return name !== 'QuotaExceededError' && 
         name !== 'ConstraintError' &&
         name !== 'VersionError';
}

function tripCircuitBreaker(err) {
  if (isRecoverableError(err)) return; // No comptem errors genèrics
  if (purgant) return;            // no comptem els errors de la mateixa purga
  engineErrors += 1;
  if (engineErrors < LLINDAR_ERRORS) return;
  engineErrors = 0;
  purgant = true;
  
  // Pedaç Gemini (Fase 4) + Dola: Quarantena temporal amb auto-eixida
  console.error('[OUTBOX] Circuit Breaker: errors crítics d\'IDB. Entrem en QUARANTENA (5 min).');
  if (typeof window !== 'undefined') {
    window.__SDP_OUTBOX_QUARANTINED__ = true;
    window.dispatchEvent(new CustomEvent('sdp:outbox-quarantena', { detail: true }));
    setTimeout(() => {
      window.__SDP_OUTBOX_QUARANTINED__ = false;
      purgant = false;
      window.dispatchEvent(new CustomEvent('sdp:outbox-quarantena', { detail: false }));
    }, 5 * 60 * 1000);
  }
  tancaConnexio();
}

/** Tanca la connexió i força una reobertura neta a la pròxima crida. */
export async function tancaConnexio() {
  const anterior = dbPromesa;
  dbPromesa = null;
  try {
    const db = await Promise.resolve(anterior).catch(() => null);
    db?.close();
  } catch {
    /* ja estava tancada */
  }
}

/** Àlies de compatibilitat per evitar memory leaks (Requisit Kimi) */
export const destroy = tancaConnexio;

/**
 * Esborrat total de la base de dades. NO es crida mai automàticament:
 * només des d'una acció explícita de la persona usuària.
 * Mai no es queda penjat: `onblocked` i rellotge resolen igual.
 */
export function esborraTot() {
  return tancaConnexio().then(() => new Promise((resol) => {
    let fet = false;
    const fi = (motiu) => { if (fet) return; fet = true; clearTimeout(rellotge); resol(motiu); };
    const rellotge = setTimeout(() => fi('temps-esgotat'), 3000);
    try {
      const p = indexedDB.deleteDatabase(DB);
      p.onsuccess = () => fi('esborrada');
      p.onerror = () => fi('error');
      p.onblocked = () => fi('bloquejada');
    } catch {
      fi('excepcio');
    }
  }));
}

/* ─────────────────────────────── Connexió ──────────────────────────────── */

function obri() {
  if (dbPromesa) return dbPromesa;

  const meua = new Promise((resol, rebutja) => {
    let tancada = false;

    const rellotge = setTimeout(() => {
      if (tancada) return;
      tancada = true;
      if (dbPromesa === meua) dbPromesa = null;
      rebutja(new Error(`IDB Vigilant: obertura encallada ${OBERTURA_MS} ms (WebKit)`));
    }, OBERTURA_MS);

    let p;
    try {
      p = indexedDB.open(DB, VERSIO);
    } catch (err) {
      clearTimeout(rellotge);
      tancada = true;
      rebutja(err);
      return;
    }

    p.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(MAGATZEM)) {
        const magatzem = db.createObjectStore(MAGATZEM, { keyPath: 'id' });
        magatzem.createIndex('estat', 'estat');
      }
      if (!db.objectStoreNames.contains(SNAPSHOTS)) {
        db.createObjectStore(SNAPSHOTS, { keyPath: 'id' });
      }
    };

    p.onsuccess = () => {
      clearTimeout(rellotge);
      const db = p.result;

      /* P0-5: la promesa ja s'havia rebutjat pel rellotge. Si no tanquem esta
         connexió, queda oberta per sempre i n'obrirem una altra a sobre. */
      if (tancada) {
        try { db.close(); } catch { /* res */ }
        return;
      }
      tancada = true;

      db.onversionchange = () => {
        try { db.close(); } catch { /* res */ }
        if (dbPromesa === meua) dbPromesa = null;
      };
      db.onclose = () => {
        if (dbPromesa === meua) dbPromesa = null;
      };
      resol(db);
    };

    p.onerror = () => {
      clearTimeout(rellotge);
      if (tancada) return;
      tancada = true;
      if (dbPromesa === meua) dbPromesa = null;
      tripCircuitBreaker(p.error || new Error('IDB open error'));
      rebutja(p.error || new Error('IDB open error'));
    };

    p.onblocked = () => {
      clearTimeout(rellotge);
      if (tancada) return;
      tancada = true;
      if (dbPromesa === meua) dbPromesa = null;
      rebutja(new Error('IDB Blocked'));
    };
  });

  dbPromesa = meua;
  /* Evita que un rebuig no consumit arribe al gestor global de la pàgina. */
  meua.catch(() => {});
  return meua;
}

/* ────────────────────────────── Transaccions ───────────────────────────── */

const desembolica = (v) => {
  if (typeof v === 'function') return v();
  if (v && typeof v === 'object' && 'result' in v) return v.result;
  return v;
};

/**
 * P0-1. Única porta d'accés a qualsevol transacció.
 *
 * Registra els TRES esdeveniments de la transacció. `abort` és el cas que
 * mata: quan una transacció avorta sense peticions pendents, `complete` i
 * `error` no es disparen mai.
 *
 * El rellotge vigilant cobrix el cas restant: WebKit encallat sense disparar
 * cap esdeveniment. Sense ell, cap `onabort` del món et salva.
 */
function transaccio(db, magatzem, mode, fn) {
  return new Promise((resol, rebutja) => {
    let t;
    let fet = false;
    let valor;

    const acaba = (accio) => {
      if (fet) return;
      fet = true;
      clearTimeout(rellotge);
      accio();
    };

    const rellotge = setTimeout(() => acaba(() => {
      try { t?.abort(); } catch { /* res */ }
      tancaConnexio();   /* connexió encallada: recicla-la o cada escriptura tardarà VIGILANT_MS fins recarregar */
      const err = new Error(`IDB Vigilant: '${magatzem}' encallat ${VIGILANT_MS} ms`);
      tripCircuitBreaker(err);
      rebutja(err);
    }), VIGILANT_MS);

    try {
      t = db.transaction(magatzem, mode);
    } catch (err) {
      acaba(() => rebutja(err));
      return;
    }

    t.oncomplete = () => acaba(() => {
      resetCircuitBreaker();
      resol(desembolica(valor));
    });
    t.onerror = () => acaba(() => {
      const err = t.error || new Error(`IDB error a '${magatzem}'`);
      tripCircuitBreaker(err);
      rebutja(err);
    });
    t.onabort = () => acaba(() => {
      const err = t.error || new Error(`IDB abort a '${magatzem}'`);
      tripCircuitBreaker(err);
      rebutja(err);
    });

    try {
      valor = fn(t.objectStore(magatzem), t);
    } catch (err) {
      acaba(() => {
        try { t.abort(); } catch { /* res */ }
        rebutja(err);
      });
    }
  });
}

const tx = async (mode, fn) => transaccio(await obri(), MAGATZEM, mode, fn);

/* ─────────────────────────────────── API ───────────────────────────────── */

export const uuid = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ (typeof crypto !== 'undefined' && crypto.getRandomValues ? crypto.getRandomValues(new Uint8Array(1))[0] : Math.random() * 256) & 15 >> c / 4).toString(16)
  );
};

/**
 * Encua. L'id ve del cridador i NO es regenera mai en cap reintent, de manera
 * que un reintent del cridador és idempotent (`put` damunt de la mateixa clau).
 *
 * L'escriptura i la verificació van dins d'UNA sola transacció: en resoldre's
 * `oncomplete` sabem que el commit ha reeixit I que el registre hi era. És una
 * prova més forta que dues transaccions separades, i la meitat de viatges a
 * disc (a l'iPad A10 això es nota).
 */
export const encua = async (registre) => {
  if (typeof window !== 'undefined' && window.__SDP_OUTBOX_QUARANTINED__) {
    throw new Error('[OUTBOX] En quarantena temporal.');
  }
  if (!registre || registre.id === undefined || registre.id === null || registre.id === '') {
    throw new Error('[OUTBOX] encua() exigix un id estable del cridador.');
  }
  const obj = {
    ...registre,
    estat: 'pendent',
    intents: 0,
    seguentIntentTs: 0,
    arrendamentTs: 0,
    creatTs: Date.now()
  };

  const comprova = await tx('readwrite', (m) => {
    m.put(obj);
    return m.get(registre.id);
  });

  if (!comprova) {
    throw new Error('[OUTBOX] Evicció silenciosa: la lectura de verificació ha tornat buit.');
  }
  return comprova;
};

/**
 * P1-9. Esborra el registre. Si l'esborrat falla després d'un enviament
 * correcte, hi deixa una làpida perquè `reclama()` no el torne a agafar mai:
 * val més un registre orfe que un missatge duplicat a la paret del poble.
 */
export async function confirma(id) {
  return tx('readwrite', (m) => {
    const p = m.get(id);
    p.onsuccess = () => {
      const r = p.result;
      if (!r || r.estat === 'confirmat') return;
      /* IDB no llança: informa per `onerror` i, si ningú ho evita, avorta la
         transacció sencera. `preventDefault` conserva la transacció i
         `stopPropagation` evita que el gestor de la transacció la rebutge.
         Un `try/catch` ací no atrapa res: el `catch` era codi mort. */
      const lapida = () => m.put({ ...r, estat: 'confirmat', confirmatTs: Date.now() });
      let d;
      try { d = m.delete(id); } catch { lapida(); return; }   /* excepció síncrona: impossible a IDB real, però barata */
      d.onerror = (ev) => {                                     /* fallada REAL: asíncrona */
        ev.preventDefault?.();
        ev.stopPropagation?.();
        lapida();
      };
    };
    return () => true;
  });
}

export const pendents = () => tx('readonly', (m) => m.getAll());

/**
 * Reclama un lot dins d'UNA transacció readwrite.
 * IndexedDB serialitza les transaccions readwrite damunt del mateix magatzem,
 * així que dues pestanyes no poden reclamar el mateix registre.
 *
 * P1-1: la reclamació per arrendament caducat incrementa `intents`. Sense això
 * un registre que fa petar l'enviador es reclama per sempre.
 */
export async function reclama(limit = LOT_MAX) {
  if (typeof window !== 'undefined' && window.__SDP_OUTBOX_QUARANTINED__) return [];
  const ara = Date.now();
  const lot = [];

  await tx('readwrite', (m) => {
    const index = m.index('estat');
    
    // 1r: registres 'pendent' que ja toca
    index.openCursor('pendent').onsuccess = (e) => {
      const c = e.target.result;
      if (!c || lot.length >= limit) return;
      const r = c.value;
      if (ara >= (r.seguentIntentTs || 0)) {
        const reclamat = { ...r, estat: 'enviant', arrendamentTs: ara };
        c.update(reclamat);
        lot.push(reclamat);
      }
      c.continue();
    };
    
    // 2n: registres 'enviant' amb arrendament caducat
    if (lot.length < limit) {
      index.openCursor('enviant').onsuccess = (e) => {
        const c = e.target.result;
        if (!c || lot.length >= limit) return;
        const r = c.value;
        if (ara - (r.arrendamentTs || 0) > ARRENDAMENT_MS) {
          const intents = (r.intents || 0) + 1;
          if (intents > MAX_INTENTS) {
            console.warn(`[OUTBOX] Missatge mort per arrendaments caducats: ${r.id}`);
            c.update({ ...r, estat: 'mort', intents });
          } else {
            const reclamat = { ...r, estat: 'enviant', intents, arrendamentTs: ara };
            c.update(reclamat);
            lot.push(reclamat);
          }
        }
        c.continue();
      };
    }
    return () => lot;
  });

  return lot;
}

export const ajorna = (registre) => {
  const intents = (registre.intents || 0) + 1;
  if (intents > MAX_INTENTS) {
    console.warn(`[OUTBOX] Missatge mort després de ${MAX_INTENTS} intents: ${registre.id}`);
    return tx('readwrite', (m) => m.put({ ...registre, estat: 'mort', intents }));
  }
  const base = RETARDS[Math.min(intents - 1, RETARDS.length - 1)];
  const jitter = Math.floor(Math.random() * base * 0.3);
  return tx('readwrite', (m) => m.put({
    ...registre,
    estat: 'pendent',
    intents,
    arrendamentTs: 0,
    seguentIntentTs: Date.now() + base + jitter
  }));
};

/**
 * Recollida de fem: lleva làpides i morts vells.
 * Sense això la cua creix per sempre i el 7-Day Purge de Safari té més a purgar.
 */
export async function escombra(maxEdatMs = 7 * 24 * 60 * 60 * 1000) {
  const ara = Date.now();
  let esborrats = 0;

  await tx('readwrite', (m) => {
    m.openCursor().onsuccess = (e) => {
      const c = e.target.result;
      if (!c) return;
      const r = c.value;
      const referencia = r.confirmatTs || r.creatTs || 0;
      if ((r.estat === 'confirmat' || r.estat === 'mort') && ara - referencia > maxEdatMs) {
        c.delete();
        esborrats += 1;
      }
      c.continue();
    };
    return () => esborrats;
  });

  return esborrats;
}

/**
 * P1-2. Renovació del 7-Day Purge de Safari.
 * Viu a `snapshots`, no a la cua: un sentinella no és un missatge pendent.
 */
export async function enviaSigneVida() {
  try {
    setVal('sdp-signe-vida', Date.now());
    const db = await obri();
    await transaccio(db, SNAPSHOTS, 'readwrite', (m) =>
      m.put({ id: 'meta:signe-vida', data: Date.now(), ts: Date.now() }));
    return true;
  } catch (err) {
    console.warn('[OUTBOX] Signe de vida ha fallat', err);
    return false;
  }
}

/* ──────────────────── Protocol Làzaro: snapshots a IDB ─────────────────── */

export const getSnapshot = async (id) => {
  const db = await obri();
  const registre = await transaccio(db, SNAPSHOTS, 'readonly', (m) => m.get(id));
  return registre?.data ?? null;
};

export const saveSnapshot = async (id, data) => {
  const db = await obri();
  await transaccio(db, SNAPSHOTS, 'readwrite', (m) => m.put({ id, data, ts: Date.now() }));
};

/** Zeta F-4 & Dola: Comptador de Quarantena i Errors */
export async function compta() {
  const lot = await tx('readonly', (m) => m.getAll());
  const totals = lot.length;
  const morts = lot.filter(r => r.estat === 'mort').length;
  return {
    totals,
    morts,
    quarantena: typeof window !== 'undefined' ? !!window.__SDP_OUTBOX_QUARANTINED__ : false
  };
}

