#!/usr/bin/env node
/**
 * tractor-rutes-compila.mjs — UN PATRÓ QUE NO COMPILA ÉS UNA PANTALLA EN BLANC
 *
 * PER QUÈ EXISTIX (auditoria 260910, Seient Núm. 5)
 * ─────────────────────────────────────────────────
 * `tractor-rutes-web.mjs` compara declaracions contra declaracions: que cada
 * secció tinga <Route>, que la portada estiga al manifest. Tot correcte i tot
 * inútil davant del defecte que hi havia: `<Route path="/e/:slug/*">` era una
 * declaració impecable que `pathToRegex()` no podia convertir en RegExp.
 * SyntaxError en el primer render, ErrorBoundary, «No s'ha pogut carregar».
 *
 * Cap porta executava mai la funció. Sis línies ho haurien parat.
 *
 * LA LLIÇÓ, que val més que la porta: una porta que llig codi certifica
 * ortografia. Una porta que EXECUTA codi certifica comportament. Quan una
 * funció pura decidix si l'app pinta o no pinta, la porta l'ha de cridar.
 *
 * LLEIS
 *   C1 · Tot patró de <Route> compila sense llançar.        DURA
 *   C2 · Tot patró passat a matchPath() compila.            DURA
 *   C3 · Cada patró casa almenys una URL de la seua família. DURA
 *        (detecta el cas `/xat/*` que no casava `/xat`)
 *   C4 · Dos patrons germans no casen la mateixa URL amb la mateixa
 *        puntuació: seria una desambiguació per ordre de declaració.  AVÍS
 *
 * ÚS:  node tooling/gates/tractor-rutes-compila.mjs [--arrel=.] [--json]
 */

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ARG = (n) => (process.argv.find((a) => a.startsWith(`--${n}=`)) || '').split('=')[1] || null;
const ARREL = path.resolve(ARG('arrel') || '.');
const JSON_OUT = process.argv.includes('--json');
const R = (p) => path.join(ARREL, p);

const ROUTER = 'src/app/contexts/RouterContext.jsx';
const infraccions = [];
const avisos = [];
const anota = (llei, fitxer, detall, pista) => infraccions.push({ llei, fitxer, detall, pista });

/* ── Recull de fonts ───────────────────────────────────────────────────── */

function jsx(dir, acc = []) {
  let entrades;
  try { entrades = fs.readdirSync(dir, { withFileTypes: true }); } catch { return acc; }
  for (const e of entrades) {
    const c = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== 'node_modules') jsx(c, acc); }
    else if (/\.(jsx?|mjs)$/.test(e.name)) acc.push(c);
  }
  return acc;
}

const fonts = jsx(R('src'));
const patrons = [];   // { patro, fitxer, llei }

