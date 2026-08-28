---
doc_id: SDP-DOC-260828_1556
doc_type: "[WIKI_DOC]"
authoring_agent: "IAIA MarIA"
version_semver: 1.0.0
owner: Consell de la Petorreta
domain: global
locale: ca-valencia
hora_creacio: "15:56"
academic_metadata:
  data_creacio: "2026-08-28"
  nivell_maduresa: "Esborrany"
---

# Bundle Auditoria Ronda 4

> **Anclatge de Seguretat**: Aquest document està ancorat a l'índex central [[00_INDEX_ESCRIPTORI]] / [[00_index]] per evitar l'orfenesa i garantir la consciència de la IA en futures auditories.

[INSERIU EL CONTINGUT ACÍ]


## Contingut de la Ronda 4


### src/data/outbox.js
```javascript
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
  
  // Pedaç Gemini (Fase 4): Quarantena temporal en lloc d'esborrar la cua sencera
  console.error('[OUTBOX] Circuit Breaker: errors crítics d\'IDB. Entrem en QUARANTENA per protegir les dades.');
  if (typeof window !== 'undefined') window.__SDP_OUTBOX_QUARANTINED__ = true;
  tancaConnexio().finally(() => { purgant = false; });
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
  try {
    await tx('readwrite', (m) => m.delete(id));
    return true;
  } catch (err) {
    console.warn('[OUTBOX] Esborrat fallit; es marca com a confirmat.', id, err);
    try {
      await tx('readwrite', (m) => {
        const p = m.get(id);
        p.onsuccess = () => {
          if (p.result) m.put({ ...p.result, estat: 'confirmat', confirmatTs: Date.now() });
        };
        return () => true;
      });
      return true;
    } catch (err2) {
      console.error('[OUTBOX] Tampoc s\'ha pogut marcar com a confirmat.', id, err2);
      throw err;
    }
  }
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
  const ara = Date.now();
  const lot = [];

  await tx('readwrite', (m) => {
    m.openCursor().onsuccess = (e) => {
      const c = e.target.result;
      if (!c || lot.length >= limit) return;
      const r = c.value;

      const caducat = r.estat === 'enviant' && ara - (r.arrendamentTs || 0) > ARRENDAMENT_MS;
      const toca = r.estat === 'pendent' && ara >= (r.seguentIntentTs || 0);

      if (caducat) {
        const intents = (r.intents || 0) + 1;
        if (intents > MAX_INTENTS) {
          console.warn(`[OUTBOX] Missatge mort per arrendaments caducats: ${r.id}`);
          c.update({ ...r, estat: 'mort', intents });
        } else {
          const reclamat = { ...r, estat: 'enviant', intents, arrendamentTs: ara };
          c.update(reclamat);
          lot.push(reclamat);
        }
      } else if (toca) {
        const reclamat = { ...r, estat: 'enviant', arrendamentTs: ara };
        c.update(reclamat);
        lot.push(reclamat);
      }

      c.continue();
    };
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

```

