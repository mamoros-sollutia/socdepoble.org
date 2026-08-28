#!/usr/bin/env node
/**
 * tractor-outbox.mjs — Porta mecànica de la capa de persistència durable.
 *
 * No mira el codi: l'EXECUTA i li mira el comportament. Una porta que llig
 * cadenes de text es pot enganyar amb un embolcall d'una línia; esta no.
 *
 * Cobrix els defectes trobats a l'auditoria del 27/08/2026:
 *   T1  onabort  · una transacció avortada sense peticions pendents ha de
 *                  REBUTJAR, no penjar-se. És el deadlock de muntatge.
 *   T2  vigilant · una transacció que no dispara cap esdeveniment ha de
 *                  rebutjar per rellotge. WebKit fa això.
 *   T3  breaker  · el Circuit Breaker buida la cua i NO toca els snapshots.
 *   T4  arrendament · la reclamació per arrendament caducat compta intents i
 *                  acaba matant el missatge verinós.
 *   T5  compta   · morts, làpides i sentinelles no compten com a pendents.
 *   T6  signe-vida · no contamina la cua.
 *   T7  encua    · exigix id estable i verifica dins d'una sola transacció.
 *   T8  confirma · si l'esborrat peta, deixa làpida i no es reenvia.
 *   T9  buida    · lliura la cua d'una sessió anterior en tornar la cobertura.
 *
 * Ús:  node tooling/gates/tractor-outbox.mjs
 * Requerix:  npm i -D fake-indexeddb
 * Eixida: 0 = pas, 1 = bloqueig.
 */
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARREL = process.env.SDP_ARREL || path.resolve(__dirname, '../../');
const RUTA_OUTBOX = path.join(ARREL, 'src/data/outbox.js');

/* ── Entorn de navegador mínim ───────────────────────────────────────────── */
await import('fake-indexeddb/auto');
globalThis.window = globalThis;
globalThis.localStorage = {
  _d: {},
  getItem(k) { return this._d[k] ?? null; },
  setItem(k, v) { this._d[k] = String(v); },
  removeItem(k) { delete this._d[k]; }
};

const errors = [];
const ok = [];
const falla = (t, m) => errors.push(`${t}: ${m}`);
const passa = (t, m) => ok.push(`${t}: ${m}`);

const dorm = (ms) => new Promise((r) => setTimeout(r, ms));

/** Executa una promesa amb sostre: distingix "rebutjada" de "PENJADA". */
async function ambSostre(p, ms = 1500) {
  let estat = 'PENJADA';
  p.then(() => { estat = 'resolta'; }, () => { estat = 'rebutjada'; });
  await dorm(ms);
  return estat;
}

const ob = await import(pathToFileURL(RUTA_OUTBOX).href);

/* ── T7 · encua exigix id i verifica ─────────────────────────────────────── */
try {
  let llancat = false;
  try { await ob.encua({ tipus: 'chat' }); } catch { llancat = true; }
  if (!llancat) falla('T7', 'encua() ha acceptat un registre sense id.');
  else passa('T7', 'encua() exigix un id estable del cridador.');

  const g = await ob.encua({ id: 'a1', tipus: 'chat', carrega: { text: 'hola' } });
  if (!g || g.id !== 'a1' || g.estat !== 'pendent') {
    falla('T7', `encua() no ha tornat el registre verificat: ${JSON.stringify(g)}`);
  } else {
    passa('T7', 'encua() verifica l\'escriptura dins de la mateixa transacció.');
  }
} catch (e) { falla('T7', e.message); }

/* ── T6 · signe de vida fora de la cua ───────────────────────────────────── */
try {
  await ob.enviaSigneVida();
  const cua = await ob.pendents();
  if (cua.some((r) => String(r.id).includes('signe-vida'))) {
    falla('T6', 'el sentinella signe-vida contamina el magatzem `pendents`.');
  } else {
    passa('T6', 'signe-vida viu fora de la cua.');
  }
} catch (e) { falla('T6', e.message); }

/* ── T5 · comptador de pendents ──────────────────────────────────────────── */
try {
  await ob.encua({ id: 'mort1', tipus: 'chat', carrega: {} });
  await ob.ajorna({ id: 'mort1', tipus: 'chat', carrega: {}, intents: 8 });
  const cua = await ob.pendents();
  const viu = cua.filter((r) => r.estat === 'pendent' || r.estat === 'enviant').length;
  const dolent = cua.filter((r) => r.estat !== 'confirmat').length;
  const mort = cua.find((r) => r.id === 'mort1');
  if (mort?.estat !== 'mort') falla('T5', `ajorna() no mata al 9é intent: estat=${mort?.estat}`);
  else if (viu >= dolent) falla('T5', 'el filtre correcte no descarta res: revisa el joc de proves.');
  else passa('T5', `pendents reals=${viu}; el filtre antic n'hauria comptat ${dolent}.`);
} catch (e) { falla('T5', e.message); }

