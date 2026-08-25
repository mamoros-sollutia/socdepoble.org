#!/usr/bin/env node
/**
 * repara-comentaris-jsx.mjs — substitut de `tooling/brain/fix-inline.mjs`
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Lleva els 45 `// eslint-disable-next-line` que estan en posició de fill
 * JSX i que, per tant, es pinten com a text visible a la pantalla en 11
 * seccions: Control, Realitat, Traduccions, Dispositius, Mercat, Perfil,
 * Cerca, Mur, Text, PageDetail i la pàgina 404.
 *
 * DIFERÈNCIES AMB EL SCRIPT QUE VA CAUSAR EL PROBLEMA
 *
 *   fix-inline.mjs                     esta eina
 *   ──────────────────────────────     ─────────────────────────────────
 *   inserix comentaris                 els lleva
 *   sense dry-run                      assaig per defecte
 *   sense còpia                        instantània via Tanca
 *   sense rollback                     `tanca.mjs --desfer <id>`
 *   sense pressupost                   radi d'explosió declarat
 *   `scanDir(ROOT)` a l'import         guarda d'entrada
 *   no distingix posició JSX           només toca posició de fill
 *
 * Ús:
 *   node tooling/gates/repara-comentaris-jsx.mjs              # assaig
 *   node tooling/gates/repara-comentaris-jsx.mjs --procedeix  # aplica
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';
import { obriTanca, comentarisDinsJSX } from './tanca.mjs';

const ARREL = (() => {
  const i = process.argv.indexOf('--root');
  return path.resolve(i > -1 ? process.argv[i + 1] : process.cwd());
})();

function fitxersJSX(dir) {
  const eixida = [];
  const passeja = (d) => {
    for (const nom of readdirSync(d)) {
      if (nom === 'node_modules' || nom.startsWith('.')) continue;
      const p = path.join(d, nom);
      if (statSync(p).isDirectory()) passeja(p);
      else if (nom.endsWith('.jsx')) eixida.push(p);
    }
  };
  passeja(dir);
  return eixida;
}

/** Lleva NOMÉS les línies marcades pel detector. La resta no es toca. */
function llevarComentaris(codi, marcades) {
  const aLlevar = new Set(marcades.map((m) => m.linia));
  return codi
    .split('\n')
    .filter((_, i) => !aLlevar.has(i + 1))
    .join('\n');
}

async function principal() {
  const src = path.join(ARREL, 'src');
  if (!existsSync(src)) {
    console.error(`No hi ha ${src}. Passa --root <arrel del repo>.`);
    return 2;
  }

  const tanca = await obriTanca({
    arrel: ARREL,
    nom: 'repara-comentaris-jsx',
    argv: process.argv,
    pressupost: { maxFitxers: 20, maxLiniesPerFitxer: 60, maxPercentFitxer: 15 }
  });

  let totalLinies = 0;

  for (const abs of fitxersJSX(src)) {
    const codi = readFileSync(abs, 'utf8');
    const marcades = comentarisDinsJSX(codi);
    if (!marcades.length) continue;

    const rel = path.relative(ARREL, abs).split(path.sep).join('/');
    console.log(`  ${rel}: ${marcades.length} línia(es) → ${marcades.map((m) => m.linia).join(', ')}`);
    totalLinies += marcades.length;

    await tanca.escriu(rel, llevarComentaris(codi, marcades));
  }

  if (!totalLinies) {
    console.log('Cap comentari en posició de fill JSX. Res a reparar.');
    return 0;
  }

  console.log(`\n  Total: ${totalLinies} línies en ${tanca.pendents.length} fitxers.`);
  await tanca.tanca();
  return 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  principal()
    .then((codi) => process.exit(codi))
    .catch((err) => {
      console.error(`\n❌ ${err.codi || 'ERROR'}: ${err.message}`);
      if (err.dades?.problemes) for (const p of err.dades.problemes) console.error(`   ↳ ${p}`);
      if (err.dades?.excessos) for (const e of err.dades.excessos) console.error(`   ↳ ${e}`);
      process.exit(1);
    });
}
