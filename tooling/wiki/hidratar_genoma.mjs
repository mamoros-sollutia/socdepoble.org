#!/usr/bin/env node
/**
 * hidratar_genoma.mjs — Hidratador del Genoma v2 (l'altra meitat del Clon).
 * Destí proposat: 02_ACTUAR_Maquina_Tecnica/scripts/hidratar_genoma.mjs
 *
 * El sistema fins hui podia serialitzar l'organisme però cap script sabia
 * deserialitzar-lo: el Genotip era d'anada sola. Este script reconstruïx un
 * clon byte-exacte a partir d'un GENOMA v2 i VERIFICA cada sha256 declarat.
 * Si un sol byte no quadra, fail-closed i zero fitxers parcials (P-07/P-08).
 *
 * Ús:
 *   node hidratar_genoma.mjs --genoma=/ruta/GENOMA.md --desti=/ruta/clon [--verifica-nomes]
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const sha256 = (b) => createHash('sha256').update(b).digest('hex');

function parseArgs(argv) {
  const out = { genoma: null, desti: null, verificaNomes: false };
  for (const a of argv) {
    if (a.startsWith('--genoma=')) out.genoma = a.slice(9);
    else if (a.startsWith('--desti=')) out.desti = a.slice(8);
    else if (a === '--verifica-nomes') out.verificaNomes = true;
    else throw new Error(`Argument desconegut: ${a}`);
  }
  if (!out.genoma) throw new Error('Cal --genoma=/ruta/GENOMA.md');
  if (!out.desti && !out.verificaNomes) throw new Error('Cal --desti=/ruta o --verifica-nomes');
  return out;
}

function assegurarDins(arrel, candidat) {
  const rel = path.relative(arrel, candidat);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new Error(`Ruta fora del destí (path traversal): ${candidat}`);
  }
}

function main() {
  const { genoma, desti, verificaNomes } = parseArgs(process.argv.slice(2));
  const buf = fs.readFileSync(path.resolve(genoma));
  const CAP = Buffer.from('::: FITXER ');
  const NL = 0x0a;

  const fitxers = [];
  let i = 0;
  while (true) {
    const inici = buf.indexOf(CAP, i);
    if (inici === -1) break;
    // La capçalera ha d'anar a inici de línia.
    if (inici !== 0 && buf[inici - 1] !== NL) { i = inici + CAP.length; continue; }
    const fiLinia = buf.indexOf(NL, inici);
    if (fiLinia === -1) throw new Error('Capçalera de bloc sense fi de línia.');
    const linia = buf.subarray(inici, fiLinia).toString('utf8');
    const m = linia.match(/^::: FITXER (.+) bytes=(\d+) sha256=([0-9a-f]{64})( binari=base64)?$/);
    if (!m) throw new Error(`Capçalera invàlida: ${linia}`);
    const [, ruta, bytesStr, hash, binari] = m;
    const n = Number(bytesStr);
    const cos = buf.subarray(fiLinia + 1, fiLinia + 1 + n);
    if (cos.length !== n) throw new Error(`${ruta}: el genoma s'acaba abans dels ${n} bytes declarats.`);
    const peuEsperat = `\n::: FI ${ruta}\n`;
    const peu = buf.subarray(fiLinia + 1 + n, fiLinia + 1 + n + peuEsperat.length).toString('utf8');
    if (peu !== peuEsperat) throw new Error(`${ruta}: peu de bloc corromput (longitud declarada i contingut no quadren).`);
    const contingut = binari ? Buffer.from(cos.toString('ascii'), 'base64') : Buffer.from(cos);
    const real = sha256(contingut);
    if (real !== hash) throw new Error(`${ruta}: sha256 no coincidix (declarat ${hash.slice(0, 12)}…, real ${real.slice(0, 12)}…).`);
    fitxers.push({ ruta, contingut });
    i = fiLinia + 1 + n + peuEsperat.length;
  }
  if (fitxers.length === 0) throw new Error('Cap bloc ::: FITXER trobat: això no és un GENOMA v2.');

  if (verificaNomes) {
    console.log(`✓ Genoma íntegre: ${fitxers.length} fitxers verificats byte a byte.`);
    return;
  }

  const arrelDesti = path.resolve(desti);
  // Escriptura en dues fases: primer tot a memòria validat (ja fet), després a disc.
  for (const { ruta, contingut } of fitxers) {
    const abs = path.join(arrelDesti, ruta);
    assegurarDins(arrelDesti, abs);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, contingut, { flag: 'wx' }); // mai sobreescriu un clon parcial previ
  }
  console.log(`✓ Clon hidratat a ${arrelDesti}: ${fitxers.length} fitxers, tots amb sha256 verificat.`);
}

try { main(); } catch (e) {
  console.error(`❌ [HIDRATADOR] ${e.message}`);
  process.exitCode = 1;
}
