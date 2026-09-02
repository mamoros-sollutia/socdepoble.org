#!/usr/bin/env node
/**
 * tooling/brain/reparar_frontmatter_skills.mjs — desfà el destrossall de 260901.
 *
 * QUÈ VA PASSAR
 * ─────────────
 * L'operació que havia de deduplicar els gallets va llevar la clau que els
 * posseïa i va deixar els seus ítems penjant. Després va afegir `triggers_on: []`
 * al final i va enganxar la tanca del frontmatter a eixa mateixa línia:
 *
 *     triggers_on: []---
 *
 * Resultat mesurat sobre el farcell 260901_2031: 12 de 12 SKILL.md amb el
 * frontmatter obert i mai tancat, 8 amb `triggers_on: []`, i a
 * `core-higiene-reflexa` els gallets orfes absorbits dins de la llista
 * `eines_obligatories` (que és de camins, no de paraules).
 *
 * LLEIS QUE REPARA
 *   F1  TANCA-ENGANXADA  la tanca `---` va al final d'una línia de dades
 *   F2  ÍTEM-ORFE        ítem de llista citat sense clau que el posseïsca
 *   F3  LLISTA-BRUTA     ítems citats dins d'una llista de camins
 *   F4  GALLET-BUIT      `triggers_on: []` havent-hi ítems orfes recuperables
 *
 * COM DISTINGIX UN GALLET D'UN CAMÍ
 * Un camí no va citat i porta `/` o una extensió. Un gallet va entre cometes.
 * La regla és mecànica, no interpretativa: si algun dia falla, falla igual per
 * a tots i es veu.
 *
 * Pedra Seca: zero dependències, ESM, assaig en sec per defecte, fail-closed.
 *
 *   node tooling/brain/reparar_frontmatter_skills.mjs           # assaig en sec
 *   node tooling/brain/reparar_frontmatter_skills.mjs --escriu  # aplica
 *   node tooling/brain/reparar_frontmatter_skills.mjs --json
 */

import fs from 'node:fs';
import path from 'node:path';
import { arrelSegura, R } from '../lib/arrel.mjs';
import { splitFrontmatter } from '../wiki/lib/frontmatter.mjs';

const ESCRIU = process.argv.includes('--escriu');
const JSON_OUT = process.argv.includes('--json');

let ARREL;
try {
  ARREL = arrelSegura();
} catch (e) {
  console.error(e.informe ? e.informe() : String(e));
  process.exit(1);
}

const DIR_SKILLS = R('.agents/skills');
const CLAU_GALLET = 'triggers_on';

