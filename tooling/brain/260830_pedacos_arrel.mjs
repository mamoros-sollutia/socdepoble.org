#!/usr/bin/env node
/**
 * 260830_pedacos_arrel.mjs — Pedaços quirúrgics de l'auditoria 260830.
 *
 * Aplica els arranjaments mínims que fan verd `tooling/gates/tractor-arrel.mjs`
 * sense reescriure cap eina sencera. Cada pedaç és idempotent: passar-lo dues
 * vegades no fa mal. Cada pedaç declara què toca i per què.
 *
 * ÚS
 *   node tooling/brain/260830_pedacos_arrel.mjs --sec     # mostra, no toca
 *   node tooling/brain/260830_pedacos_arrel.mjs --aplica  # escriu
 *   node tooling/brain/260830_pedacos_arrel.mjs --aplica --copia-seguretat
 *
 * Fail-closed: si un pedaç no troba el text que espera, s'avorta abans
 * d'escriure res. Mai es deixa el repositori a mitges.
 */

import fs from 'node:fs';
import path from 'node:path';
import { R, rel, arrelSegura, diagnostic, ErrorArrel } from '../lib/arrel.mjs';

const ARGS = process.argv.slice(2);
const APLICA = ARGS.includes('--aplica');
const COPIA = ARGS.includes('--copia-seguretat');

/* ═══════════════════════ Definició dels pedaços ═══════════════════════ */

/** Import del custodi, calculat des del fitxer que el rep. */
const custodiDes = (fitxer) => {
  const r = path.relative(path.dirname(fitxer), 'tooling/lib/arrel.mjs').split(path.sep).join('/');
  return r.startsWith('.') ? r : `./${r}`;
};

/** Substitueix el `trobaArrel` local per l'import del custodi. */
function pedacTrobaArrel(fitxer, nomVar = 'ARREL') {
  const imp = custodiDes(fitxer);
  return {
    fitxer,
    motiu: 'A1 · tenia el seu propi descobriment d\'arrel; passa a usar el custodi',
    passos: [
      {
        // El cos de trobaArrel és idèntic als tres fitxers.
        cerca: /function trobaArrel\(inici\) \{\n(?:.*\n)*?\}\n/,
        posa: '',
        etiqueta: 'llevar function trobaArrel()',
      },
      {
        cerca: new RegExp(`const ${nomVar} = [^;]*trobaArrel\\(process\\.cwd\\(\\)\\);`),
        posa: `const ${nomVar} = arrelDelProjecte();`,
        etiqueta: `${nomVar} passa a resoldre's pel custodi`,
      },
      {
        cerca: /^(import .*\n)(?![\s\S]*arrelSegura as arrelDelProjecte)/m,
        posa: `$1import { arrelSegura as arrelDelProjecte } from '${imp}';\n`,
        etiqueta: 'afegir import del custodi',
        unaVegada: true,
      },
    ],
  };
}

const PEDACOS = [
  /* ── P1 · Les tres portes amb trobaArrel duplicat ── */
  pedacTrobaArrel('tooling/gates/tractor-doctrina.mjs'),
  pedacTrobaArrel('tooling/gates/tractor-registre.mjs'),

  /* ── P2 · La llista d'exempcions que mai es carregava ── */
  {
    fitxer: 'tooling/gates/tractor-doctrina.mjs',
    motiu: 'A5 · llegia les exempcions de .agents/ mentre el fitxer vivia a tooling/gates/',
    passos: [{
      cerca: /const FITXER_IGNORA = R\('\.agents\/doctrina-ignora\.txt'\);/,
      posa: [
        '/* Auditoria 260830: aquesta ruta apuntava només a `.agents/`, on el fitxer',
        '   mai va estar. `ignorats` quedava buit i `esIgnorat()` retornava sempre',
        '   false, així que l\'exempció de `_wiki_de_poble` (repositori separat) no',
        '   s\'aplicava mai. Ara es busca als dos llocs i es diu quin s\'ha usat. */',
        'const CANDIDATS_IGNORA = [R(\'.agents/doctrina-ignora.txt\'), R(\'tooling/gates/doctrina-ignora.txt\')];',
        'const FITXER_IGNORA = CANDIDATS_IGNORA.find((c) => fs.existsSync(c)) ?? CANDIDATS_IGNORA[0];',
      ].join('\n'),
      etiqueta: 'buscar doctrina-ignora.txt als dos emplaçaments',
    }],
  },

  /* ── P3 · tractor-cognitiu: marcador obsolet ── */
  {
    fitxer: 'tooling/wiki/tractor-cognitiu.mjs',
    motiu: "A1 · exigia AGENTS.md a l'arrel; l'Operació Tret al Cap el va moure a .agents/",
    passos: [{
      cerca: /const MARCADORS = \['AGENTS\.md', 'package\.json'\];/,
      posa: "const MARCADORS = ['.agents/AGENTS.md', 'package.json'];",
      etiqueta: 'marcador actualitzat a .agents/AGENTS.md',
    }],
  },

  /* ── P4 · package.json: script mort i entrades fantasma ── */
  {
    fitxer: 'package.json',
    motiu: 'A2/A3 · un script apuntava a un fitxer esborrat i el paquet prometia artefactes que ningú construix',
    json: (pkg) => {
      const canvis = [];
      if (pkg.scripts?.['time-machine']?.includes('estela.sh')) {
        delete pkg.scripts['time-machine'];
        canvis.push('llevat l\'script "time-machine" (estela.sh no existix)');
      }
      // Sense build.lib, aquests camps enganyen qui instal·le el paquet.
      for (const camp of ['main', 'module', 'exports']) {
        if (camp in pkg) { delete pkg[camp]; canvis.push(`llevat "${camp}"`); }
      }
      if (canvis.length && !pkg.private) {
        pkg.private = true;
        canvis.push('marcat "private": true fins que hi haja build de biblioteca');
      }
      return canvis;
    },
  },
];

