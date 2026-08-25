#!/usr/bin/env node
/**
 * tanca.mjs — LA TANCA · coll de botella únic d'escriptura
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Cap script del projecte pot tocar un fitxer si no passa per ací.
 *
 * Contracte:
 *   1. DRY-RUN PER DEFECTE. Sense `--procedeix` no s'escriu ni un byte.
 *   2. ARBRE NET. Si git té canvis sense confirmar, es refusa. El rollback
 *      d'un desastre és `git checkout`; si l'arbre ja està brut, eixa xarxa
 *      no existix.
 *   3. INSTANTÀNIA PRÈVIA. Còpia literal de cada fitxer abans de tocar-lo.
 *   4. RADI D'EXPLOSIÓ. Pressupost de fitxers, de línies i de bytes. Una
 *      mutació que toca 119 fitxers no és un pegat: és un incident.
 *   5. VALIDACIÓ ESTRUCTURAL. Es parseja el resultat ABANS d'escriure'l.
 *      Un canvi que trenca l'equilibri de claus o que fica un comentari en
 *      posició de fill JSX es rebutja, no s'escriu.
 *   6. REBUT. Cada operació deixa una línia NDJSON amb hash previ i posterior.
 *   7. DESFER D'UNA ORDRE. `node tooling/gates/tanca.mjs --desfer <id>`.
 *
 * Zero dependències. Només `node:` built-ins.
 *
 * ─── ÚS DES D'UN SCRIPT ───────────────────────────────────────────────────
 *
 *   import { obriTanca } from '../gates/tanca.mjs';
 *
 *   const tanca = await obriTanca({ nom: 'fix-inline', argv: process.argv });
 *   await tanca.escriu('src/app/App.jsx', contingutNou);
 *   await tanca.mou('a.md', 'b.md');
 *   await tanca.esborra('fantasma.js');
 *   const rebut = await tanca.tanca();   // valida, escriu i segella
 *
 * ─── ÚS DES DE LA LÍNIA D'ORDRES ──────────────────────────────────────────
 *
 *   node tooling/gates/tanca.mjs --llista            # rebuts recents
 *   node tooling/gates/tanca.mjs --desfer 1a2b3c4d   # rollback
 *   node tooling/gates/tanca.mjs --verifica <fitxer> # validació estructural
 *
 * Codis d'eixida: 0 correcte · 1 refús de la Tanca · 2 error intern.
 */

import {
  mkdir, readFile, writeFile, rename, rm, stat, readdir, copyFile
} from 'node:fs/promises';
import { existsSync, realpathSync } from 'node:fs';
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { execFileSync } from 'node:child_process';

/* ═════════════════════════════════════════════════════════════════════════
   ERRORS
   ═════════════════════════════════════════════════════════════════════════ */

export class ErrorTanca extends Error {
  constructor(codi, missatge, dades = {}) {
    super(missatge);
    this.name = 'ErrorTanca';
    this.codi = codi;
    this.dades = dades;
  }
}

/* ═════════════════════════════════════════════════════════════════════════
   PRESSUPOST PER DEFECTE (radi d'explosió)
   ═════════════════════════════════════════════════════════════════════════ */

export const PRESSUPOST_PER_DEFECTE = {
  maxFitxers: 12,          // més de 12 fitxers en una passada = incident
  maxLiniesPerFitxer: 400, // línies canviades en un sol fitxer
  maxPercentFitxer: 60,    // % de línies canviades respecte de l'original
  maxBytesTotal: 2_000_000
};

/* ═════════════════════════════════════════════════════════════════════════
   CAMINS · resolució segura contra enllaços simbòlics
   ─────────────────────────────────────────────────────────────────────────
   Esta és la funció que `core/safety.mjs` tenia trencada: cridava
   `basename()` sense importar-lo, el ReferenceError queia dins d'un catch
   buit i la protecció quedava desactivada per a tot camí inexistent — és a
   dir, per a tot fitxer nou. Ací es canonicalitza l'avantpassat existent
   més profund i s'hi tornen a enganxar els segments que falten.
   ═════════════════════════════════════════════════════════════════════════ */

