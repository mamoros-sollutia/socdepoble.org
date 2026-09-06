#!/usr/bin/env node
/**
 * tractor-consell.mjs — Wrapper per a l'auditoria (reduït per evitar bomba >10KB)
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const coreScript = path.resolve(__dirname, '../scripts/tractor-consell-core.mjs');

const args = process.argv.slice(2);
const result = spawnSync('node', [coreScript, ...args], { stdio: 'inherit' });
process.exit(result.status ?? 1);
