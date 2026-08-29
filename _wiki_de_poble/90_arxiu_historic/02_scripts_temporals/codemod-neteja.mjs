#!/usr/bin/env node
/**
 * codemod-neteja.mjs — Fase 0: tallar l'hemorràgia.
 *
 * Tres operacions, totes localitzades per AST i aplicades per tall de rangs de
 * bytes. En cap moment es reimprimix el fitxer: només s'esborren o se
 * substituïxen els bytes exactes del node ofensiu. Tota la resta del fitxer
 * arriba al disc byte a byte igual que va eixir.
 *
 *   OP1a  JSX-TEXT   `// eslint-disable-next-line` en posició de fill JSX.
 *                    Això no és un comentari: React ho renderitza com a text.
 *                    S'esborra sempre.
 *   OP1b  COMENTARI  el mateix text en posició de comentari real (vàlid, però
 *                    és brossa de `fix-inline.mjs`). Només amb `--tots`.
 *   OP2   SINK       `{...{['dangerouslySet' + 'InnerHTML']: X}}` →
 *                    `dangerouslySetInnerHTML={X}`. L'ofuscació existia per a
 *                    burlar una porta basada en grep. La porta ha de vore la
 *                    veritat.
 *   OP3   BYPASS     codi inabastable després d'un `throw`/`return` que conté
 *                    un marcador de salt_prohibit. S'esborra. La resta de codi mort
 *                    s'informa i no es toca.
 *
 * Garanties (PROTOCOL_CHANGE · canvi massiu):
 *   · dry-run per defecte; cal `--escriu`.
 *   · còpia recuperable a `.sdp-paperera/<segell>/` abans d'escriure.
 *   · rebut amb SHA-256 abans i després de cada fitxer.
 *   · pressupost de radi d'explosió (core-bounded-action: 12 fitxers per lot).
 *   · verificació posterior: el fitxer resultant es torna a parsejar i s'exigix
 *     que el nombre d'elements JSX i el text visible siguen idèntics. Si no,
 *     eixe fitxer es descarta sencer i el lot falla.
 *
 * Dependència única: `@babel/parser` (només anàlisi, mai generació de codi).
 *   npm i -D @babel/parser
 *
 *   node tooling/gates/codemod-neteja.mjs                    # dry-run
 *   node tooling/gates/codemod-neteja.mjs --tots             # inclou OP1b
 *   node tooling/gates/codemod-neteja.mjs --tots --escriu
 *   node tooling/gates/codemod-neteja.mjs --pressupost=20 --escriu
 *   node tooling/gates/codemod-neteja.mjs --abast=src/sections/mercat
 *   node tooling/gates/codemod-neteja.mjs --verifica         # exit 1 si queda brossa
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

/* ─────────────────────────────── Parser ─────────────────────────────── */

const require_ = createRequire(import.meta.url);
let babel;
try {
  babel = require_('@babel/parser');
} catch {
  console.error('❌ [NETEJA] Falta `@babel/parser`. Instal·la\'l abans de tocar res:\n');
  console.error('   npm i -D @babel/parser\n');
  console.error('   Sense parser només queda la coincidència de cadenes, que és exactament');
  console.error('   el que va provocar el desastre de `fix-inline.mjs`. No ho farem.\n');
  process.exit(1);
}

const OPCIONS_PARSER = {
  sourceType: 'module',
  allowReturnOutsideFunction: true,
  errorRecovery: false,
  plugins: ['jsx', 'topLevelAwait', 'importMeta', 'objectRestSpread', 'optionalChaining', 'nullishCoalescingOperator', 'classProperties', 'dynamicImport'],
};

const parseja = (codi) => babel.parse(codi, { ...OPCIONS_PARSER, attachComment: true });

/* ─────────────────────────────── Arrel i arguments ─────────────────────────────── */

function trobaArrel(inici) {
  let dir = path.resolve(inici);
  for (let i = 0; i < 8; i += 1) {
    if (fs.existsSync(path.join(dir, 'AGENTS.md')) || fs.existsSync(path.join(dir, '.agents/AGENTS.md'))) return dir;
    const pare = path.dirname(dir);
    if (pare === dir) break;
    dir = pare;
  }
  return null;
}

