import fs from 'fs';

const filepath = 'src/sections/text/pageContent.js';
let content = fs.readFileSync(filepath, 'utf-8');

const toComment = [
  "motor-a10-inmortal",
  "idb-guardian",
  "pwa-clean",
  "taller-trellat"
];

for (const id of toComment) {
  // We look for: <div >\n          <h4 ><strong><a href=\"https://socdepoble.org/auditoria/llavor/ID\">...</div>
  // Because it's escaped in JS, we need to be careful.
  const regex = new RegExp(`(<div[^>]*>\\\\n\\s*<h4[^>]*><strong[^>]*><a[^>]*${id}[^>]*>.*?<\\/div>)`, 'g');
  content = content.replace(regex, '<!-- $1 -->');
}

// També 'offline-first per WebRTC' a DevicesSection.jsx:388
// Però el que diu Claude és: "També hi ha DevicesSection.jsx:388 dient que la xarxa és Offline-First per WebRTC."
// Anem a arreglar-ho al pageContent primer.

fs.writeFileSync(filepath, content);
console.log('Comentades les seccions a pageContent.js');
