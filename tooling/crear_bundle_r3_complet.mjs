import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { writeFileSync } from 'node:fs';
import crypto from 'node:crypto';

const EXCLUITS = new Set([
  'node_modules', 'dist', '.git', 'vendor', '.brain-reports', '.gemini', 
  '.DS_Store', 'coverage', 'build', 'public', '.iaia_auth', '.wwebjs_auth',
  '.wwebjs_cache', 'bot', '.brain-trash', '.sdp-paperera', '.sdp-reflex',
  '.wiki-safety', 'assets', 'scratch', 'var', '.obsidian', '.env', '.env.local',
  '.env.development', '.env.production'
]);

// Extensions de fitxers que considerem text/llegibles per la IA
const EXTENSIONS_VALIDES = new Set([
  '.js', '.jsx', '.ts', '.tsx', '.json', '.html', '.css', '.scss', 
  '.md', '.txt', '.env.example', '.mjs', '.cjs'
]);

function camina(dir, out = []) {
  try {
    const entries = readdirSync(dir);
    for (const nom of entries) {
      if (EXCLUITS.has(nom)) continue;
      
      const ruta = join(dir, nom);
      const stat = statSync(ruta);
      
      if (stat.isDirectory()) {
        camina(ruta, out);
      } else {
        const ext = extname(nom).toLowerCase();
        
        // Evitem enviar secrets: cap fitxer .env (excepte l'example)
        if (nom.startsWith('.env') && nom !== '.env.example') continue;

        if (EXTENSIONS_VALIDES.has(ext) || nom === '.env.example' || nom === 'Dockerfile' || nom.startsWith('.')) {
          // Excloure imatges, binaris, mapes, bundles vells i builds
          if (
            ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.ico' && ext !== '.svg' && 
            ext !== '.webp' && ext !== '.pdf' && ext !== '.lock' && ext !== '.map' && 
            nom !== 'rag-index.json' &&
            !nom.includes('BUNDLE_') &&
            nom !== 'audit.json' && nom !== 'audit.md' && nom !== 'distill-plan.json' &&
            !nom.includes('.standalone.js') &&
            nom !== 'package-lock.json'
          ) {
             out.push(ruta);
          }
        }
      }
    }
  } catch (_e) {
    // Ignorem errors de lectura de directoris per permisos
  }
  return out;
}

const arrel = process.cwd();
const totsElsFitxers = camina(arrel);

let bundle = `# BUNDLE AUDITORIA RONDA 3 (COMPLET I SEGUR) - SÓC DE POBLE\n\n`;
bundle += `Aquest bundle conté l'absoluta totalitat del projecte (excloent secrets). L'objectiu és que tingueu context total per jutjar la viabilitat de l'arquitectura a llarg termini i la transició cap a l'Offline-First.\n\n`;

let totalBytes = 0;
const manifest = [];

for (const ruta of totsElsFitxers) {
  const rutaRelativa = ruta.slice(arrel.length + 1);
  try {
    const text = readFileSync(ruta, 'utf8');
    const hash = crypto.createHash('sha256').update(text).digest('hex');
    manifest.push({ fitxer: rutaRelativa, mida: text.length, sha256: hash });
    totalBytes += text.length;
    bundle += `\n\n--- FITXER: ${rutaRelativa} ---\n\`\`\`\n${text}\n\`\`\`\n`;
  } catch (_e) {
    bundle += `\n\n--- FITXER: ${rutaRelativa} ---\n[ERROR LLEGINT EL FITXER]\n`;
  }
}

bundle += `\n\n# MANIFEST DE SEGURETAT (ANTI-AMNÈSIA)\n`;
bundle += `El següent llistat conté el nom i SHA256 de tots els fitxers enviats. Si un model d'IA detecta que falta algun fitxer o que l'arxiu s'ha truncat abans del final d'aquest manifest, HO HA DE DENUNCIAR IMMEDIATAMENT abans d'emetre cap auditoria.\n\n`;
bundle += `| Fitxer | Mida (bytes) | SHA256 |\n|---|---|---|\n`;
for (const m of manifest) {
  bundle += `| ${m.fitxer} | ${m.mida} | ${m.sha256} |\n`;
}

const outFile = join(arrel, '_wiki_de_poble/05_Escriptori_Soc_de_Poble/260828_1500_BUNDLE_Auditoria_Ronda_3_Segur.md');
writeFileSync(outFile, bundle, 'utf8');
console.log(`Bundle Ronda 3 SEGUR creat amb èxit. S'han inclòs ${totsElsFitxers.length} fitxers.`);
console.log(`Mida aproximada: ${(totalBytes / 1024).toFixed(2)} KB`);
console.log(`Manifest de seguretat incrustat correctament a l'arxiu.`);
