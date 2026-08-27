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

function resetCircuitBreaker() { engineErrors = 0; }
function tripCircuitBreaker() {
  engineErrors++;
  if (engineErrors >= 3) {
    console.error('[OUTBOX] Circuit Breaker disparat. Esborrant IndexedDB per corrupció.');
    indexedDB.deleteDatabase(DB);
    dbPromesa = null;
    engineErrors = 0;
  }
}

function obri() {
  if (dbPromesa) return dbPromesa;
  dbPromesa = new Promise((resol, rebutja) => {
    let timeoutId = setTimeout(() => {
      dbPromesa = null;
      rebutja(new Error('IDB Timeout: WebKit bloquejat'));
    }, 5000);

    try {
      const p = indexedDB.open(DB, 2);
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
      p.onerror = () => {
        clearTimeout(timeoutId);
        dbPromesa = null;
        tripCircuitBreaker();
        rebutja(p.error);
      };
      p.onblocked = () => {
        clearTimeout(timeoutId);
        dbPromesa = null;
        rebutja(new Error('IDB Blocked'));
      };
    } catch (err) {
      clearTimeout(timeoutId);
      dbPromesa = null;
      rebutja(err);
    }
  });
  return dbPromesa;
}

const tx = async (mode, fn) => {
  const db = await obri();
  return new Promise((resol, rebutja) => {
    let r;
    const t = db.transaction(MAGATZEM, mode);
    t.oncomplete = () => { resetCircuitBreaker(); resol(r?.result ?? r); };
    t.onerror = () => { tripCircuitBreaker(); rebutja(t.error); };
    t.onabort = () => { tripCircuitBreaker(); rebutja(t.error); };
    try {
      r = fn(t.objectStore(MAGATZEM));
    } catch (err) {
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
export async function reclama(limit = 20) {
  const ara = Date.now();
  const db = await obri();
  return new Promise((resol, rebutja) => {
    const t = db.transaction(MAGATZEM, 'readwrite');
    const m = t.objectStore(MAGATZEM);
    const lot = [];
    m.openCursor().onsuccess = (e) => {
      const c = e.target.result;
      if (!c || lot.length >= limit) return;
      const r = c.value;
      const arrendamentCaducat = r.estat === 'enviant' && ara - r.arrendamentTs > ARRENDAMENT_MS;
      const toca = r.estat === 'pendent' && ara >= r.seguentIntentTs;
      if (toca || arrendamentCaducat) {
        const reclamat = { ...r, estat: 'enviant', arrendamentTs: ara };
        c.update(reclamat);
        lot.push(reclamat);
      }
      c.continue();
    };
    t.oncomplete = () => resol(lot);
    t.onerror = () => rebutja(t.error);
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
  const db = await obri();
  return new Promise((resol, rebutja) => {
    const t = db.transaction(SNAPSHOTS, 'readonly');
    const req = t.objectStore(SNAPSHOTS).get(id);
    req.onsuccess = () => resol(req.result?.data || null);
    req.onerror = () => rebutja(req.error);
  });
};

export const saveSnapshot = async (id, data) => {
  const db = await obri();
  return new Promise((resol, rebutja) => {
    const t = db.transaction(SNAPSHOTS, 'readwrite');
    const req = t.objectStore(SNAPSHOTS).put({ id, data, ts: Date.now() });
    t.oncomplete = () => resol();
    t.onerror = () => rebutja(req.error);
  });
};