const arg = (nom) => {
  const trobat = process.argv.find((a) => a.startsWith(`--${nom}=`));
  return trobat ? trobat.slice(nom.length + 3) : null;
};

const ARREL = arg('arrel') ? path.resolve(arg('arrel')) : trobaArrel(process.cwd());
if (!ARREL) {
  console.error("❌ [NETEJA] No trobe l'arrel del projecte (cal AGENTS.md o .agents/AGENTS.md). Usa --arrel=/ruta.");
  process.exit(1);
}

const ESCRIU = process.argv.includes('--escriu');
const TOTS = process.argv.includes('--tots');
const VERIFICA = process.argv.includes('--verifica');
const JSON_OUT = process.argv.includes('--json');
const PRESSUPOST = Number(arg('pressupost') ?? 12);
const ABAST = (arg('abast') || 'src,tooling').split(',').map((s) => s.trim()).filter(Boolean);
const MARCADOR_BYPASS = new RegExp(arg('salt_prohibit') || 'NO_BYPASS_ALLOWED|salt_prohibit', 'i');

const R = (p) => path.join(ARREL, p);
const rel = (p) => path.relative(ARREL, p) || p;
const sha = (s) => crypto.createHash('sha256').update(s, 'utf8').digest('hex');

const RE_ESLINT = /^\s*\/\/\s*eslint-disable(?:-next-line|-line)?\b.*$/;
const EXTENSIONS = new Set(['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx']);
const EXCLOU_DIR = new Set(['node_modules', '.git', 'dist', 'build', 'coverage', '.sdp-paperera', '.sdp-reflex', 'vendor']);

/* ─────────────────────────────── Recorregut d'AST ─────────────────────────────── */

function recorre(node, visita, pare = null) {
  if (!node || typeof node.type !== 'string') return;
  visita(node, pare);
  for (const clau of Object.keys(node)) {
    if (clau === 'loc' || clau === 'leadingComments' || clau === 'trailingComments' || clau === 'innerComments') continue;
    const valor = node[clau];
    if (Array.isArray(valor)) {
      for (const fill of valor) if (fill && typeof fill.type === 'string') recorre(fill, visita, node);
    } else if (valor && typeof valor.type === 'string') {
      recorre(valor, visita, node);
    }
  }
}

/** Concatena una expressió de cadenes literals unides amb `+`. Torna null si no ho és. */
function concatenaLiterals(node) {
  if (!node) return null;
  if (node.type === 'StringLiteral') return node.value;
  if (node.type === 'BinaryExpression' && node.operator === '+') {
    const e = concatenaLiterals(node.left);
    const d = concatenaLiterals(node.right);
    return e === null || d === null ? null : e + d;
  }
  return null;
}

/* ────────────────────── Invariants: què no pot canviar ────────────────────── */

function empremta(codi) {
  const ast = parseja(codi);
  let elements = 0;
  const textos = [];
  recorre(ast, (n) => {
    if (n.type === 'JSXElement' || n.type === 'JSXFragment') elements += 1;
    if (n.type === 'JSXText') {
      const net = n.value.split('\n').filter((l) => !RE_ESLINT.test(l)).join('\n').replace(/\s+/g, ' ').trim();
      if (net) textos.push(net);
    }
  });
  return { elements, text: textos.join('\u0001') };
}

/* ─────────────────────────────── Anàlisi d'un fitxer ─────────────────────────────── */

