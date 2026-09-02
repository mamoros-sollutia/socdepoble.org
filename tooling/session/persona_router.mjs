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

for (const [pluginName, pluginDef] of Object.entries(index.plugins)) {
  const triggers = pluginDef.triggers_on || [];
  const hasTrigger = triggers.some(t => promptText.includes(t.toLowerCase()));
  
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
