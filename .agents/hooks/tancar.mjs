#!/usr/bin/env node
/**
 * .agents/hooks/tancar.mjs
 * Gatekeeper executiu: Invocat pel pre-commit de Git o manualment.
 * Executa l'auditoria SCC. Si falla, crea l'SDP-LOCK per impedir avançar.
 */

import { execSync } from 'node:child_process';
import { writeFileSync, existsSync, unlinkSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..');
const lockFile = join(repoRoot, '.agents', 'SDP-LOCK');
const tancamentScript = join(repoRoot, 'tooling', 'gates', 'tancament.mjs');

console.log("🔒 Iniciant Hook de Tancament del Mas (tancar.mjs)...");

try {
  // Executem l'auditoria SCC
  execSync(`node "${tancamentScript}"`, { stdio: 'inherit', cwd: repoRoot });
  
  // Si arribem ací, l'auditoria ha passat (exit code 0). Lllevem l'SDP-LOCK si existeix.
  if (existsSync(lockFile)) {
    unlinkSync(lockFile);
    console.log("🔓 SDP-LOCK alliberat automàticament. L'escriptori i el graf estan sans.");
  }
  
  process.exit(0);
} catch (e) {
  // L'auditoria ha fallat (exit code 1). Apliquem bloqueig actiu.
  const lockMsg = `🚨 BLOQUEIG ACTIU SDP-LOCK 🚨\nData: ${new Date().toISOString()}\nMotiu: Violació de regles SCC o Escriptori Zero. Has de netejar l'escriptori i resoldre els orfes abans d'obrir el torn o fer commit.\n`;
  writeFileSync(lockFile, lockMsg);
  process.exit(1);
}
