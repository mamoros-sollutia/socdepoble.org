#!/usr/bin/env node
/**
 * tractor-frontera-auth.mjs — la frontera que ningú vigilava.
 *
 * PER QUÈ EXISTIX
 * ───────────────
 * A la V7, `tractor-sollutia.mjs` cobria variables, instàncies i ordre de
 * build. De l'autenticació no en sabia res: `grep -c "oauth|callback|
 * ORIGENS_PERMESOS|relay|sdp_origin" tooling/gates/tractor-sollutia.mjs` → 0.
 *
 * Mentrestant hi havia dues llistes que han de coincidir i res que ho
 * comprovara:
 *
 *   · src/data/oauthRelay.js   RELAY_PER_DEFECTE = https://auth.socdepoble.org/callback
 *   · public/auth/callback.html  desplegament documentat = ...socdepoble.cat/callback
 *
 * `relayOrigin()` deriva d'eixa constant la validació estricta del
 * `postMessage`. Si el relé viu on deia l'HTML, el Camí 1 fallava sempre en
 * silenci i tot l'inici de sessió depenia del fallback de `storage` o del
 * timeout de 180 s. Cap prova ho hauria detectat: no és una excepció, és un
 * `return` primerenc dins d'un gestor d'esdeveniments.
 *
 * El fitxer callback.html ja porta escrita la seua pròpia llei de seguretat
 * («ORÍGENS_PERMESOS es compara amb ===. Mai amb startsWith, includes ni
 * expressions regulars»). Una llei escrita i no verificada és una preferència.
 * Esta porta la fa mecànica.
 *
 * LLEIS
 *   A1  RELE-DIVERGENT   l'URL del relé al JS i la documentada a l'HTML no coincidixen
 *   A2  COMPARACIO-FLUIXA  la llista blanca es consulta amb alguna cosa que no és igualtat
 *   A3  ORIGEN-MALFORMAT  entrada amb barra final, comodí, camí o esquema absent
 *   A4  SOLLUTIA-ABSENT   cap origen més enllà del domini propi i local (avís, no fallada)
 *   A5  CAMI-CRU          `sdp_path` arriba al `location.replace` sense validar
 *   A6  ORIGEN-CABLEJAT   un origen de relé escrit a mà en compte de derivat
 *
 * Pedra Seca: zero dependències, ESM, fail-closed.
 *
 *   node tooling/gates/tractor-frontera-auth.mjs [--json]
 */

import fs from 'node:fs';
import { arrelSegura, R } from '../lib/arrel.mjs';

const JSON_OUT = process.argv.includes('--json');

let ARREL;
try { ARREL = arrelSegura(); } catch (e) {
  console.error(e.informe ? e.informe() : String(e));
  process.exit(1);
}

const JS = 'src/data/oauthRelay.js';
const HTML = 'public/auth/callback.html';

const infr = [];
const avisos = [];
const falla = (llei, on, detall) => infr.push({ llei, on, detall });
const avisa = (llei, on, detall) => avisos.push({ llei, on, detall });

const llig = (rel) => {
  const abs = R(rel);
  if (!fs.existsSync(abs)) {
    console.error(`\n❌ [FRONTERA-AUTH] Falta ${rel}. La frontera d'autenticació no es pot auditar.\n`);
    process.exit(1);
  }
  return fs.readFileSync(abs, 'utf8');
};

const js = llig(JS);
const html = llig(HTML);

/* ═══════════ A1 · l'URL del relé ha de ser la mateixa als dos costats ═══════════ */

