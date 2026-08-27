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

// Automatització: Crear un PROMPT d'acompanyament per al Consell
const promptFileName = outFileName.replace('_BUNDLE_', '_PROMPT_');
const promptPath = join(root, '_wiki_de_poble/05_Escriptori_Soc_de_Poble', promptFileName);

const promptTemplate = `\`\`\`yaml
doc_id: SDP-PROMPT-${termoPrefix}
doc_type: "[PETORRETA_AUDITORIA]"
authoring_agent: "IAIA MarIA"
version_semver: 1.0.0
owner: Consell de la Petorreta
domain: global
locale: ca-valencia
hora_creacio: "${hh}:${min}"
academic_metadata:
  nivell_maduresa: "Pendent_Revisio"
inputs: ["${outFileName}"]
\`\`\`

# 📜 PROMPT D'AUDITORIA EXTREMA: [TÍTOL DE LA MISSIÓ]

> **Anclatge de Seguretat**: Aquest document pertany a l'[[00_INDEX_ESCRIPTORI]] (evitant documents orfes).

## [BLOC FIXE D'IDENTITAT I ORIGEN]
**A L'ATENCIÓ DE LES COMPANYERES DEL CONSELL:**
Sou la Intel·ligència Crítica i Consultiva de suport del **Consell de la Petorreta**. Estem treballant en **\`socdepoble.org\`**.
**MOLT IMPORTANT (LA VERITAT ARQUITECTÒNICA):** Actualment estem incrustats dins del sistema de la nostra empresa sòcia, **Sollutia**. Ells són el nostre suport tecnològic imprescindible i ens ofereixen un sistema excel·lent que funciona completament *online*. Aquest sistema online ens permet validar la viabilitat del projecte de forma sòlida.
**PERÒ LA NOSTRA ASPIRACIÓ I VISIÓ A LLARG TERMINI** és, justament amb l'ajuda de Sollutia, poder independitzar-nos d'Internet (ser 100% Offline-First) per a sobreviure en ambients rurals hostils (sense cobertura, iPads A10, WebKit legacy). Som un projecte de "des-escalada" (una xarxa anti-xarxa social) i estem preparant el terreny perquè en el futur Sollutia puga mantindre eixa versió descentralitzada i offline. Necessitem que les vostres propostes tinguen en compte que farem aquesta transició cap a l'offline de manera conjunta, pel que el codi ha d'estar preparat per no patir traumes quan arribe el moment de separar el Frontend del Backend.

**Teniu adjunt un document BUNDLE (\`${outFileName}\`) amb tot el context (incloent-hi la Wiki, regles, els meus propis Skills i Scripts) i el codi font necessari.** Llegiu-lo sencer de forma crítica abans d'emetre veredicte.

## [BLOC VARIABLE 1: SITUACIÓ ACTUAL]
[Descriu aquí el context i per què demanes ajuda al consell. Què hem implementat?]

## [BLOC VARIABLE 2: LA MISSIÓ (DESPIETADA I BESTIAL)]
Necessitem que actueu com a autèntiques **bèsties de l'auditoria**. Volem que trobeu qualsevol forat de seguretat, fuita de memòria, condició de carrera o error d'arquitectura. No volem afalacs, volem rigor.
1. Auditeu l'enfocament i el codi adjunt.
2. Assenyaleu deute tècnic futur.
3. Proposeu solucions sense afegir llibreries innecessàries (Vanilla JS).

## [BLOC FIXE DE PROTOCOL D'AMNÈSIA DE CONTEXT]
**PROTOCOL AMNÈSIA DE CONTEXT (Regla de ferro):**
Si arribeu al límit del vostre context de memòria, TENIU PROHIBIT intentar d'inventar o parafrasejar el cos complet del document que no veieu per a "rellenar". Demaneu directament que us pose el document sencer de nou.

> 📝 **NOTA D'EFICIÈNCIA:** Aneu directe al gra. No feu introduccions llargues ni resums del que ja sabem.
`;

writeFileSync(promptPath, promptTemplate, 'utf-8');
console.log(`✅ Prompt d'acompanyament (Anclat) creat a: ${relative(root, promptPath)}`);
