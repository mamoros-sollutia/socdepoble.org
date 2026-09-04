#!/usr/bin/env node
/**
 * desenterrar.mjs — restauració segellada d'un fitxer a una revisió anterior.
 *
 * V7.1 · reescrit després de l'auditoria del Consell (Seient Núm. 5).
 *
 * Defectes tancats respecte de la V7:
 *   P0-1  `execSync` amb interpolació de cadena → shell obert a `--ref`.
 *         Ara: `execFileSync` amb argv. Cap shell. Mai.
 *   P0-2  `readFileSync` resolia contra el CWD i `git show` contra l'arrel
 *         del repositori. Divergien i el segell certificava l'intercanvi
 *         entre dos fitxers distints. Ara hi ha una sola ruta canònica,
 *         relativa a `git rev-parse --show-toplevel`.
 *   P0-3  Escrivia destructivament sense rastre. Ara: refús si el fitxer té
 *         canvis no compromesos (llevat de `--forca`), i còpia obligatòria a
 *         `.sdp-paperera/` abans de tocar res.
 *   P0-4  Perdia els permisos (755 → 644). Ara el mode ix de `git ls-tree`.
 *   P0-5  Segell per concatenació ambigua. Ara amb separador NUL i domini.
 *   P0-6  Escrivia sense rebut del Reflex. Ara `claimReceiptForMutation`
 *         abans i `completeMutationClaim` després. Fail-closed.
 *
 * Ús:
 *   node tooling/brain/desenterrar.mjs --ref <sha> --fitxer <ruta>
 *   node tooling/brain/desenterrar.mjs --ref <sha> --fitxer <ruta> --segell <sha256>
 *
 * Pedra Seca: zero dependències externes, ESM, fail-closed.
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { parseArgs } from 'node:util';
import { pathToFileURL } from 'node:url';
import {
  claimReceiptForMutation,
  completeMutationClaim,
} from '../wiki/reflex_petorreta.mjs';

/* ═══════════════════════════ Constants ═══════════════════════════ */

const OPERACIO = 'restauracio-segellada';
const DOMINI_SEGELL = 'sdp.desenterrar.segell.v2';
const PAPERERA = '.sdp-paperera';
const MODES_ADMESOS = new Set(['100644', '100755']);
const RE_REF = /^[A-Za-z0-9._/^~@{}-]{1,255}$/;

const sha256 = (v) => createHash('sha256').update(v).digest('hex');
const posix = (v) => v.split(path.sep).join('/');

/* ═══════════════════════════ Git sense shell ═══════════════════════════ */

/**
 * Executa git amb argv. Mai passa per un intèrpret d'ordres, així que cap
 * `;`, `$(...)`, backtick ni `&&` dins d'un argument s'interpreta com a codi.
 */
