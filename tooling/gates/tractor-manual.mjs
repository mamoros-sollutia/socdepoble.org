/* tractor-manual.mjs — porta mecànica del Manual Pedra Seca.
   Zero dependències. Falla tancat: si una llei bota, codi d'eixida 1. */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const CSS = './src/css/index.css';
const ARREL = './src';

const llista = (d) => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? llista(p) : (p.endsWith('.jsx') ? [p] : []);
});

let css = readFileSync('./src/css/index.css', 'utf8');
try { css += '\n' + readFileSync('./src/css/legacy-components.css', 'utf8'); } catch (e) {}
const definides = new Set([...css.matchAll(/\.([a-zA-Z_][\w-]*)/g)].map((m) => m[1]));
const fitxers = llista(ARREL);

const TAILWIND = /^(mb|mt|ml|mr|mx|my|p|px|py|pt|pb|gap|w|h|min-w|max-w|text|bg|border|rounded|flex|grid|grid-cols|space-y|space-x|font|leading|tracking|items|justify|shrink|grow|overflow|hover|focus|inline|block|hidden|absolute|relative|sticky|z|opacity|shadow|ring|cursor|select|sr)(-[\w./[\]#%-]+)?$|^(sm|md|lg|xl):/;

const lleis = [];
const infraccio = (llei, fitxer, detall) =>
  lleis.push({ llei, fitxer: fitxer.replace(ARREL, 'src'), detall });

let totalClasses = 0;
const orfes = new Map();

for (const f of fitxers) {
  const codi = readFileSync(f, 'utf8');
  const net = codi.replace(/\/\*[\s\S]*?\*\//g, '');           // fora comentaris
  const classes = [...net.matchAll(/className="([^"{]+)"/g)].flatMap((m) => m[1].split(/\s+/)).filter(Boolean);
  totalClasses += classes.length;

  for (const c of classes) {
    if (TAILWIND.test(c) && !definides.has(c)) infraccio('L01 · Zero Tailwind', f, c);
    if (c.startsWith('sosp-'))                 infraccio('L02 · Zero sosp-*', f, c);
    if (!definides.has(c)) {
      infraccio('L03 · Classe inexistent al CSS carregat', f, c);
      orfes.set(c, (orfes.get(c) || 0) + 1);
    }
  }
  if (/style=\{\{\s*(background|color|backgroundColor)/.test(net))
    infraccio('L04 · Color inline (no segueix el mode fosc)', f, 'style={{background…}}');
  if (/<div className="[^"]*"><\/div>/.test(net))
    infraccio('L05 · Div buit', f, '<div></div>');
  if (/dangerouslySetInnerHTML/.test(net))
    infraccio('L06 · HTML cru', f, 'dangerouslySetInnerHTML');
  if (/<iframe/i.test(net))
    infraccio('L07 · Petició externa al manual', f, '<iframe>');
}

// L08 · ids únics en tot el manual
const totsIds = fitxers.flatMap((f) =>
  [...readFileSync(f, 'utf8').matchAll(/<Section id="([^"]+)"/g)].map((m) => m[1]));
const repes = totsIds.filter((v, i) => totsIds.indexOf(v) !== i);
for (const r of new Set(repes)) infraccio('L08 · id de secció duplicat', ARREL, r);

console.log(`Fitxers .jsx auditats : ${fitxers.length}`);
console.log(`Classes CSS emeses    : ${totalClasses}`);
console.log(`Blocs numerats         : ${totsIds.length}`);
console.log(`Classes òrfenes        : ${orfes.size}`);
console.log('─'.repeat(64));

if (!lleis.length) {
  console.log('✅ CAP INFRACCIÓ. Les 8 lleis es complixen.');
  process.exit(0);
}
for (const { llei, fitxer, detall } of lleis) console.log(`❌ ${llei}\n   ${fitxer} → ${detall}`);
console.log(`\n${lleis.length} infraccions.`);
process.exit(1);
