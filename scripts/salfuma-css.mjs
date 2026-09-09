#!/usr/bin/env node
// scripts/salfuma-css.mjs — informe, NO esborra res

import { readFileSync, readdirSync, statSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKIP = new Set(['node_modules', 'dist', 'build', '.git', 'coverage', '.sdp-paperera']);

function walk(dir, exts, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { if (!SKIP.has(name)) walk(p, exts, out); }
    else if (exts.some((e) => name.endsWith(e))) out.push(p);
  }
  return out;
}

const llegir = (p) => { try { return readFileSync(p, 'utf8'); } catch { return ''; } };

const fonts = [
  join(ROOT, 'index.html'),
  join(ROOT, 'public', 'auth', 'callback.html'),
  ...walk(join(ROOT, 'src'), ['.js', '.jsx', '.ts', '.tsx', '.html']),
];
const palla = fonts.map(llegir).join('\n');

const cssFiles = walk(join(ROOT, 'src'), ['.css']);
const informe = {};
for (const f of cssFiles) {
  const definides = new Set(
    [...llegir(f).matchAll(/\.([a-zA-Z_][a-zA-Z0-9_-]*)/g)].map((m) => m[1])
  );
  const mortes = [...definides].filter((c) => !palla.includes(c));
  if (mortes.length) informe[relative(ROOT, f)] = mortes;
}

mkdirSync(join(ROOT, '.sdp-paperera'), { recursive: true });
const desti = join(ROOT, '.sdp-paperera', 'classes-mortes.txt');
writeFileSync(desti, Object.entries(informe)
  .map(([f, l]) => `# ${f} — ${l.length}\n${l.join('\n')}`)
  .join('\n\n') + '\n');

const total = Object.values(informe).reduce((s, l) => s + l.length, 0);
console.log(`CSS analitzats: ${cssFiles.length}. Classes candidates a mortes: ${total}`);
for (const [f, l] of Object.entries(informe)) console.log(`  ${f}: ${l.length}`);
console.log(`Informe complet: ${desti}`);
