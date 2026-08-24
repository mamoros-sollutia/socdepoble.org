#!/usr/bin/env node
import { execSync } from 'child_process';

console.log('>> [Rossec] Comprovant pressupost de destrucció...');

try {
  const stat = execSync('git diff --cached --shortstat', { encoding: 'utf-8' });
  const deletionsMatch = stat.match(/(\d+)\s+deletion/);
  if (deletionsMatch) {
    const deletions = parseInt(deletionsMatch[1], 10);
    if (deletions > 400) {
      console.error(`[ERROR] 🛑 Sistema d'Autoprotecció ROSSEC 🛑`);
      console.error(`Has intentat eliminar ${deletions} línies de colp (Límit: 400).`);
      console.error(`Si és una refactorització massiva legítima, afegeix --no-verify.`);
      console.error(`El treball del Mestre està protegit.`);
      process.exit(1);
    }
  }
  console.log('>> [Rossec] Pressupost de destrucció validat. Cap anomalia detectada.');
  process.exit(0);
} catch (e) {
  // If no changes or error, let it pass
  process.exit(0);
}
