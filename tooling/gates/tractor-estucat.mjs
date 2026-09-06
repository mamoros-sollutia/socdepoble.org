#!/usr/bin/env node
/**
 * tractor-estucat.mjs — Porta anti-estucat (Pedra Seca)
 *
 * PROBLEMA QUE RESOL
 * `tractor-vocabulari` comprova que tota classe usada al JSX tinga regla CSS.
 * Eixa comprovació es pot satisfer escrivint `.la-classe {}` — una regla buida.
 * La porta es posa verda i l'element continua sense estil. Això no és pedra
 * seca: és estucat, una capa fina que tapa el forat i el fa invisible.
 *
 * Cap altre tractor del repositori mira dins del bloc. Este sí.
 *
 * TRES LLEIS MECÀNIQUES
 *   E-1  Cap regla CSS pot tindre el cos buit.              → BLOQUEJANT
 *   E-2  Cap classe amb declaracions pot quedar òrfena.     → AVÍS
 *   E-3  Cap fitxer CSS carregat pot superar el llindar de
 *        mortalitat (per defecte 25 % de blocs morts).      → BLOQUEJANT
 *
 * Falla en obert: si no troba CSS o no troba consumidors, ix 1. El silenci
 * mai no compta com a aprovat.
 *
 * ÚS
 *   node tooling/gates/tractor-estucat.mjs
 *   node tooling/gates/tractor-estucat.mjs --baseline    (congela el deute d'avui)
 *   node tooling/gates/tractor-estucat.mjs --arrel=. --llindar=25
 *
 * El baseline es guarda a '.agents/deute/.estucat-deute.json', igual que la resta de portes.
 * Serveix per no bloquejar el deute històric, però mai per créixer: qualsevol
 * regla buida nova que no estiga al baseline atura la porta.
 */

import fs from 'node:fs';
import path from 'node:path';

/* ───────────────────────────── CLI ───────────────────────────── */

const args = process.argv.slice(2);
const val = (nom, def) => {
  const a = args.find((x) => x.startsWith(`--${nom}=`));
  return a ? a.split('=')[1] : def;
};
const BASELINE = args.includes('--baseline');
const LLINDAR = Number(val('llindar', '25'));

/* ─────────────────── Descobriment d'arrel (mai cwd) ─────────────────── */

const MARCADORS = ['package.json', 'vite.config.js'];
function descobreixArrel(inici) {
  let cursor = path.resolve(inici);
  for (let i = 0; i < 12; i++) {
    if (MARCADORS.every((f) => fs.existsSync(path.join(cursor, f)))) return cursor;
    const pare = path.dirname(cursor);
    if (pare === cursor) break;
    cursor = pare;
  }
  return null;
}

const ARREL = val('arrel', null)
  ? path.resolve(val('arrel'))
  : descobreixArrel(path.dirname(new URL(import.meta.url).pathname));

if (!ARREL || !fs.existsSync(ARREL)) {
  console.error('[estucat] No trobe l\'arrel del repositori. Passa --arrel=.');
  process.exit(1);
}

const rel = (p) => path.relative(ARREL, p).split(path.sep).join('/');
const FITXER_DEUTE = path.join(ARREL, '.agents/deute/.estucat-deute.json');

/* ──────────────────── Quin CSS s'arriba a carregar ──────────────────── */

/** Només auditem el CSS que algú importa. El CSS orfe és feina d'altra porta. */
function cssCarregat() {
  const consumidors = [];
  const camina = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (!/node_modules|dist|build|coverage/.test(e.name)) camina(p);
      } else if (/\.(jsx?|mjs|cjs|html)$/.test(e.name)) {
        consumidors.push(p);
      }
    }
  };
  camina(path.join(ARREL, 'src'));

  const trobats = new Set();
  for (const c of consumidors) {
    const txt = fs.readFileSync(c, 'utf8');
    for (const m of txt.matchAll(/(?:import\s+[\w{}\s,*]*from\s+|@import\s+(?:url\()?)['"]([^'"]+\.css)/g)) {
      const abs = path.resolve(path.dirname(c), m[1].replace(/\?.*$/, ''));
      if (fs.existsSync(abs)) trobats.add(abs);
    }
  }
  // seguim els @import de dins del CSS (un nivell és suficient ací)
  for (const f of [...trobats]) {
    const txt = fs.readFileSync(f, 'utf8');
    for (const m of txt.matchAll(/@import\s+(?:url\()?['"]([^'"]+\.css)/g)) {
      const abs = path.resolve(path.dirname(f), m[1]);
      if (fs.existsSync(abs)) trobats.add(abs);
    }
  }
  return [...trobats];
}

/* ───────────────────────── Anàlisi del CSS ───────────────────────── */

/** Lleva comentaris sense tocar les cadenes de `content:`. */
const netejaComentaris = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '');

/** Talla el CSS en blocs `selector { cos }` d'un sol nivell. At-rules a banda. */
function blocs(css) {
  const out = [];
  const t = netejaComentaris(css);
  let prof = 0, iniSel = 0, iniCos = 0, sel = '';
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (c === '{') {
      if (prof === 0) { sel = t.slice(iniSel, i).trim(); iniCos = i + 1; }
      prof++;
    } else if (c === '}') {
      prof--;
      if (prof === 0) {
        const cos = t.slice(iniCos, i);
        // Les at-rules contenidores (@media, @supports) es recorren per dins.
        if (/^@(media|supports|layer|container)/.test(sel)) out.push(...blocs(cos));
        else if (!/^@/.test(sel)) out.push({ sel, cos, linia: t.slice(0, iniCos).split('\n').length });
        iniSel = i + 1;
      }
    }
  }
  return out;
}

const classesDe = (sel) => [...sel.matchAll(/\.(-?[A-Za-z_][\w-]*)/g)].map((m) => m[1]);

/* ────────────────────────── Consumidors ────────────────────────── */

function corpusConsumidor() {
  let txt = '';
  const camina = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (!/node_modules|dist|build|coverage/.test(e.name)) camina(p);
      } else if (/\.(jsx?|mjs|cjs|html|php)$/.test(e.name)) {
        txt += fs.readFileSync(p, 'utf8') + '\n';
      }
    }
  };
  camina(path.join(ARREL, 'src'));
  camina(path.join(ARREL, 'wordpress-plugin'));
  camina(path.join(ARREL, 'public'));
  return txt;
}

