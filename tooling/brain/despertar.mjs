#!/usr/bin/env node

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const root = process.cwd();
const escriptori = join(root, '_wiki_de_poble/05_Escriptori_Soc_de_Poble');
const enCursPath = join(escriptori, '00_EN_CURS.md');
const deutePath = join(root, '.pedra-seca-deute.json');

console.log('\n🌞 BON DIA, IAIA. Iniciant l\'Arrencada Cognitiva...\n');

// 1. Git Status
console.log('--- ESTAT DE GIT ---');
try {
  const branch = execSync('git branch --show-current').toString().trim();
  const status = execSync('git status --short').toString().trim();
  console.log(`Branca actual: ${branch}`);
  if (status) {
    console.log('Canvis no confirmats:\n' + status);
  } else {
    console.log('Arbre de treball net.');
  }
} catch (e) {
  console.log('Error llegint Git.');
}
console.log('');

// 2. Estat del Deute (Tractor Pedra Seca)
console.log('--- DEUTE DE PEDRA SECA ---');
if (existsSync(deutePath)) {
  try {
    const deute = JSON.parse(readFileSync(deutePath, 'utf-8'));
    for (const [llei, dades] of Object.entries(deute)) {
      if (dades.max > 0) {
        console.log(`${llei.padEnd(28)}: ${dades.max}`);
      }
    }
  } catch (e) {
    console.log('No s\'ha pogut llegir el deute.');
  }
} else {
  console.log('No s\'ha trobat .pedra-seca-deute.json');
}
console.log('');

// 3. Fitxers a l'Escriptori
console.log('--- CONTINGUT DE L\'ESCRIPTORI ---');
if (existsSync(escriptori)) {
  const files = readdirSync(escriptori).filter(f => f.endsWith('.md') && f !== '00_EN_CURS.md');
  if (files.length > 0) {
    files.forEach(f => console.log(`- ${f}`));
  } else {
    console.log('L\'Escriptori està buit de fitxers Markdown.');
  }
} else {
  console.log('El directori de l\'Escriptori no existeix.');
}
console.log('');

// 4. Tasca en curs
console.log('--- TASCA EN CURS (00_EN_CURS.md) ---');
if (existsSync(enCursPath)) {
  const content = readFileSync(enCursPath, 'utf-8');
  console.log(content);
} else {
  console.log('No hi ha cap tasca 00_EN_CURS.md ara mateix.');
}
console.log('\n🤖 IAIA, ja tens el context inicial carregat. Recorda llegir els fitxers de l\'escriptori si és necessari per començar a treballar.\n');
