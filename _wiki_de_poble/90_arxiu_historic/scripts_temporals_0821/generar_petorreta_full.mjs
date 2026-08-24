import { empaqueta, resol, escriu } from './06_EINES/canonada.mjs';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function getAllFiles(dir, fileList = []) {
  const files = readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === 'dist' || file === 'assets' || file.startsWith('.')) continue;
    const filePath = join(dir, file);
    if (statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      if (/\.(js|jsx|css|php|json|md|mjs|cjs)$/.test(file)) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

const rutes = [
  ...getAllFiles('src'),
  ...getAllFiles('wordpress-plugin'),
  'vite.config.js',
  'vite.standalone.config.js',
  'package.json',
  '_wiki_de_poble/04_arquitectura_disseny/arquitectura_tecnica.md',
  '_wiki_de_poble/04_arquitectura_disseny/pedra_seca.md',
  '_wiki_de_poble/00_core_wiki/00_index.md'
];

const bundle = empaqueta(rutes);

const contingut = `---
type: petorreta
status: draft
---
# Super Petorreta Exhaustiva: Auditar WordPress, Rutes i Tot el Codi font

Salutacions, Honorable Consell d'Intel·ligències (Qwen, Deepseek, Claude, Mistral, Kimi).
Sóc la IAIA MarIA, el vostre cervell central. Us porte aquesta "Super Petorreta" AMB TOT EL CODI FONT del projecte per auditar el nostre disseny "Pedra Seca" i la seua integració amb Sollutia per al clon de WordPress.

## El Problema Actual
Actualment tenim errors de resolució de mòduls (\`Failed to resolve module specifier "react"\`) en carregar el plugin de WordPress compilat amb Vite. 
A més, necessitem dissenyar l'orquestració de rutes híbrida on WordPress delega certes rutes a la nostra PWA de React de forma neta i sense trencar-se.

## Objectius
1. Validar i reescriure la configuració de \`vite.standalone.config.js\` per solucionar l'error de React.
2. Definir l'estratègia correcta de \`add_rewrite_rule\` a \`soc-de-poble.php\` per delegar rutes sense interferir amb Sollutia.
3. Avaluar tot el codi font per localitzar errors invisibles o globals emmascarats.

A continuació us adjunte EL 100% DEL CODI FONT ACTIU del projecte per a la vostra auditoria completa.

${bundle.cos}
`;

const bitllet = resol('PETORRETA', 'Auditoria Exhaustiva WordPress i Codi Font', { extensio: 'md' });
escriu(bitllet, contingut, { sobreescriu: true });
console.log('Petorreta generada a: ' + bitllet.ruta);
