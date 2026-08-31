#!/usr/bin/env node
/**
 * tractor-postmissatge.mjs — LA PORTA QUE FALTAVA A LA FRONTERA
 *
 * PER QUÈ EXISTIX
 * ───────────────
 *   `tractor-sollutia.mjs` es diu «la porta de la frontera» i vigila quatre
 *   coses: variables CSS òrfenes, instàncies del custom element, ordre de
 *   build i tokens muts. Cap d'elles és de seguretat.
 *
 *   La frontera REAL amb Sollutia és `window.postMessage`. Quan el Web
 *   Component viu dins d'una pàgina que no controlem, eixe canal és l'única
 *   via per la qual codi de tercers pot parlar-li directament. L'auditoria
 *   260831 va trobar `src/adapters/sollutiaBridge.js` amb la validació
 *   d'origen ESCRITA COM A COMENTARI i un `postMessage(..., '*')` amb la
 *   nota «En prod, canviar '*' pel domini de Sollutia». Cap porta ho veia.
 *
 *   Un control de seguretat escrit en comentari no és un control: és una
 *   intenció. Esta porta convertix la intenció en mecànica.
 *
 * LLEIS
 *   F1 OIENT-SORD     `addEventListener('message', h)` on `h` no compara
 *                     `event.origin` contra res. Qualsevol finestra amb un
 *                     handle pot injectar-hi càrrega.
 *   F2 CRIT-OBERT     `postMessage(carrega, '*')`. Es difon a l'amfitrió que
 *                     siga. Si algú ens emmarca, ho rep tot.
 *   F3 CONTROL-MUT    línia comentada que conté una comprovació d'origen o
 *                     una nota de «canviar en prod». Deute de seguretat
 *                     documentat i no aplicat.
 *   F4 RELE-SENSE-DATA  el camí de relé per emmagatzematge llig un `code`
 *                     d'OAuth sense comprovar-ne la frescor (`t`/`exp`).
 *
 * Pedra Seca: zero dependències, ESM, fail-closed.
 *
 *   node tooling/gates/tractor-postmissatge.mjs
 *   node tooling/gates/tractor-postmissatge.mjs --json
 */

import fs from 'node:fs';
import path from 'node:path';

const ARG = (n) => process.argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3) ?? null;
const ARREL = path.resolve(ARG('arrel') ?? process.cwd());
const JSON_OUT = process.argv.includes('--json');

const EXCLOU = /(^|\/)(node_modules|\.git|dist|build|coverage)(\/|$)/;
const EXT = new Set(['.js', '.jsx', '.mjs', '.ts', '.tsx', '.html']);

function fitxers(dir, acc = []) {
  const abs = path.join(ARREL, dir);
  if (!fs.existsSync(abs)) return acc;
  if (fs.statSync(abs).isFile()) { acc.push(dir); return acc; }
  for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
    const rel = path.posix.join(dir, e.name);
    if (EXCLOU.test(rel)) continue;
    if (e.isDirectory()) fitxers(rel, acc);
    else if (EXT.has(path.extname(e.name))) acc.push(rel);
  }
  return acc;
}

const TOTS = ['src', 'public', 'wordpress-plugin', 'index.html'].flatMap((d) => fitxers(d));
const infr = [];
const afig = (llei, on, detall) => infr.push({ llei, on, detall });
const linia = (t, i) => t.slice(0, i).split('\n').length;

