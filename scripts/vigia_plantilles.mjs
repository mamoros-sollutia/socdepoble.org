#!/usr/bin/env node

/**
 * VIGIA-PLANTILLES (Higiene Cognitiva - Sóc de Poble)
 * ---------------------------------------------------------------------------
 * Aquest script valida la integritat de les plantilles ISO del projecte.
 * Evita que agents d'IA sobreescriguin plantilles estructurals eliminant el 
 * frontmatter o seccions obligatòries.
 * 
 * Ús: node scripts/vigia_plantilles.mjs [path_to_template]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const WIKI_DIR = path.join(REPO_ROOT, '_wiki_de_poble');

// Definicions de plantilles a vigilar
const PLANTILLES_VITAL = [
  path.join(WIKI_DIR, '02_ACTUAR_Maquina_Tecnica/plantilles/PLANTILLA_ISO_SDP.md')
];

function checkTemplate(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ [FATAL] La plantilla no existeix: ${filePath}`);
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  // 1. Check Frontmatter
  if (!content.startsWith('---')) {
    console.error(`❌ [ERROR] Falta el Frontmatter YAML a la capçalera de ${filePath}`);
    return false;
  }

  const frontmatterMatch = content.match(/^---[\s\S]*?---/);
  if (!frontmatterMatch) {
    console.error(`❌ [ERROR] Frontmatter YAML mal formatat a ${filePath}`);
    return false;
  }
  
  const frontmatter = frontmatterMatch[0];
  if (!frontmatter.includes('tipus: plantilla')) {
    console.error(`❌ [ERROR] El Frontmatter ha perdut l'atribut 'tipus: plantilla' a ${filePath}`);
    return false;
  }

  // 2. Check Seccions Obligatòries
  const seccions = [
    '## Font de Logos',
    '## Bloc Fixe d’Identitat',
    '## Objectiu',
    '## Context Necessari',
    '## Instrucció Principal',
    '## Output Esperat',
    '## Tancament Obligatori',
    '## Sinapsis',
    '## Taxonomia'
  ];

  for (const seccio of seccions) {
    if (!content.includes(seccio)) {
      console.error(`❌ [ERROR] La secció obligatòria "${seccio}" ha estat esborrada de ${filePath}`);
      return false;
    }
  }

  console.log(`✅ [OK] Integritat confirmada per a: ${path.basename(filePath)}`);
  return true;
}

async function runVigia() {
  console.log('🛡️ VIGIA-PLANTILLES: Iniciant escàner d\'higiene cognitiva...');
  let hasErrors = false;

  const targetPath = process.argv[2];
  const templatesToCheck = targetPath ? [path.resolve(process.cwd(), targetPath)] : PLANTILLES_VITAL;

  for (const template of templatesToCheck) {
    const isValid = checkTemplate(template);
    if (!isValid) hasErrors = true;
  }

  if (hasErrors) {
    console.error('\n🛑 VIGIA-PLANTILLES ha detectat corrupció en les plantilles estructurals.');
    console.error('Si us plau, restaureu el format ISO abans de continuar (SDP-REFLEX).');
    process.exit(1);
  } else {
    console.log('\n🌟 TOT CORRECTE. L\'Eixam ha respectat les plantilles.');
    process.exit(0);
  }
}

runVigia();
