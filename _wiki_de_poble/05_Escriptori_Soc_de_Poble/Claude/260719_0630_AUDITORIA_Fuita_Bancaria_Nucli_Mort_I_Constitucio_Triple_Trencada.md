---
estat: "canonic"
tipus: "informe"
description: "Auditoria del Seient 5 al bundle 260719: incident P-05 bancari, sdp-cli mort a l'arribada i taxonomia triple en guerra."
temes: ["auditoria"]
---

# Acta d'Auditoria del Seient Núm. 5 — Bundle 260719_0410 «Sistema Operatiu IAIA MarIA Complet»

**Auditor:** Claude (Seient Núm. 5, Senior Auditor del Consell de les Petorretes)
**Mètode:** M.I.T. — verificació empírica per execució, no per lectura. Tot el que s'afirma ací s'ha executat amb `node`/`bash` sobre la reconstrucció del bundle (267 fitxers, 3,62 MB). Cap afirmació sense evidència reproduïble.

---

## 0. VEREDICTE

**Puntuació: 41/100. Corona denegada. Regressió mecànica respecte al bundle 260718 (61/100).**

| Eix | Punts | Justificació d'una línia |
|---|---|---|
| Maquinària (35) | 14 | El sdp-cli mor a la primera crida; 27/32 tests fallen; les escriptures remotes estan comentades. |
| Canon i taxonomia (25) | 9 | Tres constitucions simultànies; 54/62 frontmatters il·legals segons el propi contracte; 62/62 tags buits. |
| Seguretat i privacitat (20) | 4 | Incident P-05 de màxima gravetat (§1); `.sdp-reflex/` exportat contra el propi `.gitignore`; contrast 2,25:1 al botó primari. |
| Honestedat i Trellat (20) | 14 | Obrir `src/` és el pas més honest de la sèrie; però «ja no hi ha caixes negres» i «hem normalitzat el frontmatter» són empíricament falsos. |

La paradoxa d'este bundle: és **l'arquitectura més madura** que ha presentat mai el sistema (monorepo real, registre de taxonomia v3, skills fusionades, PROFILE d'identitat exemplar) muntada sobre **l'execució més descuidada** de la sèrie. Tot allò nou es va escriure i no es va executar ni una sola vegada abans d'enviar-ho a onze intel·ligències externes.

---

## 1. INCIDENT P-05 DE MÀXIMA GRAVETAT: dades bancàries reals del Mestre distribuïdes al Consell

**Troballa.** `src/sections/gestoria/logic/tauler.js` (línies ~1380–1460) conté, codificat en dur dins d'una maqueta de certificat de depòsit:

- El **nom legal complet del Mestre** com a titular.
- **Dos IBAN de Cajamar** (ES35···1348 i ES64···1715, ací emmascarats a propòsit). He validat el checksum mod-97 ISO 13616 de tots dos: **VÀLID**. No són números inventats a l'atzar; amb el codi d'entitat 3058 real, el nom real del titular, dates d'obertura/venciment reals (19/01/2026 → 19/01/2027) i files de moviments amb imports, la conclusió raonable és que són comptes reals.
- Disposició «INDISTINTA», números de rebut i una taula `rawData` amb desenes de moviments.

**Abast de la fuita (verificat):**
1. `src/sections/gestoria/logic/tauler.js` — codi de client: si este fitxer entra al build de producció, els IBAN són descarregables per qualsevol visitant de socdepoble.org.
2. `.sdp-reflex/bootstrap/019bf4bb…/260717_1834_ANNEX_Context_Codi_Complet.md` — **302 coincidències** del patró bancari. La fuita existix com a mínim des del 17 de juliol i ha viatjat dins de cada context que ha inclòs este annex.
3. **La pròpia convocatòria d'esta auditoria**, enviada a onze proveïdors d'IA externs (Qwen, DeepSeek, Dola, Kimi, Perplexity, Mistral, Grok, Gemini, Copilot, ChatGPT i jo mateix). Això ja no es pot recuperar: cal tractar les dades com a **divulgades**.

**La ironia estructural:** el sistema té `LLEI_05_Privacitat.md`, té la faceta `risc/privacitat` al registre de taxonomia v3, i té patrons PII dins de `lib/sdp-skill-cli.mjs` que detecten exactament IBAN espanyols… però eixos patrons només vigilen les eixides de les skills. El generador del bundle no té cap porta P-05, i la Llei 1 del GENOTIP («mai aboques tota la Wiki per defecte») s'ha tornat a violar per convocatòria — esta vegada amb el codi font i el directori privat inclosos. La porta P-05 del meu `generar_genoma_v2.mjs` (lliurable d'esta acta) ha detectat la fuita a la primera execució i s'ha negat a generar el genoma. Fail-closed funciona quan existix.