export function canonicalitza(cami) {
  let abs = resolve(cami);
  const pendents = [];

  for (;;) {
    try {
      return join(realpathSync(abs), ...pendents);
    } catch {
      const pare = dirname(abs);
      if (pare === abs) return join(abs, ...pendents); // arrel del sistema
      pendents.unshift(basename(abs));
      abs = pare;
    }
  }
}

export function dinsDeLArrel(arrel, objectiu, etiqueta = 'camí') {
  const arrelAbs = canonicalitza(arrel);
  const abs = canonicalitza(isAbsolute(objectiu) ? objectiu : join(arrelAbs, objectiu));
  const rel = relative(arrelAbs, abs);

  if (rel === '' || rel.startsWith('..') || isAbsolute(rel)) {
    throw new ErrorTanca(
      'CAMI_FORA_ARREL',
      `${etiqueta} ix fora de l'arrel permesa: ${objectiu}`,
      { arrel: arrelAbs, resolt: abs }
    );
  }
  return abs;
}

const relArrel = (arrel, abs) => relative(canonicalitza(arrel), abs).split(sep).join('/');

/* ═════════════════════════════════════════════════════════════════════════
   VALIDACIÓ ESTRUCTURAL · sense dependències
   ═════════════════════════════════════════════════════════════════════════ */

const PARELLES = { ')': '(', ']': '[', '}': '{' };

/**
 * Recorre codi JS/JSX ignorant cadenes, plantilles, comentaris i literals
 * d'expressió regular, i comprova l'equilibri de delimitadors.
 */
export function equilibriDelimitadors(codi) {
  const pila = [];
  let i = 0;
  let anteriorSignificatiu = '';
  const n = codi.length;

  while (i < n) {
    const c = codi[i];
    const seg = codi[i + 1];

    // comentari de línia
    if (c === '/' && seg === '/') {
      while (i < n && codi[i] !== '\n') i++;
      continue;
    }
    // comentari de bloc
    if (c === '/' && seg === '*') {
      i += 2;
      while (i < n && !(codi[i] === '*' && codi[i + 1] === '/')) i++;
      i += 2;
      continue;
    }
    // cadenes i plantilles
    if (c === '"' || c === "'" || c === '`') {
      const delim = c;
      i++;
      while (i < n) {
        if (codi[i] === '\\') { i += 2; continue; }
        if (codi[i] === delim) { i++; break; }
        i++;
      }
      anteriorSignificatiu = delim;
      continue;
    }
    // literal d'expressió regular (heurística estàndard)
    if (c === '/' && !/[\w)\]]/.test(anteriorSignificatiu)) {
      let j = i + 1;
      let dinsClasse = false;
      let tancat = false;
      while (j < n) {
        if (codi[j] === '\\') { j += 2; continue; }
        if (codi[j] === '[') dinsClasse = true;
        else if (codi[j] === ']') dinsClasse = false;
        else if (codi[j] === '\n') break;
        else if (codi[j] === '/' && !dinsClasse) { tancat = true; break; }
        j++;
      }
      if (tancat) { i = j + 1; anteriorSignificatiu = '/'; continue; }
    }

    if (c === '(' || c === '[' || c === '{') {
      pila.push({ c, pos: i });
    } else if (c === ')' || c === ']' || c === '}') {
      const obert = pila.pop();
      if (!obert || obert.c !== PARELLES[c]) {
        return { ok: false, motiu: `delimitador «${c}» sense parella (posició ${i})` };
      }
    }

    if (!/\s/.test(c)) anteriorSignificatiu = c;
    i++;
  }

  if (pila.length) {
    return { ok: false, motiu: `${pila.length} delimitador(s) «${pila[pila.length - 1].c}» sense tancar` };
  }
  return { ok: true };
}

