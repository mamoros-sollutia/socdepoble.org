import fs from 'fs';
import path from 'path';

const deute = JSON.parse(fs.readFileSync('.estucat-deute.json', 'utf-8'));
const orfes = new Set(deute.orfes.filter(o => o.startsWith('src/css/legacy-components.css::')).map(o => o.split('::')[1]));

let legacyCss = fs.readFileSync('src/css/legacy-components.css', 'utf-8');
const rootRules = legacyCss.match(/:root\s*{[^}]*}/g) || [];
let newLegacyCss = legacyCss;

// A regex to match CSS blocks
const blockRegex = /([^{]+)\s*\{([^}]*)\}/g;
let match;
let aliveCss = "/* ── TRASPASAT DE legacy-components.css ── */\n";
let totalMoved = 0;

while ((match = blockRegex.exec(legacyCss)) !== null) {
  const selector = match[1].trim();
  const content = match[2].trim();
  
  // Skip :root which is empty or we don't care
  if (selector === ':root') continue;
  
  // Skip comments in the selector (rudimentary check)
  if (selector.startsWith('/*')) continue;
  
  // Check if it's empty
  if (content === '') continue; // it's an empty rule
  
  // Check if it's an orphan
  // We extract class names
  const classMatches = selector.match(/\.[a-zA-Z0-9_-]+/g) || [];
  let isAlive = false;
  
  // If it doesn't have any classes, it's a tag selector, keep it? 
  if (classMatches.length === 0) {
     isAlive = true;
  } else {
    // If AT LEAST ONE class is NOT in orfes, it's alive
    for (const cls of classMatches) {
       const cleanClass = cls.replace('.', '');
       if (!orfes.has('.' + cleanClass) && !orfes.has(cleanClass)) {
         isAlive = true;
       }
    }
  }
  
  if (isAlive) {
    aliveCss += `${selector} {\n  ${content}\n}\n\n`;
    totalMoved++;
  }
}

console.log(`Moved ${totalMoved} alive rules.`);
fs.appendFileSync('src/css/index.css', '\n' + aliveCss);

// Delete legacy-components.css
fs.unlinkSync('src/css/legacy-components.css');

// Remove import from index.css
let indexCss = fs.readFileSync('src/css/index.css', 'utf-8');
indexCss = indexCss.replace(/@import url\('\.\/legacy-components\.css'\);\n?/g, '');
fs.writeFileSync('src/css/index.css', indexCss);

console.log('Done purging legacy-components.css');