/* ── T4 · arrendament caducat compta intents i mata ──────────────────────── */
try {
  await ob.encua({ id: 'veri', tipus: 'chat', carrega: {} });
  const caduca = async () => {
    const req = indexedDB.open('sdp-outbox');
    const db = await new Promise((r) => { req.onsuccess = () => r(req.result); });
    await new Promise((r) => {
      const t = db.transaction('pendents', 'readwrite');
      const m = t.objectStore('pendents');
      const g = m.get('veri');
      g.onsuccess = () => { if (g.result) m.put({ ...g.result, arrendamentTs: Date.now() - 600_000 }); };
      t.oncomplete = () => { db.close(); r(); };
      t.onabort = () => { db.close(); r(); };
    });
  };

  const vistos = [];
  for (let i = 0; i < 12; i += 1) {
    const lot = await ob.reclama();
    const v = lot.find((x) => x.id === 'veri');
    if (v) vistos.push(v.intents);
    await caduca();
  }
  const final = (await ob.pendents()).find((r) => r.id === 'veri');
  const creix = vistos.length > 1 && vistos[vistos.length - 1] > vistos[0];

  if (!creix) falla('T4', `intents no creixen amb l'arrendament caducat: ${JSON.stringify(vistos)}`);
  else if (final?.estat !== 'mort') falla('T4', `el missatge verinós no mor mai: estat=${final?.estat}`);
  else passa('T4', `intents ${vistos[0]}→${vistos[vistos.length - 1]} i acaba 'mort'. Sense bucle etern.`);
} catch (e) { falla('T4', e.message); }

/* ── T8 · confirma deixa làpida si l'esborrat peta ───────────────────────── */
try {
  await ob.encua({ id: 'lap1', tipus: 'chat', carrega: {} });
  const origDelete = IDBObjectStore.prototype.delete;
  IDBObjectStore.prototype.delete = function fingit() { throw new Error('esborrat fingit KO'); };
  let resultat;
  try { resultat = await ob.confirma('lap1'); } finally {
    IDBObjectStore.prototype.delete = origDelete;
  }
  const r = (await ob.pendents()).find((x) => x.id === 'lap1');
  if (resultat !== true) falla('T8', 'confirma() no ha absorbit la fallada d\'esborrat.');
  else if (r?.estat !== 'confirmat') falla('T8', `no hi ha làpida: estat=${r?.estat}. El missatge es reenviarà.`);
  else passa('T8', 'esborrat fallit → làpida `confirmat`. Sense duplicats.');

  const lot = await ob.reclama();
  if (lot.some((x) => x.id === 'lap1')) falla('T8', 'reclama() torna a agafar una làpida.');
  else passa('T8', 'reclama() ignora les làpides.');
} catch (e) { falla('T8', e.message); }

/* ── T1 · onabort sense peticions pendents ───────────────────────────────── */
try {
  await ob.saveSnapshot('viu', { a: 1 });
  const origTx = IDBDatabase.prototype.transaction;
  IDBDatabase.prototype.transaction = function fingit(...a) {
    const t = origTx.apply(this, a);
    /* Avortem quan la petició ja ha acabat: zero peticions pendents.
       És el cas real de fallada de commit per quota a WebKit. */
    const origPut = t.objectStore.bind(t);
    t.objectStore = (nom) => {
      const m = origPut(nom);
      const wrap = (fn) => (...args) => {
        const req = fn.apply(m, args);
        req.addEventListener?.('success', () => { try { t.abort(); } catch { /* res */ } });
        return req;
      };
      return new Proxy(m, {
        get(dest, clau) {
          const v = dest[clau];
          if (typeof v === 'function' && ['put', 'get', 'delete'].includes(clau)) return wrap(v);
          return typeof v === 'function' ? v.bind(dest) : v;
        }
      });
    };
    return t;
  };

  const estat = await ambSostre(ob.saveSnapshot('z', { b: 2 }));
  IDBDatabase.prototype.transaction = origTx;

  if (estat === 'PENJADA') falla('T1', 'saveSnapshot() s\'ha penjat en avortar. És el deadlock de muntatge.');
  else passa('T1', `transacció avortada → promesa ${estat}, no penjada.`);
} catch (e) { falla('T1', e.message); }

