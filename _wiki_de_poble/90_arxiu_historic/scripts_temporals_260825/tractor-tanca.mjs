#!/usr/bin/env node
/**
 * tractor-tanca.mjs — porta d'obligatorietat de La Tanca
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * El diagnòstic de govern del projecte és «Fer una vegada ≠ Continuar fent»:
 * les eines es construïxen bé i després es desconnecten en silenci.
 * `core/safety.mjs` n'és la prova — nucli transaccional impecable, amb
 * `withRollback` a ZERO invocacions.
 *
 * Esta porta impedix que li passe el mateix a la Tanca. Comprova tres lleis
 * mecàniques sobre tot script de `tooling/` i `scripts/`:
 *
 *   T1 · CAP ESCRIPTURA CRUA
 *        Un fitxer que crida writeFile/rm/unlink/rename/truncate ha
 *        d'importar la Tanca. Si no, l'escriptura no té instantània, ni
 *        pressupost, ni rebut, ni rollback.
 *
 *   T2 · CAP MUTACIÓ A L'IMPORT
 *        Un script mutador no pot executar-se al nivell superior del mòdul.
 *        `fix-inline.mjs` cridava `scanDir(ROOT)` a la línia 44 sense guarda:
 *        n'hi havia prou amb importar-lo per a mutar tot `src/`.
 *
 *   T3 · CAP EXCEPCIÓ SENSE JUSTIFICACIÓ
 *        Les exempcions viuen a `tooling/gates/tanca.exempcions` amb un
 *        motiu escrit. Una exempció sense motiu és una porta oberta.
 *
 * Zero dependències. Ús:
 *   node tooling/gates/tractor-tanca.mjs [--root .]
 *
 * Eixida: 0 net · 1 infraccions · 2 error d'execució.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const ROOT = (() => {
  const i = process.argv.indexOf('--root');
  return path.resolve(i > -1 ? process.argv[i + 1] : process.cwd());
})();

const CARPETES = ['tooling', 'scripts'];

/* Crides que muten el disc. `mkdir` i `copyFile` no destruïxen res. */
const MUTADORES = [
  'writeFileSync', 'writeFile',
  'appendFileSync', 'appendFile',
  'rmSync', 'unlinkSync', 'unlink', 'rmdirSync',
  'renameSync', 'rename',
  'truncateSync', 'truncate',
  'cpSync', 'createWriteStream'
];

const EXEMPTS_PER_NATURALESA = [
  'tooling/gates/tanca.mjs',            // la Tanca mateixa
  'tooling/wiki/core/safety.mjs'        // nucli previ, en substitució
];

const infraccions = [];
const avisos = [];
const OK = [];

const falla = (llei, fitxer, linia, missatge) => infraccions.push({ llei, fitxer, linia, missatge });

/* ── Exempcions declarades ────────────────────────────────────────────── */

function llegirExempcions() {
  const cami = path.join(ROOT, 'tooling/gates/tanca.exempcions');
  const mapa = new Map();
  if (!existsSync(cami)) return mapa;
  for (const linia of readFileSync(cami, 'utf8').split('\n')) {
    const net = linia.trim();
    if (!net || net.startsWith('#')) continue;
    const tall = net.indexOf('#');
    if (tall < 0) {
      falla('T3 · Exempció sense motiu', 'tooling/gates/tanca.exempcions', 0,
        `«${net}» no porta motiu. Format: <ruta>  # motiu escrit.`);
      continue;
    }
    const ruta = net.slice(0, tall).trim();
    const motiu = net.slice(tall + 1).trim();
    if (motiu.length < 15) {
      falla('T3 · Exempció sense motiu', 'tooling/gates/tanca.exempcions', 0,
        `«${ruta}» té un motiu de ${motiu.length} caràcters. Escriu-ne un de real.`);
      continue;
    }
    mapa.set(ruta, motiu);
  }
  return mapa;
}

/* ── Recorregut ───────────────────────────────────────────────────────── */

