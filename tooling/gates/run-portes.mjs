#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

const passos = [


  { nom: 'Linter', cmd: 'npm', args: ['run', 'lint'] },
  { nom: 'Porta Build', cmd: 'node', args: ['tooling/gates/tractor-build-previ.mjs'] },
  { nom: 'Porta Promesa', cmd: 'node', args: ['tooling/gates/tractor-promesa.mjs'] },
  { nom: 'Porta TDZ', cmd: 'node', args: ['tooling/gates/tractor-tdz.mjs'] },
  { nom: 'Porta Arrel', cmd: 'node', args: ['tooling/gates/tractor-arrel.mjs'] },
  { nom: 'Porta Enxufe', cmd: 'node', args: ['tooling/gates/tractor-enxufe.mjs'] },
  { nom: 'Porta Maquinari', cmd: 'node', args: ['tooling/gates/tractor-doctrina-maquinari.mjs'] },
  { nom: 'Porta InnerHTML', cmd: 'node', args: ['tooling/gates/tractor-innerhtml.mjs'] },
  { nom: 'Porta Rutes', cmd: 'node', args: ['tooling/gates/tractor-rutes.mjs'] },
  { nom: 'Porta Rutes Web', cmd: 'node', args: ['tooling/gates/tractor-rutes-web.mjs'] },
  { nom: 'Porta Frontera', cmd: 'node', args: ['tooling/gates/tractor-sollutia.mjs'] },
  { nom: 'Porta Frontera Auth', cmd: 'node', args: ['tooling/wiki/tractor-frontera-auth.mjs'] },
  { nom: 'Tractor Cognitiu', cmd: 'node', args: ['tooling/wiki/tractor-cognitiu.mjs', '--arrel=.'] },
  { nom: 'Porta Cens', cmd: 'node', args: ['tooling/gates/tractor-cens.mjs'] },
  { nom: 'Porta Consell', cmd: 'node', args: ['tooling/gates/tractor-consell.mjs'] },
  { nom: 'Porta Registre', cmd: 'node', args: ['tooling/gates/tractor-registre.mjs'] },
  { nom: 'Build Skills Index', cmd: 'node', args: ['tooling/brain/build_skills_index.mjs'] },
  { nom: 'Porta Manifest', cmd: 'node', args: ['tooling/gates/tractor-manifest.mjs'] },
  { nom: 'Porta Doctrina', cmd: 'node', args: ['tooling/gates/tractor-doctrina.mjs'] },
  { nom: 'Porta Reflex', cmd: 'node', args: ['tooling/wiki/reflex_petorreta.mjs', 'doctor', '--ci'] },
  { nom: 'Tractor Pedra Seca', cmd: 'node', args: ['tooling/brain/tractor-pedra-seca.mjs'] },
  { nom: 'Design Guard', cmd: 'node', args: ['tooling/gates/design_guard.mjs', '--arrel=src'] },
  { nom: 'Porta Tokens', cmd: 'node', args: ['tooling/gates/tractor-tokens.mjs'] },
  { nom: 'Porta Cromàtic', cmd: 'node', args: ['tooling/gates/tractor-cromatic.mjs'] },
  { nom: 'Porta Vocabulari', cmd: 'node', args: ['tooling/gates/tractor-vocabulari.mjs'] },
  { nom: 'Porta Estucat', cmd: 'node', args: ['tooling/gates/tractor-estucat.mjs', '--arrel=.'] },
  { nom: 'Llaurador Índexs', cmd: 'node', args: ['tooling/wiki/llaurador_indexs.mjs', '--check', '--lock-token'] },
  { nom: 'Porta Frontmatter', cmd: 'node', args: ['tooling/wiki/tractor-frontmatter.mjs'] },
  { nom: 'Porta Esquemes', cmd: 'node', args: ['tooling/wiki/tractor-esquemes.mjs'] },
  { nom: 'Porta Teixit', cmd: 'node', args: ['tooling/wiki/teixidor.mjs', '--lock-token'] },
  { nom: 'Porta SCC', cmd: 'node', args: ['tooling/gates/verificador-scc.mjs'] },
  { nom: 'SEO Manifest', cmd: 'node', args: ['tooling/gates/build-seo-manifest.mjs', '--verifica', '--lock-token'] },
  { nom: 'Porta Persistència', cmd: 'node', args: ['tooling/gates/tractor-persistencia.mjs'] },
  { nom: 'Porta Shim', cmd: 'node', args: ['tooling/gates/tractor-shim.mjs'] },
  { nom: 'Porta Cadena', cmd: 'node', args: ['tooling/gates/tractor-cadena.mjs'] }
,
  { nom: 'Tractor Llavor', cmd: 'node', args: ['tooling/gates/tractor-llavor.mjs'] }
,
  { nom: 'Porta Segella', cmd: 'node', args: ['tooling/gates/segella.mjs'] }
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