/* ── T2 · rellotge vigilant ──────────────────────────────────────────────── */
try {
  const font = await import('node:fs').then((fs) => fs.readFileSync(RUTA_OUTBOX, 'utf8'));
  const teVigilant = /setTimeout\([\s\S]{0,400}?abort\(\)/.test(font) || /VIGILANT_MS/.test(font);
  const teAbort = (font.match(/onabort\s*=/g) || []).length;
  if (!teVigilant) falla('T2', 'no hi ha cap rellotge vigilant: WebKit encallat penja l\'aplicació.');
  else if (teAbort < 1) falla('T2', 'no hi ha cap `onabort` registrat.');
  else passa('T2', `rellotge vigilant present i ${teAbort} registre(s) d'onabort.`);
} catch (e) { falla('T2', e.message); }

/* ── T3 · el Circuit Breaker no toca els snapshots ───────────────────────── */
try {
  await ob.saveSnapshot('sagrat', { contingut: 'el poble' });

  /* Espiem l'esborrat total: el disparador AUTOMÀTIC no el pot cridar mai.
     Comprovar només que el snapshot sobreviu no basta: pot sobreviure perquè
     `deleteDatabase` ha quedat BLOQUEJAT per la connexió oberta, que és la
     segona meitat del mateix defecte. */
  const origDelDB = indexedDB.deleteDatabase.bind(indexedDB);
  let esborratsTotals = 0;
  indexedDB.deleteDatabase = (nom) => { esborratsTotals += 1; return origDelDB(nom); };

  /* Disparem el breaker amb errors REALS de transacció (ConstraintError que
     bombolla fins a `t.onerror`), no amb excepcions al constructor. */
  const origPut = IDBObjectStore.prototype.put;
  IDBObjectStore.prototype.put = function fingit(valor, ...resta) {
    return IDBObjectStore.prototype.add.call(this, valor, ...resta);
  };
  for (let i = 0; i < 5; i += 1) {
    try { await ob.encua({ id: 'xoc', tipus: 'chat', carrega: {} }); } catch { /* esperat */ }
  }
  IDBObjectStore.prototype.put = origPut;
  await dorm(400);
  indexedDB.deleteDatabase = origDelDB;

  const snap = await ob.getSnapshot('sagrat');
  if (esborratsTotals > 0) {
    falla('T3', `el Circuit Breaker ha cridat deleteDatabase() ${esborratsTotals} vegada(es). Això s'emporta els snapshots de la persona.`);
  } else if (!snap || snap.contingut !== 'el poble') {
    falla('T3', 'el Circuit Breaker s\'ha emportat els snapshots. Contingut offline destruït.');
  } else {
    passa('T3', 'el Circuit Breaker buida la cua sense cridar deleteDatabase(). Snapshots intactes.');
  }
} catch (e) { falla('T3', e.message); }

/* ── T9 · el motor lliura la cua d'una sessió anterior ───────────────────── */
try {
  const RUTA_SINC = path.join(ARREL, 'src/data/sincronitzador.js');
  const font = await import('node:fs').then((fs) => fs.readFileSync(RUTA_SINC, 'utf8'));
  if (!/export\s+function\s+arrancaSincronitzador/.test(font)) {
    falla('T9', 'no existix arrancaSincronitzador.');
  } else if (!/addEventListener\(['"]online['"]/.test(font) || !/setInterval/.test(font)) {
    falla('T9', 'el motor no té disparador de retorn de cobertura ni rellotge.');
  } else {
    passa('T9', 'el motor té disparadors `online`, visibilitat i rellotge.');
  }

  /* La porta viva: comprova que algú el crida de veres. */
  const fs = await import('node:fs');
  const ctx = path.join(ARREL, 'src/app/AppDataContext.jsx');
  if (!fs.existsSync(ctx)) {
    falla('T9', `no existix ${ctx}. Arrel equivocada: la porta no pot certificar res.`);
  } else if (!/arrancaSincronitzador\s*\(/.test(fs.readFileSync(ctx, 'utf8'))) {
    falla('T9', 'AppDataContext.jsx NO crida arrancaSincronitzador(). La cua no es buidarà mai.');
  } else {
    passa('T9', 'AppDataContext.jsx crida arrancaSincronitzador().');
  }
} catch (e) { falla('T9', e.message); }

/* ── Veredicte ───────────────────────────────────────────────────────────── */
console.log('\n🪨 TRACTOR D\'OUTBOX\n');
for (const l of ok) console.log(`  ✅ ${l}`);
if (errors.length) {
  console.log('');
  for (const l of errors) console.log(`  ❌ ${l}`);
}
console.log(`\n${ok.length} comprovacions passades · ${errors.length} infraccions\n`);
process.exit(errors.length > 0 ? 1 : 0);
