#!/usr/bin/env node
/**
 * purge_ghost_links.mjs 2.0 — Llevataques Autònom
 *
 * Principis de disseny (Copilot):
 * - No destructiu per defecte (dryRun=true).
 * - Genera diffs (patches).
 * - Conservació de context: anota en comptes d'esborrar `(BROKEN LINK: target) <!-- TODO -->`.
 * - Reparació automàtica amb fuzzy matching si la confiança és > 0.85.
 *
 * ÚS:
 *   node purge_ghost_links.mjs                    # dry-run
 *   node purge_ghost_links.mjs --apply            # aplicar canvis directament
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { buildWikiIndex } from './lib/wiki_walker.mjs';
import { WIKI_DIR } from './lib/project_paths.mjs';

const args = process.argv.slice(2);
const DRY_RUN = true; // Forçat fins que el Reflex torne. (abans: !args.includes('--apply'))
if (args.includes('--apply')) {
  throw new Error("L'escriptura directa està bloquejada. Usa l'API transaccional del Mutation Kernel.");
}

// Simple Levenshtein distance for fuzzy matching
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from(Array(m + 1), () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) d[i][0] = i;
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
    }
  }
  return d[m][n];
}

function fuzzyMatch(target, candidates) {
  let best = null;
  let bestScore = 0;
  for (const cand of candidates) {
    const dist = levenshtein(target.toLowerCase(), cand.toLowerCase());
    const maxLen = Math.max(target.length, cand.length);
    const score = maxLen === 0 ? 1 : (maxLen - dist) / maxLen;
    if (score > bestScore) {
      bestScore = score;
      best = cand;
    }
  }
  return { best, score: bestScore };
}

export async function purgeGhostLinks(wikiDir = WIKI_DIR) {
  console.log(`🧹 Iniciant purge_ghost_links.mjs 2.0... ${DRY_RUN ? '(DRY RUN)' : '(APPLY)'}`);
  const { mdDocs } = await buildWikiIndex(wikiDir);
  
  // Build Index
  const index = new Set(mdDocs.map(d => d.name.replace(/\.md$/, '')));
  const candidates = Array.from(index);
  
  let stats = { checked_files: 0, fixed_links: 0, annotated_links: 0 };
  let patches = [];

  for (const doc of mdDocs) {
    stats.checked_files++;
    let content = doc.content;
    let modified = false;

    // Detect missing links [[slug|text]] or [[slug]]
    const linkRegex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
    
    content = content.replace(linkRegex, (match, slug, text) => {
      const target = slug.trim();
      const visible = text ? text.trim() : target;
      
      if (index.has(target)) {
        return match; // Resolution OK
      }
      
      // Broken link!
      const matchResult = fuzzyMatch(target, candidates);
      
      if (matchResult.score > 0.85) {
        stats.fixed_links++;
        modified = true;
        return `[[${matchResult.best}|${visible}]]`; // Auto-rewrite
      } else {
        stats.annotated_links++;
        modified = true;
        // Annotate preserving visible text
        return `${visible} (BROKEN LINK: ${target}) <!-- TODO: fix link -->`;
      }
    });

    if (modified) {
      patches.push({ file: doc.fullPath, oldContent: doc.content, newContent: content });
    }
  }

  if (!DRY_RUN) {
    for (const p of patches) {
      await fs.writeFile(p.file, p.newContent, 'utf8');
    }
    console.log(`✅ Aplicats ${patches.length} fitxers amb canvis.`);
  } else {
    console.log(`⚠️ Dry run: es proposen canvis a ${patches.length} fitxers.`);
  }

  console.log('📊 Resultats:', stats);
  return stats;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  purgeGhostLinks().catch(console.error);
}