function arbre(relBase) {
  const base = path.join(ROOT, relBase);
  if (!existsSync(base)) return [];
  const eixida = [];
  const passeja = (dir) => {
    for (const nom of readdirSync(dir)) {
      if (nom === 'node_modules' || nom.startsWith('.git')) continue;
      const p = path.join(dir, nom);
      if (statSync(p).isDirectory()) passeja(p);
      else if (/\.(mjs|cjs|js)$/.test(nom)) eixida.push(p);
    }
  };
  passeja(base);
  return eixida;
}

/**
 * Buida cadenes i comentaris conservant les línies.
 *
 * Ha de ser una PASSADA ÚNICA. Una cadena de `.replace()` falla sempre:
 * si esborres els comentaris primer, el `//` que hi ha dins d'un literal de
 * plantilla (`${indent}// eslint-disable-next-line`) es menja el backtick de
 * tancament, i el següent regex de plantilla engolix mig fitxer. Eixe bug
 * exacte feia invisible `fix-inline.mjs` per a esta porta — el culpable
 * escapava del detector perquè el detector estava escrit amb la mateixa
 * lleugeresa que el culpable.
 */
function despullar(codi) {
  const eixida = Array.from(codi);
  const buida = (des, fins) => {
    for (let k = des; k < fins && k < eixida.length; k++) {
      if (eixida[k] !== '\n') eixida[k] = ' ';
    }
  };

  let i = 0;
  let anterior = '';
  const n = codi.length;

  while (i < n) {
    const c = codi[i];
    const seg = codi[i + 1];

    if (c === '/' && seg === '/') {
      let j = i;
      while (j < n && codi[j] !== '\n') j++;
      buida(i, j);
      i = j;
      continue;
    }
    if (c === '/' && seg === '*') {
      let j = i + 2;
      while (j < n && !(codi[j] === '*' && codi[j + 1] === '/')) j++;
      buida(i, j + 2);
      i = j + 2;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      const delim = c;
      let j = i + 1;
      while (j < n) {
        if (codi[j] === '\\') { j += 2; continue; }
        if (codi[j] === delim) { j++; break; }
        j++;
      }
      buida(i + 1, j - 1);
      anterior = delim;
      i = j;
      continue;
    }
    if (c === '/' && !/[\w)\]]/.test(anterior)) {
      let j = i + 1;
      let dinsClasse = false;
      let tancat = false;
      while (j < n) {
        if (codi[j] === '\\') { j += 2; continue; }
        if (codi[j] === '[') dinsClasse = true;
        else if (codi[j] === ']') dinsClasse = false;
        else if (codi[j] === '\n') break;
        else if (codi[j] === '/' && !dinsClasse) { tancat = true; break; }
        j++;
      }
      if (tancat) { buida(i + 1, j); anterior = '/'; i = j + 1; continue; }
    }

    if (!/\s/.test(c)) anterior = c;
    i++;
  }

  return eixida.join('');
}

function esTombstone(codi) {
  return /SDP-LOCK:.*(retirad|retirat)/i.test(codi);
}

