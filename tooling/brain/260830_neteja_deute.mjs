#!/usr/bin/env node
/**
 * 260830_neteja_deute.mjs — El deute oblidat de l'auditoria 260830.
 *
 * Cinc arranjaments que no encaixaven en cap altra passada. Tots idempotents,
 * tots amb dry-run per defecte, tots fail-closed.
 *
 *   N1 · plantilla_prompt_iso.md — fitxer fantasma de 0 bytes
 *   N2 · .agents/ESTAT.md — cita `estela.sh`, esborrat del repositori
 *   N3 · .agents/manifest.yaml — 3 de 3 punters morts
 *   N4 · cog-deliberation — depén d'una skill que no existix
 *   N5 · seo-routes.json — cap porta comprovava que el build s'haguera fet
 *
 * ÚS
 *   node tooling/brain/260830_neteja_deute.mjs
 *   node tooling/brain/260830_neteja_deute.mjs --aplica [--copia-seguretat]
 */

import fs from 'node:fs';
import path from 'node:path';
import { R, rel, CAMINS, arrelSegura, diagnostic, ErrorArrel } from '../lib/arrel.mjs';

const ARGS = process.argv.slice(2);
const APLICA = ARGS.includes('--aplica');
const COPIA = ARGS.includes('--copia-seguretat');

const pendents = new Map();   // ruta → contingut nou
const aEsborrar = new Set();  // rutes a llevar del disc
const registre = [];

const existix = (r) => fs.existsSync(R(r));
const llegeix = (r) => (pendents.has(r) ? pendents.get(r) : fs.readFileSync(R(r), 'utf8'));
const posa = (r, t) => pendents.set(r, t);
const nota = (id, estat, detall, llista) => registre.push({ id, estat, detall, llista });

/* ═══════════════════════ N1 · Fitxer fantasma ═══════════════════════ */
/*
 * `plantilla_prompt_iso.md` fa 0 bytes. Un fitxer buit dins de la Wiki és
 * pitjor que un fitxer absent: apareix als índexs, es menja una entrada al RAG,
 * i qui el busca creu que la plantilla existix i està incompleta.
 *
 * Hi ha una plantilla germana amb el mateix propòsit i contingut real:
 * `02_ACTUAR_Maquina_Tecnica/plantilles/PLANTILLA_ISO_SDP.md`. La resolució és
 * esborrar el fantasma i, si algú el citava, apuntar-lo a la de veres.
 */
{
  const fantasma = '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/07_plantilles/plantilla_prompt_iso.md';
  const bona = '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/plantilles/PLANTILLA_ISO_SDP.md';

  if (!existix(fantasma)) {
    nota('N1', 'JA-FET', 'el fantasma ja no hi és');
  } else if (fs.statSync(R(fantasma)).size > 0) {
    nota('N1', 'CANVIAT-NO', `${fantasma} ja té contingut; no el toque`);
  } else {
    aEsborrar.add(fantasma);
    // Reapuntar qui el citava.
    const citadors = [];
    (function camina(d) {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        if (['node_modules', '.git', '90_historic'].includes(e.name)) continue;
        const c = path.join(d, e.name);
        if (e.isDirectory()) { camina(c); continue; }
        // Només documentació: reescriure cites dins de codi o de dades de
        // contingut seria tocar coses que no són l'objectiu. I s'exclou aquest
        // mateix script, que cita el fantasma per ofici.
        if (!e.name.endsWith('.md')) continue;
        const r = rel(c);
        if (r === fantasma || r.startsWith('tooling/')) continue;
        const t = llegeix(r);
        if (t.includes('plantilla_prompt_iso')) {
          posa(r, t.replace(/plantilla_prompt_iso(\.md)?/g, existix(bona) ? 'PLANTILLA_ISO_SDP.md' : 'PLANTILLA_ISO_SDP'));
          citadors.push(r);
        }
      }
    }(arrelSegura()));
    nota('N1', 'CANVIAT', `esborrar ${fantasma} (0 bytes)`,
      citadors.length ? citadors.map((c) => `reapuntat: ${c}`) : ['ningú el citava']);
  }
}

