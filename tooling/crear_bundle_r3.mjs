import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const arrel = process.cwd();
const files = [
  'src/data/backendPort.js',
  'src/data/outbox.js',
  'src/data/sincronitzador.js',
  'src/PedraSecaEmbed.jsx',
  'src/app/AppDataContext.jsx',
  'src/config/app.js',
  'src/config/sections.js',
  'src/config/theme.js',
  'src/config/storage.js',
  'src/config/i18n.js',
  '.agents/skills/trellat/SKILL.md',
  '.agents/LEDGER.md',
  'tooling/preflight.mjs',
  '.agents/hooks/verify.mjs'
];

let bundle = `# BUNDLE AUDITORIA RONDA 3 - SÓC DE POBLE\n\n`;
bundle += `Aquest bundle conté el nucli estratègic Offline-First (backendPort, outbox, sincronitzador), l'arrel de l'embed, i les noves Portes Mecàniques (Skill Trellat, LEDGER i preflight).\n\n`;

for (const f of files) {
  try {
    const text = readFileSync(join(arrel, f), 'utf8');
    bundle += `\n\n--- FITXER: ${f} ---\n\`\`\`javascript\n${text}\n\`\`\`\n`;
  } catch (e) {
    bundle += `\n\n--- FITXER: ${f} ---\n[ERROR LLEGINT EL FITXER]\n`;
  }
}

writeFileSync(join(arrel, '_wiki_de_poble/05_Escriptori_Soc_de_Poble/260828_1410_BUNDLE_Auditoria_Ronda_3.md'), bundle, 'utf8');
console.log('Bundle Ronda 3 creat.');
