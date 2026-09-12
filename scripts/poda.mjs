#!/usr/bin/env node
// poda.mjs — Pedra Seca · Fase 2: rastreig i poda de classes orfes al JSX
// Requeriments: Node >= 18. Zero dependències. Air-gapped.
//
// Ordres:
//   node scripts/poda.mjs scan               -> informe_orfenes.md + orfenes.json
//   node scripts/poda.mjs mapa               -> valida mapa.json contra src/css
//   node scripts/poda.mjs aplica             -> dry-run: què es reescriuria
//   node scripts/poda.mjs aplica --escriu    -> reescriu els .jsx segons mapa.json
// Executa des de l'arrel del project.

import { readFile, writeFile, readdir } from "node:fs/promises";
import { join } from "node:path";

// --- Configuració (ajusta si l'arbre difereix) ---
const DIR_JSX = "src";
const DIR_CSS = "src/css";
const IGNORA_DIR = new Set(["node_modules", ".git", "dist", "build", "coverage"]);
// Families d'orfes conegudes (la més llarga primer).
const FAMILIES = ["univ-manager-admin", "onboarding", "dv", "ue", "id"];

// --- Recorregut de l'arbre ---
async function llistaFitxers(dir, exts) {
  const sortida = [];
  async function camina(actual) {
    let entrades;
    try { entrades = await readdir(actual, { withFileTypes: true }); }
    catch { return; }
    for (const e of entrades) {
      if (e.name.startsWith(".")) continue;
      const ruta = join(actual, e.name);
      if (e.isDirectory()) {
        if (!IGNORA_DIR.has(e.name)) await camina(ruta);
      } else if (exts.some((ext) => e.name.endsWith(ext))) {
        sortida.push(ruta);
      }
    }
  }
  await camina(dir);
  return sortida.sort();
}

// --- Classes definides al CSS de Pedra Seca (inclou @layer) ---
async function classesCSS() {
  const definides = new Set();
  for (const ruta of await llistaFitxers(DIR_CSS, [".css"])) {
    const css = (await readFile(ruta, "utf8")).replace(/\/\*[\s\S]*?\*\//g, "");
    for (const m of css.matchAll(/\.([A-Za-z_-][A-Za-z0-9_-]*)/g)) definides.add(m[1]);
  }
  return definides;
}

// --- Utilitats ---
function liniaDe(text, index) {
  let n = 1;
  for (let i = 0; i < index; i++) if (text[i] === "\n") n++;
  return n;
}
function familia(classe) {
  for (const f of FAMILIES) if (classe === f || classe.startsWith(f + "-")) return f;
  return "altres";
}
function nucli(token) { // "md:ue-w-full" -> "ue-w-full"
  const parts = token.split(":");
  return parts[parts.length - 1];
}

// --- SCAN ---
const PATRO_CLASSE =
  /className\s*=\s*(?:"([^"]*)"|'([^']*)'|\{\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`)\s*\})/g;
