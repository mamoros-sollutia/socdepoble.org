import fs from 'fs';
import path from 'path';

const skillsDir = '.agents/skills';
const dirs = fs.readdirSync(skillsDir).filter(f => fs.statSync(path.join(skillsDir, f)).isDirectory());

const replacements = [
  { regex: /\b(Sollutia)\b/g, replacement: '[[Sollutia]]' },
  { regex: /\b(Pedra Seca)\b/gi, replacement: '[[Pedra Seca]]' },
  { regex: /\b(Consell(?: d'IAs)?)\b/g, replacement: '[[consell.json|Consell]]' },
  { regex: /\b(React)\b/g, replacement: '[[React]]' },
  { regex: /\b(Tailwind(?:CSS)?)\b/g, replacement: '[[Tailwind]]' },
  { regex: /\b(Supabase)\b/g, replacement: '[[Supabase]]' },
  { regex: /\b(Linter)\b/g, replacement: '[[Linter]]' },
  { regex: /\b(Tractor(?:s)?)\b/gi, replacement: '[[Tractors|$1]]' },
  { regex: /\b(Frontmatter)\b/gi, replacement: '[[Frontmatter]]' },
  { regex: /\b(Escriptori)\b/g, replacement: '[[00_INDEX_ESCRIPTORI|Escriptori]]' },
];

let filesModified = 0;

for (const dir of dirs) {
  const file = path.join(skillsDir, dir, 'SKILL.md');
  if (!fs.existsSync(file)) continue;
  
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  for (const { regex, replacement } of replacements) {
    // Evitar substituir si ja està dins d'un enllaç [[...]]
    // Això es pot fer senzillament dividint pels enllaços i substituint només el text net
    const parts = content.split(/(\[\[.*?\]\])/);
    for (let i = 0; i < parts.length; i++) {
      if (!parts[i].startsWith('[[')) {
        parts[i] = parts[i].replace(regex, replacement);
      }
    }
    content = parts.join('');
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    filesModified++;
  }
}
console.log(`Skills enriquides amb links: ${filesModified}`);