/* ═══════════════════════ N2 · estela.sh a ESTAT.md ═══════════════════════ */
/*
 * L'ESTAT.md cita un forat P0 a `tooling/gates/estela.sh`. El fitxer es va
 * esborrar (correctament: era la referència insegura que Codex va marcar) però
 * la cita va quedar. `tractor-doctrina` la marca com a camí inexistent en cada
 * execució, i qui llig l'ESTAT busca un fitxer que no trobarà.
 */
{
  const f = CAMINS.estat;
  if (!existix(f)) nota('N2', 'ABSENT', `${f} no existix`);
  else {
    const t = llegeix(f);
    if (!t.includes('estela.sh')) nota('N2', 'JA-FET', 'ESTAT.md ja no cita estela.sh');
    else {
      posa(f, t.replace(
        /Codex ha assenyalat un forat P0 a `estela\.sh`[^\n]*/,
        'Codex va assenyalar un forat P0 a l\'script de time-machine; '
        + "l'script es va eliminar i l'entrada d'npm també (auditoria 260830).",
      ).replace(/`estela\.sh`/g, "l'antic script de time-machine (eliminat)"));
      nota('N2', 'CANVIAT', 'cita a estela.sh substituïda per la resolució real');
    }
  }
}

/* ═══════════════════════ N3 · manifest.yaml ═══════════════════════ */
/*
 * Els tres punters del manifest apunten a fitxers inexistents:
 *   identity/PROFILE.md            → el real és .agents/PROFILE.md
 *   skills/socdepoble-operate/     → no existix; el flux real és socdepoble-workflow
 *   skills/socdepoble-civic/       → no existix
 *
 * Es reescriu el manifest amb les 13 skills reals, llegides del disc. Així el
 * manifest deixa de ser una llista escrita a mà que es desincronitza sola.
 */
{
  const f = CAMINS.manifest;
  const dirSkills = R(CAMINS.skills);
  if (!fs.existsSync(dirSkills)) nota('N3', 'ABSENT', `${CAMINS.skills} no existix`);
  else {
    const skills = fs.readdirSync(dirSkills, { withFileTypes: true })
      .filter((e) => e.isDirectory() && fs.existsSync(path.join(dirSkills, e.name, 'SKILL.md')))
      .map((e) => `skills/${e.name}/SKILL.md`)
      .sort();

    const perfil = existix('.agents/PROFILE.md') ? 'PROFILE.md' : null;
    const nou = [
      '# Manifest d\'agents de Sóc de Poble.',
      '#',
      '# Generat des del disc per tooling/brain/260830_neteja_deute.mjs.',
      '# Abans d\'aquesta data els tres punters apuntaven a fitxers inexistents',
      '# (identity/PROFILE.md, skills/socdepoble-operate, skills/socdepoble-civic)',
      '# i cap porta ho comprovava.',
      '#',
      '# Regla: aquest fitxer llista el que hi ha al disc. Si afiges una skill,',
      '# regenera\'l; no l\'edites a mà.',
      '',
      'schema: socdepoble.manifest.v1',
      ...(perfil ? [`identity: ${perfil}`] : []),
      'bios: AGENTS.md',
      'baseline: BASELINE.md',
      'index_skills: skills/00_INDEX_SKILLS.md',
      'skills:',
      ...skills.map((s) => `  - ${s}`),
      '',
    ].join('\n');

    if (existix(f) && llegeix(f) === nou) nota('N3', 'JA-FET', 'el manifest ja quadra amb el disc');
    else {
      posa(f, nou);
      nota('N3', 'CANVIAT', `manifest regenerat amb ${skills.length} skills reals`,
        ['punters morts llevats: identity/PROFILE.md, skills/socdepoble-operate, skills/socdepoble-civic']);
    }
  }
}

/* ═══════════════════════ N4 · cog-deliberation ═══════════════════════ */
/*
 * `cog-deliberation` declara `requires: core-evidence-calibration`, una skill
 * que no existix i que mai ha existit al repositori. Una dependència morta en
 * un graf de skills és pitjor que cap dependència: qui implemente un carregador
 * que resolga `requires` es trobarà un forat en temps d'execució.
 *
 * Les skills que SÍ existeixen i cobrixen eixe paper són `core-verified-change`
 * (evidència abans de canviar) i `actitud-dafo` (calibratge i humilitat).
 */
{
  const f = '.agents/skills/cog-deliberation/SKILL.md';
  if (!existix(f)) nota('N4', 'ABSENT', `${f} no existix`);
  else {
    const t = llegeix(f);
    if (!t.includes('core-evidence-calibration')) nota('N4', 'JA-FET', 'la dependència morta ja no hi és');
    else {
      const viu = (n) => existix(`.agents/skills/${n}/SKILL.md`);
      const reemplaç = ['core-verified-change', 'actitud-dafo'].filter(viu);
      posa(f, t.replace(
        /^requires:\n- core-evidence-calibration$/m,
        reemplaç.length ? `requires:\n${reemplaç.map((r) => `- ${r}`).join('\n')}` : 'requires: []',
      ));
      nota('N4', 'CANVIAT', 'core-evidence-calibration → ' + (reemplaç.join(', ') || '[]'),
        ['cap skill del repositori es deia core-evidence-calibration']);
    }
  }
}

