# BUNDLE AUDITORIA RONDA 3 - SÓC DE POBLE

Aquest bundle conté el nucli estratègic Offline-First (backendPort, outbox, sincronitzador), l'arrel de l'embed, i les noves Portes Mecàniques (Skill Trellat, LEDGER i preflight).



--- FITXER: src/data/backendPort.js ---
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

/**
 * Permet a un host (com Sollutia) injectar la seua pròpia implementació
 * de backend, aïllant completament l'App de Supabase.
 */
export function setBackendImplementation(impl) {
  currentImpl = { ...currentImpl, ...impl };
}

export function getBackendImplementation() {
  return currentImpl;
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


--- FITXER: src/data/outbox.js ---
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

function tripCircuitBreaker() {
  if (purgant) return;            // no comptem els errors de la mateixa purga
  engineErrors += 1;
  if (engineErrors < LLINDAR_ERRORS) return;
  engineErrors = 0;
  purgant = true;
  purgaCua().finally(() => { purgant = false; });
}

/**
 * Disparador del Circuit Breaker. Buida NOMÉS la cua d'eixida.
 * Els snapshots són el contingut offline de la persona: no es toquen mai
 * automàticament.
 */
async function purgaCua() {
  try {
    const db = await obri();
    await transaccio(db, MAGATZEM, 'readwrite', (m) => m.clear());
    console.error('[OUTBOX] Circuit Breaker: cua buidada. Els snapshots es conserven.');
  } catch (err) {
    console.error('[OUTBOX] Circuit Breaker: buidatge fallit; es tanca la connexió.', err);
    await tancaConnexio();
  }
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
      tripCircuitBreaker();
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
      tripCircuitBreaker();
      rebutja(new Error(`IDB Vigilant: '${magatzem}' encallat ${VIGILANT_MS} ms`));
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
      tripCircuitBreaker();
      rebutja(t.error || new Error(`IDB error a '${magatzem}'`));
    });
    t.onabort = () => acaba(() => {
      tripCircuitBreaker();
      rebutja(t.error || new Error(`IDB abort a '${magatzem}'`));
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

export const uuid = () =>
  (crypto.randomUUID?.() ??
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`);

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


--- FITXER: src/data/sincronitzador.js ---
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


--- FITXER: src/PedraSecaEmbed.jsx ---
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
    if (window.__sdp_active_element && window.__sdp_active_element !== this) {
      console.warn('[PedraSeca] Trobada instància prèvia, aplicant Last-One-Wins.');
      if (typeof window.__sdp_active_element._forcaDesmuntatge === 'function') {
        window.__sdp_active_element._forcaDesmuntatge();
      }
    }
    window.__sdp_active_element = this;
    this._hasMountedReact = true;
    
    /* P0-2: cancel·la un desmuntatge pendent si tornem a entrar al DOM. */
    if (this._desmuntatge !== null) {
      cancelAnimationFrame(this._desmuntatge);
      clearTimeout(this._desmuntatgeTimeout);
      this._desmuntatge = null;
    }

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

    if (!this._root || this._desmuntatge !== null) return;
    
    const cleanup = () => {
      this._desmuntatge = null;
      if (this.isConnected) return; /* ha tornat: no toquem res */
      if (window.__sdp_active_element === this) {
        window.__sdp_active_element = null;
      }
      this._hasMountedReact = false;
      this._root?.unmount();
      this._root = null;
      if (this._punt) {
        this._punt.remove();
        this._punt = null;
      }
    };

    this._desmuntatge = requestAnimationFrame(cleanup);
    if (this._desmuntatgeTimeout !== undefined) {
      clearTimeout(this._desmuntatgeTimeout);
    }
    this._desmuntatgeTimeout = setTimeout(() => {
      if (this._desmuntatge !== null) {
        cancelAnimationFrame(this._desmuntatge);
        cleanup();
      }
    }, 500);
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


--- FITXER: src/app/AppDataContext.jsx ---
```javascript
import { createContext, useContext, useEffect, useMemo, useState, useRef } from 'react';
import {

  APP_SNAPSHOT_STORAGE_KEY,
  getDefaultUserId,
  getHasSupabaseConfig,
  SECTION_SUBMISSIONS_STORAGE_KEY,
  loadAppData,
  getRuntimeDataMode
} from '../data/backendPort.js';
import { normalizeSearchText, sortPinnedContent } from '../config/contentHelpers';
import { resolveAsset as baseResolveAsset } from '../config/assetResolver';
import { createTranslator, readStoredLanguage, writeStoredLanguage, normalizeLanguage } from '../config/i18n';
import { getVal } from '../config/storage.js';
import { readThemePreference, resolveTheme, writeThemePreference } from '../config/theme';
import { uuid, encua } from '../data/outbox.js';
import { buida, arrancaSincronitzador } from '../data/sincronitzador.js';

const AppStateContext = createContext(null);
const AppActionsContext = createContext(null);
const DATA_SYNC_STORAGE_KEYS = new Set([APP_SNAPSHOT_STORAGE_KEY, SECTION_SUBMISSIONS_STORAGE_KEY]);
const LANGUAGE_LOCALES = {
  ca: 'ca-ES',
  es: 'es-ES',
  en: 'en-GB',
  eu: 'eu-ES',
  gl: 'gl-ES'
};

const groupMediaTimeline = (items, t, locale) => {
  const groups = new Map();
  items.forEach((item) => {
    const key = item.created_at ? String(item.created_at).slice(0, 7) : 'sense-data';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  });
  return Array.from(groups.entries()).map(([key, groupItems]) => {
    const date = new Date(groupItems[0]?.created_at);
    return {
      key,
      label: Number.isNaN(date.getTime())
        ? t('common.noDate', 'Sense data')
        : date.toLocaleDateString(locale, { month: 'long', year: 'numeric' }),
      items: groupItems
    };
  });
};

const sortEvents = (items) =>
  [...items].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    const timeA = Number.isNaN(dateA.getTime()) ? 0 : dateA.getTime();
    const timeB = Number.isNaN(dateB.getTime()) ? 0 : dateB.getTime();
    return timeB - timeA;
  });

const buildSearchCollections = (data) => [
  ...data.agents,
  ...data.chatThreads,
  ...data.feedPosts,
  ...data.marketItems,
  ...data.events,
  ...data.towns
];

const buildPageCopy = (pages) =>
  Object.fromEntries(pages.map((page) => [page.key, { title: page.title, subtitle: page.subtitle, lead: page.lead, image: page.image, imageAlt: page.imageAlt, html: page.html }]));

const buildMessageMap = (messages) => {
  const map = {};
  for (const message of messages) {
    if (!map[message.threadId]) map[message.threadId] = [];
    map[message.threadId].push(message);
  }
  for (const threadId in map) {
    map[threadId].sort((a, b) => (a.createdAtTs || 0) - (b.createdAtTs || 0));
  }
  return map;
};

const buildFallbackMessages = (thread) => [
  {
    id: `${getDefaultUserId()}::${thread.id}::fallback-1`,
    ownerUserId: getDefaultUserId(),
    threadId: thread.id,
    messageId: 'fallback-1',
    createdAtTs: 0,
    text: `Hola, soc ${thread.name}.`,
    sender: 'other',
    time: 'Ara'
  },
  {
    id: `${getDefaultUserId()}::${thread.id}::fallback-2`,
    ownerUserId: getDefaultUserId(),
    threadId: thread.id,
    messageId: 'fallback-2',
    createdAtTs: 1,
    text: thread.message || thread.role || 'Vols parlar una estona?',
    sender: 'other',
    time: 'Ara'
  }
];

const appendUniqueById = (items = [], item) => {
  if (!item) return items;
  const map = new Map(items.map((entry) => [String(entry.id), entry]));
  map.set(String(item.id), item);
  return Array.from(map.values());
};

export function AppDataProvider({ children, externalConfig = {} }) {
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [authTick, setAuthTick] = useState(0);
  const [language, setLanguage] = useState(() => {
    if (externalConfig?.language) return normalizeLanguage(externalConfig.language);
    if (typeof document !== 'undefined' && document.documentElement.lang) {
      const htmlLang = document.documentElement.lang.split('-')[0];
      if (['ca', 'es', 'en', 'eu', 'gl'].includes(htmlLang)) {
        return normalizeLanguage(htmlLang);
      }
    }
    return readStoredLanguage();
  });

  const [themePreference, setThemePreference] = useState(() => readThemePreference(externalConfig?.themeMode));
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemDark(mq.matches);
    const handler = (e) => setSystemDark(e.matches);
    mq.addEventListener('change', handler);

    const onAuthChange = () => setAuthTick(t => t + 1);
    window.addEventListener('sdp:auth-change', onAuthChange);

    return () => {
      mq.removeEventListener('change', handler);
      window.removeEventListener('sdp:auth-change', onAuthChange);
    };
  }, []);

  const themeMode = resolveTheme(themePreference === 'system' ? (systemDark ? 'dark' : 'light') : themePreference);

  const toggleTheme = () => {
    setThemePreference((prev) => {
      const currentResolved = resolveTheme(prev === 'system' ? (systemDark ? 'dark' : 'light') : prev);
      const next = currentResolved === 'dark' ? 'light' : 'dark';
      writeThemePreference(next);
      return next;
    });
  };

  const tenantId = externalConfig?.tenantId || 'default-tenant';
  const localUser = getVal('socdepoble-user');
  const userId = externalConfig?.user?.id || externalConfig?.userId || localUser?.id || getDefaultUserId();
  const channelNamespace = `sdp:${tenantId}:${userId}:v2`;
  
  // Stabilize externalConfig per evitar infinite re-renders sense usar JSON.stringify sencer que peta amb referències circulars
  const stableExternalConfig = useMemo(() => ({ ...externalConfig }), [
    externalConfig?.language,
    externalConfig?.themeMode,
    externalConfig?.tenantId,
    externalConfig?.userId,
    externalConfig?.basePath,
    externalConfig?.pluginUrl,
    externalConfig?.version,
    externalConfig?.manageDocumentHead,
    externalConfig?.supabaseUrl,
    externalConfig?.supabaseAnonKey,
    authTick
  ]);

  const broadcastChannelRef = useRef(null);
  const loadGenerationRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const myGen = ++loadGenerationRef.current;

    const loadData = async () => {
      try {
        const data = await loadAppData(userId, { ...externalConfig, signal: controller.signal });
        if (cancelled || myGen !== loadGenerationRef.current) return;
        setRawData(data);
        setStatus('ready');
        setError(null);
      } catch (loadError) {
        if (cancelled) return;
        setError(loadError);
        setStatus('error');
      }
    };

    loadData();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [stableExternalConfig]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    let cancelled = false;
    let channel = null;
    let refreshTimeout = null;
    const controller = new AbortController();
    
    const refreshData = async () => {
      const myGen = ++loadGenerationRef.current;
      try {
        const data = await loadAppData(userId, { ...stableExternalConfig, signal: controller.signal });
        if (cancelled || myGen !== loadGenerationRef.current) return;
        setRawData(data);
        setStatus('ready');
      } catch {
        if (cancelled) return;
      }
    };

    const attemptRefresh = () => {
      if (refreshTimeout) clearTimeout(refreshTimeout);
      if (document.hidden) return; // Thundering Herd: visibility gate
      
      const jitter = Math.floor(Math.random() * 200) + 50;
      refreshTimeout = setTimeout(() => {
        refreshData();
      }, jitter);
    };

    const onStorage = (event) => {
      if (!event?.key || !DATA_SYNC_STORAGE_KEYS.has(event.key)) return;
      attemptRefresh();
    };

    const onVisibilityChange = () => {
      if (!document.hidden) attemptRefresh();
    };

    const onManualRefresh = () => attemptRefresh();

    window.addEventListener('storage', onStorage);
    window.addEventListener('sdp:refresh-data', onManualRefresh);
    document.addEventListener('visibilitychange', onVisibilityChange);

    if (typeof BroadcastChannel !== 'undefined') {
      channel = new BroadcastChannel(channelNamespace);
      broadcastChannelRef.current = channel;
      channel.addEventListener('message', (event) => {
        if (event?.data?.type !== 'content:updated') return;
        if (event?.data?.tenantId && event.data.tenantId !== tenantId) return;
        attemptRefresh();
      });
    }

    return () => {
      cancelled = true;
      controller.abort();
      if (refreshTimeout) clearTimeout(refreshTimeout);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('sdp:refresh-data', onManualRefresh);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      channel?.close();
      broadcastChannelRef.current = null;
    };
  }, [stableExternalConfig, channelNamespace, tenantId, userId]);

  /* P0-3: sense esta crida, `outbox.js` és una cua d'escriptura només:
     guarda els missatges i no els envia mai quan torna la cobertura. */
  useEffect(
    () => arrancaSincronitzador(stableExternalConfig),
    [stableExternalConfig]
  );

  useEffect(() => {
    writeStoredLanguage(language);
  }, [language]);

  const translator = useMemo(() => createTranslator(language), [language]);
  const locale = LANGUAGE_LOCALES[language] || 'ca-ES';

  const sortedFeedPosts = useMemo(() => rawData ? sortPinnedContent(rawData.feedPosts) : [], [rawData?.feedPosts]);
  const sortedMarketItems = useMemo(() => rawData ? sortPinnedContent(rawData.marketItems) : [], [rawData?.marketItems]);
  const sortedEvents = useMemo(() => rawData ? sortEvents(rawData.events) : [], [rawData?.events]);
  const featuredTowns = useMemo(() => rawData ? rawData.towns.slice(0, 6) : [], [rawData?.towns]);
  
  const sortedTowns = useMemo(() => {
    if (!rawData || !rawData.towns) return [];
    
    const townActivity = new Map();
    
    const processItem = (item) => {
      const townName = item.town_name || item.population;
      if (!townName) return;
      
      const itemTime = new Date(item.created_at || item.date).getTime();
      if (isNaN(itemTime)) return;
      
      const currentLatest = townActivity.get(townName) || 0;
      if (itemTime > currentLatest) {
        townActivity.set(townName, itemTime);
      }
    };
    
    (rawData.feedPosts || []).forEach(processItem);
    (rawData.marketItems || []).forEach(processItem);
    (rawData.events || []).forEach(processItem);
    
    const townEntries = rawData.towns.map(town => {
      const latestActivity = townActivity.get(town.title);
      const baseTime = new Date(town.created_at).getTime() || 0;
      const activityTime = latestActivity || baseTime;
      return { town, activityTime, latestActivity, baseTime };
    });

    return townEntries.sort((a, b) => b.activityTime - a.activityTime).map(({ town, latestActivity, baseTime }) => {
      const activityDate = latestActivity && latestActivity > baseTime ? new Date(latestActivity) : new Date(town.created_at);
      
      const dynamicTime = !isNaN(activityDate.getTime()) 
        ? activityDate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
        : town.time;
        
      const dynamicDate = !isNaN(activityDate.getTime()) 
        ? activityDate.toLocaleDateString(locale, { day: 'numeric', month: 'numeric', year: 'numeric' })
        : '';
        
      return {
        ...town,
        dynamic_time: dynamicTime,
        dynamic_date: dynamicDate
      };
    });
  }, [rawData, locale]);
  const mediaTimelineGroups = useMemo(() => rawData ? groupMediaTimeline(rawData.mediaItems, translator, locale) : [], [rawData?.mediaItems, translator, locale]);
  const pageCopy = useMemo(() => rawData ? buildPageCopy(rawData.pages) : {}, [rawData?.pages]);
  const pageDetailLookup = useMemo(() => rawData ? new Map(
    rawData.feedPosts.flatMap((item) => {
      const keys = [];
      if (item.slug) keys.push([String(item.slug), item]);
      if (item.id != null) keys.push([String(item.id), item]);
      return keys;
    })
  ) : new Map(), [rawData?.feedPosts]);
  const globalSearchItems = useMemo(() => rawData ? buildSearchCollections(rawData) : [], [
    rawData?.agents, rawData?.chatThreads, rawData?.feedPosts, rawData?.marketItems, rawData?.events, rawData?.towns
  ]);
  const chatMessagesByThread = useMemo(() => rawData ? buildMessageMap(rawData.chatMessages) : {}, [rawData?.chatMessages]);

  const stateValue = useMemo(() => {
    if (!rawData) {
      return {
        status,
        error,
        ownerUserId: getDefaultUserId(),
        hasSupabaseConfig: getHasSupabaseConfig(stableExternalConfig),
        dataMode: getRuntimeDataMode(stableExternalConfig),
        language,
        themeMode,
        t: translator,
        externalConfig: stableExternalConfig
      };
    }

    return {
      status,
      error,
      externalConfig: stableExternalConfig,
      ownerUserId: rawData.ownerUserId,
      hasSupabaseConfig: getHasSupabaseConfig(stableExternalConfig),
      dataMode: getRuntimeDataMode(stableExternalConfig),
      language,
      themeMode,
      t: translator,
      agents: rawData.agents,
      chatThreads: rawData.chatThreads,
      feedPosts: rawData.feedPosts,
      marketItems: rawData.marketItems,
      events: rawData.events,
      towns: rawData.towns,
      mediaItems: rawData.mediaItems,
      noteFolders: rawData.noteFolders,
      notes: rawData.notes,
      pages: rawData.pages,
      sectionSubmissions: rawData.sectionSubmissions || [],
      pageCopy,
      sortedFeedPosts,
      sortedMarketItems,
      sortedEvents,
      sortedTowns,
      featuredTowns,
      mediaTimelineGroups,
      globalSearchItems,
      pageDetailLookup
    };
  }, [
    error, language, rawData, status, stableExternalConfig,
    translator, sortedFeedPosts, sortedMarketItems, sortedEvents,
    sortedTowns, featuredTowns, mediaTimelineGroups, pageCopy, pageDetailLookup,
    globalSearchItems, themeMode
  ]);

  const actionsValue = useMemo(() => {
    const setLanguageFn = (code) => {
      setLanguage(code);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('sdp:language-changed', { detail: { language: code } }));
        if (typeof window.sdp_change_language === 'function') {
          window.sdp_change_language(code);
        }
      }
    };
    const normalizeSearchTextFn = normalizeSearchText;
    
    if (!rawData) {
      return {
        setLanguage: setLanguageFn,
        normalizeSearchText: normalizeSearchTextFn,
        getSectionItems: () => [],
        findSectionItem: () => null,
        getThreadMessages: () => [],
        sendChatMessage: async () => [],
        sendSectionSubmission: async () => null,
        resolveAsset: (path) => path,
        toggleTheme
      };
    }

    const getSectionItems = (sectionId) => {
      switch (sectionId) {
        case 'xat': return rawData.chatThreads;
        case 'mur': return rawData.feedPosts;
        case 'mercat': return rawData.marketItems;
        case 'events': return rawData.events;
        case 'pobles': return rawData.towns;
        case 'multimedia': return rawData.mediaItems;
        case 'notes': return rawData.notes;
        default: return [];
      }
    };

    const findSectionItem = (sectionId, itemId) =>
      getSectionItems(sectionId).find((item) => String(item.id) === String(itemId) || String(item.slug) === String(itemId)) || null;

    const sendChatMessage = async (thread, text) => {
      const nowTs = Date.now();
      const messageId = uuid();                       // ← UUID, no Date.now()
      const userMessage = {
        id: `${rawData.ownerUserId}::${thread.id}::${messageId}`,
        ownerUserId: rawData.ownerUserId,
        threadId: thread.id,
        messageId,
        createdAtTs: nowTs,
        text,
        sender: 'me',
        estatEnviament: 'pendent',                    // ← per a la marca visual
        time: new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
      };

      // 1r la pantalla. Sempre. Passe el que passe amb la xarxa.
      setRawData((current) => ({
        ...current,
        chatMessages: [...current.chatMessages, userMessage]
      }));

      // 2n el disc, amb el seu propi tallafocs.
      try {
        await encua({ id: userMessage.id, tipus: 'chat', carrega: userMessage });
      } catch (e) {
        console.error('[OUTBOX] escriptura fallida', e);
      }

      // 3r la xarxa, que ja no pot bloquejar res.
      buida(stableExternalConfig);

      try {
        broadcastChannelRef.current?.postMessage({ type: 'content:updated', tenantId });
      } catch (e) {
        // ignore
      }

      return [userMessage];
    };

    const getThreadMessages = (threadId, fallbackThread = null) => {
      const messages = chatMessagesByThread[threadId] || [];
      if (messages.length > 0) return messages;
      const thread = fallbackThread || rawData.chatThreads.find((entry) => entry.id === threadId);
      return thread ? buildFallbackMessages(thread) : [];
    };

    const sendSectionSubmission = async (submission) => {
      const nowTs = Date.now();
      const id = submission.id || uuid();
      const preparedSubmission = {
        ...submission,
        id,
        ownerUserId: rawData.ownerUserId,
        createdAt: new Date(nowTs).toISOString()
      };
      
      const item = preparedSubmission.payload || preparedSubmission;
      const sectionId = String(preparedSubmission.sectionId || item.sectionId || '').trim();

      setRawData((current) => {
        if (!current) return current;

        const next = {
          ...current,
          sectionSubmissions: appendUniqueById(current.sectionSubmissions || [], preparedSubmission)
        };

        if (sectionId === 'mur') {
          next.feedPosts = appendUniqueById(current.feedPosts || [], item);
        } else if (sectionId === 'mercat') {
          next.marketItems = appendUniqueById(current.marketItems || [], item);
        } else if (sectionId === 'events') {
          next.events = appendUniqueById(current.events || [], item);
        }

        return next;
      });

      // Z-Audit: 2n el disc (Outbox) amb el seu propi tallafocs
      try {
        await encua({ id, tipus: 'submission', payload: preparedSubmission });
      } catch (e) {
        console.error('[OUTBOX] escriptura fallida per a submission', e);
      }

      // 3r la xarxa
      buida(stableExternalConfig);
      
      try {
        broadcastChannelRef.current?.postMessage({ type: 'content:updated', tenantId });
      } catch (e) {
        // ignore
      }

      return preparedSubmission;
    };

    const resolveAsset = (path) => {
      return baseResolveAsset(
        path, 
        stableExternalConfig?.basePath, 
        stableExternalConfig?.pluginUrl, 
        stableExternalConfig?.version
      );
    };

    return {
      setLanguage: setLanguageFn,
      normalizeSearchText: normalizeSearchTextFn,
      getSectionItems,
      findSectionItem,
      getThreadMessages,
      sendChatMessage,
      sendSectionSubmission,
      resolveAsset,
      toggleTheme
    };
  }, [rawData, chatMessagesByThread, locale, stableExternalConfig, channelNamespace]);

  return (
    <AppStateContext.Provider value={stateValue}>
      <AppActionsContext.Provider value={actionsValue}>
        {children}
      </AppActionsContext.Provider>
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('useAppState dins de AppDataProvider.');
  return context;
}

