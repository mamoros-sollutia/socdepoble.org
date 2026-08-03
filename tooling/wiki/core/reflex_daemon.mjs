import fs from 'node:fs';
import path from 'node:path';
import { exec } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../..');
const WIKI_DIR = path.join(ROOT_DIR, '_wiki_de_poble');
const SYNC_SCRIPT = path.join(ROOT_DIR, 'sync_iaia.sh');
let timeout;

console.log('🤖 Reflex de la IAIA Activat: Vigilant canvis en segon pla...');
console.log(`📂 Vigilant: ${WIKI_DIR}`);

fs.watch(WIKI_DIR, { recursive: true }, (eventType, filename) => {
  if (!filename) return;
  if (filename.startsWith('.') || filename.includes('.obsidian') || filename.includes('.DS_Store')) return;
  
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    console.log(`\n[${new Date().toLocaleTimeString()}] Canvi a "${filename}". Sincronitzant amb Madrid...`);
    
    exec(`"${SYNC_SCRIPT}"`, { cwd: ROOT_DIR }, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error en sincronitzar: ${error.message}`);
        return;
      }
      console.log('✅ Còpia a Madrid completada amb èxit.');
    });
  }, 10_000); // 10 segons de marge
});
