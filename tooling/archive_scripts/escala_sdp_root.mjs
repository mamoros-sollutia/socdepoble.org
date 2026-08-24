#!/usr/bin/env node
/**
 * escala_sdp_root.mjs — Pedra Seca
 *
 * Converteix un full global (index.css) en la variant escalada de l'estri
 * (injected_styles.css) sense els tres errors que té la còpia actual.
 *
 *   node escala_sdp_root.mjs entrada.css eixida.css
 *
 * PER QUÈ EXISTIX
 *
 * injected_styles.css és un fitxer DERIVAT: algú va prefixar index.css amb
 * `.sdp-root ` un dia i des d'aleshores els dos han divergit a mà. Tres
 * defectes del prefixat ingenu continuen dins:
 *
 *   1. `.sdp-root :root[data-theme="dark"]`
 *      :root és <html>. <html> no pot ser mai descendent de .sdp-root.
 *      El bloc sencer del tema fosc de l'estri MAI no s'aplica.
 *      Correcte: `:root[data-theme="dark"] .sdp-root`.
 *
 *   2. `.sdp-root body::after`, `.sdp-root body.sidebar-closed …`
 *      Mateix problema. El vel del calaix i el toggle d'escriptori
 *      són codi mort a l'estri.
 *      Correcte: body col·lapsa damunt de .sdp-root.
 *
 *   3. `@keyframes spin` i `@keyframes pulse` sense espai de noms.
 *      Els keyframes són globals al document per definició. Si Sollutia
 *      té el seu propi `spin`, guanya l'últim que es carrega i els nostres
 *      indicadors de càrrega es tornen imprevisibles.
 *      Correcte: prefixar el nom i totes les referències a animation.
 *
 * Zero dependències. Ni PostCSS ni res: analitzador de claus amb comptador
 * de profunditat, que és tot el que fa falta.
 */

import { readFileSync, writeFileSync } from 'node:fs';

const ARREL = '.sdp-root';
const AT_CONTENIDORS = new Set(['media', 'supports', 'layer', 'container', 'scope']);

/* ── Espai de noms dels keyframes ─────────────────────────────────── */
function nomenaKeyframes(css) {
  const noms = [...css.matchAll(/@(?:-\w+-)?keyframes\s+([\w-]+)/g)]
    .map((m) => m[1])
    .filter((n) => !n.startsWith('sdp-'));

  for (const nom of new Set(noms)) {
    const esc = nom.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    css = css.replace(new RegExp(`(@(?:-\\w+-)?keyframes\\s+)${esc}\\b`, 'g'), `$1sdp-${nom}`);
    css = css.replace(
      new RegExp(`(animation(?:-name)?\\s*:[^;{}]*?)\\b${esc}\\b`, 'g'),
      `$1sdp-${nom}`,
    );
  }
  return css;
}

/* ── Separadors que respecten parèntesis, claudàtors i cometes ────── */
function separa(text, tall) {
  const parts = [];
  let buf = '';
  let par = 0;
  let cor = 0;
  let cita = null;

  for (const c of text) {
    if (cita) { buf += c; if (c === cita) cita = null; continue; }
    if (c === '"' || c === "'") { cita = c; buf += c; continue; }
    if (c === '(') par += 1;
    if (c === ')') par -= 1;
    if (c === '[') cor += 1;
    if (c === ']') cor -= 1;

    const esTall = tall === ',' ? c === ',' : /\s/.test(c);
    if (esTall && par === 0 && cor === 0) {
      if (buf) { parts.push(buf); buf = ''; }
      continue;
    }
    buf += c;
  }
  if (buf) parts.push(buf);
  return parts;
}

/* ── Transformació d'un selector solt ─────────────────────────────── */
function escala(brut) {
  const sel = brut.trim();
  if (!sel || sel.startsWith(ARREL)) return sel;
  if (/^(?:from|to|\d+(?:\.\d+)?%)$/.test(sel)) return sel;   // dins de @keyframes

  // El tema viu a <html>: l'estri n'és descendent, no a l'inrevés.
  const tema = sel.match(/^:root(\[[^\]]*\])\s*([\s\S]*)$/);
  if (tema) {
    const resta = tema[2].trim();
    return `:root${tema[1]} ${ARREL}${resta ? ` ${resta}` : ''}`;
  }

  const toks = separa(sel, ' ');
  const cap = toks[0];

  // :root / html / body col·lapsen damunt de l'arrel de l'estri,
  // conservant el que porten enganxat (::after, .sidebar-closed, :has(…)).
  const m = cap.match(/^(?::root|html|body)([\s\S]*)$/);
  if (m && (m[1] === '' || /^[.:#[]/.test(m[1]))) {
    toks[0] = ARREL + m[1];
    return toks.join(' ');
  }

  return `${ARREL} ${sel}`;
}

/* ── Recorregut per blocs ─────────────────────────────────────────── */
function tancaBloc(css, obri) {
  let prof = 0;
  let i = obri;
  while (i < css.length) {
    if (css.startsWith('/*', i)) {
      const fi = css.indexOf('*/', i + 2);
      i = fi === -1 ? css.length : fi + 2;
      continue;
    }
    const c = css[i];
    if (c === '{') prof += 1;
    else if (c === '}') { prof -= 1; if (prof === 0) return i; }
    i += 1;
  }
  return css.length - 1;
}

function processa(css) {
  let eixida = '';
  let preludi = '';   // comentaris i espais previs
  let sel = '';
  let i = 0;

  while (i < css.length) {
    if (css.startsWith('/*', i)) {
      const fi = css.indexOf('*/', i + 2);
      const tall = fi === -1 ? css.slice(i) : css.slice(i, fi + 2);
      preludi += tall;
      i += tall.length;
      continue;
    }

    const c = css[i];

    if (c === '{') {
      const fi = tancaBloc(css, i);
      const cos = css.slice(i + 1, fi);
      const s = sel.trim();
      const espais = sel.slice(0, sel.length - sel.trimStart().length);

      if (s.startsWith('@')) {
        const nom = s.slice(1).split(/[\s({]/)[0].toLowerCase().replace(/^-\w+-/, '');
        const dins = AT_CONTENIDORS.has(nom) ? processa(cos) : cos;
        eixida += `${preludi}${espais}${s} {${dins}}`;
      } else {
        const nou = separa(s, ',').map(escala).join(',\n');
        eixida += `${preludi}${espais}${nou} {${cos}}`;
      }

      preludi = '';
      sel = '';
      i = fi + 1;
      continue;
    }

    if (!sel.trim() && /\s/.test(c)) { preludi += c; i += 1; continue; }

    sel += c;
    i += 1;
  }

  return eixida + preludi + sel;
}

/* ── Entrada ──────────────────────────────────────────────────────── */
const [, , entrada, eixida] = process.argv;
if (!entrada || !eixida) {
  console.error('ús: node escala_sdp_root.mjs entrada.css eixida.css');
  process.exit(1);
}

const font = readFileSync(entrada, 'utf8');
const resultat = processa(nomenaKeyframes(font));

const capcalera =
  `/* GENERAT PER escala_sdp_root.mjs a partir de ${entrada}\n` +
  `   NO EDITAR A MÀ. Tota divergència entre este fitxer i l'original\n` +
  `   és un error, no una decisió. Regenera'l. */\n\n`;

writeFileSync(eixida, capcalera + resultat);
console.log(`✔ ${eixida}  (${resultat.length} bytes)`);
