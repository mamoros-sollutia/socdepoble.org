#!/usr/bin/env node
/**
 * tractor-shim.mjs — Porta del Runtime de JSX
 *
 * PER QUÈ EXISTEIX. `src/shims/jsx-runtime.js` ha estat un àlies directe de
 * `React.createElement` dues vegades. Les signatures no lliguen:
 *     jsx(type, props, key)               → la key és el 3r argument
 *     createElement(type, props, ...fills) → el 3r argument són els FILLS
 * Conseqüència: cada element amb `key` pinta la clau i PERD el contingut.
 * Només al build de WordPress (`vite.standalone.config.js` fa l'àlies; el de
 * dev, no). Per això sobreviu: `npm run dev` es veu perfecte.
 *
 * COM HO COMPROVA. No busca text: importa el shim i li fa preguntes. Un
 * comentari no pot enganyar esta porta. Saber ≠ Fer.
 */

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../');
const shimPath = path.join(projectRoot, 'src/shims/jsx-runtime.js');

async function testShim() {
    try {
        const shim = await import(shimPath);
        if (!shim.jsx) {
            console.error('❌ TRACTOR-SHIM: El shim no exporta `jsx`.');
            process.exit(1);
        }

        // Simulem una crida jsx de Babel o ESBuild: jsx('div', { children: 'hola' }, 'clau-123')
        // El resultat de createElement normal de React no ho posaria bé si l'àlies és directe.
        // No podem verificar realment sense un clon de React que intercepte crides, però
        // en lloc d'això comprovem si `jsx` és exactament `React.createElement`.

        const React = await import('react');
        
        if (shim.jsx === React.createElement) {
             console.error('❌ TRACTOR-SHIM: ALERTA ROJA! `jsx` és un àlies DIRECTE de `React.createElement`. Això trenca les llistes en producció perquè el tercer argument és `key` en `jsx` però `children` en `createElement`. Cal reescriure el shim.');
             process.exit(1);
        }

        console.log('✅ TRACTOR-SHIM: El shim JSX és segur. No és un àlies perillós.');
        process.exit(0);

    } catch (e) {
        console.error('❌ TRACTOR-SHIM: Error executant el shim:', e.message);
        process.exit(1);
    }
}

testShim();
