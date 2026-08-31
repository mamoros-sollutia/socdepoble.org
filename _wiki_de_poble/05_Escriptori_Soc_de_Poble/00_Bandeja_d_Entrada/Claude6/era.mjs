#!/usr/bin/env node
/**
 * era.mjs — L'ERA. TOTES LES PORTES A LA VEGADA, UNA SOLA BATUDA.
 *
 * PER QUÈ EXISTIX
 * ───────────────
 *   `npm run porta` és una cadena de 24 `&&`. Un `&&` para a la PRIMERA
 *   errada. Mesura del 260831 sobre el bundle: 13 de 19 portes fallen. Amb
 *   `&&` en veus UNA. Fas el pedaç, tornes a executar, en veus una altra.
 *   13 cicles per a tindre el mapa complet.
 *
 *   El coll d'ampolla no és el temps (14 portes = 864 ms, 300 ms dels quals
 *   són arrencades de Node en buit). És el CURTCIRCUIT. L'Era no para: bat
 *   tot el garbell, i després diu què hi ha.
 *
 * DISSENY (Pedra Seca)
 *   · Zero dependències. `node:child_process` i prou.
 *   · Zero canvis a les portes existents: es criden tal com estan.
 *   · Paral·lelisme = nuclis disponibles. Cap porta escriu; totes lligen.
 *   · Classificació BLOCA / AVISA declarada ACÍ, no dispersa pel package.json.
 *   · Portes que necessiten `node_modules` es marquen i no contaminen el
 *     veredicte si les dependències no hi són (auditoria sobre bundle).
 *
 *   node tooling/gates/era.mjs
 *   node tooling/gates/era.mjs --json > .era-informe.json
 *   node tooling/gates/era.mjs --nomes=bloca
 *   node tooling/gates/era.mjs --temps          # perfil per porta
 */

import { spawn } from 'node:child_process';
import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';

const ARG = (n) => process.argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3) ?? null;
const ARREL = path.resolve(ARG('arrel') ?? process.cwd());
const JSON_OUT = process.argv.includes('--json');
const TEMPS = process.argv.includes('--temps');
const NOMES = ARG('nomes');
const CONC = Number(ARG('conc') ?? Math.max(2, os.cpus().length));
const TIMEOUT_MS = Number(ARG('timeout') ?? 120_000);

/* ───────────────────────── El garbell ─────────────────────────
 * rang: BLOCA  → si falla, no es construïx.
 *       AVISA  → es reporta, no atura. Per a deute en reducció.
 * deps: true   → necessita node_modules (babel, react, eslint).
 */
