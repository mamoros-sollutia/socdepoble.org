#!/usr/bin/env node
/**
 * 260831_rescat_tokens.mjs — MIGRACIÓ D'UNA SOLA VEGADA
 *
 * Auditoria Seient Núm. 5 (260831):
 *   78 crides `var(--sdp-*)` apunten a tokens que no existixen a
 *   src/css/index.css. Sense fallback, el navegador ANUL·LA la declaració
 *   sencera. Això és, literalment, «components que s'inventen aspectes
 *   nous quan es trenquen».
 *
 * Este guió NO inventa colors. Cada destí és un token que ja existix al
 * bloc `:root, :host, .sdp-root`. La correspondència és semàntica, no
 * tipogràfica: `--sdp-marca` s'usava com a COLOR DE TEXT sobre fons clar,
 * per tant va a `--sdp-accent-text` (AA 5,51:1) i no a `--sdp-accent`
 * (que el cànon reserva per a FONS).
 *
 * Ús:
 *   node tooling/brain/260831_rescat_tokens.mjs --assaig   # no escriu res
 *   node tooling/brain/260831_rescat_tokens.mjs --escriu
 *
 * Després: `node tooling/gates/tractor-tokens.mjs` ha de donar 0.
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';

const ARREL = process.cwd();
const ESCRIU = process.argv.includes('--escriu');
const ASSAIG = !ESCRIU;

/* ─────────────────────────────────────────────────────────────────
   MAPA CANÒNIC. Esquerra: el fantasma. Dreta: el token que existix.
   ───────────────────────────────────────────────────────────────── */
const MAPA = {
  // Text
  '--sdp-text-secundari': '--sdp-text-suau',
  '--sdp-text-principal': '--sdp-text-base',
  '--sdp-text-normal': '--sdp-text-base',
  '--sdp-text-blau': '--sdp-accio-text',

  // Marca (s'usava sempre com a text/vora sobre fons clar)
  '--sdp-marca': '--sdp-accent-text',
  '--sdp-marca-suau': '--sdp-accent-subtil',

  // Fons
  '--sdp-fons-base': '--sdp-fons-superficie',
  '--sdp-fons-principal': '--sdp-fons-superficie',
  '--sdp-fons-element': '--sdp-fons-elevat',
  '--sdp-bg-superficie': '--sdp-fons-superficie',
  '--sdp-color-surface-hover': '--sdp-fons-subtil',

  // Vores
  '--sdp-vora-suau': '--sdp-vora',
  '--sdp-vora-div': '--sdp-vora',
  '--sdp-vora-destacada': '--sdp-vora-forta',

  // Radis
  '--sdp-radi-md': '--sdp-radi-m',
  '--sdp-radius-md': '--sdp-radi-m',
  '--sdp-radi-lg': '--sdp-radi-g',
  '--sdp-radi-targeta': '--sdp-radi-g',
  '--sdp-radi-2xl': '--sdp-radi-xl',

  // Ombres
  '--sdp-ombra-suau': '--sdp-ombra-1',
  '--sdp-ombra-flotant': '--sdp-ombra-3',
  '--sdp-ombra-5': '--sdp-ombra-4',

  // Moviment
  '--sdp-t-rapida': '--sdp-t',
  '--sdp-t-normal': '--sdp-t',

  // Radi de pastilla (s'usava amb fallback 9999px, que és una còpia
  // privada del sistema dins d'un component)
  '--sdp-radi-pill': '--sdp-radi-pastilla',

  // Tipografia
  '--sdp-font-family-display': '--sdp-font',

  // Primitives
  '--sdp-pedra-75': '--sdp-pedra-100',

  // Capa 2: un component citava l'escala crua. El blau d'acció sobre fons
  // clar és `--sdp-accio-text` (AAA 7,20:1) i sí que canvia amb el tema.
  '--sdp-secondary-600': '--sdp-accio-text',

  // z-index: el projecte ja té una escala única `--z-*`. `--sdp-z-toast`
  // era un namespace paral·lel d'un sol membre. Es reintegra a l'escala.
  '--sdp-z-toast': '--z-calaix'
};

/* ── Comprovació prèvia: cap destí pot ser un altre fantasma ── */
const CSS = ['src/css/index.css', 'src/css/legacy-components.css']
  .filter((f) => existsSync(path.join(ARREL, f)))
  .map((f) => readFileSync(path.join(ARREL, f), 'utf8'))
  .join('\n');

if (!CSS) {
  console.error('PARAT. No trobe src/css/index.css. Executa des de l\'arrel del repositori.');
  process.exit(2);
}

const DEFINITS = new Set([...CSS.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));
const destinsMorts = [...new Set(Object.values(MAPA))].filter((t) => !DEFINITS.has(t));
if (destinsMorts.length) {
  console.error('PARAT. El mapa apunta a tokens que tampoc existixen:');
  for (const t of destinsMorts) console.error(`   ${t}`);
  process.exit(2);
}

/* ── Recorregut ── */
const EXT = /\.(css|js|jsx)$/;
const SALTA = new Set(['node_modules', 'dist', 'build', 'coverage', '.git']);

function arbre(dir, eixida = []) {
  for (const nom of readdirSync(dir)) {
    if (SALTA.has(nom) || nom.startsWith('.')) continue;
    const p = path.join(dir, nom);
    if (statSync(p).isDirectory()) arbre(p, eixida);
    else if (EXT.test(nom)) eixida.push(p);
  }
  return eixida;
}

const fitxers = arbre(path.join(ARREL, 'src'));
let totalCanvis = 0;
const perFitxer = [];

for (const f of fitxers) {
  const original = readFileSync(f, 'utf8');
  let text = original;
  const detall = [];

  for (const [mort, viu] of Object.entries(MAPA)) {
    // Només dins de var(...). Mai toquem una DEFINICIÓ `--x:`.
    const esc = mort.replace(/-/g, '\\-');
    // 1r: forma amb fallback → s'elimina el fallback (llei T2).
    const ambFallback = new RegExp(`var\\(\\s*${esc}\\s*,[^)]*\\)`, 'g');
    const nF = (text.match(ambFallback) || []).length;
    if (nF) text = text.replace(ambFallback, `var(${viu})`);
    // 2n: forma neta.
    const net = new RegExp(`var\\(\\s*${esc}\\s*\\)`, 'g');
    const nN = (text.match(net) || []).length;
    if (nN) text = text.replace(net, `var(${viu})`);
    const n = nF + nN;
    if (!n) continue;
    detall.push([mort, viu, n]);
    totalCanvis += n;
  }

  if (detall.length) {
    perFitxer.push([path.relative(ARREL, f), detall]);
    if (ESCRIU) writeFileSync(f, text);
  }
}

/* ── Informe ── */
const banda = '─'.repeat(70);
console.log(`\n🪨 RESCAT DE TOKENS — ${ASSAIG ? 'ASSAIG (no s\'escriu res)' : 'ESCRIPTURA'}\n${banda}`);

for (const [rel, detall] of perFitxer) {
  console.log(`\n  ${rel}`);
  for (const [mort, viu, n] of detall) {
    console.log(`    ${String(n).padStart(3)} ×  ${mort.padEnd(28)} → ${viu}`);
  }
}

console.log(`\n${banda}`);
console.log(`  ${totalCanvis} substitucions en ${perFitxer.length} fitxers.`);

if (ASSAIG) {
  console.log('  Assaig. Torna a executar amb --escriu per aplicar-ho.\n');
} else {
  console.log('  Aplicat. Ara: node tooling/gates/tractor-tokens.mjs\n');
}

process.exit(0);
