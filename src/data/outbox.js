/**
 * outbox.js — Cua durable d'eixida damunt d'IndexedDB natiu.
 * Sense 'idb'. Sense promeses damunt de local-storage.
 */
import { setVal } from '../config/storage.js';

const DB = 'sdp-outbox';
const MAGATZEM = 'pendents';
const SNAPSHOTS = 'snapshots';
const ARRENDAMENT_MS = 60_000;   // reclamació de registres encallats
const RETARDS = [1000, 4000, 15000, 60000, 300000];

let dbPromesa = null;
let engineErrors = 0;
let cbState = 'CLOSED'; // 'CLOSED', 'HALF_OPEN', 'OPEN'
let cbNextTry = 0;
const CB_TIMEOUT = 10000;

function resetCircuitBreaker() { 
  engineErrors = 0; 
  cbState = 'CLOSED'; 
}

function tripCircuitBreaker() {
  if (cbState === 'OPEN') return;
  engineErrors++;
  if (engineErrors >= 3) {
    console.warn('[OUTBOX] Circuit Breaker disparat. IDB inestable. Mode degradat.');
    cbState = 'OPEN';
    cbNextTry = Date.now() + CB_TIMEOUT;
    dbPromesa = null;
  }
}

function assertCircuitClosed() {
  if (cbState === 'OPEN') {
    if (Date.now() > cbNextTry) {
      cbState = 'HALF_OPEN';
    } else {
      throw new Error('Circuit Breaker OPEN');
    }
  }
}

async function openDatabaseResilient(dbName, dbVersion) {
  assertCircuitClosed();
  const maxRetries = 10;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await new Promise((resol, rebutja) => {
        let timeoutId = setTimeout(() => rebutja(new Error('IDB Timeout: WebKit bloquejat')), 5000);
        const p = indexedDB.open(dbName, dbVersion);
        
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
          clearTimeout(timeoutId);
          const db = p.result;
          db.onversionchange = () => { db.close(); dbPromesa = null; };
          db.onclose = () => { dbPromesa = null; };
          resol(db);
        };
        p.onerror = () => { clearTimeout(timeoutId); rebutja(p.error); };
        p.onblocked = () => { clearTimeout(timeoutId); rebutja(new Error('IDB Blocked')); };
      });
    } catch (err) {
      lastError = err;
      const delay = Math.pow(2, attempt) * 20;
      await new Promise(r => setTimeout(r, delay));
    }
  }
  tripCircuitBreaker();
  throw lastError;
}

function obri() {
  if (dbPromesa) return dbPromesa;
  dbPromesa = openDatabaseResilient(DB, 2).catch(e => {
    dbPromesa = null;
    throw e;
  });
  return dbPromesa;
}

const tx = async (mode, fn, storeName = MAGATZEM) => {
  const db = await obri();
  return new Promise((resol, rebutja) => {
    let timeoutId = setTimeout(() => rebutja(new Error('Tx Timeout')), 10000);
    let r;
    const t = db.transaction(storeName, mode);
    t.oncomplete = () => { 
      clearTimeout(timeoutId);
      resetCircuitBreaker(); 
      resol(r?.result ?? r); 
    };
    t.onerror = () => { 
      clearTimeout(timeoutId);
      tripCircuitBreaker(); 
      rebutja(t.error); 
    };
    t.onabort = () => { 
      clearTimeout(timeoutId);
      tripCircuitBreaker(); 
      rebutja(t.error); 
    };
    try {
      r = fn(t.objectStore(storeName));
    } catch (err) {
      clearTimeout(timeoutId);
      t.abort();
      rebutja(err);
    }
  });
};

