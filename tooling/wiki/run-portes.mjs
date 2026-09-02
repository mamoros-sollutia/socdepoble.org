#!/usr/bin/env node
/**
 * run-portes.mjs — cadena agregativa canònica.
 *
 * V7.1 · dos canvis respecte de la V7:
 *
 *   1. Cada pas s'invoca com a `npm run <script>`, mai com a `node <fitxer>`.
 *      `tractor-cadena.mjs` només reconeix una porta com a viva si algun script
 *      del `package.json` la nomena (C1). Cridar el fitxer directament des d'ací
 *      la deixava òrfena: s'executava, però la porta que vigila les portes no
 *      podia veure-la. Vuit portes vivien així.
 *
 *   2. `node:child_process` en compte de `child_process`. Un paquet homònim
 *      dins de node_modules no pot segrestar l'espai de noms `node:`.
 *
 * Segueix sent agregativa: recorre tots els passos encara que en falle un, i
 * no talla al primer error com feia la cadena `&&` de V5.
 */

import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

/**
 * Ordre deliberat: primer el que és barat i atura prompte (lint, promesa,
 * TDZ), després l'estructura, i al final el teixit i la coherència del graf,
 * que són els passos més cars.
 */
export const passos = [
  { nom: 'Linter',                script: 'lint' },

  /* ── Codi ── */
  { nom: 'Porta Promesa',         script: 'porta:promesa' },
  { nom: 'Porta TDZ',             script: 'porta:tdz' },
  { nom: 'Porta Arrel',           script: 'porta:arrel' },
  { nom: 'Porta Enxufe',          script: 'porta:enxufe' },
  { nom: 'Porta Maquinari',       script: 'porta:maquinari' },
  { nom: 'Porta InnerHTML',       script: 'porta:innerhtml' },
  { nom: 'Porta Persistència',    script: 'porta:persistencia' },
  { nom: 'Porta Shim',            script: 'porta:shim' },

  /* ── Rutes i frontera ── */
  { nom: 'Porta Rutes',           script: 'porta:rutes' },
  { nom: 'Porta Rutes Web',       script: 'porta:rutes-web' },
  { nom: 'Porta Frontera',        script: 'porta:frontera' },
  { nom: 'Porta Frontera Auth',   script: 'porta:frontera-auth' },

  /* ── Cervell, skills i registre ── */
  { nom: 'Tractor Cognitiu',      script: 'porta:cognitiu' },
  { nom: 'Porta Cens',            script: 'porta:cens' },
  { nom: 'Porta Consell',         script: 'porta:consell' },
  { nom: 'Porta Registre',        script: 'porta:registre' },
  { nom: 'Índex de Skills',       script: 'skills:index' },
  { nom: 'Porta Manifest',        script: 'porta:manifest' },
  { nom: 'Porta Doctrina',        script: 'porta:doctrina' },
  { nom: 'Porta Reflex',          script: 'porta:reflex' },

  /* ── Disseny ── */
  { nom: 'Tractor Pedra Seca',    script: 'porta:pedra-seca' },
  { nom: 'Design Guard',          script: 'porta:design-guard' },
  { nom: 'Porta Tokens',          script: 'porta:tokens' },
  { nom: 'Porta Cromàtic',        script: 'porta:cromatic' },
  { nom: 'Porta Vocabulari',      script: 'porta:vocabulari' },
  { nom: 'Porta Estucat',         script: 'porta:estucat' },

  /* ── Graf i coherència ── */
  { nom: 'Llaurador Índexs',      script: 'porta:llaurador' },
  { nom: 'Porta Frontmatter',     script: 'porta:frontmatter' },
  { nom: 'Porta Esquemes',        script: 'porta:esquemes' },
  { nom: 'Porta Teixit',          script: 'porta:teixit' },
  { nom: 'Porta SCC',             script: 'porta:scc' },
  { nom: 'SEO Manifest',          script: 'porta:seo' },

  /* ── La porta que vigila les portes. Sempre l'última. ── */
  { nom: 'Porta Cadena',          script: 'porta:cadena' },
];

const esPrincipal = Boolean(process.argv[1])
  && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

const ratlla = '─'.repeat(72);
if (!esPrincipal) { /* importat com a font de veritat per tractor-cadena.mjs */ }
else {
const errors = [];

console.log('\n🚀 INICIANT CADENA AGREGATIVA DE PORTES...\n');

for (const pas of passos) {
  console.log(`\n${ratlla}\n⏳ ${pas.nom}  ·  npm run ${pas.script}\n${ratlla}\n`);
  const r = spawnSync('npm', ['run', pas.script], { stdio: 'inherit', encoding: 'utf-8' });
  if (r.error || r.status !== 0) {
    console.log(`\n❌ [FRACÀS] ${pas.nom}`);
    errors.push(pas.nom);
  } else {
    console.log(`\n✅ [OK] ${pas.nom}`);
  }
}

console.log(`\n${'='.repeat(72)}`);
if (errors.length) {
  console.error(`💥 RESUM DE FALLIDES (${errors.length} de ${passos.length}):`);
  for (const e of errors) console.error(`   - ❌ ${e}`);
  console.error('\n🔒 Resol els deutes abans de fer commit.\n');
  process.exit(1);
}
console.log(`🎉 LES ${passos.length} PORTES HAN PASSAT. MUR DE PEDRA SECA INTACTE.`);
console.log(`${'='.repeat(72)}\n`);
process.exit(0);
}
