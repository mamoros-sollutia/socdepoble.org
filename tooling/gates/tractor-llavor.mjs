#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const seedFile = path.resolve(process.cwd(), 'supabase/seed.sql');
const appSeedFile = path.resolve(process.cwd(), 'src/data/appSeed.js');

let hasError = false;

if (fs.existsSync(seedFile)) {
  const content = fs.readFileSync(seedFile, 'utf8');
  if (content.includes('Javi Llinares')) {
    console.error('❌ Error: El seed.sql conté dades personals (Javi Llinares).');
    hasError = true;
  }
}

if (fs.existsSync(appSeedFile)) {
  const content = fs.readFileSync(appSeedFile, 'utf8');
  if (content.includes('Javi Llinares')) {
    console.error('❌ Error: El appSeed.js conté dades personals (Javi Llinares).');
    hasError = true;
  }
}

if (hasError) {
  process.exit(1);
} else {
  console.log('✅ tractor-llavor: El seed és sintètic i correcte.');
  process.exit(0);
}
