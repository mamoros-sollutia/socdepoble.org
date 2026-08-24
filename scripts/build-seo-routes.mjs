import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Llegim les rutes base de sections.js de manera molt simple
const sectionsContent = fs.readFileSync(path.join(rootDir, 'src', 'config', 'sections.js'), 'utf8');

const routes = {};
const aliases = {
  // Alias bàsics per evitar trencaments si algú escriu l'arrel o rutes antigues
  '': 'pobles',
  'inici': 'pobles',
  'inicio': 'pobles',
  'home': 'pobles'
};

// Extraure { id, path, label }
const regex = /path:\s*'\/([^']+)',\s*label:\s*'([^']+)'/g;
let match;
while ((match = regex.exec(sectionsContent)) !== null) {
  const routePath = match[1]; // ex: 'chat'
  const title = match[2];     // ex: 'Xat'
  
  routes[routePath] = {
    status: 200,
    index: true,
    title: `${title} — Sóc de Poble`,
    description: `Pàgina de ${title} de la plataforma Sóc de Poble.`,
    type: 'website',
    image: '/assets/system/ui/logo-socdepoble-cuadrat-verd.svg',
    jsonLd: {
      '@type': 'WebPage',
      'name': `${title} — Sóc de Poble`
    }
  };
}

// Afegim suport explícit per algunes subrutes detall que PHP ha de poder resoldre
const detailRoutes = ['poblacio', 'arbres'];
for (const detail of detailRoutes) {
  routes[detail] = {
    status: 200,
    index: true,
    title: `Detall de ${detail} — Sóc de Poble`,
    description: `Consulta el detall de ${detail} a Sóc de Poble.`,
    type: 'website'
  };
}

const manifest = { routes, aliases };

const pluginDistDir = path.join(rootDir, 'wordpress-plugin', 'dist');
if (!fs.existsSync(pluginDistDir)) {
  fs.mkdirSync(pluginDistDir, { recursive: true });
}

fs.writeFileSync(
  path.join(pluginDistDir, 'seo-routes.json'),
  JSON.stringify(manifest, null, 2),
  'utf8'
);

console.log('✅ seo-routes.json generat correctament.');
