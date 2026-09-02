import fs from 'node:fs';
import path from 'node:path';

const files = [
  '.agents/BIOS.md',
  '.agents/BASELINE.md',
  '.agents/index.md',
  '.agents/ESTAT.md',
  '.agents/BOOTSTRAP.md',
  '.agents/rules/00_BIOS_COGNITIU.md',
  '.agents/LEDGER.md',
  '.agents/AGENTS.md',
  '.agents/cervells/placeholder.md',
  '.agents/PROTOCOL_PETORRETA.md',
  '.agents/PROFILE.md'
];

for (const file of files) {
  const filePath = path.resolve(file);
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.startsWith('---')) {
    const title = path.basename(file, '.md').replace(/_/g, ' ');
    const frontmatter = `---
tipus: document
estat: canonic
description: ${title}
---
`;
    fs.writeFileSync(filePath, frontmatter + content);
    console.log(`Added frontmatter to ${file}`);
  } else {
    console.log(`${file} already has frontmatter`);
  }
}
