import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

function checkCssFiles(dir) {
  let hasErrors = false;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      if (checkCssFiles(fullPath)) hasErrors = true;
    } else if (file.endsWith('.css')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // 1. Prohibir 56px durament en alçades
        if (line.match(/(height|min-height|max-height):\s*56px/)) {
          if (line.includes('sdp-ignore-56')) continue;
          console.error(`[PORTA 58px] ERROR a ${fullPath}:${i+1}`);
          console.error(`  Trobada alçada de 56px. L'estàndard és 58px (--sdp-alt-accio).`);
          console.error(`  Línia: ${line.trim()}`);
          hasErrors = true;
        }

        // 2. Prohibir 58px en brut (s'ha d'usar la variable)
        if (line.match(/(height|min-height|max-height):\s*58px/) && !line.includes('--notes-header-height')) {
          console.error(`[PORTA 58px] ERROR a ${fullPath}:${i+1}`);
          console.error(`  Trobat '58px' en brut. Fes servir 'var(--sdp-alt-accio)'.`);
          console.error(`  Línia: ${line.trim()}`);
          hasErrors = true;
        }

        // 3. Prohibir calc(+1px) sobre la barra
        if (line.match(/calc\(var\(--sdp-alt-accio\)\s*\+\s*1px\)/)) {
          console.error(`[PORTA 58px] ERROR a ${fullPath}:${i+1}`);
          console.error(`  Trobat un desajust de +1px sobre la barra. S'ha de complir el contracte exacte.`);
          console.error(`  Línia: ${line.trim()}`);
          hasErrors = true;
        }
      }
    }
  }
  return hasErrors;
}

export function run() {
  console.log('[PORTA 58px] Verificant la Llei de Pedra Seca (58px)...');
  const srcDir = path.join(rootDir, 'src');
  const failed = checkCssFiles(srcDir);
  
  if (failed) {
    console.error('[PORTA 58px] ❌ FALLADA. S\'ha violat l\'arquitectura de capçaleres.');
    process.exit(1);
  } else {
    console.log('[PORTA 58px] ✅ Superada.');
  }
}

if (process.argv[1] === __filename) {
  run();
}
