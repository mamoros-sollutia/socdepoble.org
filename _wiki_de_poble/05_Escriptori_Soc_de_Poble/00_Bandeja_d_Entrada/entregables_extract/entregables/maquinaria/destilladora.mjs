#!/usr/bin/env node
// 99_maquinaria/destilladora.mjs — Destil·lació del Brain (cicle de vida, Pedra Seca)
// Node >= 18 · zero dependències · dry-run per defecte · idempotent
//
// QUÈ FA:
//   1) ESCRIPTORI → ARXIU: mou de 05_Escriptori_Soc_de_Poble/ tot artefacte datat
//      (nom que comença per YYMMDD_) amb més de --dies (defecte 14) cap a
//      04_ARXIU_Documents_Historics/20YY_MM/ segons la data del NOM del fitxer.
//   2) --fusiona-90: buida 90_arxiu_historic/ dins de 04_ARXIU_.../20YY_MM/
//      (els no datats van a 04_ARXIU_.../sense_data/). Deixa la carpeta buida
//      perquè l'esborres tu a mà: este script NO esborra directoris.
//   3) Regenera 04_ARXIU_Documents_Historics/00_INDEX_ARXIU.md agrupat per mes.
//
// GARANTIES:
//   · Mai sobreescriu: si el destí existix, anota conflicte i no mou.
//   · Els wikilinks [[Nom]] d'Obsidian resolen per nom de fitxer: moure dins
//     del vault no els trenca.
//   · Rebut JSON a 05_Escriptori quan s'aplica.
//
// ÚS:
//   node destilladora.mjs [arrelVault] [--dies=14] [--fusiona-90] [--apply]
//   (arrelVault = carpeta _wiki_de_poble; per defecte ./_wiki_de_poble o cwd si ja hi ets)

import { readdir, readFile, writeFile, rename, mkdir, stat } from 'node:fs/promises';
import { join, relative, basename } from 'node:path';
import process from 'node:process';

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const FUSIONA_90 = args.includes('--fusiona-90');
const DIES = Number((args.find(a => a.startsWith('--dies=')) || '').split('=')[1] || 14);

async function detectaVault(candidat) {
  for (const p of [candidat, join(candidat, '_wiki_de_poble')]) {
    try { await stat(join(p, '05_Escriptori_Soc_de_Poble')); return p; } catch {}
  }
  return null;
}

const rebut = {
  script: 'destilladora', versio: '1.0.0', data: new Date().toISOString(),
  mode: APPLY ? 'apply' : 'dry-run', moguts: [], conflictes: [], errors: [],
};