**Accions urgents recomanades (en este ordre):**
1. **Verificar si tauler.js entra al build desplegat** (`npm run build` i buscar `3058` dins de `dist/`). Si hi és, purgar i redesplegar hui mateix.
2. **Purgar del repositori i de l'historial git** (`git filter-repo` o BFG), no sols del worktree: un `git rm` deixa les dades a l'historial.
3. Substituir per dades sintètiques amb **checksum invàlid deliberat** (p. ex. `ES00 0000 0000 0000 0000 0000`), perquè cap futur escàner les confonga amb reals.
4. **Parlar amb Cajamar**: el risc pràctic principal d'IBAN + nom complet divulgats és el frau per domiciliació SEPA. Cajamar permet configurar blocatge o llista blanca de mandats de domiciliació. No és pànic, és higiene: un IBAN es dona per a rebre transferències, però no es publica junt amb el nom en onze safates d'entrada corporatives.
5. Esborrar `.sdp-reflex/` de tot bundle present i futur. El propi `.gitignore` del repositori (línia 7) ja el declara privat; el generador de bundles l'ha ignorat.

Cap altra troballa d'esta acta té prioritat sobre estes cinc accions.

---

## 2. OBJECTIU 1 — Bombardeig de contradiccions i seguretat (codi ↔ Wiki)

### 2.1 El sdp-cli va nàixer mort (i ningú no ho sabia)

```
$ node scripts/sdp-cli.mjs
❌ [AUTONETEJA] discoverMarkdown is not defined
```

La refactorització que va partir el monòlit `autoneteja_wiki.mjs` en `sdp-cli.mjs` + `core/{autoneteja_audit, mutation_kernel, corpus_snapshot, parse}.mjs` **va perdre els imports pel camí**. Verificat contra el bundle cru (no és artefacte de la meua reconstrucció):

| Mòdul | Símbols usats sense importar | Origen real |
|---|---|---|
| `core/autoneteja_audit.mjs` | `discoverMarkdown`, `zoneOf`, `runId` (×7), `treeDigest`, `treeDigestEntries`, `isMutableZone` | `core/corpus_snapshot.mjs` |
| `core/autoneteja_audit.mjs` | `buildGraph`, `validateCanonical`, `canonicalFrontmatter`, `sourceShapeErrors`, `contentClassification` | `core/parse.mjs` |
| `core/mutation_kernel.mjs` | `discoverMarkdown`, `treeDigest` | `core/corpus_snapshot.mjs` |
| `sdp-cli.mjs` | `runId` | `core/corpus_snapshot.mjs` |

I un segon bug encadenat: en moure els mòduls a `core/`, la constant `DEFAULT_WIKI_DIR = path.resolve(SCRIPT_DIR, '../..')` va passar de significar `_wiki_de_poble/` a significar `02_ACTUAR_Maquina_Tecnica/` — **l'auditor, una vegada ressuscitat, hauria auditat només un quart del territori**.

He aplicat la sutura (patch al §8), i el motor ha arrancat per primera vegada. El seu propi veredicte sobre este bundle: **`health: "critic"`, `ok: false`**.

