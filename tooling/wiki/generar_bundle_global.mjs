import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const wikiRoot = path.resolve(__dirname, '../../');
const repoRoot = path.resolve(wikiRoot, '../');

const dirs = [
  path.join(repoRoot, '.agents'),
  path.join(repoRoot, 'src'),
  path.join(repoRoot, '.githooks'),
  path.join(repoRoot, '.sdp-reflex'),
  path.join(repoRoot, 'scripts'),
  path.join(wikiRoot, '00_SER_Brain_Identitat'),
  path.join(wikiRoot, '01_SABER_Cultura_Coneixement'),
  path.join(wikiRoot, '02_ACTUAR_Maquina_Tecnica'),
  path.join(wikiRoot, '03_GOVERNAR_Normativa_Regles')
];

let bundle = '# MEGA-BUNDLE DE LA MÀQUINA TÈCNICA I SISTEMA OPERATIU (SÓC DE POBLE)\n\n';
bundle += 'Aquest document conté tot el codi genètic, scripts, regles i skills de la IAIA MarIA per a la seua auditoria pel Consell.\n\n';

function traverse(currentPath) {
  if (!fs.existsSync(currentPath)) return;
  const stat = fs.statSync(currentPath);
  if (stat.isDirectory()) {
    if (currentPath.includes('05_Escriptori_Soc_de_Poble') || currentPath.includes('04_ARXIU_Documents_Historics')) return;
    fs.readdirSync(currentPath).forEach(file => traverse(path.join(currentPath, file)));
  } else if (currentPath.endsWith('.md') || currentPath.endsWith('.mjs') || currentPath.endsWith('.js') || currentPath.endsWith('.jsx') || currentPath.endsWith('.ts') || currentPath.endsWith('.tsx') || currentPath.endsWith('.css') || currentPath.endsWith('.json')) {
    bundle += `\n\n--------------------------------------------------\n`;
    bundle += `## FITXER: ${path.relative(repoRoot, currentPath)}\n`;
    bundle += `--------------------------------------------------\n\n`;
    try {
      bundle += fs.readFileSync(currentPath, 'utf-8');
    } catch (e) {
      bundle += `[Error reading file: ${e.message}]`;
    }
  }
}

for (const dir of dirs) {
  traverse(dir);
}

const rootFiles = ['package.json', 'vite.config.js', 'index.html', '.gitignore'];
for (const file of rootFiles) {
  const filePath = path.join(repoRoot, file);
  if (fs.existsSync(filePath)) {
    bundle += `\n\n--------------------------------------------------\n`;
    bundle += `## FITXER: ${file}\n`;
    bundle += `--------------------------------------------------\n\n`;
    try {
      bundle += fs.readFileSync(filePath, 'utf-8');
    } catch (e) {
      bundle += `[Error reading file: ${e.message}]`;
    }
  }
}

const pad = (n) => n.toString().padStart(2, '0');
const now = new Date();
const ts = `${now.getFullYear().toString().slice(2)}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`;

const bundleName = `${ts}_BUNDLE_Sistema_Operatiu_IAIA_MarIA_Complet.md`;
const outPath = path.join(wikiRoot, '05_Escriptori_Soc_de_Poble', bundleName);

fs.writeFileSync(outPath, bundle, 'utf-8');
console.log(bundleName);
