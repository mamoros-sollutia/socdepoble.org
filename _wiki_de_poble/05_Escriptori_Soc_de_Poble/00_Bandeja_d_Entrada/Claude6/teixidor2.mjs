#!/usr/bin/env node
/**
 * teixidor2.mjs — COHESIÓ DIRIGIDA DEL GRAF (substituix T3 de teixidor.mjs)
 *
 * PER QUÈ EXISTIX
 * ───────────────
 *   `teixidor.mjs` calcula components sobre `veins = ix ∪ entra`, és a dir
 *   sobre la PROJECCIÓ NO DIRIGIDA. Això fa que un document que apunta al
 *   nucli però que el nucli mai no apunta compte com a «cosit». No ho està:
 *   cap agent que navegue endavant des de l'àncora hi arribarà mai.
 *
 *   Mesura al bundle 260831 (àncora substituta 00_INDEX, l'oficial no hi és):
 *     teixidor.mjs  → 12 illes · 25 documents         (feble)
 *     teixidor2.mjs → 38 documents inabastables       (dirigit)
 *   La mètrica vella subestima el trencament en un 52%.
 *
 * LLEIS
 *   D1 INABASTABLE   no s'hi arriba seguint enllaços endavant des de l'àncora
 *   D2 SENSE-RETORN  s'hi arriba però no es pot tornar a l'àncora (cul-de-sac)
 *   D3 SCC-BAIX      el component fortament connex de l'àncora cobrix < LLINDAR
 *   D4 ANCORA-ABSENT l'àncora declarada no és al disc  → exit 2, sempre
 *
 * Pedra Seca: zero dependències, ESM, fail-closed.
 *
 *   node tooling/wiki/teixidor2.mjs --arrel=.
 *   node tooling/wiki/teixidor2.mjs --json
 *   node tooling/wiki/teixidor2.mjs --pla        # pla de sutura idiomàtic
 *   node tooling/wiki/teixidor2.mjs --llindar=90
 */

import fs from 'node:fs';
import path from 'node:path';

const ARG = (n) => process.argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3) ?? null;
const ARREL = path.resolve(ARG('arrel') ?? process.cwd());
const ANCORA = ARG('ancora') ?? '00_INDEX_ESCRIPTORI';
const ARRELS = (ARG('arrels') ?? '_wiki_de_poble,.agents').split(',');
const LLINDAR = Number(ARG('llindar') ?? 90);
const JSON_OUT = process.argv.includes('--json');
const PLA = process.argv.includes('--pla');

const EXCLOU = /(^|\/)(node_modules|\.git|\.obsidian|dist|build|90_arxiu_historic)(\/|$)/;

/* ───────────────────────────── Recollida ───────────────────────────── */

function md(dir, acc = []) {
  const abs = path.join(ARREL, dir);
  if (!fs.existsSync(abs)) return acc;
  for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
    const rel = path.posix.join(dir, e.name);
    if (EXCLOU.test(rel)) continue;
    if (e.isDirectory()) md(rel, acc);
    else if (e.name.endsWith('.md')) acc.push(rel);
  }
  return acc;
}

const NODES = ARRELS.flatMap((d) => md(d)).sort();
if (NODES.length === 0) {
  console.error(`❌ [TEIXIDOR2] Cap document a ${ARRELS.join(', ')} des de ${ARREL}.`);
  process.exit(2);
}

const perNom = new Map();
for (const n of NODES) {
  const clau = path.basename(n, '.md');
  if (!perNom.has(clau)) perNom.set(clau, []);
  perNom.get(clau).push(n);
}

const nodeAncora = NODES.find((n) => path.basename(n, '.md') === ANCORA);
if (!nodeAncora) {
  /* D4. Sense àncora no hi ha «abast des de». Fallem tancat i ho diem clar:
   * si l'àncora viu fora de l'abast del bundle, l'auditoria és irreproduïble. */
  console.error(`❌ [TEIXIDOR2] D4 · L'àncora «${ANCORA}» no és a ${ARRELS.join(', ')}.`);
  console.error('   Si l\'àncora queda fora del contracte del bundle, cap auditor extern');
  console.error('   pot reproduir la mètrica. Inclou-la al contracte o canvia d\'àncora:');
  console.error('     --ancora=00_INDEX   |   --arrels=_wiki_de_poble,.agents');
  process.exit(2);
}

/* ─────────────────────────── Graf dirigit ─────────────────────────── */