const mJs = /RELAY_PER_DEFECTE\s*=\s*['"]([^'"]+)['"]/.exec(js);
if (!mJs) {
  falla('A1', JS, 'No es troba `RELAY_PER_DEFECTE`. Sense una font única, els dos costats deriven.');
} else {
  const urlJs = mJs[1];
  let origenJs = null;
  try { origenJs = new URL(urlJs).origin; } catch {
    falla('A1', JS, `RELAY_PER_DEFECTE no és un URL absolut: ${urlJs}`);
  }

  // Tots els auth.* que apareixen a l'HTML (comentari de desplegament inclòs).
  const alsHtml = [...new Set([...html.matchAll(/https?:\/\/[a-z0-9.-]*auth[a-z0-9.-]*(?::\d+)?/gi)]
    .map((m) => m[0]))];
  for (const u of alsHtml) {
    let o = null;
    try { o = new URL(u).origin; } catch { continue; }
    if (origenJs && o !== origenJs) {
      falla('A1', HTML,
        `L'HTML nomena el relé a «${o}» i ${JS} el fixa a «${origenJs}». `
        + 'relayOrigin() en deriva la validació del postMessage: si divergixen, '
        + 'el Camí 1 falla sempre en silenci.');
    }
  }
}

/* ═══════════ A2 · la llista blanca només es consulta amb igualtat ═══════════ */

