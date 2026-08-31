#!/usr/bin/env node
/**
 * cens_cromatic.mjs — Cens de colors solts i pla de migració a tokens.
 *
 * PER QUÈ
 * ───────
 *   `design_guard.mjs` compta infraccions `raw-color` i les compara amb un
 *   deute congelat (`.design-guard-deute.json: raw-color = 184`). Sap QUANTES
 *   n'hi ha. No sap QUINES són, ni quines són el mateix color escrit mal, ni
 *   quines són un color que el sistema hauria de tindre i no té.
 *
 *   Sense eixa distinció, el deute no baixa mai: ningú sap per on començar.
 *   Este cens no bloqueja res. Reparteix les 184 infraccions en tres piles:
 *
 *     SOROLL      — a distància imperceptible d'un token existent. Es
 *                   substituïx per el token. Zero risc estètic.
 *     RAMPA       — neutres. No són desordre: és una escala de grisos que el
 *                   sistema necessita i no ha declarat mai.
 *     VOCABULARI  — colors amb significat que els 4 tokens canònics no poden
 *                   expressar (error, èxit, avís, paper). Falta de sistema,
 *                   no indisciplina.
 *
 * ÚS
 *   node tooling/brain/cens_cromatic.mjs
 *   node tooling/brain/cens_cromatic.mjs --json
 *   node tooling/brain/cens_cromatic.mjs --pla   # eixida sed-able per migrar
 */

import fs from 'node:fs';
import path from 'node:path';

const ARREL = process.env.SDP_ARREL || process.cwd();
const ARGS = process.argv.slice(2);
const JSON_OUT = ARGS.includes('--json');
const PLA = ARGS.includes('--pla');

const TOKENS = path.join(ARREL, 'src/config/design-tokens.json');
const ZONES = ['src', 'wordpress-plugin', 'index.html'];
const EXTS = new Set(['.css', '.jsx', '.js', '.mjs', '.json', '.html', '.php', '.svg']);

/* Llindars en OKLab. 0.02 ≈ imperceptible; 0.06 ≈ mateix to, altra lluminositat. */
const LLINDAR_SOROLL = 0.025;
const LLINDAR_FAMILIA = 0.06;
const CROMA_MAX = 0.012; // croma OKLab per davall de la qual un color és neutre

const HEX = /#([0-9a-fA-F]{3,8})\b/g;

const norm = (h) => {
  const s = h.toLowerCase();
  if (s.length === 3 || s.length === 4) return `#${[...s.slice(0, 3)].map((c) => c + c).join('')}`;
  return `#${s.slice(0, 6)}`;
};

const lin = (c) => (c / 255 <= 0.04045 ? c / 255 / 12.92 : (((c / 255) + 0.055) / 1.055) ** 2.4);

function oklab(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => lin(parseInt(hex.slice(i, i + 2), 16)));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s,
  ];
}

const dE = (a, b) => Math.hypot(...oklab(a).map((v, i) => v - oklab(b)[i]));

/* Neutralitat per croma OKLab, no per desviació RGB: #fef2f2 té els canals
 * pròxims però és un roig molt clar, i no pertany a una rampa de grisos. */
const esNeutre = (h) => { const [, a, b] = oklab(h); return Math.hypot(a, b) < CROMA_MAX; };

const lluminositat = (h) => oklab(h)[0];

/* ── Recollida ────────────────────────────────────────────────────────── */

function* fitxers(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* fitxers(p);
    else if (EXTS.has(path.extname(e.name))) yield p;
  }
}

const canonics = new Set();
(function arreplega(o) {
  if (typeof o === 'string') { for (const m of o.matchAll(HEX)) canonics.add(norm(m[1])); return; }
  if (Array.isArray(o)) { o.forEach(arreplega); return; }
  if (o && typeof o === 'object') Object.values(o).forEach(arreplega);
}(JSON.parse(fs.readFileSync(TOKENS, 'utf8'))));

const usos = new Map(); // color → { n, fitxers:Set }
for (const zona of ZONES) {
  const abs = path.join(ARREL, zona);
  if (!fs.existsSync(abs)) continue;
  const llista = fs.statSync(abs).isDirectory() ? [...fitxers(abs)] : [abs];
  for (const f of llista) {
    if (path.resolve(f) === path.resolve(TOKENS)) continue;
    const txt = fs.readFileSync(f, 'utf8');
    for (const m of txt.matchAll(HEX)) {
      const c = norm(m[1]);
      if (!usos.has(c)) usos.set(c, { n: 0, fitxers: new Set() });
      const u = usos.get(c);
      u.n += 1;
      u.fitxers.add(path.relative(ARREL, f));
    }
  }
}

