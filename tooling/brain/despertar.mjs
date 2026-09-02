#!/usr/bin/env node
/**
 * despertar.mjs — ARRENCADA COGNITIVA DETERMINISTA
 *
 * CORRECCIONS DE L'AUDITORIA 260829:
 *
 *   1. Usava `process.cwd()`. Executat des d'un subdirectori deia
 *      «El directori de l'Escriptori no existeix» i eixia amb codi 0.
 *      Fail-OPEN: l'agent es despertava creient que l'escriptori estava
 *      buit. Ara usa `discoverProjectRoot()` i falla tancat.
 *
 *   2. Hardcodejava '_wiki_de_poble/05_Escriptori_Soc_de_Poble' — era la
 *      còpia número 20 del literal. Ara importa ESCRIPTORI_DIR.
 *
 *   3. NO estava a `package.json`. Zero cridadors. La mateixa malaltia que
 *      `arrancaSincronitzador`: existir no és ser cridat.
 *      Afig a scripts:  "despertar": "node tooling/brain/despertar.mjs"
 *
 *   4. AVÍS NOU: l'escriptori està exclòs de build_rag_index.mjs,
 *      edge_rag.mjs i build_slug_index.mjs. Mentre això dure, l'agent NO
 *      pot recuperar per RAG res del seu propi lloc de treball, i sí que
 *      pot recuperar els directoris històrics. Per això acabava desant a
 *      10_actes. Aquest script avisa cada matí fins que es corregisca.
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { execSync } from 'node:child_process';
import {
  PROJECT_DIR,
  ESCRIPTORI_DIR,
  EN_CURS_FILE,
  DEUTE_PEDRA_SECA_FILE,
  DEUTE_DISSENY_FILE,
  DEUTE_VOCABULARI_FILE
} from '../wiki/lib/project_paths.mjs';
import { isValidContentFile, EXEMPT_BASENAMES, titolDinsDeLimits } from '../wiki/lib/termodinamic.mjs';

const rel = (p) => relative(PROJECT_DIR, p) || '.';
const titol = (t) => console.log(`\n--- ${t} ---`);

console.log('\n🌞 BON DIA, IAIA. Arrencada Cognitiva.\n');
console.log(`Arrel del projecte: ${PROJECT_DIR}`);

// Àncora de seguretat inicial
try {
  execSync('node tooling/brain/ancora.mjs --pon "arranc de sessio"', { cwd: PROJECT_DIR, stdio: 'inherit' });
} catch (_e) {
  if (process.env.SDP_FORCA_ARRENCADA === '1') {
    console.log('⚠ Entrada forçada sense àncora. Queda constància.');
  } else {
    console.error('⚠ FALLA: No s\'ha pogut crear l\'àncora de sessió. Sistema bloquejat per a evitar Dia de la Marmota. Usa SDP_FORCA_ARRENCADA=1 per forçar.');
    process.exit(1);
  }
}

/* ─── 1. Git ─── */
titol('ESTAT DE GIT');
try {
  const branca = execSync('git branch --show-current', { cwd: PROJECT_DIR }).toString().trim();
  const estat = execSync('git status --short', { cwd: PROJECT_DIR }).toString().trim();
  console.log(`Branca: ${branca}`);
  console.log(estat ? `Canvis no confirmats:\n${estat}` : 'Arbre de treball net.');
} catch {
  console.log('No s\'ha pogut llegir Git.');
}

/* ─── 2. Deute mecànic ─── */
titol('DEUTE MECÀNIC');
const deutes = [
  ['Pedra Seca', DEUTE_PEDRA_SECA_FILE],
  ['Disseny', DEUTE_DISSENY_FILE],
  ['Vocabulari', DEUTE_VOCABULARI_FILE]
];
let capDeute = true;
for (const [nom, fitxer] of deutes) {
  if (!existsSync(fitxer)) {
    console.log(`${nom.padEnd(12)}: sense baseline (${rel(fitxer)})`);
    continue;
  }
  capDeute = false;
  try {
    const d = JSON.parse(readFileSync(fitxer, 'utf8'));
    const total = Object.values(d).reduce((s, v) => s + (v.max || 0), 0);
    const detall = Object.entries(d).filter(([, v]) => v.max > 0)
      .map(([k, v]) => `${k}=${v.max}`).join(' ');
    console.log(`${nom.padEnd(12)}: ${total}  ${detall}`);
  } catch {
    console.log(`${nom.padEnd(12)}: fitxer de deute malmés.`);
  }
}
if (capDeute) console.log('Cap baseline congelat. Executa `npm run porta:baseline`.');

/* ─── 3. Escriptori — FAIL CLOSED ─── */
titol('ESCRIPTORI');
if (!existsSync(ESCRIPTORI_DIR)) {
  console.error(`PARAT. No existix ${rel(ESCRIPTORI_DIR)}.`);
  console.error('L\'escriptori és l\'única destinació de treball actiu. Sense ell no hi ha sessió.');
  process.exit(1);
}
const fitxers = readdirSync(ESCRIPTORI_DIR).filter(f => f.endsWith('.md'));
if (fitxers.length === 0) {
  console.log('L\'escriptori està buit.');
} else {
  for (const f of fitxers) {
    const exempt = EXEMPT_BASENAMES.has(f);
    const valid = exempt || isValidContentFile(f);
    const llarg = valid && !exempt && !titolDinsDeLimits(f);
    const marca = !valid ? '✗ NOM' : llarg ? '· títol llarg' : ' ';
    console.log(`  ${marca.padEnd(14)} ${f}`);
  }
}

/* ─── 4. Tasca en curs ─── */
titol('TASCA EN CURS');
console.log(existsSync(EN_CURS_FILE)
  ? readFileSync(EN_CURS_FILE, 'utf8')
  : `No hi ha ${rel(EN_CURS_FILE)}. Cap tasca oberta.`);

/* ─── 5. Avís de ceguesa del RAG ─── */
const cecs = ['tooling/wiki/core/build_rag_index.mjs',
               'tooling/wiki/core/edge_rag.mjs',
               'tooling/wiki/core/build_slug_index.mjs']
  .filter(f => {
    const abs = join(PROJECT_DIR, f);
    return existsSync(abs) && readFileSync(abs, 'utf8').includes("includes('05_Escriptori')");
  });

if (cecs.length > 0) {
  titol('⚠ AVÍS: L\'ESCRIPTORI ÉS INVISIBLE PER AL RAG');
  console.log('Estos indexadors salten 05_Escriptori:');
  for (const c of cecs) console.log(`  ${c}`);
  console.log('Els directoris històrics (10_actes) SÍ que s\'indexen.');
  console.log('Mentre dure, la recuperació et portarà a l\'arxiu i no a la taula de treball.');
}

console.log('\n🤖 Context carregat. Tot el treball actiu va a ' + rel(ESCRIPTORI_DIR) + '\n');
process.exit(0);
