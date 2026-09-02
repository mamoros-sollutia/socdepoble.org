#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const skillsDir = resolve(process.cwd(), '.agents/skills');
const skills = readdirSync(skillsDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

const coreSkills = [
  'identity-iaia-core',
  'identity-iaia-voice',
  'trellat',
  'pedra-seca',
  'core-context-panic',
  'core-higiene-reflexa',
  'core-restauracio-segellada',
  'reflexio-previa'
];

for (const skill of skills) {
  const skillPath = join(skillsDir, skill, 'SKILL.md');
  try {
    let content = readFileSync(skillPath, 'utf8');
    const isCore = coreSkills.includes(skill);
    
    // Si ja té 'core:', el saltem (o ho actualitzem, però millor fer-ho si no hi és)
    if (!content.includes('\ncore:')) {
      const parts = content.split('---');
      if (parts.length >= 3) { // te frontmatter
        let frontmatter = parts[1];
        
        frontmatter = frontmatter.trimEnd();
        frontmatter += `\ncore: ${isCore}\n`;
        
        if (!isCore) {
          // Generem uns triggers per defecte basats en el nom
          frontmatter += `triggers_on: ["${skill.replace(/-/g, ' ')}"]\n`;
        }
        
        const newContent = `---${frontmatter}\n---` + parts.slice(2).join('---');
        writeFileSync(skillPath, newContent, 'utf8');
        console.log(`✅ Actualitzat: ${skill} (core: ${isCore})`);
      }
    } else {
       console.log(`ℹ️ Omes (ja té 'core:'): ${skill}`);
    }
  } catch (e) {
    console.error(`Error amb ${skill}:`, e.message);
  }
}
