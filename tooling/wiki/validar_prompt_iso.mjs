#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadIsoContext, validateIsoPrompt } from './lib/prompt_iso.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
try {
  const files = process.argv.slice(2);
  if (!files.length) throw new Error('Ús: node tooling/wiki/validar_prompt_iso.mjs prompt.md [prompt2.md]');
  const context = loadIsoContext(root);
  for (const file of files) {
    const errors = validateIsoPrompt(context, fs.readFileSync(file, 'utf8'));
    if (errors.length) throw new Error(`${file}: ${errors.join('; ')}`);
    console.log(`ISO OK: ${file}`);
  }
} catch (error) {
  console.error(`ISO BLOQUEJAT: ${error.message}`);
  process.exitCode = 1;
}
