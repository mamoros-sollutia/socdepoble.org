#!/usr/bin/env node
/**
 * tractor-manifest.mjs — la porta del punt cec.
 *
 * PER QUÈ EXISTIX
 * ───────────────
 * `.agents/manifest.yaml` és canònic: `tooling/lib/arrel.mjs` el declara a
 * `CAMINS.manifest`, i la seua pròpia capçalera diu, textualment:
 *
 *     «Regla: aquest fitxer llista el que hi ha al disc. Si afiges una skill,
 *      regenera'l; no l'edites a mà. La porta `tooling/gates/tractor-registre.mjs`
 *      falla si diverge.»
 *
 * Això és fals. `tractor-registre.mjs` no obri mai el manifest: compara ÍNDEX
 * contra DISC i prou. El manifest declarava 14 skills, 6 de les quals ja no
 * existixen (`actitud-dafo`, `cog-deliberation`, `core-bounded-action`,
 * `core-trust-boundary`, `core-verified-change`, `multi-agent-review`) i
 * n'ignorava 5 de reals (`core-brain-hygiene`, `core-change-control`,
 * `core-higiene-reflexa`, `council-review`, `identity-iaia-core`).
 *
 * Un document que promet una porta que no existix és pitjor que un document
 * sense porta: convida a confiar-hi. Açò és eixa porta.
 *
 * LLEIS
 *   M1  PUNTER-MORT     una clau d'arrel (identity/bios/…) apunta a un fitxer inexistent
 *   M2  FANTASMA        el manifest declara una skill sense carpeta al disc
 *   M3  OMESA           hi ha carpeta al disc que el manifest no declara
 *   M4  DESACORD-INDEX  manifest i 00_INDEX_SKILLS.md no declaren el mateix conjunt
 *   M5  SCHEMA          `schema:` absent o desconegut
 *   M6  ORDRE           la llista no està ordenada (dificulta els diffs i amaga duplicats)
 *   M7  DUPLICADA       la mateixa skill declarada dues vegades
 *   M8  PROMESA-FALSA   el manifest cita una porta que no el llig
 *
 * Pedra Seca: zero dependències, ESM, fail-closed, eixida per stdout.
 *
 *   node tooling/gates/tractor-manifest.mjs
 *   node tooling/gates/tractor-manifest.mjs --json
 *   node tooling/gates/tractor-manifest.mjs --escriu     (regenera el manifest)
 *   node tooling/gates/tractor-manifest.mjs --arrel=/ruta
 */

import fs from 'node:fs';
import path from 'node:path';
import { arrelSegura, R, rel, CAMINS } from '../lib/arrel.mjs';

const JSON_OUT = process.argv.includes('--json');
const ESCRIU = process.argv.includes('--escriu');

let ARREL;
try {
  ARREL = arrelSegura();
} catch (e) {
  console.error(e.informe ? e.informe() : String(e));
  process.exit(1);
}

const problemes = [];
const falla = (llei, subjecte, missatge) => problemes.push({ llei, subjecte, missatge });

/* ═══════════════════ Lectura del manifest (subconjunt YAML) ═══════════════════ */

/**
 * No implementa YAML. Cobrix exactament la forma del manifest: escalars
 * `clau: valor` i llistes en bloc `  - element`. Qualsevol altra cosa es
 * reporta com a malformada en compte d'endevinar-la.
 */
