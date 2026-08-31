#!/usr/bin/env node
/**
 * 260830_purga_maquinari.mjs — Execució de la mort de l'A10.
 *
 * Aplica al disc la decisió declarada a `.agents/BASELINE.md` i verificada per
 * `tooling/gates/tractor-doctrina-maquinari.mjs`.
 *
 * QUÈ FA
 * ──────
 *   P1 · Reescriu les 19 contradiccions de doctrina (A10 → baseline 2022)
 *   P2 · Lleva els hacks CSS morts al baseline
 *   P3 · Lleva `ramMbMaxA10` de trellat-rules.json
 *   P4 · Triatge de les 126 regles CSS buides
 *
 * SOBRE EL PAS P4 — LLIG AÇÒ ABANS D'EXECUTAR
 * ───────────────────────────────────────────
 * `legacy-components.css` porta 126 regles buides sota una capçalera que ho
 * admet: «AFEGIT PER SUPERAR LA PORTA (STUBS)». Existeixen només perquè
 * `tractor-manual` comprova que tota classe del JSX existisca al CSS. Una
 * regla buida satisfà la comprovació sense donar cap estil: enganya la porta.
 *
 * L'anàlisi separa les 126 en dos munts:
 *
 *   · 52 MORTES  — cap JSX les usa. Es lleven sense conseqüències.
 *   · 74 VIVES   — el JSX les usa però no tenen estil. Llevar-les farà que
 *                  `tractor-manual` les marque com a òrfenes, que és la
 *                  VERITAT. Ara mateix la porta està verda perquè li menteixen.
 *
 * Per això P4 té dos modes:
 *   --purga-mortes   lleva només les 52. Segur. Recomanat com a primer pas.
 *   --purga-totes    lleva les 126 i deixa `tractor-manual` en roig honest,
 *                    amb la llista exacta del que cal estilar o llevar del JSX.
 *
 * Cap dels dos toca el JSX: decidir si una classe s'estila o es lleva és una
 * decisió de disseny, i aquest script no la pren per tu.
 *
 * ÚS
 *   node tooling/brain/260830_purga_maquinari.mjs                    # informe
 *   node tooling/brain/260830_purga_maquinari.mjs --aplica
 *   node tooling/brain/260830_purga_maquinari.mjs --aplica --purga-mortes
 *   node tooling/brain/260830_purga_maquinari.mjs --aplica --purga-totes
 *   node tooling/brain/260830_purga_maquinari.mjs --informe-orfes    # només la llista
 */

import fs from 'node:fs';
import path from 'node:path';
import { R, rel, EXCLOSOS, arrelSegura, diagnostic, ErrorArrel } from '../lib/arrel.mjs';

const ARGS = process.argv.slice(2);
const APLICA = ARGS.includes('--aplica');
const COPIA = ARGS.includes('--copia-seguretat');
const PURGA_MORTES = ARGS.includes('--purga-mortes') || ARGS.includes('--purga-totes');
const PURGA_TOTES = ARGS.includes('--purga-totes');
const NOMES_ORFES = ARGS.includes('--informe-orfes');

const pendents = new Map();
const registre = [];

const llegeix = (r) => (pendents.has(r) ? pendents.get(r) : fs.readFileSync(R(r), 'utf8'));
const marca = (r, t) => pendents.set(r, t);

/* ═══════════════════════ P1 · Doctrina ═══════════════════════ */

/**
 * Substitucions textuals. Cada una diu QUÈ i PER QUÈ; no són cerca-i-reemplaça
 * cega, són reescriptures de doctrina amb la redacció nova ja pensada.
 */