### src/data/sincronitzador.js
```javascript
/**
 * sincronitzador.js — Motor de buidatge de la cua d'eixida.
 *
 * ---------------------------------------------------------------------------
 * CORRECCIONS RESPECTE DE LA VERSIÓ AUDITADA (27/08/2026)
 *
 *  P0-3  EL MOTOR NO ESTAVA CONNECTAT. `arrancaSincronitzador` tenia ZERO
 *        cridadors en tot l'arbre. `buida()` només s'invocava des de
 *        `sendChatMessage` i `sendSectionSubmission`, i la seua primera línia
 *        és `if (!navigator.onLine) return`. Resultat: si la persona escrivia
 *        sense cobertura i tornava la cobertura sense escriure res més, els
 *        missatges no eixien MAI. Tota la maquinària de reintents, retards i
 *        arrendaments d'`outbox.js` era codi mort.
 *        → Cal cridar `arrancaSincronitzador()` des d'`AppDataProvider`.
 *          Vegeu el bloc de connexió al final d'este fitxer.
 *
 *  P1-2  `compta()` FILTRAVA PER UN ESTAT INEXISTENT. `estat !== 'confirmat'`
 *        no descartava res, perquè els confirmats s'esborraven. Comptava morts
 *        i sentinelles: el globus de "pendents" no baixava mai de zero.
 *        Ara compta el que és de veres pendent: `pendent` i `enviant`.
 *
 *  P1-9  REENVIAMENT PER CONFIRMACIÓ FALLIDA. Si l'enviament reeixia però
 *        `confirma()` petava, el registre tornava a la cua i s'enviava un altre
 *        colp. Ara hi ha una guarda de sessió (`lliurats`) a més de la làpida
 *        d'`outbox.js`.
 *
 *  P1-10 BUCLE SENSE SOSTRE. `while (lot.length > 0)` sense límit de voltes.
 *        Ara hi ha `MAX_VOLTES`; el que quede es reprén al pròxim cicle.
 *
 *  P1-11 CÀRREGA MAL LLEGIDA. `r.payload || r.carrega` per al xat: `encua()`
 *        guarda el xat a `carrega` i els enviaments a `payload`. Ara es llig
 *        cadascun pel seu camp.
 * ---------------------------------------------------------------------------
 */
import { reclama, confirma, ajorna, pendents, enviaSigneVida, escombra } from './outbox.js';
import { appendChatMessages, appendSectionSubmissionNetworkOnly } from './backendPort.js';

const MAX_VOLTES = 50;
const INTERVAL_MS = 30_000;
const ESCOMBRA_CADA = 20;         // ~1 recollida de fem cada 10 minuts

let corrent = false;

/**
 * Ids ja lliurats a la xarxa en esta sessió però encara no confirmats a disc.
 * Segona línia de defensa contra el reenviament: si `confirma()` peta, el
 * registre continua a la cua, i quan el tornem a reclamar sabem que ja va eixir.
 */
const lliurats = new Set();

const senseXarxa = () =>
  typeof navigator !== 'undefined' && navigator.onLine === false;

/**
 * Buida la cua. No llança mai: torna un resum.
 * Segur si es crida en paral·lel: la guarda `corrent` serialitza dins de la
 * pestanya, i l'arrendament readwrite d'`outbox.js` serialitza entre pestanyes.
 */
export async function buida(config) {
  if (corrent) return { enviats: 0, ajornats: 0, voltes: 0, motiu: 'ja-corrent' };
  if (senseXarxa()) return { enviats: 0, ajornats: 0, voltes: 0, motiu: 'sense-xarxa' };

  corrent = true;
  let enviats = 0;
  let ajornats = 0;
  let voltes = 0;

  try {
    let lot;
    while (voltes < MAX_VOLTES && (lot = await reclama()).length > 0) {
      voltes += 1;

      for (const r of lot) {
        /* Ja va eixir a la xarxa i només falta netejar-lo del disc. */
        if (lliurats.has(r.id)) {
          try {
            await confirma(r.id);
            lliurats.delete(r.id);
          } catch (e) {
            console.warn('[SINCRONITZADOR] Confirmació pendent per a', r.id, e);
          }
          continue;
        }

        try {
          if (r.tipus === 'submission') {
            await appendSectionSubmissionNetworkOnly(r.payload, config);
          } else {
            await appendChatMessages([r.carrega ?? r.payload], config);
          }

          /* Marquem ABANS de confirmar: si l'esborrat peta, el pròxim cicle
             sabrà que este registre ja va eixir i no el reenviarà. */
          lliurats.add(r.id);
          await confirma(r.id);
          lliurats.delete(r.id);
          enviats += 1;
        } catch (e) {
          console.warn('[SINCRONITZADOR] Enviament fallit, s\'ajorna:', r.id, e);
          try {
            await ajorna(r);
          } catch (e2) {
            console.error('[SINCRONITZADOR] Tampoc s\'ha pogut ajornar:', r.id, e2);
          }
          ajornats += 1;
        }
      }

      if (senseXarxa()) break;
    }

    if (voltes >= MAX_VOLTES) {
      console.warn('[SINCRONITZADOR] Límit de voltes assolit; es reprén al pròxim cicle.');
    }
  } catch (e) {
    console.error('[SINCRONITZADOR] Falla crítica al bucle de buidatge:', e);
  } finally {
    corrent = false;
  }

  return { enviats, ajornats, voltes };
}

/**
 * P0-3. Arranca el motor. SENSE ESTA CRIDA LA CUA NO ES BUIDA MAI.
 *
 * Torna una funció de neteja pensada per a un `useEffect`:
 *
 *     useEffect(() => arrancaSincronitzador(stableExternalConfig), [stableExternalConfig]);
 *
 * Disparadors: torna la cobertura, torna la pestanya a primer pla, i un
 * rellotge de seguretat. El rellotge també renova el signe de vida (defensa
 * contra el 7-Day Purge de Safari) i passa l'escombra de tant en tant.
 */
export function arrancaSincronitzador(config, opcions = {}) {
  if (typeof window === 'undefined') return () => {};

  const intervalMs = opcions.intervalMs ?? INTERVAL_MS;
  const escombraCada = opcions.escombraCada ?? ESCOMBRA_CADA;

  let viu = true;
  let cicles = 0;

  const disparador = () => {
    if (!viu) return;
    buida(config).catch((e) => console.error('[SINCRONITZADOR]', e));
  };

  const perVisibilitat = () => {
    if (document.visibilityState === 'visible') disparador();
  };

  const tic = () => {
    if (!viu) return;
    cicles += 1;
    enviaSigneVida().catch(() => {});
    if (cicles % escombraCada === 0) escombra().catch(() => {});
    disparador();
  };

  window.addEventListener('online', disparador);
  document.addEventListener('visibilitychange', perVisibilitat);
  const rellotge = setInterval(tic, intervalMs);

  /* Arrancada en fred: pot haver-hi cua d'una sessió anterior. */
  enviaSigneVida().catch(() => {});
  disparador();

  return () => {
    viu = false;
    window.removeEventListener('online', disparador);
    document.removeEventListener('visibilitychange', perVisibilitat);
    clearInterval(rellotge);
  };
}

/**
 * P1-2. Quants missatges esperen de veres.
 * Els morts, les làpides i els sentinelles no són pendents: no compten.
 */
export const compta = async () =>
  (await pendents()).filter((r) => r.estat === 'pendent' || r.estat === 'enviant').length;

/* ---------------------------------------------------------------------------
 * CONNEXIÓ REQUERIDA — src/app/AppDataContext.jsx
 *
 *   import { buida, arrancaSincronitzador } from '../data/sincronitzador.js';
 *
 *   // dins d'AppDataProvider, al costat dels altres useEffect:
 *   useEffect(
 *     () => arrancaSincronitzador(stableExternalConfig),
 *     [stableExternalConfig]
 *   );
 *
 * Sense estes tres línies, `outbox.js` continua sent una cua d'escriptura
 * només: guarda els missatges de l'uelo i no els envia mai.
 * --------------------------------------------------------------------------- */

```

