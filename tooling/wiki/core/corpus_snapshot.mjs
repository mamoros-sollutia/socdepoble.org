/**
 * autoneteja_wiki.mjs — auditoria i migració reversible de la Wiki.
 *
 * GARANTIES:
 * - Sense flags d'aplicació és un dry-run real: zero escriptures.
 * - Una migració de frontmatter conserva el cos byte a byte.
 * - Cap orfe amb contingut es mou automàticament.
 * - Només es poden quarantinar buits semàntics amb grau zero.
 * - Tota mutació exigix rebut del Reflex, backup, manifest i rollback.
 * - Qualsevol error és fail-closed (exit diferent de zero).
 *
 * Ús:
 *   node autoneteja_wiki.mjs [--json] [--strict]
 *   node autoneteja_wiki.mjs --apply-frontmatter --ack-schema-cutover \
 *     --receipt=/ruta/rebut.json
 *   node autoneteja_wiki.mjs --quarantine-empty --receipt=/ruta/rebut.json
 *   node autoneteja_wiki.mjs --restore=/ruta/manifest.json \
 *     --receipt=/ruta/rebut.json
 */

import fs from 'node:fs/promises';

const _metaUrl = import.meta.url.startsWith('file:') ? import.meta.url : 'file://' + import.meta.url;
import path from 'node:path';
import { createHash } from 'node:crypto';
import { isUtf8 } from 'node:buffer';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  parseFrontmatter,
  serializeFrontmatter,
} from '../lib/frontmatter.mjs';
import { WIKI_DIR } from '../lib/project_paths.mjs';

export const DEFAULT_WIKI_DIR = WIKI_DIR;
const SCHEMA_TEXT = await fs.readFile(fileURLToPath(new URL('../schema.json', _metaUrl)), 'utf8');
const SCHEMA = JSON.parse(SCHEMA_TEXT);
const FIELD_ORDER = ['estat', 'tipus', 'description', 'aliases', 'revisat'];
const ALLOWED_FIELDS = new Set(FIELD_ORDER);
const ALLOWED_STATES = new Set(SCHEMA.properties.estat.enum);
const ALLOWED_TYPES = new Set(SCHEMA.properties.tipus.enum);
const MAX_DESCRIPTION = SCHEMA.properties.description.maxLength;
const MAX_ALIASES = SCHEMA.properties.aliases.maxItems;
const KNOWN_LEGACY_FIELDS = new Set([
  'name', 'descripcio', 'resum', 'autor', 'authority', 'categoria', 'tags',
  'created_at', 'updated_at', 'version', 'script', 'replaces', 'depends_on',
  'jurisdiccio', 'pilar', 'mode',
]);
const MANUAL_LEGACY_FIELDS = new Set([
  'tags', 'script', 'replaces', 'depends_on', 'jurisdiccio', 'mode',
]);

const EXCLUDED_DIRS = new Set([
  '.git', '.obsidian', 'assets', 'node_modules', 'scripts', '.wiki-safety',
]);
const MIRROR_PREFIXES = [
  '00_SER_Brain_Identitat/00_AGENTS_I_SKILLS_MIRROR',
  '03_GOVERNAR_Normativa_Regles/agents_actius',
];
const VENDOR_PREFIXES = ['00_SER_Brain_Identitat/Sollutia'];
const VISIBLE_QUARANTINE_RE = /^QUARANTENA(?:_|-)/i;
 
const CONTROL_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const PLACEHOLDER_RE = /^(?:todo|tbd|wip|fixme|placeholder|pendent|per completar|pr[oò]ximament|sense contingut)[\s.!…:;-]*$/i;

const posix = (value) => value.split(path.sep).join('/');
import { normalitza } from '../lib/text.mjs';
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const SCHEMA_SHA256 = sha256(SCHEMA_TEXT);
const unique = (values) => [...new Set(values)];
const emptyValue = (value) => value === undefined || value === null || value === ''
  || (Array.isArray(value) && value.length === 0);
const valueFingerprint = (value) => ({
  type: Array.isArray(value) ? 'array' : typeof value,
  items: Array.isArray(value) ? value.length : undefined,
  sha256: sha256(JSON.stringify(value)),
});
const isPrefix = (rel, prefix) => rel === prefix || rel.startsWith(`${prefix}/`);
const isInside = (root, candidate) => {
  const rel = path.relative(root, candidate);
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
};

export function runId(date = new Date()) {
  return date.toISOString().replace(/[-:.]/g, '').replace('T', '_').replace('Z', 'Z');
}

export function zoneOf(relPath) {
  if (MIRROR_PREFIXES.some((prefix) => isPrefix(relPath, prefix))) return 'mirall';
  if (VENDOR_PREFIXES.some((prefix) => isPrefix(relPath, prefix))) return 'vendor';
  if (VISIBLE_QUARANTINE_RE.test(relPath.split('/')[0])) return 'quarantena_visible';
  if (relPath.startsWith('90_historic/')) return 'arxiu';
  if (relPath.startsWith('04_escriptori/')) return 'escriptori';
  if (/^0[0-3]_/.test(relPath)) return 'operatiu';
  return 'fora_taxonomia';
}

export function isMutableZone(zone, { includeMirrors = false, includeLifecycle = false } = {}) {
  void includeMirrors;
  if (zone === 'operatiu') return true;
  if (zone === 'arxiu' || zone === 'escriptori') return includeLifecycle;
  if (zone === 'mirall' || zone === 'vendor') return false;
  return false;
}

export async function discoverMarkdown(wikiDir) {
  const root = await fs.realpath(wikiDir);
  const docs = [];
  const skippedSymlinks = [];

  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name, 'ca'));
    for (const entry of entries) {
      if (entry.name.startsWith('.') || EXCLUDED_DIRS.has(entry.name)) continue;
      const fullPath = path.join(dir, entry.name);
      if (!isInside(root, fullPath)) throw new Error(`Ruta fora de la Wiki: ${fullPath}`);
      if (entry.isSymbolicLink()) {
        skippedSymlinks.push(posix(path.relative(root, fullPath)));
        continue;
      }
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
        const raw = await fs.readFile(fullPath);
        if (!isUtf8(raw)) throw new Error(`Markdown no és UTF-8 vàlid: ${fullPath}`);
        const content = raw.toString('utf8');
        const relPath = posix(path.relative(root, fullPath));
        docs.push({
          fullPath,
          relPath,
          name: entry.name,
          base: entry.name.replace(/\.md$/i, ''),
          content,
          bytes: raw.length,
          sha256: sha256(raw),
          zone: zoneOf(relPath),
        });
      }
    }
  }

  await walk(root);
  return { root, docs, skippedSymlinks };
}

export function treeDigest(docs) {
  return sha256(docs.map((doc) => `${doc.relPath}\0${doc.sha256}`).sort().join('\n'));
}

export function treeDigestEntries(entries) {
  return sha256(entries.map((entry) => `${entry.file}\0${entry.sha256}`).sort().join('\n'));
}
