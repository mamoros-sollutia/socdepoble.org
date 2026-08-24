#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ARREL = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));

// Directori dedicat únicament al coneixement cultural, etnogràfic i lèxic
const ACTIVE_DIRS = [
  '../_cultura_de_poble'
];

function walkAndBundle(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.')) {
      walkAndBundle(fullPath, fileList);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

async function compilePrompt() {
  console.log("📚 Compilant el Cervell Cultural (Cultura de Poble)...");
  
  let output = '# CONTEXT CULTURAL (SÓC DE POBLE)\n\n';
  output += "Aquest document és el mòdul cultural de l'Agent. Conté diccionaris, folklore, festes i dades etnogràfiques.\n\n";
  
  let allFiles = [];
  ACTIVE_DIRS.forEach(dir => walkAndBundle(path.resolve(ARREL, dir), allFiles));

  // Deduplicació per si de cas
  const uniqueFiles = [...new Set(allFiles)];
  const missingFiles = uniqueFiles.filter(f => !fs.existsSync(f));
  if (missingFiles.length > 0) {
    console.error(`❌ Falten fitxers crítics per al context cultural:\n${missingFiles.join('\n')}`);
    process.exit(1);
  }
  allFiles = uniqueFiles;

  for (const fullPath of allFiles) {
    const relPath = path.relative(ARREL, fullPath);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Compressió termodinàmica: llevant el YAML frontmatter innecessari per la IA i salts de línia sobrants
    const compressedContent = content.replace(/^---\n[\s\S]*?\n---\n/, '').replace(/\n{3,}/g, '\n\n').trim();
    
    output += `## [FILE: ${relPath}]\n${compressedContent}\n\n---\n\n`;
  }

  const outputFilePath = path.resolve(ARREL, '.agents/CULTURA.md');
  fs.writeFileSync(outputFilePath, output, 'utf8');
  
  const mbs = (Buffer.byteLength(output, 'utf8') / 1024 / 1024).toFixed(2);
  console.log(`✅ Mòdul cultural compilat correctament (${mbs} MB) a ${outputFilePath}.`);
}

compilePrompt().catch(err => {
  console.error('❌ Error compilant la cultura:', err);
  process.exit(1);
});