### src/data/backendPort.js
```javascript
// src/data/backendPort.js
import * as supabaseImpl from './supabaseBackend.js';

// Implementació per defecte: l'antic Supabase
let currentImpl = {
  loadAppData: supabaseImpl.loadAppData,
  appendChatMessages: supabaseImpl.appendChatMessages,
  appendSectionSubmissionNetworkOnly: supabaseImpl.appendSectionSubmissionNetworkOnly,
  
  // Auth
  registerWithEmail: supabaseImpl.registerWithEmail,
  loginWithEmail: supabaseImpl.loginWithEmail,
  logout: supabaseImpl.logout,
  getCurrentUser: supabaseImpl.getCurrentUser,
  
  // Config
  getHasSupabaseConfig: supabaseImpl.getHasSupabaseConfig,
  getRuntimeDataMode: supabaseImpl.getRuntimeDataMode,
  normalizeDataMode: supabaseImpl.normalizeDataMode,
  getResolvedConfig: supabaseImpl.getResolvedConfig,
};

let isLocked = false;

/**
 * Permet a un host (com Sollutia) injectar la seua pròpia implementació
 * de backend, aïllant completament l'App de Supabase.
 */
export function setBackendImplementation(impl) {
  if (isLocked) {
    console.warn('[backendPort] 🔒 Backend bloquejat. No s\'admeten injeccions tardanes (prevenció d\'atacs).');
    return;
  }
  currentImpl = { ...currentImpl, ...impl };
}

export function getBackendImplementation() {
  return currentImpl;
}

export function freezeImplementation() {
  isLocked = true;
  Object.freeze(currentImpl);
}

export function destroy() {
  if (typeof currentImpl.destroy === 'function') {
    currentImpl.destroy();
  }
}

// Re-exportem constants i funcions que no depenen de xarxa
export const APP_SNAPSHOT_STORAGE_KEY = supabaseImpl.APP_SNAPSHOT_STORAGE_KEY;
export const DATA_SYNC_CHANNEL_NAME = supabaseImpl.DATA_SYNC_CHANNEL_NAME;
export const getDefaultUserId = supabaseImpl.getDefaultUserId;
export const SECTION_SUBMISSIONS_STORAGE_KEY = supabaseImpl.SECTION_SUBMISSIONS_STORAGE_KEY;

// Re-exportem la interfície perquè la resta de l'App (AppDataContext, sincronitzador)
// consumisca això en compte de supabaseBackend.js
export const loadAppData = (...args) => currentImpl.loadAppData(...args);
export const appendChatMessages = (...args) => currentImpl.appendChatMessages(...args);
export const appendSectionSubmissionNetworkOnly = (...args) => currentImpl.appendSectionSubmissionNetworkOnly(...args);
export const registerWithEmail = (...args) => currentImpl.registerWithEmail(...args);
export const loginWithEmail = (...args) => currentImpl.loginWithEmail(...args);
export const logout = (...args) => currentImpl.logout(...args);
export const getCurrentUser = (...args) => currentImpl.getCurrentUser(...args);
export const getHasSupabaseConfig = (...args) => currentImpl.getHasSupabaseConfig(...args);
export const getRuntimeDataMode = (...args) => currentImpl.getRuntimeDataMode(...args);
export const normalizeDataMode = (...args) => currentImpl.normalizeDataMode(...args);
export const getResolvedConfig = (...args) => currentImpl.getResolvedConfig(...args);

```

