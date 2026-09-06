#!/usr/bin/env node
/* eslint-disable no-unreachable */

/**
 * escombra_penjats.mjs — L'Escombra del Graf
 * Aquest script repassa tots els enllaços trencats (PENJATS) i els elimina:
 * - Si estan en una llista sols (com als índexs), s'elimina la línia sencera.
 * - Si estan enmig de text, es lleven els claudàtors [[ ]].
 */

import fs from 'node:fs';
import path from 'node:path';

throw new Error("🚨 [SDP-LOCK] Aquest mutador (escombra_penjats.mjs) està bloquejat per la Llei de Pedra Seca. Tota mutació cega està prohibida. 🚨");

const ARREL = path.resolve(process.cwd());
const EXCLOU = /(^|\/)(node_modules|\.git|\.obsidian|dist|build|90_historic)(\/|$)/;
const ARRELS = ['_wiki_de_poble', '.agents'];

function getMdFiles(dir, acc = []) {
  const abs = path.join(ARREL, dir);
  if (!fs.existsSync(abs)) return acc;
  for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
    const rel = path.posix.join(dir, e.name);
    if (EXCLOU.test(rel)) continue;
    if (e.isDirectory()) getMdFiles(rel, acc);
    else if (e.name.endsWith('.md')) acc.push(rel);
  }
  return acc;
}

const NODES = ARRELS.flatMap((d) => getMdFiles(d)).sort();
const validNames = new Set(NODES.map(n => path.basename(n, '.md')));

let totalCleaned = 0;

for (const filePath of NODES) {
  const absPath = path.join(ARREL, filePath);
  const content = fs.readFileSync(absPath, 'utf8');
  const lines = content.split('\n');
  let modified = false;
  let dinsCodi = false;

  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i];
    if (/^\s*```/.test(ln)) { dinsCodi = !dinsCodi; continue; }
    if (dinsCodi) continue;

    // Detectar línies que són PURAMENT un enllaç de llista
    // ex: "- [[FANTASMA]]" o "- [[FANTASMA|alias]]"
    const isPureListLink = /^\s*[-*]\s*\[\[([^\]|#]+)(?:[#|][^\]]*)?\]\]\s*$/.test(ln);
    
    if (isPureListLink) {
      const match = ln.match(/\[\[([^\]|#]+)/);
      if (match) {
        const dest = path.basename(match[1].trim(), '.md');
        if (!validNames.has(dest)) {
          // L'enllaç està trencat i està sol en una llista -> esborrem la línia
          lines[i] = null; // Marcar per esborrar
          modified = true;
          totalCleaned++;
          continue;
        }
      }
    }

    // Per a enllaços dins de text
    const links = [...ln.matchAll(/\[\[([^\]|#]+)(?:[#|]([^\]]*))?\]\]/g)];
    if (links.length > 0) {
      let newLine = ln;
      for (const m of links) {
        const fullMatch = m[0];
        const dest = path.basename(m[1].trim(), '.md');
        const alias = m[2] || m[1];
        
        if (!validNames.has(dest)) {
          // Si és una etiqueta de taxonomia (com Categoria: o Etiquetes:), no la toquem
          // Perquè el teixidor ja avisa de crear la nota o usar #. Però si volem podem llevar els claudàtors
          if (/^\s*[-*]?\s*\*{0,2}(Categoria|Etiquetes|Etiqueta|Tags?|Tema)\*{0,2}\s*:/.test(ln)) {
             continue; // No escombres la taxonomia
          }
          
          newLine = newLine.replace(fullMatch, alias);
          modified = true;
          totalCleaned++;
        }
      }
      if (lines[i] !== null) {
        lines[i] = newLine;
      }
    }
  }

  if (modified) {
    const newContent = lines.filter(l => l !== null).join('\n');
    fs.writeFileSync(absPath, newContent, 'utf8');
  }
}

if (totalCleaned > 0) {
  console.log(`🧹 [ESCOMBRA] S'han escombrat ${totalCleaned} enllaços fantasma.`);
} else {
  console.log(`✨ [ESCOMBRA] Cap enllaç fantasma detectat. Graf net.`);
}
