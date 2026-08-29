// Prova: després d'una càrrega amb xarxa, sense xarxa es veu el POBLE o la LLAVOR?
import path from 'node:path';
import { pathToFileURL } from 'node:url';
await import('fake-indexeddb/auto');
globalThis.window = globalThis;
globalThis.localStorage = { _d:{}, getItem(k){return this._d[k]??null}, setItem(k,v){this._d[k]=String(v)}, removeItem(k){delete this._d[k]} };
const RUTA = process.env.SDP_BACKEND || path.resolve('src/data/supabaseBackend.js');
const be = await import(pathToFileURL(RUTA).href);

const json = (x) => Promise.resolve({ ok: true, status: 200, json: async () => x, text: async () => '' });
const online = (url) => {
  if (url.includes('/app_content')) return json([{ key: 'towns', payload: [{ id: 'benifallim', title: 'Benifallim (REAL)', created_at: '2026-08-01' }], version: 1 }]);
  if (url.includes('/chat_threads')) return json([{ id: 't1', payload: { name: 'Fil' } }]);
  return json([]);
};
const offline = () => Promise.reject(new TypeError('Failed to fetch'));
const cfg = (mode) => ({ supabaseUrl: 'https://x.supabase.co', supabaseAnonKey: 'anon', dataMode: mode });

for (const mode of ['remote', 'hybrid']) {
  globalThis.fetch = online;
  const amb = await be.loadAppData('u1', cfg(mode));
  globalThis.fetch = offline;
  let sense, err;
  try { sense = await be.loadAppData('u1', cfg(mode)); } catch (e) { err = e; }
  const titols = (sense?.towns || []).map((t) => t.title);
  const veredicte = err ? `ERROR (${err.message})` : titols.some((t) => t.includes('REAL')) ? 'EL POBLE REAL' : `LA LLAVOR (${titols.slice(0, 3).join(', ')}…)`;
  console.log(`${mode.padEnd(7)} amb xarxa: ${amb.towns[0]?.title}  |  sense xarxa: ${veredicte}`);
}
process.exit(0);
