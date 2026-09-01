#!/usr/bin/env node
/**
 * crear_bundle.mjs — Abocament auditable per al Consell de la Petorreta.
 *
 * TRES DEFECTES QUE ARREGLA (auditoria 260830)
 * ────────────────────────────────────────────
 *
 * 1 · LA PORTA COMENTADA
 *     La versió anterior duia la crida a `farcell.mjs` comentada amb la nota
 *     «Hem desactivat farcell perquè el Mestre ha demanat un abocament sencer».
 *     El missatge d'error desactivat deia «Arregla la causa; no toques la
 *     porta». Es va tocar la porta. A més la justificació no lligava: farcell
 *     verifica COMPLETITUD, no mida — un abocament total el fa passar més
 *     fàcilment, no menys.
 *     → Ara la verificació és interna, sempre corre, i si de veres cal saltar-
 *       se-la existix `--sense-verificar`, que escriu l'avís DINS del bundle
 *       perquè el Consell sàpiga que llig material no verificat.
 *
 * 2 · DOS CAPÇALS PER AL MATEIX CONCEPTE
 *     Emetia `## Fitxer:` per als directoris i `## Fitxer arrel/suelt:` per als
 *     fitxers d'arrel. Qualsevol lector que filtrara pel primer perdia
 *     package.json, vite.config.js i eslint.config.js sense adonar-se'n.
 *     (Li va passar a un auditor del Consell amb aquest mateix bundle.)
 *     → Un sol capçal: `## Fitxer: <ruta>`.
 *
 * 3 · TANQUES DE CODI COL·LIDINT
 *     Embolicava cada fitxer amb una tanca de tres accents greus. El 26 % dels
 *     .md de la Wiki en contenen: la tanca es tancava a mitjan fitxer i la
 *     resta s'escapava del bloc. Corrupció silenciosa en 1 de cada 4 documents.
 *     → Tanca dinàmica: sempre un accent greu més que la ratxa més llarga del
 *       contingut.
 *
 * QUÈ APORTA DE NOU: EL MANIFEST
 * ──────────────────────────────
 * El bundle porta ara un bloc JSON amb ruta, bytes, línies i sha256 de cada
 * fitxer. Verificar-lo deixa de ser interpretar prosa amb expressions regulars
 * i passa a ser comparar sumes. Qualsevol IA del Consell pot comprovar pel seu
 * compte que ha rebut el que el capçal promet, sense confiar en ningú.
 *
 * ÚS
 *   node tooling/brain/crear_bundle.mjs                      # nom automàtic
 *   node tooling/brain/crear_bundle.mjs auditoria persistencia
 *   node tooling/brain/crear_bundle.mjs --eixida=/tmp/x.md
 *   node tooling/brain/crear_bundle.mjs --sec                # llista, no escriu
 *   node tooling/brain/crear_bundle.mjs --sense-verificar    # deixa constància
 */

import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { R, rel, CAMINS, EXCLOSOS, arrelSegura, diagnostic, ErrorArrel } from '../lib/arrel.mjs';

/* ═══════════════════════ EL CONTRACTE ═══════════════════════
 * L'AGENTS.md §6 exigix una llista explícita, mai una pujada cega del disc.
 * Aquestes quatre constants SÓN eixa llista. Es declaren ací, es reprodueixen
 * al manifest del bundle, i el verificador les fa complir. Si algú amplia
 * l'abast, queda escrit al bundle i el Consell ho veu.
 * ═════════════════════════════════════════════════════════════ */

/** Directoris que s'aboquen sencers. Si un no existix, s'avorta. */
const DIRECTORIS = [
  CAMINS.src,
  CAMINS.agents,
  CAMINS.tooling,
  'scripts',
  CAMINS.plugin,
  `${CAMINS.wiki}/00_SER_Brain_Identitat`,
  `${CAMINS.wiki}/02_ACTUAR_Maquina_Tecnica`,
  `${CAMINS.wiki}/03_GOVERNAR_Normativa_Regles`,
  `${CAMINS.wiki}/04_arquitectura_disseny`,
];

/** Fitxers solts obligatoris. Si un falta, s'avorta (skill abocament-total, regla 4). */
const FITXERS_OBLIGATORIS = [
  'package.json',
  'vite.config.js',
  'eslint.config.js',
  'index.html',
];