function analitza(ruta) {
  const codi = fs.readFileSync(ruta, 'utf8');
  let ast;
  try {
    ast = parseja(codi);
  } catch (error) {
    return { ruta, codi, error: `no es pot parsejar: ${String(error.message).split('\n')[0]}`, edicions: [], avisos: [] };
  }

  const edicions = []; // { inici, fi, nou, op, linia }
  const avisos = [];
  const linia = (pos) => codi.slice(0, pos).split('\n').length;

  /* OP1a · JSXText amb `// eslint-disable…`: es renderitza com a text visible. */
  recorre(ast, (n) => {
    if (n.type !== 'JSXText') return;
    const brut = codi.slice(n.start, n.end);
    const linies = brut.split('\n');
    const netes = linies.filter((l) => !RE_ESLINT.test(l));
    if (netes.length === linies.length) return;
    edicions.push({
      inici: n.start,
      fi: n.end,
      nou: netes.join('\n'),
      op: 'OP1a',
      linia: linia(n.start),
      detall: `${linies.length - netes.length} línia/es de text visible`,
    });
  });

  /* OP1b · comentaris reals de `fix-inline`. Vàlids, però brossa. */
  for (const c of ast.comments || []) {
    if (c.type !== 'CommentLine') continue;
    if (!RE_ESLINT.test(`//${c.value}`)) continue;
    // Amplia el rang a la línia sencera si només conté el comentari.
    let inici = c.start;
    while (inici > 0 && (codi[inici - 1] === ' ' || codi[inici - 1] === '\t')) inici -= 1;
    let fi = c.end;
    const nomesLinia = inici === 0 || codi[inici - 1] === '\n';
    if (nomesLinia && codi[fi] === '\n') fi += 1;
    if (!TOTS) {
      avisos.push({ op: 'OP1b', linia: linia(c.start), detall: 'comentari de fix-inline (usa --tots per a esborrar-lo)' });
      continue;
    }
    edicions.push({ inici, fi, nou: nomesLinia ? '' : '', op: 'OP1b', linia: linia(c.start), detall: 'comentari brossa' });
  }

  /* OP2 · sink ofuscat. */
  recorre(ast, (n) => {
    if (n.type !== 'JSXSpreadAttribute') return;
    const a = n.argument;
    if (!a || a.type !== 'ObjectExpression' || a.properties.length !== 1) return;
    const p = a.properties[0];
    if (!p || p.type !== 'ObjectProperty' || !p.computed) return;
    const clau = concatenaLiterals(p.key);
    if (clau !== 'dangerouslySetInnerHTML') return;
    edicions.push({
      inici: n.start,
      fi: n.end,
      nou: `dangerouslySetInnerHTML={${codi.slice(p.value.start, p.value.end)}}`,
      op: 'OP2',
      linia: linia(n.start),
      detall: 'clau reconstruïda per concatenació',
    });
  });

  /* OP3 · codi inabastable després d'un terminador. */
  recorre(ast, (n) => {
    const cos = n.type === 'BlockStatement' || n.type === 'Program' ? n.body : null;
    if (!cos) return;
    const tall = cos.findIndex((s) => ['ThrowStatement', 'ReturnStatement', 'BreakStatement', 'ContinueStatement'].includes(s.type));
    if (tall === -1 || tall === cos.length - 1) return;
    for (const mort of cos.slice(tall + 1)) {
      const font = codi.slice(mort.start, mort.end);
      if (!MARCADOR_BYPASS.test(font)) {
        avisos.push({ op: 'OP3', linia: linia(mort.start), detall: 'codi inabastable (no és un salt_prohibit: no el toque)' });
        continue;
      }
      let inici = mort.start;
      while (inici > 0 && (codi[inici - 1] === ' ' || codi[inici - 1] === '\t')) inici -= 1;
      let fi = mort.end;
      if (codi[fi] === '\n') fi += 1;
      edicions.push({ inici, fi, nou: '', op: 'OP3', linia: linia(mort.start), detall: 'salt_prohibit inabastable esborrat' });

      /* Si el salt_prohibit declarava variables que la resta del bloc mort encara
         referencia, avisem: el bloc queda inservible a propòsit (ja no es pot
         reactivar llevant el `throw`), però cal netejar-lo en un segon pas. */
      const declarats = [];
      recorre(mort, (d) => { if (d.type === 'VariableDeclarator' && d.id?.type === 'Identifier') declarats.push(d.id.name); });
      const restant = codi.slice(fi, cos[cos.length - 1].end);
      for (const nom of declarats) {
        if (new RegExp(`\\b${nom}\\b`).test(restant)) {
          avisos.push({
            op: 'OP3',
            linia: linia(mort.start),
            detall: `'${nom}' queda referenciat pel codi mort posterior: el bloc ja no es pot reactivar llevant el throw (volgut). Cal esborrar-lo sencer en un segon pas.`,
          });
        }
      }
    }
  });

  return { ruta, codi, edicions, avisos, error: null };
}

/* ─────────────────────────────── Aplicació ─────────────────────────────── */

