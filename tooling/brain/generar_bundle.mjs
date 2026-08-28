import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error("Ús: node generar_bundle.mjs <nom_arxiu_sense_extensio> <Títol> [arxius_a_incloure...]");
  process.exit(1);
}

const nomFitxer = args[0];
const titol = args[1];
const arxiusFonts = args.slice(2);

const rutaDesti = `_wiki_de_poble/05_Escriptori_Soc_de_Poble/${nomFitxer}.md`;

console.log(`📦 Generant Bundle a ${rutaDesti}...`);

// 1. Crear el document base utilitzant l'Anclatge de Seguretat
try {
  execSync(`node tooling/brain/crear_document.mjs "${rutaDesti}" "${titol}"`, { stdio: 'inherit' });
} catch (e) {
  console.error("❌ Fallada en crear el document base amb Anclatge de Seguretat.");
  process.exit(1);
}

// 2. Afegir els fitxers
let missing = 0;
if (arxiusFonts.length > 0) {
  let content = '\n\n## Contingut del Bundle\n\n';
  for (const f of arxiusFonts) {
    if (fs.existsSync(f)) {
      content += `\n### ${f}\n\`\`\`javascript\n${fs.readFileSync(f, 'utf8')}\n\`\`\`\n`;
    } else {
      console.error(`❌ CRÍTIC: Fitxer no trobat per al bundle: ${f}`);
      missing++;
    }
  }
  if (missing > 0) {
    console.error(`❌ Generació de bundle ABORTADA per evitar pèrdua de context. Falten ${missing} fitxers.`);
    process.exit(1);
  }
  fs.appendFileSync(rutaDesti, content);
}

// 3. Revisió de Termodinàmica (pes de context)
const stats = fs.statSync(rutaDesti);
const mb = (stats.size / (1024 * 1024)).toFixed(2);
if (stats.size > 1024 * 1024) {
  console.warn(`⚠️ AVÍS TERMODINÀMIC: El bundle pesa ${mb}MB. Açò pot ofegar el context de l'IA.`);
}

console.log(`✅ Bundle completat correctament (${mb}MB).`);
