#!/usr/bin/env node
/**
 * verificar_ancoratge.mjs — Invariant de l'Ancoratge
 * Assegura que tot document actiu a la Wiki estigui ben ancorat al Graf.
 */
import fs from 'node:fs';
import path from 'node:path';

const arrelWiki = path.join(process.cwd(), '_wiki_de_poble');
const exclosos = ['90_revisar', '05_ARXIU', '.obsidian', '.quarantena-260830'];

let errors = 0;

function verificarDir(dir) {
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (exclosos.some(e => full.includes(e))) continue;
    if (fs.statSync(full).isDirectory()) {
      verificarDir(full);
    } else if (full.endsWith('.md')) {
      const contingut = fs.readFileSync(full, 'utf8');
      if (!/\*\*Ancoratge de Seguretat:\*\*\s*\[\[/.test(contingut)) {
         console.error(`❌ [ANCORATGE] Document orfe sense ancoratge de seguretat: ${path.relative(process.cwd(), full)}`);
         errors++;
      }
    }
  }
}

verificarDir(arrelWiki);

if (errors > 0) {
  console.error(`\n🚨 S'han detectat ${errors} documents sense ancoratge vàlid. El Bancal no pot tancar.\n`);
  process.exit(1);
} else {
  console.log(`✅ [ANCORATGE] Tots els documents vius de la Wiki estan ben ancorats.`);
  process.exit(0);
}
