#!/usr/bin/env node
/**
 * tooling/brain/build_skills_index.mjs
 * Compilador de l'índex de Skills. Llig els frontmatters dels SKILL.md i genera
 * `.agents/skills_index.json`, que és el que carrega el router cognitiu.
 *
 * PER QUÈ ES VA REESCRIURE (260901, Seient Núm. 5)
 * ───────────────────────────────────────────────
 * Este fitxer portava el seu propi parser de YAML, escrit a mà, diferent del de
 * `tooling/wiki/lib/frontmatter.mjs` —que es documenta a si mateix com «l'únic
 * parser de la Wiki». N'hi havia dos, i manava el permissiu.
 *
 * Mesurat sobre el farcell 260901_2031, amb els 12 SKILL.md reals:
 *   · parser canònic ............ 12/12 MALFORMAT
 *   · parser d'este fitxer ...... 12/12 correcte, «Core: 8 · Plugins: 4»
 *
 * A més no entenia els escalars de bloc: cinc skills quedaven indexades amb
 * `description: ">"`, un sol caràcter. El semàfor verd el generava el component
 * que no mirava, i eixe verd és el que arribava als informes.
 *
 * REGLES
 *   1. Un sol parser per a tot el projecte. Este fitxer no en porta cap de propi.
 *   2. Fail-closed: si un frontmatter és malformat o duplica claus, no s'escriu
 *      l'índex i s'ix amb codi 1. Un índex parcial és pitjor que cap índex,
 *      perquè no es distingix de l'índex bo.
 *   3. Els gallets s'indexen també per a les core. No canvien la càrrega (les
 *      core van sempre), però permeten que una porta detecte col·lisions.
 */

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { CAMINS, arrelSegura, R } from '../lib/arrel.mjs';
import { parseFrontmatter } from '../wiki/lib/frontmatter.mjs';

let ARREL;
try {
  ARREL = arrelSegura();
} catch (e) {
  console.error(e.informe ? e.informe() : String(e));
  process.exit(1);
}

const skillsDir = R(CAMINS.skills);
const indexFile = R('.agents/skills_index.json');

function camiRelatiu(abs) {
  return relative(ARREL, abs).split('\\').join('/');
}

/** Normalitza `triggers_on` vinga com vinga: llista en bloc, inline o absent. */
function gallets(data) {
  const cru = data.triggers_on;
  if (Array.isArray(cru)) return cru.map((t) => String(t).trim()).filter(Boolean);
  if (typeof cru === 'string' && cru.trim()) return [cru.trim()];
  return [];
}

if (!existsSync(skillsDir)) {
  console.error(`\n[SKILLS] No existix ${CAMINS.skills}. No hi ha cervell que compilar.\n`);
  process.exit(1);
}

const index = { core: [], plugins: {} };
const defectes = [];

for (const d of readdirSync(skillsDir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
  if (!d.isDirectory()) continue;
  const cami = join(skillsDir, d.name, 'SKILL.md');
  if (!existsSync(cami)) {
    defectes.push(`${d.name}: directori de skill sense SKILL.md`);
    continue;
  }

  let cru;
  try {
    cru = readFileSync(cami, 'utf8');
  } catch (e) {
    defectes.push(`${d.name}: no es pot llegir (${e.message})`);
    continue;
  }

  const fm = parseFrontmatter(cru);

  if (fm.malformed) {
    defectes.push(`${d.name}: frontmatter obert i mai tancat. Repara-ho amb 'node tooling/brain/reparar_frontmatter_skills.mjs --escriu'`);
    continue;
  }
  if (!fm.hasFrontmatter) {
    defectes.push(`${d.name}: sense frontmatter. Una skill sense metadades no és carregable.`);
    continue;
  }
  if (fm.duplicateKeys.length) {
    defectes.push(`${d.name}: claus duplicades al frontmatter: ${fm.duplicateKeys.join(', ')}`);
    continue;
  }
  for (const e of fm.errors) defectes.push(`${d.name}: ${e}`);

  const meta = fm.data;
  const descripcio = String(meta.description ?? '').trim();
  if (!descripcio) defectes.push(`${d.name}: sense 'description'. El router no pot dir què fa.`);
  // Una descripció d'un sol caràcter era el símptoma del parser vell menjant-se
  // l'indicador d'escalar de bloc. Si torna a passar, que es veja ací.
  if (descripcio === '>' || descripcio === '|') {
    defectes.push(`${d.name}: la descripció és l'indicador d'escalar de bloc, no el text. Parser trencat.`);
  }

  const entrada = {
    name: d.name,
    description: descripcio,
    triggers_on: gallets(meta),
    path: camiRelatiu(cami),
  };

  if (meta.core === true || meta.core === 'true') index.core.push(entrada);
  else index.plugins[d.name] = entrada;
}

if (defectes.length) {
  console.error('\n[SKILLS] Index NO escrit. El cervell declarat i el cervell real no coincidirien:\n');
  for (const d of defectes) console.error(`   · ${d}`);
  console.error(`\n   ${defectes.length} defecte(s). Un índex parcial no es distingix d'un índex bo.\n`);
  process.exit(1);
}

writeFileSync(indexFile, JSON.stringify(index, null, 2) + '\n', 'utf8');

const totalGallets = [...index.core, ...Object.values(index.plugins)]
  .reduce((n, s) => n + s.triggers_on.length, 0);

console.log(`Index de skills escrit a ${camiRelatiu(indexFile)}`);
console.log(`   · core (sempre carregades) : ${index.core.length}`);
console.log(`   · efimeres (per gallet)    : ${Object.keys(index.plugins).length}`);
console.log(`   · gallets indexats         : ${totalGallets}`);
