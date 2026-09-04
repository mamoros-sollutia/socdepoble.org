#!/usr/bin/env node
/** La Porta d'Obra: res ix al repositori sense passar per ací. Exit 1 = barricada. */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { execSync } from 'node:child_process';

const EXCLUITS = new Set(['node_modules', 'dist', '.git', 'vendor', '.brain-reports', '.gemini']);
const EXT = new Set(['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.css', '.scss', '.html']);
const BROSSA = /\.(bak|old|new|copy|tmp|orig|final\d?|v\d+)$/i;
const VERI = /\b(console\.log|debugger)\b/;
const DEUTE = /\b(TODO|FIXME|XXX|HACK)\b/;
const errors = [];
const avisos = [];

function camina(dir, out = []) {
  try {
    const entries = readdirSync(dir);
    for (const nom of entries) {
      if (EXCLUITS.has(nom) || (nom.startsWith('.') && nom !== '.agents')) continue;
      const ruta = join(dir, nom);
      if (statSync(ruta).isDirectory()) {
        camina(ruta, out);
      } else if (EXT.has(extname(nom))) {
        out.push(ruta);
      }
    }
  } catch {
    // Ignorar carpetes sense permisos
  }
  return out;
}

const arrel = process.cwd();
const fitxers = camina(arrel);
for (const ruta of fitxers) {
  const rel = ruta.slice(arrel.length + 1);
  const text = readFileSync(ruta, 'utf8');
  if (BROSSA.test(rel)) errors.push(`BROSSA: ${rel} — fitxer provisional al repositori.`);
  if (VERI.test(text)) avisos.push(`VERÍ (Avís): console.log o debugger a ${rel}. (Revisar si cal).`);
  if (DEUTE.test(text)) avisos.push(`DEUTE SILENCIAT (Avís): TODO/FIXME a ${rel} — o es resol ara o va al Llibre d'Obra.`);
  if (!text.trim()) avisos.push(`BUIT: ${rel} està buit. És brossa?`);
}

/* Fitxers nous que no consten al Llibre d'Obra = brossa no declarada. */
try {
  const nous = execSync('git status --porcelain', { encoding: 'utf8' })
    .split('\n').filter((l) => l.startsWith('??'))
    .map((l) => l.slice(3).trim()).filter((f) => f && !f.endsWith('/'));
  const llibrePath = join(arrel, '.agents', 'LEDGER.md');
  const llibre = existsSync(llibrePath) ? readFileSync(llibrePath, 'utf8') : '';
  for (const f of nous) {
    if (!llibre.includes(f)) {
      avisos.push(`SENSE LLIBRE (Avís): «${f}» és nou i no consta al LEDGER.md.`);
    }
  }
} catch {
  throw new Error("Git no disponible o error al llegir l'estat.");
}

console.log(`\n[PORTA D'OBRA] ${fitxers.length} fitxers revisats.`);
if (avisos.length) {
  console.log('\n--- AVISOS (No bloquejants) ---');
  avisos.forEach((a) => console.warn('  ⚠ ' + a));
}

if (errors.length) { 
  console.log('\n--- ERRORS CRÍTICS ---');
  errors.forEach((e) => console.error('  ✗ ' + e));
  console.error(`\nBARRICADA: ${errors.length} problemes greus. Cap pedra ix fins que estiga net.`); 
  process.exit(1); 
}
console.log('\n✔ Net d\'errors greus. Es pot posar la pedra.\n');
