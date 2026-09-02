/**
 * resolutor.mjs — RESOLUCIÓ D'ENLLAÇOS AMB SEMÀNTICA D'OBSIDIAN
 *
 * PER QUÈ EXISTIX
 *   El resolutor antic feia `path.basename(desti)` i buscava pel nom curt.
 *   Amb 12 fitxers anomenats `SKILL.md`, `[[trellat/SKILL]]` resolia als DOTZE
 *   alhora. Prova mesurada 260901: pots llevar 11 dels 12 enllaços de l'índex
 *   de skills i el comptador d'orfes no es mou ni un dígit.
 *
 *   Obsidian resol pel sufix de ruta més llarg. Ací fem el mateix, i quan un
 *   nom curt és ambigu ho DIEM en compte d'inventar-nos dotze arestes.
 *
 * Pedra Seca: zero dependències, ESM, fail-closed.
 */

/** `[[Carpeta/Nom.md#secció|Àlies]]` → `Carpeta/Nom` */
export function netejaDesti(brut) {
  return String(brut)
    .split('|')[0]
    .split('#')[0]
    .trim()
    .replace(/\.md$/i, '')
    .replace(/^\.\//, '')
    .replace(/^\/+/, '');
}

/**
 * Índex de resolució per sufix de ruta, i opcionalment per àlies.
 * @param {string[]} nodes rutes relatives amb extensió
 * @param {Map<string,string[]>} [aliesPerNode] node → llista d'`aliases` del frontmatter.
 *        Obsidian resol `[[Àlies]]`. Si no els carregues, el resolutor
 *        declararà penjats enllaços que a Obsidian funcionen.
 */
export function construeixIndex(nodes, aliesPerNode = new Map()) {
  const perSufix = new Map();
  const afig = (clau, n) => {
    const k = clau.toLowerCase();
    if (!perSufix.has(k)) perSufix.set(k, new Set());
    perSufix.get(k).add(n);
  };
  for (const n of nodes) {
    const trossos = n.replace(/\.md$/i, '').split('/');
    for (let i = trossos.length - 1; i >= 0; i--) afig(trossos.slice(i).join('/'), n);
    for (const a of aliesPerNode.get(n) ?? []) if (a) afig(a, n);
  }
  return { perSufix, nodes: new Set(nodes) };
}

/** @returns {{ok:true,node:string}|{ok:false,motiu:'penjat'|'ambigu',candidats?:string[]}} */
export function resol(idx, brut) {
  const net = netejaDesti(brut);
  if (!net) return { ok: false, motiu: 'penjat' };
  const cand = idx.perSufix.get(net.toLowerCase());
  if (!cand || cand.size === 0) return { ok: false, motiu: 'penjat' };
  if (cand.size === 1) return { ok: true, node: [...cand][0] };
  return { ok: false, motiu: 'ambigu', candidats: [...cand].sort() };
}
