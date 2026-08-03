#!/usr/bin/env node
// 99_maquinaria/desbrossadora.mjs — Neteja mecànica del Mas (Pedra Seca)
// Node >= 18 · zero dependències · dry-run per defecte · idempotent
//
// QUÈ FA:
//   1) Elimina brossa del sistema de fitxers: .DS_Store, .!*!.DS_Store,
//      owner.lock.stale-* (amb més de --dies-stale dies), fitxers buits *.txt de scratch.
//   2) Cura la plaga dels peus duplicats: col·lapsa les repeticions finals de
//      "**Ancoratge de Seguretat:** [[00_INDEX]]" (i el seu "---" orfe) deixant-ne UNA.
//
// ÚS:
//   node desbrossadora.mjs [arrelProjecte]            → informe (no toca res)
//   node desbrossadora.mjs [arrelProjecte] --apply    → executa i escriu rebut JSON
//   Opcions: --dies-stale=7   --sense-peus   --sense-brossa
//
// SEGURETAT (fail-closed):
//   · Mai toca .git, node_modules, .iaia_auth ni res fora de l'arrel indicada.
//   · Només esborra patrons de brossa explícits; davant el dubte, no fa res.
//   · El rebut queda a _wiki_de_poble/05_Escriptori_Soc_de_Poble/ (o cwd si no existix).

import { readdir, readFile, writeFile, unlink, stat, mkdir } from 'node:fs/promises';
import { join, relative, basename } from 'node:path';
import process from 'node:process';

const ANCORA = '**Ancoratge de Seguretat:** [[00_INDEX]]';
const EXCLOSOS = new Set(['.git', 'node_modules', '.iaia_auth', '.obsidian', '.sdp-reflex']);

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const NO_PEUS = args.includes('--sense-peus');
const NO_BROSSA = args.includes('--sense-brossa');
const DIES_STALE = Number((args.find(a => a.startsWith('--dies-stale=')) || '').split('=')[1] || 7);
const ROOT = args.find(a => !a.startsWith('--')) || process.cwd();

const rebut = {
  script: 'desbrossadora',
  versio: '1.0.0',
  data: new Date().toISOString(),
  arrel: ROOT,
  mode: APPLY ? 'apply' : 'dry-run',
  brossaEsborrada: [],
  peusCurats: [],
  errors: [],
};

function esBrossa(nom) {
  if (nom === '.DS_Store') return true;
  if (/^\.!\d+!\.DS_Store$/.test(nom)) return true;          // DS_Store corrupte
  if (/\.stale-\d+$/.test(nom)) return 'stale';               // locks vells (mira edat)
  return false;
}

async function* camina(dir) {
  let entrades;
  try { entrades = await readdir(dir, { withFileTypes: true }); }
  catch (e) { rebut.errors.push({ path: dir, error: e.message }); return; }
  for (const ent of entrades) {
    if (EXCLOSOS.has(ent.name)) continue;
    const ple = join(dir, ent.name);
    if (ent.isDirectory()) yield* camina(ple);
    else if (ent.isFile()) yield ple;
  }
}

/** Col·lapsa repeticions finals de l'àncora deixant-ne exactament una. */
function curaPeus(text) {
  const ocurrencies = text.split(ANCORA).length - 1;
  if (ocurrencies <= 1) return null;
  let cos = text;
  // Retallem grups finals «(\n|---)* ÀNCORA \s*$» mentre quede una àncora anterior.
  const grupFinal = new RegExp(
    String.raw`(?:\s*\n)+(?:-{3,}\s*\n+)?\s*` +
    ANCORA.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +
    String.raw`\s*$`,
  );
  let seguretat = 10;
  while (seguretat-- > 0) {
    const restants = cos.split(ANCORA).length - 1;
    if (restants <= 1) break;
    const nou = cos.replace(grupFinal, '\n');
    if (nou === cos) break; // l'última ocurrència no és al final: no toquem res més
    cos = nou;
  }
  const final = cos.replace(/\s*$/, '\n');
  return final === text ? null : final;
}

async function main() {
  try { await stat(ROOT); }
  catch { console.error(`[DESBROSSADORA] Arrel inexistent: ${ROOT}`); process.exit(2); }

  const araMs = Date.now();
  for await (const fitxer of camina(ROOT)) {
    const nom = basename(fitxer);
    const rel = relative(ROOT, fitxer);

    if (!NO_BROSSA) {
      const tipus = esBrossa(nom);
      if (tipus === true || tipus === 'stale') {
        if (tipus === 'stale') {
          const s = await stat(fitxer).catch(() => null);
          if (!s || araMs - s.mtimeMs < DIES_STALE * 86_400_000) continue; // massa recent: fora perill
        }
        rebut.brossaEsborrada.push(rel);
        if (APPLY) await unlink(fitxer).catch(e => rebut.errors.push({ path: rel, error: e.message }));
        continue;
      }
    }

    if (!NO_PEUS && nom.endsWith('.md')) {
      let text;
      try { text = await readFile(fitxer, 'utf8'); }
      catch (e) { rebut.errors.push({ path: rel, error: e.message }); continue; }
      const curat = curaPeus(text);
      if (curat) {
        rebut.peusCurats.push(rel);
        if (APPLY) await writeFile(fitxer, curat, 'utf8').catch(e => rebut.errors.push({ path: rel, error: e.message }));
      }
    }
  }

  // Rebut
  const resum = `[DESBROSSADORA] ${rebut.mode.toUpperCase()} · brossa: ${rebut.brossaEsborrada.length} · peus curats: ${rebut.peusCurats.length} · errors: ${rebut.errors.length}`;
  console.log(resum);
  for (const f of rebut.brossaEsborrada) console.log(`  ✂ brossa   ${f}`);
  for (const f of rebut.peusCurats) console.log(`  ✚ peu      ${f}`);
  for (const e of rebut.errors) console.log(`  ✖ error    ${e.path}: ${e.error}`);

  if (APPLY) {
    const escriptori = join(ROOT, '_wiki_de_poble', '05_Escriptori_Soc_de_Poble');
    const destiDir = await stat(escriptori).then(() => escriptori).catch(() => ROOT);
    await mkdir(destiDir, { recursive: true }).catch(() => {});
    const nomRebut = `rebut_desbrossadora_${new Date().toISOString().slice(0, 10)}.json`;
    await writeFile(join(destiDir, nomRebut), JSON.stringify(rebut, null, 2), 'utf8');
    console.log(`[DESBROSSADORA] Rebut escrit: ${join(relative(ROOT, destiDir) || '.', nomRebut)}`);
  } else {
    console.log('[DESBROSSADORA] Mode informe. Executa amb --apply per aplicar els canvis.');
  }
  process.exit(rebut.errors.length ? 1 : 0);
}

main();
