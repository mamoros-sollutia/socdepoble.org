#!/usr/bin/env node
/**
 * tancament.mjs — Policia de l'Escriptori i porta de fi de sessió.
 *
 * QUÈ FEIA MALAMENT LA VERSIÓ ANTERIOR (auditoria 260830)
 * ───────────────────────────────────────────────────────
 *   · El bloc que validava el LEDGER estava comentat: calculava dues variables
 *     de data, llegia el fitxer i no feia res amb el resultat.
 *   · Tot i això, el missatge d'èxit deia:
 *         "✅ Sessió tancada correctament. Escriptori net, Llibre al dia,
 *          present escrit."
 *     Afirmava tres coses i només en comprovava una. Un ✅ fals és més
 *     perillós que cap comprovació: ensenya a confiar en una porta buida.
 *   · L'AGENTS.md §4 exigix haver *actualitzat* ESTAT.md. La porta només feia
 *     `existsSync`. Un ESTAT.md de fa tres setmanes passava.
 *   · El filtre d'arrel bruta feia `linia.slice(3)`, que trenca amb els renoms
 *     de git (`R  vell -> nou`), i només mirava .md/.txt/.mjs/.py: un .sh o un
 *     .json solt a l'arrel passava.
 *
 * LLEI D'AQUESTA PORTA
 * ────────────────────
 *   Cap comprovació es dona per feta en silenci. Cada control acaba en un dels
 *   quatre estats — OK, FALLA, AVÍS, OMÈS — i el resum els enumera tots amb
 *   nom i cognoms. Si una comprovació no s'ha pogut fer, es diu per què.
 *   Aquesta porta no afirma mai res que no haja verificat.
 *
 * ÚS
 *   node tooling/gates/tancament.mjs
 *   node tooling/gates/tancament.mjs --estricte   # els AVÍS i OMÈS també tomben
 *   node tooling/gates/tancament.mjs --json       # per a CI
 *   node tooling/gates/tancament.mjs --arrel=/ruta
 */

import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { R, CAMINS, arrelSegura, diagnostic, ErrorArrel } from '../lib/arrel.mjs';

const ARGS = process.argv.slice(2);
const ESTRICTE = ARGS.includes('--estricte');
const JSON_OUT = ARGS.includes('--json');

/** Marge de frescor d'ESTAT.md, en hores. Una jornada llarga hi cap. */
const HORES_FRESCOR = 24;

/* Nom termodinàmic: AAMMDD_HHMM_categoria_titol.ext (1–6 paraules) */
const RE_TERMODINAMIC = /^\d{6}_\d{4}_[a-z0-9]+(?:_[a-z0-9]+){1,6}\.(md|txt|json|csv|m4a|wav)$/i;

/** Fitxers que poden viure a l'Escriptori sense nom termodinàmic. */
const ESCRIPTORI_RESERVATS = new Set([
  '00_INDEX_ESCRIPTORI.md', '00_INDEX_Satel_lits.md', 'REGISTRE_CODI.md', '.DS_Store', '.gitkeep',
  'disseny_pedra_seca.html', '00_INDEX.md', '01_Produccio', '.ancora_sessio.json', '00_Bandeja_d_Entrada'
]);

/** Fitxers que legítimament viuen a l'arrel del repositori. */
const ARREL_PERMESOS = new Set([
  'package.json', 'package-lock.json', 'pnpm-lock.yaml', 'yarn.lock',
  'README.md', 'LICENSE', 'LICENSE.md', 'CHANGELOG.md', 'CONTRIBUTING.md',
  'CODE_OF_CONDUCT.md', 'SECURITY.md', 'AGENTS.md',
  '.gitignore', '.gitattributes', '.editorconfig', '.npmrc', '.nvmrc',
  '.env.example', '.prettierrc', '.prettierignore',
  'index.html', 'eslint.config.js', 'vite.config.js', 'vite.standalone.config.js',
  'vitest.config.js', 'tsconfig.json', 'jsconfig.json',
]);

