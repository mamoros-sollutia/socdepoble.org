#!/usr/bin/env node
/**
 * tractor-doctrina-maquinari.mjs — LA MORT DEL CISMA DE L'A10
 *
 * QUÈ ARREGLA
 * ───────────
 * L'auditoria 260830 va trobar el projecte partit en dos sobre quin maquinari
 * suporta. El LEDGER, signat i vàlid, deia:
 *
 *     «Elimina l'obligació de suportar iPad A10 o iOS 15.8. Es prohibeix la
 *      introducció de codi condicional o fallbacks per a navegadors antics.»
 *
 * I al mateix temps, actius i sense cap porta que els contradiguera:
 *
 *     01_IDENTITAT.md            «pren iPad A10/Safari com a sòl de compatibilitat»
 *     00_arquitectura_unificada  «una API nova necessita detecció i fallback lleuger»
 *     futur_adaptacio.md         «Veto A10»
 *     FORJA_TO_CORE.md           exigia `sdp test --profile ipad-a10` per a promoure a core
 *     a11y_seo_trellat.md        «l'iPad A10 és el tribunal pràctic»
 *     trellat-rules.json         "ramMbMaxA10": 1200
 *
 * Dotze documents contra un LEDGER. Cap mecanisme per a resoldre-ho. Qui
 * arribava nou agafava el document que li tocava i construïa contra un
 * objectiu equivocat.
 *
 * Aquesta porta acaba amb això. La política viu a `maquinari-baseline.json`;
 * ací només hi ha el mecanisme.
 *
 * COMPROVA
 *   M1 · La declaració canònica de baseline existix
 *   M2 · Cap document de doctrina contradiu el baseline
 *   M3 · Cap CSS porta hacks innecessaris al baseline
 *   M4 · Cap JS porta guardes de característiques universals ni polyfills
 *   M5 · Cap regla CSS buida (stub per a enganyar una porta)
 *
 * Zero dependències. Fail-closed.
 *
 * ÚS
 *   node tooling/gates/tractor-doctrina-maquinari.mjs
 *   node tooling/gates/tractor-doctrina-maquinari.mjs --json
 *   node tooling/gates/tractor-doctrina-maquinari.mjs --detall   # cita cada línia
 */

import fs from 'node:fs';
import path from 'node:path';
import { R, rel, EXCLOSOS, arrelSegura, diagnostic, ErrorArrel } from '../lib/arrel.mjs';

const ARGS = process.argv.slice(2);
const JSON_OUT = ARGS.includes('--json');
const DETALL = ARGS.includes('--detall');

const POLITICA = 'tooling/gates/maquinari-baseline.json';

/* ═══════════════════════ Càrrega de la política ═══════════════════════ */

let pol;
try {
  pol = JSON.parse(fs.readFileSync(R(POLITICA), 'utf8'));
} catch (err) {
  console.error(`\n❌ [MAQUINARI] No puc llegir la política a ${POLITICA}: ${err.message}`);
  console.error('   Sense política no hi ha res a fer complir. Fail-closed.\n');
  process.exit(2);
}

const infraccions = [];
const anota = (llei, fitxer, linia, detall, motiu) => infraccions.push({ llei, fitxer, linia, detall, motiu });

const EXEMPTS = (pol.exempcions ?? []).map((e) => e.cami);
const esExempt = (r) => EXEMPTS.some((e) => r === e || r.startsWith(`${e}/`));

/* ═══════════════════════ Recorregut ═══════════════════════ */

function recull(arrelRelativa, exts) {
  const eixida = [];
  const base = R(arrelRelativa);
  if (!fs.existsSync(base)) return eixida;
  if (fs.statSync(base).isFile()) return [base];
  (function camina(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (EXCLOSOS.has(e.name) || e.name === '90_arxiu_historic') continue;
      const c = path.join(d, e.name);
      if (e.isDirectory()) camina(c);
      else if (exts.includes(path.extname(e.name))) eixida.push(c);
    }
  }(base));
  return eixida;
}

const llegeix = (p) => { try { return fs.readFileSync(p, 'utf8'); } catch { return ''; } };

