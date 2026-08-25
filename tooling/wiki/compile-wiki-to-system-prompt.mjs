#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ARREL = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));

// Llegim TOTS els pilars operatius i SKILLS, res d'arxius aïllats
const ACTIVE_DIRS = [
  '.agents/skills',
  '_wiki_de_poble/00_SER_Brain_Identitat',
  '_wiki_de_poble/01_SABER_Cultura_Coneixement',
  '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica',
  '_wiki_de_poble/03_GOVERNAR_Normativa_Regles'
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
  console.log("🧠 Extraient el Còrtex Global de la Wiki per evitar l'Amnèsia de Resurrecció...");
  
  let output = '# CONTEXT MESTRE GLOBAL (SÓC DE POBLE)\n\n';
  output += "Aquest document és generat automàticament. No l'editis directament. Conté l'estat complet del Mas per carregar la memòria de l'Agent a l'instant.\n\n";
  
  let allFiles = ['AGENTS.md', '.agents/AGENTS.md', '.agents/PROTOCOL_PETORRETA.md'].map(p => path.resolve(ARREL, p));
  ACTIVE_DIRS.forEach(dir => walkAndBundle(path.resolve(ARREL, dir), allFiles));

  // Deduplicació per si de cas
  const uniqueFiles = [...new Set(allFiles)];
  const missingFiles = uniqueFiles.filter(f => !fs.existsSync(f));
  if (missingFiles.length > 0) {
    console.error(`❌ Falten fitxers crítics per al context:\n${missingFiles.join('\n')}`);
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

  const outputFilePath = path.resolve(ARREL, '.agents/GENOMA.md');
  fs.writeFileSync(outputFilePath, output, 'utf8');
  
  const mbs = (Buffer.byteLength(output, 'utf8') / 1024 / 1024).toFixed(2);
  console.log(`✅ Còrtex total compilat correctament (${mbs} MB) a ${outputFilePath}. Injecteu açò com a System Prompt.`);
}

compilePrompt().catch(err => {
  console.error('❌ Error compilant el còrtex:', err);
  process.exit(1);
});
const __dummy = 'passa per canonada';
