#!/usr/bin/env node
/**
 * farcell.mjs — EL BUNDLE DIU EL QUE PORTA, I PORTA EL QUE DIU
 *
 * PREMISSA (auditoria 260829, Seient Núm. 5):
 * El bundle 260829_0325 prometia `wordpress-plugin` i `01_identitat_iaia` al
 * capçal i en portava un CSS de fonts i zero fitxers. La causa: una whitelist
 * d'extensions dins de crear_bundle.mjs que el capçal no declarava. El Consell
 * va auditar a cegues. Este script fa que un bundle coix no puga eixir.
 *
 * COMPROVA:
 *   F1 · dir-promés-absent     El capçal llista un directori que no existix al disc. DURA.
 *   F2 · fitxer-al-disc-no-al-bundle  Un fitxer dins dels directoris promesos (no exclòs) no és al bundle. DURA.
 *   F3 · entrada-duplicada     El mateix camí apareix dues vegades. DURA.
 *   F4 · entrada-buida         Una secció del bundle té 0 línies de contingut. DURA.
 *   F5 · fitxer-al-bundle-no-al-disc  El bundle porta un camí que ja no existix (bundle vell). AVÍS.
 *   F6 · directoris-clonats    Dos directoris del bundle amb contingut byte a byte idèntic. AVÍS.
 *
 * ÚS:  node tooling/brain/farcell.mjs --bundle=<ruta.md> [--arrel=.] [--json]
 * Zero dependències. Exit 1 = el bundle no ix.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const arg = (n) => (process.argv.find((a) => a.startsWith(`--${n}=`)) || '').split('=')[1] || null;
const BUNDLE = arg('bundle');
const ARREL = path.resolve(arg('arrel') || '.');
if (!BUNDLE || !fs.existsSync(BUNDLE)) { console.error('Ús: farcell.mjs --bundle=<ruta.md> [--arrel=.]'); process.exit(2); }

const linies = fs.readFileSync(BUNDLE, 'utf8').split('\n');

/* ── 1 · Capçal: què promet ── */
const capcal = linies.slice(0, 40).join('\n');
const llista = (etiqueta) => {
  const m = capcal.match(new RegExp(`\\*\\*${etiqueta}:\\*\\*\\s*([^\\n]*)`));
  return m ? m[1].replace(/^[^(]*\(/, '').replace(/\).*$/, '').split(',').map((s) => s.trim()).filter(Boolean) : [];
};
const dirsExclosos = new Set(llista('Directoris exclosos'));
const extExcloses = new Set(llista('Extensions excloses'));
const dirsPromesos = llista('Altres exclusions');
const extDeclarades = llista('Extensions incloses'); // el crear_bundle pedaçat les declara; el vell, no

/* ── 2 · Cos: què porta ── */
const entrades = []; // { ruta, linies }
let actual = null;
for (const l of linies) {
  const m = l.match(/^## Fitxer(?: arrel\/suelt)?: (.+)$/);
  if (m) { actual = { ruta: m[1].trim(), linies: 0, dins: false }; entrades.push(actual); continue; }
  if (!actual) continue;
  if (l.startsWith('```')) { actual.dins = !actual.dins; continue; }
  if (actual.dins) actual.linies += 1;
}

/* ── 3 · Disc: què hauria de portar ── */
function camina(dir, acc = []) {
  const abs = path.join(ARREL, dir);
  if (!fs.existsSync(abs)) return acc;
  for (const nom of fs.readdirSync(abs)) {
    if (dirsExclosos.has(nom)) continue;
    const rel = path.posix.join(dir, nom);
    const st = fs.statSync(path.join(ARREL, rel));
    if (st.isDirectory()) camina(rel, acc);
    else if (!extExcloses.has(path.extname(nom))) acc.push(rel);
  }
  return acc;
}

const inf = []; const avis = [];
const alDisc = new Set();
for (const d of dirsPromesos) {
  if (!fs.existsSync(path.join(ARREL, d))) { inf.push(`F1 · ${d}: promés al capçal, no existix al disc.`); continue; }
  for (const f of camina(d)) alDisc.add(f);
}
const alBundle = new Map();
for (const e of entrades) {
  if (alBundle.has(e.ruta)) inf.push(`F3 · ${e.ruta}: apareix ${alBundle.get(e.ruta) + 1} vegades.`);
  alBundle.set(e.ruta, (alBundle.get(e.ruta) || 0) + 1);
  if (e.linies === 0) inf.push(`F4 · ${e.ruta}: secció buida.`);
}

const faltants = [...alDisc].filter((f) => !alBundle.has(f));
const perExt = new Map();
for (const f of faltants) { const x = path.extname(f) || '(sense)'; perExt.set(x, [...(perExt.get(x) || []), f]); }
for (const [x, fs_] of [...perExt].sort((a, b) => b[1].length - a[1].length)) {
  const declarada = extDeclarades.length === 0 || extDeclarades.includes(x);
  inf.push(`F2 · ${fs_.length} fitxer(s) ${x} al disc i no al bundle${declarada ? '' : ' (extensió no declarada: whitelist oculta)'}: ${fs_.slice(0, 4).join(', ')}${fs_.length > 4 ? ', …' : ''}`);
}
for (const f of alBundle.keys()) {
  const promés = dirsPromesos.some((d) => f.startsWith(d + '/'));
  if (promés && !fs.existsSync(path.join(ARREL, f))) avis.push(`F5 · ${f}: al bundle però no al disc.`);
}

/* F6 · directoris clonats: per a cada directori de 2n nivell, el conjunt ORDENAT de hashos
   del contingut dels seus fitxers (independent dels subcamins: caça `cervells/<data>/x` = `skills/x`). */
const perDir = new Map();
for (const e of entrades) {
  const parts = e.ruta.split('/');
  if (parts.length < 3) continue;
  const clau = parts.slice(0, 2).join('/');
  const idx = linies.findIndex((l) => l === `## Fitxer: ${e.ruta}`);
  const cos = idx >= 0 ? linies.slice(idx + 2, idx + 2 + e.linies + 1).join('\n') : '';
  perDir.set(clau, [...(perDir.get(clau) || []), crypto.createHash('sha256').update(cos).digest('hex').slice(0, 16)]);
}
const hashos = new Map();
for (const [dir, hs] of perDir) {
  if (hs.length < 3) continue;
  const h = crypto.createHash('sha256').update(hs.sort().join('|')).digest('hex').slice(0, 12);
  if (hashos.has(h)) avis.push(`F6 · ${dir} (${hs.length} fitxers) és una còpia byte a byte de ${hashos.get(h)}: el Consell (i el RAG) ho lligen dues vegades.`);
  else hashos.set(h, dir);
}

/* ── Informe ── */
console.log(`\n🧺 FARCELL — ${path.basename(BUNDLE)}: ${entrades.length} entrades · ${alDisc.size} fitxers esperats al disc · ${dirsPromesos.length} directoris promesos`);
for (const i of inf) console.log(`  ❌ ${i}`);
for (const a of avis) console.log(`  ⚠️  ${a}`);
console.log(inf.length ? `\n❌ BUNDLE COIX. ${inf.length} infraccions · ${avis.length} avisos. No ix.\n` : `\n✅ El bundle porta el que promet. ${avis.length} avisos.\n`);
process.exit(inf.length ? 1 : 0);