/* ═══════════════════════ Bastida de controls ═══════════════════════ */

const controls = [];

/**
 * @param {string} id  codi curt i estable (C1, C2…) per a poder citar-lo
 * @param {string} nom què comprova, en una línia
 * @param {Function} fn
 */
function control(id, nom, fn) {
  let r;
  try {
    r = fn();
  } catch (err) {
    r = { estat: 'FALLA', detall: `excepció no capturada: ${err.message}` };
  }
  controls.push({ id, nom, ...r });
}

const ok = (detall) => ({ estat: 'OK', detall });
const falla = (detall, llista) => ({ estat: 'FALLA', detall, llista });
const avis = (detall, llista) => ({ estat: 'AVÍS', detall, llista });
const omes = (motiu) => ({ estat: 'OMÈS', motiu });

/* ═══════════════════════ Utilitats ═══════════════════════ */

function git(args) {
  return execFileSync('git', args, {
    cwd: arrelSegura(), encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
  });
}

let _hiHaGit = null;
function hiHaGit() {
  if (_hiHaGit !== null) return _hiHaGit;
  try { git(['rev-parse', '--git-dir']); _hiHaGit = true; } catch { _hiHaGit = false; }
  return _hiHaGit;
}

/**
 * `git status --porcelain=v1 -z` desempaquetat correctament.
 * El format NUL evita el trencament amb noms amb espais i, sobretot, permet
 * saltar el camí d'origen dels renoms — que la versió anterior interpretava
 * com un fitxer independent.
 */
function estatGit() {
  const trossos = git(['status', '--porcelain=v1', '-z']).split('\0');
  const eixida = [];
  for (let i = 0; i < trossos.length; i += 1) {
    const t = trossos[i];
    if (!t) continue;
    const codi = t.slice(0, 2);
    const cami = t.slice(3);
    if (codi[0] === 'R' || codi[0] === 'C') i += 1; // el següent tros és l'origen
    if (cami) eixida.push({ codi, cami });
  }
  return eixida;
}

const llegeix = (camiRelatiu) => fs.readFileSync(R(camiRelatiu), 'utf8');

/** Formats de data acceptats dins d'un LEDGER o d'un frontmatter. */
function marquesDeData(d) {
  const a = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return [`${a}-${m}-${dia}`, `${a}${m}${dia}`, `${String(a).slice(2)}${m}${dia}`];
}

/* ═══════════════════════ C1 · Escriptori ═══════════════════════ */

control('C1', "L'Escriptori i Producció no tenen fitxers fantasma ni carpetes soltes", () => {
  const rutesAComprovar = [
    CAMINS.escriptori,
    '_wiki_de_poble/05_Escriptori_Soc_de_Poble/01_Produccio'
  ];
  const dolents = [];
  for (const ruta of rutesAComprovar) {
    const dir = R(ruta);
    if (!fs.existsSync(dir)) continue;
    fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
      if (!ESCRIPTORI_RESERVATS.has(e.name) && !RE_TERMODINAMIC.test(e.name)) {
        dolents.push(`${ruta}/${e.name}`);
      }
    });
  }
  return dolents.length
    ? falla(`${dolents.length} element(s) amb nom no canònic o carpetes fantasma`, dolents)
    : ok('tots els elements segueixen AAMMDD_HHMM_categoria_titol.ext o estan reservats');
});

/* ═══════════════════════ C2 · Documents orfes ═══════════════════════ */

control('C2', "Accessibilitat Dirigida (SCC) i neteja atòmica d'àncores", () => {
  try {
    const stdout = execFileSync('node', ['tooling/session/check-close.mjs'], { 
      cwd: arrelSegura(), 
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    });
    return ok('Tots els nodes de la Wiki són abastables (SCC).');
  } catch (err) {
    const errorMessage = err.stderr ? err.stderr.trim() : err.message;
    return falla('L\'accessibilitat dirigida ha fallat.', errorMessage.split('\n'));
  }
});