/**
 * Detecta comentaris `//` col·locats en posició de FILL JSX, on el
 * compilador no els tracta com a comentari sinó com a text literal que
 * s'imprimix a la pantalla.
 *
 * Regla: la línia anterior no buida tanca una etiqueta (`>`) o un contenidor
 * d'expressió (`}`), i la línia següent no buida obri un element (`<`).
 * Estos dos senyals junts només es donen en posició de fill. En posició
 * d'atribut la línia següent és un atribut, no una etiqueta.
 */
export function comentarisDinsJSX(codi) {
  const linies = codi.split('\n');
  const troballes = [];

  const anteriorNoBuida = (i) => {
    for (let j = i - 1; j >= 0; j--) if (linies[j].trim()) return linies[j].trim();
    return '';
  };
  const seguentNoBuida = (i) => {
    for (let j = i + 1; j < linies.length; j++) if (linies[j].trim()) return linies[j].trim();
    return '';
  };

  for (let i = 0; i < linies.length; i++) {
    const t = linies[i].trim();
    if (!t.startsWith('//')) continue;

    const prev = anteriorNoBuida(i);
    const seg = seguentNoBuida(i);

    const prevTancaNode = /(?<![=-])>$/.test(prev) || prev.endsWith('}');
    const segObriElement = seg.startsWith('<');

    if (prevTancaNode && segObriElement) {
      troballes.push({ linia: i + 1, text: t.slice(0, 60) });
    }
  }
  return troballes;
}

function saldoCSS(contingut) {
  let profunditat = 0;
  const net = contingut.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const c of net) {
    if (c === '{') profunditat++;
    else if (c === '}') profunditat--;
  }
  return profunditat;
}

/**
 * Validació DIFERENCIAL.
 *
 * El lèxic sense parser no sap distingir el text JSX del codi: un apòstrof
 * valencià («d'una») dins d'un node de text obri una cadena falsa. Un
 * validador absolut, per tant, rebutjaria fitxers sans — i un validador que
 * crida el llop acaba desactivat, que és exactament com va sobreviure el
 * shim de JSX trencat.
 *
 * Per això la Tanca no compara el fitxer amb la perfecció: el compara amb
 * ell mateix d'abans. Només bloqueja si la mutació DEGRADA l'estructura.
 * Un lèxic imperfecte però CONSISTENT és suficient per a això.
 *
 * @param {string|null} abans  contingut previ; null si el fitxer és nou.
 * @returns {{bloquejants: string[], avisos: string[]}}
 */
export function validaEstructura(rutaRel, contingut, abans = null) {
  const bloquejants = [];
  const avisos = [];
  const ext = rutaRel.slice(rutaRel.lastIndexOf('.')).toLowerCase();

  if (ext === '.json') {
    try { JSON.parse(contingut); }
    catch (e) { bloquejants.push(`JSON invàlid: ${e.message}`); }
  }

  if (['.js', '.jsx', '.mjs', '.cjs'].includes(ext)) {
    const ara = equilibriDelimitadors(contingut);
    if (!ara.ok) {
      const before = abans === null ? { ok: true } : equilibriDelimitadors(abans);
      if (before.ok) {
        bloquejants.push(`La mutació desequilibra els delimitadors: ${ara.motiu}`);
      } else {
        avisos.push(`Delimitadors no equilibrats segons el lèxic simple (ja hi eren abans): ${ara.motiu}`);
      }
    }

    if (ext === '.jsx') {
      const araC = comentarisDinsJSX(contingut);
      const abansC = abans === null ? [] : comentarisDinsJSX(abans);
      const nous = araC.length - abansC.length;
      for (const t of araC) {
        const missatge = `Línia ${t.linia}: comentari en posició de fill JSX — es renderitzarà com a text visible («${t.text}»).`;
        if (nous > 0) bloquejants.push(missatge);
        else avisos.push(missatge);
      }
    }
  }

  if (ext === '.css') {
    const ara = saldoCSS(contingut);
    const before = abans === null ? 0 : saldoCSS(abans);
    if (ara !== 0 && ara !== before) {
      bloquejants.push(`La mutació desequilibra les claus CSS (saldo ${ara}).`);
    }
  }

  return { bloquejants, avisos };
}