export function useAppActions() {
  const context = useContext(AppActionsContext);
  if (!context) throw new Error('useAppActions dins de AppDataProvider.');
  return context;
}

export function useAppData() {
  const state = useContext(AppStateContext);
  const actions = useContext(AppActionsContext);
  if (!state || !actions) {
    throw new Error('useAppData dins de AppDataProvider.');
  }
  return { ...state, ...actions };
}

```


--- FITXER: src/config/app.js ---
```javascript
import logoLight from '../assets/ui/logo-socdepoble-rect-blanc.svg';
import logoDark from '../assets/ui/logo-socdepoble-rect-negre.svg';
import logoSquare from '../assets/ui/logo-socdepoble-cuadrat-verd.svg';

export const APP_NAME = 'Sóc de Poble';
export const APP_TAGLINE = 'Xarxa pública del poble.';
export const APP_DESCRIPTION = 'Portal públic del poble.';

export const THEME = {
  ink: '#111111',
  paper: '#f4efe7',
  surface: '#ffffff',
  accent: '#ff7300',
  accent2: '#00662e',
  soft: '#d8d2c8',
  dark: '#050505'
};

export const ASSET_PATHS = {
  logoHorizontalLight: logoLight,
  logoHorizontalDark: logoDark,
  logoSquare: logoSquare
};

```


--- FITXER: src/config/sections.js ---
```javascript
import { BrainCircuit, CalendarDays, FileText, GalleryVerticalEnd, LandPlot, MapPinned, Newspaper, NotebookPen, Palette, Route, ShieldCheck, ShoppingCart, Waves, MessageSquare, Wifi } from 'lucide-react';

export const SECTION_ORDER = ['xat', 'mur', 'mercat', 'pobles', 'multimedia', 'notes', 'dispositius', 'projecte', 'constitucio', 'disseny', 'skills', 'ia', 'roadmap', 'versions', 'legal'];

export const SECTIONS = [
  { id: 'xat', path: '/xat', label: 'Xat', shortLabel: 'Xat', icon: MessageSquare, kind: 'xat' },
  { id: 'mur', path: '/mur', label: 'Mur', shortLabel: 'Mur', icon: Newspaper, kind: 'mur' },
  { id: 'mercat', path: '/mercat', label: 'Mercat', shortLabel: 'Mercat', icon: ShoppingCart, kind: 'market' },
  { id: 'pobles', path: '/pobles', label: 'Pobles', shortLabel: 'Pobles', icon: LandPlot, kind: 'pobles' },
  { id: 'events', path: '/events', label: 'Events', shortLabel: 'Events', icon: CalendarDays, kind: 'events' },
  { id: 'mapa', path: '/mapa', label: 'Mapa', shortLabel: 'Mapa', icon: MapPinned, kind: 'mapa' },
  { id: 'multimedia', path: '/multimedia', label: 'Multimèdia', shortLabel: 'Media', icon: GalleryVerticalEnd, kind: 'multimedia' },
  { id: 'notes', path: '/notes', label: 'Notes', shortLabel: 'Notes', icon: NotebookPen, kind: 'notes' },
  { id: 'dispositius', path: '/dispositius', label: 'Dispositius', shortLabel: 'P2P', icon: Wifi, kind: 'infra' },
  { id: 'projecte', path: '/projecte', label: 'El projecte', shortLabel: 'Proj.', icon: FileText, kind: 'text', pageKey: 'projecte' },
  { id: 'constitucio', path: '/constitucio', label: 'Constitució', shortLabel: 'Lleis', icon: ShieldCheck, kind: 'text', pageKey: 'constitucio' },
  { id: 'disseny', path: '/disseny', label: 'Disseny', shortLabel: 'Disseny', icon: Palette, kind: 'text', pageKey: 'disseny' },
  { id: 'skills', path: '/skills', label: 'Skills', shortLabel: 'Skills', icon: Waves, kind: 'text', pageKey: 'skills' },
  { id: 'ia', path: '/ia', label: "L'ànima de la iaia", shortLabel: 'IAIA', icon: BrainCircuit, kind: 'text', pageKey: 'anima' },
  { id: 'roadmap', path: '/roadmap', label: 'Full de ruta', shortLabel: 'Ruta', icon: Route, kind: 'text', pageKey: 'roadmap' },
  { id: 'versions', path: '/versions', label: 'Versions', shortLabel: 'Versions', icon: FileText, kind: 'text', pageKey: 'versions' },
  { id: 'legal', path: '/legal', label: 'Legal i privacitat', shortLabel: 'Legal', icon: FileText, kind: 'text', pageKey: 'legal' }
];

export const DEFAULT_SECTION_PATH = '/chat';

```


--- FITXER: src/config/theme.js ---
```javascript
import { getVal, setVal } from './storage.js';

export const THEME_KEY = 'sdp-theme';
const LEGACY_KEYS = ['socdepoble-theme-mode'];
const VALID = new Set(['light', 'dark', 'system']);

const decode = (raw) => {
  return raw; // Text cru (dark/light), ja no fem JSON.parse
};

export function readThemePreference(configured) {
  if (VALID.has(configured)) return configured;
  
  if (typeof window === 'undefined' || typeof document === 'undefined') return 'light'; // Fallback

  // 1. Font de veritat: atribut HTML (Shadow DOM o arrel)
  let root = null;
  if (typeof document !== 'undefined') {
    root = document.querySelector('#soc-de-poble') || document.documentElement;
  }
  const htmlTheme = root ? root.getAttribute('data-theme') : null;
  if (htmlTheme && VALID.has(htmlTheme)) return htmlTheme;

  // 2. Fallback a LocalStorage (text cru)
  const raw = getVal(THEME_KEY);
  if (raw && VALID.has(raw)) return raw;

  return 'light'; // Fallback final
}

export function resolveTheme(preference) {
  if (preference !== 'system') return preference;
  if (typeof window === 'undefined') return 'light'; // Fallback per SSR
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function writeThemePreference(preference) {
  setVal(THEME_KEY, preference);
}

```


--- FITXER: src/config/storage.js ---
```javascript
const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

/**
 * CONTRACTE: estes tres funcions són SÍNCRONES per sempre.
 * Només identitat i preferències. Res que puga créixer.
 * Imposat per tooling/gates/tractor-persistencia.mjs (L1, L2).
 */
export const getVal = (key, fallback = null) => {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  } catch {
    return fallback;
  }
};

export const setVal = (key, value) => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota / serialization issues in demo mode.
  }
};

export const delVal = (key) => {
  if (!isBrowser) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore
  }
};

```


--- FITXER: src/config/i18n.js ---
```javascript
import { getVal, setVal } from './storage.js';

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const LANGUAGE_STORAGE_KEY = 'socdepoble-language';
export const DEFAULT_LANGUAGE = 'ca';

export const SUPPORTED_LANGUAGES = [
  { code: 'ca', name: 'Valencià' },
  { code: 'es', name: 'Castellà' },
  { code: 'en', name: 'English' },
  { code: 'eu', name: 'Euskara' },
  { code: 'gl', name: 'Galego' }
];

const SECTION_LABEL_KEYS = {
  control: { label: 'nav.control', short: 'nav.controlShort' },
  gestoria: { label: 'nav.gestoria', short: 'nav.gestoriaShort' },
  xat: { label: 'nav.xat', short: 'nav.xat' },
  mur: { label: 'nav.mur', short: 'nav.mur' },
  mercat: { label: 'nav.mercat', short: 'nav.mercat' },
  pobles: { label: 'nav.pobles', short: 'nav.pobles' },
  events: { label: 'nav.events', short: 'nav.events' },
  mapa: { label: 'nav.mapa', short: 'nav.mapa' },
  multimedia: { label: 'nav.multimedia', short: 'nav.multimedia' },
  notes: { label: 'nav.notes', short: 'nav.notes' },
  dispositius: { label: 'nav.dispositius', short: 'nav.dispositiusShort' },
  projecte: { label: 'nav.projecte', short: 'nav.projecteShort' },
  constitucio: { label: 'nav.constitucio', short: 'nav.constitucioShort' },
  disseny: { label: 'nav.disseny', short: 'nav.disseny' },
  skills: { label: 'nav.skills', short: 'nav.skills' },
  ia: { label: 'nav.ia', short: 'nav.ia' },
  roadmap: { label: 'nav.roadmap', short: 'nav.roadmapShort' },
  legal: { label: 'nav.legal', short: 'nav.legalShort' }
};

