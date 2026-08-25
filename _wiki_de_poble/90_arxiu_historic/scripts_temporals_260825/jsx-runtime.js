/**
 * src/shims/jsx-runtime.js — runtime JSX automàtic
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * PER QUÈ EXISTIX ESTE FITXER
 *
 * La versió anterior eren quatre línies:
 *
 *     export const jsx  = React.createElement;
 *     export const jsxs = React.createElement;
 *
 * I eren quatre línies catastròfiques. Les dos signatures no coincidixen:
 *
 *     jsx(type, props, key)              ← props INCLOU children; key és 3r arg
 *     createElement(type, config, ...children)   ← el 3r arg és un FILL
 *
 * Delegar l'una a l'altra fa que la clau es convertisca en el contingut.
 * Verificat amb React de veres sobre `<li key="poble-1">La Torre de les
 * Maçanes</li>`:
 *
 *     ESPERAT   key=poble-1  children="La Torre de les Maçanes"
 *     OBTINGUT  key=null     children="poble-1"
 *
 * Conseqüència: tot element amb `key` dins d'un `.map()` — pobles, mercat,
 * mur, notes, xat, multimèdia — pintava el seu identificador intern en lloc
 * del text, i perdia la identitat de reconciliació (remuntatge complet a
 * cada render i pèrdua de focus als camps de formulari).
 *
 * A més faltava `jsxDEV`, que el runtime automàtic exigix en mode dev.
 */

import * as React from 'react';

const { createElement, Fragment: ReactFragment } = React;

/**
 * Tradueix la signatura del runtime automàtic a la de `createElement`.
 *
 * - `children` ix de props i passa a la posició de fills.
 * - `key` entra dins de la config, que és d'on `createElement` l'extrau.
 * - `ref` es queda a la config: `createElement` també l'extrau d'allí.
 */
function construir(tipus, props, clau) {
  const { children, ...resta } = props ?? {};

  if (clau !== undefined) resta.key = clau;

  return children === undefined
    ? createElement(tipus, resta)
    : createElement(tipus, resta, children);
}

export function jsx(tipus, props, clau) {
  return construir(tipus, props, clau);
}

export function jsxs(tipus, props, clau) {
  return construir(tipus, props, clau);
}

/**
 * Mode de desenvolupament. React li passa arguments extra
 * (`fillsEstatics`, `origen`, `self`) que `createElement` no usa; els
 * acceptem per compatibilitat de signatura i els ignorem.
 */
export function jsxDEV(tipus, props, clau /*, fillsEstatics, origen, self */) {
  return construir(tipus, props, clau);
}

export const Fragment = ReactFragment;