/* ═════════════════════════════════════════════════════════════════════════
   GIT
   ═════════════════════════════════════════════════════════════════════════ */

function estatGit(arrel) {
  try {
    execFileSync('git', ['rev-parse', '--is-inside-work-tree'], { cwd: arrel, stdio: 'pipe' });
  } catch {
    return { hiHaGit: false, net: false, brut: [] };
  }
  const eixida = execFileSync('git', ['status', '--porcelain'], { cwd: arrel, encoding: 'utf8' });
  const brut = eixida.split('\n').map((l) => l.trim()).filter(Boolean);
  let cap = '';
  try { cap = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: arrel, encoding: 'utf8' }).trim(); } catch {}
  return { hiHaGit: true, net: brut.length === 0, brut, cap };
}

/* ═════════════════════════════════════════════════════════════════════════
   UTILITATS
   ═════════════════════════════════════════════════════════════════════════ */

const sha = (dades) => createHash('sha256').update(dades).digest('hex');
const existix = async (p) => { try { await stat(p); return true; } catch { return false; } };

/**
 * Compta línies realment canviades (afegides + llevades) via subseqüència
 * comuna més llarga.
 *
 * La primera versió comparava per índex, i això és una mentida: llevar UNA
 * línia desplaça tota la resta i el comptador diu que has reescrit el 78%
 * del fitxer. Un pressupost alimentat amb una mesura falsa és un pressupost
 * que bloqueja canvis sans — i un guardià que bloqueja el que és sa acaba
 * desactivat, que és com vam arribar ací.
 */
function liniesCanviades(abans, despres) {
  const a = abans.split('\n');
  const b = despres.split('\n');

  // Retalla prefix i sufix comuns: la part caríssima queda minúscula.
  let ini = 0;
  while (ini < a.length && ini < b.length && a[ini] === b[ini]) ini++;
  let fi = 0;
  while (fi < a.length - ini && fi < b.length - ini && a[a.length - 1 - fi] === b[b.length - 1 - fi]) fi++;

  const x = a.slice(ini, a.length - fi);
  const y = b.slice(ini, b.length - fi);
  if (!x.length) return y.length;
  if (!y.length) return x.length;

  // Guarda: fitxers enormes cauen a una estimació conservadora.
  if (x.length * y.length > 25_000_000) return Math.max(x.length, y.length);

  // LCS amb dos files (només ens cal la longitud).
  let prev = new Uint32Array(y.length + 1);
  let act = new Uint32Array(y.length + 1);
  for (let i = 1; i <= x.length; i++) {
    for (let j = 1; j <= y.length; j++) {
      act[j] = x[i - 1] === y[j - 1]
        ? prev[j - 1] + 1
        : Math.max(prev[j], act[j - 1]);
    }
    [prev, act] = [act, prev];
    act.fill(0);
  }
  const lcs = prev[y.length];
  return (x.length - lcs) + (y.length - lcs);
}

async function escripturaAtomica(cami, dades) {
  await mkdir(dirname(cami), { recursive: true });
  const tmp = join(dirname(cami), `.${Date.now()}-${randomUUID()}.tmp`);
  try {
    await writeFile(tmp, dades, { encoding: 'utf8', flag: 'wx' });
    await rename(tmp, cami);
  } catch (err) {
    await rm(tmp, { force: true }).catch(() => {});
    throw new ErrorTanca('ESCRIPTURA_FALLIDA', err.message, { cami });
  }
}