const TRANSLATIONS = {
  ca: {

    'pull.release': 'Deixa anar per actualitzar',
    'pull.pull': 'Estira per actualitzar',
    'section.poblacio.title': 'Població',
    'section.poblacio.subtitle': 'Dades de població',
    'section.poblacio.lead': 'Dades demogràfiques',
    'section.pobles.wikipedia_link': 'Enllaç a Wikipedia',
    'section.pobles.noResults': 'Cap poble trobat.',
    'section.realitat.title': 'Realitat',
    'section.realitat.subtitle': 'Dades i context de la realitat.',
    'section.search.label': 'Cerca',
    'nav.control': 'Control',
    'nav.controlShort': 'Ctrl',
    'section.control.kicker': 'Xarxa Neural',
    'section.control.title': 'Panell de Control',
    'section.control.subtitle': 'Node principal i accés a les eines d\'administració i gestió.',
    'section.control.meta1': 'Admin',
    'section.control.meta2': 'Sistema',
    'nav.gestoria': 'Gestoria',
    'nav.gestoriaShort': 'Gest',
    'section.gestoria.kicker': 'Administració',
    'section.gestoria.title': 'Gestoria de Poble',
    'section.gestoria.subtitle': 'Portal de Gestoria Interna i Tauler de Comandament.',
    'section.gestoria.meta1': 'Jarvis Torruà',
    'section.gestoria.meta2': 'Privat',
    'nav.xat': 'Xat',
    'nav.mur': 'Mur',
    'nav.mercat': 'Mercat',
    'nav.pobles': 'Pobles',
    'nav.events': 'Events',
    'nav.mapa': 'Mapa',
    'nav.multimedia': 'Multimèdia',
    'nav.notes': 'Notes',
    'nav.dispositius': 'Dispositius',
    'nav.dispositiusShort': 'P2P',
    'nav.projecte': 'El projecte',
    'nav.projecteShort': 'Proj.',
    'nav.constitucio': 'Constitució',
    'nav.constitucioShort': 'Lleis',
    'nav.disseny': 'Disseny',
    'nav.skills': 'Skills',
    'nav.ia': "L'ànima de la iaia",
    'nav.roadmap': 'Full de ruta',
    'nav.roadmapShort': 'Ruta',
    'nav.legal': 'Legal i privacitat',
    'nav.legalShort': 'Legal',
    'nav.connectar': 'Connectar',
    'nav.login': 'Login',
    'nav.idioma': 'Idioma',
    'nav.perfil': 'Perfil',
    'nav.cerca': 'Cerca',
    'nav.acces': 'Accés',
    'nav.tema': 'Tema',
    'nav.visor': 'Visor',
    'nav.idiomaTitle': 'Tria un idioma',
    'nav.idiomaSubtitle': 'Canvia l’idioma de la interfície i guarda la preferència al navegador.',
    'common.readMore': 'Llegir més',
    'common.showMore': 'Mostra més',
    'common.search': 'Cerca',
    'common.results': 'resultats',
    'common.visible': 'visibles',
    'common.noDate': 'Sense data',
    'common.noResults': 'Cap resultat.',
    'common.active': 'Actiu',
    'common.available': 'Disponible',
    'common.saved': 'Guardat',
    'common.currentLanguage': 'Idioma actual',
    'common.interfaceLanguage': 'Idioma de la interfície',
    'common.selectLanguage': 'Selecciona un idioma',
    'common.back': 'Torna',
    'app.tagline': 'Xarxa pública del poble.',
    'app.description': 'Portal públic del poble.',
    'topbar.language': 'Idioma',
    'topbar.access': 'Accés',
    'topbar.search': 'Cerca',
    'topbar.theme': 'Tema',
    'topbar.profile': 'Perfil',
    'topbar.viewer': 'Visor',
    'topbar.connect': 'Connectar',
    'loading.content': 'Carregant contingut del poble...',
    'section.xat.kicker': 'Xat públic',
    'section.xat.title': 'Converses i comunitat',
    'section.xat.subtitle': 'Obri converses amb la gent, els grups i els espais de la xarxa.',
    'section.xat.tab.xat': 'Xat',
    'section.xat.tab.gent': 'Gent',
    'section.xat.tab.grups': 'Grups',
    'section.xat.tab.empreses': 'Empreses',
    'section.xat.tab.institucions': 'Institucions',
    'section.xat.searchPlaceholder': 'Cerca xats, persones o grups...',
    'section.xat.composePlaceholder': 'Escriu un missatge...',
    'section.xat.send': 'Enviar',
    'section.xat.selected': 'Seleccionat',
    'section.xat.memberFallback': 'Membre de la comunitat',
    'section.mur.kicker': 'Mur',
    'section.mur.title': 'Publicacions recents',
    'section.mur.subtitle': 'Llig el mur públic amb les darreres publicacions del poble.',
    'section.mur.searchTitle': 'Cerca al mur',
    'section.mur.searchPlaceholder': 'Busca per títol, autor, poble o text...',
    'section.mur.results': 'resultats',
    'section.mur.loadMore': 'Mostra més',
    'section.mercat.kicker': 'Mercat',
    'section.mercat.title': 'Productes i intercanvis',
    'section.mercat.subtitle': 'Explora els productes i les ofertes disponibles.',
    'section.mercat.searchTitle': 'Cerca al mercat',
    'section.mercat.searchPlaceholder': 'Cerca productes, botigues o categories...',
    'section.mercat.results': 'resultats',
    'section.mercat.variations': 'variants',
    'section.search.kicker': 'Cercador',
    'section.search.title': 'Busca dins del contingut',
    'section.search.subtitle': 'Cerca persones, pobles, publicacions i pàgines en un sol lloc.',
    'section.search.searchTitle': 'Cerca',
    'section.search.searchPlaceholder': 'Cerca persones, pobles, posts...',
    'section.search.filter': 'Filtre global',
    'section.search.noResults': 'Cap resultat.',
    'section.search.globalMeta': 'Cerca global',
    'section.search.quickMeta': 'Ràpid',
    'section.search.unifiedMeta': 'Unificada',
    'section.search.resultLabel': 'Resultat',
    'section.profile.kicker': 'Perfil',
    'section.profile.title': 'Agents i persones',
    'section.profile.subtitle': 'Directori de persones, grups i agents del portal.',
    'section.profile.directory': 'Directori',
    'section.profile.more': 'Llegir més',
    'section.mur.feed': 'Feed original',
    'section.mur.posts': 'publicacions',
    'section.mur.comments': 'comentaris',
    'section.mur.likes': "m'agrada",
    'section.xat.options': 'Opcions de xat',
    'section.xat.selectConversation': 'Selecciona una conversa',
    'section.events.kicker': 'Events',
    'section.events.title': 'Calendari i sessions',
    'section.events.subtitle': 'Consulta els esdeveniments i activitats programades.',
    'section.events.searchTitle': 'Cerca d’esdeveniments',
    'section.events.searchPlaceholder': 'Cerca sessions, rituals, cites...',
    'section.events.results': 'resultats',
    'section.events.records': 'registres',
    'section.events.calendarMeta': 'Calendari',
    'section.events.listMeta': 'Llistat',
    'section.mapa.kicker': 'Mapa',
    'section.mapa.title': 'Mapa del territori',
    'section.mapa.subtitle': 'Vista geogràfica del projecte i dels seus punts destacats.',
    'section.mapa.head': 'Pols del territori',
    'section.mapa.records': 'registres',
    'section.mapa.publicNav': 'Navegació pública',
    'section.disseny.kicker': 'Disseny',
    'section.disseny.title': 'Sistema de Disseny Sóc de Poble',
    'section.disseny.subtitle': 'Arquitectura Pedra Seca per a interfícies clares i resistents',
    'section.disseny.workInProgress': 'Treball en Progrés',
    'section.disseny.note': 'Les següents seccions estan sent migrades cap al patró Slot per reduir el DOM_DEPTH.',
    'section.pobles.kicker': 'Pobles',
    'section.pobles.title': 'Nodes i territori',
    'section.pobles.subtitle': 'Explora els pobles i el seu context territorial.',
    'section.pobles.searchTitle': 'Cerca pobles',
    'section.pobles.searchPlaceholder': 'Cerca per nom, comarca o descripció...',
    'section.pobles.results': 'resultats',
    'section.pobles.territoryMeta': 'Territori',
    'section.multimedia.kicker': 'Multimèdia',
    'section.multimedia.title': 'Arxiu visual',
    'section.multimedia.subtitle': 'Galeria d’imatges i cronologia visual del projecte.',
    'section.multimedia.gallery': 'Galeria',
    'section.multimedia.grid': 'Quadrícula',
    'section.multimedia.timeline': 'Cronologia',
    'section.multimedia.open': 'Obrir',
    'section.multimedia.elements': 'elements',
    'section.multimedia.featuredFallback': 'Recurs visual destacat del projecte.',
    'section.notes.kicker': 'Notes',
    'section.notes.title': 'Quadern',
    'section.notes.subtitle': 'Notes i apunts del projecte organitzats per carpetes.',
    'section.notes.folders': 'Carpetes',
    'section.notes.list': 'Llista',
    'section.notes.editor': 'Editor',
    'section.notes.archive': 'Arxiu del Poble',
    'section.notes.categories': 'Categories',
    'section.notes.category.Trellat': 'Trellat',
    'section.notes.category.Patrimoni': 'Patrimoni',
    'section.notes.category.Dades': 'Dades',
    'section.notes.category.Social': 'Social',
    'section.notes.searchPlaceholder': 'Cerca al bancal...',
    'section.notes.back': 'Tornar',
    'section.notes.note': 'Nota',
    'section.notes.emptyPreview': 'Sense contingut...',
    'section.notes.open': 'Obre un solc',
    'section.notes.mobileTitle': 'Quadern',
    'section.notes.mobileFolders': 'Carpetes',
    'section.notes.mobileList': 'Llista',
    'section.notes.mobileEditor': 'Editor',
    'section.notes.categoryLabel': 'Categoria',
    'section.text.page': 'Pàgina',
    'section.text.content': 'Contingut',
    'section.text.text': 'Text',
    'section.detail.back': 'Torna',
    'section.detail.backToList': 'Tornar al llistat',
    'section.detail.previous': 'Anterior',
    'section.detail.next': 'Següent',
    'section.detail.invalidLink': 'Enllaç no vàlid',
    'section.detail.noFound.kicker': 'No trobat',
    'section.detail.noFound.title': 'Element no trobat',
    'section.detail.noFound.subtitle': 'L’enllaç no apunta a cap element existent.',
    'section.detail.mur.title': 'Mur',
    'section.detail.mur.label': 'Publicació',
    'section.detail.mur.itemTitle': 'Publicació',
    'section.detail.mur.author': 'Sóc de Poble',
    'section.detail.mur.town': 'La Torre de les Maçanes',
    'section.detail.mur.comments': 'comentaris',
    'section.detail.mur.likes': "m'agrada",
    'section.detail.mercat.title': 'Mercat',
    'section.detail.mercat.label': 'Producte',
    'section.detail.mercat.itemTitle': 'Producte',
    'section.detail.mercat.tag': 'Mercat',
    'section.detail.mercat.seller': 'Venda directa',
    'section.detail.events.title': 'Events',
    'section.detail.events.label': 'Esdeveniment',
    'section.detail.events.itemTitle': 'Esdeveniment',
    'section.detail.events.organisation': 'Organització',
    'section.detail.events.typeFallback': 'Esdeveniment',
    'section.detail.pobles.title': 'Pobles',
    'section.detail.pobles.label': 'Poble',
    'section.detail.pobles.itemTitle': 'Poble',
    'section.detail.multimedia.title': 'Multimèdia',
    'section.detail.multimedia.label': 'Element',
    'section.detail.multimedia.itemTitle': 'Element multimèdia',
    'section.detail.multimedia.mediaType': 'Media',
    'section.detail.multimedia.imageType': 'Imatge',
    'section.detail.notes.title': 'Notes',
    'section.detail.notes.label': 'Nota',
    'section.detail.notes.itemTitle': 'Nota',
    'section.detail.notes.folderFallback': 'General',
    'section.login.kicker': 'Accés',
    'section.login.title': 'Login, registre i Google',
    'section.login.subtitle': 'Accés al portal per a entrar, crear un compte o continuar amb Google.',
    'section.login.private': 'Accés privat',
    'section.login.heroTitle': 'El teu accés, en un sol lloc.',
    'section.login.heroText': 'Entra, crea el teu compte o continua amb Google segons el que et vaja millor.',
    'section.login.loginTitle': 'Entrar',
    'section.login.loginSubtitle': 'Accedeix al teu compte i recupera la teua sessió.',
    'section.login.loginEmail': 'Correu electrònic',
    'section.login.loginPassword': 'Contrasenya',
    'section.login.loginButton': 'Entrar',
    'section.login.placeholder.email': 'nom@exemple.com',
    'section.login.placeholder.name': 'Nom i cognoms',
    'section.login.placeholder.password': '••••••••',
    'section.login.error.empty': 'Ompli tots els camps.',
    'section.login.success.login': 'Sessió iniciada.',
    'section.login.success.register': 'Compte creat.',
    'section.myprofile.success': 'Perfil guardat.',
    'section.myprofile.error': 'Error guardant el perfil.',
    'section.myprofile.title': 'El teu perfil',
    'section.myprofile.subtitle': 'Gestiona les teues dades personals.',
    'section.login.placeholder.newPassword': 'Tria una clau',
    'section.login.registerTitle': 'Crear compte',
    'section.login.registerSubtitle': 'Obri un compte nou per a tindre el teu espai propi.',
    'section.login.registerName': 'Nom',
    'section.login.registerButton': 'Crear compte',
    'section.login.googleTitle': 'Accés amb Google',
    'section.login.googleSubtitle': 'Accés ràpid amb Google per a entrar en un clic.',
    'section.login.googleButton': 'Continuar amb Google',
    'section.login.googleNote': 'Opció pensada per a un accés més ràpid i còmode.',
    'section.login.meta.session': 'Sessió',
    'section.login.meta.oauth': 'OAuth',
    'section.login.meta.quick': 'Accés ràpid',
    'section.login.meta.account': 'Compte',
    'section.login.meta.google': 'Google',
    'section.login.summary.futureUser': 'Usuari futur',
    'section.login.summary.verifiableEmail': 'Correu verificable',
    'section.login.summary.protectedAccess': 'Accés protegit',
    'section.translations.kicker': 'Idioma',
    'section.translations.title': 'Traduccions i llengua',
    'section.translations.subtitle': 'Canvia l’idioma de la interfície i guarda la preferència al navegador.',
    'section.translations.meta': 'Preferències',
    'section.translations.status.active': 'Actiu',
    'section.translations.status.available': 'Disponible',
    'section.translations.current': 'Idioma actual',
    'section.translations.pick': 'Selecciona un idioma',
    'section.translations.saved': 'Guardat',
    'section.connectar.kicker': 'Connectar',
    'section.connectar.title': 'On vols continuar?',
    'section.connectar.subtitle': 'Tria l’espai on vols entrar i continua navegant.',
    'section.connectar.privacy': 'Privacitat de la connexió',
    'section.connectar.private': 'Privada',
    'section.connectar.public': 'Pública',
    'section.connectar.where': 'On vols connectar-ho?',
    'section.connectar.context': 'Etiquetes i context',
    'section.connectar.people': 'Persones i agents',
    'section.connectar.go': 'Anar a',
    'section.connectar.connect': 'Connectar a',
    'section.connectar.tagsPlaceholder': 'Afig una etiqueta lliure...',
    'section.connectar.add': 'Afegir',
    'section.connectar.remove': 'Eliminar',
    'section.connectar.tagState.private': 'Privada',
    'section.connectar.tagState.public': 'Pública',
    'section.connectar.area.xat': 'Obri una conversa amb la gent del poble.',
    'section.connectar.area.mur': 'Publica o revisa el mur públic.',
    'section.connectar.area.mercat': 'Explora productes i intercanvis.',
    'section.connectar.area.events': 'Mira sessions, cites i rituals.',
    'section.dispositius.kicker': 'Dispositius',
    'section.dispositius.title': 'Dispositius i connexions directes',
    'section.dispositius.subtitle': 'Descobrix instàncies obertes del portal, llança una connexió i envia missatges directes des d’esta mateixa pantalla.',
    'error.loadPortal': "No s'ha pogut carregar el portal"
  },
  es: {

    'pull.release': 'Deixa anar per actualitzar',
    'pull.pull': 'Estira per actualitzar',
    'section.poblacio.title': 'Població',
    'section.poblacio.subtitle': 'Dades de població',
    'section.poblacio.lead': 'Dades demogràfiques',
    'section.pobles.wikipedia_link': 'Enllaç a Wikipedia',
    'section.pobles.noResults': 'Cap poble trobat.',
    'section.realitat.title': 'Realitat',
    'section.realitat.subtitle': 'Dades i context de la realitat.',
    'section.search.label': 'Cerca',
    'nav.control': 'Control',
    'nav.controlShort': 'Ctrl',
    'section.control.kicker': 'Red Neuronal',
    'section.control.title': 'Panel de Control',
    'section.control.subtitle': 'Nodo principal y acceso a las herramientas de administración y gestión.',
    'section.control.meta1': 'Admin',
    'section.control.meta2': 'Sistema',
    'nav.gestoria': 'Gestoría',
    'nav.gestoriaShort': 'Gest',
    'section.gestoria.kicker': 'Administración',
    'section.gestoria.title': 'Gestoría de Pueblo',
    'section.gestoria.subtitle': 'Portal de Gestoría Interna y Panel de Mando.',
    'section.gestoria.meta1': 'Jarvis Torruà',
    'section.gestoria.meta2': 'Privado',
    'nav.xat': 'Chat',
    'nav.mur': 'Muro',
    'nav.mercat': 'Mercado',
    'nav.pobles': 'Pueblos',
    'nav.events': 'Eventos',
    'nav.mapa': 'Mapa',
    'nav.multimedia': 'Multimedia',
    'nav.notes': 'Notas',
    'nav.dispositius': 'Dispositivos',
    'nav.dispositiusShort': 'P2P',
    'nav.projecte': 'El proyecto',
    'nav.projecteShort': 'Proj.',
    'nav.constitucio': 'Constitución',
    'nav.constitucioShort': 'Leyes',
    'nav.disseny': 'Diseño',
    'nav.skills': 'Skills',
    'nav.ia': 'El alma de la iaia',
    'nav.roadmap': 'Hoja de ruta',
    'nav.roadmapShort': 'Ruta',
    'nav.legal': 'Legal y privacidad',
    'nav.legalShort': 'Legal',
    'nav.connectar': 'Conectar',
    'nav.login': 'Login',
    'nav.idioma': 'Idioma',
    'nav.perfil': 'Perfil',
    'nav.cerca': 'Buscar',
    'nav.acces': 'Acceso',
    'nav.tema': 'Tema',
    'nav.visor': 'Visor',
    'nav.idiomaTitle': 'Elige un idioma',
    'nav.idiomaSubtitle': 'Cambia el idioma de la interfaz y guarda la preferencia en el navegador.',
    'common.readMore': 'Leer más',
    'common.showMore': 'Mostrar más',
    'common.search': 'Buscar',
    'common.results': 'resultados',
    'common.visible': 'visibles',
    'common.noDate': 'Sin fecha',
    'common.noResults': 'Ningún resultado.',
    'common.active': 'Activo',
    'common.available': 'Disponible',
    'common.saved': 'Guardado',
    'common.currentLanguage': 'Idioma actual',
    'common.interfaceLanguage': 'Idioma de la interfaz',
    'common.selectLanguage': 'Selecciona un idioma',
    'common.back': 'Volver',
    'app.tagline': 'Red pública del pueblo.',
    'app.description': 'Portal público del pueblo.',
    'topbar.language': 'Idioma',
    'topbar.access': 'Acceso',
    'topbar.search': 'Buscar',
    'topbar.theme': 'Tema',
    'topbar.profile': 'Perfil',
    'topbar.viewer': 'Visor',
    'topbar.connect': 'Conectar',
    'loading.content': 'Cargando contenido del pueblo...',
    'section.xat.kicker': 'Chat público',
    'section.xat.title': 'Conversaciones y comunidad',
    'section.xat.subtitle': 'Abre conversaciones con gente, grupos y espacios de la red.',
    'section.xat.tab.xat': 'Chat',
    'section.xat.tab.gent': 'Gente',
    'section.xat.tab.grups': 'Grupos',
    'section.xat.tab.empreses': 'Empresas',
    'section.xat.tab.institucions': 'Instituciones',
    'section.xat.searchPlaceholder': 'Busca chats, personas o grupos...',
    'section.xat.composePlaceholder': 'Escribe un mensaje...',
    'section.xat.send': 'Enviar',
    'section.xat.selected': 'Seleccionado',
    'section.xat.memberFallback': 'Miembro de la comunidad',
    'section.mur.kicker': 'Muro',
    'section.mur.title': 'Publicaciones recientes',
    'section.mur.subtitle': 'Lee el muro público con las últimas publicaciones del pueblo.',
    'section.mur.searchTitle': 'Buscar en el muro',
    'section.mur.searchPlaceholder': 'Busca por título, autor, pueblo o texto...',
    'section.mur.results': 'resultados',
    'section.mur.loadMore': 'Mostrar más',
    'section.mercat.kicker': 'Mercado',
    'section.mercat.title': 'Productos e intercambios',
    'section.mercat.subtitle': 'Explora los productos y las ofertas disponibles.',
    'section.mercat.searchTitle': 'Buscar en el mercado',
    'section.mercat.searchPlaceholder': 'Busca productos, tiendas o categorías...',
    'section.mercat.results': 'resultados',
    'section.mercat.variations': 'variantes',
    'section.search.kicker': 'Buscador',
    'section.search.title': 'Busca dentro del contenido',
    'section.search.subtitle': 'Busca personas, pueblos, publicaciones y páginas en un solo lugar.',
    'section.search.searchTitle': 'Buscar',
    'section.search.searchPlaceholder': 'Busca personas, pueblos, posts...',
    'section.search.filter': 'Filtro global',
    'section.search.noResults': 'Ningún resultado.',
    'section.search.globalMeta': 'Búsqueda global',
    'section.search.quickMeta': 'Rápido',
    'section.search.unifiedMeta': 'Unificada',
    'section.search.resultLabel': 'Resultado',
    'section.profile.kicker': 'Perfil',
    'section.profile.title': 'Agentes y personas',
    'section.profile.subtitle': 'Directorio de personas, grupos y agentes del portal.',
    'section.profile.directory': 'Directorio',
    'section.profile.more': 'Leer más',
    'section.mur.feed': 'Feed original',
    'section.mur.posts': 'publicaciones',
    'section.mur.comments': 'comentarios',
    'section.mur.likes': 'me gusta',
    'section.xat.options': 'Opciones de chat',
    'section.xat.selectConversation': 'Selecciona una conversación',
    'section.events.kicker': 'Eventos',
    'section.events.title': 'Calendario y sesiones',
    'section.events.subtitle': 'Consulta los eventos y actividades programadas.',
    'section.events.searchTitle': 'Buscar eventos',
    'section.events.searchPlaceholder': 'Busca sesiones, rituales, citas...',
    'section.events.results': 'resultados',
    'section.events.records': 'registros',
    'section.events.calendarMeta': 'Calendario',
    'section.events.listMeta': 'Listado',
    'section.mapa.kicker': 'Mapa',
    'section.mapa.title': 'Mapa del territorio',
    'section.mapa.subtitle': 'Vista geográfica del proyecto y de sus puntos destacados.',
    'section.mapa.head': 'Pulsos del territorio',
    'section.mapa.records': 'registros',
    'section.mapa.publicNav': 'Navegación pública',
    'section.disseny.kicker': 'Diseño',
    'section.disseny.title': 'Sistema de Diseño Sóc de Poble',
    'section.disseny.subtitle': 'Arquitectura Piedra Seca para interfaces claras y resistentes.',
    'section.disseny.workInProgress': 'Trabajo en Progreso',
    'section.disseny.note': 'Las siguientes secciones están siendo migradas al patrón Slot para reducir el DOM_DEPTH.',
    'section.pobles.kicker': 'Pueblos',
    'section.pobles.title': 'Nodos y territorio',
    'section.pobles.subtitle': 'Explora los pueblos y su contexto territorial.',
    'section.pobles.searchTitle': 'Buscar pueblos',
    'section.pobles.searchPlaceholder': 'Busca por nombre, comarca o descripción...',
    'section.pobles.results': 'resultados',
    'section.pobles.territoryMeta': 'Territorio',
    'section.multimedia.kicker': 'Multimedia',
    'section.multimedia.title': 'Archivo visual',
    'section.multimedia.subtitle': 'Galería de imágenes y cronología visual del proyecto.',
    'section.multimedia.gallery': 'Galería',
    'section.multimedia.grid': 'Cuadrícula',
    'section.multimedia.timeline': 'Cronología',
    'section.multimedia.open': 'Abrir',
    'section.multimedia.elements': 'elementos',
    'section.multimedia.featuredFallback': 'Recurso visual destacado del proyecto.',
    'section.notes.kicker': 'Notas',
    'section.notes.title': 'Cuaderno',
    'section.notes.subtitle': 'Notas y apuntes del proyecto organizados por carpetas.',
    'section.notes.folders': 'Carpetas',
    'section.notes.list': 'Lista',
    'section.notes.editor': 'Editor',
    'section.notes.archive': 'Archivo del Pueblo',
    'section.notes.categories': 'Categorías',
    'section.notes.category.Trellat': 'Trellat',
    'section.notes.category.Patrimoni': 'Patrimonio',
    'section.notes.category.Dades': 'Datos',
    'section.notes.category.Social': 'Social',
    'section.notes.searchPlaceholder': 'Busca en el bancal...',
    'section.notes.back': 'Volver',
    'section.notes.note': 'Nota',
    'section.notes.emptyPreview': 'Sin contenido...',
    'section.notes.open': 'Abre un surco',
    'section.notes.mobileTitle': 'Cuaderno',
    'section.notes.mobileFolders': 'Carpetas',
    'section.notes.mobileList': 'Lista',
    'section.notes.mobileEditor': 'Editor',
    'section.notes.categoryLabel': 'Categoría',
    'section.text.page': 'Página',
    'section.text.content': 'Contenido',
    'section.text.text': 'Texto',
    'section.detail.back': 'Volver',
    'section.detail.backToList': 'Volver al listado',
    'section.detail.previous': 'Anterior',
    'section.detail.next': 'Siguiente',
    'section.detail.invalidLink': 'Enlace no válido',
    'section.detail.noFound.kicker': 'No encontrado',
    'section.detail.noFound.title': 'Elemento no encontrado',
    'section.detail.noFound.subtitle': 'El enlace no apunta a ningún elemento existente.',
    'section.detail.mur.title': 'Muro',
    'section.detail.mur.label': 'Publicación',
    'section.detail.mur.itemTitle': 'Publicación',
    'section.detail.mur.author': 'Sóc de Poble',
    'section.detail.mur.town': 'La Torre de les Maçanes',
    'section.detail.mur.comments': 'comentarios',
    'section.detail.mur.likes': 'me gusta',
    'section.detail.mercat.title': 'Mercado',
    'section.detail.mercat.label': 'Producto',
    'section.detail.mercat.itemTitle': 'Producto',
    'section.detail.mercat.tag': 'Mercado',
    'section.detail.mercat.seller': 'Venta directa',
    'section.detail.events.title': 'Eventos',
    'section.detail.events.label': 'Evento',
    'section.detail.events.itemTitle': 'Evento',
    'section.detail.events.organisation': 'Organización',
    'section.detail.events.typeFallback': 'Evento',
    'section.detail.pobles.title': 'Pueblos',
    'section.detail.pobles.label': 'Pueblo',
    'section.detail.pobles.itemTitle': 'Pueblo',
    'section.detail.multimedia.title': 'Multimedia',
    'section.detail.multimedia.label': 'Elemento',
    'section.detail.multimedia.itemTitle': 'Elemento multimedia',
    'section.detail.multimedia.mediaType': 'Media',
    'section.detail.multimedia.imageType': 'Imagen',
    'section.detail.notes.title': 'Notas',
    'section.detail.notes.label': 'Nota',
    'section.detail.notes.itemTitle': 'Nota',
    'section.detail.notes.folderFallback': 'General',
    'section.login.kicker': 'Acceso',
    'section.login.title': 'Login, registro y Google',
    'section.login.subtitle': 'Acceso al portal para entrar, crear una cuenta o continuar con Google.',
    'section.login.private': 'Acceso privado',
    'section.login.heroTitle': 'Tu acceso, en un solo sitio.',
    'section.login.heroText': 'Entra, crea tu cuenta o continúa con Google según te vaya mejor.',
    'section.login.loginTitle': 'Entrar',
    'section.login.loginSubtitle': 'Accede a tu cuenta y recupera tu sesión.',
    'section.login.loginEmail': 'Correo electrónico',
    'section.login.loginPassword': 'Contraseña',
    'section.login.loginButton': 'Entrar',
    'section.login.placeholder.email': 'nombre@ejemplo.com',
    'section.login.placeholder.name': 'Nombre y apellidos',
    'section.login.placeholder.password': '••••••••',
    'section.login.error.empty': 'Rellena todos los campos.',
    'section.login.success.login': 'Sesión iniciada.',
    'section.login.success.register': 'Cuenta creada.',
    'section.myprofile.success': 'Perfil guardado.',
    'section.myprofile.error': 'Error guardando perfil.',
    'section.myprofile.title': 'Tu perfil',
    'section.myprofile.subtitle': 'Gestiona tus datos.',
    'section.login.placeholder.newPassword': 'Elige una clave',
    'section.login.registerTitle': 'Crear cuenta',
    'section.login.registerSubtitle': 'Abre una cuenta nueva para tener tu espacio propio.',
    'section.login.registerName': 'Nombre',
    'section.login.registerButton': 'Crear cuenta',
    'section.login.googleTitle': 'Acceso con Google',
    'section.login.googleSubtitle': 'Acceso rápido con Google para entrar con un clic.',
    'section.login.googleButton': 'Continuar con Google',
    'section.login.googleNote': 'Opción pensada para un acceso más rápido y cómodo.',
    'section.login.meta.session': 'Sesión',
    'section.login.meta.oauth': 'OAuth',
    'section.login.meta.quick': 'Acceso rápido',
    'section.login.meta.account': 'Cuenta',
    'section.login.meta.google': 'Google',
    'section.login.summary.futureUser': 'Usuario futuro',
    'section.login.summary.verifiableEmail': 'Correo verificable',
    'section.login.summary.protectedAccess': 'Acceso protegido',
    'section.translations.kicker': 'Idioma',
    'section.translations.title': 'Traducciones y lengua',
    'section.translations.subtitle': 'Cambia el idioma de la interfaz y guarda la preferencia en el navegador.',
    'section.translations.meta': 'Preferencias',
    'section.translations.status.active': 'Activo',
    'section.translations.status.available': 'Disponible',
    'section.translations.current': 'Idioma actual',
    'section.translations.pick': 'Selecciona un idioma',
    'section.translations.saved': 'Guardado',
    'section.connectar.kicker': 'Conectar',
    'section.connectar.title': '¿Dónde quieres seguir?',
    'section.connectar.subtitle': 'Elige el espacio donde quieres entrar y sigue navegando.',
    'section.connectar.privacy': 'Privacidad de la conexión',
    'section.connectar.private': 'Privada',
    'section.connectar.public': 'Pública',
    'section.connectar.where': '¿Dónde quieres conectarlo?',
    'section.connectar.context': 'Etiquetas y contexto',
    'section.connectar.people': 'Personas y agentes',
    'section.connectar.go': 'Ir a',
    'section.connectar.connect': 'Conectar a',
    'section.connectar.tagsPlaceholder': 'Añade una etiqueta libre...',
    'section.connectar.add': 'Añadir',
    'section.connectar.remove': 'Eliminar',
    'section.connectar.tagState.private': 'Privada',
    'section.connectar.tagState.public': 'Pública',
    'section.connectar.area.xat': 'Abre una conversación con la gente del pueblo.',
    'section.connectar.area.mur': 'Publica o revisa el muro público.',
    'section.connectar.area.mercat': 'Explora productos e intercambios.',
    'section.connectar.area.events': 'Mira sesiones, citas y rituales.',
    'section.dispositius.kicker': 'Dispositivos',
    'section.dispositius.title': 'Dispositivos y conexiones directas',
    'section.dispositius.subtitle': 'Descubre instancias abiertas del portal, lanza una conexión y envía mensajes directos desde esta misma pantalla.',
    'error.loadPortal': 'No se ha podido cargar el portal'
  },
  en: {

    'pull.release': 'Deixa anar per actualitzar',
    'pull.pull': 'Estira per actualitzar',
    'section.poblacio.title': 'Població',
    'section.poblacio.subtitle': 'Dades de població',
    'section.poblacio.lead': 'Dades demogràfiques',
    'section.pobles.wikipedia_link': 'Enllaç a Wikipedia',
    'section.pobles.noResults': 'Cap poble trobat.',
    'section.realitat.title': 'Realitat',
    'section.realitat.subtitle': 'Dades i context de la realitat.',
    'section.search.label': 'Cerca',
    'nav.control': 'Control',
    'nav.controlShort': 'Ctrl',
    'section.control.kicker': 'Neural Network',
    'section.control.title': 'Control Panel',
    'section.control.subtitle': 'Main node and access to administration and management tools.',
    'section.control.meta1': 'Admin',
    'section.control.meta2': 'System',
    'nav.gestoria': 'Management',
    'nav.gestoriaShort': 'Mgmt',
    'section.gestoria.kicker': 'Administration',
    'section.gestoria.title': 'Town Management',
    'section.gestoria.subtitle': 'Internal Management Portal and Dashboard.',
    'section.gestoria.meta1': 'Jarvis Torruà',
    'section.gestoria.meta2': 'Private',
    'nav.xat': 'Chat',
    'nav.mur': 'Wall',
    'nav.mercat': 'Market',
    'nav.pobles': 'Towns',
    'nav.events': 'Events',
    'nav.mapa': 'Map',
    'nav.multimedia': 'Media',
    'nav.notes': 'Notes',
    'nav.dispositius': 'Devices',
    'nav.dispositiusShort': 'P2P',
    'nav.projecte': 'Project',
    'nav.projecteShort': 'Proj.',
    'nav.constitucio': 'Constitution',
    'nav.constitucioShort': 'Laws',
    'nav.disseny': 'Design',
    'nav.skills': 'Skills',
    'nav.ia': 'The iaia soul',
    'nav.roadmap': 'Roadmap',
    'nav.roadmapShort': 'Roadmap',
    'nav.legal': 'Legal & privacy',
    'nav.legalShort': 'Legal',
    'nav.connectar': 'Connect',
    'nav.login': 'Login',
    'nav.idioma': 'Language',
    'nav.perfil': 'Profile',
    'nav.cerca': 'Search',
    'nav.acces': 'Access',
    'nav.tema': 'Theme',
    'nav.visor': 'Viewer',
    'nav.idiomaTitle': 'Choose a language',
    'nav.idiomaSubtitle': 'Change the interface language and save the preference in the browser.',
    'common.readMore': 'Read more',
    'common.showMore': 'Show more',
    'common.search': 'Search',
    'common.results': 'results',
    'common.visible': 'visible',
    'common.noDate': 'No date',
    'common.noResults': 'No results.',
    'common.active': 'Active',
    'common.available': 'Available',
    'common.saved': 'Saved',
    'common.currentLanguage': 'Current language',
    'common.interfaceLanguage': 'Interface language',
    'common.selectLanguage': 'Select a language',
    'common.back': 'Back',
    'app.tagline': 'Public village network.',
    'app.description': 'Public village portal.',
    'topbar.language': 'Language',
    'topbar.access': 'Access',
    'topbar.search': 'Search',
    'topbar.theme': 'Theme',
    'topbar.profile': 'Profile',
    'topbar.viewer': 'Viewer',
    'topbar.connect': 'Connect',
    'section.dispositius.kicker': 'Devices',
    'section.dispositius.title': 'Devices and direct connections',
    'section.dispositius.subtitle': 'Discover open portal instances, start a connection and send direct messages from this same screen.',
    'loading.content': 'Loading village content...',
    'section.xat.kicker': 'Public chat',
    'section.xat.title': 'Conversations and community',
    'section.xat.subtitle': 'Open conversations with people, groups and spaces in the network.',
    'section.xat.tab.xat': 'Chat',
    'section.xat.tab.gent': 'People',
    'section.xat.tab.grups': 'Groups',
    'section.xat.tab.empreses': 'Companies',
    'section.xat.tab.institucions': 'Institutions',
    'section.xat.searchPlaceholder': 'Search chats, people or groups...',
    'section.xat.composePlaceholder': 'Write a message...',
    'section.xat.send': 'Send',
    'section.xat.selected': 'Selected',
    'section.xat.memberFallback': 'Community member',
    'section.mur.kicker': 'Wall',
    'section.mur.title': 'Recent posts',
    'section.mur.subtitle': 'Read the public wall with the latest village posts.',
    'section.mur.searchTitle': 'Search the wall',
    'section.mur.searchPlaceholder': 'Search by title, author, town or text...',
    'section.mur.results': 'results',
    'section.mur.loadMore': 'Show more',
    'section.mercat.kicker': 'Market',
    'section.mercat.title': 'Products and exchanges',
    'section.mercat.subtitle': 'Explore available products and offers.',
    'section.mercat.searchTitle': 'Search the market',
    'section.mercat.searchPlaceholder': 'Search products, shops or categories...',
    'section.mercat.results': 'results',
    'section.mercat.variations': 'variants',
    'section.search.kicker': 'Search',
    'section.search.title': 'Search inside the content',
    'section.search.subtitle': 'Search people, towns, posts and pages in one place.',
    'section.search.searchTitle': 'Search',
    'section.search.searchPlaceholder': 'Search people, towns, posts...',
    'section.search.filter': 'Global filter',
    'section.search.noResults': 'No results.',
    'section.search.globalMeta': 'Global search',
    'section.search.quickMeta': 'Fast',
    'section.search.unifiedMeta': 'Unified',
    'section.search.resultLabel': 'Result',
    'section.profile.kicker': 'Profile',
    'section.profile.title': 'Agents and people',
    'section.profile.subtitle': 'Directory of people, groups and portal agents.',
    'section.profile.directory': 'Directory',
    'section.profile.more': 'Read more',
    'section.mur.feed': 'Original feed',
    'section.mur.posts': 'posts',
    'section.mur.comments': 'comments',
    'section.mur.likes': 'likes',
    'section.xat.options': 'Chat options',
    'section.xat.selectConversation': 'Select a conversation',
    'section.events.kicker': 'Events',
    'section.events.title': 'Calendar and sessions',
    'section.events.subtitle': 'Check scheduled events and activities.',
    'section.events.searchTitle': 'Search events',
    'section.events.searchPlaceholder': 'Search sessions, rituals, dates...',
    'section.events.results': 'results',
    'section.events.records': 'records',
    'section.events.calendarMeta': 'Calendar',
    'section.events.listMeta': 'List',
    'section.mapa.kicker': 'Map',
    'section.mapa.title': 'Territory map',
    'section.mapa.subtitle': 'Geographic view of the project and its highlighted points.',
    'section.mapa.head': 'Territory pulses',
    'section.mapa.records': 'records',
    'section.mapa.publicNav': 'Public navigation',
    'section.disseny.kicker': 'Design',
    'section.disseny.title': 'Sóc de Poble Design System',
    'section.disseny.subtitle': 'Dry-stone architecture for clear, resilient interfaces.',
    'section.disseny.workInProgress': 'Work in Progress',
    'section.disseny.note': 'The following sections are being migrated to the Slot pattern to reduce DOM_DEPTH.',
    'section.pobles.kicker': 'Towns',
    'section.pobles.title': 'Nodes and territory',
    'section.pobles.subtitle': 'Explore the towns and their territorial context.',
    'section.pobles.searchTitle': 'Search towns',
    'section.pobles.searchPlaceholder': 'Search by name, region or description...',
    'section.pobles.results': 'results',
    'section.pobles.territoryMeta': 'Territory',
    'section.multimedia.kicker': 'Media',
    'section.multimedia.title': 'Visual archive',
    'section.multimedia.subtitle': 'Image gallery and visual timeline of the project.',
    'section.multimedia.gallery': 'Gallery',
    'section.multimedia.grid': 'Grid',
    'section.multimedia.timeline': 'Timeline',
    'section.multimedia.open': 'Open',
    'section.multimedia.elements': 'items',
    'section.multimedia.featuredFallback': 'Highlighted visual resource from the project.',
    'section.notes.kicker': 'Notes',
    'section.notes.title': 'Notebook',
    'section.notes.subtitle': 'Project notes and drafts organized by folders.',
    'section.notes.folders': 'Folders',
    'section.notes.list': 'List',
    'section.notes.editor': 'Editor',
    'section.notes.archive': 'Village archive',
    'section.notes.categories': 'Categories',
    'section.notes.category.Trellat': 'Trellat',
    'section.notes.category.Patrimoni': 'Heritage',
    'section.notes.category.Dades': 'Data',
    'section.notes.category.Social': 'Social',
    'section.notes.searchPlaceholder': 'Search the bancal...',
    'section.notes.back': 'Back',
    'section.notes.note': 'Note',
    'section.notes.emptyPreview': 'No content...',
    'section.notes.open': 'Open a furrow',
    'section.notes.mobileTitle': 'Notebook',
    'section.notes.mobileFolders': 'Folders',
    'section.notes.mobileList': 'List',
    'section.notes.mobileEditor': 'Editor',
    'section.notes.categoryLabel': 'Category',
    'section.text.page': 'Page',
    'section.text.content': 'Content',
    'section.text.text': 'Text',
    'section.detail.back': 'Back',
    'section.detail.backToList': 'Back to list',
    'section.detail.previous': 'Previous',
    'section.detail.next': 'Next',
    'section.detail.invalidLink': 'Invalid link',
    'section.detail.noFound.kicker': 'Not found',
    'section.detail.noFound.title': 'Item not found',
    'section.detail.noFound.subtitle': 'The link does not point to any existing item.',
    'section.detail.mur.title': 'Wall',
    'section.detail.mur.label': 'Post',
    'section.detail.mur.itemTitle': 'Post',
    'section.detail.mur.author': 'Sóc de Poble',
    'section.detail.mur.town': 'La Torre de les Maçanes',
    'section.detail.mur.comments': 'comments',
    'section.detail.mur.likes': 'likes',
    'section.detail.mercat.title': 'Market',
    'section.detail.mercat.label': 'Product',
    'section.detail.mercat.itemTitle': 'Product',
    'section.detail.mercat.tag': 'Market',
    'section.detail.mercat.seller': 'Direct sale',
    'section.detail.events.title': 'Events',
    'section.detail.events.label': 'Event',
    'section.detail.events.itemTitle': 'Event',
    'section.detail.events.organisation': 'Organisation',
    'section.detail.events.typeFallback': 'Event',
    'section.detail.pobles.title': 'Towns',
    'section.detail.pobles.label': 'Town',
    'section.detail.pobles.itemTitle': 'Town',
    'section.detail.multimedia.title': 'Media',
    'section.detail.multimedia.label': 'Item',
    'section.detail.multimedia.itemTitle': 'Media item',
    'section.detail.multimedia.mediaType': 'Media',
    'section.detail.multimedia.imageType': 'Image',
    'section.detail.notes.title': 'Notes',
    'section.detail.notes.label': 'Note',
    'section.detail.notes.itemTitle': 'Note',
    'section.detail.notes.folderFallback': 'General',
    'section.login.kicker': 'Access',
    'section.login.title': 'Login, sign up and Google',
    'section.login.subtitle': 'Access the portal to sign in, create an account or continue with Google.',
    'section.login.private': 'Private access',
    'section.login.heroTitle': 'Your access, in one place.',
    'section.login.heroText': 'Sign in, create your account or continue with Google, whichever works best for you.',
    'section.login.loginTitle': 'Sign in',
    'section.login.loginSubtitle': 'Access your account and recover your session.',
    'section.login.loginEmail': 'Email',
    'section.login.loginPassword': 'Password',
    'section.login.loginButton': 'Sign in',
    'section.login.placeholder.email': 'name@example.com',
    'section.login.placeholder.name': 'Full name',
    'section.login.placeholder.password': '••••••••',
    'section.login.error.empty': 'Fill all fields.',
    'section.login.success.login': 'Logged in.',
    'section.login.success.register': 'Account created.',
    'section.myprofile.success': 'Profile saved.',
    'section.myprofile.error': 'Error saving profile.',
    'section.myprofile.title': 'Your profile',
    'section.myprofile.subtitle': 'Manage your data.',
    'section.login.placeholder.newPassword': 'Choose a password',
    'section.login.registerTitle': 'Create account',
    'section.login.registerSubtitle': 'Open a new account to have your own space.',
    'section.login.registerName': 'Name',
    'section.login.registerButton': 'Create account',
    'section.login.googleTitle': 'Google access',
    'section.login.googleSubtitle': 'Fast Google access to sign in in one click.',
    'section.login.googleButton': 'Continue with Google',
    'section.login.googleNote': 'An option designed for faster, more convenient access.',
    'section.login.meta.session': 'Session',
    'section.login.meta.oauth': 'OAuth',
    'section.login.meta.quick': 'Quick access',
    'section.login.meta.account': 'Account',
    'section.login.meta.google': 'Google',
    'section.login.summary.futureUser': 'Future user',
    'section.login.summary.verifiableEmail': 'Verifiable email',
    'section.login.summary.protectedAccess': 'Protected access',
    'section.translations.kicker': 'Language',
    'section.translations.title': 'Translations and language',
    'section.translations.subtitle': 'Change the interface language and save the preference in the browser.',
    'section.translations.meta': 'Preferences',
    'section.translations.status.active': 'Active',
    'section.translations.status.available': 'Available',
    'section.translations.current': 'Current language',
    'section.translations.pick': 'Select a language',
    'section.translations.saved': 'Saved',
    'section.connectar.kicker': 'Connect',
    'section.connectar.title': 'Where do you want to continue?',
    'section.connectar.subtitle': 'Choose the space where you want to enter and keep browsing.',
    'section.connectar.privacy': 'Connection privacy',
    'section.connectar.private': 'Private',
    'section.connectar.public': 'Public',
    'section.connectar.where': 'Where do you want to connect it?',
    'section.connectar.context': 'Tags and context',
    'section.connectar.people': 'People and agents',
    'section.connectar.go': 'Go to',
    'section.connectar.connect': 'Connect to',
    'section.connectar.tagsPlaceholder': 'Add a free tag...',
    'section.connectar.add': 'Add',
    'section.connectar.remove': 'Remove',
    'section.connectar.tagState.private': 'Private',
    'section.connectar.tagState.public': 'Public',
    'section.connectar.area.xat': 'Open a conversation with village people.',
    'section.connectar.area.mur': 'Publish or review the public wall.',
    'section.connectar.area.mercat': 'Explore products and exchanges.',
    'section.connectar.area.events': 'See sessions, dates and rituals.',
    'error.loadPortal': 'Could not load the portal',
  },
  eu: {



    'section.dispositius.kicker': 'Dispositius',
    'section.dispositius.title': 'Dispositius i connexions directes',
    'section.dispositius.subtitle': 'Descobrix instàncies obertes del portal, llança una connexió i envia missatges directes des d\'esta mateixa pantalla.',
    'nav.control': 'Control',
    'nav.controlShort': 'Ctrl',
    'section.control.kicker': 'Xarxa Neural',
    'section.control.title': 'Panell de Control',
    'section.control.subtitle': "Node principal i accés a les eines d'administració i gestió.",
    'section.control.meta1': 'Admin',
    'section.control.meta2': 'Sistema',
    'nav.gestoria': 'Gestoria',
    'nav.gestoriaShort': 'Gest',
    'section.gestoria.kicker': 'Administració',
    'section.gestoria.title': 'Gestoria de Poble',
    'section.gestoria.subtitle': 'Portal de Gestoria Interna i Tauler de Comandament.',
    'section.gestoria.meta1': 'Jarvis Torruà',
    'section.gestoria.meta2': 'Privat',
    'nav.dispositius': 'Dispositius',
    'nav.dispositiusShort': 'P2P',

    'section.multimedia.elements': 'elements',
    'section.multimedia.featuredFallback': 'Recurs visual destacat del projecte.',
    'section.notes.mobileTitle': 'Quadern',
    'pull.release': 'Deixa anar per actualitzar',
    'pull.pull': 'Estira per actualitzar',
    'section.poblacio.title': 'Població',
    'section.poblacio.subtitle': 'Dades de població',
    'section.poblacio.lead': 'Dades demogràfiques',
    'section.pobles.wikipedia_link': 'Enllaç a Wikipedia',
    'section.pobles.noResults': 'Cap poble trobat.',
    'section.realitat.title': 'Realitat',
    'section.realitat.subtitle': 'Dades i context de la realitat.',
    'section.search.label': 'Cerca',
    'nav.xat': 'Txata',
    'nav.mur': 'Horma',
    'nav.mercat': 'Merkatua',
    'nav.pobles': 'Herriak',
    'nav.events': 'Ekitaldiak',
    'nav.mapa': 'Mapa',
    'nav.multimedia': 'Multimedia',
    'nav.notes': 'Oharrak',
    'nav.projecte': 'Proiektua',
    'nav.projecteShort': 'Proj.',
    'nav.constitucio': 'Konstituzioa',
    'nav.constitucioShort': 'Legeak',
    'nav.disseny': 'Diseinua',
    'nav.skills': 'Trebetasunak',
    'nav.ia': 'iaia-ren arima',
    'nav.roadmap': 'Bide-orria',
    'nav.roadmapShort': 'Bidea',
    'nav.legal': 'Legea eta pribatutasuna',
    'nav.legalShort': 'Legea',
    'nav.connectar': 'Konektatu',
    'nav.login': 'Saioa',
    'nav.idioma': 'Hizkuntza',
    'nav.perfil': 'Profila',
    'nav.cerca': 'Bilatu',
    'nav.acces': 'Sarbidea',
    'nav.tema': 'Gaia',
    'nav.visor': 'Ikuslea',
    'nav.idiomaTitle': 'Hizkuntza aukeratu',
    'nav.idiomaSubtitle': 'Aldatu interfazearen hizkuntza eta gorde aukeraketa nabigatzailean.',
    'common.readMore': 'Gehiago irakurri',
    'common.showMore': 'Gehiago erakutsi',
    'common.search': 'Bilatu',
    'common.results': 'emaitza',
    'common.visible': 'ikusgai',
    'common.noDate': 'Datarik ez',
    'common.noResults': 'Emaitzarik ez.',
    'common.active': 'Aktibo',
    'common.available': 'Eskuragarri',
    'common.saved': 'Gordeta',
    'common.currentLanguage': 'Uneko hizkuntza',
    'common.interfaceLanguage': 'Interfazearen hizkuntza',
    'common.selectLanguage': 'Hizkuntza hautatu',
    'common.back': 'Itzuli',
    'app.tagline': 'Herriko sare publikoa.',
    'app.description': 'Herriko atari publikoa.',
    'topbar.language': 'Hizkuntza',
    'topbar.access': 'Sarbidea',
    'topbar.search': 'Bilatu',
    'topbar.theme': 'Gaia',
    'topbar.profile': 'Profila',
    'topbar.viewer': 'Ikuslea',
    'topbar.connect': 'Konektatu',
    'loading.content': 'Herriko edukia kargatzen...',
    'section.xat.kicker': 'Txata publikoa',
    'section.xat.title': 'Elkarrizketak eta komunitatea',
    'section.xat.subtitle': 'Ireki elkarrizketak herriko jendearekin, taldeekin eta sareko espazioekin.',
    'section.xat.tab.xat': 'Txata',
    'section.xat.tab.gent': 'Jendea',
    'section.xat.tab.grups': 'Taldeak',
    'section.xat.tab.empreses': 'Enpresak',
    'section.xat.tab.institucions': 'Erakundeak',
    'section.xat.searchPlaceholder': 'Bilatu txatak, pertsonak edo taldeak...',
    'section.xat.composePlaceholder': 'Idatzi mezua...',
    'section.xat.send': 'Bidali',
    'section.xat.selected': 'Aukeratuta',
    'section.xat.memberFallback': 'Komunitateko kidea',
    'section.mur.kicker': 'Horma',
    'section.mur.title': 'Azken argitalpenak',
    'section.mur.subtitle': 'Irakurri herriko azken argitalpenekin horma publikoa.',
    'section.mur.searchTitle': 'Bilatu horman',
    'section.mur.searchPlaceholder': 'Bilatu titulu, egile, herri edo testuaren arabera...',
    'section.mur.results': 'emaitza',
    'section.mur.loadMore': 'Gehiago erakutsi',
    'section.mercat.kicker': 'Merkatua',
    'section.mercat.title': 'Produktuak eta trukeak',
    'section.mercat.subtitle': 'Aztertu produktu eta eskaintza eskuragarriak.',
    'section.mercat.searchTitle': 'Bilatu merkatuan',
    'section.mercat.searchPlaceholder': 'Bilatu produktu, denda edo kategorien arabera...',
    'section.mercat.results': 'emaitza',
    'section.mercat.variations': 'aldaerak',
    'section.search.kicker': 'Bilatzailea',
    'section.search.title': 'Edukian barrena bilatu',
    'section.search.subtitle': 'Bilatu pertsonak, herriak, argitalpenak eta orriak leku bakarrean.',
    'section.search.searchTitle': 'Bilatu',
    'section.search.searchPlaceholder': 'Bilatu pertsonak, herriak, post-ak...',
    'section.search.filter': 'Iragazki globala',
    'section.search.noResults': 'Emaitzarik ez.',
    'section.search.globalMeta': 'Bilaketa globala',
    'section.search.quickMeta': 'Azkarra',
    'section.search.unifiedMeta': 'Bateratua',
    'section.search.resultLabel': 'Emaitza',
    'section.profile.kicker': 'Profila',
    'section.profile.title': 'Agenteak eta pertsonak',
    'section.profile.subtitle': 'Atariaren pertsona, talde eta agenteen direktorioa.',
    'section.profile.directory': 'Direktorioa',
    'section.profile.more': 'Gehiago irakurri',
    'section.mur.feed': 'Jatorrizko jarioa',
    'section.mur.posts': 'argitalpenak',
    'section.mur.comments': 'iruzkinak',
    'section.mur.likes': 'atsegin dut',
    'section.xat.options': 'Txat aukerak',
    'section.xat.selectConversation': 'Hautatu elkarrizketa bat',
    'section.events.kicker': 'Ekitaldiak',
    'section.events.title': 'Egutegia eta saioak',
    'section.events.subtitle': 'Egiaztatu programatutako ekitaldi eta jarduerak.',
    'section.events.searchTitle': 'Bilatu ekitaldiak',
    'section.events.searchPlaceholder': 'Bilatu saioak, errituak, hitzorduak...',
    'section.events.results': 'emaitza',
    'section.events.records': 'erregistro',
    'section.events.calendarMeta': 'Egutegia',
    'section.events.listMeta': 'Zerrenda',
    'section.mapa.kicker': 'Mapa',
    'section.mapa.title': 'Lurralde mapa',
    'section.mapa.subtitle': 'Proiektuaren eta bere puntu nabarmenen ikuspegi geografikoa.',
    'section.mapa.head': 'Lurraldearen pultsuak',
    'section.mapa.records': 'erregistro',
    'section.mapa.publicNav': 'Nabigazio publikoa',
    'section.disseny.kicker': 'Diseinua',
    'section.disseny.title': 'Sóc de Poble diseinu-sistema',
    'section.disseny.subtitle': 'Harri lehorreko arkitektura, interfaz garbi eta sendoentzat.',
    'section.disseny.workInProgress': 'Lanean',
    'section.disseny.note': 'Hurrengo atalak Slot ereduera migratzen ari dira DOM_DEPTH murrizteko.',
    'section.pobles.kicker': 'Herriak',
    'section.pobles.title': 'Nodoak eta lurraldea',
    'section.pobles.subtitle': 'Arakatu herriak eta haien testuinguru lurraldekoa.',
    'section.pobles.searchTitle': 'Bilatu herriak',
    'section.pobles.searchPlaceholder': 'Bilatu izen, eskualde edo deskribapenaren arabera...',
    'section.pobles.results': 'emaitza',
    'section.pobles.territoryMeta': 'Lurraldea',
    'section.multimedia.kicker': 'Multimedia',
    'section.multimedia.title': 'Artxibo bisuala',
    'section.multimedia.subtitle': 'Irudi galeria eta proiektuaren denbora-lerro bisuala.',
    'section.multimedia.gallery': 'Galeria',
    'section.multimedia.grid': 'Sareta',
    'section.multimedia.timeline': 'Denbora-lerroa',
    'section.multimedia.open': 'Ireki',
    'section.multimedia.elements': 'elementu',
    'section.multimedia.featuredFallback': 'Proiektuaren baliabide bisual nabarmendua.',
    'section.notes.kicker': 'Oharrak',
    'section.notes.title': 'Koadernoa',
    'section.notes.subtitle': 'Proiektuaren oharrak eta zirriborroak karpetatan antolatuta.',
    'section.notes.folders': 'Karpetak',
    'section.notes.list': 'Zerrenda',
    'section.notes.editor': 'Editorea',
    'section.notes.archive': 'Herriko artxiboa',
    'section.notes.categories': 'Kategoriak',
    'section.notes.category.Trellat': 'Trellat',
    'section.notes.category.Patrimoni': 'Ondarea',
    'section.notes.category.Dades': 'Datuak',
    'section.notes.category.Social': 'Gizartea',
    'section.notes.searchPlaceholder': 'Bilatu bancalean...',
    'section.notes.back': 'Itzuli',
    'section.notes.note': 'Oharra',
    'section.notes.emptyPreview': 'Edukirik ez...',
    'section.notes.open': 'Ildo bat ireki',
    'section.notes.mobileTitle': 'Koadernoa',
    'section.notes.mobileFolders': 'Karpetak',
    'section.notes.mobileList': 'Zerrenda',
    'section.notes.mobileEditor': 'Editorea',
    'section.notes.categoryLabel': 'Kategoria',
    'section.text.page': 'Orria',
    'section.text.content': 'Edukia',
    'section.text.text': 'Testua',
    'section.detail.back': 'Itzuli',
    'section.detail.backToList': 'Zerrendara itzuli',
    'section.detail.previous': 'Aurrekoa',
    'section.detail.next': 'Hurrengoa',
    'section.detail.invalidLink': 'Lotura baliogabea',
    'section.detail.noFound.kicker': 'Ez da aurkitu',
    'section.detail.noFound.title': 'Elementua ez da aurkitu',
    'section.detail.noFound.subtitle': 'Loturak ez du existitzen den elementu batera eramaten.',
    'section.detail.mur.title': 'Horma',
    'section.detail.mur.label': 'Argitalpena',
    'section.detail.mur.itemTitle': 'Argitalpena',
    'section.detail.mur.author': 'Sóc de Poble',
    'section.detail.mur.town': 'La Torre de les Maçanes',
    'section.detail.mur.comments': 'iruzkinak',
    'section.detail.mur.likes': 'atsegin dut',
    'section.detail.mercat.title': 'Merkatua',
    'section.detail.mercat.label': 'Produktua',
    'section.detail.mercat.itemTitle': 'Produktua',
    'section.detail.mercat.tag': 'Merkatua',
    'section.detail.mercat.seller': 'Zuzeneko salmenta',
    'section.detail.events.title': 'Ekitaldiak',
    'section.detail.events.label': 'Ekitaldia',
    'section.detail.events.itemTitle': 'Ekitaldia',
    'section.detail.events.organisation': 'Antolaketa',
    'section.detail.events.typeFallback': 'Ekitaldia',
    'section.detail.pobles.title': 'Herriak',
    'section.detail.pobles.label': 'Herria',
    'section.detail.pobles.itemTitle': 'Herria',
    'section.detail.multimedia.title': 'Multimedia',
    'section.detail.multimedia.label': 'Elementua',
    'section.detail.multimedia.itemTitle': 'Multimedia elementua',
    'section.detail.multimedia.mediaType': 'Media',
    'section.detail.multimedia.imageType': 'Irudia',
    'section.detail.notes.title': 'Oharrak',
    'section.detail.notes.label': 'Oharra',
    'section.detail.notes.itemTitle': 'Oharra',
    'section.detail.notes.folderFallback': 'Orokorra',
    'section.login.kicker': 'Sarbidea',
    'section.login.title': 'Saioa, erregistroa eta Google',
    'section.login.subtitle': 'Sartu atarian, kontua sortu edo Google-rekin jarraitu.',
    'section.login.private': 'Sarbide pribatua',
    'section.login.heroTitle': 'Zure sarbidea, leku bakarrean.',
    'section.login.heroText': 'Sartu, sortu kontua edo jarraitu Google-rekin, zuretzat egokiena den moduan.',
    'section.login.loginTitle': 'Sartu',
    'section.login.loginSubtitle': 'Sartu zure kontuan eta berreskuratu saioa.',
    'section.login.loginEmail': 'E-posta',
    'section.login.loginPassword': 'Pasahitza',
    'section.login.loginButton': 'Sartu',
    'section.login.placeholder.email': 'izena@adibidea.eus',
    'section.login.placeholder.name': 'Izen-abizenak',
    'section.login.placeholder.password': '••••••••',
    'section.login.error.empty': 'Bete eremu guztiak.',
    'section.login.success.login': 'Saioa hasi da.',
    'section.login.success.register': 'Kontua sortu da.',
    'section.myprofile.success': 'Profila gorde da.',
    'section.myprofile.error': 'Errorea profila gordetzean.',
    'section.myprofile.title': 'Zure profila',
    'section.myprofile.subtitle': 'Kudeatu zure datuak.',
    'section.login.placeholder.newPassword': 'Aukeratu pasahitz bat',
    'section.login.registerTitle': 'Kontua sortu',
    'section.login.registerSubtitle': 'Ireki kontu berri bat zure espazio propioa izateko.',
    'section.login.registerName': 'Izena',
    'section.login.registerButton': 'Kontua sortu',
    'section.login.googleTitle': 'Google bidezko sarbidea',
    'section.login.googleSubtitle': 'Google-rekin sarrera azkarra, klik bakarrean.',
    'section.login.googleButton': 'Jarraitu Google-rekin',
    'section.login.googleNote': 'Sarbide azkarrago eta erosoago baterako aukera.',
    'section.login.meta.session': 'Saioa',
    'section.login.meta.oauth': 'OAuth',
    'section.login.meta.quick': 'Sarbide azkarra',
    'section.login.meta.account': 'Kontua',
    'section.login.meta.google': 'Google',
    'section.login.summary.futureUser': 'Etorkizuneko erabiltzailea',
    'section.login.summary.verifiableEmail': 'E-posta egiaztagarria',
    'section.login.summary.protectedAccess': 'Sarbide babestua',
    'section.translations.kicker': 'Hizkuntza',
    'section.translations.title': 'Itzulpenak eta hizkuntza',
    'section.translations.subtitle': 'Aldatu interfazearen hizkuntza eta gorde hobespena nabigatzailean.',
    'section.translations.meta': 'Hobespenak',
    'section.translations.status.active': 'Aktibo',
    'section.translations.status.available': 'Eskuragarri',
    'section.translations.current': 'Uneko hizkuntza',
    'section.translations.pick': 'Hizkuntza aukeratu',
    'section.translations.saved': 'Gordeta',
    'section.connectar.kicker': 'Konektatu',
    'section.connectar.title': 'Non jarraitu nahi duzu?',
    'section.connectar.subtitle': 'Aukeratu sartu nahi duzun espazioa eta jarraitu nabigatzen.',
    'section.connectar.privacy': 'Konexioaren pribatutasuna',
    'section.connectar.private': 'Pribatua',
    'section.connectar.public': 'Publikoa',
    'section.connectar.where': 'Non konektatu nahi duzu?',
    'section.connectar.context': 'Etiketak eta testuingurua',
    'section.connectar.people': 'Pertsonak eta agenteak',
    'section.connectar.go': 'Joan',
    'section.connectar.connect': 'Konektatu',
    'section.connectar.tagsPlaceholder': 'Gehitu etiketa librea...',
    'section.connectar.add': 'Gehitu',
    'section.connectar.remove': 'Kendu',
    'section.connectar.tagState.private': 'Pribatua',
    'section.connectar.tagState.public': 'Publikoa',
    'section.connectar.area.xat': 'Ireki elkarrizketa bat herriko jendearekin.',
    'section.connectar.area.mur': 'Argitaratu edo berrikusi horma publikoa.',
    'section.connectar.area.mercat': 'Aztertu produktuak eta trukeak.',
    'section.connectar.area.events': 'Ikusi saioak, hitzorduak eta errituak.',
    'error.loadPortal': 'Ezin izan da ataria kargatu'
  },
  gl: {


    'nav.control': 'Control',
    'nav.controlShort': 'Ctrl',
    'section.control.kicker': 'Xarxa Neural',
    'section.control.title': 'Panell de Control',
    'section.control.subtitle': "Node principal i accés a les eines d'administració i gestió.",
    'section.control.meta1': 'Admin',
    'section.control.meta2': 'Sistema',
    'nav.gestoria': 'Gestoria',
    'nav.gestoriaShort': 'Gest',
    'section.gestoria.kicker': 'Administració',
    'section.gestoria.title': 'Gestoria de Poble',
    'section.gestoria.subtitle': 'Portal de Gestoria Interna i Tauler de Comandament.',
    'section.gestoria.meta1': 'Jarvis Torruà',
    'section.gestoria.meta2': 'Privat',
    'nav.dispositius': 'Dispositius',
    'nav.dispositiusShort': 'P2P',
    'pull.release': 'Deixa anar per actualitzar',
    'pull.pull': 'Estira per actualitzar',
    'section.poblacio.title': 'Població',
    'section.poblacio.subtitle': 'Dades de població',
    'section.poblacio.lead': 'Dades demogràfiques',
    'section.pobles.wikipedia_link': 'Enllaç a Wikipedia',
    'section.pobles.noResults': 'Cap poble trobat.',
    'section.realitat.title': 'Realitat',
    'section.realitat.subtitle': 'Dades i context de la realitat.',
    'section.search.label': 'Cerca',
    'nav.xat': 'Chat',
    'nav.mur': 'Muro',
    'nav.mercat': 'Mercado',
    'nav.pobles': 'Pobos',
    'nav.events': 'Eventos',
    'nav.mapa': 'Mapa',
    'nav.multimedia': 'Multimedia',
    'nav.notes': 'Notas',
    'nav.projecte': 'O proxecto',
    'nav.projecteShort': 'Proj.',
    'nav.constitucio': 'Constitución',
    'nav.constitucioShort': 'Leis',
    'nav.disseny': 'Deseño',
    'nav.skills': 'Skills',
    'nav.ia': 'A alma da iaia',
    'nav.roadmap': 'Folla de ruta',
    'nav.roadmapShort': 'Ruta',
    'nav.legal': 'Legal e privacidade',
    'nav.legalShort': 'Legal',
    'nav.connectar': 'Conectar',
    'nav.login': 'Login',
    'nav.idioma': 'Idioma',
    'nav.perfil': 'Perfil',
    'nav.cerca': 'Buscar',
    'nav.acces': 'Acceso',
    'nav.tema': 'Tema',
    'nav.visor': 'Visor',
    'nav.idiomaTitle': 'Escolle un idioma',
    'nav.idiomaSubtitle': 'Cambia o idioma da interface e garda a preferencia no navegador.',
    'common.readMore': 'Ler máis',
    'common.showMore': 'Amosar máis',
    'common.search': 'Buscar',
    'common.results': 'resultados',
    'common.visible': 'visibles',
    'common.noDate': 'Sen data',
    'common.noResults': 'Ningún resultado.',
    'common.active': 'Activo',
    'common.available': 'Dispoñible',
    'common.saved': 'Gardado',
    'common.currentLanguage': 'Idioma actual',
    'common.interfaceLanguage': 'Idioma da interface',
    'common.selectLanguage': 'Selecciona un idioma',
    'common.back': 'Voltar',
    'app.tagline': 'Rede pública do pobo.',
    'app.description': 'Portal público do pobo.',
    'topbar.language': 'Idioma',
    'topbar.access': 'Acceso',
    'topbar.search': 'Buscar',
    'topbar.theme': 'Tema',
    'topbar.profile': 'Perfil',
    'topbar.viewer': 'Visor',
    'topbar.connect': 'Conectar',
    'loading.content': 'Cargando contido do pobo...',
    'section.xat.kicker': 'Chat público',
    'section.xat.title': 'Conversas e comunidade',
    'section.xat.subtitle': 'Abre conversas coa xente, grupos e espazos da rede.',
    'section.xat.tab.xat': 'Chat',
    'section.xat.tab.gent': 'Xente',
    'section.xat.tab.grups': 'Grupos',
    'section.xat.tab.empreses': 'Empresas',
    'section.xat.tab.institucions': 'Institucións',
    'section.xat.searchPlaceholder': 'Busca chats, persoas ou grupos...',
    'section.xat.composePlaceholder': 'Escribe unha mensaxe...',
    'section.xat.send': 'Enviar',
    'section.xat.selected': 'Seleccionado',
    'section.xat.memberFallback': 'Membro da comunidade',
    'section.mur.kicker': 'Muro',
    'section.mur.title': 'Publicacións recentes',
    'section.mur.subtitle': 'Le o muro público coas últimas publicacións do pobo.',
    'section.mur.searchTitle': 'Buscar no muro',
    'section.mur.searchPlaceholder': 'Busca por título, autor, pobo ou texto...',
    'section.mur.results': 'resultados',
    'section.mur.loadMore': 'Amosar máis',
    'section.mercat.kicker': 'Mercado',
    'section.mercat.title': 'Produtos e intercambios',
    'section.mercat.subtitle': 'Explora os produtos e as ofertas dispoñibles.',
    'section.mercat.searchTitle': 'Buscar no mercado',
    'section.mercat.searchPlaceholder': 'Busca produtos, tendas ou categorías...',
    'section.mercat.results': 'resultados',
    'section.mercat.variations': 'variantes',
    'section.search.kicker': 'Buscador',
    'section.search.title': 'Busca dentro do contido',
    'section.search.subtitle': 'Busca persoas, pobos, publicacións e páxinas nun só lugar.',
    'section.search.searchTitle': 'Buscar',
    'section.search.searchPlaceholder': 'Busca persoas, pobos, posts...',
    'section.search.filter': 'Filtro global',
    'section.search.noResults': 'Ningún resultado.',
    'section.search.globalMeta': 'Busca global',
    'section.search.quickMeta': 'Rápido',
    'section.search.unifiedMeta': 'Unificada',
    'section.search.resultLabel': 'Resultado',
    'section.profile.kicker': 'Perfil',
    'section.profile.title': 'Axentes e persoas',
    'section.profile.subtitle': 'Directorio de persoas, grupos e axentes do portal.',
    'section.profile.directory': 'Directorio',
    'section.profile.more': 'Ler máis',
    'section.mur.feed': 'Feed orixinal',
    'section.mur.posts': 'publicacións',
    'section.mur.comments': 'comentarios',
    'section.mur.likes': 'gústame',
    'section.xat.options': 'Opcións do chat',
    'section.xat.selectConversation': 'Selecciona unha conversa',
    'section.events.kicker': 'Eventos',
    'section.events.title': 'Calendario e sesións',
    'section.events.subtitle': 'Consulta os eventos e actividades programadas.',
    'section.events.searchTitle': 'Buscar eventos',
    'section.events.searchPlaceholder': 'Busca sesións, rituais, citas...',
    'section.events.results': 'resultados',
    'section.events.records': 'rexistros',
    'section.events.calendarMeta': 'Calendario',
    'section.events.listMeta': 'Listado',
    'section.mapa.kicker': 'Mapa',
    'section.mapa.title': 'Mapa do territorio',
    'section.mapa.subtitle': 'Vista xeográfica do proxecto e dos seus puntos destacados.',
    'section.mapa.head': 'Pulso do territorio',
    'section.mapa.records': 'rexistros',
    'section.mapa.publicNav': 'Navegación pública',
    'section.disseny.kicker': 'Deseño',
    'section.disseny.title': 'Sistema de Deseño Sóc de Poble',
    'section.disseny.subtitle': 'Arquitectura Pedra Seca para interfaces claras e resistentes',
    'section.disseny.workInProgress': 'Traballo en progreso',
    'section.disseny.note': 'As seguintes seccións están sendo migradas ao patrón Slot para reducir o DOM_DEPTH.',
    'section.pobles.kicker': 'Pobos',
    'section.pobles.title': 'Nós e territorio',
    'section.pobles.subtitle': 'Explora os pobos e o seu contexto territorial.',
    'section.pobles.searchTitle': 'Buscar pobos',
    'section.pobles.searchPlaceholder': 'Busca por nome, comarca ou descrición...',
    'section.pobles.results': 'resultados',
    'section.pobles.territoryMeta': 'Territorio',
    'section.multimedia.kicker': 'Multimedia',
    'section.multimedia.title': 'Arquivo visual',
    'section.multimedia.subtitle': 'Galería de imaxes e cronoloxía visual do proxecto.',
    'section.multimedia.gallery': 'Galería',
    'section.multimedia.grid': 'Grade',
    'section.multimedia.timeline': 'Cronoloxía',
    'section.multimedia.open': 'Abrir',
    'section.multimedia.elements': 'elementos',
    'section.multimedia.featuredFallback': 'Recurso visual destacado do proxecto.',
    'section.notes.kicker': 'Notas',
    'section.notes.title': 'Caderno',
    'section.notes.subtitle': 'Notas e apuntes do proxecto organizados por carpetas.',
    'section.notes.folders': 'Carpetas',
    'section.notes.list': 'Lista',
    'section.notes.editor': 'Editor',
    'section.notes.archive': 'Arquivo do pobo',
    'section.notes.categories': 'Categorías',
    'section.notes.category.Trellat': 'Trellat',
    'section.notes.category.Patrimoni': 'Patrimonio',
    'section.notes.category.Dades': 'Datos',
    'section.notes.category.Social': 'Social',
    'section.notes.searchPlaceholder': 'Busca no bancal...',
    'section.notes.back': 'Voltar',
    'section.notes.note': 'Nota',
    'section.notes.emptyPreview': 'Sen contido...',
    'section.notes.open': 'Abre un suco',
    'section.notes.mobileTitle': 'Caderno',
    'section.notes.mobileFolders': 'Carpetas',
    'section.notes.mobileList': 'Lista',
    'section.notes.mobileEditor': 'Editor',
    'section.notes.categoryLabel': 'Categoría',
    'section.text.page': 'Páxina',
    'section.text.content': 'Contido',
    'section.text.text': 'Texto',
    'section.detail.back': 'Voltar',
    'section.detail.backToList': 'Voltar á lista',
    'section.detail.previous': 'Anterior',
    'section.detail.next': 'Seguinte',
    'section.detail.invalidLink': 'Ligazón non válida',
    'section.detail.noFound.kicker': 'Non atopado',
    'section.detail.noFound.title': 'Elemento non atopado',
    'section.detail.noFound.subtitle': 'A ligazón non apunta a ningún elemento existente.',
    'section.detail.mur.title': 'Muro',
    'section.detail.mur.label': 'Publicación',
    'section.detail.mur.itemTitle': 'Publicación',
    'section.detail.mur.author': 'Sóc de Poble',
    'section.detail.mur.town': 'La Torre de les Maçanes',
    'section.detail.mur.comments': 'comentarios',
    'section.detail.mur.likes': 'gústame',
    'section.detail.mercat.title': 'Mercado',
    'section.detail.mercat.label': 'Produto',
    'section.detail.mercat.itemTitle': 'Produto',
    'section.detail.mercat.tag': 'Mercado',
    'section.detail.mercat.seller': 'Venda directa',
    'section.detail.events.title': 'Eventos',
    'section.detail.events.label': 'Evento',
    'section.detail.events.itemTitle': 'Evento',
    'section.detail.events.organisation': 'Organización',
    'section.detail.events.typeFallback': 'Evento',
    'section.detail.pobles.title': 'Pobos',
    'section.detail.pobles.label': 'Pobo',
    'section.detail.pobles.itemTitle': 'Pobo',
    'section.detail.multimedia.title': 'Multimedia',
    'section.detail.multimedia.label': 'Elemento',
    'section.detail.multimedia.itemTitle': 'Elemento multimedia',
    'section.detail.multimedia.mediaType': 'Media',
    'section.detail.multimedia.imageType': 'Imaxe',
    'section.detail.notes.title': 'Notas',
    'section.detail.notes.label': 'Nota',
    'section.detail.notes.itemTitle': 'Nota',
    'section.detail.notes.folderFallback': 'Xeral',
    'section.login.kicker': 'Acceso',
    'section.login.title': 'Login, rexistro e Google',
    'section.login.subtitle': 'Acceso ao portal para entrar, crear unha conta ou continuar con Google.',
    'section.login.private': 'Acceso privado',
    'section.login.heroTitle': 'O teu acceso, nun só lugar.',
    'section.login.heroText': 'Entra, crea a túa conta ou continúa con Google segundo o que che vaia mellor.',
    'section.login.loginTitle': 'Entrar',
    'section.login.loginSubtitle': 'Accede á túa conta e recupera a túa sesión.',
    'section.login.loginEmail': 'Correo electrónico',
    'section.login.loginPassword': 'Contrasinal',
    'section.login.loginButton': 'Entrar',
    'section.login.placeholder.email': 'nome@exemplo.com',
    'section.login.placeholder.name': 'Nome e apelidos',
    'section.login.placeholder.password': '••••••••',
    'section.login.error.empty': 'Ompli tots els camps.',
    'section.login.success.login': 'Sessió iniciada.',
    'section.login.success.register': 'Compte creat.',
    'section.myprofile.success': 'Perfil guardat.',
    'section.myprofile.error': 'Error guardant el perfil.',
    'section.myprofile.title': 'El teu perfil',
    'section.myprofile.subtitle': 'Gestiona les teues dades personals.',
    'section.login.placeholder.newPassword': 'Escolle unha clave',
    'section.login.registerTitle': 'Crear conta',
    'section.login.registerSubtitle': 'Abre unha conta nova para ter o teu espazo propio.',
    'section.login.registerName': 'Nome',
    'section.login.registerButton': 'Crear conta',
    'section.login.googleTitle': 'Acceso con Google',
    'section.login.googleSubtitle': 'Acceso rápido con Google para entrar nun clic.',
    'section.login.googleButton': 'Continuar con Google',
    'section.login.googleNote': 'Opción pensada para un acceso máis rápido e cómodo.',
    'section.login.meta.session': 'Sesión',
    'section.login.meta.oauth': 'OAuth',
    'section.login.meta.quick': 'Acceso rápido',
    'section.login.meta.account': 'Conta',
    'section.login.meta.google': 'Google',
    'section.login.summary.futureUser': 'Usuario futuro',
    'section.login.summary.verifiableEmail': 'Correo verificable',
    'section.login.summary.protectedAccess': 'Acceso protexido',
    'section.translations.kicker': 'Idioma',
    'section.translations.title': 'Traducións e lingua',
    'section.translations.subtitle': 'Cambia o idioma da interface e garda a preferencia no navegador.',
    'section.translations.meta': 'Preferencias',
    'section.translations.status.active': 'Activo',
    'section.translations.status.available': 'Dispoñible',
    'section.translations.current': 'Idioma actual',
    'section.translations.pick': 'Selecciona un idioma',
    'section.translations.saved': 'Gardado',
    'section.connectar.kicker': 'Conectar',
    'section.connectar.title': 'Onde queres continuar?',
    'section.connectar.subtitle': 'Escolle o espazo no que queres entrar e segue navegando.',
    'section.connectar.privacy': 'Privacidade da conexión',
    'section.connectar.private': 'Privada',
    'section.connectar.public': 'Pública',
    'section.connectar.where': 'Onde queres conectalo?',
    'section.connectar.context': 'Etiquetas e contexto',
    'section.connectar.people': 'Persoas e axentes',
    'section.connectar.go': 'Ir a',
    'section.connectar.connect': 'Conectar a',
    'section.connectar.tagsPlaceholder': 'Engade unha etiqueta libre...',
    'section.connectar.add': 'Engadir',
    'section.connectar.remove': 'Eliminar',
    'section.connectar.tagState.private': 'Privada',
    'section.connectar.tagState.public': 'Pública',
    'section.connectar.area.xat': 'Abre unha conversa coa xente do pobo.',
    'section.connectar.area.mur': 'Publica ou revisa o muro público.',
    'section.connectar.area.mercat': 'Explora produtos e intercambios.',
    'section.connectar.area.events': 'Mira sesións, citas e rituais.',
    'section.dispositius.kicker': 'Dispositivos',
    'section.dispositius.title': 'Dispositivos e conexións directas',
    'section.dispositius.subtitle': 'Descobre instancias abertas do portal, lanza unha conexión e envía mensaxes directas dende esta mesma pantalla.',
    'error.loadPortal': 'Non foi posible cargar o portal'
  }
};