function llegeixManifest(cru) {
  const escalars = {};
  const llistes = {};
  let clauActiva = null;
  let linia = 0;
  const linies = [];

  for (const brut of cru.split(/\r?\n/)) {
    linia += 1;
    if (!brut.trim() || /^\s*#/.test(brut)) continue;

    const item = /^\s+-\s+(.*)$/.exec(brut);
    if (item) {
      if (!clauActiva) continue;
      const valor = item[1].trim().replace(/^["']|["']$/g, '');
      llistes[clauActiva].push(valor);
      linies.push({ clau: clauActiva, valor, linia });
      continue;
    }

    const m = /^([A-Za-z0-9_.-]+):\s*(.*)$/.exec(brut);
    if (!m) continue;
    const [, clau, valorBrut] = m;
    const valor = valorBrut.trim().replace(/^["']|["']$/g, '');
    if (valor === '') {
      llistes[clau] = [];
      clauActiva = clau;
    } else {
      escalars[clau] = valor;
      clauActiva = null;
    }
  }
  return { escalars, llistes, linies };
}

const CAMI_MANIFEST = R(CAMINS.manifest);
if (!fs.existsSync(CAMI_MANIFEST)) {
  console.error(`\n❌ [MANIFEST] Falta ${CAMINS.manifest}. \`arrel.mjs\` el declara canònic a CAMINS.manifest i no hi és.\n`);
  process.exit(1);
}

const cruManifest = fs.readFileSync(CAMI_MANIFEST, 'utf8');
const man = llegeixManifest(cruManifest);

/* ═══════════════════════════ M5 · schema ═══════════════════════════ */

const SCHEMES_CONEGUTS = new Set(['socdepoble.manifest.v1']);
if (!man.escalars.schema) {
  falla('M5', CAMINS.manifest, 'Sense `schema:`. Un manifest sense versió d\'esquema no es pot migrar ni validar de forma estable.');
} else if (!SCHEMES_CONEGUTS.has(man.escalars.schema)) {
  falla('M5', CAMINS.manifest, `\`schema: ${man.escalars.schema}\` desconegut. Coneguts: ${[...SCHEMES_CONEGUTS].join(', ')}.`);
}

/* ═══════════════════════ M1 · punters d'arrel ═══════════════════════ */

/*
 * Els punters són relatius a `.agents/`, no a l'arrel del repositori. Es
 * resolen des d'allí i prou: cap heurística de «prova també ací».
 */
const DIR_AGENTS = R(CAMINS.agents);
const CLAUS_PUNTER = ['identity', 'bios', 'baseline', 'index_skills', 'consell', 'protocol', 'bootstrap'];

for (const clau of CLAUS_PUNTER) {
  const valor = man.escalars[clau];
  if (!valor) continue; // opcional: si no es declara, no hi ha promesa que trencar
  const abs = path.join(DIR_AGENTS, valor);
  if (!fs.existsSync(abs)) {
    falla('M1', clau, `\`${clau}: ${valor}\` no existix (buscat a ${rel(abs)}). Punter mort al manifest canònic.`);
  }
}

/* ═══════════════════ Skills: manifest vs disc vs índex ═══════════════════ */

const DIR_SKILLS = R(CAMINS.skills);
if (!fs.existsSync(DIR_SKILLS)) {
  console.error(`\n❌ [MANIFEST] Falta ${CAMINS.skills}. No hi ha res a comparar.\n`);
  process.exit(1);
}

const alDisc = new Set(
  fs.readdirSync(DIR_SKILLS, { withFileTypes: true })
    .filter((e) => e.isDirectory() && fs.existsSync(path.join(DIR_SKILLS, e.name, 'SKILL.md')))
    .map((e) => e.name),
);

const declaradesBrut = (man.llistes.skills || []).map((s) => {
  const m = /^skills\/(.+?)\/SKILL\.md$/.exec(s);
  return m ? m[1] : s.replace(/\/SKILL\.md$/, '').replace(/^skills\//, '');
});

/* M7 · duplicats */
const comptes = new Map();
for (const n of declaradesBrut) comptes.set(n, (comptes.get(n) || 0) + 1);
for (const [n, c] of comptes) {
  if (c > 1) falla('M7', n, `Declarada ${c} vegades al manifest. Un manifest generat mai duplica: si hi és, és que s'ha editat a mà.`);
}

const declarades = new Set(declaradesBrut);

/* M2 · fantasmes | M3 · omeses */
for (const n of [...declarades].sort()) {
  if (!alDisc.has(n)) {
    falla('M2', n, `Declarada al manifest i sense \`skills/${n}/SKILL.md\` al disc. Qui llija el manifest per a carregar el cervell, fallarà.`);
  }
}
for (const n of [...alDisc].sort()) {
  if (!declarades.has(n)) {
    falla('M3', n, `Existix al disc i el manifest no la declara. El manifest diu que «llista el que hi ha al disc» i no ho fa.`);
  }
}

/* M6 · ordre */
const ordenat = [...declaradesBrut].sort((a, b) => a.localeCompare(b, 'ca'));
if (declaradesBrut.join('\u0000') !== ordenat.join('\u0000')) {
  falla('M6', CAMINS.manifest, 'La llista de skills no està ordenada alfabèticament. Els diffs es tornen sorollosos i els duplicats passen desapercebuts.');
}

/* M4 · desacord amb l'índex */
const CAMI_INDEX = R(CAMINS.indexSkills);
if (fs.existsSync(CAMI_INDEX)) {
  const cruIndex = fs.readFileSync(CAMI_INDEX, 'utf8');
  const FORMES = [
    /^\s*[-*]\s*`([a-z0-9][a-z0-9._-]*)`\s*:/i,
    /^\s*[-*]\s*\[\[([a-z0-9][a-z0-9._-]*)\/SKILL\s*\|[^\]]*\]\]\s*:/i,
    /^\s*[-*]\s*\[\[([a-z0-9][a-z0-9._-]*)(?:\s*\|[^\]]*)?\]\]\s*:/i,
    /^\s*[-*]\s*\*\*([a-z0-9][a-z0-9._-]*)\*\*\s*:/i,
  ];
  const alIndex = new Set();
  for (const linia of cruIndex.split(/\r?\n/)) {
    for (const f of FORMES) {
      const m = f.exec(linia);
      if (m) { alIndex.add(m[1]); break; }
    }
  }
  if (alIndex.size === 0) {
    falla('M4', CAMINS.indexSkills, 'No s\'ha pogut llegir cap skill de l\'índex. O ha canviat de format o és buit: en tots dos casos no es pot comparar amb el manifest.');
  } else {
    for (const n of [...declarades].filter((x) => !alIndex.has(x)).sort()) {
      falla('M4', n, 'Al manifest i absent de l\'índex canònic. Dos registres oficials que no diuen el mateix: no hi ha «únic registre oficial».');
    }
    for (const n of [...alIndex].filter((x) => !declarades.has(x)).sort()) {
      falla('M4', n, 'A l\'índex canònic i absent del manifest. Dos registres oficials que no diuen el mateix.');
    }
  }
}

/* ═══════════════════ M8 · promeses de portes inexistents ═══════════════════ */

/*
 * El manifest cita portes per nom. Si la porta citada no llig el manifest, la
 * cita és una garantia falsa. Es comprova mecànicament: la porta ha d'existir
 * I ha de contindre la cadena `manifest`.
 */
for (const m of cruManifest.matchAll(/tooling\/gates\/([a-z0-9_-]+\.mjs)/gi)) {
  const porta = m[1];
  const abs = R('tooling/gates', porta);
  if (!fs.existsSync(abs)) {
    falla('M8', porta, `El manifest cita \`tooling/gates/${porta}\` i eixa porta no existix.`);
    continue;
  }
  if (path.basename(abs) === path.basename(new URL(import.meta.url).pathname)) continue;
  const cos = fs.readFileSync(abs, 'utf8');
  if (!/manifest/i.test(cos)) {
    falla('M8', porta, `El manifest diu que \`${porta}\` «falla si diverge», però eixa porta no obri mai el manifest. La garantia és falsa i convida a confiar-hi.`);
  }
}

/* ═══════════════════════════ Regeneració ═══════════════════════════ */

function regenera() {
  const capçalera = [
    '# Manifest d\'agents de Sóc de Poble.',
    '#',
    '# GENERAT. No l\'edites a mà.',
    '#   node tooling/gates/tractor-manifest.mjs --escriu',
    '#',
    '# La porta `tooling/gates/tractor-manifest.mjs` falla si diverge del disc',
    '# o de `skills/00_INDEX_SKILLS.md`. Eixa porta sí que obri este fitxer.',
    '',
  ];
  const cos = [
    `schema: ${man.escalars.schema || 'socdepoble.manifest.v1'}`,
    `identity: ${man.escalars.identity || 'PROFILE.md'}`,
    `bios: ${man.escalars.bios || 'AGENTS.md'}`,
    `baseline: ${man.escalars.baseline || 'BASELINE.md'}`,
    `index_skills: ${man.escalars.index_skills || 'skills/00_INDEX_SKILLS.md'}`,
    `consell: ${man.escalars.consell || 'consell.json'}`,
    'skills:',
    ...[...alDisc].sort((a, b) => a.localeCompare(b, 'ca')).map((n) => `  - skills/${n}/SKILL.md`),
    '',
  ];
  fs.writeFileSync(CAMI_MANIFEST, [...capçalera, ...cos].join('\n'), 'utf8');
  console.log(`\n✍️  [MANIFEST] Regenerat des del disc: ${alDisc.size} skills.\n`);
}

/* ═══════════════════════════ Eixida ═══════════════════════════ */

if (JSON_OUT) {
  console.log(JSON.stringify({
    porta: 'tractor-manifest',
    arrel: ARREL,
    disc: [...alDisc].sort(),
    manifest: [...declarades].sort(),
    problemes,
    ok: problemes.length === 0,
  }, null, 2));
  process.exit(problemes.length === 0 ? 0 : 1);
}

console.log('\n📜 TRACTOR DEL MANIFEST');
console.log('─'.repeat(72));
console.log(`   Manifest declara ${declarades.size} · disc en té ${alDisc.size}`);

if (problemes.length === 0) {
  console.log('\n✅ [MANIFEST] El manifest, el disc i l\'índex diuen el mateix.\n');
  process.exit(0);
}

const perLlei = new Map();
for (const p of problemes) {
  if (!perLlei.has(p.llei)) perLlei.set(p.llei, []);
  perLlei.get(p.llei).push(p);
}
for (const [llei, llista] of [...perLlei].sort()) {
  console.log(`\n  ── ${llei} (${llista.length}) ${'─'.repeat(28)}`);
  for (const p of llista) console.log(`   · ${p.subjecte}: ${p.missatge}`);
}

if (ESCRIU) {
  regenera();
  console.log('   Torna a executar la porta per a confirmar.\n');
  process.exit(0);
}

console.log(`\n❌ [MANIFEST] ${problemes.length} divergències.`);
console.log('   Per a regenerar-lo des del disc: node tooling/gates/tractor-manifest.mjs --escriu\n');
process.exit(1);