### src/main.jsx
```javascript
import { defineCustomElement } from './PedraSecaEmbed';

const init = () => {
  defineCustomElement();

  // Per a l'entorn de desenvolupament local de Vite, simplement
  // instanciem l'element personalitzat al DOM, igual que faria WordPress.
  const arrel = document.getElementById('root');
  if (arrel && !arrel.innerHTML) {
    const element = document.createElement('soc-de-poble');
    // Afegim una configuració mock per a dev local i l'atribut de fonts
    element.setAttribute('fonts-href', '/src/assets/fonts/noto-sans.css');
    element.setAttribute('config', JSON.stringify({
      pluginUrl: '/',
      supabaseUrl: (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env.VITE_SUPABASE_URL : '',
    }));
    arrel.appendChild(element);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

```

### src/PedraSecaEmbed.jsx
```javascript
/**
 * PedraSecaEmbed.jsx — <soc-de-poble>
 * ---------------------------------------------------------------------------
 * Correccions respecte de la versió auditada:
 *
 *  P0-1 MORT PER MOVIMENT DE DOM. `connectedCallback` es protegia amb
 *       `if (!this.shadowRoot)`. El shadow root SOBREVIU a un moviment de node,
 *       així que en tornar a connectar la guarda impedia tornar a muntar: el
 *       component quedava mort per sempre. WordPress (Gutenberg, Elementor)
 *       mou nodes constantment. Ara la guarda és sobre l'arrel de React i el
 *       shadow root es reaprofita.
 *
 *  P0-2 CURSA DEL setTimeout. El desmuntatge diferit s'executava encara que el
 *       node es reconnectara dins del mateix tick, matant l'arrel nova. Ara es
 *       cancel·la a `connectedCallback`.
 *
 *  P0-3 @font-face DINS DEL SHADOW DOM. Per especificació, un `@font-face`
 *       declarat dins d'un shadow root NO es registra: només compta l'arbre del
 *       document. A més, les URL relatives de `noto-sans.css` es resoldrien
 *       contra la pàgina de WordPress i donarien 404. Les fonts es carreguen
 *       ara al document, una sola vegada, via `fonts-href`.
 *
 *  P0-4 CSS DUPLICAT PER INSTÀNCIA. Cada instància injectava una còpia sencera
 *       del full (~150 kB). Ara es comparteix un únic `CSSStyleSheet` mitjançant
 *       `adoptedStyleSheets`.
 *
 *  P0-5 CONFIG MUTADA EN LLOC. `this.config` es mutava conservant la identitat
 *       de l'objecte, així que qualsevol `useMemo`/comparació per referència
 *       aigües avall veia el valor vell. Ara cada canvi crea un objecte nou.
 *       Llevar un atribut tampoc no netejava mai el valor: ara sí.
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, BrowserRouter, MemoryRouter } from 'react-router-dom';
import App from './app/App';
import { AppDataProvider } from './app/AppDataContext';
import styles from './css/index.css?inline';
import { readThemePreference, resolveTheme } from './config/theme';

/* ───────────────────────────── Error boundary ──────────────────────────── */

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('[PedraSeca] Error capturat pel límit de React:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="alert">
          <h2>No s'ha pogut carregar Sóc de Poble</h2>
          <p>Torna a carregar la pàgina. Si continua, avisa l'administrador del lloc.</p>
          <pre>{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function PedraSecaEmbed({ config }) {
  const RouterComponent = config.routerType === 'browser' ? BrowserRouter : 
                          config.routerType === 'memory' ? MemoryRouter : HashRouter;
  const routerProps = config.basename ? { basename: config.basename } : {};

  return (
    <ErrorBoundary>
      <RouterComponent {...routerProps}>
        <AppDataProvider externalConfig={config}>
          <App />
        </AppDataProvider>
      </RouterComponent>
    </ErrorBoundary>
  );
}

/* ──────────────────── Full d'estils compartit (P0-4) ───────────────────── */

let fullCompartit = null;

function obtenirFull() {
  if (fullCompartit) return fullCompartit;
  if (typeof CSSStyleSheet === 'undefined') return null;
  try {
    const full = new CSSStyleSheet();
    full.replaceSync(`:host{display:block;width:100%;}\n${styles}`);
    fullCompartit = full;
    return full;
  } catch {
    return null; /* navegador sense adoptedStyleSheets → recurs de <style> */
  }
}

/* ─────────────────────── Fonts al document (P0-3) ──────────────────────── */

function carregarFonts(href) {
  if (!href || typeof document === 'undefined') return;
  if (!document.querySelector(`link[data-sdp-fonts="${CSS.escape(href)}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.setAttribute('data-sdp-fonts', href);
    document.head.appendChild(link);
  }
}