export const uuid = () =>
  (crypto.randomUUID?.() ??
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`);

/** Encua. L'id ve del cridador i NO es regenera mai en cap reintent. */
export const encua = async (registre) => {
  const obj = {
    ...registre,
    estat: 'pendent',
    intents: 0,
    seguentIntentTs: 0,
    arrendamentTs: 0,
    creatTs: Date.now()
  };
  await tx('readwrite', (m) => m.put(obj));
  
  // Z-Audit: Verificació read-back contra l'evicció silenciosa de Safari
  const comprova = await tx('readonly', (m) => m.get(registre.id));
  if (!comprova) throw new Error('Evicció silenciosa detectada. Read-back ha fallat.');
  return comprova;
};

export const confirma = (id) => tx('readwrite', (m) => m.delete(id));

export const pendents = () => tx('readonly', (m) => m.getAll());

/**
 * Reclama un lot dins d'UNA transacció readwrite.
 * IndexedDB serialitza les transaccions readwrite damunt del mateix magatzem,
 * així que dues pestanyes no poden reclamar el mateix registre.
 */
export async function reclama(limit = 20, tabId = 'default') {
  const ara = Date.now();
  const db = await obri();
  return new Promise((resol, rebutja) => {
    let timeoutId = setTimeout(() => rebutja(new Error('Tx Timeout en Reclama')), 10000);
    const t = db.transaction(MAGATZEM, 'readwrite');
    const m = t.objectStore(MAGATZEM);
    const lot = [];
    m.openCursor().onsuccess = (e) => {
      const c = e.target.result;
      if (!c || lot.length >= limit) return;
      const r = c.value;
      const arrendamentCaducat = r.estat === 'enviant' && ara - r.arrendamentTs > ARRENDAMENT_MS;
      const toca = r.estat === 'pendent' && ara >= r.seguentIntentTs;
      // Només robem si ha caducat, o si està pendent. Mai toquem el que una altra pestanya està enviant recentment.
      if (toca || arrendamentCaducat) {
        const reclamat = { ...r, estat: 'enviant', arrendamentTs: ara, tabId };
        c.update(reclamat);
        lot.push(reclamat);
      }
      c.continue();
    };
    t.oncomplete = () => { clearTimeout(timeoutId); resetCircuitBreaker(); resol(lot); };
    t.onerror = () => { clearTimeout(timeoutId); tripCircuitBreaker(); rebutja(t.error); };
    t.onabort = () => { clearTimeout(timeoutId); tripCircuitBreaker(); rebutja(t.error); };
  });
}

export const ajorna = (registre) => {
  const intents = registre.intents + 1;
  if (intents > 8) {
    console.warn(`[OUTBOX] Missatge mort després de 8 intents: ${registre.id}`);
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

export const gcMorts = async () => {
  const db = await obri();
  return new Promise((resol, rebutja) => {
    const t = db.transaction(MAGATZEM, 'readwrite');
    const m = t.objectStore(MAGATZEM);
    const mortsApurats = [];
    m.index('estat').openCursor(IDBKeyRange.only('mort')).onsuccess = (e) => {
      const c = e.target.result;
      if (c) {
        mortsApurats.push(c.value.id);
        c.delete();
        c.continue();
      }
    };
    t.oncomplete = () => { resetCircuitBreaker(); resol(mortsApurats); };
    t.onerror = () => { tripCircuitBreaker(); rebutja(t.error); };
  });
};

/** Dola-Audit: Renovació del 7-Day Purge de Safari */
export async function enviaSigneVida() {
  try {
    setVal('sdp-signe-vida', Date.now().toString());
    await tx('readwrite', (m) => m.put({ id: 'signe-vida', estat: 'ignorar', creatTs: Date.now() }));
  } catch(e) {
    console.warn('[OUTBOX] Signe de vida ha fallat', e);
  }
}

/** Protocol Làzaro: Snapshots a IndexedDB */
export const getSnapshot = async (id) => {
  try {
    return await tx('readonly', (m) => m.get(id), SNAPSHOTS);
  } catch (err) {
    console.warn(`[OUTBOX] Error recuperant snapshot ${id}`, err);
    return null;
  }
};

export const saveSnapshot = async (id, data) => {
  // Conversió a ArrayBuffer abans de guardar si es vol evitar el problema Blob
  // Com que el snapshot ja és serialitzat o en objectes planers, ho desem directament
  return tx('readwrite', (m) => m.put({ id, data, ts: Date.now() }), SNAPSHOTS);
};

export const loadLargeDatasetChunked = async (id, batchSize = 50, onProgress) => {
  // Aquesta funció emularà la lectura del snapshot de gran volum iterant el contingut (si fora un store amb múltiples entrades)
  // Atés que "getSnapshot" guarda un sol mega-objecte per "id", necessitariem una altra estratègia per a dividir l'objecte original
  // Com que ara mateix el snapshot sencer s'escriu junt baix una clau ("id"), la fragmentació l'ha de fer l'aplicació 
  // Per ara, usem tx() que inclou el timeout resilient
  return getSnapshot(id);
};