const ENLLAC = /\[\[([^\]|#]+)(?:[#|][^\]]*)?\]\]/g;
const LINIA_ETIQUETA = /^\s*[-*]?\s*\*{0,2}(Categoria|Etiquetes|Etiqueta|Tags?|Tema)\*{0,2}\s*:/i;

const ix = new Map(NODES.map((n) => [n, new Set()]));
const entra = new Map(NODES.map((n) => [n, new Set()]));
const penjats = [];

for (const n of NODES) {
  const linies = fs.readFileSync(path.join(ARREL, n), 'utf8').split('\n');
  let dinsCodi = false;
  linies.forEach((ln, i) => {
    if (/^\s*```/.test(ln)) { dinsCodi = !dinsCodi; return; }
    if (dinsCodi || LINIA_ETIQUETA.test(ln)) return;
    for (const m of ln.matchAll(ENLLAC)) {
      const clau = path.basename(m[1].trim()).replace(/\.md$/, '');
      const destins = perNom.get(clau);
      if (!destins) { penjats.push({ font: n, linia: i + 1, desti: clau }); continue; }
      for (const d of destins) {
        if (d === n) continue;
        ix.get(n).add(d);
        entra.get(d).add(n);
      }
    }
  });
}

/* ────────────────────── Abast dirigit i SCC ────────────────────── */

const abast = (arrel, adj) => {
  const vist = new Set([arrel]);
  const cua = [arrel];
  while (cua.length) for (const v of adj.get(cua.pop()) ?? []) if (!vist.has(v)) { vist.add(v); cua.push(v); }
  return vist;
};

const endavant = abast(nodeAncora, ix);      /* el que un agent pot navegar */
const enrere = abast(nodeAncora, entra);     /* el que pot arribar a l'àncora */

const scc = new Set([...endavant].filter((n) => enrere.has(n)));  /* SCC de l'àncora */
const inabastables = NODES.filter((n) => !endavant.has(n));       /* D1 */
const senseRetorn = [...endavant].filter((n) => !enrere.has(n) && n !== nodeAncora); /* D2 */
const cobertura = Math.round((100 * scc.size) / NODES.length);    /* D3 */

/* Agrupació per directori: el pla de sutura és per illa, no per fitxer. */
const perDir = new Map();
for (const n of inabastables) {
  const d = path.dirname(n);
  if (!perDir.has(d)) perDir.set(d, []);
  perDir.get(d).push(n);
}

/* Candidats a pont: inabastables que JA apunten cap al nucli.
 * Cosir-los és una sola aresta d'anada; no cal inventar-se res. */
const pontsBarats = inabastables.filter((n) => [...ix.get(n)].some((d) => scc.has(d)));

/* ──────────────────────────────── Eixida ──────────────────────────────── */

if (JSON_OUT) {
  console.log(JSON.stringify({
    ok: inabastables.length === 0 && cobertura >= LLINDAR,
    ancora: nodeAncora,
    compte: { nodes: NODES.length, scc: scc.size, cobertura, inabastables: inabastables.length, senseRetorn: senseRetorn.length, penjats: penjats.length },
    inabastables, senseRetorn, pontsBarats,
  }, null, 2));
  process.exit(inabastables.length === 0 && cobertura >= LLINDAR ? 0 : 1);
}

if (PLA) {
  console.log(`# Pla de sutura — generat de ${nodeAncora}\n`);
  console.log('## 1. Ponts barats (ja apunten al nucli; només falta l\'aresta de tornada)\n');
  for (const n of pontsBarats) console.log(`- [ ] Declara \`[[${path.basename(n, '.md')}]]\` des d'un node del nucli`);
  console.log('\n## 2. Illes per directori (una nota-índex per directori, enllaçada des de l\'àncora)\n');
  const nomIndex = (d) => `00_INDEX_${path.basename(d).replace(/^[._]+/, '').toUpperCase()}`;
  for (const [d, ns] of [...perDir].sort((a, b) => b[1].length - a[1].length)) {
    if (ns.every((n) => pontsBarats.includes(n))) continue;
    console.log(`### ${d}  (${ns.length} doc)`);
    console.log(`- [ ] Crea \`${d}/${nomIndex(d)}.md\``);
    console.log(`- [ ] Enllaça-la des de \`${nodeAncora}\``);
    console.log('- [ ] Dins d\'ella, enllaça:');
    for (const n of ns) console.log(`      - [[${path.basename(n, '.md')}]]`);
    console.log(`- [ ] A cada fitxer, afig al peu: \`Torna a [[${nomIndex(d)}]]\`\n`);
  }
  process.exit(0);
}

console.log('\n🧭 TEIXIDOR2 — cohesió DIRIGIDA');
console.log('─'.repeat(72));
console.log(`  ${NODES.length} documents · àncora: ${nodeAncora}`);
console.log(`  SCC de l'àncora: ${scc.size}/${NODES.length} (${cobertura}%)  ·  llindar exigit: ${LLINDAR}%`);

console.log(`\n${inabastables.length === 0 ? '✅' : '❌'} D1 · INABASTABLE des de l'àncora — ${inabastables.length}`);
for (const [d, ns] of [...perDir].sort((a, b) => b[1].length - a[1].length).slice(0, 8)) {
  console.log(`      ${String(ns.length).padStart(3)} doc · ${d}`);
}

console.log(`\n${senseRetorn.length === 0 ? '✅' : '·'} D2 · SENSE RETORN a l'àncora — ${senseRetorn.length}`);
for (const n of senseRetorn.slice(0, 8)) console.log(`      ${n}`);

console.log(`\n${cobertura >= LLINDAR ? '✅' : '❌'} D3 · SCC-BAIX — cobertura ${cobertura}% (mínim ${LLINDAR}%)`);
console.log(`\n·  Ponts barats disponibles: ${pontsBarats.length} (ja apunten al nucli; --pla els llista)`);

console.log(`\n${'─'.repeat(72)}`);
if (inabastables.length > 0 || cobertura < LLINDAR) {
  console.error(`PARAT. ${inabastables.length} document(s) fora del graf navegable. Usa --pla.`);
  process.exit(1);
}
console.log('PASSA. El graf és navegable en les dos direccions.');
process.exit(0);
