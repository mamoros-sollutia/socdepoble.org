import fs from 'node:fs/promises';
import path from 'node:path';
import { CAMINS, R } from './tooling/lib/arrel.mjs';

async function generateIndex(dirPath, title, indexFileRel, customDescription = '', customHeader = '') {
  const fullDirPath = R(dirPath);
  const indexFilePath = path.join(fullDirPath, indexFileRel);
  
  let content = `---
estat: canonic
tipus: index
description: ${customDescription || `Índex autogenerat per a ${title}`}
---

# ${title}

${customHeader}
`;

  try {
    const files = await fs.readdir(fullDirPath);
    const visibleFiles = [];
    for (const f of files) {
      if (!f.startsWith('.') && !f.startsWith('_') && f !== indexFileRel) {
        const stat = await fs.stat(path.join(fullDirPath, f));
        if (stat.isFile()) visibleFiles.push(f);
      }
    }
    
    for (const file of visibleFiles) {
      const ext = path.extname(file);
      const isMd = ext === '.md';
      const nameForLink = isMd ? file.replace('.md', '') : file;
      content += `- [[${nameForLink}]]\n`;
    }
    
    let hasContent = visibleFiles.length > 0;
    
    // Also include subdirectories
    const subdirs = files.filter(f => !f.includes('.') && !f.startsWith('_') && f !== 'node_modules');
    for (const subdir of subdirs) {
      const subdirPath = path.join(fullDirPath, subdir);
      const stat = await fs.stat(subdirPath);
      if (stat.isDirectory()) {
        const subFiles = await fs.readdir(subdirPath);
        const subVisibleFiles = [];
        for (const f of subFiles) {
          if (!f.startsWith('.') && !f.startsWith('_')) {
            const stat = await fs.stat(path.join(subdirPath, f));
            if (stat.isFile()) subVisibleFiles.push(f);
          }
        }
        if (subVisibleFiles.length > 0) {
          hasContent = true;
          content += `\n## ${subdir}\n`;
          for (const file of subVisibleFiles) {
             const ext = path.extname(file);
             const isMd = ext === '.md';
             const nameForLink = isMd ? file.replace('.md', '') : file;
             content += `- [[${subdir}/${nameForLink}]]\n`;
          }
        }
      }
    }

    if (hasContent || dirPath.includes('04_ESCRIPTORI')) {
      await fs.writeFile(indexFilePath, content, 'utf8');
      console.log(`Índex creat a ${indexFilePath}`);
    } else {
      try {
        await fs.unlink(indexFilePath);
        console.log(`Índex esborrat perquè la carpeta està buida: ${indexFilePath}`);
      } catch(e) {
        // Ignorar si l'arxiu no existia
      }
    }
  } catch (e) {
    console.error(`Error generant índex per ${dirPath}:`, e.message);
  }
}

async function main() {
  await generateIndex('_wiki_de_poble/05_ARXIU', 'Arxiu Històric', '00_INDEX_ARXIU.md');
  await generateIndex('_wiki_de_poble/90_revisar', 'Zona de Quarantena i Revisió', '00_INDEX_REVISAR.md');
  
  await generateIndex(
    '_wiki_de_poble/04_ESCRIPTORI', 
    '📥 L\'ESCRIPTORI (SAFATA D\'ENTRADA I TREBALL ACTIU)', 
    '00_INDEX_ESCRIPTORI.md',
    '📥 L\'ESCRIPTORI (SAFATA D\'ENTRADA I TREBALL ACTIU)',
    'Ací només resideix la matèria viva. El que ha mort, descansa en l\'arxiu.\n\n## 🔗 Índexs Connectats (Xarxa Neuronal)\n- [[00_INDEX]] (Índex Principal)\n- [[00_INDEX_IDENTITAT]] (Nucli d\'Identitat)\n- [[00_INDEX_Actes]] (Registre d\'Actes)\n'
  );
}

main();
