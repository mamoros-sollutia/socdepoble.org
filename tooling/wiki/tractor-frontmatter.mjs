#!/usr/bin/env node
/**
 * tractor-frontmatter.mjs — PORTA DE L'ESQUEMA CANÒNIC
 *
 * PER QUÈ EXISTIX
 * ───────────────
 *   Cens 260901: 34 propietats distintes sobre 96 documents. No eren 34
 *   propietats: eren dos esquemes legítims i divuit accidents. Concretament,
 *   17 de les 34 tenien ENTROPIA 0,00 — un únic valor en tot el corpus.
 *   `lang: ca` dotze vegades. `owner: project-governance` quatre. No prediuen
 *   res: esborrar-les no perd ni un bit. Això no és opinió, és aritmètica.
 *
 *   També hi havia enums bruts que ningú validava: `canonic` i `"canonic"`
 *   comptaven com a dos estats distints, i `norma` convivia amb `"normativa"`.
 *
 * LLEIS
 *   F1 OBLIGATÒRIA   falta una clau del nucli (tipus, estat, description)
 *   F2 FORASTERA     clau que no és a l'esquema
 *   F3 ENUM          valor fora del domini declarat
 *   F4 VOCABULARI    tag fora del vocabulari tancat
 *   F5 ENTROPIA      clau nova amb un únic valor a tot el corpus → cerimònia
 *   F6 DUPLICADA     la mateixa clau dos vegades al mateix frontmatter
 *
 *   F5 és la llei que impedix que tornem a arribar a 34. Cap norma escrita
 *   ho va evitar en huit mesos; una mesura sí.
 *
 * ÚS
 *   node tooling/gates/tractor-frontmatter.mjs
 *   node tooling/gates/tractor-frontmatter.mjs --json
 *   node tooling/gates/tractor-frontmatter.mjs --baseline   # segella el deute actual
 *
 * Pedra Seca: zero dependències, ESM, fail-closed.
 */

import fs from 'node:fs';
import path from 'node:path';
import { parteix, llig } from '../wiki/lib/frontmatter_pla.mjs';

const ARG = (n) => process.argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3) ?? null;
const ARREL = path.resolve(ARG('arrel') ?? process.cwd());
const JSON_OUT = process.argv.includes('--json');
const BASELINE = process.argv.includes('--baseline');
const DEUTE = path.join(ARREL, '.agents/deute/.frontmatter-deute.json');
const ESQUEMA = path.join(ARREL, 'tooling/wiki/esquema_frontmatter.json');

if (!fs.existsSync(ESQUEMA)) {
  console.error(`❌ [FRONTMATTER] Falta l'esquema: ${ESQUEMA}`);
  console.error('   Sense esquema no hi ha llei. Fallem tancat.');
  process.exit(2);
}
const E = JSON.parse(fs.readFileSync(ESQUEMA, 'utf8'));

const ARRELS = (ARG('arrels') ?? '_wiki_de_poble,.agents').split(',');
const EXCLOU = /(^|\/)(node_modules|\.git|\.obsidian|dist|build|90_historic|\.sdp-paperera)(\/|$)/;
/* Exempció per CONTINGUT, no per carpeta. Una plantilla amb marcadors
 * `{...}` al frontmatter no es pot validar contra un enum. Però exemptar
 * tota la carpeta `plantilles/` era pitjor: les deu plantilles del corpus
 * tenen frontmatter real, i mentre elles ensenyen `temes:` cada document
 * nou naix amb l'esquema vell. La plantilla és el vector de reinfecció. */
function esPlantillaBuida(cru) { return /:\s*.*\{[^}]+\}/.test(cru); }

function md(dir, acc = []) {
  const abs = path.join(ARREL, dir);
  if (!fs.existsSync(abs)) return acc;
  for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
    const rel = path.posix.join(dir, e.name);
    if (EXCLOU.test(rel)) continue;
    if (e.isDirectory()) md(rel, acc);
    else if (e.name.endsWith('.md')) acc.push(rel);
  }
  return acc;
}

const NODES = ARRELS.flatMap((d) => md(d)).sort();
if (NODES.length === 0) {
  console.error(`❌ [FRONTMATTER] Cap document a ${ARRELS.join(', ')} des de ${ARREL}. Usa --arrel=.`);
  process.exit(2);
}

/**
 * L'abast de l'extensió d'agent el declara l'esquema, no este fitxer. Tenir-lo
 * cablejat ací feia que el mirall d'agents (que porta exactament les mateixes
 * claus) generara 38 falses infraccions F2 i amagara les reals.
 * Glob mínim: `*` no travessa `/`.
 */
const aGlob = (patro) => new RegExp('^' + patro
  .replace(/[.+^${}()|[\]\\]/g, '\\$&')
  .replace(/\*/g, '[^/]*') + '$');

const ABAST_AGENT = (Array.isArray(E.extensio_agent.abast)
  ? E.extensio_agent.abast
  : [E.extensio_agent.abast]).map(aGlob);

const esSkill = (n) => ABAST_AGENT.some((re) => re.test(n));

const OBL = Object.keys(E.universal.obligatories);
const OPC = Object.keys(E.universal.opcionals);
const AGENT = Object.keys(E.extensio_agent.obligatories);
/* Les opcionals de l'extensió són esquema igual que les obligatòries: es
 * permeten (F2) però no s'exigixen (F1). Sense esta línia, una clau opcional
 * declarada per l'esquema — com `prioritat` — es denunciava com a forastera
 * i el codemod la tornava a esborrar en el següent passe. */
const AGENT_OPC = Object.keys(E.extensio_agent.opcionals ?? {});
const EXTRA = E.migracio.conserva_fora_d_esquema ?? [];