const PORTES = [
  { id: 'lint',          cmd: ['npx', 'eslint', 'src', 'tooling', 'scripts'], rang: 'BLOCA', deps: true },
  { id: 'promesa',       cmd: ['node', 'tooling/gates/tractor-promesa.mjs'],             rang: 'BLOCA' },
  { id: 'tdz',           cmd: ['node', 'tooling/gates/tractor-tdz.mjs'],                 rang: 'BLOCA', deps: true },
  { id: 'arrel',         cmd: ['node', 'tooling/gates/tractor-arrel.mjs'],               rang: 'BLOCA' },
  { id: 'enxufe',        cmd: ['node', 'tooling/gates/tractor-enxufe.mjs'],              rang: 'BLOCA' },
  { id: 'maquinari',     cmd: ['node', 'tooling/gates/tractor-doctrina-maquinari.mjs'],  rang: 'BLOCA' },
  { id: 'innerhtml',     cmd: ['node', 'tooling/gates/tractor-innerhtml.mjs'],           rang: 'BLOCA' },
  { id: 'rutes',         cmd: ['node', 'tooling/gates/tractor-rutes.mjs'],               rang: 'BLOCA' },
  { id: 'rutes-web',     cmd: ['node', 'tooling/gates/tractor-rutes-web.mjs'],           rang: 'BLOCA', deps: true },
  { id: 'cognitiu',      cmd: ['node', 'tooling/wiki/tractor-cognitiu.mjs', '--arrel=.'],rang: 'BLOCA' },
  { id: 'manual',        cmd: ['node', 'tooling/gates/tractor-manual.mjs'],              rang: 'AVISA' },
  { id: 'cens',          cmd: ['node', 'tooling/gates/tractor-cens.mjs'],                rang: 'BLOCA' },
  { id: 'consell',       cmd: ['node', 'tooling/gates/tractor-consell.mjs'],             rang: 'BLOCA' },
  { id: 'registre',      cmd: ['node', 'tooling/gates/tractor-registre.mjs'],            rang: 'BLOCA' },
  { id: 'doctrina',      cmd: ['node', 'tooling/gates/tractor-doctrina.mjs'],            rang: 'AVISA' },
  { id: 'pedra-seca',    cmd: ['node', 'tooling/brain/tractor-pedra-seca.mjs'],          rang: 'BLOCA' },
  { id: 'design-guard',  cmd: ['node', 'tooling/gates/design_guard.mjs', '--arrel=src'], rang: 'BLOCA', deps: true },
  { id: 'tokens',        cmd: ['node', 'tooling/gates/tractor-tokens.mjs'],              rang: 'BLOCA' },
  { id: 'vocabulari',    cmd: ['node', 'tooling/gates/tractor-vocabulari.mjs'],          rang: 'BLOCA', deps: true },
  { id: 'persistencia',  cmd: ['node', 'tooling/gates/tractor-persistencia.mjs'],        rang: 'BLOCA' },
  { id: 'shim',          cmd: ['node', 'tooling/gates/tractor-shim.mjs'],                rang: 'BLOCA', deps: true },
  { id: 'frontera',      cmd: ['node', 'tooling/gates/tractor-sollutia.mjs'],            rang: 'BLOCA' },
  { id: 'teixit',        cmd: ['node', 'tooling/wiki/teixidor.mjs'],                     rang: 'AVISA' },
  { id: 'teixit-dirigit',cmd: ['node', 'tooling/wiki/teixidor2.mjs', '--arrel=.'],       rang: 'AVISA' },
  { id: 'seo',           cmd: ['node', 'tooling/gates/build-seo-manifest.mjs', '--verifica'], rang: 'BLOCA' },
  { id: 'proves',        cmd: ['npx', 'vitest', 'run', '--reporter=basic'],              rang: 'BLOCA', deps: true },
];

const HI_HA_DEPS = fs.existsSync(path.join(ARREL, 'node_modules'));

/* ───────────────────────────── Execució ───────────────────────────── */

function corre(p) {
  return new Promise((resol) => {
    const t0 = process.hrtime.bigint();
    if (p.deps && !HI_HA_DEPS) {
      return resol({ ...p, estat: 'OMESA', codi: null, ms: 0, eixida: 'node_modules absent' });
    }
    const fill = spawn(p.cmd[0], p.cmd.slice(1), { cwd: ARREL, env: process.env });
    let buf = '';
    const rellotge = setTimeout(() => { fill.kill('SIGKILL'); }, TIMEOUT_MS);
    fill.stdout.on('data', (d) => { buf += d; });
    fill.stderr.on('data', (d) => { buf += d; });
    fill.on('error', (e) => {
      clearTimeout(rellotge);
      resol({ ...p, estat: 'TRENCADA', codi: null, ms: 0, eixida: e.message });
    });
    fill.on('close', (codi, senyal) => {
      clearTimeout(rellotge);
      const ms = Number((process.hrtime.bigint() - t0) / 1_000_000n);
      const estat = senyal === 'SIGKILL' ? 'PENJADA' : codi === 0 ? 'PASSA' : 'FALLA';
      resol({ ...p, estat, codi, ms, eixida: buf.trim() });
    });
  });
}

/* Pou de concurrència: N alhora, no totes de colp (350 fitxers × 26 portes
 * llegits a la vegada saturen l'E/S d'un portàtil). */