/* ═════════════════════════════════════════════════════════════════════════
   LA TANCA
   ═════════════════════════════════════════════════════════════════════════ */

export async function obriTanca(opcions = {}) {
  const argv = opcions.argv || process.argv;
  const arrel = canonicalitza(opcions.arrel || process.cwd());
  const nom = opcions.nom || 'anonim';
  const pressupost = { ...PRESSUPOST_PER_DEFECTE, ...(opcions.pressupost || {}) };

  const procedeix = argv.includes('--procedeix');
  const senseGit = argv.includes('--sense-git');
  const silenci = argv.includes('--silenci');

  const dirTanca = join(arrel, '.tanca');
  const id = `${new Date().toISOString().replace(/[:.]/g, '').slice(0, 15)}_${randomUUID().slice(0, 8)}`;
  const dirInstantania = join(dirTanca, 'instantanies', `${id}_${nom}`);
  const rebuts = join(dirTanca, 'rebuts.ndjson');

  const diu = (...a) => { if (!silenci) console.log(...a); };

  /* ── Barrera 1: arbre de git net ─────────────────────────────────────── */
  const git = estatGit(arrel);
  if (procedeix && !senseGit) {
    if (!git.hiHaGit) {
      throw new ErrorTanca(
        'SENSE_GIT',
        'No hi ha repositori git: no existix xarxa de seguretat. Usa --sense-git si assumixes el risc conscientment.'
      );
    }
    if (!git.net) {
      throw new ErrorTanca(
        'ARBRE_BRUT',
        `L'arbre de git té ${git.brut.length} canvi(s) sense confirmar. Confirma o desa abans de mutar; si no, el rollback no distingirà el teu treball del d'esta eina.`,
        { brut: git.brut.slice(0, 20) }
      );
    }
  }

  /* ── Estat de la transacció ──────────────────────────────────────────── */
  const operacions = []; // { tipus, rel, abs, abans, despres, hashAbans, hashDespres }
  let tancada = false;

  const registra = (op) => {
    const jaHiEs = operacions.findIndex((o) => o.abs === op.abs);
    if (jaHiEs > -1) operacions[jaHiEs] = { ...operacions[jaHiEs], ...op };
    else operacions.push(op);
  };

  const api = {
    id,
    arrel,
    nom,
    procedeix,
    pressupost,

    /** Escriu (o crea) un fitxer. No toca el disc fins a `tanca()`. */
    async escriu(rutaRel, contingut) {
      const abs = dinsDeLArrel(arrel, rutaRel, 'escriptura');
      const rel = relArrel(arrel, abs);
      const existia = await existix(abs);
      const abans = existia ? await readFile(abs, 'utf8') : null;
      if (abans === contingut) return { rel, canvi: false };
      registra({
        tipus: existia ? 'modifica' : 'crea',
        rel, abs, abans, despres: contingut,
        hashAbans: abans === null ? null : sha(abans),
        hashDespres: sha(contingut)
      });
      return { rel, canvi: true };
    },

    /** Aplica una transformació de text sobre un fitxer existent. */
    async transforma(rutaRel, fn) {
      const abs = dinsDeLArrel(arrel, rutaRel, 'transformació');
      if (!await existix(abs)) throw new ErrorTanca('NO_EXISTIX', `No existix: ${rutaRel}`);
      const abans = await readFile(abs, 'utf8');
      return api.escriu(rutaRel, await fn(abans, relArrel(arrel, abs)));
    },

    async mou(deRel, aRel) {
      const deAbs = dinsDeLArrel(arrel, deRel, 'origen');
      const aAbs = dinsDeLArrel(arrel, aRel, 'destí');
      if (!await existix(deAbs)) throw new ErrorTanca('NO_EXISTIX', `No existix: ${deRel}`);
      const contingut = await readFile(deAbs, 'utf8');
      registra({
        tipus: 'mou', rel: relArrel(arrel, deAbs), abs: deAbs,
        aRel: relArrel(arrel, aAbs), aAbs,
        abans: contingut, despres: contingut,
        hashAbans: sha(contingut), hashDespres: sha(contingut)
      });
      return { rel: relArrel(arrel, deAbs), canvi: true };
    },

    async esborra(rutaRel) {
      const abs = dinsDeLArrel(arrel, rutaRel, 'esborrat');
      if (!await existix(abs)) return { rel: relArrel(arrel, abs), canvi: false };
      const abans = await readFile(abs, 'utf8');
      registra({
        tipus: 'esborra', rel: relArrel(arrel, abs), abs,
        abans, despres: null, hashAbans: sha(abans), hashDespres: null
      });
      return { rel: relArrel(arrel, abs), canvi: true };
    },

    get pendents() { return operacions.map((o) => ({ tipus: o.tipus, rel: o.rel, aRel: o.aRel })); },

    /** Valida, comprova el pressupost, fa instantània i escriu. */
    async tanca() {
      if (tancada) throw new ErrorTanca('JA_TANCADA', 'Esta Tanca ja s\'ha tancat.');
      tancada = true;

      if (!operacions.length) {
        diu('🧱 Tanca: cap canvi. Res a fer.');
        return { id, estat: 'buida', operacions: [] };
      }

      /* ── Barrera 2: validació estructural (diferencial) ────────────── */
      const problemes = [];
      const avisos = [];
      for (const op of operacions) {
        if (op.despres === null) continue;
        const v = validaEstructura(op.rel, op.despres, op.abans);
        for (const p of v.bloquejants) problemes.push(`${op.rel} — ${p}`);
        for (const a of v.avisos) avisos.push(`${op.rel} — ${a}`);
      }
      if (avisos.length && !silenci) {
        console.log(`\n⚠️  ${avisos.length} avís(os) preexistents (no bloquegen):`);
        for (const a of avisos.slice(0, 8)) console.log(`   · ${a}`);
        if (avisos.length > 8) console.log(`   · … i ${avisos.length - 8} més.`);
      }
      if (problemes.length) {
        throw new ErrorTanca(
          'ESTRUCTURA_TRENCADA',
          `La mutació produïx ${problemes.length} defecte(s) estructural(s). No s'escriu res.`,
          { problemes }
        );
      }

      /* ── Barrera 3: radi d'explosió ────────────────────────────────── */
      const excessos = [];
      if (operacions.length > pressupost.maxFitxers) {
        excessos.push(`${operacions.length} fitxers tocats (màxim ${pressupost.maxFitxers}).`);
      }
      let bytes = 0;
      for (const op of operacions) {
        bytes += Buffer.byteLength(op.despres ?? '', 'utf8');
        if (op.abans === null || op.despres === null) continue;
        const canviades = liniesCanviades(op.abans, op.despres);
        const totals = Math.max(1, op.abans.split('\n').length, op.despres.split('\n').length);
        const percent = (canviades / totals) * 100;
        if (canviades > pressupost.maxLiniesPerFitxer) {
          excessos.push(`${op.rel}: ${canviades} línies canviades (màxim ${pressupost.maxLiniesPerFitxer}).`);
        }
        if (percent > pressupost.maxPercentFitxer) {
          excessos.push(`${op.rel}: ${percent.toFixed(0)}% del fitxer reescrit (màxim ${pressupost.maxPercentFitxer}%).`);
        }
      }
      if (bytes > pressupost.maxBytesTotal) {
        excessos.push(`${bytes} bytes escrits (màxim ${pressupost.maxBytesTotal}).`);
      }
      if (excessos.length) {
        throw new ErrorTanca(
          'RADI_EXCEDIT',
          'La mutació supera el pressupost de radi d\'explosió. Divideix-la o puja el pressupost explícitament.',
          { excessos }
        );
      }

      /* ── Informe ───────────────────────────────────────────────────── */
      diu(`\n🧱 TANCA · ${nom}  [${id}]`);
      diu('─'.repeat(66));
      for (const op of operacions) {
        const marca = { crea: '＋', modifica: '～', esborra: '－', mou: '→' }[op.tipus];
        const detall = op.tipus === 'mou'
          ? `${op.rel} → ${op.aRel}`
          : op.abans && op.despres
            ? `${op.rel}  (${liniesCanviades(op.abans, op.despres)} línies)`
            : op.rel;
        diu(`  ${marca} ${detall}`);
      }
      diu('─'.repeat(66));

      if (!procedeix) {
        diu(`  ASSAIG. ${operacions.length} operació(ns) validades i NO escrites.`);
        diu('  Afig --procedeix per a aplicar-les.\n');
        return { id, estat: 'assaig', operacions: api.pendents };
      }

      /* ── Barrera 4: instantània ────────────────────────────────────── */
      await mkdir(dirInstantania, { recursive: true });
      for (const op of operacions) {
        if (op.abans === null) continue;
        const desti = join(dirInstantania, op.rel);
        await mkdir(dirname(desti), { recursive: true });
        await copyFile(op.abs, desti);
      }

      /* ── Aplicació ─────────────────────────────────────────────────── */
      const aplicades = [];
      try {
        for (const op of operacions) {
          if (op.tipus === 'esborra') {
            await rm(op.abs, { force: true });
          } else if (op.tipus === 'mou') {
            await mkdir(dirname(op.aAbs), { recursive: true });
            await rename(op.abs, op.aAbs);
          } else {
            await escripturaAtomica(op.abs, op.despres);
          }
          aplicades.push(op);
        }
      } catch (err) {
        diu(`\n⚠️  Fallada a mitjan aplicació: ${err.message}`);
        diu('   Restaurant des de la instantània...');
        for (const op of aplicades.reverse()) {
          if (op.tipus === 'mou') await rename(op.aAbs, op.abs).catch(() => {});
          else if (op.abans !== null) await escripturaAtomica(op.abs, op.abans).catch(() => {});
          else await rm(op.abs, { force: true }).catch(() => {});
        }
        throw new ErrorTanca('APLICACIO_FALLIDA', err.message, { id });
      }

      /* ── Rebut ─────────────────────────────────────────────────────── */
      const rebut = {
        id,
        nom,
        ts: new Date().toISOString(),
        cap: git.cap || null,
        instantania: relArrel(arrel, dirInstantania),
        operacions: operacions.map((o) => ({
          tipus: o.tipus, rel: o.rel, aRel: o.aRel || null,
          hashAbans: o.hashAbans, hashDespres: o.hashDespres
        }))
      };
      await mkdir(dirTanca, { recursive: true });
      await writeFile(rebuts, `${JSON.stringify(rebut)}\n`, { flag: 'a', encoding: 'utf8' });

      diu(`  ✅ ${operacions.length} operació(ns) aplicades.`);
      diu(`  Desfer:  node tooling/gates/tanca.mjs --desfer ${id}\n`);
      return { id, estat: 'aplicada', operacions: api.pendents, rebut };
    }
  };

  return api;
}