function descarregarFonts(href) {
  if (!href || typeof document === 'undefined') return;
  const numInstancies = document.getElementsByTagName('soc-de-poble').length;
  if (numInstancies > 0) return;
  const link = document.querySelector(`link[data-sdp-fonts="${CSS.escape(href)}"]`);
  if (link) link.remove();
}

/* ───────────────────────────── Element custom ──────────────────────────── */

const BaseElement = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};

const ATRIBUTS = {
  'base-path': 'basePath',
  'supabase-url': 'supabaseUrl',
  'supabase-anon-key': 'supabaseAnonKey',
  'data-mode': 'dataMode',
  'bot-api-url': 'botApiUrl',
  'fonts-href': 'fontsHref',
  'plugin-url': 'pluginUrl'
};

class SocDePobleElement extends BaseElement {
  static get observedAttributes() {
    return [...Object.keys(ATRIBUTS), 'config', 'config-id'];
  }

  constructor() {
    super();
    this._config = {};
    this._configProp = {};
    this._root = null;
    this._punt = null;
    this._desmuntatge = null;
    this._hasMountedReact = false;
  }

  /** Propietat JS: permet passar objectes rics (WordPress, React host, Vue…). */
  set config(valor) {
    this._configProp = valor && typeof valor === 'object' ? valor : {};
    this._recalcularConfig();
    this._render();
  }
  get config() {
    return this._config;
  }

