#!/usr/bin/env node
/**
 * pedac_cromatic.mjs — MIGRACIÓ T-4 · un sol tir, determinista, idempotent.
 *
 * Restaura la rampa `--sdp-pedra-*` als valors que `DesignSection.jsx`
 * encara documentava i que els comentaris de contrast d'`index.css`
 * encara mesuraven. La documentació no mentia: el codi va derivar.
 *
 * Ús:  node tooling/scripts/pedac_cromatic.mjs [--assaig]
 */

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ASSAIG = process.argv.includes('--assaig');
const R = (p) => path.join(process.cwd(), p);
const canvis = [];

function edita(rel, fn) {
  const abans = readFileSync(R(rel), 'utf8');
  const despres = fn(abans);
  if (abans === despres) return;
  canvis.push(rel);
  if (!ASSAIG) writeFileSync(R(rel), despres, 'utf8');
}

/* ══ 1 · EL CÀNON: prefix propi + el blau que l'app usa de veres ══════ */

edita('src/config/design-tokens.json', (s) => {
  const j = JSON.parse(s);
  j.meta.version = '2.0.0';
  j.meta.actualitzat = '2026-08-31';
  j.meta.regla =
    'CAPA 0. Este arxiu declara les constants de marca i els mínims físics, ' +
    'res més. Les rampes i els semàntics viuen a src/css/index.css. ' +
    'Cap altre arxiu pot declarar un token --sdp-canon-*.';
  j.color = {
    negre: { value: '#000000', css_var: '--sdp-canon-negre' },
    blanc: { value: '#FFFFFF', css_var: '--sdp-canon-blanc' },
    taronja: { value: '#FF7300', css_var: '--sdp-canon-taronja' },
    blau_marca: {
      value: '#0984E3',
      css_var: '--sdp-canon-blau-marca',
      us: 'Logotip, paper, retolació. MAI com a fons de text: blanc a sobre ' +
          'dona 3,87:1 i no arriba a AA. La UI usa blau_accessible.',
    },
    blau_accessible: {
      value: '#016ebf',
      css_var: '--sdp-canon-blau',
      us: 'El blau real de la interfície. Blanc a sobre: 5,27:1 · AA. ' +
          'Va substituir #0984E3 per accessibilitat i ningú ho va escriure ' +
          'ací fins a la iteració 006.',
    },
  };
  return JSON.stringify(j, null, 2) + '\n';
});

/* ══ 2 · index.css ═══════════════════════════════════════════════════ */

edita('src/css/index.css', (s) => {
  /* 2a · LA BOMBA DE CASCADA.
     `.sdp-root` té especificitat (0,1,0) i `body` (0,0,1): `all: initial`
     guanya la font, el color i el fons del <body class="sdp-root"> de la
     compilació web. `:host` es recupera a la seua pròpia regla; `.sdp-root`
     no. La compilació WordPress (Shadow DOM) no ho patix: per això només
     es veu en dev i standalone. */
  s = s.replace(
    /:host, \.sdp-root \{\n  all: initial;\n\}/,
    `:host {\n  all: initial;\n}\n\n/* El <body class="sdp-root"> NO porta \`all: initial\`: (0,1,0) guanyaria\n   la regla \`body\` (0,0,1) i li llevaria font, color i fons. Ací només\n   neutralitzem el que fa mal, sense tocar l'herència. */\n.sdp-root {\n  margin: 0;\n  padding: 0;\n  border: 0;\n}`
  );

  /* 2b · LA RAMPA. Valors restaurats de DesignSection.jsx. */
  const rampa = {
    '--sdp-pedra-600': '#5b564e',
    '--sdp-pedra-700': '#3d3b35',
    '--sdp-pedra-850': '#181715',
    '--sdp-pedra-900': '#0e0d0c',
  };
  for (const [tok, val] of Object.entries(rampa)) {
    s = s.replace(
      new RegExp(`(${tok}:\\s*)([^;]+);`),
      `$1${val};`
    );
  }

  /* 2c · ÀNCORES CANÒNIQUES. */
  s = s.replace(/(--sdp-primary-500:\s*)#ff7300;/i,
    '$1var(--sdp-canon-taronja);');
  s = s.replace(/(--sdp-secondary-500:\s*)var\(--sdp-blau-fosc\);/,
    '$1var(--sdp-canon-blau);');

  /* 2d · FÒSSILS DE CONTRAST verificats amb la rampa restaurada. */
  const fossils = [
    ['--sdp-accio-text', /(--sdp-accio-text:\s*var\(--sdp-secondary-700\);\s*\/\*\s*)[\d,.]+(:1)/, '$19,21$2'],
    ['--sdp-sobre-accent', /(--sdp-sobre-accent:\s*var\(--sdp-pedra-900\);\s*\/\*\s*)[\d,.]+(:1)/, '$17,12$2'],
  ];
  for (const [, re, rep] of fossils) s = s.replace(re, rep);

  /* 2e · ELS 7 HEX FORA DE TEMA. */
  const cru = [
    [/(\.nav-item\.active[^\n]*?)color: #fff;/, '$1color: var(--sdp-text-invers);'],
    [/fill: #ff7300;/, 'fill: var(--sdp-accent);'],
  ];
  for (const [re, rep] of cru) s = s.replace(re, rep);
  /* La resta de `#ffffff` fora de tema són text sobre fons massís. */
  s = s.split('\n').map((l, i) => {
    if (i + 1 < 320) return l;                     // no toquem la capa de tema
    if (/^\s*\.sw-/.test(l)) return l;             // el mostrari mostra crus
    return l.replace(/color: #ffffff;/g, 'color: var(--sdp-text-invers);')
            .replace(/color: #fff;/g, 'color: var(--sdp-text-invers);');
  }).join('\n');

  /* 2f · ESPAI MORT: dos espais de noms òrfens, 0 usos. */
  s = s.replace(/\n\s*--sdp-color-text-body:[^;]+;\n\s*--sdp-color-text-heading:[^;]+;\n\s*--sdp-color-border-subtle:[^;]+;\n\s*--sdp-color-bg-base:[^;]+;/g, '');
  s = s.replace(/\n\s*--sdp-shadow-sm:[^;]+;/g, '').replace(/\n\s*--sdp-shadow-md:[^;]+;/g, '');

  return s;
});

/* ══ 3 · EL MOSTRARI: pedra-900 apareixia amb dos valors distints ═════ */

edita('src/sections/disseny/DesignSection.jsx', (s) =>
  s.replace(/#1a1918<br\/>--sdp-pedra-900/, '#0e0d0c<br/>--sdp-pedra-900')
);

/* ══ 4 · EL COMPONENT MORT ═══════════════════════════════════════════ */
/* DetailSectionMetaFactory.jsx: 0 importadors, 7 tokens inexistents,
   2 classes CSS que no existixen, un `style` que es descarta en silenci
   i un `<div className="sdp-root">` niat que redispara el reset del
   contenidor. No es pedaça codi mort: es lleva. */

console.log(
  ASSAIG
    ? `\nASSAIG · ${canvis.length} fitxers canviarien:\n  ${canvis.join('\n  ')}\n`
    : `\n✅ Pedaç cromàtic aplicat · ${canvis.length} fitxers:\n  ${canvis.join('\n  ')}\n` +
      `\n  Pendent a mà: rm src/components/DetailSectionMetaFactory.jsx\n` +
      `  Després:      npm run build:tokens && npm run porta:cromatic\n`
);