/* ═════════════════════════════════════════════════════════════════════════
   ROLLBACK
   ═════════════════════════════════════════════════════════════════════════ */

export async function llegirRebuts(arrel = process.cwd()) {
  const cami = join(canonicalitza(arrel), '.tanca', 'rebuts.ndjson');
  if (!existsSync(cami)) return [];
  const cru = await readFile(cami, 'utf8');
  return cru.split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
}

export async function desfer(id, arrel = process.cwd()) {
  const arrelAbs = canonicalitza(arrel);
  const rebuts = await llegirRebuts(arrelAbs);
  const rebut = rebuts.find((r) => r.id === id || r.id.endsWith(id));
  if (!rebut) throw new ErrorTanca('REBUT_DESCONEGUT', `Cap rebut amb id «${id}».`);

  const dirInst = join(arrelAbs, rebut.instantania);
  let restaurats = 0;

  for (const op of [...rebut.operacions].reverse()) {
    const abs = dinsDeLArrel(arrelAbs, op.rel, 'restauració');
    if (op.tipus === 'mou') {
      const aAbs = dinsDeLArrel(arrelAbs, op.aRel, 'restauració');
      if (await existix(aAbs)) { await mkdir(dirname(abs), { recursive: true }); await rename(aAbs, abs); restaurats++; }
      continue;
    }
    if (op.tipus === 'crea') {
      await rm(abs, { force: true });
      restaurats++;
      continue;
    }
    const copia = join(dirInst, op.rel);
    if (!existsSync(copia)) {
      console.warn(`  ⚠️  Sense còpia per a ${op.rel}; s'omet.`);
      continue;
    }
    const dades = await readFile(copia, 'utf8');
    if (op.hashAbans && sha(dades) !== op.hashAbans) {
      throw new ErrorTanca('INSTANTANIA_CORRUPTA', `La còpia de ${op.rel} no coincidix amb el hash del rebut.`);
    }
    await escripturaAtomica(abs, dades);
    restaurats++;
  }
  return { id: rebut.id, restaurats };
}