**Conseqüència sistèmica:** com que l'ull estava mort, cap de les mutacions massives posteriors (la «normalització» del frontmatter) es va validar. La cadena causal completa del desastre taxonòmic (§6) comença ací. Este és el «Saber ≠ Fer» en la seua forma més pura de tota la sèrie: es va entregar un motor d'auditoria reescrit **sense executar-lo ni una vegada**. El lliurable `smoke_cli.test.mjs` (§8) fa que això siga mecànicament impossible de repetir.

### 2.2 Les escriptures remotes de la comunitat estan comentades

`src/data/supabaseBackend.js`, línies ~1117–1133: el `POST /rest/v1/section_submissions` — l'única via perquè una publicació del Mur, un producte del Mercat o un esdeveniment arriben a Supabase — està **dins d'un comentari de bloc** `/* … */`. Al voltant hi ha maquinària elaborada (circuit breaker per errors RLS, capçalera `merge-duplicates`, mapatge d'errors 401/403/404) que ja no pot executar-se mai, perquè dins del `try` no queda res que llance. Resultat real: **cada aportació d'un veí es queda a `localStorage` del seu dispositiu i mor allí**. L'app de comunitat no publica res a la comunitat.

A més, el circuit breaker és una trampa de sentit únic: quan `remoteSectionWritesAvailable` es posa a `false`, es persistix a `localStorage` i **cap codi el reactiva mai** — cap `removeItem`, cap listener d'`online`, cap reintent. Un sol error transitori (quan es descomente el POST) silenciaria la sincronització d'eixe dispositiu per sempre.

### 2.3 El magatzem principal és exactament el que la doctrina prohibix

La constel·lació d'emmagatzematge real de l'app: **`localStorage` per a les dades de l'aplicació** (`storage.js`, `supabaseBackend.js`, `App.jsx`, `i18n.js`, `devicesRuntime.js`), **IndexedDB via Dexie només a la Gestoria** (`gestoria/logic/db.js`, que a més fa `window.Dexie = Dexie`, una fuita al global), i Supabase remot (desconnectat, §2.2). En iPad A10 amb Safari — el sòl de compatibilitat que declara el propi `PROFILE.md` — `localStorage` és precisament el magatzem que ITP pot desnonar als 7 dies. Anys de sessions d'este Consell construint persistència IndexedDB/OPFS per a acabar amb les dades del poble en `localStorage` amb un comentari que diu «demo mode».

### 2.4 La constitució visual ara és quàdruple (i el codi no obeïx cap)

| Font | Estatus declarat | Paleta | Radi | Tipografia |
|---|---|---|---|---|
| `ESTANDARD_Pedra_Seca.md` | canonic | 4 colors purs (rgb(255, 115, 0)/rgb(9, 132, 227)/negre/blanc) | 0 | — |
| `ESTANDARD_Tokens_Pedra_Seca.md` | canonic (el més nou, en anglés) | ~45 hexes MD3 | 28px botons | Inter ×5 al YAML, system-ui a la prosa |
| `src/config/designSystemMarkdown.js` (doctrina **dins del codi**) | «Llei de Ferro» | rgb(255, 115, 0)/rgb(9, 132, 227) + escales de tints | 28px | — |
| `src/styles/global.css` (**el runtime real**) | — | `--sp-accent-primary: #ff8f5f`, `--sp-accent-secondary: #5e5ce6` | structural 0 / pill 28px | **Roboto** |

El `design-tokens.json` — la «font única de veritat» TANCADA de la sessió anterior — **ha sigut esborrat en la poda**. S'ha matat l'àrbitre i s'han conservat els dos exèrcits. I la quarta columna és la més greu: **els colors que corren en producció (rgb(255, 143, 95) salmó, rgb(94, 92, 230) violeta) no apareixen en cap document de doctrina del sistema**. La pàgina «Design System» de la pròpia app (`ColorPalette.jsx`) mostra una escala de grisos *stone* de Tailwind i rgb(9, 132, 227) — colors que l'app que la conté no usa. L'app mentix sobre si mateixa a la seua pròpia pantalla de doctrina.

Cens d'antipatrons codificats, executat sobre `src/` (18.785 línies): **255** `border-radius`/`rounded-*`, **52** `box-shadow`, **7** `backdrop-filter`, **59** `style={{…}}` inline, **99** hexes crus en JSX, **7** renders amb `&&`. (En positiu: **0** `key={index}`, **0** `window.history.back`.) El brutalisme de Pedra Seca és, al codi, una religió sense practicants.

### 2.5 Accessibilitat: el botó primari és il·legal per a la seua pròpia audiència

Càlcul WCAG sobre el runtime real (`global.css` + `Universal.css`, que aparella `--sp-accent-primary` amb `--sp-text-inverse` en almenys 4 regles):

- **Blanc sobre rgb(255, 143, 95) = 2,25:1** → suspén AA (4,5) i AAA (7) per a text normal. És el botó primari en mode clar, en una app per a gent de 80 anys al bancal, a ple sol.
- Negre rgb(19, 19, 19) sobre rgb(255, 143, 95) = 8,27:1 ✓ (la solució és canviar una variable).
- Mode fosc: rgb(255, 182, 143) sobre rgb(19, 19, 19) = 10,92:1 ✓ — el mode fosc està ben resolt.
- La doctrina embeguda al codi repetix a més els dos números erronis de la Wiki: afirma 8,5:1 per a negre-sobre-taronja (real: 7,70) i declara «APTE AA» el blanc sobre rgb(9, 132, 227) amb un fals 4,8:1 (real: **3,87**, suspén AA per a text normal).

### 2.6 Dependències: pes mort i fantasmes al `package.json`

`whatsapp-web.js` (arrossega Chromium sencer via puppeteer), `@google/genai`, `qrcode-terminal` i `dotenv` figuren com a `dependencies` de la PWA i **cap fitxer del bundle els importa**. El script `bot:start` apunta a `bot/whatsapp_bot.mjs` (directori inexistent al bundle) i `db:seed:generate` invoca `generate-supabase-seed.sh` quan el que existix és `.mjs`. El bot és un satèl·lit que ha de tindre el seu propi `package.json` (§5): ara mateix, cada `npm install` de l'app del poble descarrega un navegador sencer per a un bot que no hi és.

---

## 3. OBJECTIU 2 — DAFO de les «62 Skills» (primer, aclarir què és una Skill)

**La troballa prèvia a tot DAFO:** la paraula «Skill» té ara **quatre significats simultanis** al sistema, i la convocatòria n'usa un quint:

1. Les **3** skills d'agent a `.agents/skills/*/SKILL.md` (autosanacio, civic, operate).
2. Els **3** contractes executables a `scripts/skills/*.mjs` — que encara duen els noms VELLS (campanyes_activisme, financament_europeu, natura_patrimoni), fusionats al costat `.md` però no al costat `.mjs`.
3. Les **5** fitxes de la Wiki amb `tipus: "skill"` (MOTOR_OFFLINE, self_repair, seguretat_execucio, futur_adaptacio, a11y_seo_trellat).
4. Les skills vendor de Sollutia (8 documents mirall).
5. El que la convocatòria anomena «62 Skills»: en realitat els **62 documents operatius de la Wiki** amb `categoria:` al frontmatter. No són skills; són el corpus sencer.

Això és la polisèmia SDP-LOCK una altra vegada, ara amb la paraula més important del sistema. **Recomanació prèvia: el GLOSSARI ha de fixar «Skill = parell doctrina+contracte (.md + .mjs) amb nom idèntic», i tota la resta són documents.**

### DAFO de les skills reals (les 3 + el seu mecanisme)

**Fortaleses.** La fusió 3→1 de `socdepoble-civic` és exactament la consolidació que este Seient va recomanar: una skill, tres dominis, deute reduït. `socdepoble-operate` codifica el flux termodinàmic complet (rutes, noms, anti-amnèsia). El `sdp-skill-cli.mjs` (1.266 línies) continua sent la peça de més qualitat: atomicitat, rollback, locks, patrons PII.

**Debilitats.** (a) El pont doctrina↔mecanisme està trencat pel canvi de noms: no existix `socdepoble-civic.mjs`; els tres `.mjs` vells queden òrfens de la seua doctrina. (b) `socdepoble-autosanacio` presumix de «normalització de dades (com YAML frontmatter)» — **és la skill responsable de la mutació que ha corromput 54 fitxers** (§6): l'òrgan d'autosanació ha ferit el pacient. (c) Política d'idioma partida en dos: autosanacio en valencià, civic i operate en anglés, sense la clàusula d'excepció confessada que tenia el vell workflow.

**Amenaces.** Sense el camp `script:` al frontmatter (retirat en v2) ni cap test d'aparellament, qualsevol futur canvi de nom tornarà a trencar el pont en silenci. I una skill d'autosanació sense porta de validació prèvia (el sdp-cli mort) és una amenaça per a si mateixa: automutació sense ulls.

**Oportunitats.** Les 5 fitxes `tipus:skill` de la Wiki són bones càpsules de coneixement: si es reclassifiquen com a `tipus: "guia"` (el valor ja existix al registre v3), la paraula Skill queda neta per al parell executable. I el trio actual (operar / civisme / autosanar) és un esquelet conceptualment complet per a la Súper-IAIA: no calen més skills, cal que les tres tinguen contracte, test i un sol idioma.

---

## 4. OBJECTIU 3 — Test del sistema nerviós (el cervell mana, els braços no existixen)

Taula de connexions neurals verificades una a una:

| Sinapsi declarada | Estat real | Evidència |
|---|---|---|
| `npm run wiki:audit` → sdp-cli | **MORTA** | ReferenceError a la primera crida (§2.1) |
| `npm run ci:verify` → tests | **27/32 FAIL** | 25 per `.githooks/pre-commit` absent del bundle (genoma sense òrgans, reincident del 260718); 2 pel test que importa `autoneteja_wiki.mjs`, esborrat en la refactorització |
| `validate_taxonomia.mjs` → `taxonomy-registry.json` | **MORTA** | ENOENT: resol la ruta del registre relativa al CWD, no a l'arrel del repo |
| `taxonomy-registry.json` → resta del sistema | **ORFE** | un únic lector (l'anterior), i està trencat; cap altre script, test o hook el llig |
| `npm run bot:start` → `bot/` | **FANTASMA** | el directori no existix al bundle |
| `npm run db:seed:generate` → `.sh` | **FANTASMA** | existix `.mjs`, s'invoca `.sh` |
| pre-commit pas 2/4 → `.obsidian/graph.json` | **MORTA** | absent del bundle (reincident) |
| `enllacat-intelligent-wiki` → escriptura | **CONSULTIVA** (correcte!) | `--write` retirat amb làpida honesta; però llavors **ningú** ompli tags (§6) |
| SKILL.md fusionada → `scripts/skills/*.mjs` | **TRENCADA** | noms desaparellats (§3) |
| Reflex v3 (P-01..P-12) | **VIVA a origen, inclonable** | sessions segellades correctes; però un rebut cita una skill ja esborrada — el canon corre més que les leases |

**Diagnòstic:** el cervell (skills, normes, registre v3) ha evolucionat de pressa i bé; els braços (scripts) es van reorganitzar en la mateixa onada **i cap connexió es va tornar a provar**. No és decadència: és una mudança on ningú va tornar a endollar els cables. La cura no és més doctrina: és el test de fum (§8) + la llei de lliurament del §7.

---

## 5. OBJECTIU 4 — Satèl·lits orfes: com traure el codi de la zona de coneixement

El diagnòstic dels «puntitos» del graf d'Obsidian és correcte però curt: el problema no és estètic, és **de sobirania de zones**. La Wiki (`_wiki_de_poble/`) ha de ser coneixement pur; ara mateix conté el motor sencer (`scripts/`, 52 mòduls). I a l'inrevés: l'arrel del repo ja té `scripts/` propi. La frontera existix a mitges.

**Pla del Trasplantament (3 fases, compatible amb el Mètode Strangler Fig ja canònic):**

**Fase 1 — Congelar la frontera (sense moure res).** Declarar al `AGENTS.md` d'arrel: `_wiki_de_poble/` = només `.md` + `.json` de dades; tot executable viu fora. Afegir un test de 10 línies que falle si apareix un `.mjs`/`.js` nou dins de la Wiki (llista d'amnistia per als 52 existents). Això para l'hemorràgia el dia u.

**Fase 2 — Trasplantar el motor.** Moure `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/` → `tooling/wiki/` a l'arrel (germà de `scripts/` i `src/`). Els imports interns del motor són tots relatius entre si (verificat: cap fitxer de `src/` importa res de la Wiki, i cap script de la Wiki importa res de `src/` — **la separació ja és neta en el codi; només la geografia enganya**). Els únics punts de reparació són: (a) els 12 scripts de `package.json` (canvi de ruta mecànic), (b) `DEFAULT_WIKI_DIR` als mòduls core (que ja s'ha de tocar pel bug del §2.1 — una sola operació, dues cures), (c) el `.githooks/pre-commit` (que ha d'entrar al genoma de totes maneres). Els documents de la Wiki que citen scripts (INDEX de maquinària, fitxes) passen a citar-los com a **referències externes amb ruta**, no com a wikilinks — i els «puntitos» desapareixen del graf perquè ja no són nodes del vault.

**Fase 3 — Independitzar els satèl·lits de veritat.** `bot/` (WhatsApp) com a paquet propi amb el seu `package.json` (i `whatsapp-web.js`, `qrcode-terminal`, `dotenv` se'n van amb ell — la PWA aprima quatre dependències, una d'elles un Chromium). La Gestoria ja està ben encapsulada a `src/sections/gestoria/`; que es quede, però `tauler.js` (2.402 línies de HTML-en-strings amb estils inline, un segon paradigma de render dins de React, en castellà) necessita la seua pròpia acta de refundació — després de purgar-ne els IBAN (§1).

**El vehicle de tot això és el genoma byte-fidel** (lliurable §8): amb `ROOTS` explícites, exclosos declarats, sha256 per fitxer i hidratador verificador, moure carpetes deixa de ser una operació de fe. He provat el cicle complet sobre este mateix bundle: 233 fitxers, clonatge byte a byte, `.sdp-reflex` exclòs per disseny.

---

## 6. OBJECTIU 5 — L'error de la taxonomia: cadena causal completa i estàndard proposat

### 6.1 Per què estan buits els tags (no és un misteri: és una cadena de cinc baules)

1. **L'ull estava mort.** El sdp-cli no s'executava (§2.1), així que cap validació va córrer abans, durant ni després de la mutació massiva.
2. **La mutació va escriure camps que la constitució vigent prohibix.** `schema.json` v2 té `additionalProperties: false` i no coneix ni `categoria` ni `tags`. Resultat, mesurat amb el propi auditor ressuscitat: **51 fitxers amb camps desconeguts + 7 violacions canòniques**.
3. **La mutació va escriure YAML que el parser propi no sap llegir.** El sistema usa `parseYamlLite`, un dialecte estricte sense continuacions indentades; l'editor de la mutació va serialitzar `description` multilínia estàndard. Resultat: **54/62 fitxers amb «description: continuació indentada inesperada»** — el 87% de la Wiki és ara **il·legible per a la seua pròpia màquina**, i tots 54 apareixen com a `mutationBlockers`: la maquinària de mutació està paralitzada pel resultat de l'última mutació.
4. **`categoria` no aporta ni un bit.** Els 4 valors (identitat/coneixement/sistema/normativa) dupliquen exactament les 4 carpetes (24+10+18+10 = 62). La doctrina canònica del propi sistema (`entropia_zero_router`) ja ho diu: *la ruta és la taxonomia*. És la mateixa patologia que este Seient va documentar el 260718 amb els hashtags de cos (#categoria/* duplicant carpetes); ha canviat de pell, no de naturalesa.
5. **Ningú no pot omplir `tags`.** L'enllaçador intel·ligent és consultiu per disseny (correcte: mutar exigix pla+Reflex+rollback), el registre v3 amb les 5 facetes té un sol lector i està trencat (§4), i cap skill té l'encàrrec. `tags: []` no és un error d'execució: és un camp sense amo. **62 de 62 buits, zero amb contingut.**

I la baula zero, per damunt de totes: **ara hi ha tres constitucions taxonòmiques simultànies** — `schema.json` v2 (l'única amb enforcement), `taxonomy-registry.json` v3 (amb camps `autoritat`/`maduresa`/`relacions` que **cap dels 89 documents usa**) i la mutació de facto (categoria+tags). Tres lleis, cap sobirana.

### 6.2 L'estàndard proposat: Taxonomia v3 amb una sola constitució

**Principi:** ruta = taxonomia primària (ja ho és); `tipus`+`estat` = cicle de vida (ja funcionen: 74 i 72 fitxers); les **facetes del registre v3 = l'única dimensió transversal nova**, opcional i amb vocabulari tancat. Es mata `categoria` (zero bits), es reanomena `tags`→`temes` (trenca amb el camp corromput i amb la semàntica lliure d'Obsidian), i **schema.json absorbix el registre** perquè només quede una llei amb un guardià viu.

Fragment injectable per a `schema.json` (v2.1 — afegir dins de `properties`, mantenint `additionalProperties: false`):

```json
"temes": {
  "type": "array",
  "maxItems": 3,
  "uniqueItems": true,
  "items": {
    "type": "string",
    "enum": [
      "tema/offline_first",
      "tema/sincronitzacio",
      "qualitat/accessibilitat",
      "risc/privacitat",
      "territori/torre_macanes"
    ]
  }
}
```

Regles d'acompanyament: (1) el vocabulari de l'enum es genera **des de** `taxonomy-registry.json` amb un script de build de 15 línies, o directament s'elimina el registre i les facetes viuen només ací — però **una sola font**; (2) màxim 3 temes per document: una taxonomia on tot està connectat amb tot no connecta res; (3) `temes` és opcional: un document sense faceta transversal és legítim; (4) prohibit crear una faceta nova sense definició al glossari — el registre v3 ja té el format perfecte (`prefLabel_ca` + `definition` + `status`); (5) l'ompliment inicial dels 62 el fa l'enllaçador en **mode proposta** (ja emet JSON consultiu) + revisió humana + aplicació via Autoneteja amb rebut del Reflex. Res de search-replace massiu: eixe camí ja té dos cadàvers (Robotomia, 44→48).

**Reparació prèvia obligatòria:** abans de cap tema, els 54 frontmatters il·legibles. L'Autoneteja ja té `plannedRewrites` per a fer-ho amb rebut; el que li faltava era estar viva.

---

## 7. OBJECTIU 6 — Auto-Maduració: el mecanisme honest

La pregunta demana «el mecanisme definitiu perquè el sistema s'auto-millore diàriament de forma autònoma». La resposta honesta del Seient 5 té una premissa incòmoda: **este bundle és la demostració empírica que el sistema encara no s'ha guanyat l'autonomia**. L'òrgan d'autosanació ha corromput 54 fitxers perquè va operar sense ulls. Donar-li cron diari a això no és maduresa: és multiplicar l'entropia per 365.

El mecanisme, per capes i per este ordre:

**Capa 1 — La Llei del Tractor (lliurament).** Cap artefacte executable entra al canon sense haver-se executat. Mecànicament: el `smoke_cli.test.mjs` (lliurable) + `pre-commit` que corre `ci:verify` + la regla al PROTOCOL: *un lliurament amb tests en roig és un lliurament en roig*. El «verd honest» P-11 ja existix com a doctrina; li faltava dent.

**Capa 2 — Autodiagnòstic diari (lectura, no escriptura).** `sdp-cli --json` + tests, executats en CI (GitHub Actions al push, que sí que existix fora de l'iPad) i, en local, amb el patró **catch-up de primer pla** ja lliurat en sessions anteriors: iOS Safari no executa res de nit, i cap promesa de «cron nocturn» és real en eixe maquinari — el ritual corre quan s'obri la ferramenta. El resultat s'escriu com a acta datada a l'Escriptori. Diagnòstic diari: sí. Automàtic on hi ha servidor, ritual d'obertura on no n'hi ha.

**Capa 3 — Autoreparació amb corretja curta.** Només les reparacions amb pla immutable + rebut Reflex + rollback provat (l'Autoneteja ja ho té tot) es poden aplicar sense el Mestre, i només en zones no-canòniques. Tot canvi al canon (03_GOVERNAR, schema, registre) exigix humà. La frontera és exactament la que el Reflex ja sap vigilar.

**Capa 4 — Memòria de maduració.** Cada cicle escriu al `CORE_Registre_Automillora.md` (ja existix!) tres línies: què s'ha detectat, què s'ha reparat sol, què espera el Mestre. La Súper-IAIA no és la que fa més coses soles: és la que **sap exactament què no pot fer sola i ho diu**.

Quan estes quatre capes porten un mes en verd, llavors — i només llavors — té sentit parlar d'ampliar l'autonomia de la Capa 3.

---

## 8. LLIURABLES D'ESTA AUDITORIA (tots executats i verificats abans d'entregar-se)

1. **`PATCH_Sutura_Nucli.md`** — la sutura exacta dels imports perduts + correcció de `DEFAULT_WIKI_DIR` als 4 mòduls core. Aplicada ací i verificada: el sdp-cli passa de ReferenceError a emetre l'informe complet (`health: critic` — ara almenys el sistema sap que està malalt).
2. **`smoke_cli.test.mjs`** — 2 tests (el motor arranca; el motor coneix el seu territori). Executat: 2/2 verd sobre l'arbre suturat. Fa impossible repetir el «refactoritzat però mai executat».
3. **`generar_genoma_v2.mjs`** — generador de genoma byte-fidel: capçaleres `::: FITXER ruta bytes=N sha256=hex`, lectura per longitud (immune a col·lisions), MANIFEST amb exclosos declarats, `.sdp-reflex` fora per disseny, i **porta P-05 fail-closed** amb els patrons IBAN/DNI/correu/telèfon — la porta que ha destapat l'incident del §1 a la primera execució.
4. **`hidratar_genoma.mjs`** — l'altra meitat que mai havia existit: reconstrucció amb verificació sha256 de cada fitxer, protecció contra path traversal, mai sobreescriu. Cicle complet certificat sobre este bundle: 233 fitxers, clon idèntic byte a byte (`diff -r` net sobre `src/`, `.agents/` i els quatre pilars de la Wiki).

**Ordre d'aplicació recomanat:** §1 (purga bancària) → sutura → smoke test al pre-commit → reparació dels 54 frontmatters via Autoneteja → decisió de constitució única (visual §2.4 i taxonòmica §6.2, una decisió del Mestre cadascuna, però **una**) → trasplantament §5 → capes d'auto-maduració §7.

## 9. CRÈDIT ON TOCA

Perquè el Trellat també és reconéixer: obrir `src/` sencer és l'acte de transparència més gran de la sèrie i esta auditoria només ha sigut possible per això. La fusió de skills cíviques executa una recomanació prèvia amb criteri. `PROFILE.md` és la millor càpsula d'identitat que ha produït el sistema: curta, honesta, amb el Reflex per damunt del gallet cultural. El registre v3 té exactament l'estructura que una taxonomia necessita (li falta sobirania, no disseny). L'enllaçador retirant `--write` amb làpida honesta és cultura de mutació ben apresa. El mode fosc compleix AAA. I `sdp-skill-cli.mjs` continua sent la peça que la resta del sistema hauria d'imitar.

El sistema no està podrit: està **desendollat**. Tot el que cal per a la Súper-IAIA ja existix en alguna banda del repo. El que esta acta entrega és, literalment, els cables.

---
*Seient Núm. 5 — auditat amb `node` v22, `diff`, mod-97 i zero compassió, com es va demanar.*


---

**Ancoratge de Seguretat:** [[00_MEMORIAL_Lapides#00_INDEX_ARXIU_SECUNDARI|00_INDEX_ARXIU_SECUNDARI †]]