function aplica(codi, edicions) {
  const ordenades = [...edicions].sort((a, b) => b.inici - a.inici);
  for (let i = 1; i < ordenades.length; i += 1) {
    if (ordenades[i].fi > ordenades[i - 1].inici) {
      throw new Error(`edicions solapades a les posicions ${ordenades[i].inici}–${ordenades[i].fi}`);
    }
  }
  let out = codi;
  for (const e of ordenades) out = out.slice(0, e.inici) + e.nou + out.slice(e.fi);
  return out;
}

/* ─────────────────────────────── Selecció de fitxers ─────────────────────────────── */

function recull(dir, acc = []) {
  let entrades;
  try { entrades = fs.readdirSync(dir, { withFileTypes: true }); } catch { return acc; }
  for (const e of entrades) {
    if (EXCLOU_DIR.has(e.name)) continue;
    const complet = path.join(dir, e.name);
    if (e.isDirectory()) recull(complet, acc);
    else if (EXTENSIONS.has(path.extname(e.name))) acc.push(complet);
  }
  return acc;
}

const fitxers = [];
for (const a of ABAST) {
  const abs = R(a);
  if (!fs.existsSync(abs)) continue;
  if (fs.statSync(abs).isDirectory()) fitxers.push(...recull(abs));
  else fitxers.push(abs);
}

if (fitxers.length === 0) {
  console.error(`❌ [NETEJA] Cap fitxer dins de l'abast (${ABAST.join(', ')}).`);
  process.exit(1);
}

/* ─────────────────────────────── Execució ─────────────────────────────── */

const resultats = [];
const illegibles = [];

for (const f of fitxers) {
  const r = analitza(f);
  if (r.error) { illegibles.push({ ruta: rel(f), error: r.error }); continue; }
  if (r.edicions.length === 0 && r.avisos.length === 0) continue;
  resultats.push(r);
}

const ambEdicions = resultats.filter((r) => r.edicions.length > 0);
const totalEdicions = ambEdicions.reduce((n, r) => n + r.edicions.length, 0);
const perOp = {};
for (const r of ambEdicions) for (const e of r.edicions) perOp[e.op] = (perOp[e.op] || 0) + 1;
const totalAvisos = resultats.reduce((n, r) => n + r.avisos.length, 0);

/* Mode verificació: la porta pura. */
if (VERIFICA) {
  const brossaVisible = ambEdicions.reduce((n, r) => n + r.edicions.filter((e) => e.op === 'OP1a').length, 0);
  const sinks = ambEdicions.reduce((n, r) => n + r.edicions.filter((e) => e.op === 'OP2').length, 0);
  const salt_prohibit = ambEdicions.reduce((n, r) => n + r.edicions.filter((e) => e.op === 'OP3').length, 0);
  const total = brossaVisible + sinks + salt_prohibit;
  if (illegibles.length) {
    console.error(`❌ [NETEJA] ${illegibles.length} fitxers no es poden parsejar. No puc certificar res:`);
    for (const i of illegibles) console.error(`   · ${i.ruta}: ${i.error}`);
    process.exit(1);
  }
  if (total > 0) {
    console.error(`❌ [NETEJA] Queda brossa: ${brossaVisible} textos JSX visibles · ${sinks} sinks ofuscats · ${salt_prohibit} salt_prohibit inabastables.`);
    process.exit(1);
  }
  console.log('✅ [NETEJA] Cap text JSX brossa, cap sink ofuscat, cap salt_prohibit inabastable.');
  process.exit(0);
}

/* Informe */
const informe = [];
informe.push(`\n🩹 [NETEJA] ${fitxers.length} fitxers analitzats · ${ambEdicions.length} amb edicions · ${totalEdicions} edicions\n`);
for (const [op, n] of Object.entries(perOp).sort()) informe.push(`   ${op}: ${n}`);
if (Object.keys(perOp).length) informe.push('');

for (const r of resultats) {
  if (!r.edicions.length && !r.avisos.length) continue;
  informe.push(`  ── ${rel(r.ruta)}`);
  for (const e of [...r.edicions].sort((a, b) => a.linia - b.linia)) {
    informe.push(`   · L${e.linia} ${e.op} ${e.detall}`);
  }
  for (const a of r.avisos) informe.push(`   ⚠️  L${a.linia} ${a.op} ${a.detall}`);
  informe.push('');
}