/** Lleva comentaris CSS i JS: una prohibició no ha de saltar per una nota. */
function senseComentaris(text, esCss) {
  const sense = text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
  if (esCss) return sense;
  return sense.split('\n')
    .map((l) => l.replace(/(^|[^:'"`\\])\/\/.*$/, '$1'))
    .join('\n');
}

/** Recorre línies aplicant patrons, saltant les que van dins d'un bloc de codi md. */
function escaneja(abs, patrons, llei, { esMarkdown = false, esCss = false } = {}) {
  const r = rel(abs);
  if (esExempt(r)) return;
  const cru = llegeix(abs);
  const text = esMarkdown ? cru : senseComentaris(cru, esCss);
  const linies = text.split('\n');
  let dinsCodi = false;

  for (let i = 0; i < linies.length; i += 1) {
    const l = linies[i];
    if (esMarkdown && /^\s*(```|~~~)/.test(l)) { dinsCodi = !dinsCodi; continue; }
    for (const p of patrons) {
      const re = new RegExp(p.patro, 'i');
      const m = re.exec(l);
      if (!m) continue;
      anota(llei, r, i + 1, m[0].trim().slice(0, 70), p.motiu);
      break; // una infracció per línia: no cal apilar
    }
  }
}

/* ═══════════════════════ M1 · Declaració canònica ═══════════════════════ */

const DECL = pol.baseline?.declaracio_canonica;
if (!DECL) {
  anota('M1', POLITICA, 0, 'la política no declara `baseline.declaracio_canonica`', 'sense document canònic no hi ha font única');
} else if (!fs.existsSync(R(DECL))) {
  anota('M1', DECL, 0, 'la declaració canònica de baseline no existix',
    'crea-la: sense un sol document que diga què se suporta, tornarà el cisma');
}

/* ═══════════════════════ M2 · Doctrina coherent ═══════════════════════ */

for (const abast of pol.abast_doctrina ?? []) {
  for (const abs of recull(abast, ['.md', '.json'])) {
    escaneja(abs, pol.termes_prohibits_en_doctrina ?? [], 'M2', { esMarkdown: abs.endsWith('.md') });
  }
}

/* ═══════════════════════ M3 · CSS sense hacks morts ═══════════════════════ */

const durs = (pol.prohibits_css ?? []).filter((p) => p.gravetat !== 'avis');
const tous = (pol.prohibits_css ?? []).filter((p) => p.gravetat === 'avis');

for (const abs of recull('src', ['.css'])) {
  escaneja(abs, durs, 'M3', { esCss: true });
  escaneja(abs, tous, 'M3-avis', { esCss: true });
}

/* ═══════════════════════ M4 · JS sense guardes universals ═══════════════════════ */

for (const abs of [...recull('src', ['.js', '.jsx']), ...recull('tooling', ['.mjs', '.js'])]) {
  if (rel(abs).startsWith('tooling/gates/')) continue; // les portes citen patrons per ofici
  escaneja(abs, pol.prohibits_js ?? [], 'M4');
}

/* ═══════════════════════ M5 · Cap regla CSS buida ═══════════════════════ */

if (pol.stubs_css?.prohibit) {
  /* Regex acotat i sense quantificadors niats. La primera versió d'aquesta
     porta feia backtracking catastròfic (ReDoS) sobre línies CSS llargues i
     no acabava mai. Una porta que penja és una porta que s'acaba desactivant. */
  const RE_BUIDA = /^\s*([^{}\n]{1,200}?)\s*\{\s*\}\s*$/;
  for (const abs of recull('src', ['.css'])) {
    const r = rel(abs);
    if (esExempt(r)) continue;
    const linies = senseComentaris(llegeix(abs), true).split('\n');
    for (let i = 0; i < linies.length; i += 1) {
      const m = RE_BUIDA.exec(linies[i]);
      // Només selectors: descarta @media {}, :root {} buits i similars.
      if (m && /^[.#][\w-]/.test(m[1])) anota('M5', r, i + 1, m[1].trim(), pol.stubs_css.motiu);
    }
  }
}

/* ═══════════════════════ Informe ═══════════════════════ */

const LLEIS = {
  M1: 'La declaració canònica de baseline existix',
  M2: 'Cap document de doctrina contradiu el baseline',
  M3: 'Cap CSS porta hacks innecessaris al baseline',
  M4: 'Cap JS porta guardes universals ni polyfills',
  M5: 'Cap regla CSS buida (stub per a enganyar una porta)',
};

function informe() {
  const durs2 = infraccions.filter((i) => i.llei !== 'M3-avis');
  const avisos = infraccions.filter((i) => i.llei === 'M3-avis');

  if (JSON_OUT) {
    console.log(JSON.stringify({
      ok: durs2.length === 0, baseline: pol.baseline, infraccions,
    }, null, 2));
    return durs2.length ? 1 : 0;
  }

  const b = pol.baseline?.minims ?? {};
  console.log(`\n🖥️  TRACTOR DE DOCTRINA DE MAQUINARI — Baseline ${pol.baseline?.nom ?? '?'}`);
  console.log(`   Mínims: Safari/iOS ${b.safari_ios} · Chrome ${b.chrome} · Firefox ${b.firefox}`);
  console.log(`   Arrel : ${arrelSegura()}`);
  console.log('─'.repeat(72));

  for (const [codi, nom] of Object.entries(LLEIS)) {
    const meues = infraccions.filter((i) => i.llei === codi);
    if (!meues.length) { console.log(`  ✅ ${codi} · ${nom}`); continue; }
    console.log(`  ❌ ${codi} · ${nom}  (${meues.length})`);

    const perFitxer = new Map();
    for (const i of meues) {
      if (!perFitxer.has(i.fitxer)) perFitxer.set(i.fitxer, []);
      perFitxer.get(i.fitxer).push(i);
    }
    const ordenats = [...perFitxer].sort((a, b2) => b2[1].length - a[1].length);
    for (const [f, llista] of ordenats.slice(0, DETALL ? 999 : 8)) {
      console.log(`       ${f}  (${llista.length})`);
      for (const i of llista.slice(0, DETALL ? 999 : 2)) {
        console.log(`         · línia ${i.linia}: ${i.detall}`);
        console.log(`           ↳ ${i.motiu}`);
      }
      if (!DETALL && llista.length > 2) console.log(`         · … i ${llista.length - 2} més (--detall)`);
    }
    if (!DETALL && ordenats.length > 8) console.log(`       … i ${ordenats.length - 8} fitxers més`);
  }

  if (avisos.length) {
    console.log(`  ⚠️  M3-avis · prefixos substituïbles però no urgents  (${avisos.length})`);
    for (const i of avisos.slice(0, 3)) console.log(`         · ${i.fitxer}:${i.linia} — ${i.detall}`);
  }

  console.log('─'.repeat(72));

  // Les fronteres reals: el que NO s'ha de tocar encara que semble legacy.
  if (pol.avisos_de_frontera?.length) {
    console.log('\n  ℹ️  Fronteres del baseline — NO ho lleveu pensant que és deute:');
    for (const a of pol.avisos_de_frontera) {
      console.log(`     · ${a.api} → cal fins a ${a.disponible_des_de}`);
    }
  }

  if (durs2.length) {
    console.error(`\n❌ ${durs2.length} infracció(ns) del Baseline ${pol.baseline?.nom}.`);
    console.error(`   La decisió és al LEDGER i a ${DECL}. El codi encara no ho sap.\n`);
    return 1;
  }
  console.log(`\n✅ Doctrina i codi diuen el mateix sobre quin maquinari se suporta.\n`);
  return 0;
}

try {
  const d = diagnostic();
  if (d.error) { console.error(d.error.informe()); process.exit(2); }
  process.exit(informe());
} catch (err) {
  if (err instanceof ErrorArrel) { console.error(err.informe()); process.exit(2); }
  console.error(`\n❌ [MAQUINARI] Error inesperat: ${err.message}\n`);
  process.exit(2);
}