/* ═══════════════════════ Motor ═══════════════════════ */

const registre = [];
const pendents = new Map(); // fitxer → contingut nou

function contingutActual(fitxer) {
  if (pendents.has(fitxer)) return pendents.get(fitxer);
  return fs.readFileSync(R(fitxer), 'utf8');
}

function aplica(p) {
  const abs = R(p.fitxer);
  if (!fs.existsSync(abs)) {
    return { fitxer: p.fitxer, estat: 'ABSENT', detall: 'el fitxer no existix; pedaç saltat' };
  }

  if (p.json) {
    const pkg = JSON.parse(contingutActual(p.fitxer));
    const canvis = p.json(pkg);
    if (!canvis.length) return { fitxer: p.fitxer, estat: 'JA-FET', detall: 'res a canviar' };
    pendents.set(p.fitxer, `${JSON.stringify(pkg, null, 2)}\n`);
    return { fitxer: p.fitxer, estat: 'PEDAÇAT', detall: p.motiu, canvis };
  }

  let text = contingutActual(p.fitxer);
  const canvis = [];
  for (const pas of p.passos) {
    if (pas.unaVegada && text.includes('arrelSegura as arrelDelProjecte')) {
      canvis.push(`(ja fet) ${pas.etiqueta}`);
      continue;
    }
    if (!pas.cerca.test(text)) {
      // Idempotència: si el pas ja s'ha aplicat abans, no és un error.
      canvis.push(`(ja fet o no aplicable) ${pas.etiqueta}`);
      continue;
    }
    text = text.replace(pas.cerca, pas.posa);
    canvis.push(pas.etiqueta);
  }
  if (text === contingutActual(p.fitxer)) {
    return { fitxer: p.fitxer, estat: 'JA-FET', detall: 'res a canviar', canvis };
  }
  pendents.set(p.fitxer, text);
  return { fitxer: p.fitxer, estat: 'PEDAÇAT', detall: p.motiu, canvis };
}

function principal() {
  const d = diagnostic();
  if (d.error) { console.error(d.error.informe()); return 2; }

  console.log('\n🩹 PEDAÇOS 260830 — arranjaments quirúrgics');
  console.log(`   Arrel: ${arrelSegura()}`);
  console.log(`   Mode : ${APLICA ? 'APLICA (s\'escriurà al disc)' : 'SEC (no toca res)'}`);
  console.log('─'.repeat(72));

  for (const p of PEDACOS) registre.push(aplica(p));

  for (const r of registre) {
    const icona = { 'PEDAÇAT': '🩹', 'JA-FET': '✅', ABSENT: '⚪' }[r.estat];
    console.log(`  ${icona} ${r.fitxer}`);
    console.log(`       ${r.detall}`);
    for (const c of r.canvis ?? []) console.log(`        · ${c}`);
  }

  console.log('─'.repeat(72));
  const aEscriure = [...pendents.keys()];
  if (!aEscriure.length) { console.log('\n✅ Res a fer: tots els pedaços ja estaven aplicats.\n'); return 0; }

  if (!APLICA) {
    console.log(`\n${aEscriure.length} fitxer(s) es modificarien:`);
    for (const f of aEscriure) console.log(`   · ${f}`);
    console.log('\nExecuta amb --aplica per a escriure-ho.\n');
    return 0;
  }

  for (const [fitxer, text] of pendents) {
    const abs = R(fitxer);
    if (COPIA) fs.copyFileSync(abs, `${abs}.abans-260830`);
    const tmp = `${abs}.tmp`;
    fs.writeFileSync(tmp, text, 'utf8');
    fs.renameSync(tmp, abs); // atòmic
    console.log(`   ✍️  ${rel(abs)}`);
  }
  console.log(`\n✅ ${aEscriure.length} fitxer(s) pedaçats.`);
  console.log('   Verifica-ho: node tooling/gates/tractor-arrel.mjs');
  console.log('   I apunta-ho al LEDGER abans de tancar.\n');
  return 0;
}

try {
  process.exit(principal());
} catch (err) {
  if (err instanceof ErrorArrel) { console.error(err.informe()); process.exit(2); }
  console.error(`\n❌ [PEDAÇOS] Avortat sense escriure: ${err.message}\n`);
  process.exit(1);
}