/** Fitxers solts desitjables. Si falten, es reporta al bundle però no s'avorta. */
const FITXERS_OPCIONALS_FIXOS = [
  'vite.standalone.config.js',
  'public/auth/callback.html',
  'README.md',
  'LICENSE',
];

/*
 * 260831 (Seient Núm. 5): els fitxers `.*-deute.json` estaven escrits a mà ací.
 * N'hi havia tres de llistats i cinc portes que en generen. `.promesa-deute.json`,
 * `.sollutia-deute.json` i `.estucat-deute.json` mai van entrar a cap bundle,
 * així que un auditor no podia saber si existien —i la seua absència és
 * precisament el que decapita `npm run porta`.
 *
 * Una llista escrita a mà d'una cosa que creix sola sempre acaba mentint. Es
 * descobrixen del disc: qualsevol `.X-deute.json` a l'arrel entra.
 */
function deutesDelDisc() {
  try {
    return fs.readdirSync(arrelSegura())
      .filter((f) => /^\.[a-z0-9-]+-deute\.json$/i.test(f))
      .sort();
  } catch {
    return [];
  }
}

/*
 * A més dels que hi ha, es declaren els que les portes ESPEREN. Si una porta
 * exigix `.promesa-deute.json` i no existix, el bundle ha de dir-ho
 * explícitament a `absents_no_critics` en compte de callar.
 */
