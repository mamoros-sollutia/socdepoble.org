#!/usr/bin/env node
/**
 * tractor-esquemes.mjs — dos esquemes, una sola llei.
 *
 * PER QUÈ EXISTIX
 * ───────────────
 * Al Mas hi ha dos validadors de frontmatter que no es parlaven:
 *
 *   · tooling/wiki/schema.json          → el llig validarFrontmatter(), que
 *                                          crida el Reflex a validatePetorreta().
 *   · tooling/gates/esquema_frontmatter.json → el llig tractor-frontmatter.mjs.
 *
 * A la V7 el primer admetia `tipus: petorreta` i el segon no. Resultat: una
 * Petorreta vàlida per al Reflex era sempre invàlida per a la porta, i a
 * l'inrevés. Cap document podia satisfer les dues lleis alhora. Ningú ho va
 * detectar perquè cap eina comparava els dos fitxers.
 *
 * Esta porta els compara. No decidix qui té raó: exigix que coincidisquen.
 *
 * LLEIS
 *   E1  TIPUS-DIVERGENT   un `tipus` admés per un esquema i no per l'altre
 *   E2  ESTAT-DIVERGENT   un `estat` admés per un esquema i no per l'altre
 *   E3  REQUERIT-DIVERGENT  claus obligatòries que no coincidixen
 *   E4  PETORRETA-MORTA   `petorreta` fora d'algun enum mentre el Reflex l'exigix
 *
 * Pedra Seca: zero dependències, ESM, fail-closed.
 *
 *   node tooling/gates/tractor-esquemes.mjs [--json]
 */

import fs from 'node:fs';
import path from 'node:path';
import { arrelSegura, R } from '../lib/arrel.mjs';

const JSON_OUT = process.argv.includes('--json');

let ARREL;
try { ARREL = arrelSegura(); } catch (e) {
  console.error(e.informe ? e.informe() : String(e));
  process.exit(1);
}

const V2 = 'tooling/wiki/schema.json';
const V1 = 'tooling/gates/esquema_frontmatter.json';
const REFLEX = 'tooling/wiki/reflex_petorreta.mjs';

const infraccions = [];
const falla = (llei, detall) => infraccions.push({ llei, detall });

function carrega(rel) {
  const abs = R(rel);
  if (!fs.existsSync(abs)) {
    console.error(`\n❌ [ESQUEMES] Falta ${rel}. Sense els dos esquemes no hi ha res a comparar.\n`);
    process.exit(1);
  }
  try { return JSON.parse(fs.readFileSync(abs, 'utf8')); } catch (e) {
    console.error(`\n❌ [ESQUEMES] ${rel} no és JSON vàlid: ${e.message}\n`);
    process.exit(1);
  }
}

const v2 = carrega(V2);
const v1 = carrega(V1);

const enumV2 = (k) => new Set(v2?.properties?.[k]?.enum ?? []);
const enumV1 = (k) => new Set(v1?.universal?.obligatories?.[k]?.enum ?? []);

/* ─────────────── E1 · E2 · enums divergents ─────────────── */

for (const [clau, llei] of [['tipus', 'E1'], ['estat', 'E2']]) {
  const a = enumV2(clau);
  const b = enumV1(clau);
  if (a.size === 0 || b.size === 0) {
    falla(llei, `«${clau}» no té enum en un dels dos esquemes: v2=${a.size} valors, v1=${b.size} valors.`);
    continue;
  }
  const nomesV2 = [...a].filter((x) => !b.has(x));
  const nomesV1 = [...b].filter((x) => !a.has(x));
  for (const x of nomesV2) {
    falla(llei, `«${clau}: ${x}» l'admet ${V2} i el rebutja ${V1}. Un document legal per al Reflex serà il·legal per a la porta.`);
  }
  for (const x of nomesV1) {
    falla(llei, `«${clau}: ${x}» l'admet ${V1} i el rebutja ${V2}. Un document que passe la porta petarà al Reflex.`);
  }
}

/* ─────────────── E3 · claus obligatòries ─────────────── */

const reqV2 = new Set(v2?.required ?? []);
const reqV1 = new Set(Object.keys(v1?.universal?.obligatories ?? {}));
for (const k of reqV2) if (!reqV1.has(k)) falla('E3', `«${k}» és obligatòria a ${V2} i opcional o absent a ${V1}.`);
for (const k of reqV1) if (!reqV2.has(k)) falla('E3', `«${k}» és obligatòria a ${V1} i opcional o absent a ${V2}.`);

/* ─────────────── E4 · el tipus que el Reflex exigix ─────────────── */

const camiReflex = R(REFLEX);
if (fs.existsSync(camiReflex)) {
  const cos = fs.readFileSync(camiReflex, 'utf8');
  // validatePetorreta() compara `parsed.data.tipus` amb un literal.
  const m = /parsed\.data\.tipus\s*!==\s*['"]([a-z_-]+)['"]/i.exec(cos);
  const exigit = m?.[1];
  if (exigit) {
    for (const [nom, conjunt] of [[V2, enumV2('tipus')], [V1, enumV1('tipus')]]) {
      if (!conjunt.has(exigit)) {
        falla('E4', `${REFLEX} exigix «tipus: ${exigit}» i ${nom} no l'admet. Cap Petorreta pot ser vàlida.`);
      }
    }
  }
}

/* ─────────────── Informe ─────────────── */

if (JSON_OUT) {
  console.log(JSON.stringify({ ok: infraccions.length === 0, infraccions }, null, 2));
  process.exit(infraccions.length ? 1 : 0);
}

const NOMS = {
  E1: 'TIPUS-DIVERGENT — enum de `tipus` que no coincidix',
  E2: 'ESTAT-DIVERGENT — enum de `estat` que no coincidix',
  E3: 'REQUERIT-DIVERGENT — claus obligatòries que no coincidixen',
  E4: 'PETORRETA-MORTA — el Reflex exigix un tipus que un esquema rebutja',
};

console.log('\n🔎 [ESQUEMES] Coherència entre els dos validadors de frontmatter\n');
for (const llei of ['E1', 'E2', 'E3', 'E4']) {
  const seus = infraccions.filter((i) => i.llei === llei);
  console.log(`${seus.length ? '❌' : '✅'} ${llei} · ${NOMS[llei]} — ${seus.length} màx 0`);
  for (const s of seus.slice(0, 8)) console.log(`      ${s.detall}`);
  if (seus.length > 8) console.log(`      … i ${seus.length - 8} més`);
}
console.log('\n' + '─'.repeat(72));

if (infraccions.length) {
  console.error(`\n❌ [ESQUEMES] ${infraccions.length} divergència(es). Dos esquemes que no diuen el mateix són dues lleis, i una d'elles sobra.\n`);
  process.exit(1);
}
console.log('\n✅ [ESQUEMES] Els dos validadors declaren exactament el mateix domini.\n');
process.exit(0);