const FALLBACK_TRANSLATIONS = TRANSLATIONS.ca;

export function normalizeLanguage(code) {
  return SUPPORTED_LANGUAGES.some((language) => language.code === code) ? code : DEFAULT_LANGUAGE;
}

export function readStoredLanguage() {
  if (!isBrowser) return DEFAULT_LANGUAGE;
  return normalizeLanguage(getVal(LANGUAGE_STORAGE_KEY));
}

export function writeStoredLanguage(language) {
  if (!isBrowser) return;
  setVal(LANGUAGE_STORAGE_KEY, normalizeLanguage(language));
}

export function createTranslator(language) {
  const dictionary = TRANSLATIONS[normalizeLanguage(language)] || FALLBACK_TRANSLATIONS;
  return (key, fallback = key) => dictionary[key] || FALLBACK_TRANSLATIONS[key] || fallback;
}

export function getSectionLabels(sectionId, language) {
  const translator = createTranslator(language);
  const entry = SECTION_LABEL_KEYS[sectionId];
  if (!entry) {
    return { label: sectionId, shortLabel: sectionId };
  }
  return {
    label: translator(entry.label, sectionId),
    shortLabel: translator(entry.short, sectionId)
  };
}

```


--- FITXER: .agents/skills/trellat/SKILL.md ---
```javascript
---
name: trellat
description: Protocol obligatori de reflexió prèvia a qualsevol modificació de codi. Fusiona Les Tres Pedres i la verificació de l'Offline-First.
version: 1.0.0
status: active
owner: project-governance
purpose: Forçar una pausa reflexiva abans de cada acció significativa.
triggers_on:
- "codi"
- "modifica"
- "crea"
- "arquitectura"
lang: ca
---

