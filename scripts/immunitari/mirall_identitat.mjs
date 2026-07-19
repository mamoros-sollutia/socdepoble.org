#!/usr/bin/env node
/**
 * mirall_identitat.mjs - Reflex Nerviós
 * Sincronitza la identitat oculta de la IAIA (.agents/) amb el cervell visible de la Wiki.
 */
import fs from 'fs';
import path from 'path';

const REPO_ROOT = process.cwd();
const AGENTS_DIR = path.join(REPO_ROOT, '.agents');
const MIRROR_DIR = path.join(REPO_ROOT, '_wiki_de_poble/00_SER_Brain_Identitat/00_AGENTS_I_SKILLS_MIRROR');

// Assegurem que el directori mirall existeix
if (!fs.existsSync(MIRROR_DIR)) {
  fs.mkdirSync(MIRROR_DIR, { recursive: true });
}

console.log("🧠 Activant Reflex Nerviós: Sincronitzant Genotip al Graf...");

// Funció per afegir frontmatter si no en té
function asseguraFrontmatter(content, title, isSkill) {
  if (content.startsWith('---')) return content; // Ja en té
  
  const frontmatter = `---
estat: "canonic"
tipus: "${isSkill ? 'skill' : 'identitat'}"
description: "Mirall automàtic de ${title}"
temes: ["iaia-maria", "sistema"]
---
`;
  return frontmatter + '\n' + content;
}

let sincronitzats = 0;

// 1. Sincronitzem AGENTS.md i altres documents arrel
const arrelFiles = fs.readdirSync(AGENTS_DIR).filter(f => f.endsWith('.md'));
for (const file of arrelFiles) {
  const content = fs.readFileSync(path.join(AGENTS_DIR, file), 'utf8');
  const net = asseguraFrontmatter(content, file, false);
  fs.writeFileSync(path.join(MIRROR_DIR, file), net, 'utf8');
  sincronitzats++;
}

// 2. Sincronitzem les Skills
const skillsDir = path.join(AGENTS_DIR, 'skills');
if (fs.existsSync(skillsDir)) {
  const skills = fs.readdirSync(skillsDir);
  for (const skill of skills) {
    const skillPath = path.join(skillsDir, skill);
    if (fs.statSync(skillPath).isDirectory()) {
      const skillMd = path.join(skillPath, 'SKILL.md');
      if (fs.existsSync(skillMd)) {
        const content = fs.readFileSync(skillMd, 'utf8');
        const net = asseguraFrontmatter(content, `Skill: ${skill}`, true);
        // Guardem amb el nom de la skill perquè no es xafen els SKILL.md
        fs.writeFileSync(path.join(MIRROR_DIR, `SKILL_${skill}.md`), net, 'utf8');
        sincronitzats++;
      }
    }
  }
}

console.log(`🧠 Sincronització completada: ${sincronitzats} nodes reflectits a la Wiki.`);
