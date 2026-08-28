import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REQUIRED_FILES = [
  '.agents/AGENTS.md',
  'package.json',
  '.agents/PROTOCOL_PETORRETA.md',
  'tooling/wiki/reflex_petorreta.mjs',
];
const REQUIRED_DIRECTORIES = [
  '_wiki_de_poble',
  'tooling/wiki',
];

const isInside = (root, candidate) => {
  const relative = path.relative(root, candidate);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
};

function physicalFileInside(root, relative) {
  const candidate = path.join(root, relative);
  const stat = fs.lstatSync(candidate, { throwIfNoEntry: false });
  if (!stat?.isFile() || stat.isSymbolicLink() || stat.nlink !== 1) return false;
  return isInside(root, fs.realpathSync(candidate));
}

function physicalDirectoryInside(root, relative) {
  const candidate = path.join(root, relative);
  const stat = fs.lstatSync(candidate, { throwIfNoEntry: false });
  if (!stat?.isDirectory() || stat.isSymbolicLink()) return false;
  return isInside(root, fs.realpathSync(candidate));
}

function startDirectory(start) {
  const raw = start instanceof URL || String(start).startsWith('file:')
    ? fileURLToPath(start instanceof URL ? start : new URL(String(start)))
    : path.resolve(String(start));
  const stat = fs.lstatSync(raw, { throwIfNoEntry: false });
  const directory = stat?.isDirectory() ? raw : path.dirname(raw);
  return fs.realpathSync(directory);
}

/**
 * Descobrix l'arrel per estructura, mai per `cwd` ni per una quantitat fixa
 * de `..`. Es recorren tots els ancestres i es falla tancat si zero o més
 * d'una arrel satisfan els marcadors físics.
 */
export function discoverProjectRoot(start = import.meta.url) {
  const matches = [];
  let cursor = startDirectory(start);
  while (true) {
    if (REQUIRED_FILES.every((relative) => physicalFileInside(cursor, relative))
      && REQUIRED_DIRECTORIES.every((relative) => physicalDirectoryInside(cursor, relative))) {
      matches.push(cursor);
    }
    const parent = path.dirname(cursor);
    if (parent === cursor) break;
    cursor = parent;
  }
  if (matches.length !== 1) {
    throw new Error(`Arrel de projecte no canònica: se n'han trobat ${matches.length}; s'esperava exactament una.`);
  }
  return matches[0];
}

export const PROJECT_DIR = discoverProjectRoot(import.meta.url);
export const WIKI_DIR = path.join(PROJECT_DIR, '_wiki_de_poble');
export const TOOLING_WIKI_DIR = path.join(PROJECT_DIR, 'tooling', 'wiki');
export const WIKI_BASELINE_FILE = path.join(TOOLING_WIKI_DIR, 'wiki-baseline.lock.json');