# SKILL: TRELLAT — El ritme del picapedrer

> La potència sense ritme trenca pedres. El ritme sense potència no aixeca murs.
> S'activa SEMPRE que es toque codi de Sóc de Poble.

## 0. El principi
No confies en la meua voluntat de ser prudent: es degrada amb la pressió del context.
Confia en els topalls: el ritus, el llibre d'obra i la porta d'obra. Res que no passe pels tres.

## 1. Les Dues Passades (obligatori)
### Passada 1 — LECTURA (mai codi)
Abans d'escriure una línia, has d'escriure en text lliure:
1. Reformulació del problema en 3 línies, amb les meues paraules.
2. Llista de fitxers que tocaré (i cap més).
3. Assumpcions no verificades, numerades.
4. Riscos del canvi.
Si hi ha assumpcions no verificades → les pregunte i m'ATURE. No les "resolc" inventant.

### Passada 2 — EXECUCIÓ
Només amb el vistiplau de l'humà.

## 2. La Regla de les Tres Pedres (L'Auditoria de Dola i Qwen)
Abans de finalitzar qualsevol canvi o proposar-lo, has d'aplicar aquestes tres proves:

### Primera Pedra — L'Alternativa No Triada
Llista explícitament 2 solucions alternatives que NO proposes i explica per què.
- **Offline-First:** L'opció triada garanteix que l'App funciona sense internet? No hi ha cap recurs carregat via `fetch` extern, CDNs (fonts, imatges) de tercers?
- **Minimalisme:** Ens hem mantingut fidels a Vanilla JS i al context de React sense afegir paquets superflus?