async function pou(items, n, feina) {
  const eixida = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) {
      const k = i++;
      eixida[k] = await feina(items[k]);
    }
  }));
  return eixida;
}

const tria = PORTES.filter((p) => (NOMES === 'bloca' ? p.rang === 'BLOCA' : true));
const T0 = process.hrtime.bigint();
const res = await pou(tria, CONC, corre);
const MS_TOTAL = Number((process.hrtime.bigint() - T0) / 1_000_000n);
const MS_SUMA = res.reduce((a, r) => a + r.ms, 0);

/* ──────────────────────────────── Informe ──────────────────────────────── */

const falles = res.filter((r) => r.estat === 'FALLA' || r.estat === 'TRENCADA' || r.estat === 'PENJADA');
const bloquejants = falles.filter((r) => r.rang === 'BLOCA');
const avisos = falles.filter((r) => r.rang === 'AVISA');
const omeses = res.filter((r) => r.estat === 'OMESA');

if (JSON_OUT) {
  console.log(JSON.stringify({
    ok: bloquejants.length === 0,
    ms_paret: MS_TOTAL, ms_suma: MS_SUMA, concurrencia: CONC,
    resum: { total: res.length, passa: res.filter((r) => r.estat === 'PASSA').length, falla: falles.length, omesa: omeses.length },
    portes: res.map(({ id, rang, estat, codi, ms, eixida }) => ({ id, rang, estat, codi, ms, eixida: eixida.slice(0, 4000) })),
  }, null, 2));
  process.exit(bloquejants.length ? 1 : 0);
}

const ICONA = { PASSA: '✅', FALLA: '❌', TRENCADA: '💥', PENJADA: '⏱', OMESA: '⚪' };
console.log('\n🌾 L\'ERA — batuda completa de portes');
console.log('─'.repeat(72));
for (const r of res) {
  const primera = (r.eixida.split('\n').find((l) => /PARAT|❌|Error|error:/.test(l)) ?? '').trim().slice(0, 52);
  console.log(`  ${ICONA[r.estat]} ${r.rang === 'BLOCA' ? '█' : '░'} ${r.id.padEnd(15)} ${String(r.ms).padStart(5)}ms  ${primera}`);
}
console.log('─'.repeat(72));
console.log(`  paret ${MS_TOTAL}ms · suma ${MS_SUMA}ms · guany ×${(MS_SUMA / Math.max(MS_TOTAL, 1)).toFixed(1)} · conc ${CONC}`);
console.log(`  ${res.filter((r) => r.estat === 'PASSA').length} passen · ${bloquejants.length} bloquegen · ${avisos.length} avisen · ${omeses.length} omeses`);

if (TEMPS) {
  console.log('\n  Perfil (les 6 més lentes):');
  for (const r of [...res].sort((a, b) => b.ms - a.ms).slice(0, 6)) console.log(`    ${String(r.ms).padStart(6)}ms  ${r.id}`);
}

if (falles.length) {
  console.log('\n' + '═'.repeat(72));
  for (const r of falles) {
    console.log(`\n${ICONA[r.estat]} ${r.id}  [${r.rang}]  exit=${r.codi}`);
    console.log('─'.repeat(72));
    console.log(r.eixida.split('\n').slice(0, 24).map((l) => '  ' + l).join('\n'));
  }
}

console.log('\n' + '─'.repeat(72));
if (omeses.length) console.log(`⚪ ${omeses.length} porta(es) omesa(es): cal \`npm ci\` per a jutjar-les.`);
if (bloquejants.length) {
  console.error(`PARAT. ${bloquejants.length} porta(es) bloquejant(s): ${bloquejants.map((r) => r.id).join(', ')}`);
  process.exit(1);
}
if (avisos.length) console.log(`Avisos oberts: ${avisos.map((r) => r.id).join(', ')}`);
console.log('PASSA. L\'era està neta.');
process.exit(0);