/* Comprovacions d'origen que considerem vàlides dins d'un gestor. */
const VALIDA_ORIGEN = /\.origin\s*(!==|===|==|!=)|\borigins?\b\s*\.\s*(includes|has)\s*\(|ORIGENS?_?(PERMESOS|VALIDS|OK)/i;

for (const f of TOTS) {
  const t = fs.readFileSync(path.join(ARREL, f), 'utf8');

  /* ── F1 · oient sord ──
   * Busquem el gestor de 'message' i n'inspeccionem el cos. Dos formes:
   *   addEventListener('message', function nom(e) {...})
   *   addEventListener('message', this.nom.bind(this))  → busquem `nom(ev) {`
   */
  for (const m of t.matchAll(/addEventListener\(\s*['"]message['"]\s*,\s*([^)]+)\)/g)) {
    const ref = m[1].trim();
    let cos = null;
    const enLinia = /^(?:function\s*\w*\s*)?\(?\s*(\w+)\s*\)?\s*=>|^function/.test(ref);
    if (enLinia) {
      /* gestor anònim: agafem des del match fins a 1200 caràcters */
      cos = t.slice(m.index, m.index + 1200);
    } else {
      /* referència amb nom: this.handleMessage.bind(this → handleMessage.
       * El capturador de dalt talla al primer ')', així que ens quedem
       * només amb l'identificador i descartem qualsevol cua. */
      const nom = (/([A-Za-z_$][\w$]*)\s*(?:\.bind\b)?\s*$|([A-Za-z_$][\w$]*)/
        .exec(ref.replace(/^this\./, '').split('.bind')[0].trim()) ?? [])[1] ?? null;
      if (!nom) continue;
      const decl = new RegExp(`(?:^|\\n)\\s*(?:async\\s+)?(?:function\\s+)?${nom}\\s*\\(`, 'm');
      const d = decl.exec(t);
      if (d) cos = t.slice(d.index, d.index + 1200);
    }
    /* Un control comentat NO compta. Si no despullem els comentaris, el
     * propi «// Validar origen si escau: if (event.origin !== ...)» faria
     * passar la llei. Eixe és exactament el defecte que busquem. */
    const viu = (cos ?? '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .split('\n').filter((l) => !/^\s*(\/\/|\*)/.test(l)).join('\n');
    if (cos && !VALIDA_ORIGEN.test(viu)) {
      afig('F1', `${f}:${linia(t, m.index)}`,
        `oient de 'message' («${ref}») sense comparar event.origin: qualsevol finestra pot injectar-hi càrrega`);
    }
  }

  /* ── F2 · crit obert ── */
  for (const m of t.matchAll(/postMessage\s*\(([\s\S]{0,400}?)\)\s*[;,\n]/g)) {
    const args = m[1];
    if (/,\s*['"]\*['"]\s*$/.test(args.trim()) || /,\s*['"]\*['"]\s*\)/.test(args)) {
      afig('F2', `${f}:${linia(t, m.index)}`,
        "postMessage amb targetOrigin '*': si ens emmarquen, l'amfitrió hostil rep la càrrega sencera");
    }
  }

  /* ── F3 · control mut ── */
  t.split('\n').forEach((ln, i) => {
    const c = /^\s*(\/\/|\*|\/\*)/.test(ln);
    if (!c) return;
    if (/(event|e)\.origin\s*(!==|===)/.test(ln) || /canviar\s+'\*'|change\s+'\*'|en\s+prod/i.test(ln)) {
      afig('F3', `${f}:${i + 1}`, `control d'origen escrit com a comentari: «${ln.trim().slice(0, 88)}»`);
    }
  });

  /* ── F4 · relé sense data ── */
  if (/addEventListener\(\s*['"]storage['"]/.test(t) && /\bcode\b/.test(t)) {
    const bloc = t.slice(t.indexOf("addEventListener('storage'") >= 0
      ? t.indexOf("addEventListener('storage'") - 900 : 0, t.length);
    const gestor = /function\s+per?Storage[\s\S]{0,700}/.exec(t)?.[0] ?? '';
    if (gestor && !/\b(t|ts|exp|expira|caduca|Date\.now)\b/.test(gestor)) {
      afig('F4', f,
        "el camí de relé per 'storage' accepta un codi OAuth sense comprovar-ne la frescor: "
        + "una entrada d'una sessió anterior pot resoldre un intent nou");
    }
  }
}

/* ─────────────────────────────── Eixida ─────────────────────────────── */

const ETIQ = {
  F1: "OIENT-SORD · escolta 'message' i no mira d'on ve",
  F2: "CRIT-OBERT · postMessage a '*'",
  F3: 'CONTROL-MUT · seguretat escrita en comentari',
  F4: 'RELÉ-SENSE-DATA · codi OAuth sense frescor',
};

if (JSON_OUT) {
  console.log(JSON.stringify({ ok: infr.length === 0, infraccions: infr }, null, 2));
  process.exit(infr.length ? 1 : 0);
}

console.log('\n📡 TRACTOR DEL POSTMISSATGE — la frontera de veritat');
console.log('─'.repeat(72));
for (const l of ['F1', 'F2', 'F3', 'F4']) {
  const x = infr.filter((i) => i.llei === l);
  console.log(`\n${x.length === 0 ? '✅' : '❌'} ${l} · ${ETIQ[l]} — ${x.length}`);
  for (const i of x.slice(0, 8)) console.log(`      ${i.on}\n        ↳ ${i.detall}`);
}
console.log(`\n${'─'.repeat(72)}`);
console.log(`${TOTS.length} fonts revisades`);
if (infr.length) {
  console.error(`PARAT. ${infr.length} defecte(s) a la frontera. Açò ho veurà un tercer abans que nosaltres.`);
  process.exit(1);
}
console.log('PASSA. La frontera escolta amb trellat.');
process.exit(0);
