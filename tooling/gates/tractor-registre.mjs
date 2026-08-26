#!/usr/bin/env node
/**
 * tractor-registre.mjs — la porta que li faltava al cervell.
 *
 * Comprova mecànicament que el registre declarat (`00_INDEX_SKILLS.md`), les
 * carpetes del disc, els frontmatters dels `SKILL.md` i les obligacions del
 * BIOS (`.agents/rules/00_BIOS_COGNITIU.md`) diuen el mateix.
 *
 * Cap d'aquestes comprovacions és d'estil. Totes detecten una divergència que
 * fa que un agent carregue una cosa distinta de la que el sistema declara.
 *
 * Lleis aplicades (cada una amb codi propi per a poder-la citar en un ADR):
 *   R1  FANTASMA        skill al registre sense carpeta al disc
 *   R2  CLANDESTINA     carpeta al disc que el registre no declara
 *   R3  TRIGGER-DOBLE   dos skills comparteixen un trigger
 *   R4  NOM-DISCORDANT  `name:` del frontmatter ≠ nom de carpeta
 *   R5  BIOS-ORFE       skill obligatòria del BIOS sense carpeta al disc
 *   R6  BIOS-NO-REGIST  skill obligatòria del BIOS absent del registre
 *   R7  FRONTMATTER     `SKILL.md` sense frontmatter o malformat
 *   R8  ESTAT-INVALID   `status:` fora del vocabulari permés
 *   R9  BUIDA           skill activa amb cos per davall del mínim (stub)
 *   R10 CONFLICTE-ORFE  `conflicts_with:` apunta a una skill inexistent
 *   R11 ALIAS-PREFIX    el registre usa un nom que només difereix per prefix
 *                       d'una carpeta real (p. ex. ui-pedra-seca / pedra-seca)
 *
 * Pedra Seca: zero dependències, ESM, fail-closed, eixida per stdout.
 *
 *   node tooling/gates/tractor-registre.mjs
 *   node tooling/gates/tractor-registre.mjs --json
 *   node tooling/gates/tractor-registre.mjs --avisos-com-error
 *   node tooling/gates/tractor-registre.mjs --minim-cos=250
 *   node tooling/gates/tractor-registre.mjs --cervell=inicial_2026-08-24T21-26-15-657Z
 *   node tooling/gates/tractor-registre.mjs --arrel=/ruta/al/repo
 */

import fs from 'node:fs';
import path from 'node:path';

/* ─────────────────────────────── Configuració ─────────────────────────────── */

const ESTATS_VALIDS = new Set(['canonic', 'active', 'actiu', 'draft', 'esborrany', 'arxivat', 'deprecated']);
const ESTATS_ACTIUS = new Set(['canonic', 'active', 'actiu']);
const MINIM_COS_DEFECTE = 400; // caràcters de cos útil per a no considerar-la un stub

/* ─────────────────────────────── Arrel ─────────────────────────────── */

function trobaArrel(inici) {
  let dir = path.resolve(inici);
  for (let i = 0; i < 8; i += 1) {
    if (fs.existsSync(path.join(dir, 'AGENTS.md')) || fs.existsSync(path.join(dir, '.agents/AGENTS.md'))) return dir;
    const pare = path.dirname(dir);
    if (pare === dir) break;
    dir = pare;
  }
  return null;
}

const arg = (nom) => {
  const trobat = process.argv.find((a) => a.startsWith(`--${nom}=`));
  return trobat ? trobat.slice(nom.length + 3) : null;
};

const ARREL = arg('arrel') ? path.resolve(arg('arrel')) : trobaArrel(process.cwd());
const JSON_OUT = process.argv.includes('--json');
const AVISOS_FATALS = process.argv.includes('--avisos-com-error');
const MINIM_COS = Number(arg('minim-cos') ?? MINIM_COS_DEFECTE);

if (!ARREL) {
  console.error("❌ [REGISTRE] No trobe l'arrel del projecte (cal AGENTS.md o .agents/AGENTS.md). Usa --arrel=/ruta.");
  process.exit(1);
}

const R = (p) => path.join(ARREL, p);
const rel = (p) => path.relative(ARREL, p) || p;

/* ─────────────────────── Frontmatter (subconjunt canònic) ─────────────────────── */

/**
 * No implementa YAML complet. Cobrix el subconjunt del frontmatter de skills:
 * escalars citats i simples, llistes en bloc (`- x`) i inline (`[a, b]`), i
 * mapes d'un nivell. Retorna `malformat: true` en compte d'endevinar.
 */