### Segona Pedra — L'Empatia amb el Mantenidor
Respon explícitament a tu mateix:
1. "Serà fàcil modificar això d'aquí 6 mesos per algú (Sollutia) que no coneix el context?"
2. "On podria fallar això en un entorn hostil (WordPress movent nodes, Shadow DOM encapsulat, xarxa inestable, IndexedDB excedit)?"

### Tercera Pedra — L'Auto-Verificació (L'Auditoria Hostil)
Comprova el teu propi treball com a auditor extern i llista:
1. 3 maneres en què aquest codi pot trencar-se (si no en trobes 3, no has pensat prou).
2. Errors lògics o sintàctics que podries haver introduït (`await` perduts, referències).
3. El punt més feble de la teua proposta que no has pogut verificar.

## 3. El Llibre d'Obra (`.agents/LEDGER.md`)
- En començar: llige les 5 últimes entrades.
- En acabar: escric una entrada obligatòria amb format: `Data · Títol · Què s'ha fet · Per què · Fitxers tocats · Risc i com revertir`.
- Cap fitxer pot modificar-se fora del Llibre.

## 4. La Regla de la Brossa
- Cap fitxer "provisional", "final2", ".bak", o scripts vells orfes. S'esborren.
- Una dependència nova exigeix un paràgraf al Llibre justificant per què no es pot fer amb Vanilla JS.

