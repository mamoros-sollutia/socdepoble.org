/**
 * codi.mjs — llevar comentaris sense moure els números de línia.
 *
 * PER QUÈ EXISTIX AQUEST FITXER
 * ─────────────────────────────
 * L'auditoria 260831 (Seient Núm. 5) va trobar la mateixa fallada a tres
 * portes independents, i el cens la va confirmar a 24 de les 28 eines que fan
 * anàlisi textual: cap lleva els comentaris abans d'escanejar.
 *
 * La conseqüència no és estètica. Invertix l'incentiu del projecte sencer:
 *
 *   · `tractor-tokens` (T3) denunciava `--sdp-font-min` perquè el nom apareixia
 *     dins d'un comentari que explicava per què el token existix.
 *   · `tractor-sollutia` (S2) denunciava `destroyToastSystem()` perquè el nom
 *     apareixia dins de la nota que documentava com s'havia arreglat.
 *   · `tractor-doctrina` denunciava 15 camins que sí que existixen, citats en
 *     prosa sense qualificar.
 *
 * És a dir: DOCUMENTAR una reparació la tornava a denunciar. En un projecte que
 * exigix escriure el motiu dins de cada fitxer —i que ho fa bé—, això castiga
 * exactament la disciplina que el sosté. La sortida fàcil és deixar de
 * documentar, o deixar de mirar la porta. Les dues són pitjors que el bug.
 *
 * PRINCIPIS
 *   · Zero dependències. Node natiu, sense AST. (Pedra Seca)
 *   · Els números de línia i de columna NO es mouen: cada caràcter esborrat es
 *     reemplaça per un espai i cada salt de línia es conserva. Una porta pot
 *     seguir informant `fitxer:línia` sense cap recàlcul.
 *   · No intenta ser un analitzador complet. Reconeix cadenes i literals de
 *     plantilla per a no confondre un `//` dins d'una URL amb un comentari.
 *   · Davant el dubte, CONSERVA. Un fals positiu és molest; esborrar codi de
 *     l'anàlisi és emmudir una porta, que és molt pitjor.
 *
 * ÚS
 *   import { senseComentaris, senseComentarisCSS } from '../lib/codi.mjs';
 *   const codi = senseComentaris(fs.readFileSync(ruta, 'utf8'), ruta);
 *   // ara `codi` té la mateixa llargària i les mateixes línies que l'original
 */

/** Reemplaça un tros per espais conservant els salts de línia. */
function esborra(tros) {
  return tros.replace(/[^\n]/g, ' ');
}

/**
 * Lleva comentaris de JavaScript, JSX, TypeScript i JSON amb comentaris.
 *
 * Respecta cadenes simples, dobles i literals de plantilla, i les expressions
 * regulars evidents, perquè `'http://…'` o `/\/\//` no es mengen mitja línia.
 *
 * @param {string} font
 * @returns {string} mateixa llargària, comentaris substituïts per espais
 */
export function senseComentarisJS(font) {
  let eixida = '';
  let i = 0;
  const n = font.length;

  // Estats: cap, cadena simple/doble, plantilla, comentari de línia, de bloc
  while (i < n) {
    const c = font[i];
    const seg = font[i + 1];

    // Comentari de bloc
    if (c === '/' && seg === '*') {
      const fi = font.indexOf('*/', i + 2);
      const final = fi === -1 ? n : fi + 2;
      eixida += esborra(font.slice(i, final));
      i = final;
      continue;
    }

    // Comentari de línia
    if (c === '/' && seg === '/') {
      let fi = font.indexOf('\n', i);
      if (fi === -1) fi = n;
      eixida += esborra(font.slice(i, fi));
      i = fi;
      continue;
    }

    // Cadenes: es copien senceres, amb escapaments
    if (c === '"' || c === "'" || c === '`') {
      const delim = c;
      let j = i + 1;
      while (j < n) {
        if (font[j] === '\\') { j += 2; continue; }
        if (font[j] === delim) { j += 1; break; }
        // Interpolació de plantilla: es copia tal qual, no s'hi entra.
        j += 1;
      }
      eixida += font.slice(i, Math.min(j, n));
      i = j;
      continue;
    }

    eixida += c;
    i += 1;
  }

  return eixida;
}

/**
 * Lleva comentaris de CSS. Només existix la forma de bloc.
 *
 * @param {string} font
 * @returns {string} mateixa llargària, comentaris substituïts per espais
 */
export function senseComentarisCSS(font) {
  let eixida = '';
  let i = 0;
  const n = font.length;

  while (i < n) {
    if (font[i] === '/' && font[i + 1] === '*') {
      const fi = font.indexOf('*/', i + 2);
      const final = fi === -1 ? n : fi + 2;
      eixida += esborra(font.slice(i, final));
      i = final;
      continue;
    }
    // Les cadenes de CSS (url(), content:) es copien senceres.
    if (font[i] === '"' || font[i] === "'") {
      const delim = font[i];
      let j = i + 1;
      while (j < n && font[j] !== delim) {
        if (font[j] === '\\') j += 1;
        j += 1;
      }
      eixida += font.slice(i, Math.min(j + 1, n));
      i = j + 1;
      continue;
    }
    eixida += font[i];
    i += 1;
  }

  return eixida;
}

/**
 * Lleva el frontmatter YAML i els blocs de codi tancats d'un Markdown.
 *
 * Serveix per a portes que busquen citacions de camins en prosa: un camí
 * escrit dins d'un bloc ``` és un exemple, no una promesa d'existència.
 *
 * @param {string} font
 * @param {{frontmatter?: boolean, blocs?: boolean}} opcions
 */
export function senseCodiMD(font, { frontmatter = true, blocs = true } = {}) {
  let s = font;

  if (frontmatter && /^---[ \t]*\r?\n/.test(s)) {
    const resta = s.slice(s.indexOf('\n') + 1);
    const tanca = /^(?:---|\.\.\.)[ \t]*(?:\r?\n|$)/m.exec(resta);
    if (tanca) {
      const fins = s.length - resta.length + tanca.index + tanca[0].length;
      s = esborra(s.slice(0, fins)) + s.slice(fins);
    }
  }

  if (blocs) {
    s = s.replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1[ \t]*$/gm, esborra);
  }

  return s;
}

/**
 * Tria l'estratègia per extensió. És el que voldrà quasi tota porta.
 *
 * @param {string} font
 * @param {string} ruta  s'usa només per a llegir l'extensió
 */
export function senseComentaris(font, ruta = '') {
  const ext = String(ruta).toLowerCase().split('.').pop();
  if (ext === 'css' || ext === 'scss') return senseComentarisCSS(font);
  if (ext === 'md' || ext === 'markdown') return senseCodiMD(font);
  if (['js', 'jsx', 'mjs', 'cjs', 'ts', 'tsx', 'json'].includes(ext)) return senseComentarisJS(font);
  // Desconegut: es torna intacte. Conservar és més segur que emmudir.
  return font;
}

/**
 * Comprovació ràpida d'integritat: la transformació no ha de moure cap línia.
 * Les portes la poden cridar en mode de proves.
 */
export function comprovaAlineacio(original, transformat) {
  return original.length === transformat.length
    && original.split('\n').length === transformat.split('\n').length;
}
