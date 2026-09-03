#!/usr/bin/env node
/**
 * tancar_scc_skills.mjs — Tanca el graf de skills en un sol component fortament connex.
 * Zero dependències. Fallada tancada.
 *
 * INVARIANT QUE IMPOSA:
 *   àncora → índex → skill   (ja existeix via 00_INDEX_IDENTITAT)
 *   skill  → àncora          (aquest script l'afegeix)
 * Amb les dues arestes, cada skill queda en un cicle de 2 amb l'àncora
 * i tot el conjunt col·lapsa en un únic SCC.
 *
 *   node tooling/wiki/tancar_scc_skills.mjs --check    (no escriu; ix 1 si falta res)
 *   node tooling/wiki/tancar_scc_skills.mjs --escriu   (aplica)
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, relative, basename, extname } from 'node:path';

const VAULT = '_wiki_de_poble';
const MIRALL = join(VAULT, '00_SER_Brain_Identitat', '00_AGENTS_I_SKILLS_MIRROR');
const ANCORA = '00_INDEX_ESCRIPTORI';
const ESCRIU = process.argv.includes('--escriu');

function llista(dir, acc = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) llista(p, acc);
    else if (extname(p) === '.md') acc.push(p);
  }
  return acc;
}

// ── 1. Injectar l'aresta de tornada a cada mirall ──────────────────────────
const miralls = readdirSync(MIRALL).filter(f => f.endsWith('.md')).map(f => join(MIRALL, f));
const mancances = [];

for (const ruta of miralls) {
  const text = readFileSync(ruta, 'utf8');
  if (text.includes(`[[${ANCORA}]]`)) continue;

  mancances.push(relative('.', ruta));
  if (!ESCRIU) continue;

  // Propietat de tipus enllaç al frontmatter: el graf només llig claudàtors.
  let nou;
  if (text.startsWith('---\n')) {
    const fi = text.indexOf('\n---', 3);
    nou = text.slice(0, fi) + `\nancora: "[[${ANCORA}]]"` + text.slice(fi);
  } else {
    nou = `---\nancora: "[[${ANCORA}]]"\n---\n` + text;
  }
  // I una aresta visible al cos, perquè el retroenllaç siga llegible per un humà.
  nou = nou.replace(/\n*$/, `\n\n> Torna a l'escriptori: [[${ANCORA}]]\n`);
  writeFileSync(ruta, nou, 'utf8');
}

// ── 2. Verificar l'SCC (Tarjan) sobre el graf resultant ────────────────────
const fitxers = llista(VAULT);
const clau = r => relative(VAULT, r).replace(/\.md$/, '');
const rutes = fitxers.map(clau);
const perRuta = new Map(rutes.map((r, i) => [r, i]));
const perNom = new Map();
rutes.forEach((r, i) => { const n = basename(r); if (!perNom.has(n)) perNom.set(n, i); });
const resol = t => {
  const s = t.trim().replace(/\.md$/i, '');
  return perRuta.has(s) ? perRuta.get(s) : (perNom.get(basename(s)) ?? -1);
};

const N = rutes.length;
const out = Array.from({ length: N }, () => new Set());
fitxers.forEach((f, i) => {
  for (const m of readFileSync(f, 'utf8').matchAll(/\[\[([^\]|#^]+)(?:[#^|][^\]]*)?\]\]/g)) {
    const j = resol(m[1]);
    if (j !== -1 && j !== i) out[i].add(j);
  }
});
const adj = out.map(s => [...s]);

const num = new Array(N).fill(-1), baix = new Array(N).fill(0), enPila = new Array(N).fill(false);
const pila = []; let c = 0; const sccs = [];
for (let a = 0; a < N; a++) {
  if (num[a] !== -1) continue;
  const w = [[a, 0]];
  while (w.length) {
    const marc = w[w.length - 1], v = marc[0], i = marc[1];
    if (i === 0) { num[v] = baix[v] = c++; pila.push(v); enPila[v] = true; }
    if (i < adj[v].length) {
      marc[1]++;
      const u = adj[v][i];
      if (num[u] === -1) w.push([u, 0]);
      else if (enPila[u]) baix[v] = Math.min(baix[v], num[u]);
    } else {
      if (baix[v] === num[v]) { const g = []; let x; do { x = pila.pop(); enPila[x] = false; g.push(x); } while (x !== v); sccs.push(g); }
      w.pop();
      if (w.length) { const p = w[w.length - 1][0]; baix[p] = Math.min(baix[p], baix[v]); }
    }
  }
}
const gran = sccs.slice().sort((a, b) => b.length - a.length)[0] ?? [];
const fora = rutes.filter((_, i) => !new Set(gran).has(i));

console.log(`Notes                  : ${N}`);
console.log(`Components FORTS (SCC) : ${sccs.length}`);
console.log(`SCC més gran           : ${gran.length}/${N} (${(100 * gran.length / N).toFixed(1)}%)`);
console.log(`Fora de l'SCC principal: ${fora.length}`);
if (fora.length) fora.forEach(r => console.log('   · ' + r));
if (mancances.length) {
  console.log(`\nMiralls sense aresta cap a l'àncora: ${mancances.length}`);
  mancances.forEach(r => console.log('   · ' + r));
}

// Fallada tancada: si queda alguna skill fora de l'SCC, la porta para.
const skillsFora = fora.filter(r => r.includes('00_AGENTS_I_SKILLS_MIRROR'));
if (skillsFora.length) {
  console.error(`\nPARAT. ${skillsFora.length} skill(s) fora de l'SCC principal.`);
  process.exit(1);
}
console.log('\nOK. Cap skill queda fora del component fortament connex.');

## Sinapsis Entrants (Autogenerat)

- [[00_INDEX_ESCRIPTORI|05_Escriptori_Soc_de_Poble/00_INDEX_ESCRIPTORI.md]] — [[tancar_scc_skills.mjs]]

<!-- FI SINAPSIS ENTRANTS - NO EDITAR MANUALMENT -->
