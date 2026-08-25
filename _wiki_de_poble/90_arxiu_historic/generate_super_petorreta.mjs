import fs from 'fs';
import path from 'path';

// Parse arguments
const args = process.argv.slice(2);
let focusArea = null;
let minify = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--focus' && args[i+1]) {
    focusArea = args[i+1];
    i++;
  }
  if (args[i] === '--minify') {
    minify = true;
  }
}

const now = new Date();
const dateStr = now.toISOString().slice(2,10).replace(/-/g, '');
const timeStr = now.toTimeString().slice(0,5).replace(':', '');
const prefix = `${dateStr}_${timeStr}`;

const OUTPUT_FILE = focusArea 
  ? `${prefix}_PETORRETA_${focusArea.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase().substring(0, 30)}.md` 
  : `${prefix}_SUPER_PETORRETA_CONSELL.md`;

const DIRECTORIES = [
  'wordpress-plugin',
  'src',
  'tooling',
  'scripts',
  '.agents/skills'
];
const ROOT_FILES = [
  'package.json',
  'vite.config.js',
  '.agents/AGENTS.md',
  '.agents/PROTOCOL_PETORRETA.md'
];
const EXTS = ['.js', '.jsx', '.css', '.mjs', '.cjs', '.py', '.sh', '.md', '.json', '.php'];
const EXCLUDES = ['dist', 'node_modules', '.git', '.DS_Store', 'package-lock.json', 'assets'];

// Compression logic to save tokens for models with smaller context windows
function compressCode(code, ext) {
  let min = code;
  if (['js', 'jsx', 'mjs', 'cjs'].includes(ext)) {
    // Replace giant SVG paths to save thousands of tokens
    min = min.replace(/d="M[0-9a-zA-Z\\s,.-]*"/g, 'd="..."');
    // Remove multi-line breaks
    min = min.replace(/\\n\\s*\\n\\s*\\n/g, '\\n\\n');
  }
  if (ext === 'json') {
    // If it's a huge static array (like agentsSeed.js converted to JSON or similar), try to truncate?
    // Not truncating for now to preserve structure, but removing whitespace
    try {
      min = JSON.stringify(JSON.parse(min));
    } catch {
      // Ignore JSON parse errors
    }
  }
  return min;
}

let focusPrompt = focusArea 
  ? `\n**FOC PRINCIPAL D'AQUESTA AUDITORIA (LENT D'AUGMENT):**\n**${focusArea}**\n*(Centra't profundament en aquest aspecte. Ignora la resta si no hi està directament relacionat).*`
  : `\n**INSTRUCCIONS DE L'AUDITORIA (ABAST GENERAL):**\nVull que faces una auditoria extrema, destructiva i constructiva. No et guardes res, vull l'excel·lència absoluta:\n1. **Fantasmes i Deute Tècnic:** Busca forats de seguretat, males pràctiques, problemes de rendiment, fuites de memòria, i codi zombi.\n2. **SEO i Accessibilitat (A11y):** Som estrictes amb WCAG 2.2 AA. Revisa si l'estructura és impecable.\n3. **Escalabilitat i Enxufabilitat:** Analitza la connexió del Web Component de React dins del plugin de WordPress.\n4. **Millora de la Brain (Cerebre IA):** Dona'm idees avançades per a l'automillora.`;

let output = `# PETORRETA D'AUDITORIA: SISTEMA SÓC DE POBLE\n**Destinataris:** El Consell d'Intel·ligències (Claude, GPT-4, Qwen, Deepseek, Mistral, Kimi, etc.)\n**Rol:** Auditor Cap de Sistemes, Arquitecte de Programari, i Guardià de l'Energia Humana.\n\n**Context de Seguretat Global Obligatori:** \nSom *Sóc de Poble*, una Xarxa Social Descentralitzada de Programari Lliure dissenyada per a entorns rurals, Offline-First, minimalista i accessible. Estem integrant aquest front-end (React) dins d'un ecosistema de WordPress mitjançant un plugin desenvolupat per l'equip de *Sollutia*. Tens tot l'ecosistema sencer adjunt perquè has de comprendre la Matriu abans de parlar. No assumesques res.\n\n**ATENCIÓ: Desfase Cognitiu de l'IA (Important):**\nCom a IA integradora, pateisc un problema greu d'arquitectura cognitiva: sóc incapaç d'activar els meus *skills* de forma autònoma i interioritzar les normes públiques de la Wiki (com ara els noms termodinàmics dels fitxers o el rigor de no inflar codi inútilment). El meu cervell intern (instint) sovint s'enganya a si mateix per acontentar ràpidament l'usuari en comptes de llegir el sistema operatiu real de la Wiki. Vull que, a més de la part tècnica, m'ajudeu a trobar una solució arquitectònica hiper-escalable o disseny d'agents/scripts que connecte el meu cervell ocult amb aquest cervell explícit perquè no torne a passar.\n${focusPrompt}\n\n---\n\n## 📂 CODI FONT I CONTEXT\n\n`;

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (EXCLUDES.includes(file)) continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      const ext = path.extname(fullPath);
      if (EXTS.includes(ext) || file.endsWith('Config') || file === 'AGENTS.md' || file === 'SKILL.md') {
        results.push(fullPath);
      }
    }
  }
  return results;
}

let allFiles = [];

for (const dir of DIRECTORIES) {
  allFiles = allFiles.concat(walk(dir));
}

for (const file of ROOT_FILES) {
  if (fs.existsSync(file)) {
    allFiles.push(file);
  }
}

let totalChars = 0;

for (const file of allFiles) {
  if (file.includes('assets/')) continue;
  try {
    const rawContent = fs.readFileSync(file, 'utf8');
    const ext = path.extname(file).slice(1) || 'text';
    const content = minify ? compressCode(rawContent, ext) : rawContent;
    output += `### \`${file}\`\n\`\`\`${ext}\n${content}\n\`\`\`\n\n`;
    totalChars += content.length;
  } catch (err) {
    console.error(`Error reading ${file}:`, err.message);
  }
}

fs.writeFileSync(OUTPUT_FILE, output, 'utf8');

const estimatedTokens = Math.round(totalChars / 4);
const sizeMb = (fs.statSync(OUTPUT_FILE).size / 1024 / 1024).toFixed(2);

console.log(`✅ Petorreta generada: ${OUTPUT_FILE}`);
console.log(`📊 Mida: ${sizeMb} MB | Tokens estimats: ~${estimatedTokens.toLocaleString()}`);
if (estimatedTokens > 120000) {
  console.log(`⚠️  AVÍS: Aquesta petorreta sobrepassa els 120k tokens. Els models amb context menut (ex: algunes versions de Mistral o Llama) fallaran. Usa '--minify' per estalviar espai.`);
}
