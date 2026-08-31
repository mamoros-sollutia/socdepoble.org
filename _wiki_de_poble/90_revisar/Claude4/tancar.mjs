#!/usr/bin/env node
/**
 * tancar.mjs — Bloquejador d'eixida de torn (Stop hook).
 *
 * PER QUÈ EXISTIX
 * ───────────────
 *   `npm run tancar` existix i funciona. Ningú el crida. No apareix ni a
 *   `npm run porta` (21 portes encadenades) ni a `npm run build`. Depén que
 *   l'humà el demane, i l'humà el demana quan ja s'ha frustrat.
 *
 *   Este ganxo el fa inevitable: si l'agent ha escrit alguna cosa durant el
 *   torn i l'Escriptori no està net, el torn no es tanca.
 *
 * SI L'ARNÉS NO SUPORTA `Stop`
 * ────────────────────────────
 *   Este fitxer també val com a `postToolUse` o com a hook de git
 *   (`.husky/pre-commit`). El que no val és deixar-ho escrit només a
 *   l'AGENTS.md §4: això ja s'ha provat i és el que ha fallat.
 *
 * EIXIDA
 *   { "decision": "allow" }                       → el torn es pot tancar
 *   { "decision": "block", "reason": "..." }      → l'agent ha de continuar
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ARREL = process.env.SDP_ARREL || process.cwd();
const DIARI = path.join(ARREL, '.agents', '.diari_sessio.jsonl');

const resp = (decision, reason) => {
  process.stdout.write(JSON.stringify(reason ? { decision, reason } : { decision }));
  process.exit(0);
};

/* Sense escriptures al torn no hi ha brossa possible: no molestem. */
let escriptures = 0;
try {
  escriptures = fs.readFileSync(DIARI, 'utf8').trim().split('\n').filter(Boolean).length;
} catch { /* cap diari = cap escriptura registrada */ }

if (escriptures === 0) resp('allow');

let informe;
try {
  const cru = execFileSync('node', ['tooling/gates/tancament.mjs', '--json'], {
    cwd: ARREL, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
  });
  informe = JSON.parse(cru);
} catch (err) {
  /* exit != 0 també escriu JSON a stdout: intentem llegir-lo abans de rendir-nos */
  try {
    informe = JSON.parse(err.stdout || '');
  } catch {
    resp('block', "[TANCAMENT] No he pogut executar `node tooling/gates/tancament.mjs --json`. "
      + `Motiu: ${err.message}. Arregla la porta abans de tancar el torn: una porta que no `
      + "s'executa no és una porta.");
  }
}

const falles = (informe.controls || []).filter((c) => c.estat === 'FALLA');
const avisos = (informe.controls || []).filter((c) => c.estat === 'AVÍS');

/* Un satèl·lit sense ancorar és una FALLA, no un avís. És exactament el
 * problema que ens ha portat ací: C2 està classificat com a AVÍS i per això
 * mai ha aturat res. Ací el tractem com el que és. */
const bloquejants = [...falles, ...avisos.filter((c) => c.id === 'C2')];

if (bloquejants.length === 0) {
  try { fs.unlinkSync(DIARI); } catch { /* el diari s'ha consumit */ }
  resp('allow');
}

const detall = bloquejants.map((c) => {
  const llista = (c.llista || []).slice(0, 6).map((x) => `      · ${x}`).join('\n');
  return `  ${c.id} · ${c.nom}\n      ↳ ${c.detall}${llista ? `\n${llista}` : ''}`;
}).join('\n');

resp('block', `[TANCAMENT REBUTJAT] Has escrit ${escriptures} vegada(es) este torn i `
  + `l'Escriptori no queda net:\n\n${detall}\n\n`
  + 'Arregla-ho ara: mou el que siga document a l\'Escriptori amb nom termodinàmic, '
  + 'declara\'l a 00_INDEX_ESCRIPTORI.md, actualitza .agents/ESTAT.md, i torna a intentar '
  + 'tancar. No contestes al Mestre encara.');