/* ═══════════════════════ C3 · ESTAT.md fresc ═══════════════════════ */

control('C3', `ESTAT.md s'ha actualitzat en les últimes ${HORES_FRESCOR} h`, () => {
  if (!fs.existsSync(R(CAMINS.estat))) return falla(`falta ${CAMINS.estat}`);
  const m = /^\s*actualitzat:\s*(.+?)\s*$/m.exec(llegeix(CAMINS.estat));
  if (!m) {
    return falla(`${CAMINS.estat} no té camp 'actualitzat:'; sense data no es pot verificar la frescor`);
  }
  const quan = new Date(m[1].replace(' ', 'T'));
  if (Number.isNaN(quan.getTime())) return falla(`data il·legible a 'actualitzat:': "${m[1]}"`);

  const hores = (Date.now() - quan.getTime()) / 36e5;
  if (hores < -1) return avis(`'actualitzat:' està en el futur (${m[1]}); revisa el rellotge`);
  return hores > HORES_FRESCOR
    ? falla(`ESTAT.md porta ${Math.floor(hores)} h sense tocar (${m[1]}); l'AGENTS.md §4 exigix actualitzar-lo`)
    : ok(`actualitzat fa ${Math.max(0, Math.floor(hores))} h (${m[1]})`);
});

/* ═══════════════════════ C4 · Integritat del LEDGER ═══════════════════════ */

control('C4', 'El LEDGER existix i la seua suma de verificació quadra', () => {
  if (!fs.existsSync(R(CAMINS.ledger))) return falla(`falta ${CAMINS.ledger}`);
  const text = llegeix(CAMINS.ledger);
  const re = /\n\n<!-- (?:HASH|SUMA): ([a-f0-9]{64}) -->$/;
  const m = re.exec(text);
  if (!m) return falla('el LEDGER no porta suma. Executa: node tooling/verify-ledger.mjs --sign');
  const calculada = createHash('sha256').update(text.replace(re, '')).digest('hex');
  return m[1] === calculada
    ? ok('suma de verificació vàlida')
    : falla(`suma trencada — al fitxer ${m[1].slice(0, 12)}…, calculada ${calculada.slice(0, 12)}…`);
});

/* ═══════════════════════ C5 · Entrada al LEDGER si s'ha tocat codi ═══════════════════════ */

control('C5', "Si s'ha modificat codi, el LEDGER porta entrada d'avui", () => {
  if (!hiHaGit()) return omes("no és un repositori git; no puc saber què s'ha tocat");
  if (!fs.existsSync(R(CAMINS.ledger))) return omes('no hi ha LEDGER (vegeu C4)');

  const vigilats = [`${CAMINS.src}/`, `${CAMINS.tooling}/`, `${CAMINS.plugin}/`, 'scripts/'];
  const tocats = estatGit()
    .filter(({ codi, cami }) => codi !== '??' && vigilats.some((v) => cami.startsWith(v)))
    .map(({ cami }) => cami);

  if (tocats.length === 0) return ok('cap fitxer de codi modificat; no cal entrada nova');

  const hi = marquesDeData(new Date()).some((s) => llegeix(CAMINS.ledger).includes(s));
  return hi
    ? ok(`${tocats.length} fitxer(s) de codi tocats i el LEDGER té entrada d'avui`)
    : falla(`${tocats.length} fitxer(s) de codi modificats sense entrada d'avui al LEDGER`, tocats.slice(0, 10));
});

/* ═══════════════════════ C6 · Arrel del repositori neta ═══════════════════════ */