function usaLaTanca(codi) {
  return /from\s+['"][^'"]*gates\/tanca\.mjs['"]/.test(codi) || /obriTanca\s*\(/.test(codi);
}

/* T2 · detecta crides al nivell superior del mòdul (columna 0, fora de guarda) */
function mutacioAlNivellSuperior(codi) {
  const net = despullar(codi);
  const teGuarda = /import\.meta\.url\s*===|require\.main\s*===|process\.argv\[1\]/.test(net);
  if (teGuarda) return null;

  const linies = net.split('\n');
  for (let i = 0; i < linies.length; i++) {
    const l = linies[i];
    // crida a funció a columna 0 que no siga declaració ni export
    const m = /^([A-Za-z_$][\w$]*)\s*\(/.exec(l);
    if (!m) continue;
    const nom = m[1];
    if (['if', 'for', 'while', 'switch', 'catch', 'function', 'return', 'import', 'export', 'console', 'process'].includes(nom)) continue;
    return { linia: i + 1, nom };
  }
  return null;
}

/* ── Execució ─────────────────────────────────────────────────────────── */

const exempcions = llegirExempcions();
let escanejats = 0;

for (const carpeta of CARPETES) {
  for (const abs of arbre(carpeta)) {
    const rel = path.relative(ROOT, abs).split(path.sep).join('/');
    if (EXEMPTS_PER_NATURALESA.includes(rel)) continue;

    const codi = readFileSync(abs, 'utf8');
    escanejats++;

    if (esTombstone(codi)) continue; // fitxers ja retirats amb SDP-LOCK

    const net = despullar(codi);
    const trobades = [];
    for (const fn of MUTADORES) {
      const re = new RegExp(`\\b${fn}\\s*\\(`, 'g');
      let m;
      while ((m = re.exec(net))) {
        const linia = net.slice(0, m.index).split('\n').length;
        trobades.push({ fn, linia });
      }
    }

    if (!trobades.length) continue;

    const exempt = exempcions.get(rel);
    if (exempt) { avisos.push({ fitxer: rel, missatge: `exempt: ${exempt}` }); continue; }

    if (!usaLaTanca(codi)) {
      const resum = [...new Set(trobades.map((t) => t.fn))].join(', ');
      falla('T1 · Escriptura crua', rel, trobades[0].linia,
        `${trobades.length} mutació(ns) directes (${resum}) sense passar per la Tanca: sense instantània, sense pressupost, sense rebut, sense rollback.`);
    }

    /* Els fitxers de prova s'executen a l'import per disseny (node:test). */
    const esProva = /(^|\/)tests?\//.test(rel) || /\.test\.(mjs|cjs|js)$/.test(rel);
    const nivell = esProva ? null : mutacioAlNivellSuperior(codi);
    if (nivell) {
      falla('T2 · Mutació a l\'import', rel, nivell.linia,
        `\`${nivell.nom}()\` s'executa al nivell superior del mòdul sense guarda d'entrada. Importar este fitxer ja muta el disc.`);
    }
  }
}

if (!infraccions.some((i) => i.llei.startsWith('T1'))) OK.push('T1 · Cap escriptura crua');
if (!infraccions.some((i) => i.llei.startsWith('T2'))) OK.push('T2 · Cap mutació a l\'import');
if (!infraccions.some((i) => i.llei.startsWith('T3'))) OK.push('T3 · Exempcions justificades');

/* ── Informe ──────────────────────────────────────────────────────────── */

const banda = '─'.repeat(72);
console.log(`\n🧱 TRACTOR DE LA TANCA — ${path.basename(ROOT)}  (${escanejats} scripts)`);
console.log(banda);

for (const l of OK) console.log(`  ✅ ${l}`);

if (avisos.length) {
  console.log(`\n⚠️  EXEMPCIONS ACTIVES (${avisos.length})`);
  for (const a of avisos) console.log(`  · ${a.fitxer} — ${a.missatge}`);
}

if (infraccions.length) {
  console.log(`\n❌ INFRACCIONS (${infraccions.length})\n${banda}`);
  const perLlei = new Map();
  for (const i of infraccions) {
    if (!perLlei.has(i.llei)) perLlei.set(i.llei, []);
    perLlei.get(i.llei).push(i);
  }
  for (const [llei, llista] of perLlei) {
    console.log(`\n  ${llei}  (${llista.length})`);
    for (const i of llista.slice(0, 15)) {
      console.log(`    ${i.fitxer}${i.linia ? ':' + i.linia : ''}`);
      console.log(`      ↳ ${i.missatge}`);
    }
    if (llista.length > 15) console.log(`    … i ${llista.length - 15} més.`);
  }
  console.log(`\n${banda}`);
  console.log(`El bancal no passa. ${infraccions.length} infraccions.\n`);
  process.exit(1);
}

console.log(`\n${banda}\nTanca sencera. Cap script pot escriure a esquena del sistema.\n`);
process.exit(0);
