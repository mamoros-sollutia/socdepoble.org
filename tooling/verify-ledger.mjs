#!/usr/bin/env node
/**
 * verify-ledger.mjs — Verifica o signa criptogràficament el LEDGER.md
 * Forma part de les Portes Mecàniques (Pas 0) de Sóc de Poble.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const args = process.argv.slice(2);
const isSign = args.includes('--sign');

const LEDGER_PATH = path.join(process.cwd(), '.agents', 'LEDGER.md');
if (!fs.existsSync(LEDGER_PATH)) {
  console.error('❌ LEDGER.md no trobat a .agents/LEDGER.md');
  process.exit(1);
}

let content = fs.readFileSync(LEDGER_PATH, 'utf8');
const hashRegex = /\n\n<!-- HASH: ([a-f0-9]{64}) -->$/;
const match = content.match(hashRegex);

let contentToHash = content;
let existingHash = null;

if (match) {
  existingHash = match[1];
  contentToHash = content.replace(hashRegex, '');
}

const computedHash = crypto.createHash('sha256').update(contentToHash).digest('hex');

if (isSign) {
  if (existingHash === computedHash) {
    console.log('✅ LEDGER.md ja està signat i la signatura és vàlida.');
  } else {
    fs.writeFileSync(LEDGER_PATH, `${contentToHash}\n\n<!-- HASH: ${computedHash} -->`);
    console.log(`✅ LEDGER.md signat correctament (Hash: ${computedHash}).`);
  }
  process.exit(0);
}

if (!existingHash) {
  console.error('❌ LEDGER.md no conté cap signatura. Executa: node tooling/verify-ledger.mjs --sign');
  process.exit(1);
}

if (existingHash !== computedHash) {
  console.error(`❌ La signatura del LEDGER.md està TRENCADA!`);
  console.error(`   Hash esperat:  ${computedHash}`);
  console.error(`   Hash trobat:   ${existingHash}`);
  console.error(`   Sospita d'adulteració o falta de signatura després d'una edició.`);
  process.exit(1);
}

console.log('✅ LEDGER.md: Signatura criptogràfica verificada i vàlida.');
process.exit(0);
