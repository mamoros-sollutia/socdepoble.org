#!/usr/bin/env node
import { existsSync, statSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ESCRIPTORI_DIR } from '../wiki/lib/project_paths.mjs';

const ESCRIPTORI = ESCRIPTORI_DIR;
const RUN_ID = process.env.RUN_ID;

const MIN_BYTES = 50;

function escanejaEscriptori() {
  if (!existsSync(ESCRIPTORI)) return [];
  const fitxers = readdirSync(ESCRIPTORI).filter(f => f.endsWith('.md'));
  const errors = [];
  
  for (const f of fitxers) {
    const p = join(ESCRIPTORI, f);
    const stat = statSync(p);
    
    // Bytes mínims
    if (stat.size < MIN_BYTES) {
      errors.push(`${f}: massa menut (${stat.size} bytes). Possible al·lucinació/truncament.`);
    }
    
    // Hora futura
    if (stat.mtime > new Date(Date.now() + 60000)) {
      errors.push(`${f}: modificat en el futur. Rellotge desincronitzat.`);
    }
    
    // Run ID
    if (RUN_ID) {
      const content = readFileSync(p, 'utf8');
      if (content.includes('doc_id:') && !content.includes(RUN_ID) && !content.includes('manual')) {
        errors.push(`${f}: creat sense el RUN_ID actiu. Possible fabricació manual fora de context.`);
      }
    }
  }
  return errors;
}

const errs = escanejaEscriptori();
if (errs.length > 0) {
  console.error("PARAT. tractor-escriptori ha detectat anomalies al context:");
  errs.forEach(e => console.error("  - " + e));
  process.exit(1);
}

if (!RUN_ID) {
  console.warn("tractor-escriptori: S'està executant sense RUN_ID. El fre d'emergència pot no ser complet.");
}

console.log("PASSA. L'escriptori és segur.");
process.exit(0);