/** Una línia d'ítem de llista: `  - X` (amb X citat o no). */
const ITEM = /^(\s*)-\s+(.*)$/;
/** Una clau de nivell superior: `clau:` o `clau: valor`. */
const CLAU = /^([A-Za-z_][\w-]*)\s*:(.*)$/;
/** Un ítem citat és un gallet; un camí no va citat. */
const CITAT = /^["'].*["']$/;

function esCami(valor) {
  return !CITAT.test(valor) && (valor.includes('/') || /\.[a-z0-9]{2,4}$/i.test(valor));
}

/**
 * Desenganxa la tanca del frontmatter quan ha quedat cosida a una línia de
 * dades. Torna el text amb la tanca en línia pròpia.
 */
function desenganxaTanca(cru) {
  const linies = cru.split('\n');
  for (let i = 0; i < linies.length; i++) {
    const m = /^(.*\S)(---)\s*$/.exec(linies[i]);
    if (!m) continue;
    if (linies[i].trimStart().startsWith('#')) continue; // comentari YAML
    linies.splice(i, 1, m[1], '---');
    return { text: linies.join('\n'), reparat: true };
  }
  return { text: cru, reparat: false };
}

/**
 * Recull els ítems citats que no tenen clau propietària i els torna a penjar
 * de `triggers_on`. No inventa res: només mou el que ja hi era.
 */
function reallotjaOrfes(fm) {
  const linies = fm.split('\n');
  const eixida = [];
  const gallets = [];
  let clauActiva = null;    // clau que posseïx les línies següents
  let clauEsLlista = false; // `clau:` sense valor → admet ítems `- x`
  let dinsBloc = false;     // `clau: >` o `clau: |` → text lliure indentat
  let bloc = [];            // ítems acumulats de la llista oberta
  let orfes = 0;
  let netejats = 0;

  /**
   * Tanca la llista oberta. Una llista MIXTA (camins i paraules alhora) és el
   * rastre del destrossall: els camins s'hi queden, les paraules tornen als
   * gallets. Una llista homogènia no es toca mai, siga del tipus que siga.
   */
  function tancaBloc() {
    if (!bloc.length) { bloc = []; return; }
    if (clauActiva === CLAU_GALLET) {
      for (const b of bloc) gallets.push(b.valor);
      bloc = [];
      return;
    }
    const camins = bloc.filter((b) => esCami(b.valor)).length;
    const paraules = bloc.length - camins;
    if (camins > 0 && paraules > 0) {
      for (const b of bloc) {
        if (esCami(b.valor)) eixida.push(b.linia);
        else { gallets.push(b.valor); netejats++; }
      }
    } else {
      for (const b of bloc) eixida.push(b.linia);
    }
    bloc = [];
  }

  for (const linia of linies) {
    const mClau = CLAU.exec(linia);

    // Una clau al marge esquerre sempre tanca el que hi havia obert.
    if (mClau && !/^\s/.test(linia)) {
      tancaBloc();
      const nom = mClau[1];
      const valor = mClau[2].trim();
      clauActiva = nom;
      clauEsLlista = valor === '';
      dinsBloc = /^[>|][-+]?\d*$/.test(valor);

      if (nom === CLAU_GALLET) {
        if (valor.startsWith('[') && valor.endsWith(']')) {
          const dins = valor.slice(1, -1).trim();
          if (dins) for (const t of dins.split(',')) { const s = t.trim(); if (s) gallets.push(s); }
        }
        continue; // la clau destí es reconstruïx al final
      }
      eixida.push(linia);
      continue;
    }

    // Dins d'un escalar de bloc res és un ítem: és prosa.
    if (dinsBloc && /^\s+\S/.test(linia)) { eixida.push(linia); continue; }

    const mItem = ITEM.exec(linia);
    if (mItem) {
      const valor = mItem[2].trim();
      if (clauActiva !== null && clauEsLlista) {
        bloc.push({ linia, valor }); // es decidix quan es tanque la llista
      } else {
        // Cap clau el posseïx. En YAML això ja no és res: és un gallet perdut.
        gallets.push(valor);
        orfes++;
      }
      continue;
    }

    if (linia.trim() === '') { tancaBloc(); eixida.push(linia); dinsBloc = false; continue; }
    eixida.push(linia); // comentari o línia solta: es conserva tal qual
  }
  tancaBloc();

  // Els gallets es normalitzen a text citat i es desdupliquen sense distingir
  // majúscules: `IAIA` i `iaia` són el mateix gallet per al router.
  const vistos = new Set();
  const unics = [];
  for (const g of gallets) {
    const net = g.replace(/^["']|["']$/g, '').trim();
    if (!net) continue;
    const k = net.toLowerCase();
    if (vistos.has(k)) continue;
    vistos.add(k);
    unics.push(JSON.stringify(net));
  }

  let text = eixida.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd();
  text += `\n${CLAU_GALLET}: [${unics.join(', ')}]\n`;
  return { text, orfes, netejats, gallets: unics.length, duplicats: gallets.length - unics.length };
}

/* ═══════════════════════════ Execució ═══════════════════════════ */

if (!fs.existsSync(DIR_SKILLS)) {
  console.error(`\n❌ [FRONTMATTER] No hi ha ${path.relative(ARREL, DIR_SKILLS)}. Res a reparar.\n`);
  process.exit(1);
}

const informe = [];
for (const d of fs.readdirSync(DIR_SKILLS, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
  if (!d.isDirectory()) continue;
  const cami = path.join(DIR_SKILLS, d.name, 'SKILL.md');
  if (!fs.existsSync(cami)) continue;

  const original = fs.readFileSync(cami, 'utf8');
  const abans = splitFrontmatter(original);
  if (abans.hasFrontmatter && !abans.malformed) {
    informe.push({ skill: d.name, estat: 'ja-sa', canvis: [] });
    continue;
  }

  const { text: desenganxat, reparat } = desenganxaTanca(original);
  const tallat = splitFrontmatter(desenganxat);
  if (!tallat.hasFrontmatter) {
    informe.push({ skill: d.name, estat: 'IRRECUPERABLE', canvis: ['la tanca no s\'ha pogut restituir'] });
    continue;
  }

  const r = reallotjaOrfes(tallat.rawFrontmatter);
  const nou = `---\n${r.text}---\n${tallat.body.replace(/^\n+/, '\n')}`;

  const despres = splitFrontmatter(nou);
  const canvis = [];
  if (reparat) canvis.push('F1 tanca desenganxada');
  if (r.orfes) canvis.push(`F2 ${r.orfes} ítem(s) orfe(s) reallotjat(s)`);
  if (r.netejats) canvis.push(`F3 ${r.netejats} gallet(s) tret(s) d'una llista de camins`);
  if (r.duplicats) canvis.push(`F4 ${r.duplicats} duplicat(s) descartat(s)`);
  canvis.push(`${CLAU_GALLET}: ${r.gallets} gallet(s)`);

  if (despres.malformed || !despres.hasFrontmatter) {
    informe.push({ skill: d.name, estat: 'IRRECUPERABLE', canvis });
    continue;
  }

  if (ESCRIU) fs.writeFileSync(cami, nou, 'utf8');
  informe.push({ skill: d.name, estat: ESCRIU ? 'REPARAT' : 'reparable', canvis, gallets: r.gallets });
}

if (JSON_OUT) {
  process.stdout.write(JSON.stringify({ escrit: ESCRIU, informe }, null, 2) + '\n');
  process.exit(informe.some((i) => i.estat === 'IRRECUPERABLE') ? 1 : 0);
}

console.log('\n🩹 REPARADOR DE FRONTMATTER DE SKILLS');
console.log('────────────────────────────────────────────────────────────────────────');
console.log(`   ${ESCRIU ? 'MODE ESCRIPTURA' : 'assaig en sec (afig --escriu per a aplicar)'}\n`);
for (const i of informe) {
  const marca = { 'ja-sa': '·', reparable: '○', REPARAT: '✅', IRRECUPERABLE: '❌' }[i.estat];
  console.log(`  ${marca} ${i.skill.padEnd(30)} ${i.estat}`);
  for (const c of i.canvis) console.log(`      ↳ ${c}`);
}
const irrec = informe.filter((i) => i.estat === 'IRRECUPERABLE').length;
const tocats = informe.filter((i) => i.estat !== 'ja-sa').length;
console.log('\n────────────────────────────────────────────────────────────────────────');
console.log(`   ${tocats} skill(s) afectada(es) · ${irrec} irrecuperable(s)\n`);
process.exit(irrec ? 1 : 0);
