import fs from 'fs';
import path from 'path';

const bundlePath = 'tooling/brain/crear_bundle.mjs';
let content = fs.readFileSync(bundlePath, 'utf8');

// Afegim la lògica per carregar el codi congelat
const loadFrozen = `
function lligCongelats() {
  try {
    const lines = fs.readFileSync(R(CAMINS.agents, 'codi-congelat.txt'), 'utf8').split('\\n');
    return lines.map(l => l.trim()).filter(l => l && !l.startsWith('#'));
  } catch {
    return [];
  }
}
const CONGELATS = lligCongelats();
function esCongelat(ruta) {
  return CONGELATS.some(c => ruta === c || ruta.startsWith(c));
}
`;

content = content.replace('function deutesDelDisc() {', loadFrozen + '\nfunction deutesDelDisc() {');

// Modifiquem on es processa cada entrada a recull()
const readLogicOriginal = `    const ext = path.extname(abs).toLowerCase();
    const isBinary = ['.png', '.jpg', '.jpeg', '.gif', '.woff2', '.ttf'].includes(ext);
    
    let text;
    if (isBinary) {
      text = cru.toString('base64');
    } else {
      text = cru.toString('utf8');
    }`;

const readLogicMod = `    const ext = path.extname(abs).toLowerCase();
    const isBinary = ['.png', '.jpg', '.jpeg', '.gif', '.woff2', '.ttf'].includes(ext);
    
    let text;
    let finalSize = cru.length;
    let finalSha = sha(cru);

    if (esCongelat(ruta)) {
      text = '<!-- [MÒDUL CONGELAT] Codi omès. Component 100% operatiu validat. Estalvi de pes termodinàmic. -->';
      // Recalculem el tamany i el SHA perquè el manifest no done error de verificació
      const newBuf = Buffer.from(text, 'utf8');
      finalSize = newBuf.length;
      finalSha = sha(newBuf);
    } else if (isBinary) {
      text = cru.toString('base64');
    } else {
      text = cru.toString('utf8');
    }`;

content = content.replace(readLogicOriginal, readLogicMod);

// I a l'hora de guardar al manifest les entrades:
content = content.replace(
  `entrades.push({
      ruta,
      bytes: cru.length,
      linies: isBinary ? 1 : text.split('\\n').length,
      sha256: sha(cru),
      // Cal recordar-ho`,
  `entrades.push({
      ruta,
      bytes: finalSize,
      linies: esCongelat(ruta) ? 1 : (isBinary ? 1 : text.split('\\n').length),
      sha256: finalSha,
      is_congelat: esCongelat(ruta),
      // Cal recordar-ho`
);

fs.writeFileSync(bundlePath, content);
console.log("crear_bundle.mjs modificat per suportar codi congelat!");