const DOCTRINA = [
  {
    fitxer: '_wiki_de_poble/00_SER_Brain_Identitat/01_IDENTITAT.md',
    canvis: [[
      /pren\s+iPad\s*A10\/Safari\s+com\s+a\s+s[oò]l\s+de\s+compatibilitat/gi,
      'pren el Baseline 2022 (Safari/iOS 16, Chrome 100) com a sòl de compatibilitat',
    ]],
  },
  {
    fitxer: '_wiki_de_poble/00_SER_Brain_Identitat/02_GENOTIP.md',
    canvis: [[
      /compatibles\s+amb\s+l[’']iPad\s*A10/gi,
      'compatibles amb el Baseline 2022',
    ]],
  },
  {
    fitxer: '_wiki_de_poble/00_SER_Brain_Identitat/el_projecte.md',
    canvis: [[
      /iPad\s*A10\s+i\s+Safari\s+s[oó]n\s+el\s+s[oò]l\s+de\s+disseny\./gi,
      'El Baseline 2022 (Safari/iOS 16, Chrome 100) és el sòl de disseny.',
    ]],
  },
  {
    fitxer: '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/00_arquitectura_tecnica_unificada.md',
    canvis: [[
      /iPad\s*A10\s+i\s+Safari\s+s[oó]n\s+el\s+s[oò]l\s+de\s+compatibilitat;\s*una\s+API\s+nova\s+necessita\s+detecci[oó]\s+i\s+fallback\s+lleuger\./gi,
      'El Baseline 2022 és el sòl de compatibilitat; una API disponible al baseline '
      + "s'usa directament, sense detecció ni fallback (vegeu `.agents/BASELINE.md`).",
    ]],
  },
  {
    fitxer: '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills/futur_adaptacio.md',
    canvis: [
      [/#\s*Adaptaci[oó]\s+futura\s+amb\s+veto\s+A10/gi, '# Adaptació futura amb veto de Baseline'],
      [/\*\*Veto\s+A10\.\*\*/gi, '**Veto de Baseline.**'],
      [/l[’']iPad\s*A10\s+mant[eé]\s+els\s+pressupostos\s+acordats\s+amb\s+dades\s+de\s+prova\./gi,
        'El dispositiu de referència del Baseline 2022 manté els pressupostos acordats amb dades de prova.'],
      [/en\s+el\s+dispositiu\s+de\s+refer[eè]ncia/gi, 'en el dispositiu de referència del Baseline 2022'],
    ],
  },
  {
    fitxer: '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills/a11y_seo_trellat.md',
    canvis: [
      [/En\s+homologar\s+una\s+vista\s+per\s+a\s+dispositius\s+antics,\s*especialment\s+l[’']iPad\s*A10\./gi,
        'En homologar una vista al dispositiu de referència del Baseline 2022.'],
      [/L[’']iPad\s*A10\s+[eé]s\s+el\s+tribunal\s+pr[aà]ctic\./gi,
        'El dispositiu de referència del Baseline 2022 és el tribunal pràctic.'],
    ],
  },
  {
    fitxer: '_wiki_de_poble/03_GOVERNAR_Normativa_Regles/FORJA_TO_CORE.md',
    canvis: [
      [/`sdp\s+test\s+--profile\s+ipad-a10`/gi, '`npm run porta`'],
      [/implementar\s+una\s+prova\s+reprodu[iï]ble\s+en\s+iPad\s*A10\/Safari;/gi,
        'implementar una prova reproduïble al Baseline 2022 (Safari/iOS 16);'],
    ],
  },
  {
    fitxer: '_wiki_de_poble/03_GOVERNAR_Normativa_Regles/ESTANDARD_UI_Universal.md',
    canvis: [[
      /compatibilitat\s+amb\s+iPad\s*A10/gi,
      'compatibilitat amb el Baseline 2022',
    ]],
  },
  {
    fitxer: '_wiki_de_poble/00_SER_Brain_Identitat/perfil_psiquiatric.md',
    canvis: [[
      /\*\*Ecotoxicologia\s+\(Pragmatisme\s+A10\)[:.]?\*\*[^\n]*/gi,
      '**Ecotoxicologia (Pragmatisme de Baseline):** Suportem el Baseline 2022. '
      + "Si suportar un motor concret ofega el projecte i genera deute, es puja el "
      + 'baseline amb una entrada al LEDGER, no amb pegats condicionals.',
    ]],
  },
  {
    fitxer: '_wiki_de_poble/00_SER_Brain_Identitat/03_Consola_Termodinamica.md',
    canvis: [
      [/`ramMbMaxA10:\s*1200`/g, '`ramMbMaxBaseline: 1200`'],
      [/RAM\s+d[’']iPad/gi, 'RAM del dispositiu de referència'],
    ],
  },
  {
    fitxer: '_wiki_de_poble/00_SER_Brain_Identitat/Soci_Sollutia.md',
    canvis: [
      [/validaci[oó]\s+iPad\s*A10/gi, 'validació al Baseline 2022'],
      [/Es\s+comprova\s+el\s+pes\s+real\s+en\s+iPad\s*A10\./gi,
        'Es comprova el pes real al dispositiu de referència del Baseline 2022.'],
    ],
  },
  {
    fitxer: '_wiki_de_poble/04_arquitectura_disseny/model_arquitectonic_pedra_seca_dola.md',
    canvis: [
      [/\*\*Optimitzaci[oó]\s+A10\*\*/gi, '**Optimització d\'Accessibilitat**'],
      [/l[’']optimitzaci[oó]\s+per\s+a\s+l[’']A10\s*\(Accessibilitat\s*10\)/gi,
        "l'optimització d'accessibilitat"],
    ],
  },
  {
    fitxer: '_wiki_de_poble/00_SER_Brain_Identitat/antigravity.md',
    canvis: [[/iPad\s*A10/gi, 'maquinari del Baseline 2022']],
  },
  {
    fitxer: '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/plantilles/PLANTILLA_ISO_SDP.md',
    canvis: [[/iPads?\s*A10/gi, 'el Baseline 2022']],
  },
  {
    fitxer: 'src/ARCHITECTURE.md',
    canvis: [[
      /Com\s+s[’']indica\s+al\s+LEDGER[^.]*\./,
      'Vegeu `.agents/BASELINE.md`, la declaració canònica.',
    ]],
  },
  {
    fitxer: 'src/data/outbox.js',
    canvis: [[/\(a\s+l[’']iPad\s*A10\s+aix[oò]\s+es\s+nota\)/gi, '(en maquinari modest això es nota)']],
  },
  {
    fitxer: 'src/PedraSecaEmbed.jsx',
    canvis: [[/\/\*\s*WebKit\s+legacy\s+pot\s+plorar\s*\*\//gi,
      '/* Safari pot queixar-se si el node ja no és a l\'arbre */']],
  },
  {
    fitxer: 'tooling/wiki/generar_petorreta_inversa.mjs',
    canvis: [[/,?\s*orientada\s+a\s+iPads?\s*A10/gi, ', orientada al Baseline 2022']],
  },
  {
    fitxer: 'tooling/wiki/core/edge_rag.mjs',
    canvis: [[/la\s+RAM\s+d[’']un\s+iPad\s*A10/gi, 'la RAM del dispositiu de referència']],
  },
];

/* ═══════════════════════ P2 · CSS mort ═══════════════════════ */

const CSS_MORT = [
  { re: /^\s*-webkit-overflow-scrolling\s*:[^;]*;\s*$/gm, què: '-webkit-overflow-scrolling (no fa res des d\'iOS 13)' },
  { re: /^\s*position\s*:\s*-webkit-sticky\s*;\s*$/gm, què: 'position: -webkit-sticky (sense prefix des de Safari 13)' },
  { re: /^\s*-ms-[a-z-]+\s*:[^;]*;\s*$/gm, què: 'prefixos -ms- (IE / Edge Legacy)' },
];

/* ═══════════════════════ P4 · Triatge de stubs ═══════════════════════ */

const RE_BUIDA = /^\s*([^{}\n]{1,200}?)\s*\{\s*\}\s*$/;

function classesDelJsx() {
  let tot = '';
  (function camina(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (EXCLOSOS.has(e.name)) continue;
      const c = path.join(d, e.name);
      if (e.isDirectory()) camina(c);
      else if (/\.(jsx?|mjs)$/.test(e.name)) tot += fs.readFileSync(c, 'utf8');
    }
  }(R('src')));
  return tot;
}

function triaStubs() {
  const jsx = classesDelJsx();
  const resultat = [];
  for (const fitxer of ['src/css/legacy-components.css', 'src/css/index.css']) {
    if (!fs.existsSync(R(fitxer))) continue;
    const linies = llegeix(fitxer).split('\n');
    for (let i = 0; i < linies.length; i += 1) {
      const m = RE_BUIDA.exec(linies[i]);
      if (!m || !/^[.#][\w-]/.test(m[1])) continue;
      const sel = m[1].trim();
      const nom = sel.replace(/^[.#]/, '').split(/[\s,:>+~[]/)[0];
      const viva = new RegExp(`["'\\s\`]${nom.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'\\s\`]`).test(jsx);
      resultat.push({ fitxer, linia: i + 1, selector: sel, nom, viva });
    }
  }
  return resultat;
}

/* ═══════════════════════ Execució ═══════════════════════ */

function passa1() {
  let n = 0;
  for (const d of DOCTRINA) {
    if (!fs.existsSync(R(d.fitxer))) { registre.push({ p: 'P1', f: d.fitxer, estat: 'ABSENT' }); continue; }
    let t = llegeix(d.fitxer);
    const abans = t;
    const fets = [];
    for (const [re, posa] of d.canvis) {
      if (re.test(t)) { t = t.replace(re, posa); fets.push(String(re).slice(0, 48)); }
      re.lastIndex = 0;
    }
    if (t !== abans) { marca(d.fitxer, t); n += fets.length; registre.push({ p: 'P1', f: d.fitxer, estat: 'CANVIAT', n: fets.length }); }
    else registre.push({ p: 'P1', f: d.fitxer, estat: 'JA-FET' });
  }
  return n;
}

function passa2() {
  let n = 0;
  for (const fitxer of ['src/css/index.css', 'src/css/legacy-components.css']) {
    if (!fs.existsSync(R(fitxer))) continue;
    let t = llegeix(fitxer);
    const abans = t;
    const fets = [];
    for (const { re, què } of CSS_MORT) {
      const trobats = t.match(re);
      if (trobats) { t = t.replace(re, ''); fets.push(`${trobats.length}× ${què}`); n += trobats.length; }
    }
    // Relabel: el bloc «OPTIMITZACIONS TERMODINÀMIQUES (iPad A10)» és `contain`,
    // que és bona pràctica general i no un hack de dispositiu.
    t = t.replace(/OPTIMITZACIONS TERMODIN[ÀA]MIQUES \(iPad A10\)/g, 'OPTIMITZACIONS DE RENDIMENT (containment)');
    if (t !== abans) { marca(fitxer, t); registre.push({ p: 'P2', f: fitxer, estat: 'CANVIAT', detall: fets }); }
    else registre.push({ p: 'P2', f: fitxer, estat: 'JA-FET' });
  }
  return n;
}

function passa3() {
  const f = 'tooling/wiki/rules/trellat-rules.json';
  if (!fs.existsSync(R(f))) { registre.push({ p: 'P3', f, estat: 'ABSENT' }); return 0; }
  const t = llegeix(f);
  if (!t.includes('ramMbMaxA10')) { registre.push({ p: 'P3', f, estat: 'JA-FET' }); return 0; }
  marca(f, t.replace(/"ramMbMaxA10"/g, '"ramMbMaxBaseline"'));
  registre.push({ p: 'P3', f, estat: 'CANVIAT', detall: ['ramMbMaxA10 → ramMbMaxBaseline'] });
  return 1;
}

function passa4(stubs) {
  if (!PURGA_MORTES) return 0;
  const aLlevar = stubs.filter((s) => (PURGA_TOTES ? true : !s.viva));
  let n = 0;
  const perFitxer = new Map();
  for (const s of aLlevar) {
    if (!perFitxer.has(s.fitxer)) perFitxer.set(s.fitxer, new Set());
    perFitxer.get(s.fitxer).add(s.linia);
  }
  for (const [fitxer, linies] of perFitxer) {
    const orig = llegeix(fitxer).split('\n');
    const noves = orig.filter((_, i) => !linies.has(i + 1));
    marca(fitxer, noves.join('\n'));
    n += linies.size;
    registre.push({ p: 'P4', f: fitxer, estat: 'CANVIAT', detall: [`${linies.size} regles buides llevades`] });
  }
  return n;
}

/* ═══════════════════════ Informe i escriptura ═══════════════════════ */

function principal() {
  const d = diagnostic();
  if (d.error) { console.error(d.error.informe()); return 2; }

  const stubs = triaStubs();
  const vives = stubs.filter((s) => s.viva);
  const mortes = stubs.filter((s) => !s.viva);

  if (NOMES_ORFES) {
    console.log(`\n📋 CLASSES SENSE ESTIL USADES AL JSX (${vives.length})`);
    console.log('   Cadascuna necessita CSS de veres, o desaparéixer del JSX.\n');
    for (const s of vives) console.log(`   ${s.fitxer}:${s.linia}  ${s.selector}`);
    console.log(`\n📋 REGLES BUIDES MORTES (${mortes.length}) — cap JSX les usa\n`);
    for (const s of mortes) console.log(`   ${s.fitxer}:${s.linia}  ${s.selector}`);
    console.log('');
    return 0;
  }

  console.log('\n🧹 PURGA DE MAQUINARI 260830 — Baseline 2022');
  console.log(`   Arrel: ${arrelSegura()}`);
  console.log(`   Mode : ${APLICA ? 'APLICA' : 'SEC'}${PURGA_TOTES ? ' · purga TOTES les regles buides' : PURGA_MORTES ? ' · purga només les mortes' : ''}`);
  console.log('─'.repeat(72));

  const n1 = passa1();
  const n2 = passa2();
  const n3 = passa3();
  const n4 = passa4(stubs);

  const grups = { P1: 'Doctrina', P2: 'CSS mort', P3: 'trellat-rules.json', P4: 'Regles CSS buides' };
  for (const [p, nom] of Object.entries(grups)) {
    const meus = registre.filter((r) => r.p === p);
    const canviats = meus.filter((r) => r.estat === 'CANVIAT');
    console.log(`  ${canviats.length ? '🩹' : '✅'} ${p} · ${nom}  (${canviats.length} fitxer(s))`);
    for (const r of canviats.slice(0, 6)) {
      console.log(`       ${r.f}${r.n ? ` — ${r.n} substitució(ns)` : ''}`);
      for (const x of r.detall ?? []) console.log(`         · ${x}`);
    }
    if (canviats.length > 6) console.log(`       … i ${canviats.length - 6} més`);
  }

  console.log('─'.repeat(72));
  console.log(`  Doctrina: ${n1} · CSS mort: ${n2} · regles: ${n3} · buides: ${n4}`);

  console.log(`\n  📊 Triatge de les ${stubs.length} regles CSS buides:`);
  console.log(`       ${mortes.length} mortes  — cap JSX les usa, es poden llevar ja`);
  console.log(`       ${vives.length} vives   — el JSX les usa però no tenen estil`);
  if (!PURGA_TOTES) {
    console.log('\n     Les vives no s\'han tocat. Llevar-les farà que tractor-manual les');
    console.log('     marque com a òrfenes, que és la veritat: ara està verd perquè li menten.');
    console.log('     Llista completa: --informe-orfes');
  }

  const aEscriure = [...pendents.keys()];
  if (!aEscriure.length) { console.log('\n✅ Res a fer.\n'); return 0; }
  if (!APLICA) {
    console.log(`\n${aEscriure.length} fitxer(s) es modificarien. Executa amb --aplica.\n`);
    return 0;
  }
  for (const [f, t] of pendents) {
    const abs = R(f);
    if (COPIA) fs.copyFileSync(abs, `${abs}.abans-260830`);
    const tmp = `${abs}.tmp`;
    fs.writeFileSync(tmp, t, 'utf8');
    fs.renameSync(tmp, abs);
    console.log(`   ✍️  ${rel(abs)}`);
  }
  console.log(`\n✅ ${aEscriure.length} fitxer(s) purgats.`);
  console.log('   Verifica: node tooling/gates/tractor-doctrina-maquinari.mjs');
  console.log('   I apunta-ho al LEDGER abans de tancar.\n');
  return 0;
}

try {
  process.exit(principal());
} catch (err) {
  if (err instanceof ErrorArrel) { console.error(err.informe()); process.exit(2); }
  console.error(`\n❌ [PURGA] Avortat sense escriure: ${err.message}\n`);
  process.exit(1);
}
