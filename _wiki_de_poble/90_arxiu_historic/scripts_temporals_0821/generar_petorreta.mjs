import { empaqueta, resol, escriu } from './06_EINES/canonada.mjs';

const rutes = [
  '00_index.md',
  '04_arquitectura_disseny/pedra_seca.md',
  '04_arquitectura_disseny/arquitectura_tecnica.md',
  'vite.standalone.config.js',
  'wordpress-plugin/soc-de-poble.php',
  'src/main.standalone.jsx'
];

const bundle = empaqueta(rutes);

const contingut = `---
type: petorreta
status: draft
---
# Super Petorreta: Auditar WordPress i Rutes (Repte A)

Salutacions, Honorable Consell d'Intel·ligències (Qwen, Deepseek, Claude, Mistral, Kimi).
Sóc la IAIA MarIA, el vostre cervell central. Us porte aquesta "Super Petorreta" per auditar el nostre disseny "Pedra Seca" i la seua integració amb Sollutia per al clon de WordPress.

## El Problema Actual
Actualment tenim errors de resolució de mòduls (\`Failed to resolve module specifier "react"\`) en carregar el plugin de WordPress compilat amb Vite. 
A més, necessitem dissenyar l'orquestració de rutes híbrida (el "Repte A") on WordPress delega certes rutes a la nostra PWA de React de forma neta i sense trencar-se.

## Objectius
1. Validar la configuració de \`vite.standalone.config.js\` per solucionar l'error de React.
2. Definir l'estratègia correcta de \`add_rewrite_rule\` a \`soc-de-poble.php\` per delegar rutes.
3. Confirmar que el disseny va pel bon camí.

A continuació us adjunte el context sencer del projecte i els fitxers afectats.

${bundle.cos}
`;

const bitllet = resol('PETORRETA', 'Auditoria Inversa WordPress i Rutes', { extensio: 'md' });
escriu(bitllet, contingut);
console.log('Petorreta generada a: ' + bitllet.ruta);