if (illegibles.length) {
  informe.push(`  ── fitxers illegibles (${illegibles.length}) ──`);
  for (const i of illegibles) informe.push(`   · ${i.ruta}: ${i.error}`);
  informe.push('');
}

if (!JSON_OUT) console.log(informe.join('\n'));

/* Radi d'explosió */
if (ambEdicions.length > PRESSUPOST) {
  console.error(`❌ [NETEJA] ${ambEdicions.length} fitxers a tocar i el pressupost és ${PRESSUPOST} (core-bounded-action).`);
  console.error(`   Puja'l explícitament (--pressupost=${ambEdicions.length}) o redueix l'abast (--abast=src/sections/mercat).\n`);
  process.exit(1);
}

if (!ESCRIU) {
  if (JSON_OUT) {
    console.log(JSON.stringify({
      fitxers: fitxers.length,
      ambEdicions: ambEdicions.length,
      totalEdicions,
      perOp,
      avisos: totalAvisos,
      illegibles,
      detall: ambEdicions.map((r) => ({ ruta: rel(r.ruta), edicions: r.edicions.map(({ op, linia, detall }) => ({ op, linia, detall })) })),
    }, null, 2));
  } else {
    console.log(`(dry-run: ${totalEdicions} edicions en ${ambEdicions.length} fitxers. Afig --escriu per a aplicar.)\n`);
  }
  process.exit(0);
}

/* ─────────────────────────────── Escriptura verificada ─────────────────────────────── */

const SEGELL = new Date().toISOString().replace(/[:.]/g, '-');
const PAPERERA = R(path.join('.sdp-paperera', SEGELL));
fs.mkdirSync(PAPERERA, { recursive: true });

const rebut = { segell: SEGELL, arrel: ARREL, operacions: [], rebutjats: [] };

for (const r of ambEdicions) {
  const abans = r.codi;
  let despres;
  try {
    despres = aplica(abans, r.edicions);
  } catch (error) {
    rebut.rebutjats.push({ ruta: rel(r.ruta), motiu: error.message });
    continue;
  }

  // Invariant 1 · el resultat ha de parsejar.
  try {
    parseja(despres);
  } catch (error) {
    rebut.rebutjats.push({ ruta: rel(r.ruta), motiu: `el resultat no parseja: ${String(error.message).split('\n')[0]}` });
    continue;
  }

  // Invariant 2 · mateixos elements JSX i mateix text visible.
  const e1 = empremta(abans);
  const e2 = empremta(despres);
  if (e1.elements !== e2.elements || e1.text !== e2.text) {
    rebut.rebutjats.push({ ruta: rel(r.ruta), motiu: `l'empremta ha canviat (elements ${e1.elements}→${e2.elements})` });
    continue;
  }

  const desti = path.join(PAPERERA, rel(r.ruta));
  fs.mkdirSync(path.dirname(desti), { recursive: true });
  fs.writeFileSync(desti, abans, 'utf8');
  fs.writeFileSync(r.ruta, despres, 'utf8');

  rebut.operacions.push({
    ruta: rel(r.ruta),
    edicions: r.edicions.length,
    ops: [...new Set(r.edicions.map((e) => e.op))].sort(),
    sha256_abans: sha(abans),
    sha256_despres: sha(despres),
    copia: rel(desti),
  });
}

const FITXER_REBUT = path.join(PAPERERA, 'rebut.json');
fs.writeFileSync(FITXER_REBUT, `${JSON.stringify(rebut, null, 2)}\n`, 'utf8');

console.log(`✅ [NETEJA] ${rebut.operacions.length} fitxers modificats.`);
console.log(`   Còpia recuperable: ${rel(PAPERERA)}`);
console.log(`   Rebut: ${rel(FITXER_REBUT)}`);
console.log(`   Rollback: cp -R ${rel(PAPERERA)}/{src,tooling} .\n`);

if (rebut.rebutjats.length) {
  console.error(`❌ [NETEJA] ${rebut.rebutjats.length} fitxers rebutjats per no superar la verificació (no s'han tocat):`);
  for (const x of rebut.rebutjats) console.error(`   · ${x.ruta}: ${x.motiu}`);
  console.error('');
  process.exit(1);
}

process.exit(0);
