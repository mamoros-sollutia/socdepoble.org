#!/usr/bin/env node
/**
 * tractor-shim.mjs — Porta del Runtime de JSX (versió conductual)
 *
 * La versió anterior comprovava `shim.jsx === React.createElement`. Això només
 * atrapa l'àlies literal. Un embolcall d'una línia que reproduïx exactament el
 * mateix error passava la porta amb exit 0:
 *     export const jsx = (t, p, k) => React.createElement(t, p, k);
 * Esta versió no mira qui és la funció: la crida i li mira el resultat.
 * Verificada contra el shim bo (exit 0) i contra l'embolcall dolent (exit 1).
 */
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARREL = path.resolve(__dirname, '../../');
const RUTA = process.env.SHIM_PATH || path.join(ARREL, 'src/shims/jsx-runtime.js');
const errors = [];

try {
  const shim = await import(pathToFileURL(RUTA).href);

  for (const nom of ['jsx', 'jsxs', 'Fragment']) {
    if (!shim[nom]) errors.push(`El shim no exporta \`${nom}\`.`);
  }

  if (shim.jsx) {
    const a = shim.jsx('li', { children: 'Contingut' }, 'clau-123');
    if (a.key !== 'clau-123')
      errors.push(`key perduda: esperava 'clau-123', he obtingut ${JSON.stringify(a.key)}.`);
    if (a.props.children !== 'Contingut')
      errors.push(`FILLS CONTAMINATS PER LA KEY: props.children = ${JSON.stringify(a.props.children)}. És l'error del 25/08/2026.`);

    const b = shim.jsx('p', { children: 'Text' });
    if (b.props.children !== 'Text' || b.key !== null)
      errors.push("Sense key el shim altera l'element.");

    const c = (shim.jsxs || shim.jsx)('ul', { children: ['u'] }, 'k');
    if (!Array.isArray(c.props.children))
      errors.push(`jsxs amb un sol fill torna ${JSON.stringify(c.props.children)} en compte d'una llista: divergix del runtime real i trenca Children.map/count al build de WordPress.`);

    const d = shim.jsx('a', { href: '/x', className: 'sdp-enllac', children: 'anar' }, 'k2');
    if (d.props.href !== '/x' || d.props.className !== 'sdp-enllac')
      errors.push('El shim perd props.');
  }
} catch (e) {
  errors.push(`No s'ha pogut importar el shim: ${e.message}`);
}

if (errors.length) {
  console.error('❌ TRACTOR-SHIM: el runtime JSX no és equivalent al de React.');
  errors.forEach((e) => console.error(`   · ${e}`));
  process.exit(1);
}
console.log('✅ TRACTOR-SHIM: el runtime JSX es comporta com el de React (key, fills, llistes, props).');
process.exit(0);