for (const f of fonts) {
  const text = fs.readFileSync(f, 'utf8');
  const rel = path.relative(ARREL, f);
  for (const m of text.matchAll(/<Route\s[^>]*?path=["'`]([^"'`]+)["'`]/g)) {
    patrons.push({ patro: m[1], fitxer: rel, llei: 'C1' });
  }
  for (const m of text.matchAll(/matchPath\(\s*["'`]([^"'`]+)["'`]/g)) {
    patrons.push({ patro: m[1], fitxer: rel, llei: 'C2' });
  }
}

if (!patrons.length) {
  console.error('PARAT. Cap patró de ruta trobat a src/. O la porta està cega o s\'ha esborrat la taula.');
  process.exit(1);
}

/* ── Carrega el compilador REAL de l'enrutador ─────────────────────────── */

let compila = null;
let casa = null;

try {
  const mod = await import(pathToFileURL(R(ROUTER)).href);
  compila = mod.compilaPatro || null;
  casa = mod.casa || null;
} catch {
  /* El fitxer és JSX i Node no el pot importar sense transformador. Es cau al
     pla B: extraure la funció per text. Menys net, però la porta ha de
     funcionar sense cadena de build. */
}

if (!compila) {
  const text = fs.readFileSync(R(ROUTER), 'utf8');
  const tros = text.match(/(?:export\s+)?function\s+(?:pathToRegex|compilaPatro)[\s\S]*?\n\}/);
  if (!tros) {
    anota('C1', ROUTER, 'no s\'hi troba pathToRegex/compilaPatro',
      'la porta no pot verificar el que no sap trobar: revisa el nom de la funció');
  } else {
    const cos = tros[0].replace(/^export\s+/, '');
    const nom = /function\s+(\w+)/.exec(cos)[1];
    const escapaSrc = (text.match(/const escapa\s*=[\s\S]*?;\n/) || [''])[0];
    // eslint-disable-next-line no-new-func
    const f = new Function(`${escapaSrc}\n${cos}\nreturn ${nom};`)();
    compila = (p) => { const r = f(p); return r instanceof RegExp ? { rx: r, puntuacio: 0 } : r; };
  }
}

/* ── C1 / C2 · compila sense llançar ──────────────────────────────────── */

const compilats = [];
for (const p of patrons) {
  try {
    const c = compila(p.patro);
    compilats.push({ ...p, c });
  } catch (e) {
    anota(p.llei, p.fitxer, `el patró ${JSON.stringify(p.patro)} no compila: ${e.message}`,
      'un patró que llança és una pantalla en blanc, no un 404');
  }
}

/* ── C3 · cada patró casa la seua pròpia família ───────────────────────── */

if (casa) {
  for (const { patro, fitxer, c } of compilats) {
    if (!c) continue;
    const mostra = patro
      .replace(/:[^/]+/g, 'x')
      .replace(/\/\*$/, '')
      .replace(/^\*$/, '/');
    const url = mostra.startsWith('/') ? mostra : '/' + mostra;
    if (!casa(patro, url || '/')) {
      anota('C3', fitxer, `el patró ${JSON.stringify(patro)} no casa ni la seua pròpia URL mínima (${url})`,
        'un comodí que exigix la barra final deixa /seccio sense destí');
    }
  }
}

/* ── C4 · ambigüitat entre germans ─────────────────────────────────────── */

if (casa) {
  const perFitxer = new Map();
  for (const c of compilats) {
    if (c.llei !== 'C1') continue;
    if (!perFitxer.has(c.fitxer)) perFitxer.set(c.fitxer, []);
    perFitxer.get(c.fitxer).push(c);
  }
  for (const [fitxer, llista] of perFitxer) {
    for (let i = 0; i < llista.length; i += 1) {
      for (let j = i + 1; j < llista.length; j += 1) {
        const a = llista[i]; const b = llista[j];
        if ((a.c.puntuacio ?? 0) !== (b.c.puntuacio ?? 0)) continue;
        const mostra = a.patro.replace(/:[^/]+/g, 'x').replace(/\/?\*$/, '') || '/';
        if (casa(a.patro, mostra) && casa(b.patro, mostra)) {
          avisos.push({ llei: 'C4', fitxer, detall: `${a.patro} i ${b.patro} casen ${mostra} amb la mateixa puntuació`,
            pista: 'es desempata per ordre de declaració: fràgil davant d\'una reordenació' });
        }
      }
    }
  }
}

/* ── Informe ───────────────────────────────────────────────────────────── */

if (JSON_OUT) {
  console.log(JSON.stringify({ patrons: patrons.length, infraccions, avisos }, null, 2));
} else {
  console.log(`tractor-rutes-compila · ${patrons.length} patrons examinats`);
  for (const a of avisos) console.warn(`  AVÍS  [${a.llei}] ${a.fitxer}: ${a.detall}\n        ${a.pista}`);
  for (const i of infraccions) console.error(`  ERROR [${i.llei}] ${i.fitxer}: ${i.detall}\n        ${i.pista}`);
}

if (infraccions.length) {
  console.error(`\nPARAT. ${infraccions.length} patró(ns) que trenquen l'app abans del primer píxel.`);
  process.exit(1);
}
console.log('Passa. Tots els patrons compilen i casen.');
