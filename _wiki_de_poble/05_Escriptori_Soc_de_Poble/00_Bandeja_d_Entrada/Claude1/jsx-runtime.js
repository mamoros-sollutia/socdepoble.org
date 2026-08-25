/**
 * jsx-runtime.js — shim del runtime automàtic de JSX sobre React classic.
 *
 * ⚠️  NO tornar a fer `export const jsx = React.createElement`.
 *
 * Les signatures NO són compatibles:
 *   jsx(tipus, props, key)              ← el 3r argument és la CLAU
 *   createElement(tipus, config, ...fills)  ← el 3r argument són els FILLS
 *
 * Delegar-hi directament fa que la clau ocupe el lloc dels fills: el contingut
 * real desapareix de la pantalla i en el seu lloc es pinta la clau. Afecta tot
 * element amb `key`, és a dir, cada llista de l'aplicació.
 *
 * Verificat contra react@18:
 *   jsx('li', {children:'La Torre de les Maçanes'}, 'poble-42')
 *     amb el shim trencat → key=null,        props={children:'poble-42'}
 *     amb aquest shim     → key='poble-42',  props={children:'La Torre…'}
 *
 * La porta L10 de tooling/gates/tractor-consell.mjs vigila este fitxer.
 */

import * as React from 'react';

const crea = (tipus, props, key) => {
  if (key === undefined) return React.createElement(tipus, props);
  return React.createElement(tipus, { ...props, key });
};

export const jsx = crea;
export const jsxs = crea;

/* El runtime automàtic en mode desenvolupament crida jsxDEV, no jsx.
   Sense este export, el dev server peta en arrancar. */
export const jsxDEV = (tipus, props, key) => crea(tipus, props, key);

export const Fragment = React.Fragment;