const PATRO_EXPRESSIO = /className\s*=\s*\{\s*(?!["'`])([^}]+)\}/g;

async function escaneja() {
  const definides = await classesCSS();
  const perFitxer = {};
  const dinamiques = [];
  const uniques = new Map();

  for (const ruta of await llistaFitxers(DIR_JSX, [".jsx", ".tsx"])) {
    const src = await readFile(ruta, "utf8");
    const trobades = {};

    PATRO_CLASSE.lastIndex = 0;
    let m;
    while ((m = PATRO_CLASSE.exec(src)) !== null) {
      const brut = m[1] ?? m[2] ?? m[3] ?? m[4] ?? m[5] ?? "";
      const linia = liniaDe(src, m.index);
      const brutNet = brut.replace(/\$\{[^}]*\}/g, ' ');
      for (const token of brutNet.split(/\s+/)) {
        if (!token) continue;
        if (token.includes("${")) {
          dinamiques.push({ fitxer: ruta, linia, expressio: token });
          continue;
        }
        if (definides.has(token) || definides.has(nucli(token))) continue;
        const t = (trobades[token] ??= { linies: [], ocurrencies: 0 });
        t.linies.push(linia);
        t.ocurrencies++;
      }
    }

    // className={expr} (ternaris, clsx, variables): revisio manual
    PATRO_EXPRESSIO.lastIndex = 0;
    while ((m = PATRO_EXPRESSIO.exec(src)) !== null) {
      dinamiques.push({ fitxer: ruta, linia: liniaDe(src, m.index), expressio: m[1].trim().slice(0, 60) });
    }

    if (Object.keys(trobades).length) {
      perFitxer[ruta] = trobades;
      for (const [classe, info] of Object.entries(trobades)) {
        const u = uniques.get(classe) ?? { ocurrencies: 0, fitxers: new Set() };
        u.ocurrencies += info.ocurrencies;
        u.fitxers.add(ruta);
        uniques.set(classe, u);
      }
    }
  }

  const perFamilia = {};
  for (const classe of uniques.keys()) {
    const f = familia(classe);
    perFamilia[f] = (perFamilia[f] ?? 0) + 1;
  }

  const dades = {
    generat: new Date().toISOString(),
    totalUnic: uniques.size,
    classesCSSDefinides: definides.size,
    perFamilia,
    orfenes: [...uniques.entries()]
      .map(([classe, u]) => ({
        classe, familia: familia(classe), ocurrencies: u.ocurrencies, fitxers: [...u.fitxers],
      }))
      .sort((a, b) => b.ocurrencies - a.ocurrencies),
    perFitxer,
    dinamiques,
  };
  await writeFile("orfenes.json", JSON.stringify(dades, null, 2));

  const linies = [];
  linies.push("# Informe d'orfenes JSX — Pedra Seca Fase 2");
  linies.push("");
  linies.push("- Generat: " + dades.generat);
  linies.push("- Classes úniques orfes: **" + dades.totalUnic + "** (referència del Consell: 71)");
  linies.push("- Classes definides a " + DIR_CSS + ": " + dades.classesCSSDefinides);
  linies.push("- Dinàmiques/expressions (revisió manual): " + dinamiques.length);
  linies.push("");
  linies.push("## Per família");
  for (const [f, n] of Object.entries(perFamilia).sort((a, b) => b[1] - a[1])) {
    linies.push("- " + f + ": " + n);
  }
  linies.push("");
  linies.push("## Per component");
  for (const [ruta, ts] of Object.entries(perFitxer)) {
    linies.push("");
    linies.push("### " + ruta);
    linies.push("| classe | família | ocurr. | línies |");
    linies.push("|---|---|---|---|");
    for (const [c, info] of Object.entries(ts).sort((a, b) => b[1].ocurrencies - a[1].ocurrencies)) {
      linies.push("| `" + c + "` | " + familia(c) + " | " + info.ocurrencies + " | " + info.linies.join(", ") + " |");
    }
  }
  if (dinamiques.length) {
    linies.push("");
    linies.push("## Dinàmiques (prefix amb ${...}: no automatitzables)");
    for (const d of dinamiques) {
      linies.push("- " + d.fitxer + ":" + d.linia + " — `" + d.expressio + "`");
    }
  }
  await writeFile("informe_orfenes.md", linies.join("\n") + "\n");
  console.log("Scan fet: " + uniques.size + " classes úniques orfes. Detall a informe_orfenes.md");
}

// --- MAPA ---
async function carregaMapa() {
  const mapa = JSON.parse(await readFile("mapa.json", "utf8"));
  return new Map(Object.entries(mapa).filter(([, v]) => typeof v === "string"));
}

async function validaMapa() {
  let parelles;
  try { parelles = await carregaMapa(); }
  catch { console.error("mapa.json no trobat o JSON invàlid."); process.exit(1); }
  const definides = await classesCSS();
  let errors = 0;
  console.log("== Validació de mapa.json contra " + DIR_CSS + " ==");
  for (const [orfe, desti] of parelles) {
    if (definides.has(desti)) console.log("OK    " + orfe + " -> " + desti);
    else { console.error("FALLA " + orfe + " -> " + desti + " (no existeix a " + DIR_CSS + ")"); errors++; }
  }
  try {
    const dades = JSON.parse(await readFile("orfenes.json", "utf8"));
    const mapades = new Set(parelles.keys());
    const pendents = dades.orfenes.filter((o) => !mapades.has(o.classe));
    console.log("");
    console.log("Orfes pendents de mapat: " + pendents.length + " de " + dades.totalUnic);
    for (const p of pendents) {
      console.log("  - " + p.classe + "  (" + p.ocurrencies + " ocurr. · " + p.fitxers.join(", ") + ")");
    }
  } catch {
    console.log("(Executa primer 'scan' per vore les orfes pendents.)");
  }
  process.exit(errors ? 1 : 0);
}

// --- APLICA (conservador: només className estàtics; dedupe post-substitució) ---
function substituieixTokens(llista, parelles) {
  const tokens = llista.split(/\s+/).filter(Boolean);
  if (!tokens.length) return null;
  let tocada = false;
  const vistos = new Set();
  const finals = [];
  for (const t of tokens) {
    const desti = parelles.get(t) ?? parelles.get(nucli(t));
    if (desti !== undefined) tocada = true;
    const definitiu = desti ?? t;
    if (!vistos.has(definitiu)) { vistos.add(definitiu); finals.push(definitiu); }
  }
  return tocada ? finals.join(" ") : null;
}

const PATRO_A = /(className\s*=\s*)(["'])([^"']*)\2/g;
const PATRO_B = /(className\s*=\s*\{\s*)(["'])([^"']*)\2(\s*\})/g;

async function aplica(escriu) {
  let parelles;
  try { parelles = await carregaMapa(); }
  catch { console.error("mapa.json no trobat o JSON invàlid."); process.exit(1); }

  let fitxersTocats = 0;
  for (const ruta of await llistaFitxers(DIR_JSX, [".jsx", ".tsx"])) {
    const original = await readFile(ruta, "utf8");
    let canvis = 0;

    let text = original.replace(PATRO_A, (complet, cap, q, llista) => {
      const nou = substituieixTokens(llista, parelles);
      if (nou === null) return complet;
      canvis++;
      return cap + q + nou + q;
    });

    text = text.replace(PATRO_B, (complet, cap, q, llista, tancament) => {
      const nou = substituieixTokens(llista, parelles);
      if (nou === null) return complet;
      canvis++;
      return cap + q + nou + q + tancament;
    });

    if (canvis > 0) {
      fitxersTocats++;
      if (escriu) {
        await writeFile(ruta, text);
        console.log("REESCRIT  " + ruta + "  (" + canvis + " atributs)");
      } else {
        console.log("PENDENT   " + ruta + "  (" + canvis + " atributs — dry-run)");
      }
    }
  }
  if (fitxersTocats === 0) {
    console.log("Res a substituir: cap orfe mapada apareix en className estàtics.");
  } else if (!escriu) {
    console.log("Dry-run. Repassa i executa: node scripts/poda.mjs aplica --escriu");
  } else {
    console.log("Fets " + fitxersTocats + " fitxers. Repassa el diff abans de commit.");
  }
}

const ordre = process.argv[2];
if (ordre === "scan") await escaneja();
else if (ordre === "mapa") await validaMapa();
else if (ordre === "aplica") await aplica(process.argv.includes("--escriu"));
else {
  console.log("Ús: node scripts/poda.mjs <scan|mapa|aplica [--escriu]>");
  process.exit(1);
}
