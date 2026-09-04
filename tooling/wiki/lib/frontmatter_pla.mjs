/**
 * frontmatter_pla.mjs — LECTOR/ESCRIPTOR DE FRONTMATTER SENSE DEPENDÈNCIES
 *
 * PER QUÈ EXISTIX
 * ───────────────
 *   No volem `js-yaml` per a llegir sis claus. El nostre frontmatter és pla:
 *   escalars i llistes d'escalars, un nivell. Un analitzador de 60 línies
 *   cobrix el 100% del corpus mesurat (96 documents, 34 claus) i no afegix
 *   cap dependència. Pedra Seca.
 *
 *   NO és un YAML complet i no ho pretén. Si algun dia fa falta imbricació,
 *   això falla en compte d'endevinar: `avisos` t'ho dirà.
 */

/** Separa el document en frontmatter cru i cos. */
export function parteix(txt) {
  if (!txt.startsWith('---')) return { fm: null, cru: '', cos: txt };
  const fi = txt.indexOf('\n---', 3);
  if (fi < 0) return { fm: null, cru: '', cos: txt };
  const cru = txt.slice(txt.indexOf('\n') + 1, fi + 1);
  const resta = txt.slice(fi + 4).replace(/^[^\n]*\n?/, '');
  return { fm: true, cru, cos: resta };
}

const desquota = (v) => v.trim().replace(/^"(.*)"$/s, '$1').replace(/^'(.*)'$/s, '$1').trim();

/**
 * @returns {{claus:string[], valors:Map<string,string|string[]>, avisos:string[]}}
 *   `claus` conserva l'ordre original d'aparició.
 */
export function llig(cru) {
  const valors = new Map();
  const claus = [];
  const avisos = [];
  let actual = null;
  for (const ln of cru.split('\n')) {
    if (!ln.trim()) continue;
    const esc = ln.match(/^([A-Za-z_][A-Za-z0-9_-]*)\s*:(.*)$/);
    if (esc) {
      actual = esc[1];
      if (valors.has(actual)) avisos.push(`clau duplicada: ${actual}`);
      else claus.push(actual);
      const v = esc[2].trim();
      if (!v) valors.set(actual, []);
      else if (/^\[.*\]$/s.test(v)) {
        /* llista en línia: ["a", "b"] */
        valors.set(actual, v.slice(1, -1).split(',').map(desquota).filter(Boolean));
      } else valors.set(actual, desquota(v));
      continue;
    }
    const item = ln.match(/^\s*-\s+(.*)$/);
    if (item && actual) {
      const prev = valors.get(actual);
      const llista = Array.isArray(prev) ? prev : (prev ? [prev] : []);
      llista.push(desquota(item[1]));
      valors.set(actual, llista);
      continue;
    }
    if (ln.startsWith(' ') || ln.startsWith('\t')) avisos.push(`línia imbricada no suportada: ${ln.trim().slice(0, 40)}`);
  }
  return { claus, valors, avisos };
}

/** Serialitza en l'ordre canònic donat. Llistes sempre en bloc. */
export function escriu(valors, ordre) {
  const linies = [];
  for (const k of ordre) {
    if (!valors.has(k)) continue;
    const v = valors.get(k);
    if (Array.isArray(v)) {
      if (v.length === 0) continue;
      linies.push(`${k}:`);
      for (const it of v) linies.push(`  - ${it}`);
    } else {
      if (v === '' || v == null) continue;
      /* Citem només quan cal: dos punts seguits d'espai, o cometes al principi. */
      const cal = /:\s/.test(v) || /^["'#[{&*!|>%@`]/.test(v);
      linies.push(`${k}: ${cal ? JSON.stringify(v) : v}`);
    }
  }
  return `---\n${linies.join('\n')}\n---\n`;
}
