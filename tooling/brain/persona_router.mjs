#!/usr/bin/env node
/**
 * tooling/session/persona_router.mjs
 * El Router Cognitiu de la IAIA MarIA.
 * Llig l'índex de skills, injecta les CORE sempre, 
 * i usa importació/lectura dinàmica per carregar PLUGINS només si hi ha triggers.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { CAMINS, arrelSegura, R } from '../lib/arrel.mjs';
import crypto from 'node:crypto';

function sha256(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

const args = process.argv.slice(2);
const promptText = args.join(' ').toLowerCase();

const indexFile = R('.agents/skills_index.json');

if (!existsSync(indexFile)) {
  console.error("❌ L'índex de skills no existeix. Executa primer tooling/brain/build_skills_index.mjs");
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexFile, 'utf8'));

const context = {
  timestamp: new Date().toISOString(),
  core: [],
  plugins: []
};

for (const coreSkill of index.core) {
  const content = readFileSync(R(coreSkill.path), 'utf8');
  context.core.push({
    name: coreSkill.name,
    path: coreSkill.path,
    hash: sha256(content),
    content: content
  });
}

/*
 * CASAMENT DE GALLETS (260901, Seient Núm. 5)
 * ──────────────────────────────────────────
 * Abans: `promptText.includes(gallet)`. Subcadena crua, i això trenca en
 * valencià per les dues bandes alhora:
 *   · fals positiu — el gallet «codi» s'encenia dins de «descodificar».
 *   · fals negatiu — el gallet «crear skill» no casava amb «crear una skill»,
 *     perquè la llengua hi posa un article enmig.
 *
 * Ara es casa per paraules, amb dues toleràncies declarades:
 *   1. PREFIX. Una paraula del gallet casa si la del text hi comença: el
 *      valencià flexiona pel final («crea» → «crear», «creació»).
 *   2. FARCIT. Un gallet de diverses paraules admet fins a MAX_FARCIT paraules
 *      intercalades («crear skill» ← «crear una skill»), mantenint l'ordre.
 * Fora d'això no hi ha màgia: si un gallet no s'encén, és que està mal escrit,
 * i això s'ha de veure, no dissimular.
 */
const MAX_FARCIT = 2;

/** Talla en paraules conservant els dígrafs i el punt volat del valencià. */
function paraules(text) {
  return String(text)
    .toLowerCase()
    .split(/[^\p{L}\p{N}·]+/u)
    .filter(Boolean);
}

const PARAULES_ORDRE = paraules(promptText);

function galletEncés(gallet) {
  const busca = paraules(gallet);
  if (!busca.length) return false;

  for (let inici = 0; inici < PARAULES_ORDRE.length; inici++) {
    if (!PARAULES_ORDRE[inici].startsWith(busca[0])) continue;
    let i = inici + 1;
    let k = 1;
    let farcit = 0;
    while (k < busca.length && i < PARAULES_ORDRE.length && farcit <= MAX_FARCIT) {
      if (PARAULES_ORDRE[i].startsWith(busca[k])) { k++; i++; }
      else { farcit++; i++; }
    }
    if (k === busca.length) return true;
  }
  return false;
}

for (const [pluginName, pluginDef] of Object.entries(index.plugins)) {
  const triggers = pluginDef.triggers_on || [];
  const hasTrigger = triggers.some(galletEncés);
  
  if (hasTrigger) {
    const content = readFileSync(R(pluginDef.path), 'utf8');
    context.plugins.push({
      name: pluginName,
      path: pluginDef.path,
      hash: sha256(content),
      content: content
    });
  }
}

console.log(JSON.stringify(context, null, 2));
process.exit(0);