  connectedCallback() {
    // Kimi (Task 16): Cancel·lem el desmuntatge determinista pendent
    this._pendingUnmount = false;
    
    // DeepSeek (Task 4): Pany global per evitar arbres React paral·lels
    if (window.__SDP_REACT_MOUNTED__ && window.__sdp_active_element !== this) {
      console.error('[PedraSeca] Error FATAL: Una altra instància de <soc-de-poble> ja està corrent. Aquesta instància es bloqueja.');
      return;
    }

    if (window.__sdp_active_element && window.__sdp_active_element !== this) {
      const old = window.__sdp_active_element;
      // DeepSeek (Task 17): Només desmuntem si la vella instància encara està connectada
      if (old.isConnected) {
        console.warn('[PedraSeca] Instància prèvia encara connectada, forçant desmuntatge.');
        if (typeof old._forcaDesmuntatge === 'function') {
          old._forcaDesmuntatge();
        }
      }
    }
    window.__sdp_active_element = this;
    window.__SDP_REACT_MOUNTED__ = true;
    this._hasMountedReact = true;

    /* El shadow root sobreviu als moviments: es reaprofita, no es recrea. */
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });

    const arrel = this.shadowRoot;
    const full = obtenirFull();
    if (full && 'adoptedStyleSheets' in arrel) {
      try {
        if (!arrel.adoptedStyleSheets.includes(full)) {
          arrel.adoptedStyleSheets = [...arrel.adoptedStyleSheets, full];
        }
      } catch {
        // Fallback robust per a certs entorns (WP editor) que trenquen adoptedStyleSheets
      }
    } 
    
    if (!full || !('adoptedStyleSheets' in arrel) || arrel.adoptedStyleSheets.length === 0) {
      if (!arrel.querySelector('style[data-sdp]')) {
        const style = document.createElement('style');
        style.setAttribute('data-sdp', '');
        style.textContent = `:host{display:block;width:100%;}\n${styles}`;
        arrel.appendChild(style);
      }
    }

    if (!this._punt || !this._punt.isConnected) {
      this._punt = document.createElement('div');
      this._punt.className = 'sdp-root';
      arrel.appendChild(this._punt);
    }

    this._recalcularConfig();
    this.dataset.theme = resolveTheme(this._config.themeMode ?? readThemePreference());

    /* P0-1: la guarda va sobre l'arrel de React, no sobre el shadow root. */
    if (!this._root) this._root = createRoot(this._punt);
    this._render();
  }

  attributeChangedCallback() {
    if (!this.isConnected) return;
    this._recalcularConfig();
    this._render();
  }

  /** P0-5: objecte nou cada vegada; llevar un atribut esborra el valor. */
  _recalcularConfig() {
    const desDAtributs = {};
    for (const [attr, clau] of Object.entries(ATRIBUTS)) {
      const v = this.getAttribute(attr);
      if (v !== null) desDAtributs[clau] = v;
    }

    let desDeJson = {};
    const configId = this.getAttribute('config-id');
    if (configId) {
      try {
        const scriptEl = document.getElementById(configId);
        if (scriptEl && scriptEl.type === 'application/json') {
          const parsed = JSON.parse(scriptEl.textContent);
          if (parsed && typeof parsed === 'object') desDeJson = parsed;
        }
      } catch {
        console.warn('[soc-de-poble] L\'atribut "config-id" no s\'ha pogut llegir.');
      }
    }

    const cru = this.getAttribute('config');
    if (cru) {
      try {
        const parsed = JSON.parse(cru);
        if (parsed && typeof parsed === 'object') desDeJson = { ...desDeJson, ...parsed };
      } catch {
        console.warn('[soc-de-poble] L\'atribut "config" no és JSON vàlid; s\'ignora.');
      }
    }

    const rawConfig = { ...desDeJson, ...desDAtributs, ...this._configProp };
    
    // Assegurem que pluginUrl arriba sempre si està a l'atribut HTML
    if (!rawConfig.pluginUrl && this.getAttribute('plugin-url')) {
      rawConfig.pluginUrl = this.getAttribute('plugin-url');
    }
    
    let canviat = false;
    if (!this._config || Object.keys(rawConfig).length !== Object.keys(this._config).length) {
      canviat = true;
    } else {
      for (const key in rawConfig) {
        if (rawConfig[key] !== this._config[key]) {
          canviat = true;
          break;
        }
      }
    }

    if (canviat) {
      this._config = { ...rawConfig };
    }
    carregarFonts(this._config.fontsHref);
  }

  _render() {
    if (!this._root) return;
    this._root.render(
      <PedraSecaEmbed config={this._config} />
    );
  }

  // API Pública per a Sollutia
  refreshData() {
    if (this._punt) {
      this._punt.dispatchEvent(new CustomEvent('sdp:refresh-data', { bubbles: true }));
    }
  }
  
  getShadowRoot() {
    return this.shadowRoot;
  }
  
  getInternalRoot() {
    return this._punt;
  }
  
  setLanguage(lang) {
    this._config = { ...this._config, language: lang };
    this._render();
  }

  _forcaDesmuntatge() {
    this.disconnectedCallback();
  }

  disconnectedCallback() {
    if (this._config.fontsHref) {
      descarregarFonts(this._config.fontsHref);
    }

    if (!this._root || this._pendingUnmount) return;
    
    // Kimi (Task 16): Desmuntatge determinista amb queueMicrotask en lloc de setTimeout/rAF
    // Si és només un moviment de DOM, connectedCallback es cridarà síncronament en el 
    // mateix event loop i posarà _pendingUnmount a false, avortant el cleanup.
    this._pendingUnmount = true;
    queueMicrotask(() => {
      if (!this._pendingUnmount) return; // Cancel·lat! El node ha tornat a connectar-se
      this._pendingUnmount = false;
      
      if (this.isConnected) return; /* ha tornat: no toquem res (seguretat) */
      
      if (window.__sdp_active_element === this) {
        window.__sdp_active_element = null;
      }
      window.__SDP_REACT_MOUNTED__ = false;
      this._hasMountedReact = false;
      this._root?.unmount();
      this._root = null;
      if (this._punt) {
        this._punt.remove();
        this._punt = null;
      }
    });
  }
}

