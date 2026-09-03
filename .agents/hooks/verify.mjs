#!/usr/bin/env node
/**
 * verify.mjs v2 — Porta d'escriptura (PreToolUse).
 *
 * QUÈ FEIA MALAMENT LA v1 (auditoria 260831, Seient 5)
 * ────────────────────────────────────────────────────
 *   La v1 s'executava en CADA escriptura i retornava `allow` sempre, tret
 *   d'un `ask` quan es sobreescrivia el LEDGER. Deia «Fitxer verificat» sense
 *   haver verificat res. Era el mateix patró que el `context_preflight.mjs`:
 *   una porta que no tanca però encén el llum verd.
 *
 * ARNÉS CONCRET
 * ─────────────
 *   Aquesta porta està dissenyada específicamente per al payload de l'arnés
 *   que proporciona toolCall.args (TargetFile / AbsolutePath / DirectoryPath / Overwrite).
 *
 * LLEI D'ESTA PORTA
 * ─────────────────
 *   La brossa no es neteja: no es deixa caure. Esta porta no comprova a la fi
 *   del torn si l'Escriptori està net; impedix que s'embrute mentre s'escriu.
 *   Un Diògenes al qual li lleven la mà no acumula.
 *
 *   Si la porta no pot llegir la petició, respon `ask`. Mai `allow` per
 *   defecte: un permís que no s'ha pogut fonamentar no és un permís.
 *
 * EIXIDA
 *   { "decision": "allow" | "ask" | "deny", "reason": "..." }
 */

import fs from 'node:fs';
import path from 'node:path';

const ARREL = process.env.SDP_ARREL || process.cwd();
const ESCRIPTORI = '_wiki_de_poble/05_Escriptori_Soc_de_Poble';
const DIARI = path.join(ARREL, '.agents', '.diari_sessio.jsonl');

/* AGENTS.md §2 — AAMMDD_HHMM_categoria_titol.ext, 1–6 paraules */
const TERMODINAMIC = /^\d{6}_\d{4}_[a-z0-9]+(?:_[a-z0-9]+){1,6}\.(md|txt|json|csv)$/;

/* AGENTS.md §2 — excepcions reservades i codi font */
const RESERVATS = new Set([
  'SKILL.md', 'LEDGER.md', 'ESTAT.md', 'AGENTS.md', 'BIOS.md', 'BASELINE.md',
  'PROFILE.md', 'BOOTSTRAP.md', 'PROTOCOL_PETORRETA.md',
  '00_INDEX_ESCRIPTORI.md', 'REGISTRE_CODI.md', '.gitkeep', '.DS_Store',
]);
const EXT_CODI = new Set([
  '.mjs', '.js', '.cjs', '.jsx', '.ts', '.tsx', '.css', '.php',
  '.sh', '.py', '.sql', '.yaml', '.yml', '.html',
]);

/* Satèl·lits: patrons que la casa ha vist créixer i no vol tornar a veure. */
const SATELLITS = [
  { re: /\.abans-\d{6}$/i, nom: 'una còpia .abans-AAMMDD' },
  { re: /\.(bak|old|orig|tmp|copy)$/i, nom: 'una còpia de seguretat manual' },
  { re: /^(prova|test|tmp|temp|scratch|borrador)[-_.]/i, nom: 'un fitxer de prova solt' },
  { re: /\bcopy\b|\(\d+\)\./i, nom: 'un duplicat automàtic' },
];
const CARPETES_PROHIBIDES = /^(Claude|GPT|Gemini|Qwen|Kimi|Grok|Codex|IA)\d*$/i;

const resp = (decision, reason) => {
  process.stdout.write(JSON.stringify({ decision, reason }));
  process.exit(0);
};

function anotaDiari(entrada) {
  try {
    fs.mkdirSync(path.dirname(DIARI), { recursive: true });
    fs.appendFileSync(DIARI, `${JSON.stringify(entrada)}\n`, 'utf8');
  } catch { /* el diari és observació, no autoritat: mai bloqueja */ }
}

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (c) => { input += c; });

