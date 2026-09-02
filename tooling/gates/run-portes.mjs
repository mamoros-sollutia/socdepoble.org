#!/usr/bin/env node
import { spawnSync } from 'child_process';

const passos = [
  { nom: 'Linter', cmd: 'npm', args: ['run', 'lint'] },
  { nom: 'Porta Promesa', cmd: 'npm', args: ['run', 'porta:promesa'] },
  { nom: 'Porta TDZ', cmd: 'npm', args: ['run', 'porta:tdz'] },
  { nom: 'Porta Arrel', cmd: 'npm', args: ['run', 'porta:arrel'] },
  { nom: 'Porta Enxufe', cmd: 'npm', args: ['run', 'porta:enxufe'] },
  { nom: 'Porta Maquinari', cmd: 'npm', args: ['run', 'porta:maquinari'] },
  { nom: 'Tractor InnerHTML', cmd: 'node', args: ['tooling/gates/tractor-innerhtml.mjs'] },
  { nom: 'Porta Rutes', cmd: 'npm', args: ['run', 'porta:rutes'] },
  { nom: 'Porta Rutes Web', cmd: 'npm', args: ['run', 'porta:rutes-web'] },
  { nom: 'Tractor Cognitiu', cmd: 'node', args: ['tooling/wiki/tractor-cognitiu.mjs', '--arrel=.'] },
  { nom: 'Porta Cens', cmd: 'npm', args: ['run', 'porta:cens'] },
  { nom: 'Porta Consell', cmd: 'npm', args: ['run', 'porta:consell'] },
  { nom: 'Tractor Registre', cmd: 'node', args: ['tooling/gates/tractor-registre.mjs'] },
  { nom: 'Build Skills Index', cmd: 'node', args: ['tooling/brain/build_skills_index.mjs'] },
  { nom: 'Tractor Manifest', cmd: 'node', args: ['tooling/gates/tractor-manifest.mjs'] },
  { nom: 'Tractor Cadena', cmd: 'node', args: ['tooling/gates/tractor-cadena.mjs'] },
  { nom: 'Tractor Doctrina', cmd: 'node', args: ['tooling/gates/tractor-doctrina.mjs'] },
  { nom: 'Tractor Pedra Seca', cmd: 'node', args: ['tooling/brain/tractor-pedra-seca.mjs'] },
  { nom: 'Design Guard', cmd: 'node', args: ['tooling/gates/design_guard.mjs', '--arrel=src'] },
  { nom: 'Porta Tokens', cmd: 'npm', args: ['run', 'porta:tokens'] },
  { nom: 'Porta Cromàtic', cmd: 'npm', args: ['run', 'porta:cromatic'] },
  { nom: 'Porta Vocabulari', cmd: 'npm', args: ['run', 'porta:vocabulari'] },
  { nom: 'Tractor Persistència', cmd: 'node', args: ['tooling/gates/tractor-persistencia.mjs'] },
  { nom: 'Porta Shim', cmd: 'npm', args: ['run', 'porta:shim'] },
  { nom: 'Porta Frontera', cmd: 'npm', args: ['run', 'porta:frontera'] },
  { nom: 'Porta Estucat', cmd: 'npm', args: ['run', 'porta:estucat'] },
  { nom: 'Llaurador Índexs', cmd: 'node', args: ['tooling/wiki/llaurador_indexs.mjs', '--check'] },
  { nom: 'Tractor Frontmatter', cmd: 'node', args: ['tooling/wiki/tractor-frontmatter.mjs'] },
  { nom: 'SEO Manifest', cmd: 'node', args: ['tooling/gates/build-seo-manifest.mjs', '--verifica'] },
];

let failed = false;
let errors = [];

console.log("\n🚀 INICIANT CADENA AGREGATIVA DE PORTES...\n");

for (const pas of passos) {
  console.log(`\n────────────────────────────────────────────────────────────────────────`);
  console.log(`⏳ Executant ${pas.nom}...`);
  console.log(`────────────────────────────────────────────────────────────────────────\n`);
  const result = spawnSync(pas.cmd, pas.args, { stdio: 'inherit', encoding: 'utf-8' });
  if (result.error || result.status !== 0) {
    console.log(`\n❌ [FRACÀS] ${pas.nom}`);
    failed = true;
    errors.push(pas.nom);
  } else {
    console.log(`\n✅ [OK] ${pas.nom}`);
  }
}

console.log(`\n========================================================================`);
if (failed) {
  console.error(`💥 RESUM DE FALLIDES (${errors.length} tractor/s):`);
  for (const err of errors) {
    console.error(`   - ❌ ${err}`);
  }
  console.error(`\n🔒 Resol els deutes abans de fer commit.\n`);
  process.exit(1);
} else {
  console.log(`🎉 TOTES LES PORTES HAN PASSAT AMB ÈXIT. MUR DE PEDRA SECA INTACTE.`);
}
console.log(`========================================================================\n`);
process.exit(0);
