const fs = require('fs');

const files = [
  '.agents/cervells/inicial_2026-08-24T21-26-15-657Z/core-trust-boundary/SKILL.md',
  '.agents/cervells/inicial_2026-08-24T21-26-15-657Z/core-verified-change/SKILL.md',
  '.agents/cervells/inicial_2026-08-24T21-26-15-657Z/multi-agent-review/SKILL.md'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/^purpose:\s*(.*?)\n(\s+)(.*)$/gm, (match, p1, p2, p3) => {
    if (p1 === '>' || p1 === '|') return match;
    return `purpose: >\n  ${p1}\n  ${p3}`;
  });
  fs.writeFileSync(file, content);
}
console.log("Fixed purpose.");
