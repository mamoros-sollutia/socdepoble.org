import fs from 'fs';
import path from 'path';

const files = [
  'src/components/ui/PillToggle.jsx',
  'src/components/ui/index.js',
  'src/sections/disseny/DesignSection.jsx',
  'src/sections/disseny/DesignSectionContent.jsx',
  'src/sections/mur/MurSection.jsx',
  'src/css/index.css',
  'src/css/components.css'
];

let output = '# MINI-BUNDLE PER A Z\n\n';

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  output += `## FITXER: ${file}\n\`\`\`${file.endsWith('.css') ? 'css' : 'jsx'}\n${content}\n\`\`\`\n\n`;
}

fs.writeFileSync('_wiki_de_poble/04_ESCRIPTORI/260912_1320_MINI_BUNDLE_Z.md', output);
console.log('Mini bundle creat per a Z.');