function deutesEsperats() {
  const esperats = new Set();
  for (const dir of ['tooling/gates', 'tooling/brain']) {
    let fitxers = [];
    try { fitxers = fs.readdirSync(R(dir)).filter((f) => f.endsWith('.mjs')); } catch { continue; }
    for (const f of fitxers) {
      let cos = '';
      try { cos = fs.readFileSync(R(dir, f), 'utf8'); } catch { continue; }
      for (const m of cos.matchAll(/['"`](\.[a-z0-9-]+-deute\.json)['"`]/gi)) esperats.add(m[1]);
    }
  }
  return [...esperats].sort();
}

const FITXERS_OPCIONALS = [
  ...FITXERS_OPCIONALS_FIXOS,
  ...new Set([...deutesDelDisc(), ...deutesEsperats()]),
];

/** Només aquestes extensions entren. Declarat ací i al manifest. */
const EXTENSIONS = new Set([
  '.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.css', '.md', '.json',
  '.html', '.php', '.sql', '.sh', '.py', '.yml', '.yaml', '.txt',
]);

/** Directoris que no es trepitgen mai (a més dels globals d'arrel.mjs). */
const DIRS_EXCLOSOS = new Set([...EXCLOSOS, 'cervells', '90_arxiu_historic', '.husky', '.githooks']);

/** Sostre termodinàmic orientatiu, en MB. Mai poda: només avisa. */
const SOSTRE_MB = 2.5;

/* ═══════════════════════ Arguments ═══════════════════════ */

const ARGS = process.argv.slice(2);
const flag = (n) => ARGS.includes(`--${n}`);
const valor = (n) => {
  const a = ARGS.find((x) => x.startsWith(`--${n}=`));
  return a ? a.slice(n.length + 3) : null;
};
const SEC = flag('sec');
const SENSE_VERIFICAR = flag('sense-verificar');
const positius = ARGS.filter((a) => !a.startsWith('--'));

/* ═══════════════════════ Recol·lecció ═══════════════════════ */

const sha = (buf) => createHash('sha256').update(buf).digest('hex');

/** Tanca de codi més llarga que qualsevol ratxa d'accents greus del contingut. */
function tanca(text) {
  let max = 0;
  for (const m of text.matchAll(/`+/g)) max = Math.max(max, m[0].length);
  return '`'.repeat(Math.max(3, max + 1));
}

function camina(absDir, acc) {
  for (const e of fs.readdirSync(absDir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (DIRS_EXCLOSOS.has(e.name)) continue;
    const complet = path.join(absDir, e.name);
    if (e.isSymbolicLink()) continue; // un bundle no seguix enllaços: podria eixir del repo
    if (e.isDirectory()) { camina(complet, acc); continue; }
    if (!EXTENSIONS.has(path.extname(e.name))) continue;
    acc.push(complet);
  }
  return acc;
}

function recull() {
  const absents = [];
  const camins = [];

  for (const d of DIRECTORIS) {
    const abs = R(d);
    if (!fs.existsSync(abs)) { absents.push({ cami: d, tipus: 'directori', critic: true }); continue; }
    camina(abs, camins);
  }
  for (const f of FITXERS_OBLIGATORIS) {
    const abs = R(f);
    if (!fs.existsSync(abs)) { absents.push({ cami: f, tipus: 'fitxer', critic: true }); continue; }
    camins.push(abs);
  }
  for (const f of FITXERS_OPCIONALS) {
    const abs = R(f);
    if (fs.existsSync(abs)) camins.push(abs);
    else absents.push({ cami: f, tipus: 'fitxer', critic: false });
  }

  const vistos = new Set();
  const entrades = [];
  for (const abs of camins) {
    const ruta = rel(abs);
    if (vistos.has(ruta)) continue; // un fitxer d'arrel dins d'un dir abocat
    vistos.add(ruta);
    let cru;
    try { cru = fs.readFileSync(abs); } catch (e) {
      absents.push({ cami: ruta, tipus: 'fitxer', critic: true, motiu: e.message });
      continue;
    }
    const text = cru.toString('utf8');
    entrades.push({
      ruta,
      bytes: cru.length,
      linies: text.split('\n').length,
      sha256: sha(cru),
      // Cal recordar-ho: la tanca de tancament exigix un salt de línia davant,
      // així que sense aquest bit no es pot reconstruir un fitxer que no
      // n'acabava amb cap. Sense això el round-trip és lossy i les sumes menten.
      nl_final: text.endsWith('\n'),
      text,
    });
  }
  entrades.sort((a, b) => a.ruta.localeCompare(b.ruta));
  return { entrades, absents };
}

/* ═══════════════════════ Construcció ═══════════════════════ */

function ara() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return {
    prefix: `${String(d.getFullYear()).slice(2)}${p(d.getMonth() + 1)}${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}`,
    iso: d.toISOString(),
  };
}

function construeix({ entrades, absents }, meta) {
  const totalBytes = entrades.reduce((s, e) => s + e.bytes, 0);
  const manifest = {
    esquema: 'sdp.bundle.v2',
    generat: meta.iso,
    arrel: path.basename(arrelSegura()),
    verificat: !SENSE_VERIFICAR,
    contracte: {
      directoris: DIRECTORIS,
      fitxers_obligatoris: FITXERS_OBLIGATORIS,
      fitxers_opcionals: FITXERS_OPCIONALS,
      extensions: [...EXTENSIONS].sort(),
      dirs_exclosos: [...DIRS_EXCLOSOS].sort(),
    },
    totals: { fitxers: entrades.length, bytes: totalBytes },
    absents_no_critics: absents.filter((a) => !a.critic).map((a) => a.cami),
    fitxers: entrades.map(({ ruta, bytes, linies, sha256, nl_final }) => ({ ruta, bytes, linies, sha256, nl_final })),
  };

  const l = [];
  l.push("# BUNDLE D'AUDITORIA PER AL CONSELL DE LA PETORRETA");
  l.push('');
  l.push(`> **Anclatge**: aquest document pertany a l'[[00_INDEX_ESCRIPTORI]].`);
  l.push('');

  if (SENSE_VERIFICAR) {
    l.push('> [!CAUTION]');
    l.push('> **BUNDLE NO VERIFICAT.** S\'ha generat amb `--sense-verificar`.');
    l.push('> La porta de completitud no ha corregut. Pot faltar-hi material,');
    l.push('> i les sumes del manifest poden no correspondre al disc.');
    l.push('> Tracteu-lo com a evidència de segona: contrasteu abans de concloure.');
    l.push('');
  }

  l.push('## Com verificar aquest bundle');
  l.push('');
  l.push('El bloc `MANIFEST` de baix porta ruta, bytes, línies i sha256 de cada');
  l.push('fitxer. No cal creure el capçal: extrau el cos i compara les sumes.');
  l.push('El contracte d\'abast (què s\'inclou i què no) també hi és declarat, així');
  l.push('que sabeu exactament què **no** esteu veient.');
  l.push('');
  l.push('```json');
  l.push(JSON.stringify(manifest, null, 1));
  l.push('```');
  l.push('');

  if (manifest.absents_no_critics.length) {
    l.push('> [!NOTE]');
    l.push(`> Opcionals absents del disc (no és un error): ${manifest.absents_no_critics.join(', ')}`);
    l.push('');
  }

  l.push('---');
  l.push('');

  for (const e of entrades) {
    const t = tanca(e.text);
    l.push(`## Fitxer: ${e.ruta}`);
    l.push('');
    l.push(`<!-- sha256:${e.sha256} bytes:${e.bytes} -->`);
    l.push('');
    // Emissió verbatim. La tanca de tancament necessita un salt davant, per
    // això s'afig quan el fitxer no n'acaba amb cap; `nl_final` ho recorda.
    l.push(t + '\n' + e.text + (e.nl_final ? '' : '\n') + t);
    l.push('');
  }

  return { text: l.join('\n'), manifest };
}

/* ═══════════════════════ Verificació interna ═══════════════════════ */

/**
 * La porta que abans estava comentada. Ara viu ací dins i no es pot esquivar
 * sense deixar-ne constància escrita al bundle.
 *
 * V1 · cap entrada del manifest falta al cos
 * V2 · cap secció del cos falta al manifest
 * V3 · cada secció retorna el sha256 que el manifest promet
 * V4 · cap entrada duplicada
 * V5 · cap secció buida
 */
function verifica(text, manifest) {
  const inf = [];
  const cos = new Map();
  const re = /^## Fitxer: (.+)$/gm;
  const marques = [...text.matchAll(re)];

  for (let i = 0; i < marques.length; i += 1) {
    const ruta = marques[i][1].trim();
    const ini = marques[i].index + marques[i][0].length;
    const fi = i + 1 < marques.length ? marques[i + 1].index : text.length;
    const bloc = text.slice(ini, fi);
    if (cos.has(ruta)) { inf.push(`V4 · entrada duplicada: ${ruta}`); continue; }
    const m = /^(`{3,})\n([\s\S]*?)\n\1\s*$/m.exec(bloc);
    if (!m) { inf.push(`V5 · secció sense cos extraïble: ${ruta}`); continue; }
    cos.set(ruta, m[2]);
  }

  const alManifest = new Set(manifest.fitxers.map((f) => f.ruta));
  const buits = [];
  for (const f of manifest.fitxers) {
    if (!cos.has(f.ruta)) { inf.push(`V1 · al manifest però absent del cos: ${f.ruta}`); continue; }
    // Reconstrucció exacta: el bloc capturat sempre ha perdut el salt que
    // precedix la tanca de tancament, i `nl_final` diu si tornar-l'hi a posar.
    const reconstruit = cos.get(f.ruta) + (f.nl_final ? '\n' : '');
    if (sha(Buffer.from(reconstruit, 'utf8')) !== f.sha256) {
      inf.push(`V3 · suma no quadra: ${f.ruta}`);
    }
    // Un fitxer buit al disc no és un defecte del bundle: és una troballa
    // sobre el repositori. Es reporta, no tomba la porta.
    if (f.bytes === 0) buits.push(f.ruta);
    else if (reconstruit.trim() === '') inf.push(`V5 · secció buida amb bytes>0: ${f.ruta}`);
  }
  for (const ruta of cos.keys()) {
    if (!alManifest.has(ruta)) inf.push(`V2 · al cos però absent del manifest: ${ruta}`);
  }
  if (buits.length) {
    console.warn(`\n⚠️  ${buits.length} fitxer(s) buits al disc (0 bytes) — fantasmes al repositori:`);
    for (const b of buits) console.warn(`   · ${b}`);
    console.warn('');
  }
  return inf;
}

/* ═══════════════════════ Principal ═══════════════════════ */

function principal() {
  const d = diagnostic();
  if (d.error) { console.error(d.error.informe()); return 2; }
  if (d.absentsCritics.length) {
    console.error("\n❌ [BUNDLE] Falten peces crítiques del repositori:");
    for (const c of d.absentsCritics) console.error(`   · ${c.cami} — ${c.nota}`);
    console.error('');
    return 1;
  }

  const collita = recull();
  const critics = collita.absents.filter((a) => a.critic);

  // Fail-closed. Això és la regla 4 de la skill `abocament-total`, que la
  // versió anterior incomplia amb un `if (existsSync(f))` sense else.
  if (critics.length) {
    console.error('\n❌ [BUNDLE] Abortat: el contracte promet material que no és al disc.\n');
    for (const a of critics) console.error(`   · ${a.tipus} absent: ${a.cami}${a.motiu ? ` (${a.motiu})` : ''}`);
    console.error('\n   Un bundle que promet el que no porta és un examen a cegues.');
    console.error('   Corregix el contracte a DIRECTORIS/FITXERS_OBLIGATORIS, o restaura el fitxer.\n');
    return 1;
  }

  const meta = ara();
  const { text, manifest } = construeix(collita, meta);
  const mb = manifest.totals.bytes / 1048576;

  if (SEC) {
    console.log(`\n📦 [SEC] ${manifest.totals.fitxers} fitxers · ${mb.toFixed(2)} MB\n`);
    for (const f of manifest.fitxers) console.log(`   ${String(f.linies).padStart(6)}  ${f.ruta}`);
    console.log('');
    return 0;
  }

  if (!SENSE_VERIFICAR) {
    const inf = verifica(text, manifest);
    if (inf.length) {
      console.error(`\n❌ [BUNDLE] La porta de completitud ha trobat ${inf.length} defecte(s):\n`);
      for (const i of inf.slice(0, 20)) console.error(`   · ${i}`);
      if (inf.length > 20) console.error(`   · … i ${inf.length - 20} més`);
      console.error('\n   Arregla la causa; no toques la porta.\n');
      return 1;
    }
  }

  const sufix = (positius.join('_') || 'auditoria').replace(/[^a-zA-Z0-9_]/g, '');
  const escriptori = R(CAMINS.escriptori);
  
  const nomBundle = valor('eixida') ?? path.join(escriptori, `${meta.prefix}_BUNDLE_${sufix}.md`);
  const nomPrompt = valor('eixida') ? null : path.join(escriptori, `${meta.prefix}_PROMPT_${sufix}.md`);

  fs.mkdirSync(path.dirname(nomBundle), { recursive: true });
  const tmp = `${nomBundle}.tmp`;
  // bypass: escriptura directa (no usa canonada.mjs) per fer el bundle atòmic.
  const _bypassCanonada = "no es fa servir canonada.mjs";
  fs.writeFileSync(tmp, text, 'utf8');
  fs.renameSync(tmp, nomBundle); // escriptura atòmica: mai un bundle a mitges

  console.log(`\n✅ Bundle: ${rel(nomBundle)}`);
  
  if (nomPrompt && !fs.existsSync(nomPrompt)) {
    const plantillaPrompt = `# 🛡️ PETORRETA AL CONSELL: ${sufix.replace(/_/g, ' ').toUpperCase()}

Salutacions, membres del Consell.
[...escriu ací l'objectiu de l'auditoria, les missions i la petició del DAFO...]
`;
    fs.writeFileSync(nomPrompt, plantillaPrompt, 'utf8');
    console.log(`✅ Prompt: ${rel(nomPrompt)} (plantilla aparellada termodinàmicament)`);
  }
  console.log(`   ${manifest.totals.fitxers} fitxers · ${mb.toFixed(2)} MB · verificat: ${manifest.verificat ? 'sí' : 'NO'}`);
  if (mb > SOSTRE_MB) {
    console.log(`\n⚠️  AVÍS TERMODINÀMIC: ${mb.toFixed(2)} MB supera el sostre de ${SOSTRE_MB} MB.`);
    console.log('   No s\'ha podat res. Si cal retallar, fes-ho canviant el contracte');
    console.log('   (DIRECTORIS / FITXERS_*) de forma semàntica i declarada, mai en silenci.');
  }
  console.log('');
  return 0;
}

try {
  process.exit(principal());
} catch (err) {
  if (err instanceof ErrorArrel) { console.error(err.informe()); process.exit(2); }
  console.error(`\n❌ [BUNDLE] Error inesperat: ${err.message}\n`);
  process.exit(2);
}
