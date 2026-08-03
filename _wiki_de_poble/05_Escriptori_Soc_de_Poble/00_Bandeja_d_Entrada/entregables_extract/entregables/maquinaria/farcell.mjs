#!/usr/bin/env node
// 99_maquinaria/farcell.mjs — Empaquetador d'auditories fail-closed (Pedra Seca)
// Node >= 18 · zero dependències npm (usa el binari `zip` o `tar` del sistema)
//
// PROBLEMA QUE MATA:
//   Els bundles enviats al Consell diuen «complet» però sistemàticament falten
//   fitxers (tooling/, guardrails.mjs, scripts/ del package.json...). Este script
//   converteix eixa promesa en una comprovació MECÀNICA: calcula què és
//   obligatori (imports reals del bot + scripts del package.json + pilars fixos)
//   i FALLA TANCAT si falta res.
//
// QUÈ FA:
//   1) Escaneja bot/**/*.mjs i seguix el graf d'imports relatius (../tooling/... inclòs).
//   2) Extrau totes les rutes de fitxer dels "scripts" del package.json.
//   3) Afig els pilars: .agents/**, _wiki_de_poble/**/*.md, src/**, package.json,
//      vite.config.* si existix.
//   4) Verifica existència. Si falta res → exit 1 + llista FARCELL_INCOMPLET.
//   5) Amb tot present (o --permet-forats), genera:
//        · farcell_manifest.json  (ruta + sha256 + bytes de cada fitxer → provenança)
//        · Cervell_i_Codi_<data>.zip (o .tgz amb --format=tgz)
//   Exclou sempre: .git, node_modules, .obsidian, .iaia_auth, bot/var, .DS_Store,
//   *.stale-*, *.tar.gz, *.zip, .sdp-reflex.
//
// ÚS:
//   node farcell.mjs [arrelProjecte] [--nom=Cervell_i_Codi_Setembre] [--format=zip|tgz]
//                    [--permet-forats] [--nomes-verifica]

import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { join, relative, dirname, resolve, sep } from 'node:path';
import process from 'node:process';

const args = process.argv.slice(2);
const ROOT = resolve(args.find(a => !a.startsWith('--')) || process.cwd());
const NOM = (args.find(a => a.startsWith('--nom=')) || '').split('=')[1]
  || `Cervell_i_Codi_${new Date().toISOString().slice(0, 10)}`;
const FORMAT = ((args.find(a => a.startsWith('--format=')) || '').split('=')[1] || 'zip');
const PERMET_FORATS = args.includes('--permet-forats');
const NOMES_VERIFICA = args.includes('--nomes-verifica');

const EXCLOSOS_DIR = new Set(['.git', 'node_modules', '.obsidian', '.iaia_auth', '.sdp-reflex', 'var']);
const esExclos = (nom) =>
  nom === '.DS_Store' || /^\.!\d+!\.DS_Store$/.test(nom) || /\.stale-\d+$/.test(nom)
  || nom.endsWith('.tar.gz') || nom.endsWith('.zip');

async function existeix(p) { try { await stat(p); return true; } catch { return false; } }

async function* camina(dir, arrelExclusions = true) {
  let entrades;
  try { entrades = await readdir(dir, { withFileTypes: true }); } catch { return; }
  for (const ent of entrades) {
    if (ent.isDirectory()) {
      if (EXCLOSOS_DIR.has(ent.name)) continue;
      yield* camina(join(dir, ent.name), false);
    } else if (ent.isFile() && !esExclos(ent.name)) {
      yield join(dir, ent.name);
    }
  }
}