function dataDelNom(nom) {
  const m = /^(\d{2})(\d{2})(\d{2})_/.exec(nom);
  if (!m) return null;
  const [, yy, mm, dd] = m;
  const d = new Date(`20${yy}-${mm}-${dd}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : { d, carpeta: `20${yy}_${mm}` };
}

async function mou(origen, destiDir, motiu) {
  const desti = join(destiDir, basename(origen));
  try {
    await stat(desti);
    rebut.conflictes.push({ origen, desti, motiu: 'el destí ja existix' });
    return;
  } catch {}
  rebut.moguts.push({ de: origen, a: desti, motiu });
  if (APPLY) {
    await mkdir(destiDir, { recursive: true });
    await rename(origen, desti).catch(e => rebut.errors.push({ origen, error: e.message }));
  }
}

async function main() {
  const VAULT = await detectaVault(args.find(a => !a.startsWith('--')) || process.cwd());
  if (!VAULT) {
    console.error('[DESTIL·LADORA] No trobe el vault (falta 05_Escriptori_Soc_de_Poble). Indica l\'arrel.');
    process.exit(2);
  }
  const ESCRIPTORI = join(VAULT, '05_Escriptori_Soc_de_Poble');
  const ARXIU = join(VAULT, '04_ARXIU_Documents_Historics');
  const NORANTA = join(VAULT, '90_arxiu_historic');
  const llindarMs = Date.now() - DIES * 86_400_000;

  // 1) Escriptori → Arxiu (només fitxers datats de primer nivell; les subcarpetes
  //    de quarantena es gestionen a mà: contenen material heterogeni).
  for (const ent of await readdir(ESCRIPTORI, { withFileTypes: true })) {
    if (!ent.isFile()) continue;
    const info = dataDelNom(ent.name);
    if (!info) continue;
    if (info.d.getTime() > llindarMs) continue;
    await mou(join(ESCRIPTORI, ent.name), join(ARXIU, info.carpeta), `escriptori>arxiu (${DIES}d)`);
  }

  // 2) Fusió del 90_arxiu_historic (l'arxiu paral·lel il·legal)
  if (FUSIONA_90) {
    let entrades = [];
    try { entrades = await readdir(NORANTA, { withFileTypes: true }); }
    catch { console.log('[DESTIL·LADORA] 90_arxiu_historic no existix; res a fusionar.'); }
    for (const ent of entrades) {
      if (!ent.isFile()) continue;
      const info = dataDelNom(ent.name);
      const carpeta = info ? info.carpeta : 'sense_data';
      await mou(join(NORANTA, ent.name), join(ARXIU, carpeta), 'fusio 90>04');
    }
  }

  // 3) Índex de l'arxiu
  const perMes = new Map();
  async function llig(dir, clau) {
    let entrades = [];
    try { entrades = await readdir(dir, { withFileTypes: true }); } catch { return; }
    for (const ent of entrades) {
      if (ent.isDirectory()) await llig(join(dir, ent.name), ent.name);
      else if (ent.isFile() && ent.name.endsWith('.md') && ent.name !== '00_INDEX_ARXIU.md') {
        if (!perMes.has(clau)) perMes.set(clau, []);
        perMes.get(clau).push(ent.name.replace(/\.md$/, ''));
      }
    }
  }
  await llig(ARXIU, 'arrel');
  // Simulem els moviments en dry-run perquè l'índex previsualitzat siga fidel
  for (const m of rebut.moguts) {
    const carpeta = basename(join(m.a, '..'));
    const nom = basename(m.a).replace(/\.md$/, '');
    if (m.a.endsWith('.md')) {
      if (!perMes.has(carpeta)) perMes.set(carpeta, []);
      if (!perMes.get(carpeta).includes(nom)) perMes.get(carpeta).push(nom);
    }
  }
  const mesos = [...perMes.keys()].filter(k => k !== 'arrel').sort().reverse();
  let index = `---\nestat: canonic\ntipus: index\ndescription: Índex regenerat mecànicament per destilladora.mjs. No editar a mà.\n---\n# 🗄️ Índex de l'Arxiu Històric\n\n> Regenerat: ${new Date().toISOString().slice(0, 16).replace('T', ' ')} · ${rebut.mode}\n\n`;
  for (const mes of mesos) {
    index += `## ${mes.replace('_', '-')}\n\n`;
    for (const nom of perMes.get(mes).sort()) index += `- [[${nom}]]\n`;
    index += '\n';
  }
  if (APPLY) await writeFile(join(ARXIU, '00_INDEX_ARXIU.md'), index, 'utf8');

  // Informe
  console.log(`[DESTIL·LADORA] ${rebut.mode.toUpperCase()} · moguts: ${rebut.moguts.length} · conflictes: ${rebut.conflictes.length} · errors: ${rebut.errors.length}`);
  for (const m of rebut.moguts) console.log(`  → ${relative(VAULT, m.de)}  ⇒  ${relative(VAULT, m.a)}`);
  for (const c of rebut.conflictes) console.log(`  ⚠ conflicte: ${relative(VAULT, c.origen)} (${c.motiu})`);
  if (APPLY) {
    const nomRebut = `rebut_destilladora_${new Date().toISOString().slice(0, 10)}.json`;
    await writeFile(join(ESCRIPTORI, nomRebut), JSON.stringify(rebut, null, 2), 'utf8');
    console.log(`[DESTIL·LADORA] Índex regenerat i rebut escrit a 05_Escriptori/${nomRebut}`);
  } else {
    console.log('[DESTIL·LADORA] Mode informe. Executa amb --apply per moure de veritat.');
  }
  process.exit(rebut.errors.length ? 1 : 0);
}

main();
