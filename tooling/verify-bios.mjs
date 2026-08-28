#!/usr/bin/env node
/**
 * verify-bios.mjs — Comprova la presència dels fitxers essencials del BIOS i Regles de Sóc de Poble.
 * Un component clau de les Portes Mecàniques.
 */
import fs from 'node:fs';
import path from 'node:path';

const ESSENTIAL_FILES = [
  '.agents/BOOTSTRAP.md',
  '.agents/AGENTS.md',
  '.agents/LEDGER.md',
  '.agents/BIOS.md',
  '.agents/hooks.json',
  '.agents/hooks/verify.mjs',
  'src/ARCHITECTURE.md',
  'src/data/SELF-DESCRIBE.md',
  'tooling/gates/tractor-persistencia.mjs',
  'tooling/gates/tractor-outbox.mjs'
];

let errors = 0;
console.log('🔍 Iniciant verificació del BIOS Executable (L\'Herència de Pedra Seca)...');

ESSENTIAL_FILES.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ FITXER CRÍTIC PERDUT: ${file}`);
    errors++;
  } else {
    console.log(`✅ ${file} està present.`);
  }
});

if (errors > 0) {
  console.error(`\n🚨 FALLADA CRÍTICA DEL BIOS: Faltan ${errors} fitxer(s) clau per al funcionament de l'ecosistema o l'ancoratge de les IAs.`);
  process.exit(1);
} else {
  console.log('\n🟢 BIOS verificat. L\'arquitectura cognitiva està completa. Podeu procedir.');
  process.exit(0);
}