process.stdin.on('end', () => {
  let payload;
  try {
    payload = JSON.parse(input);
  } catch {
    resp('ask', "[PORTA] No he pogut llegir la petició d'escriptura. "
      + 'No autoritze el que no puc comprovar. Confirma manualment.');
  }

  const args = payload?.toolCall?.args || {};
  const eina = payload?.toolCall?.name || '';
  
  if (!payload?.toolCall?.args) {
    resp('ask', "[PORTA] Arnés desconegut. L'estructura del payload no conté 'toolCall.args'. "
      + 'No puc comprovar què vols escriure. Confirma manualment.');
  }

  const brut = args.TargetFile || args.AbsolutePath || args.DirectoryPath || '';

  if (!brut) {
    resp('ask', "[PORTA] La petició no declara cap ruta de destí. Confirma manualment.");
  }

  const abs = path.isAbsolute(brut) ? brut : path.resolve(ARREL, brut);
  const rel = path.relative(ARREL, abs).split(path.sep).join('/');
  const base = path.basename(abs);
  const ext = path.extname(base).toLowerCase();

  /* ── Planificació efímera de l'arnés: fora de jurisdicció ── */
  if (['task.md', 'walkthrough.md', 'implementation_plan.md'].includes(base)) {
    resp('allow', 'fitxer de planificació de l\'arnés');
  }

  /* ── LLEI 0 · Zona prohibida (AGENTS.md §5) ── */
  if (rel === '.env' || (rel.startsWith('.env.') && rel !== '.env.example')) {
    resp('deny', "[PORTA · §5] Els secrets no s'escriuen des d'ací.");
  }
  if (rel.startsWith('90_arxiu_historic/')) {
    resp('deny', "[PORTA · §5] L'arxiu històric és de només lectura per a l'agent.");
  }

  /* ── LLEI 1 · Immutabilitat del LEDGER ── */
  if (base === 'LEDGER.md' && eina === 'write_to_file' && args.Overwrite) {
    resp('ask', "[PORTA · LEDGER] L'historial és immutable i estàs sobreescrivint-lo "
      + 'sencer. Si vols afegir una entrada, afig; no reescrigues.');
  }

  /* ── LLEI 2 · Cap satèl·lit, enlloc ── */
  for (const s of SATELLITS) {
    if (s.re.test(base)) {
      resp('deny', `[PORTA · SATÈL·LIT] "${base}" és ${s.nom}. `
        + 'La casa no guarda dobles. Si vols una còpia de seguretat, usa git; '
        + `si vols un document de treball, escriu-lo a ${ESCRIPTORI}/ amb nom termodinàmic.`);
    }
  }

  /* ── LLEI 3 · Arrel del repositori neta (AGENTS.md §3) ── */
  const dinsArrel = !rel.includes('/');
  if (dinsArrel && !rel.startsWith('.') && !RESERVATS.has(base) && !EXT_CODI.has(ext)) {
    resp('deny', `[PORTA · §3] "${base}" a l'arrel del repositori. `
      + `L'única safata de treball és ${ESCRIPTORI}/.`);
  }

  /* ── LLEI 4 · Escriptori: nom termodinàmic i pla ── */
  if (rel.startsWith(`${ESCRIPTORI}/`)) {
    const cua = rel.slice(ESCRIPTORI.length + 1);
    const primer = cua.split('/')[0];

    if (cua.includes('/')) {
      if (CARPETES_PROHIBIDES.test(primer)) {
        resp('deny', `[PORTA · §3] "${primer}/" és una carpeta de niu d'IA. `
          + "L'Escriptori és una safata plana: un document, un nom, un índex. "
          + 'No hi ha subcarpetes per IA.');
      }
      resp('ask', `[PORTA · §3] Vols crear "${primer}/" dins de l'Escriptori. `
        + "L'Escriptori és pla per disseny. Confirma que esta subcarpeta és permanent "
        + "i que la declararàs a 00_INDEX_ESCRIPTORI.md.");
    }

    if (!RESERVATS.has(base) && !TERMODINAMIC.test(base)) {
      const ara = new Date();
      const p = (n) => String(n).padStart(2, '0');
      const suggerit = `${String(ara.getFullYear()).slice(2)}${p(ara.getMonth() + 1)}${p(ara.getDate())}`
        + `_${p(ara.getHours())}${p(ara.getMinutes())}_categoria_titol${ext || '.md'}`;
      resp('deny', `[PORTA · §2] "${base}" no té nom termodinàmic. `
        + `Format: AAMMDD_HHMM_categoria_titol.ext (md|txt|json|csv). Exemple: ${suggerit}. `
        + "Si és una eina i no un document, no va a l'Escriptori: va a tooling/.");
    }
  }

  /* ── LLEI 5 · Zero !important (Invariant de Z) ── */
  if (ext === '.css') {
    let contingut = '';
    if (args.CodeContent) contingut += args.CodeContent;
    if (args.ReplacementContent) contingut += args.ReplacementContent;
    if (Array.isArray(args.ReplacementChunks)) {
      args.ReplacementChunks.forEach(c => {
        if (c.ReplacementContent) contingut += c.ReplacementContent;
      });
    }
    if (contingut.includes('!important')) {
      resp('deny', `[PORTA · INVARIANT CSS] Has intentat injectar un '!important' a ${base}. `
        + 'Això viola la política d\'arquitectura Pedra Seca (Cascade Layers). Fes servir @layer o augmenta l\'especificitat del selector de forma neta.');
    }
  }

  /* ── Autoritzat: queda anotat al diari de sessió ── */
  anotaDiari({ t: new Date().toISOString(), eina, ruta: rel });
  resp('allow', `ruta ${rel} conforme a §2/§3/§5`);
});
