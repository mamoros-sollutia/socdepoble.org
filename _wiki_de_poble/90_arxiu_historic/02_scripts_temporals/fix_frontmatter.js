const fs = require('fs');

const files = [
  '.agents/cervells/inicial_2026-08-24T21-26-15-657Z/cog-deliberation/SKILL.md',
  '.agents/cervells/inicial_2026-08-24T21-26-15-657Z/core-bounded-action/SKILL.md',
  '.agents/cervells/inicial_2026-08-24T21-26-15-657Z/core-trust-boundary/SKILL.md',
  '.agents/cervells/inicial_2026-08-24T21-26-15-657Z/core-verified-change/SKILL.md',
  '.agents/cervells/inicial_2026-08-24T21-26-15-657Z/identity-iaia-voice/SKILL.md',
  '.agents/cervells/inicial_2026-08-24T21-26-15-657Z/multi-agent-review/SKILL.md',
  '.agents/cervells/inicial_2026-08-24T21-26-15-657Z/pedra-seca/SKILL.md',
  '_wiki_de_poble/12_actes/260828_1625_ACTA_SESSIO_Fase4_Superacio.md'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  // find description: <text>\n  <text>
  content = content.replace(/^description:\s*(.*?)\n(\s+)(.*)$/gm, (match, p1, p2, p3) => {
    if (p1 === '>' || p1 === '|') return match; // already handled
    return `description: >\n  ${p1}\n  ${p3}`;
  });
  fs.writeFileSync(file, content);
}
console.log("Fixed files.");