function llegeixFrontmatter(cru) {
  const net = cru.replace(/^\uFEFF/, '');
  if (!/^---[ \t]*\r?\n/.test(net)) {
    return { hiHa: false, malformat: false, dades: {}, cos: net };
  }
  const resta = net.slice(net.indexOf('\n') + 1);
  const tanca = /^(?:---|\.\.\.)[ \t]*(?:\r?\n|$)/m.exec(resta);
  if (!tanca) return { hiHa: false, malformat: true, dades: {}, cos: net };

  const bloc = resta.slice(0, tanca.index);
  const cos = resta.slice(tanca.index + tanca[0].length);
  const dades = {};

  let clauLlista = null;
  let indentMapa = null;
  let clauMapa = null;

  for (const brut of bloc.split(/\r?\n/)) {
    if (!brut.trim() || /^\s*#/.test(brut)) continue;
    const indent = brut.length - brut.trimStart().length;
    const linia = brut.trim();

    if (linia.startsWith('- ')) {
      if (!clauLlista) continue; // element de llista sense clau: l'ignorem, no l'endevinem
      dades[clauLlista].push(descita(linia.slice(2).trim()));
      continue;
    }

    const m = /^([A-Za-z0-9_.-]+):\s*(.*)$/.exec(linia);
    if (!m) continue;
    const [, clau, valorBrut] = m;

    // mapa imbricat d'un nivell (p. ex. freshness:)
    if (indentMapa !== null && indent > indentMapa) {
      dades[clauMapa][clau] = descita(valorBrut);
      continue;
    }
    indentMapa = null;
    clauMapa = null;
    clauLlista = null;

    const valor = valorBrut.trim();
    if (valor === '') {
      // pot ser llista en bloc o mapa imbricat: ho decidix la línia següent
      dades[clau] = [];
      clauLlista = clau;
      indentMapa = indent;
      clauMapa = clau;
      continue;
    }
    if (/^\[.*\]$/.test(valor)) {
      const dins = valor.slice(1, -1).trim();
      dades[clau] = dins === '' ? [] : dins.split(',').map((x) => descita(x.trim()));
      continue;
    }
    dades[clau] = descita(valor);
  }

  // les claus que van quedar com a [] però van rebre parells clau:valor
  for (const [k, v] of Object.entries(dades)) {
    if (Array.isArray(v) && v.length === 0 && clauMapa === k) dades[k] = {};
  }

  return { hiHa: true, malformat: false, dades, cos };
}

function descita(v) {
  const s = String(v).trim();
  if (/^'[\s\S]*'$/.test(s)) return s.slice(1, -1).replace(/''/g, "'");
  if (/^"([\s\S]*)"$/.test(s)) return s.slice(1, -1);
  return s;
}

/* ─────────────────────────────── Localitza el cervell ─────────────────────────────── */

const DIR_CERVELLS = R('.agents/cervells');
if (!fs.existsSync(DIR_CERVELLS)) {
  console.error(`❌ [REGISTRE] No existix ${rel(DIR_CERVELLS)}. Sense cervell no hi ha res a validar.`);
  process.exit(1);
}

const cervells = fs.readdirSync(DIR_CERVELLS, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort();

if (cervells.length === 0) {
  console.error(`❌ [REGISTRE] ${rel(DIR_CERVELLS)} no conté cap cervell.`);
  process.exit(1);
}

const CERVELL = arg('cervell') || cervells[cervells.length - 1];
if (!cervells.includes(CERVELL)) {
  console.error(`❌ [REGISTRE] El cervell '${CERVELL}' no existix. Disponibles: ${cervells.join(', ')}`);
  process.exit(1);
}
const DIR = path.join(DIR_CERVELLS, CERVELL);

/* ─────────────────────────────── Fonts ─────────────────────────────── */

const problemes = [];
const avisos = [];
const falla = (llei, subjecte, missatge) => problemes.push({ llei, subjecte, missatge });
const avisa = (llei, subjecte, missatge) => avisos.push({ llei, subjecte, missatge });

/* 1 · Registre declarat ------------------------------------------------------ */

const FITXER_INDEX = path.join(DIR, '00_INDEX_SKILLS.md');
if (!fs.existsSync(FITXER_INDEX)) {
  console.error(`❌ [REGISTRE] Falta ${rel(FITXER_INDEX)}. El registre canònic no existix: no puc validar res contra res.`);
  process.exit(1);
}

const crualIndex = fs.readFileSync(FITXER_INDEX, 'utf8');
/* Format canònic de línia: "- `nom-skill`: descripció" */
const declarades = new Map(); // nom → { linia }
for (const [i, linia] of crualIndex.split(/\r?\n/).entries()) {
  const m = /^\s*[-*]\s*`([a-z0-9][a-z0-9._-]*)`\s*:/i.exec(linia);
  if (m) declarades.set(m[1], { linia: i + 1 });
}

if (declarades.size === 0) {
  falla('R0', rel(FITXER_INDEX),
    "El lector del registre no ha trobat cap skill. O el format ha canviat o el registre és buit; en tots dos casos no puc certificar res.");
}

/* 2 · Carpetes al disc ------------------------------------------------------- */

const alDisc = new Map(); // nom carpeta → { fm, cos, ruta }
for (const e of fs.readdirSync(DIR, { withFileTypes: true })) {
  if (!e.isDirectory()) continue;
  const skillMd = path.join(DIR, e.name, 'SKILL.md');
  if (!fs.existsSync(skillMd)) {
    falla('R7', `${CERVELL}/${e.name}`, "Carpeta de skill sense `SKILL.md`. O és una skill trencada o és brossa que ocupa lloc al cervell.");
    continue;
  }
  const cru = fs.readFileSync(skillMd, 'utf8');
  const fm = llegeixFrontmatter(cru);
  alDisc.set(e.name, { fm, ruta: skillMd, cru });
}

/* 3 · Obligacions del BIOS --------------------------------------------------- */

const FITXER_BIOS = R('.agents/rules/00_BIOS_COGNITIU.md');
const obligatories = new Map(); // nom → linia
if (!fs.existsSync(FITXER_BIOS)) {
  avisa('R5', rel(FITXER_BIOS), "El BIOS no existix: no puc verificar les skills transversals obligatòries.");
} else {
  const cruBios = fs.readFileSync(FITXER_BIOS, 'utf8').split(/\r?\n/);
  let dins = false;
  for (const [i, linia] of cruBios.entries()) {
    if (/skills?\s+transversals?\s+obligat/i.test(linia)) { dins = true; continue; }
    if (dins && /^#{1,6}\s/.test(linia)) dins = false;
    if (!dins) continue;
    const m = /^\s*\d+\.\s*`([a-z0-9][a-z0-9._-]*)`/i.exec(linia);
    if (m) obligatories.set(m[1], i + 1);
  }
}

/* ─────────────────────────────── Lleis ─────────────────────────────── */

const noms = new Set([...declarades.keys(), ...alDisc.keys()]);

/* R1 · Fantasmes: declarades sense carpeta */
for (const [nom, info] of declarades) {
  if (alDisc.has(nom)) continue;
  const semblant = [...alDisc.keys()].find((d) => d.endsWith(`-${nom}`) || nom.endsWith(`-${d}`) || d === nom.replace(/^[a-z]+-/, ''));
  if (semblant) {
    falla('R11', nom,
      `El registre (línia ${info.linia}) declara '${nom}' però al disc hi ha '${semblant}'. Un carregador per nom erra la skill sencera per un prefix.`);
  } else {
    falla('R1', nom, `Declarada al registre (línia ${info.linia}) i sense carpeta al disc. Fantasma.`);
  }
}

/* R2 · Clandestines: al disc sense declarar */
for (const nom of alDisc.keys()) {
  if (declarades.has(nom)) continue;
  const alias = [...declarades.keys()].some((d) => d.endsWith(`-${nom}`) || nom.endsWith(`-${d}`));
  if (alias) continue; // ja reportada com a R11
  falla('R2', nom, "Existix al disc i el registre que es diu 'únic registre oficial' no la declara. Es carregarà sense governança.");
}

/* R4 · nom del frontmatter ≠ carpeta | R7 frontmatter | R8 estat | R9 stub | R10 conflictes */
const triggers = new Map(); // trigger → [skills]

for (const [nom, { fm, ruta, cru }] of alDisc) {
  if (fm.malformat) {
    falla('R7', nom, `Frontmatter malformat a ${rel(ruta)} (obri \`---\` i no tanca). El RAG el descarta en silenci.`);
    continue;
  }
  if (!fm.hiHa) {
    falla('R7', nom, `${rel(ruta)} no té frontmatter. Sense \`name\` ni \`status\` no és carregable de forma determinista.`);
    continue;
  }

  const d = fm.dades;

  if (!d.name) {
    falla('R4', nom, "El frontmatter no declara `name:`.");
  } else if (String(d.name) !== nom) {
    falla('R4', nom, `El frontmatter diu \`name: ${d.name}\` i la carpeta es diu '${nom}'. Dos identificadors per a la mateixa skill.`);
  }

  const estat = String(d.status || d.estat || '').toLowerCase();
  if (!estat) {
    falla('R8', nom, "Sense `status:`. Una skill sense estat no es pot arxivar ni desactivar mai.");
  } else if (!ESTATS_VALIDS.has(estat)) {
    falla('R8', nom, `\`status: ${estat}\` no és del vocabulari permés (${[...ESTATS_VALIDS].join(', ')}).`);
  }

  if (ESTATS_ACTIUS.has(estat)) {
    const cosUtil = fm.cos.replace(/^#.*$/gm, '').replace(/\s+/g, ' ').trim();
    if (cosUtil.length < MINIM_COS) {
      falla('R9', nom,
        `Activa (\`${estat}\`) amb només ${cosUtil.length} caràcters de cos útil (mínim ${MINIM_COS}). És un stub que es declara operatiu.`);
    }
  }

  const llistaTriggers = []
    .concat(d.triggers_ca || [], d.triggers || [], d.triggers_on || [])
    .flatMap((t) => String(t).split(',').map((x) => x.trim().toLowerCase()))
    .filter(Boolean);

  for (const t of llistaTriggers) {
    if (t === nom) continue; // `triggers_on: [<nom propi>]` és autoreferència, no col·lisió
    if (!triggers.has(t)) triggers.set(t, []);
    triggers.get(t).push(nom);
  }

  for (const c of [].concat(d.conflicts_with || [])) {
    const cn = String(c).trim();
    if (!cn) continue;
    if (!noms.has(cn)) {
      falla('R10', nom, `\`conflicts_with: ${cn}\` apunta a una skill que no existix ni al disc ni al registre.`);
    }
  }
}

/* R3 · triggers duplicats */
for (const [t, quines] of triggers) {
  if (quines.length < 2) continue;
  falla('R3', t,
    `Trigger compartit per ${quines.length} skills: ${quines.join(', ')}. El registre promet rebutjar-ho «categòricament» i no ho fa. La resolució queda a l'atzar de l'ordre de càrrega.`);
}

/* R5 / R6 · obligacions del BIOS */
for (const [nom, linia] of obligatories) {
  if (!alDisc.has(nom)) {
    falla('R5', nom,
      `El BIOS (línia ${linia}) la declara transversal OBLIGATÒRIA sota tancament fort i no existix al disc. O el sistema hauria de bloquejar-se sempre, o la regla és decorativa.`);
  }
  if (!declarades.has(nom)) {
    falla('R6', nom, `Obligatòria segons el BIOS (línia ${linia}) i absent del registre canònic.`);
  }
}

/* ─────────────────────────────── Eixida ─────────────────────────────── */

const resum = {
  cervell: CERVELL,
  declarades: declarades.size,
  alDisc: alDisc.size,
  interseccio: [...declarades.keys()].filter((n) => alDisc.has(n)).length,
  obligatoriesBios: obligatories.size,
  problemes: problemes.length,
  avisos: avisos.length,
};

if (JSON_OUT) {
  console.log(JSON.stringify({ resum, problemes, avisos }, null, 2));
  process.exit(problemes.length > 0 || (AVISOS_FATALS && avisos.length > 0) ? 1 : 0);
}

console.log(`\n🧠 [REGISTRE] Cervell: ${CERVELL}`);
console.log(`   Registre declara ${resum.declarades} · disc en té ${resum.alDisc} · coincidixen ${resum.interseccio}`);
if (resum.declarades > 0) {
  const exactitud = Math.round((resum.interseccio / resum.declarades) * 100);
  console.log(`   Exactitud del registre: ${exactitud}%`);
}
console.log(`   BIOS exigix ${resum.obligatoriesBios} skills transversals\n`);

const perLlei = new Map();
for (const p of problemes) {
  if (!perLlei.has(p.llei)) perLlei.set(p.llei, []);
  perLlei.get(p.llei).push(p);
}

for (const [llei, llista] of [...perLlei].sort()) {
  console.log(`  ── ${llei} (${llista.length}) ─────────────────────────────`);
  for (const p of llista) console.log(`   · ${p.subjecte}: ${p.missatge}`);
  console.log('');
}

for (const a of avisos) console.log(`  ⚠️  ${a.llei} ${a.subjecte}: ${a.missatge}`);
if (avisos.length) console.log('');

if (problemes.length > 0 || (AVISOS_FATALS && avisos.length > 0)) {
  console.error(`❌ [REGISTRE] ${problemes.length} divergències. El cervell declarat i el cervell real no són el mateix.\n`);
  process.exit(1);
}

console.log('✅ [REGISTRE] El registre, el disc, els frontmatters i el BIOS diuen el mateix.\n');
process.exit(0);