control('C6', "Cap fitxer de treball solt a l'arrel del repositori", () => {
  if (!hiHaGit()) return omes("no és un repositori git; l'estat de l'arbre no és observable");
  const solts = estatGit()
    .map(({ cami }) => cami)
    .filter((p) => p && !p.includes('/') && !p.startsWith('.') && !ARREL_PERMESOS.has(p));
  return solts.length
    ? falla(`${solts.length} fitxer(s) solts a l'arrel; mou-los a ${CAMINS.escriptori}`, solts)
    : ok("l'arrel només conté fitxers estructurals declarats");
});

/* ═══════════════════════ C7 · Zona prohibida ═══════════════════════ */

control('C7', "Cap secret ni arxiu històric a l'arbre de treball", () => {
  if (!hiHaGit()) return omes('no és un repositori git');
  const prohibits = estatGit()
    .map(({ cami }) => cami)
    .filter((p) => p === '.env'
      || (p.startsWith('.env.') && p !== '.env.example')
      || p.startsWith(`${CAMINS.arxiuHistoric}/`));
  return prohibits.length
    ? falla("fitxers de zona prohibida en moviment (AGENTS.md §5)", prohibits)
    : ok('cap .env ni 90_arxiu_historic en moviment');
});

/* ═══════════════════════ Informe ═══════════════════════ */

function resum() {
  const per = (e) => controls.filter((c) => c.estat === e);
  const falles = per('FALLA');
  const avisos = per('AVÍS');
  const omesos = per('OMÈS');
  const okeis = per('OK');
  const bloqueja = falles.length > 0 || (ESTRICTE && (avisos.length > 0 || omesos.length > 0));

  if (JSON_OUT) {
    console.log(JSON.stringify({
      ok: !bloqueja, estricte: ESTRICTE, arrel: arrelSegura(), controls,
    }, null, 2));
    return bloqueja ? 1 : 0;
  }

  const icona = { OK: '✅', FALLA: '❌', 'AVÍS': '⚠️ ', 'OMÈS': '⚪' };
  console.log('\n🔒 TANCAMENT DE SESSIÓ');
  console.log('─'.repeat(72));
  for (const c of controls) {
    console.log(`  ${icona[c.estat]} ${c.id} · ${c.nom}`);
    const cua = c.estat === 'OMÈS' ? c.motiu : c.detall;
    if (cua) console.log(`        ↳ ${cua}`);
    for (const x of (c.llista ?? []).slice(0, 8)) console.log(`          · ${x}`);
    if ((c.llista?.length ?? 0) > 8) console.log(`          · … i ${c.llista.length - 8} més`);
  }
  console.log('─'.repeat(72));
  console.log(`  ${okeis.length} verificats · ${falles.length} falles · ${avisos.length} avisos · ${omesos.length} omesos`);

  if (bloqueja) {
    console.error('\n🚨 TANCAMENT REBUTJAT. Arregla el marcat amb ❌'
      + (ESTRICTE ? ' (i amb ⚠️ / ⚪: estàs en mode estricte).' : '.') + '\n');
    return 1;
  }

  // Missatge honest: enumera exactament què s'ha verificat, ni una cosa més.
  console.log(`\n✅ Sessió tancable. Verificats: ${okeis.map((c) => c.id).join(', ') || 'cap'}.`);
  if (omesos.length) {
    console.log(`   Sense verificar (${omesos.map((c) => c.id).join(', ')}): la porta no afirma res sobre aquests punts.`);
  }
  if (avisos.length) console.log(`   Amb avisos: ${avisos.map((c) => c.id).join(', ')}.`);
  console.log('');
  return 0;
}

/* ═══════════════════════ Arrancada ═══════════════════════ */

try {
  const d = diagnostic();
  if (d.error) { console.error(d.error.informe()); process.exit(2); }
  process.exit(resum());
} catch (err) {
  if (err instanceof ErrorArrel) { console.error(err.informe()); process.exit(2); }
  console.error(`\n❌ [TANCAMENT] Error inesperat: ${err.message}\n`);
  process.exit(2);
}