/* ═════════════════════════════════════════════════════════════════════════
   CLI
   ═════════════════════════════════════════════════════════════════════════ */

async function cli() {
  const argv = process.argv.slice(2);
  const arrel = process.cwd();

  if (argv.includes('--llista')) {
    const rebuts = await llegirRebuts(arrel);
    if (!rebuts.length) { console.log('Cap rebut.'); return 0; }
    for (const r of rebuts.slice(-25)) {
      console.log(`${r.ts}  ${r.id}  ${String(r.nom).padEnd(22)} ${r.operacions.length} op.`);
    }
    return 0;
  }

  const iDesfer = argv.indexOf('--desfer');
  if (iDesfer > -1) {
    const id = argv[iDesfer + 1];
    if (!id) { console.error('Ús: --desfer <id>'); return 2; }
    const r = await desfer(id, arrel);
    console.log(`✅ Rebut ${r.id} desfet. ${r.restaurats} fitxer(s) restaurats.`);
    return 0;
  }

  const iVer = argv.indexOf('--verifica');
  if (iVer > -1) {
    const objectius = argv.slice(iVer + 1).filter((a) => !a.startsWith('--'));
    if (!objectius.length) { console.error('Ús: --verifica <fitxer...>'); return 2; }
    let dolents = 0;
    for (const f of objectius) {
      const abs = resolve(f);
      const v = validaEstructura(f, await readFile(abs, 'utf8'), null);
      const tot = [...v.bloquejants, ...v.avisos];
      if (v.bloquejants.length) dolents++;
      if (tot.length) {
        console.log(`${v.bloquejants.length ? '❌' : '⚠️ '} ${f}`);
        for (const p of tot) console.log(`   ↳ ${p}`);
      } else console.log(`✅ ${f}`);
    }
    return dolents ? 1 : 0;
  }

  console.log(`
🧱 LA TANCA — coll de botella únic d'escriptura

  --llista                 rebuts recents
  --desfer <id>            rollback d'una operació
  --verifica <fitxer...>   validació estructural d'un fitxer

  Des d'un script:  import { obriTanca } from 'tooling/gates/tanca.mjs'
`);
  return 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  cli()
    .then((codi) => process.exit(codi))
    .catch((err) => {
      console.error(`\n❌ ${err.codi || 'ERROR'}: ${err.message}`);
      if (err.dades?.problemes) for (const p of err.dades.problemes) console.error(`   ↳ ${p}`);
      if (err.dades?.excessos) for (const e of err.dades.excessos) console.error(`   ↳ ${e}`);
      process.exit(err instanceof ErrorTanca ? 1 : 2);
    });
}
