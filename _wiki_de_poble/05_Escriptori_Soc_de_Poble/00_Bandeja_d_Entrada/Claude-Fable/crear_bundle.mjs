#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, statSync, readdirSync, renameSync } from 'node:fs';
import { join, relative } from 'node:path';
import { execSync } from 'node:child_process';

try {
  execSync('node tooling/gates/tractor-escriptori.mjs', { stdio: 'inherit' });
} catch (e) {
  console.error("crear_bundle cancel·lat per tractor-escriptori. L'Escriptori està corrupte o el run_id no quadra.");
  process.exit(1);
}

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

const dirsToScan = ['src', '.agents', 'tooling', '_wiki_de_poble/04_arquitectura_disseny', '_wiki_de_poble/01_identitat_iaia', 'wordpress-plugin'];
const filesToScan = ['package.json', 'vite.config.js', 'src/data/supabaseBackend.js', 'eslint.config.js', 'index.html', 'public/auth/callback.html', '.vocabulari-deute.json'];

const excludedExt = ['.jpg', '.png', '.woff', '.woff2', '.pdf', '.svg', '.lock'];
/* Auditoria 260829 (Seient 5): abans hi havia una whitelist OCULTA que descartava .php, .sql, .sh, .py, .yml
   i el capçal no ho deia. Ara la llista d'incloses ES DECLARA al capçal i farcell.mjs la verifica. */
const EXT_INCLOSES = ['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.css', '.md', '.json', '.html', '.php', '.sql', '.sh', '.py', '.yml', '.yaml', '.txt'];
const excludedDirs = ['node_modules', 'dist', '.git', '.brain-reports', 'vendor', 'cervells', '.gemini'];

let markdown = '# BUNDLE D\'AUDITORIA PER AL CONSELL\n\n';
markdown += '> **Anclatge de Seguretat**: Aquest document pertany a l\'[[00_INDEX_ESCRIPTORI]] (evitant documents orfes).\n\n';
markdown += '> [!CAUTION]\n';
markdown += '> **AVÍS DE TRANSPARÈNCIA I CONTEXT EXCLÒS:**\n';
markdown += '> Per no superar el límit de tokens, aquest bundle **ha exclòs intencionadament** els següents elements. **NO assumiu que no existeixen**, simplement no estan en aquest fitxer:\n';
markdown += `> - **Directoris exclosos:** ${excludedDirs.join(', ')}\n`;
markdown += `> - **Extensions excloses:** ${excludedExt.join(', ')}\n`;
markdown += `> - **Extensions incloses:** ${EXT_INCLOSES.join(', ')} (qualsevol altra extensió NO va al bundle)\n`;
markdown += `> - **Altres exclusions:** Qualsevol directori que no siga explícitament (${dirsToScan.join(', ')}) o els fitxers arrel sol·licitats.\n\n`;
markdown += '---\n\n';

let fileCount = 0;

function processDir(dirPath) {
  if (!existsSync(dirPath)) {
    console.error(`❌ crear_bundle: el directori promés ${relative(root, dirPath)} no existix. Un bundle que promet el que no porta és un examen a cegues.`);
    process.exit(1);
  }
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
    if (!EXT_INCLOSES.includes(ext)) return;
    try {
      const content = readFileSync(dirPath, 'utf-8');
      const relPath = relative(root, dirPath);
      markdown += `## Fitxer: ${relPath}\n\n\`\`\`\n${content}\n\`\`\`\n\n`;
      fileCount++;
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
      fileCount++;
    } catch(e) {
      // ignorar error silenciós o reportar
    }
  }
}

const tmpOutPath = outPath + '.tmp';
writeFileSync(tmpOutPath, markdown, 'utf-8');
renameSync(tmpOutPath, outPath);
console.log(`✅ Bundle creat a: ${relative(root, outPath)} (${fileCount} fitxers)`);

/* Porta: el bundle no ix si farcell diu que és coix. */
try {
  execSync(`node tooling/brain/farcell.mjs --bundle="${outPath}" --arrel="${root}"`, { stdio: 'inherit' });
} catch {
  console.error('❌ crear_bundle: farcell ha tancat la porta. Arregla la causa; no toques la porta.');
  process.exit(1);
}

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
run_id: "${process.env.RUN_ID || 'manual'}"
academic_metadata:
  nivell_maduresa: "Pendent_Revisio"
inputs: ["${outFileName}"]
\`\`\`

# 📜 PROMPT D'AUDITORIA EXTREMA: [TÍTOL DE LA MISSIÓ]

> **Anclatge de Seguretat**: Aquest document pertany a l'[[00_INDEX_ESCRIPTORI]] (evitant documents orfes).

## [BLOC FIXE D'IDENTITAT I ORIGEN]
**A L'ATENCIÓ DE LES COMPANYERES DEL CONSELL:** (Kimi AI, Claude, ChatGPT, Grok, Qwen, DeepSeek, Dola, Perplexity, Mistral Vibe, Gemini, Copilot, Z)
Sou la Intel·ligència Crítica i Consultiva de suport del **Consell de la Petorreta**. Estem treballant en **\`socdepoble.org\`**.
**MOLT IMPORTANT (LA VERITAT ARQUITECTÒNICA):** Actualment estem col·laborant amb la nostra empresa sòcia, **Sollutia**. Ells ens ofereixen un sistema excel·lent que funciona completament *online*. Aquest sistema online ens permet validar la viabilitat del projecte de forma sòlida. **ATENCIÓ: SOLLUTIA NO TÉ RES A VEURE AMB WORDPRESS.** L'entorn de WordPress on incrustem l'App ara mateix és exclusivament un entorn de proves paral·lel nostre per comprovar que tot funciona i que som independents. No vinculeu mai WordPress amb Sollutia.

**PERÒ LA NOSTRA ASPIRACIÓ I VISIÓ A LLARG TERMINI** és, justament amb l'ajuda de Sollutia, poder independitzar-nos d'Internet (ser 100% Offline-First) per a sobreviure en ambients rurals hostils (sense cobertura, iPads A10, WebKit legacy). Som un projecte de "des-escalada" (una xarxa anti-xarxa social) i estem preparant el terreny perquè en el futur Sollutia puga mantindre eixa versió descentralitzada i offline. Necessitem que les vostres propostes tinguen en compte que farem aquesta transició cap a l'offline de manera conjunta, pel que el codi ha d'estar preparat per no patir traumes quan arribe el moment de separar el Frontend del Backend.

**Teniu adjunt un document BUNDLE (\`${outFileName}\`) amb tot el context (incloent-hi la Wiki, identitat, visió arquitectònica, regles, els meus propis Skills i Scripts) i el codi font complet necessari.** Llegiu-lo sencer de forma crítica abans d'emetre veredicte. Només si coneixeu la identitat de Sóc de Poble podreu donar una resposta lliure de contradiccions i IA-slop.

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

const tmpPromptPath = promptPath + '.tmp';
writeFileSync(tmpPromptPath, promptTemplate, 'utf-8');
renameSync(tmpPromptPath, promptPath);
console.log(`✅ Prompt d'acompanyament (Anclat) creat a: ${relative(root, promptPath)}`);