export function defineCustomElement() {
  if (typeof window === 'undefined') return;
  
  // Singleton Guard ara gestionat per __SDP_LIVE__ al connectedCallback

  // Global Error Handler per a QuotaExceeded i Promeses orfes (Black Box Error Handler)
  if (!window.__SDP_GLOBAL_ERRORS_BOUND__) {
    window.addEventListener('unhandledrejection', (event) => {
      const err = event.reason;
      if (err?.name === 'QuotaExceededError' || String(err).includes('QuotaExceeded')) {
        console.warn('[PedraSeca] QuotaExceeded global capturat. No esborrem la BD per seguretat davant de tercers (WordPress). Confiem en els fallbacks interns.');
      } else {
        console.warn('[PedraSeca] Promesa rebutjada globalment (no crítica):', err);
      }
    });
    window.__SDP_GLOBAL_ERRORS_BOUND__ = true;
  }

  if (!customElements.get('soc-de-poble')) {
    customElements.define('soc-de-poble', SocDePobleElement);
  }
}

```

### .agents/BIOS.md
```javascript
# BIOS Cognitiu Executable (Sóc de Poble)

Aquest document descriu la seqüència d'arrencada (boot) que ha de seguir qualsevol Intel·ligència Artificial o nou desenvolupador en entrar a treballar al codi base. No és només text, és verificable pel `tooling/verify-bios.mjs`.

## PASSOS DE LA SEQÜÈNCIA D'ARRENCADA
1. **Verificar el BIOS**: Executar `node tooling/verify-bios.mjs` per garantir que el sistema de fitxers core està intacte.
2. **Revisar el BOOTSTRAP**: Llegir `.agents/BOOTSTRAP.md` per conèixer els valors i l'arquitectura.
3. **Assumir el Contracte**: Llegir `.agents/AGENTS.md` (La Font Única de Veritat Executiva).
4. **Verificar Portes Mecàniques**: Executar `npm run gate` per verificar que no hi ha regressions en persistència ni lints.
5. **Comprovar el LEDGER**: Revisar `.agents/LEDGER.md` per veure les últimes decisions arquitectòniques històriques i signar-lo si es modifica (amb `node tooling/verify-ledger.mjs --sign`).

