#!/usr/bin/env node
/**
 * captura-contracte.mjs — Desa la FORMA d'una resposta real de Sollutia,
 * mai les dades. Serveix per a escriure el traductor contra el JSON que
 * Sollutia ja oferix (zero exigències) i per a detectar quan canvia.
 *
 * ANONIMITZACIÓ (RGPD art. 5.1.c, minimització): cada valor es reemplaça
 * per un testimoni del mateix tipus i format. uuid → uuid zero, data ISO →
 * època, correu → anonim@exemple.invalid, URL → https://exemple.invalid/,
 * text → «text», nombre → 0. Les llistes es retallen a 2 elements.
 * Només GET. El token el poses tu per entorn; no es desa enlloc.
 *
 *   SOLLUTIA_TOKEN=… node tooling/sollutia/captura-contracte.mjs \
 *     --url=https://…/api/recurs --recurs=perfil
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { forma } from './forma.mjs';

const arg = (n) => process.argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3);
const url = arg('url'); const recurs = arg('recurs');
if (!url || !recurs || !/^[a-z0-9_-]+$/.test(recurs)) {
  console.error('Ús: --url=<GET de Sollutia> --recurs=<nom-en-minúscules>'); process.exit(2);
}

const resp = await fetch(url, { method: 'GET', headers: { Accept: 'application/json', ...(process.env.SOLLUTIA_TOKEN ? { Authorization: `Bearer ${process.env.SOLLUTIA_TOKEN}` } : {}) } });
if (!resp.ok) { console.error(`HTTP ${resp.status}`); process.exit(1); }
const dir = join(process.cwd(), 'tests/frontissa/fixtures/sollutia');
mkdirSync(dir, { recursive: true });
const eixida = { recurs, ruta: new URL(url).pathname, capturat: new Date().toISOString(), forma: forma(await resp.json()) };
writeFileSync(join(dir, `${recurs}.json`), JSON.stringify(eixida, null, 2) + '\n');
console.log(`✅ Forma de «${recurs}» desada (sense dades personals).`);