/* ═══════════════════════ N5 · Porta de build previ ═══════════════════════ */
/*
 * `tractor-consell` L8 falla perquè falta `wordpress-plugin/dist/seo-routes.json`.
 * És un artefacte generat per `npm run build:seo`, així que en un repositori net
 * SEMPRE falta i la porta SEMPRE està roja. El resultat és que ningú se la mira.
 *
 * L'arranjament no és crear el fitxer: és distingir «no s'ha construït» de
 * «s'ha construït malament». Es genera una porta petita que es pot posar
 * davant del desplegament i que diu exactament quina ordre falta.
 */
{
  const f = 'tooling/gates/tractor-build-previ.mjs';
  const codi = `#!/usr/bin/env node
/**
 * tractor-build-previ.mjs — Cap desplegament sense artefactes.
 *
 * PER QUÈ: \`tractor-consell\` L8 exigix wordpress-plugin/dist/seo-routes.json.
 * És un artefacte de build, així que en un clon net sempre falta i la porta
 * sempre és roja. Una porta sempre roja és una porta que ningú mira.
 *
 * Aquesta separa els dos casos:
 *   · l'artefacte no hi és      → diu QUINA ordre el genera (informatiu en dev)
 *   · l'artefacte hi és però és → error dur: s'ha construït malament
 *     invàlid o més vell que la font
 *
 * ÚS
 *   node tooling/gates/tractor-build-previ.mjs            # avisa
 *   node tooling/gates/tractor-build-previ.mjs --desplega # exigix, fail-closed
 */

import fs from 'node:fs';
import { R, rel, arrelSegura, diagnostic, ErrorArrel } from '../lib/arrel.mjs';

const DESPLEGA = process.argv.includes('--desplega');

/** artefacte → { ordre que el genera, fonts de les quals ha de ser més nou } */
const ARTEFACTES = [
  {
    cami: 'wordpress-plugin/dist/seo-routes.json',
    ordre: 'npm run build:seo',
    valida: (t) => { const j = JSON.parse(t); return Array.isArray(j) ? j.length > 0 : Object.keys(j).length > 0; },
    fonts: ['src/config/navigation.js', 'src/config/sections.js'],
  },
  {
    cami: 'wordpress-plugin/dist/soc-de-poble.standalone.js',
    ordre: 'npm run build:wp',
    valida: (t) => t.length > 1000,
    fonts: ['src/main.jsx', 'src/PedraSecaEmbed.jsx'],
  },
];

const problemes = [];
const avisos = [];

for (const a of ARTEFACTES) {
  const abs = R(a.cami);
  if (!fs.existsSync(abs)) {
    (DESPLEGA ? problemes : avisos).push({ a, què: 'absent', com: \`executa: \${a.ordre}\` });
    continue;
  }
  let text;
  try { text = fs.readFileSync(abs, 'utf8'); } catch (e) {
    problemes.push({ a, què: 'il·legible', com: e.message }); continue;
  }
  try {
    if (!a.valida(text)) { problemes.push({ a, què: 'buit o invàlid', com: \`torna a executar: \${a.ordre}\` }); continue; }
  } catch (e) {
    problemes.push({ a, què: \`no valida (\${e.message})\`, com: \`torna a executar: \${a.ordre}\` }); continue;
  }
  const mtimeArt = fs.statSync(abs).mtimeMs;
  const antics = a.fonts.filter((f) => fs.existsSync(R(f)) && fs.statSync(R(f)).mtimeMs > mtimeArt);
  if (antics.length) {
    problemes.push({ a, què: \`caducat: \${antics.join(', ')} són més nous\`, com: \`torna a executar: \${a.ordre}\` });
  }
}

try {
  const d = diagnostic();
  if (d.error) { console.error(d.error.informe()); process.exit(2); }

  console.log(\`\\n🏗️  TRACTOR DE BUILD PREVI\\n   Arrel: \${arrelSegura()}\`);
  console.log('─'.repeat(72));
  for (const a of ARTEFACTES) {
    const mal = problemes.find((p) => p.a === a) ?? avisos.find((p) => p.a === a);
    if (!mal) { console.log(\`  ✅ \${a.cami}\`); continue; }
    console.log(\`  \${problemes.includes(mal) ? '❌' : '⚪'} \${a.cami} — \${mal.què}\`);
    console.log(\`       ↳ \${mal.com}\`);
  }
  console.log('─'.repeat(72));
  if (problemes.length) {
    console.error(\`\\n❌ \${problemes.length} artefacte(s) sense construir o caducats.\`);
    console.error('   sdp_resolve_request() tornaria 404 en TOTES les rutes React.\\n');
    process.exit(1);
  }
  if (avisos.length) {
    console.log(\`\\n⚪ \${avisos.length} artefacte(s) no construïts. Normal en desenvolupament.\`);
    console.log('   Abans de desplegar: node tooling/gates/tractor-build-previ.mjs --desplega\\n');
  } else {
    console.log('\\n✅ Tots els artefactes hi són, són vàlids i són més nous que les fonts.\\n');
  }
  process.exit(0);
} catch (err) {
  if (err instanceof ErrorArrel) { console.error(err.informe()); process.exit(2); }
  console.error(\`\\n❌ [BUILD-PREVI] Error inesperat: \${err.message}\\n\`);
  process.exit(2);
}
`;
  if (existix(f) && llegeix(f) === codi) nota('N5', 'JA-FET', 'la porta ja existix');
  else { posa(f, codi); nota('N5', 'CANVIAT', `crear ${f}`, ['distingix "no construït" de "construït malament"']); }
}

