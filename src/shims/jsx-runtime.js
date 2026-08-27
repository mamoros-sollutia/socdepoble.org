/**
 * src/shims/jsx-runtime.js — pont entre el runtime automàtic de JSX i `wp.element`.
 *
 * PER QUÈ EXISTEIX. Al build standalone React és extern i es mapa a `wp.element`
 * (vegeu `vite.standalone.config.js`). `wp.element` NO exposa `react/jsx-runtime`,
 * així que cal reconstruir-lo damunt de `createElement`.
 *
 * PER QUÈ NO ÉS UN ÀLIES DIRECTE. Les signatures no lliguen:
 *     jsx(type, props, key)               → la key és el 3r argument
 *     createElement(type, props, ...fills) → el 3r argument són els FILLS
 * `export const jsx = React.createElement` fa que la key entre com a fill i
 * sobreescriga props.children. Regressió mesurada del 25/08/2026.
 *
 * PER QUÈ NO ESPARRAMEM ELS FILLS. `createElement(t, p, ...fills)` amb una llista
 * d'un sol element torna props.children com a escalar, no com a llista. React
 * torna la llista. Passar-los dins de props preserva la paritat.
 *
 * NO TORNES A SIMPLIFICAR AÇÒ. `npm run porta:shim` t'aturarà.
 */
import * as React from 'react';

const HAS_OWN = Object.prototype.hasOwnProperty;

function crea(type, config, key) {
  const props = {};
  if (config) {
    for (const k in config) {
      if (HAS_OWN.call(config, k) && k !== 'children') props[k] = config[k];
    }
    if (HAS_OWN.call(config, 'children')) props.children = config.children;
  }
  if (key !== undefined) props.key = key;
  return React.createElement(type, props);
}

export const jsx = (type, config, key) => crea(type, config, key);
export const jsxs = (type, config, key) => crea(type, config, key);
export const jsxDEV = (type, config, key) => crea(type, config, key);
export const Fragment = React.Fragment;