const permeses = (n) => new Set(esSkill(n)
  ? [...OBL, ...OPC, ...AGENT, ...AGENT_OPC, ...EXTRA]
  : [...OBL, ...OPC]);

/* ──────────────────────────── Anàlisi ──────────────────────────── */

const f = { F1: [], F2: [], F3: [], F4: [], F5: [], F6: [] };
const usPerClau = new Map();
const valsPerClau = new Map();

for (const n of NODES) {
  const txt = fs.readFileSync(path.join(ARREL, n), 'utf8');
  const { fm, cru } = parteix(txt);
  if (!fm) { f.F1.push({ n, clau: '(cap frontmatter)' }); continue; }
  if (esPlantillaBuida(cru)) continue; /* marcadors {…}: no es pot validar */
  const { claus, valors, avisos } = llig(cru);
  for (const a of avisos) if (a.startsWith('clau duplicada')) f.F6.push({ n, detall: a });

  const ok = permeses(n);
  const req = esSkill(n) ? [...OBL, ...AGENT] : OBL;

  for (const k of req) if (!valors.has(k)) f.F1.push({ n, clau: k });
  for (const k of claus) {
    usPerClau.set(k, (usPerClau.get(k) ?? 0) + 1);
    const v = valors.get(k);
    if (!valsPerClau.has(k)) valsPerClau.set(k, new Set());
    for (const x of Array.isArray(v) ? v : [v]) if (x) valsPerClau.get(k).add(String(x));
    if (!ok.has(k)) f.F2.push({ n, clau: k });
  }

  for (const [k, def] of Object.entries(E.universal.obligatories)) {
    if (!def.enum || !valors.has(k)) continue;
    const v = valors.get(k);
    if (typeof v === 'string' && !def.enum.includes(v)) f.F3.push({ n, clau: k, valor: v });
  }

  const voc = E.universal.opcionals.tags.vocabulari_tancat;
  const tags = valors.get('tags');
  if (Array.isArray(tags)) for (const t of tags) if (!voc.includes(t)) f.F4.push({ n, tag: t });
}

/* F5 — entropia zero. Només per a claus que NO són al nucli obligatori:
 * `tipus`/`estat` poden tindre un únic valor legítimament en un repositori
 * jove i no volem castigar-ho. */
for (const [k, vals] of valsPerClau) {
  if (OBL.includes(k)) continue;
  if (vals.size === 1 && usPerClau.get(k) >= 2) {
    f.F5.push({ clau: k, usos: usPerClau.get(k), valor: [...vals][0] });
  }
}

/* ──────────────────────────── Veredicte ──────────────────────────── */

const compte = Object.fromEntries(Object.entries(f).map(([k, v]) => [k, v.length]));

if (BASELINE) {
  fs.writeFileSync(DEUTE, JSON.stringify({ generat: new Date().toISOString(), max: compte }, null, 2) + '\n');
  console.log(`🔒 [FRONTMATTER] Deute segellat a ${DEUTE}`);
  console.log(JSON.stringify(compte));
  console.log('   El deute només pot baixar. Si puja, la porta cau.');
  process.exit(0);
}

const max = fs.existsSync(DEUTE)
  ? JSON.parse(fs.readFileSync(DEUTE, 'utf8')).max
  : { F1: 0, F2: 0, F3: 0, F4: 0, F5: 0, F6: 0 };

if (JSON_OUT) {
  console.log(JSON.stringify({ documents: NODES.length, compte, max, fallades: f }, null, 1));
} else {
  const noms = {
    F1: 'OBLIGATÒRIA — falta una clau del nucli',
    F2: 'FORASTERA — clau fora de l\'esquema',
    F3: 'ENUM — valor fora del domini',
    F4: 'VOCABULARI — tag fora del vocabulari tancat',
    F5: 'ENTROPIA — clau amb un únic valor: cerimònia',
    F6: 'DUPLICADA — clau repetida al frontmatter',
  };
  console.log('\n📋 TRACTOR FRONTMATTER — esquema canònic');
  console.log('─'.repeat(72));
  console.log(`  ${NODES.length} documents · esquema ${E.esquema} · ${OBL.length + OPC.length} claus universals\n`);
  for (const [llei, items] of Object.entries(f)) {
    const sostre = max[llei] ?? 0;
    const icona = items.length > sostre ? '❌' : items.length ? '·' : '✅';
    console.log(`${icona} ${llei} · ${noms[llei]} — ${items.length} màx ${sostre}`);
    for (const it of items.slice(0, 6)) {
      if (llei === 'F5') console.log(`      ${it.clau} = «${it.valor}» ×${it.usos}`);
      else console.log(`      ${it.n}${it.clau ? `  → ${it.clau}` : ''}${it.valor ? ` = «${it.valor}»` : ''}${it.tag ? ` → #${it.tag}` : ''}${it.detall ? `  ${it.detall}` : ''}`);
    }
    if (items.length > 6) console.log(`      … i ${items.length - 6} més`);
  }
  console.log('─'.repeat(72));
}

const pujat = Object.entries(compte).filter(([k, v]) => v > (max[k] ?? 0));
if (pujat.length) {
  console.error(`\n❌ [FRONTMATTER] El deute ha pujat: ${pujat.map(([k, v]) => `${k} ${max[k] ?? 0}→${v}`).join(', ')}`);
  console.error('   Arregla-ho: node tooling/wiki/codemod_frontmatter.mjs --escriu');
  process.exit(1);
}
console.log('\n✅ [FRONTMATTER] Esquema respectat. Deute no ha pujat.');
process.exit(0);