const mLlista = /var\s+ORIGENS_PERMESOS\s*=\s*\[([\s\S]*?)\];/.exec(html);
if (!mLlista) {
  falla('A2', HTML, 'No es troba `ORIGENS_PERMESOS`. Sense llista blanca açò és un redirector obert.');
} else {
  // Consultes admeses: indexOf(...) === -1 / !== -1, includes sobre l'array, ===
  const consultaFluixa = [
    [/ORIGENS_PERMESOS\s*\.\s*some\s*\(/, '.some() amb predicat: pot amagar un startsWith'],
    [/ORIGENS_PERMESOS\s*\.\s*find\s*\(/, '.find() amb predicat'],
    [/ORIGENS_PERMESOS\s*\.\s*filter\s*\(/, '.filter() amb predicat'],
    [/origen\s*\.\s*startsWith\s*\(/, 'origen.startsWith(): acceptaria socdepoble.atacant.com'],
    [/origen\s*\.\s*includes\s*\(/, 'origen.includes(): acceptaria qualsevol subcadena'],
    [/origen\s*\.\s*match\s*\(/, 'origen.match(): una expressió regular mal ancorada obri el relé'],
    [/new RegExp\s*\(/, 'RegExp dinàmica sobre l\'origen'],
  ];
  for (const [re, motiu] of consultaFluixa) {
    if (re.test(html)) falla('A2', HTML, `Consulta no exacta de la llista blanca — ${motiu}.`);
  }
  const teExacta = /ORIGENS_PERMESOS\s*\.\s*indexOf\s*\(\s*origen\s*\)\s*===?\s*-1/.test(html)
    || /ORIGENS_PERMESOS\s*\.\s*includes\s*\(\s*origen\s*\)/.test(html);
  if (!teExacta) {
    falla('A2', HTML, 'No es veu cap consulta per igualtat exacta de `origen` contra la llista blanca.');
  }

  /* ═══════════ A3 · forma de cada entrada ═══════════ */
  /* Els comentaris van fora ABANS d'extraure res. En valencià «l'origen» i
     «d'entrada» porten apòstrof, i un extractor ingenu els llig com a cadenes.
     Ho vaig patir escrivint esta mateixa porta. */
  const senseComentaris = mLlista[1]
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
  const entrades = [...senseComentaris.matchAll(/'([^'\n]+)'|"([^"\n]+)"/g)].map((m) => m[1] ?? m[2]);
  for (const e of entrades) {
    if (e.endsWith('/')) falla('A3', HTML, `«${e}» acaba en barra: mai coincidirà amb window.location.origin.`);
    if (e.includes('*')) falla('A3', HTML, `«${e}» conté un comodí. Els comodins ací són robatori de sessions.`);
    let u = null;
    try { u = new URL(e); } catch { falla('A3', HTML, `«${e}» no és un origen absolut vàlid.`); continue; }
    if (u.pathname !== '/' || u.search || u.hash) {
      falla('A3', HTML, `«${e}» porta camí, consulta o fragment. Un origen és esquema+host+port i res més.`);
    }
    if (u.protocol === 'http:' && !/^(localhost|127\.0\.0\.1|\[::1\])$/.test(u.hostname)) {
      falla('A3', HTML, `«${e}» és http: en un host que no és local. El codi viatjaria en clar.`);
    }
  }

  /* ═══════════ A4 · Sollutia ═══════════ */
  const propis = /socdepoble\.(cat|org)$/;
  const locals = /^(localhost|127\.0\.0\.1|\[::1\])$/;
  const forans = entrades.filter((e) => {
    try {
      const h = new URL(e).hostname;
      return !propis.test(h) && !locals.test(h);
    } catch { return false; }
  });
  if (forans.length === 0) {
    avisa('A4', HTML,
      'La llista només conté el domini propi i el local. Cap amfitrió de Sollutia. '
      + 'Si el component ja està incrustat en algun WordPress de client, l\'entrada amb '
      + 'Google hi està morta: tot origen absent d\'ací rep «Origen no reconegut».');
  }
}

/* ═══════════ A5 · sdp_path validat abans d'anar al replace ═══════════ */

if (/sdp_path/.test(html)) {
  const validat = /camiValid|indexOf\('#'\)|charCodeAt|\.length\s*<=?\s*\d+/.test(html)
    && /indexOf\('#'\)\s*===?\s*-1|!camiValid/.test(html);
  if (!validat) {
    falla('A5', HTML,
      '`sdp_path` arriba a location.replace() sense validar. `sdp_origin` es valida amb rigor '
      + 'i este no: rigor asimètric a dos paràmetres de la mateixa URL. Un «#» dins seu trenca '
      + 'el fragment i mata l\'entrada en silenci.');
  }
}

/* ═══════════ A6 · cap origen de relé cablejat fora de la constant ═══════════ */

const cablejats = [...js.matchAll(/['"](https?:\/\/[^'"]*auth[^'"]*)['"]/gi)].map((m) => m[1]);
for (const c of cablejats) {
  if (mJs && c !== mJs[1]) {
    falla('A6', JS, `URL de relé escrit a mà «${c}» al costat de RELAY_PER_DEFECTE. Una sola font o cap.`);
  }
}
if (!/relayOrigin\s*=\s*\(.*\)\s*=>\s*new URL\(relayUrl\(/.test(js)) {
  falla('A6', JS, 'relayOrigin() no es deriva de relayUrl(). Si es cablejara, la validació del postMessage deixaria de seguir la configuració.');
}

/* ═══════════════════════════ Informe ═══════════════════════════ */

if (JSON_OUT) {
  console.log(JSON.stringify({ ok: infr.length === 0, infraccions: infr, avisos }, null, 2));
  process.exit(infr.length ? 1 : 0);
}

const NOMS = {
  A1: 'RELE-DIVERGENT — el JS i l\'HTML no nomenen el mateix relé',
  A2: 'COMPARACIO-FLUIXA — la llista blanca no es consulta per igualtat',
  A3: 'ORIGEN-MALFORMAT — entrada que mai coincidirà o que obri el relé',
  A4: 'SOLLUTIA-ABSENT — cap amfitrió de Sollutia a la llista',
  A5: 'CAMI-CRU — sdp_path sense validar',
  A6: 'ORIGEN-CABLEJAT — URL de relé escrit a mà',
};

console.log('\n🔐 [FRONTERA-AUTH] Relé OAuth i llista blanca d\'orígens\n');
for (const llei of ['A1', 'A2', 'A3', 'A4', 'A5', 'A6']) {
  const seus = infr.filter((i) => i.llei === llei);
  const seusAvis = avisos.filter((i) => i.llei === llei);
  const marca = seus.length ? '❌' : seusAvis.length ? '⚠️ ' : '✅';
  console.log(`${marca} ${llei} · ${NOMS[llei]} — ${seus.length} màx 0`);
  for (const s of [...seus, ...seusAvis].slice(0, 6)) console.log(`      ${s.on}: ${s.detall}`);
}
console.log('\n' + '─'.repeat(72));

if (infr.length) {
  console.error(`\n❌ [FRONTERA-AUTH] ${infr.length} infracció(ns). L'entrada amb Google no és de fiar.\n`);
  process.exit(1);
}
console.log(`\n✅ [FRONTERA-AUTH] Frontera coherent${avisos.length ? ` (${avisos.length} avís/os)` : ''}.\n`);
process.exit(0);