/* ──────────────────────────── Execució ──────────────────────────── */

const fulls = cssCarregat();
if (fulls.length === 0) {
  console.error('[estucat] Zero fulls CSS carregats. O el projecte no té estils o no els sé trobar. Falle en obert.');
  process.exit(1);
}

const codi = corpusConsumidor();
if (codi.trim().length === 0) {
  console.error('[estucat] Zero consumidors. No puc decidir què és orfe. Falle en obert.');
  process.exit(1);
}

const deuteAntic = fs.existsSync(FITXER_DEUTE)
  ? JSON.parse(fs.readFileSync(FITXER_DEUTE, 'utf8'))
  : { buides: [], orfes: [] };

const buides = [];
const orfes = [];
const resum = [];

for (const f of fulls) {
  const css = fs.readFileSync(f, 'utf8');
  const bs = blocs(css);
  if (bs.length === 0) continue;

  const b = bs.filter((x) => x.cos.trim() === '');
  const ambCos = bs.filter((x) => x.cos.trim() !== '');

  for (const x of b) buides.push(`${rel(f)}::${x.sel}`);

  const totes = new Set();
  for (const x of ambCos) for (const c of classesDe(x.sel)) totes.add(c);
  for (const c of totes) {
    const re = new RegExp(`\\b${c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
    if (!re.test(codi)) orfes.push(`${rel(f)}::${c}`);
  }

  const mortalitat = (b.length / bs.length) * 100;
  resum.push({ f: rel(f), tot: bs.length, buits: b.length, mortalitat });
}

/* ───────────────────────── Baseline ───────────────────────── */

if (BASELINE) {
  fs.writeFileSync(FITXER_DEUTE, JSON.stringify({ buides, orfes }, null, 2) + '\n');
  console.log(`[estucat] Deute congelat: ${buides.length} regles buides, ${orfes.length} classes òrfenes.`);
  console.log(`[estucat] Escrit a ${rel(FITXER_DEUTE)}. A partir d'ara només es bloqueja el creixement.`);
  process.exit(0);
}

const noves = buides.filter((x) => !deuteAntic.buides.includes(x));
const orfesNoves = orfes.filter((x) => !deuteAntic.orfes.includes(x));
const excedits = resum.filter((r) => r.mortalitat > LLINDAR);

/* ───────────────────────── Informe ───────────────────────── */

console.log('┌─ TRACTOR ESTUCAT ─────────────────────────────────────────');
for (const r of resum) {
  console.log(`│ ${r.f}`);
  console.log(`│   ${r.tot} blocs · ${r.buits} buits · ${r.mortalitat.toFixed(1)} % mort`);
}
console.log('├───────────────────────────────────────────────────────────');
console.log(`│ E-1 regles buides ......... ${buides.length} (${noves.length} noves)`);
console.log(`│ E-2 classes òrfenes ....... ${orfes.length} (${orfesNoves.length} noves)`);
console.log(`│ E-3 fitxers > ${LLINDAR} % mort ..... ${excedits.length}`);
console.log('└───────────────────────────────────────────────────────────');

let falla = false;

if (noves.length > 0) {
  falla = true;
  console.error('\n✖ E-1 BLOQUEJANT — regles buides noves (estucat):');
  for (const x of noves.slice(0, 25)) console.error(`    ${x}`);
  if (noves.length > 25) console.error(`    … i ${noves.length - 25} més`);
  console.error('  Una regla buida enganya tractor-vocabulari. O li poses declaracions o la lleves.');
}

if (excedits.length > 0) {
  falla = true;
  console.error(`\n✖ E-3 BLOQUEJANT — mortalitat per damunt del ${LLINDAR} %:`);
  for (const r of excedits) console.error(`    ${r.f} → ${r.mortalitat.toFixed(1)} % (${r.buits}/${r.tot})`);
  console.error('  Este full és més forat que pedra. Esporga\'l o trau-lo de l\'import.');
}

if (orfesNoves.length > 0) {
  console.warn('\n⚠ E-2 AVÍS — classes noves sense cap consumidor:');
  for (const x of orfesNoves.slice(0, 25)) console.warn(`    ${x}`);
  if (orfesNoves.length > 25) console.warn(`    … i ${orfesNoves.length - 25} més`);
}

if (falla) {
  console.error('\n[estucat] PORTA TANCADA.');
  process.exit(1);
}
console.log('\n[estucat] Porta oberta.');
process.exit(0);