## 5. La Pausa del Palet
Quan notes la urgència d'entregar per complaure ràpidament l'humà: para, compta fins a tres, rellegeix l'enunciat. Si el canvi és gran, el talles en pedres menudes.

```


--- FITXER: .agents/LEDGER.md ---
```javascript
# Llibre d'Obra (LEDGER) de Sóc de Poble

Aquest és el registre immutable de tots els canvis estructurals i tècnics del projecte.
Qualsevol IA (o humà) que modifique codi està obligada a afegir-hi una entrada abans de finalitzar la seua tasca, complint amb la **Skill Trellat**.

---

## 2026-08-28 — Inicialització del Llibre d'Obra
- **Què:** Creació del `LEDGER.md`, `tooling/preflight.mjs`, `SKILL.md` i els hooks d'Antigravity.
- **Per què:** Per aturar la precipitació cognitiva de les IAs i complir amb el "Pas 0" de l'auditoria (La Porta de Pedra Seca).
- **Fitxers:** `.agents/LEDGER.md`, `.agents/skills/trellat/SKILL.md`, `tooling/preflight.mjs`, `.agents/hooks/verify.mjs`, `.agents/hooks.json`.
- **Risc:** Baix. (Per revertir-ho, es poden esborrar aquests fitxers i deshabilitar els hooks).

