import fs from 'fs';
import path from 'path';

const skillsDir = '.agents/skills';
const dirs = fs.readdirSync(skillsDir).filter(f => fs.statSync(path.join(skillsDir, f)).isDirectory());

for (const dir of dirs) {
  const file = path.join(skillsDir, dir, 'SKILL.md');
  if (!fs.existsSync(file)) continue;
  
  let content = fs.readFileSync(file, 'utf8');
  
  // Afegeix tags si no n'hi ha
  if (content.includes('---') && !content.includes('tags:')) {
    content = content.replace(/---\n([\s\S]*?)\n---/, (match, p1) => {
      return `---\n${p1}\ntags:\n  - agent\n  - skill\n---`;
    });
  }
  
  // Afegeix ancoratge si no hi és
  if (!content.includes('[[00_INDEX_SKILLS')) {
    content += '\n\n## Ancoratge de la Wiki\n- Aquesta skill penja de: [[00_INDEX_SKILLS]]\n';
  }
  
  fs.writeFileSync(file, content);
}
console.log('Skills actualitzats amb tags i ancoratges!');