/* ── Classificació ───────────────────────────────────────────────────── */

const soroll = []; const rampa = []; const vocabulari = [];
const llistaCanonics = [...canonics];

for (const [color, u] of usos) {
  if (canonics.has(color)) continue;
  const prop = llistaCanonics.reduce((a, b) => (dE(color, b) < dE(color, a) ? b : a));
  const d = dE(color, prop);
  const reg = { color, usos: u.n, fitxers: [...u.fitxers], proper: prop, dE: +d.toFixed(4) };
  if (d < LLINDAR_SOROLL) soroll.push(reg);
  else if (esNeutre(color)) rampa.push(reg);
  else vocabulari.push(reg);
}

/* Famílies dins del vocabulari: colors que volen dir el mateix. */
const families = [];
const pendents = [...vocabulari].sort((a, b) => b.usos - a.usos);
while (pendents.length) {
  const cap = pendents.shift();
  const grup = [cap];
  for (let i = pendents.length - 1; i >= 0; i -= 1) {
    if (dE(cap.color, pendents[i].color) < LLINDAR_FAMILIA) grup.push(...pendents.splice(i, 1));
  }
  families.push(grup);
}

rampa.sort((a, b) => lluminositat(b.color) - lluminositat(a.color));

const totalOrfes = soroll.length + rampa.length + vocabulari.length;
const ocurrencies = (ll) => ll.reduce((s, r) => s + r.usos, 0);

/* ── Eixida ──────────────────────────────────────────────────────────── */

if (JSON_OUT) {
  console.log(JSON.stringify({ canonics: llistaCanonics, soroll, rampa, families }, null, 2));
  process.exit(0);
}

if (PLA) {
  console.log('# Substitucions de risc zero (ΔE_ok < ' + LLINDAR_SOROLL + ')');
  for (const r of soroll) {
    for (const f of r.fitxers) {
      console.log(`sed -i 's/${r.color}/${r.proper}/gI' ${f}   # ${r.usos} ús(os), ΔE ${r.dE}`);
    }
  }
  process.exit(0);
}

console.log('\n🎨 CENS CROMÀTIC');
console.log('─'.repeat(72));
console.log(`  Tokens canònics declarats : ${llistaCanonics.length}  (${llistaCanonics.join(' ')})`);
console.log(`  Colors solts al codi      : ${totalOrfes}  (${ocurrencies([...soroll, ...rampa, ...vocabulari])} ocurrències)`);
console.log('─'.repeat(72));

console.log(`\n  ▸ SOROLL · ${soroll.length} colors, ${ocurrencies(soroll)} usos`);
console.log('    Indistingibles d\'un token existent. Substituïbles sense debat.');
for (const r of soroll.slice(0, 12)) {
  console.log(`      ${r.color} → ${r.proper}   ΔE ${r.dE}   ${r.usos} ús(os)   ${r.fitxers[0]}`);
}
if (soroll.length > 12) console.log(`      … i ${soroll.length - 12} més`);

console.log(`\n  ▸ RAMPA NEUTRA · ${rampa.length} tons, ${ocurrencies(rampa)} usos`);
console.log('    No és desordre: és una escala de grisos que el sistema no ha declarat.');
console.log('    Proposta: --sdp-neutre-{0,50,100,200,300,500,700,800,900}');
for (const r of rampa) console.log(`      ${r.color}   L*${lluminositat(r.color).toFixed(3)}   ${r.usos} ús(os)`);

console.log(`\n  ▸ VOCABULARI ABSENT · ${families.length} famílies, ${ocurrencies(vocabulari)} usos`);
console.log('    Colors amb significat que els tokens canònics no poden expressar.');
for (const g of families.sort((a, b) => ocurrencies(b) - ocurrencies(a)).slice(0, 12)) {
  const n = ocurrencies(g);
  console.log(`      ${g[0].color}  ${String(n).padStart(3)} ús(os)  ${g.length} variant(s)`
    + `  → cal un token semàntic  (canònic més pròxim ${g[0].proper}, ΔE ${g[0].dE})`);
}

console.log(`\n${'─'.repeat(72)}`);
console.log('  Este cens no bloqueja. La porta que bloqueja és design_guard.mjs.');
console.log('  Migra el SOROLL primer (`--pla`), després declara la RAMPA i el');
console.log('  VOCABULARI a design-tokens.json, i baixa el deute a mesura que caiga.\n');