## CONFIGURACIÓ ACTIVA
- **Model Arquitectònic**: Offline-First (Actualment Online-First Temporal amb Supabase, veure `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/architecture/ADR-2026-08-ONLINE-FIRST.md`).
- **Sistema de Disseny**: Pedra Seca (Llegir `.agents/skills/pedra-seca/SKILL.md`).
- **Emmagatzematge Local**: IndexedDB via `src/data/outbox.js` (Escriptures Atòmiques, Circuit Breaker).

```

### .agents/LEDGER.md
```javascript
# Llibre d'Obra (LEDGER) de Sóc de Poble

Aquest és el registre immutable de tots els canvis estructurals i tècnics del projecte.
Qualsevol IA (o humà) que modifique codi està obligada a afegir-hi una entrada abans de finalitzar la seua tasca, complint amb la **Skill Trellat**.

---

## Deute Històric i Arqueologia (L'Herència de Pedra Seca)
*Aquest apartat documenta les decisions preses abans de la creació d'aquest LEDGER (Fase Pre-Mecànica) que condicionen fortament l'arquitectura actual i futura.*
- **Offline-First vs Sollutia (Online-First temporal):** El sistema va nàixer descentralitzat però hem assumit dependència de Supabase i del Plugin de WordPress de Sollutia temporalment per garantir el "time to market" (ADR-2026-08-ONLINE-FIRST). El sincronitzador actual reflecteix aquest deute: fa servir `src/data/outbox.js` però guarda la memòria cau de lectura gairebé com a element descartable o tèrmic.
- **La Guerra contra WordPress (Gutenberg):** S'han hagut d'introduir panys globals (`window.__SDP_REACT_MOUNTED__`) i `queueMicrotask` a `src/PedraSecaEmbed.jsx` perquè el DOM de WordPress destrueix, remunta i mou instàncies indiscriminadament, generant zombies i competició per la IndexedDB.
- **Mentides de WebKit i Circuit Breaker:** Gran part de la complexitat a `src/data/outbox.js` ve de tractar els `onabort` muts i `onblocked` infinits del motor d'IndexedDB en iPad/iOS (A10). Això va obligar a crear un sistema de quarantena en lloc de cridar `db.clear()` i perdre dades davant la corrupció d'IDB.

---

## 2026-08-28 — Inicialització del Llibre d'Obra
- **Què:** Creació del `LEDGER.md`, `tooling/preflight.mjs`, `.agents/skills/trellat/SKILL.md` i els hooks d'Antigravity.
- **Per què:** Per aturar la precipitació cognitiva de les IAs i complir amb el "Pas 0" de l'auditoria (La Porta de Pedra Seca).
- **Fitxers:** `.agents/LEDGER.md`, `.agents/skills/trellat/SKILL.md`, `tooling/preflight.mjs`, `.agents/hooks/verify.mjs`, `.agents/hooks.json`.
- **Risc:** Baix. (Per revertir-ho, es poden esborrar aquests fitxers i deshabilitar els hooks).


<!-- HASH: b02e6b762b54c75499ff08a587a322068b19afcaf96b7b4c03e899da65770e47 -->
```

### .agents/rules/00_BIOS_COGNITIU.md
```javascript
# BIOS Cognitiu de les Portes Mecàniques
# BIOS Cognitiu de les Portes Mecàniques

Aquest document compleix amb l'exigència R5 del `tooling/gates/tractor-registre.mjs` per garantir un entorn d'execució d'agents segur.

## Regles Transversals (Lleis Fonamentals)
1. **Llei de Trellat**: Les accions han de passar pel filtre del raonament abans de l'execució.
2. **Llei del Consell**: Si es col·labora amb membres del consell, no es poden ocultar dades (Zero-Ocultació).
3. **Llei de la Immutabilitat**: El Llibre d'Obra (LEDGER) mai no pot ser esborrat de manera automatitzada.

Aquest fitxer és l'ancoratge per al RAG i els sistemes de conformitat.

```