```


--- FITXER: tooling/preflight.mjs ---
```javascript
#!/usr/bin/env node
/** La Porta d'Obra: res ix al repositori sense passar per ací. Exit 1 = barricada. */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { execSync } from 'node:child_process';

const EXCLUITS = new Set(['node_modules', 'dist', '.git', 'vendor', '.brain-reports', '.gemini']);
const EXT = new Set(['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.css', '.scss', '.html']);
const BROSSA = /\.(bak|old|new|copy|tmp|orig|final\d?|v\d+)$/i;
const VERI = /\b(console\.log|debugger)\b/;
const DEUTE = /\b(TODO|FIXME|XXX|HACK)\b/;
const errors = [];
const avisos = [];

function camina(dir, out = []) {
  try {
    const entries = readdirSync(dir);
    for (const nom of entries) {
      if (EXCLUITS.has(nom) || (nom.startsWith('.') && nom !== '.agents')) continue;
      const ruta = join(dir, nom);
      if (statSync(ruta).isDirectory()) {
        camina(ruta, out);
      } else if (EXT.has(extname(nom))) {
        out.push(ruta);
      }
    }
  } catch (e) {
    // Ignorar carpetes sense permisos
  }
  return out;
}

const arrel = process.cwd();
const fitxers = camina(arrel);
for (const ruta of fitxers) {
  const rel = ruta.slice(arrel.length + 1);
  const text = readFileSync(ruta, 'utf8');
  if (BROSSA.test(rel)) errors.push(`BROSSA: ${rel} — fitxer provisional al repositori.`);
  if (VERI.test(text)) avisos.push(`VERÍ (Avís): console.log o debugger a ${rel}. (Revisar si cal).`);
  if (DEUTE.test(text)) avisos.push(`DEUTE SILENCIAT (Avís): TODO/FIXME a ${rel} — o es resol ara o va al Llibre d'Obra.`);
  if (!text.trim()) avisos.push(`BUIT: ${rel} està buit. És brossa?`);
}

/* Fitxers nous que no consten al Llibre d'Obra = brossa no declarada. */
try {
  const nous = execSync('git status --porcelain', { encoding: 'utf8' })
    .split('\n').filter((l) => l.startsWith('??'))
    .map((l) => l.slice(3).trim()).filter((f) => f && !f.endsWith('/'));
  const llibrePath = join(arrel, '.agents', 'LEDGER.md');
  const llibre = existsSync(llibrePath) ? readFileSync(llibrePath, 'utf8') : '';
  for (const f of nous) {
    if (!llibre.includes(f)) {
      avisos.push(`SENSE LLIBRE (Avís): «${f}» és nou i no consta al LEDGER.md.`);
    }
  }
} catch { /* sense git, la porta segueix tancada per la resta de controls */ }

console.log(`\n[PORTA D'OBRA] ${fitxers.length} fitxers revisats.`);
if (avisos.length) {
  console.log('\n--- AVISOS (No bloquejants) ---');
  avisos.forEach((a) => console.warn('  ⚠ ' + a));
}

if (errors.length) { 
  console.log('\n--- ERRORS CRÍTICS ---');
  errors.forEach((e) => console.error('  ✗ ' + e));
  console.error(`\nBARRICADA: ${errors.length} problemes greus. Cap pedra ix fins que estiga net.`); 
  process.exit(1); 
}
console.log('\n✔ Net d\'errors greus. Es pot posar la pedra.\n');

```


--- FITXER: .agents/hooks/verify.mjs ---
```javascript
import fs from 'node:fs';
import path from 'node:path';

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => { input += chunk; });

process.stdin.on('end', () => {
  try {
    const payload = JSON.parse(input);
    const args = payload?.toolCall?.args || {};
    let targetFile = args.TargetFile || args.AbsolutePath || args.DirectoryPath || 'un fitxer';
    // Només mostrem el nom base per fer el missatge llegible
    targetFile = path.basename(targetFile);

    // Evitem blocar si estem escrivint precisament al Llibre d'Obra
    if (targetFile === 'LEDGER.md' || targetFile === 'task.md' || targetFile === 'walkthrough.md' || targetFile === 'implementation_plan.md') {
       console.log(JSON.stringify({ decision: "allow" }));
       process.exit(0);
    }

    const response = {
      decision: "ask",
      reason: `[SKILL TRELLAT] Estàs a punt d'editar/crear: '${targetFile}'.\nAbans de procedir, has completat les Tres Pedres (Alternatives, Empatia i Verificació) i ho has apuntat al LEDGER.md?`
    };
    console.log(JSON.stringify(response));
    process.exit(0);
  } catch (err) {
    console.log(JSON.stringify({
      decision: "ask",
      reason: "[SKILL TRELLAT] Petició de modificació de fitxers detectada. Permets continuar?"
    }));
    process.exit(0);
  }
});

```
