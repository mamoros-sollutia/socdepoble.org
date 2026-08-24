import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const MASTER_CONTEXT = path.join(rootDir, '.agents', 'sosp_master_context.md');
const OUT_FILE = path.join(rootDir, '_wiki_de_poble', '05_Escriptori_Soc_de_Poble', '260816_2336_PETORRETA_Bundle_Sosc_Fase3_Excelencia_Arquitectonica.md');

const DIRS_TO_SCAN = ['src', 'supabase'];
const FILES_TO_SCAN = ['package.json', 'vite.config.js', 'vite.standalone.config.js'];

let output = '';

if (fs.existsSync(MASTER_CONTEXT)) {
  output += fs.readFileSync(MASTER_CONTEXT, 'utf8') + '\\n\\n';
}

output += '# CODI ARREL DE SÓC DE POBLE (Fase 3)\\n\\n';

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (entry.isFile() && !entry.name.match(/\\.(png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|DS_Store)$/i)) {
      const ext = path.extname(entry.name).slice(1) || 'text';
      output += `\\n## Fitxer: ${path.relative(rootDir, fullPath)}\\n\\n\`\`\`${ext}\\n`;
      output += fs.readFileSync(fullPath, 'utf8') + '\\n\`\`\`\\n';
    }
  }
}

for (const d of DIRS_TO_SCAN) {
  if (fs.existsSync(path.join(rootDir, d))) scanDir(path.join(rootDir, d));
}

for (const f of FILES_TO_SCAN) {
  const fullPath = path.join(rootDir, f);
  if (fs.existsSync(fullPath)) {
    const ext = path.extname(f).slice(1) || 'json';
    output += `\\n## Fitxer: ${f}\\n\\n\`\`\`${ext}\\n`;
    output += fs.readFileSync(fullPath, 'utf8') + '\\n\`\`\`\\n';
  }
}

fs.writeFileSync(OUT_FILE, output, 'utf8');
console.log(`✅ Bundle de la Fase 3 creat a ${OUT_FILE}`);
