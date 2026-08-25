import fs from 'node:fs';
import path from 'node:path';

const EXCLUDED_PATHS = [
  'tooling/wiki/core/mutation_kernel.mjs',
  'tooling/wiki/core/tanca.mjs',
  'CERVELL.md',
  'SEGELL.lock',
  'tooling/brain/time-machine.mjs'
];

export function verificaTancaSeguretat(targetFile) {
  const cwd = process.cwd();
  let relPath = path.relative(cwd, targetFile);
  
  // Normalitzar a POSIX
  relPath = relPath.split(path.sep).join('/');

  if (EXCLUDED_PATHS.includes(relPath)) {
    console.error(`\n[LA TANCA - REBUIG ATÒMIC] 🛑 Intent d'automutació bloquejat a: ${relPath}`);
    console.error(`El nucli, la tanca i el manifest són immutables en temps d'execució.\n`);
    process.exit(1);
  }

  // Comprovació estricta si es toca el cervell
  if (relPath.startsWith('.agents/skills/') || relPath.startsWith('.agents/cervells/')) {
    if (!fs.existsSync('SEGELL.lock')) {
      console.error(`\n[LA TANCA - REBUIG ATÒMIC] 🛑 SEGELL.lock no existeix.`);
      console.error(`No pots mutar .agents/skills sense un estat verificat previ.\n`);
      process.exit(1);
    }
    // ACÍ: En el futur s'implementarà la verificació criptogràfica del contingut exacte 
    // de les 24 skills de fàbrica contra el SEGELL abans de permetre l'escriptura.
  }
}
