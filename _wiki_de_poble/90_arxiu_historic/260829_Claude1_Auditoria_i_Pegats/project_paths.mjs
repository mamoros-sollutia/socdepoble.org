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

/* ═══════════════ AFEGIT PER L'AUDITORIA 260829 ═══════════════
 *
 * L'ESCRIPTORI ÉS L'ÚNICA DESTINACIÓ DE TREBALL ACTIU.
 *
 * Fins ara aquest fitxer exportava tot menys açò. 21 fitxers l'importaven
 * per a l'arrel i la wiki, i despres ~20 concatenaven a ma el literal
 * '05_Escriptori_Soc_de_Poble'. L'agent desava a 12_actes perque la ruta
 * bona no es podia importar de cap lloc: no era indisciplina, era que
 * faltava la peca.
 *
 * `tooling/gates/tractor-rutes.mjs` (R1) falla si algu torna a escriure
 * eixe literal a ma, i (R2) falla si algu lleva estes exportacions.
 */

/** On viu TOT el treball actiu. Actes, prompts, bundles, informes. */
export const ESCRIPTORI_DIR = path.join(WIKI_DIR, '05_Escriptori_Soc_de_Poble');

/** El full de ruta del dia. El que llig `despertar.mjs`. */
export const EN_CURS_FILE = path.join(ESCRIPTORI_DIR, '00_EN_CURS.md');

/** Index de l'escriptori — l'ancoratge que evita documents orfes. */
export const INDEX_ESCRIPTORI_FILE = path.join(ESCRIPTORI_DIR, '00_INDEX_ESCRIPTORI.md');

/** Nomes lectura. Res de treball actiu ací dins. */
export const ARXIU_DIR = path.join(WIKI_DIR, '04_ARXIU_Documents_Historics');

/** Cervell de l'agent: skills, regles, protocols. */
export const AGENTS_DIR = path.join(PROJECT_DIR, '.agents');
export const SKILLS_DIR = path.join(AGENTS_DIR, 'skills');

/** Deute mecanic dels tractors. */
export const DEUTE_PEDRA_SECA_FILE = path.join(PROJECT_DIR, '.pedra-seca-deute.json');
export const DEUTE_DISSENY_FILE = path.join(PROJECT_DIR, '.design-guard-deute.json');
export const DEUTE_VOCABULARI_FILE = path.join(PROJECT_DIR, '.vocabulari-deute.json');
