#!/usr/bin/env node

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error("Ús: node crear_document.mjs <RutaRelativa> <Títol> [Autor]");
  process.exit(1);
}

const [relPath, title, author = "IAIA MarIA"] = args;
const root = process.cwd();
const fullPath = join(root, relPath);

const now = new Date();
const yy = String(now.getFullYear()).slice(-2);
const mm = String(now.getMonth() + 1).padStart(2, '0');
const dd = String(now.getDate()).padStart(2, '0');
const hh = String(now.getHours()).padStart(2, '0');
const min = String(now.getMinutes()).padStart(2, '0');
const dateStr = `${yy}${mm}${dd}_${hh}${min}`;
const dateIso = now.toISOString().split('T')[0];

const content = `---
doc_id: SDP-DOC-${dateStr}
doc_type: "[WIKI_DOC]"
authoring_agent: "${author}"
version_semver: 1.0.0
owner: Consell de la Petorreta
domain: global
locale: ca-valencia
hora_creacio: "${hh}:${min}"
academic_metadata:
  data_creacio: "${dateIso}"
  nivell_maduresa: "Esborrany"
---

# ${title}

> **Anclatge de Seguretat**: Aquest document està ancorat a l'índex central [[00_INDEX_ESCRIPTORI]] / [[00_index]] per evitar l'orfenesa i garantir la consciència de la IA en futures auditories.

[INSERIU EL CONTINGUT ACÍ]
`;

mkdirSync(dirname(fullPath), { recursive: true });
writeFileSync(fullPath, content, 'utf-8');

console.log(`✅ Document plantillat i ancorat de seguretat creat amb èxit a: ${relPath}`);
