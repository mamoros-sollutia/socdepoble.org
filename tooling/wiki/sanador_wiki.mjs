/* eslint-disable no-unreachable */
import fs from 'node:fs';
import path from 'node:path';

throw new Error("🚨 [SDP-LOCK] Aquest mutador (sanador_wiki.mjs) està bloquejat per la Llei de Pedra Seca. Tota mutació cega està prohibida. 🚨");

const WIKI_DIR = '.'; // Ara explora tota l'arrel de socdepoble.org
const IGNORED_DIRS = ['.obsidian', '.quarantena-260830', '.git', 'node_modules', 'dist', 'scratch', 'assets'];
const IGNORED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.ico', '.pdf', '.woff', '.woff2', '.ttf'];
const ROOT_INDICES = ['00_INDEX', '00_INDEX_ARXIU', '00_INDEX_ESCRIPTORI', '00_INDEX_MIRROR', '00_INDEX_Satel_lits'];

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    if (IGNORED_DIRS.includes(file.name) || (file.name.startsWith('.') && file.name !== '.agents')) continue;
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else {
      const ext = path.extname(file.name).toLowerCase();
      if (!IGNORED_EXTENSIONS.includes(ext) && !file.name.startsWith('.DS_Store')) {
        fileList.push(fullPath);
      }
    }
  }
  return fileList;
}

const files = getAllFiles(WIKI_DIR);
console.log(`[Sanador] Analitzant ${files.length} fitxers en tota l'arrel...`);

const fileNames = new Set(files.map(f => path.basename(f, '.md')));
const linkRegex = /\[\[(.*?)(?:\|.*?)?\]\]/g;
const allLinks = new Map();

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    let target = match[1].trim();
    target = path.basename(target).replace(/\.md$/, '');
    
    if (!allLinks.has(target)) {
      allLinks.set(target, []);
    }
    allLinks.get(target).push(file);
  }
}

const brokenLinks = [];
for (const [target, sources] of allLinks.entries()) {
  if (!fileNames.has(target)) {
    brokenLinks.push({ target, sources });
  }
}

const orphans = [];
for (const file of files) {
  const base = path.basename(file, '.md');
  if (!allLinks.has(base) && !ROOT_INDICES.includes(base)) {
    orphans.push(file);
  }
}

console.log('────────────────────────────────────────────────────────────────────────');
if (brokenLinks.length > 0) {
  console.log(`❌ S'han trobat ${brokenLinks.length} enllaços trencats:`);
  for (const bl of brokenLinks) {
    console.log(`  - [[${bl.target}]] (trobat a ${bl.sources.map(s => path.basename(s)).join(', ')})`);
  }
} else {
  console.log(`✅ 0 Enllaços trencats`);
}

const REVISAR_DIR = path.join('_wiki_de_poble', '90_historic', 'bancal_actiu');

console.log('────────────────────────────────────────────────────────────────────────');
if (orphans.length > 0) {
  console.log(`❌ S'han trobat ${orphans.length} fitxers orfes. Movent-los a 90_revisar...`);
  if (!fs.existsSync(REVISAR_DIR)) {
    fs.mkdirSync(REVISAR_DIR, { recursive: true });
  }
  for (const orf of orphans) {
    const dest = path.join(REVISAR_DIR, path.basename(orf));
    fs.renameSync(orf, dest);
    console.log(`  - Mogut: ${orf} -> ${dest}`);
  }
} else {
  console.log(`✅ 0 Fitxers orfes`);
}
console.log('────────────────────────────────────────────────────────────────────────');

function removeEmptyDirectories(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  if (files.length > 0) {
    for (const file of files) {
      if (IGNORED_DIRS.includes(file) || (file.startsWith('.') && file !== '.agents')) continue;
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        removeEmptyDirectories(fullPath);
      }
    }
  }
  
  // Re-check after potential child deletion
  const filesAfter = fs.readdirSync(dir);
  const visibleFiles = filesAfter.filter(f => !(f.startsWith('.') && f !== '.agents') && f !== '.DS_Store');
  
  if (visibleFiles.length === 0 && dir !== WIKI_DIR && dir !== '.' && !IGNORED_DIRS.includes(path.basename(dir))) {
    console.log(`🧹 Esborrant carpeta buida: ${dir}`);
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

console.log('[Sanador] Netejant carpetes buides...');
removeEmptyDirectories(WIKI_DIR);
console.log('────────────────────────────────────────────────────────────────────────');

if (brokenLinks.length > 0) {
  throw new Error(`Sanador ha trobat ${brokenLinks.length} enllaços trencats. Resol-ho abans de continuar.`);
}