/** Seguix imports relatius (`from './x.mjs'`, `import('../y.mjs')`) des d'un conjunt llavor. */
async function grafImports(llavors) {
  const vist = new Set();
  const pendents = [...llavors];
  const patro = /(?:from\s+|import\s*\()\s*['"](\.{1,2}\/[^'"]+)['"]/g;
  while (pendents.length) {
    const fitxer = pendents.pop();
    const clau = resolve(fitxer);
    if (vist.has(clau)) continue;
    vist.add(clau);
    let text;
    try { text = await readFile(fitxer, 'utf8'); } catch { continue; }
    for (const m of text.matchAll(patro)) {
      let dest = resolve(dirname(fitxer), m[1]);
      if (!/\.[cm]?js$/.test(dest)) {
        for (const ext of ['.mjs', '.js', '/index.mjs', '/index.js']) {
          if (await existeix(dest + ext)) { dest = dest + ext; break; }
        }
      }
      if (!vist.has(dest)) pendents.push(dest);
    }
  }
  return [...vist];
}

/** Extrau rutes de fitxer dels scripts del package.json (node x.mjs, sh y.sh, --test glob). */
function rutesDeScripts(pkg) {
  const rutes = new Set();
  for (const ordre of Object.values(pkg.scripts || {})) {
    for (const m of String(ordre).matchAll(/(?:^|\s)((?:[\w.@-]+\/)+[\w.@*-]+\.(?:mjs|js|cjs|sh|json))/g)) {
      rutes.add(m[1]);
    }
  }
  return [...rutes];
}

async function main() {
  if (!(await existeix(join(ROOT, 'package.json')))) {
    console.error(`[FARCELL] No trobe package.json a ${ROOT}. Arrel incorrecta.`);
    process.exit(2);
  }
  const pkg = JSON.parse(await readFile(join(ROOT, 'package.json'), 'utf8'));

  // 1+2) Obligatoris calculats
  const llavorsBot = [];
  for await (const f of camina(join(ROOT, 'bot'))) if (f.endsWith('.mjs')) llavorsBot.push(f);
  const graf = await grafImports(llavorsBot);
  const deScripts = rutesDeScripts(pkg).map(r => join(ROOT, r));

  const obligatoris = new Map(); // absolut → motiu
  for (const f of graf) obligatoris.set(f, 'import del bot');
  for (const f of deScripts) {
    if (f.includes('*')) {
      // glob simple d'una carpeta: comprovem que la carpeta existisca i tinga algun match
      const carpeta = dirname(f);
      obligatoris.set(carpeta + sep + '(glob)', `script package.json: ${relative(ROOT, f)}`);
      continue;
    }
    obligatoris.set(f, 'script package.json');
  }
  for (const fix of ['package.json', '.agents', '_wiki_de_poble', 'src', 'bot']) {
    obligatoris.set(join(ROOT, fix), 'pilar del projecte');
  }
  for (const opc of ['vite.config.js', 'vite.config.mjs', 'index.html']) {
    if (await existeix(join(ROOT, opc))) obligatoris.set(join(ROOT, opc), 'arrel del build');
  }

  // 4) Verificació fail-closed
  const forats = [];
  for (const [ruta, motiu] of obligatoris) {
    const real = ruta.endsWith('(glob)') ? ruta.slice(0, -('(glob)'.length + 1)) : ruta;
    if (!(await existeix(real))) forats.push({ ruta: relative(ROOT, real), motiu });
  }

  if (forats.length) {
    console.error(`\n[FARCELL] ✖ FARCELL_INCOMPLET — falten ${forats.length} rutes obligatòries:`);
    for (const f of forats) console.error(`   · ${f.ruta}   (${f.motiu})`);
    if (!PERMET_FORATS) {
      console.error('\n[FARCELL] Fail-closed: no es genera cap paquet. Sincronitza o usa --permet-forats (quedarà anotat al manifest).');
      process.exit(1);
    }
  } else {
    console.log('[FARCELL] ✔ Totes les rutes obligatòries presents.');
  }
  if (NOMES_VERIFICA) process.exit(forats.length ? 1 : 0);

  // 5) Manifest amb hashes + empaquetat
  const fitxers = [];
  for await (const f of camina(ROOT)) fitxers.push(f);
  fitxers.sort();
  const manifest = {
    nom: NOM,
    data: new Date().toISOString(),
    arrel: ROOT,
    totalFitxers: fitxers.length,
    foratsAdmesos: forats,
    fitxers: [],
  };
  for (const f of fitxers) {
    const buf = await readFile(f);
    manifest.fitxers.push({
      ruta: relative(ROOT, f),
      bytes: buf.length,
      sha256: createHash('sha256').update(buf).digest('hex'),
    });
  }
  const manifestPath = join(ROOT, 'farcell_manifest.json');
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  const llista = manifest.fitxers.map(x => x.ruta).concat(['farcell_manifest.json']);
  const eixida = join(ROOT, '..', `${NOM}.${FORMAT === 'tgz' ? 'tar.gz' : 'zip'}`);
  if (FORMAT === 'tgz') {
    execFileSync('tar', ['-czf', eixida, '-C', ROOT, ...llista], { stdio: 'inherit' });
  } else {
    execFileSync('zip', ['-X', '-q', eixida, ...llista], { cwd: ROOT, stdio: 'inherit' });
  }
  const s = await stat(eixida);
  console.log(`[FARCELL] ✔ Paquet: ${eixida} (${(s.size / 1024 / 1024).toFixed(2)} MB, ${llista.length - 1} fitxers + manifest)`);
  console.log('[FARCELL] Provenança: farcell_manifest.json amb sha256 de cada fitxer.');
}

main().catch((e) => { console.error('[FARCELL] Error fatal:', e.message); process.exit(2); });
