#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const args = process.argv.slice(2);

// Si no hi ha nom d'eixida, per defecte usa nom termodinàmic i es guarda a l'Escriptori
const now = new Date();
const yy = String(now.getFullYear()).slice(-2);
const mm = String(now.getMonth() + 1).padStart(2, '0');
const dd = String(now.getDate()).padStart(2, '0');
const hh = String(now.getHours()).padStart(2, '0');
const min = String(now.getMinutes()).padStart(2, '0');
const termoPrefix = `${yy}${mm}${dd}_${hh}${min}`;

// Si hi ha arguments, els fem servir com a sufix descriptiu
const descriptiu = args.length > 0 ? args.join('_').replace(/[^a-zA-Z0-9_]/g, '') : 'Auditoria';
const outFileName = `${termoPrefix}_BUNDLE_${descriptiu}.md`;
const outPath = join(root, '_wiki_de_poble/05_Escriptori_Soc_de_Poble', outFileName);

const dirsToScan = ['src', '.agents/skills', 'tooling'];
const filesToScan = ['package.json', 'vite.config.js', 'src/data/supabaseBackend.js'];

const excludedExt = ['.php', '.jpg', '.png', '.woff', '.woff2', '.pdf'];
const excludedDirs = ['node_modules', 'dist', '.git', '.brain-reports', 'vendor'];

let markdown = '# BUNDLE D\'AUDITORIA PER AL CONSELL\n\n';
markdown += '> [!CAUTION]\n';
markdown += '> **AVÍS DE TRANSPARÈNCIA I CONTEXT EXCLÒS:**\n';
markdown += '> Per no superar el límit de tokens, aquest bundle **ha exclòs intencionadament** els següents elements. **NO assumiu que no existeixen**, simplement no estan en aquest fitxer:\n';
markdown += `> - **Directoris exclosos:** ${excludedDirs.join(', ')}\n`;
markdown += `> - **Extensions excloses:** ${excludedExt.join(', ')}\n`;
markdown += `> - **Altres exclusions:** Qualsevol directori que no siga explícitament (${dirsToScan.join(', ')}) o els fitxers arrel sol·licitats.\n\n`;
markdown += '---\n\n';

function processDir(dirPath) {
  if (!existsSync(dirPath)) return;
  const stat = statSync(dirPath);
  if (stat.isDirectory()) {
    const items = readdirSync(dirPath);
    for (const item of items) {
      if (excludedDirs.includes(item)) continue;
      processDir(join(dirPath, item));
    }
  } else {
    const ext = dirPath.slice(dirPath.lastIndexOf('.'));
    if (excludedExt.includes(ext)) return;
    if (!['.js', '.jsx', '.css', '.md', '.json', '.html', '.mjs'].some(e => dirPath.endsWith(e))) return;
    
    try {
      const content = readFileSync(dirPath, 'utf-8');
      const relPath = relative(root, dirPath);
      markdown += `## Fitxer: ${relPath}\n\n\`\`\`\n${content}\n\`\`\`\n\n`;
    } catch (e) {
      markdown += `## Fitxer: ${relative(root, dirPath)}\n\n// Error llegint el fitxer: ${e.message}\n\n`;
    }
  }
}

for (const d of dirsToScan) {
  processDir(join(root, d));
}

for (const f of filesToScan) {
  const fullPath = join(root, f);
  if (existsSync(fullPath)) {
    try {
      const content = readFileSync(fullPath, 'utf-8');
      markdown += `## Fitxer arrel/suelt: ${f}\n\n\`\`\`\n${content}\n\`\`\`\n\n`;
    } catch(e) {
      // ignorar error silenciós o reportar
    }
  }
}

writeFileSync(outPath, markdown, 'utf-8');
console.log(`✅ Bundle creat amb èxit a: ${relative(root, outPath)}`);
