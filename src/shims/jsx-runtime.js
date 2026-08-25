/**
 * src/shims/jsx-runtime.js — pont entre el runtime automàtic de JSX i `wp.element`.
 *
 * PER QUÈ EXISTEIX. Al build standalone, React és extern i es mapa a `wp.element`
 * (vegeu `vite.standalone.config.js`). `wp.element` NO exposa `react/jsx-runtime`,
 * així que cal reconstruir-lo damunt de `createElement`.
 *
 * PER QUÈ NO ÉS UN ÀLIES DIRECTE. Les signatures no són compatibles:
 *     jsx(type, props, key)              → la key és el 3r argument
 *     createElement(type, props, ...fills) → el 3r argument són els FILLS
 * Fer `export const jsx = React.createElement` fa que la key entre com a fill
 * i sobreescriga `props.children`. Resultat mesurat: cada <li> d'una llista
 * pintava la seua key i perdia el contingut. Regressió del 25/08/2026.
 *
 * NO TORNES A SIMPLIFICAR AÇÒ SENSE AVISAR AL CONSELL.
 */
import * as React from "react";

export function jsx(type, config, key) {
    const props = { ...config };
    if (key !== undefined) {
        props.key = key;
    }
    const children = props.children;
    delete props.children;
    
    if (children === undefined) {
        return React.createElement(type, props);
    } else if (Array.isArray(children)) {
        return React.createElement(type, props, ...children);
    } else {
        return React.createElement(type, props, children);
    }
}

const Fragment = React.Fragment;
export { jsx as jsxs, Fragment, jsx as jsxDEV };
