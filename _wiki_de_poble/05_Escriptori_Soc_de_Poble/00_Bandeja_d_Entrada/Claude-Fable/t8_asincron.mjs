// Reproducció REAL: l'esborrat falla en asíncron (request.onerror + abort), com fa IndexedDB.
import path from 'node:path';
import { pathToFileURL } from 'node:url';
await import('fake-indexeddb/auto');
globalThis.window = globalThis;
globalThis.localStorage = { _d:{}, getItem(k){return this._d[k]??null}, setItem(k,v){this._d[k]=String(v)}, removeItem(k){delete this._d[k]} };
const RUTA = process.env.SDP_OUTBOX || path.resolve('src/data/outbox.js');
const ob = await import(pathToFileURL(RUTA).href);

await ob.encua({ id: 'lapR', tipus: 'chat', carrega: {} });

const orig = IDBObjectStore.prototype.delete;
IDBObjectStore.prototype.delete = function () {
  const tx = this.transaction;
  const req = { onsuccess: null, onerror: null, error: new DOMException('disc ple', 'UnknownError') };
  queueMicrotask(() => {
    const ev = { target: req, defaultPrevented: false, preventDefault() { ev.defaultPrevented = true; } };
    req.onerror?.(ev);
    if (!ev.defaultPrevented) { try { tx.abort(); } catch {} }
  });
  return req;
};
let resultat, err;
try { resultat = await ob.confirma('lapR'); } catch (e) { err = e; } finally { IDBObjectStore.prototype.delete = orig; }
const r = (await ob.pendents()).find(x => x.id === 'lapR');
const lot = await ob.reclama();
const reagafat = lot.some(x => x.id === 'lapR');
console.log(`confirma():           ${err ? 'REBUTJADA (' + err.message + ')' : resultat}`);
console.log(`estat del registre:   ${r?.estat}`);
console.log(`reclama() el reagafa: ${reagafat ? 'SÍ → REENVIAMENT DUPLICAT' : 'no'}`);
process.exit(reagafat ? 1 : 0);
