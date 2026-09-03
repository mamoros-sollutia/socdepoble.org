#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

const passos = [
  { nom: 'Linter', cmd: 'npm', args: ['run', 'lint'] },
  { nom: 'Porta Build', cmd: 'npm', args: ['run', 'porta:build'] },
  { nom: 'Porta Promesa', cmd: 'npm', args: ['run', 'porta:promesa'] },
  { nom: 'Porta TDZ', cmd: 'npm', args: ['run', 'porta:tdz'] },
  { nom: 'Porta Arrel', cmd: 'npm', args: ['run', 'porta:arrel'] },
  { nom: 'Porta Enxufe', cmd: 'npm', args: ['run', 'porta:enxufe'] },
  { nom: 'Porta Maquinari', cmd: 'npm', args: ['run', 'porta:maquinari'] },
  { nom: 'Porta InnerHTML', cmd: 'npm', args: ['run', 'porta:innerhtml'] },
  { nom: 'Porta Rutes', cmd: 'npm', args: ['run', 'porta:rutes'] },
  { nom: 'Porta Rutes Web', cmd: 'npm', args: ['run', 'porta:rutes-web'] },
  { nom: 'Porta Frontera', cmd: 'npm', args: ['run', 'porta:frontera'] },
  { nom: 'Porta Frontera Auth', cmd: 'npm', args: ['run', 'porta:frontera-auth'] },
  { nom: 'Tractor Cognitiu', cmd: 'npm', args: ['run', 'porta:cognitiu'] },
  { nom: 'Porta Cens', cmd: 'npm', args: ['run', 'porta:cens'] },
  { nom: 'Porta Consell', cmd: 'npm', args: ['run', 'porta:consell'] },
  { nom: 'Porta Registre', cmd: 'npm', args: ['run', 'porta:registre'] },
  { nom: 'Build Skills Index', cmd: 'npm', args: ['run', 'skills:index'] },
  { nom: 'Porta Manifest', cmd: 'npm', args: ['run', 'porta:manifest'] },
  { nom: 'Porta Doctrina', cmd: 'npm', args: ['run', 'porta:doctrina'] },
  { nom: 'Porta Reflex', cmd: 'npm', args: ['run', 'porta:reflex'] },
  { nom: 'Tractor Pedra Seca', cmd: 'npm', args: ['run', 'porta:pedra-seca'] },
  { nom: 'Design Guard', cmd: 'npm', args: ['run', 'porta:design-guard'] },
  { nom: 'Porta Tokens', cmd: 'npm', args: ['run', 'porta:tokens'] },
  { nom: 'Porta Cromàtic', cmd: 'npm', args: ['run', 'porta:cromatic'] },
  { nom: 'Porta Vocabulari', cmd: 'npm', args: ['run', 'porta:vocabulari'] },
  { nom: 'Porta Estucat', cmd: 'npm', args: ['run', 'porta:estucat'] },
  { nom: 'Llaurador Índexs', cmd: 'npm', args: ['run', 'porta:llaurador'] },
  { nom: 'Porta Frontmatter', cmd: 'npm', args: ['run', 'porta:frontmatter'] },
  { nom: 'Porta Esquemes', cmd: 'npm', args: ['run', 'porta:esquemes'] },
  { nom: 'Porta Teixit', cmd: 'npm', args: ['run', 'porta:teixit'] },
  { nom: 'Porta SCC', cmd: 'npm', args: ['run', 'porta:scc'] },
  { nom: 'SEO Manifest', cmd: 'npm', args: ['run', 'porta:seo'] },
  { nom: 'Porta Persistència', cmd: 'npm', args: ['run', 'porta:persistencia'] },
  { nom: 'Porta Shim', cmd: 'npm', args: ['run', 'porta:shim'] },
  { nom: 'Porta Cadena', cmd: 'npm', args: ['run', 'porta:cadena'] }
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