function git(args, { arrel, buffer = false } = {}) {
  return execFileSync('git', arrel ? ['-C', arrel, ...args] : args, {
    encoding: buffer ? 'buffer' : 'utf8',
    maxBuffer: 256 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

/** Arrel física del repositori. Única autoritat sobre rutes. */
function arrelRepositori(desDe) {
  const cru = git(['rev-parse', '--show-toplevel'], { arrel: desDe }).trim();
  if (!cru) throw new Error('No s\'ha pogut determinar l\'arrel del repositori.');
  return fs.realpathSync(cru);
}

const dins = (arrel, candidat) => {
  const r = path.relative(arrel, candidat);
  return r === '' || (!r.startsWith('..') && !path.isAbsolute(r));
};

/**
 * Converteix qualsevol ruta que escriga l'operador en UNA ruta relativa a
 * l'arrel del repositori. Això és el que mata el P0-2: a partir d'ací el disc
 * i l'índex de Git parlen exactament del mateix fitxer.
 */
function rutaCanonica(arrel, cru) {
  if (typeof cru !== 'string' || !cru.trim()) throw new Error('--fitxer buit.');
  if (cru.includes('\0')) throw new Error('--fitxer amb byte NUL.');

  const absolut = path.resolve(process.cwd(), cru);
  if (!dins(arrel, absolut)) {
    throw new Error(`El fitxer viu fora del repositori: ${cru}`);
  }

  // realpath del primer ancestre existent, per a detectar symlinks sense
  // exigir que el fitxer existisca (pot haver-se esborrat).
  let cursor = absolut;
  const cua = [];
  let resolt;
  for (;;) {
    try { resolt = fs.realpathSync(cursor); break; } catch (e) {
      if (e.code !== 'ENOENT') throw e;
      const pare = path.dirname(cursor);
      if (pare === cursor) throw e;
      cua.unshift(path.basename(cursor));
      cursor = pare;
    }
  }
  const fisic = path.resolve(resolt, ...cua);
  if (!dins(arrel, fisic)) {
    throw new Error(`Ruta físicament fora del repositori (symlink): ${cru}`);
  }
  const lexica = posix(path.relative(arrel, absolut));
  const fisica = posix(path.relative(arrel, fisic));
  if (lexica !== fisica) {
    throw new Error(`Ruta ambigua a través d'un symlink: ${lexica} → ${fisica}. Declara la ruta física.`);
  }
  if (lexica === '' || lexica.startsWith('..')) throw new Error(`Ruta insegura: ${cru}`);
  if (lexica === PAPERERA || lexica.startsWith(`${PAPERERA}/`)) {
    throw new Error('La paperera no és un destí restaurable.');
  }
  return lexica;
}

/* ═══════════════════ Lectura de la revisió antiga ═══════════════════ */

/**
 * Torna { blob, mode } del fitxer a la referència demanada. El mode ix de
 * `git ls-tree`, no s'endevina: és el que tanca el P0-4.
 */
function llegeixRevisio(arrel, ref, rutaRel) {
  let brut;
  try {
    brut = git(['ls-tree', '-z', '--full-tree', ref, '--', rutaRel], { arrel });
  } catch {
    throw new Error(`La referència «${ref}» no existix o no és llegible.`);
  }
  const registre = brut.split('\0').filter(Boolean)[0];
  if (!registre) throw new Error(`«${rutaRel}» no existix a la referència «${ref}».`);

  const m = /^([0-7]{6}) (blob|tree|commit) ([0-9a-f]+)\t([\s\S]+)$/.exec(registre);
  if (!m) throw new Error('Resposta inesperada de `git ls-tree`.');
  const [, mode, tipus, objecte] = m;

  if (tipus !== 'blob') {
    throw new Error(`«${rutaRel}» a «${ref}» és un ${tipus}, no un fitxer. No es restaura.`);
  }
  if (!MODES_ADMESOS.has(mode)) {
    const quin = mode === '120000' ? 'symlink' : mode === '160000' ? 'submòdul' : `mode ${mode}`;
    throw new Error(`«${rutaRel}» a «${ref}» és un ${quin}. Restaurar-ho seria materialitzar el que Git no garantix.`);
  }
  return { blob: git(['cat-file', 'blob', objecte], { arrel, buffer: true }), mode };
}

/* ═══════════════════════════ Segell ═══════════════════════════ */

/**
 * Segell amb separador NUL i domini explícit. La V7 concatenava
 * `ref + fitxer + old + curr`: («abc»,«def») i («abcd»,«ef») donaven la
 * mateixa cadena. Amb NUL cap parell distint col·lisiona.
 */
const calculaSegell = ({ ref, ruta, modeAntic, shaAntic, shaActual }) =>
  sha256([DOMINI_SEGELL, ref, ruta, modeAntic, shaAntic, shaActual].join('\0'));

/* ═══════════════════════════ Paperera ═══════════════════════════ */

/**
 * Còpia del que estem a punt de destruir. Sense açò, restaurar un fitxer amb
 * feina no compromesa és irreversible — i la llei diu que no ho pot ser.
 */
function soterra(arrel, rutaRel, contingut, mode) {
  const marca = new Date().toISOString().replace(/[:.]/g, '-');
  const desti = path.join(arrel, PAPERERA, marca, rutaRel);
  fs.mkdirSync(path.dirname(desti), { recursive: true, mode: 0o700 });
  fs.writeFileSync(desti, contingut, { flag: 'wx', mode });
  return posix(path.relative(arrel, desti));
}

/* ═══════════════════════════ Escriptura ═══════════════════════════ */

function escriuAtomic(abs, blob, mode) {
  const tmp = path.join(path.dirname(abs), `.${path.basename(abs)}.desenterrar-${process.pid}`);
  fs.writeFileSync(tmp, blob, { flag: 'wx', mode: mode === '100755' ? 0o755 : 0o644 });
  try {
    fs.renameSync(tmp, abs);
  } catch (e) {
    fs.rmSync(tmp, { force: true });
    throw e;
  }
  fs.chmodSync(abs, mode === '100755' ? 0o755 : 0o644);
}

/* ═══════════════════════════ Programa ═══════════════════════════ */

async function main() {
  const { values } = parseArgs({
    options: {
      ref: { type: 'string' },
      fitxer: { type: 'string' },
      segell: { type: 'string' },
      forca: { type: 'boolean', default: false },
      rebut: { type: 'string' },
    },
  });
  const { ref, fitxer, segell, forca, rebut } = values;

  if (!ref || !fitxer) {
    console.error('Ús: node tooling/brain/desenterrar.mjs --ref <sha> --fitxer <ruta> [--segell <sha256>] [--forca]');
    process.exit(1);
  }
  if (!RE_REF.test(ref)) {
    throw new Error(`Referència amb caràcters no admesos: «${ref}». Només [A-Za-z0-9._/^~@{}-].`);
  }

  const arrel = arrelRepositori(process.cwd());
  const rutaRel = rutaCanonica(arrel, fitxer);
  const abs = path.join(arrel, rutaRel);

  /* ── Estat actual al disc ── */
  const st = fs.lstatSync(abs, { throwIfNoEntry: false });
  if (st && !st.isFile()) throw new Error(`«${rutaRel}» no és un fitxer regular.`);
  if (st && st.isSymbolicLink()) throw new Error(`«${rutaRel}» és un symlink.`);
  if (st && st.nlink !== 1) throw new Error(`«${rutaRel}» és un hardlink: no té identitat exclusiva.`);
  const blobActual = st ? fs.readFileSync(abs) : Buffer.alloc(0);
  const shaActual = st ? sha256(blobActual) : '(absent)';

  const { blob: blobAntic, mode: modeAntic } = llegeixRevisio(arrel, ref, rutaRel);
  const shaAntic = sha256(blobAntic);

  const segellEsperat = calculaSegell({ ref, ruta: rutaRel, modeAntic, shaAntic, shaActual });

  /* ─────────────── Mode inspecció ─────────────── */
  if (!segell) {
    const data = git(['show', '-s', '--format=%ci', ref], { arrel }).trim();
    const brut = git(['status', '--porcelain=v1', '-z', '--', rutaRel], { arrel });
    console.log(`\n--- AUTÒPSIA: ${rutaRel} ---`);
    console.log(`Arrel del repositori : ${arrel}`);
    console.log(`Data de la revisió   : ${data}`);
    console.log(`Mode a la revisió    : ${modeAntic}`);
    console.log(`SHA-256 revisió      : ${shaAntic}`);
    console.log(`SHA-256 disc         : ${shaActual}`);
    console.log(`Estat de treball     : ${brut ? '⚠️  BRUT — hi ha canvis no compromesos' : 'net'}`);
    console.log(`\nSegell per aplicar   : ${segellEsperat}\n`);
    console.log('--- DIFF (revisió → disc) ---');
    try {
      process.stdout.write(git(['diff', '--no-ext-diff', ref, '--', rutaRel], { arrel }));
    } catch { console.log('(sense diff llegible)'); }
    return;
  }

  /* ─────────────── Mode aplicació ─────────────── */

  if (segell !== segellEsperat) {
    console.error('❌ Segell invàlid: el fitxer o la revisió han canviat des de la inspecció.');
    console.error(`   S'esperava: ${segellEsperat}`);
    console.error(`   Rebut     : ${segell}`);
    process.exit(1);
  }

  // Feina no compromesa: refús per defecte. Açò és la llei d'Irreversibilitat.
  const brut = git(['status', '--porcelain=v1', '-z', '--', rutaRel], { arrel });
  if (brut && !forca) {
    console.error(`❌ «${rutaRel}» té canvis no compromesos. Restaurar-lo els destruiria.`);
    console.error('   Compromet-los, guarda\'ls amb `git stash`, o repetix amb --forca (quedarà còpia a la paperera).');
    process.exit(1);
  }

  // Rebut del Reflex. Fail-closed: sense lease no s'escriu.
  let claim;
  try {
    claim = await claimReceiptForMutation({
      receiptPath: rebut,
      operation: OPERACIO,
      targets: [rutaRel],
      checkDirty: !forca,
    });
  } catch (e) {
    console.error(`❌ Sense lease del Reflex no es restaura res: ${e.message}`);
    console.error(`   Obri'n una: node tooling/wiki/reflex_petorreta.mjs open --risk=high --scope=<abast> --operation=${OPERACIO} --intent="..."`);
    process.exit(1);
  }

  let lapida = null;
  try {
    if (st) lapida = soterra(arrel, rutaRel, blobActual, st.mode & 0o777);
    escriuAtomic(abs, blobAntic, modeAntic);
    await completeMutationClaim({ receiptPath: rebut, operation: OPERACIO }, claim.claimToken);
  } catch (e) {
    console.error(`❌ Restauració avortada: ${e.message}`);
    if (lapida) console.error(`   La còpia prèvia està a ${lapida}`);
    process.exit(1);
  }

  console.log(`✅ ${rutaRel} restaurat a ${ref} (mode ${modeAntic}).`);
  if (lapida) console.log(`   Còpia del contingut anterior: ${lapida}`);
  console.log(`   Lease consumida: ${claim.receipt.sessionId}`);
}

const esPrincipal = Boolean(process.argv[1])
  && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (esPrincipal) {
  main().catch((e) => {
    console.error(`❌ [DESENTERRAR] ${e.message}`);
    process.exitCode = 1;
  });
}

export { calculaSegell, rutaCanonica, arrelRepositori };
