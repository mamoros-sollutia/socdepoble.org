import fs from 'fs';

const mortesText = fs.readFileSync('.sdp-paperera/classes-mortes.txt', 'utf8');
const indexMortesMatch = mortesText.match(/# src\/css\/index\.css — \d+\n([\s\S]*?)(?=\n#|$)/);
if (!indexMortesMatch) {
  console.log("No hi ha llista de index.css");
  process.exit(1);
}

const mortes = indexMortesMatch[1].split('\n').map(c => c.trim()).filter(Boolean);
let css = fs.readFileSync('src/css/index.css', 'utf8');

console.log(`Esborrant ${mortes.length} classes de index.css...`);

for (const cls of mortes) {
  // Regex to match `.classname { ... }` on a single line or multiple lines
  // We match from the class selector to the closing brace, ensuring it's not nested inside another block unless it's the whole block
  const regex = new RegExp(`\\.${cls}\\s*\\{[^}]*\\}\\n?`, 'g');
  css = css.replace(regex, '');
}

fs.writeFileSync('src/css/index.css', css);
console.log("Fet.");