/* ═══════════════════════ Informe ═══════════════════════ */

function principal() {
  const d = diagnostic();
  if (d.error) { console.error(d.error.informe()); return 2; }

  console.log('\n🧽 NETEJA DE DEUTE 260830');
  console.log(`   Arrel: ${arrelSegura()}`);
  console.log(`   Mode : ${APLICA ? 'APLICA' : 'SEC'}`);
  console.log('─'.repeat(72));

  const icona = { CANVIAT: '🩹', 'JA-FET': '✅', ABSENT: '⚪', 'CANVIAT-NO': '⚠️ ' };
  for (const r of registre) {
    console.log(`  ${icona[r.estat] ?? '·'} ${r.id} · ${r.detall}`);
    for (const x of r.llista ?? []) console.log(`        · ${x}`);
  }
  console.log('─'.repeat(72));

  const total = pendents.size + aEsborrar.size;
  if (!total) { console.log('\n✅ Res a fer: tot el deute ja estava net.\n'); return 0; }
  if (!APLICA) {
    console.log(`\n${pendents.size} fitxer(s) a modificar, ${aEsborrar.size} a esborrar:`);
    for (const f of pendents.keys()) console.log(`   ✍️  ${f}`);
    for (const f of aEsborrar) console.log(`   🗑️  ${f}`);
    console.log('\nExecuta amb --aplica.\n');
    return 0;
  }

  for (const [f, t] of pendents) {
    const abs = R(f);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    if (COPIA && fs.existsSync(abs)) fs.copyFileSync(abs, `${abs}.abans-260830`);
    fs.writeFileSync(`${abs}.tmp`, t, 'utf8');
    fs.renameSync(`${abs}.tmp`, abs);
    console.log(`   ✍️  ${f}`);
  }
  for (const f of aEsborrar) {
    const abs = R(f);
    // Zona prohibida (AGENTS.md §5): mai destructiu. Es mou a quarantena.
    const quarantena = R('_wiki_de_poble/.quarantena-260830');
    fs.mkdirSync(quarantena, { recursive: true });
    fs.renameSync(abs, path.join(quarantena, path.basename(f)));
    console.log(`   🗑️  ${f} → _wiki_de_poble/.quarantena-260830/`);
  }
  console.log(`\n✅ ${total} element(s) nets. Apunta-ho al LEDGER abans de tancar.\n`);
  return 0;
}

try {
  process.exit(principal());
} catch (err) {
  if (err instanceof ErrorArrel) { console.error(err.informe()); process.exit(2); }
  console.error(`\n❌ [NETEJA] Avortat sense escriure: ${err.message}\n`);
  process.exit(1);
}
