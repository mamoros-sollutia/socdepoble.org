# Estudi Deepseek: Auditoria Forense de l'Arquitectura Cognitiva
**Data:** 10 de setembre de 2026 (03:24)
**IA:** Deepseek
**Origen:** Petorreta d'Auditoria Estructural

# AUDITORIA FORENSE — Arquitectura cognitiva i Tooling

**Objecte**: `260910_0301_BUNDLE_auditoria_estructural.md` — 429 fitxers, ~2,9 MB. Abast real analitzat: `_wiki_de_poble/`, `.agents/`, `tooling/`, `scripts/`, migracions `supabase/`, i part de `src/`.
**Mètode**: lectura creuada manifest ↔ contingut ↔ referències internes. Cada afirmació mecànica s'ha contrastat amb l'existència física del fitxer citat.

---

## 0. Nota prèvia: el bundle menteix sobre el seu abast

Has dit que està tallat abans de `src/`. **No és cert.** Dins del contingut hi ha `src/app/App.jsx` (675 línies), `src/host.js`, `src/data/backendPort.js`, `src/data/supabaseBackend.js`, `src/PedraSecaEmbed.jsx`, `src/config/i18n.js` (1653 línies), i 40 fitxers més de `src/`. El tall físic es produeix **dins** de `tooling/wiki/teixidora_sinapsis.mjs`, a mitjan definició de constants.

Açò vol dir una de dues coses, i totes dues són greus:

1. **El manifest descriu un bundle, el contingut n'és un altre.** El bloc `MANIFEST` afirma `totals.fitxers: 429, bytes: 2896543`. Si el bundle s'ha tallat, eixes sumes són falses al cos. El propi document demana al lector «extrau el cos i compara les sumes» — i eixa comparació, feta, fallaria.
2. **O la narració de l'abast és errònia i l'auditor està veient un bundle diferent del que creu veure.** Pitjor encara: el contracte declarat al manifest diu `verificat: true` i `absents_no_critics: [".agents/deute/.frontmatter-deute.json"]`. Però aquest fitxer no és opcional al codi: `reflex_petorreta.mjs` i `preflight_matrix_wrapper.mjs` el citen. És un **deute declarat com a no-crític quan el mateix sistema el cita com a obligatori**.

---

## 1. El cisma de noms: tres àncores estructurals simultànies

Aquesta és la troballa més destructiva de totes. **La Wiki té, alhora, tres esquemes de rutes diferents, i cap dels tres sap quins són els altres dos.**

### 1.1 Rutes físiques al disc (les que veu el lector del bundle)

```
_wiki_de_poble/00_INDEX.md
_wiki_de_poble/01_Ser/00_BIOS.md
_wiki_de_poble/01_Ser/01_IDENTITAT.md
_wiki_de_poble/02_Saber/00_arquitectura_tecnica_unificada.md
_wiki_de_poble/02_Saber/DOC_Governanca.md
_wiki_de_poble/03_Actuar/00_INDEX_ACTUAR.md
_wiki_de_poble/04_Escriptori/00_INDEX_ESCRIPTORI.md
```

### 1.2 Rutes referenciades al contingut dels documents

Dins de `_wiki_de_poble/02_Saber/00_INDEX_IDENTITAT.md`:

> «[[00_INDEX_IDENTITAT]] (Nucli d'Identitat)»
> «[[04_ESCRIPTORI/01_Produccio/contracte_graella]]»
> «[[00_SER_Brain_Identitat/00_AGENTS_I_SKILLS_MIRROR/AGENTS_skill-acte-reflex.md]]»

Dins de `.agents/BASELINE.md`:

> `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/architecture/ADR-2026-08-ONLINE-FIRST.md`

Dins de `tooling/wiki/reflex_petorreta.mjs`:

> `const WIKI_BASELINE_RELATIVE = 'tooling/wiki/wiki-baseline.lock.json';`
> `const GRAPH_CONFIG_RELATIVE = '_wiki_de_poble/.obsidian/graph.json';`

Dins de `tooling/wiki/lib/project_paths.mjs`:

> `export const ESCRIPTORI_DIR = path.join(WIKI_DIR, '05_Escriptori_Soc_de_Poble');`
> `export const EN_CURS_FILE = path.join(ESCRIPTORI_DIR, '00_EN_CURS.md');`
> `export const ARXIU_DIR = path.join(WIKI_DIR, '04_ARXIU_Documents_Historics');`

### 1.3 El vocabulari canònic (que el disc contradiu)

`.agents/AGENTS.md §12` diu literalment:

> «**04_ESCRIPTORI**: És l'escriptori de treball.»

I `tooling/wiki/sdp-cli.mjs` diu:

> `else if (arg.startsWith('--wiki=')) options.wikiDir = path.resolve(arg.slice(7));`

I `tooling/lib/arrel.mjs`:

> `escriptori: '_wiki_de_poble/04_ESCRIPTORI',`
> `arxiuHistoric: '_wiki_de_poble/05_ARXIU',`

**Quatre noms diferents per al mateix node:**

| Ànima del node | Ruta física | `CAMINS` diu | `.agents/AGENTS.md` diu | `sdp-cli` diu |
|---|---|---|---|---|
| Escriptori | `04_Escriptori` | `04_ESCRIPTORI` | `04_ESCRIPTORI` | `05_Escriptori_Soc_de_Poble` |
| Arxiu | *(no hi és al bundle)* | `05_ARXIU` | — | `04_ARXIU_Documents_Historics` |
| Identitat | `01_Ser` | — | — | `00_SER_Brain_Identitat` |
| Saber | `02_Saber` | — | — | `01_SABER_Cultura_Coneixement` |
| Actuar | `03_Actuar` | — | — | `02_ACTUAR_Maquina_Tecnica` |
| Governar | *(no hi és al bundle)* | — | — | `03_GOVERNAR_Normativa_Regles` |

**La carpeta `04_Escriptori/` conté `.ancora_sessio.json`** (que és el fitxer que `ancora.mjs` escriu), però `project_paths.mjs` busca `05_Escriptori_Soc_de_Poble/`. Açò vol dir que:

- `ancora.mjs`, en producció, escriuria a `_wiki_de_poble/04_Escriptori/.ancora_sessio.json` — correcte.
- `project_paths.mjs` busca `_wiki_de_poble/05_Escriptori_Soc_de_Poble/00_EN_CURS.md` — **inexistent**.
- `sdp-cli.mjs`, `reflex_petorreta.mjs`, `.agents/AGENTS.md`, i `tooling/wiki/sincronitzar_skills.mjs` (que escriu a `00_SER_Brain_Identitat/...`) treballen sobre noms pre-renom.

**Conseqüència**: el bundle mostra un sistema que **no pot navegar la seua pròpia wiki amb les seues pròpies eines**. `[[wikilinks]]` de sinapsi (que són la major part del contingut) apunten a rutes que no existeixen al disc. L'Autoneteja, el Teixidor, el Llaurador i qualsevol eina que resolgui enllaços treballaran contra un graf fals.

---

## 2. Canons carregats i activament hostils

Has demanat explícitament «canons carregats i desactivats com SDP-LOCK». He trobat **sis**.

### 2.1 `SDP-LOCK` — dispara a cada parada d'agent

Rastre complet:

1. `.agents/hooks.json` declara un hook de `Stop` que executa `.agents/hooks/tancar.mjs`.
2. `.agents/hooks/tancar.mjs` crida `node tooling/gates/tancament.mjs`.
3. `tooling/gates/tancament.mjs` executa, com a primer pas dins del `try`:
   ```js
   execSync('node generar_indexs.mjs', { cwd: rootDir, ... });
   ```
4. **`generar_indexs.mjs` no existeix.** Ni a l'arrel, ni a `tooling/`, ni a `scripts/`. No apareix al manifest.
5. L'`execSync` llança, `tancament.mjs` fa `throw new Error('Error actualitzant índexs: ...')`, i `tancar.mjs` cau al `catch`.
6. El `catch` de `tancar.mjs` escriu `.agents/SDP-LOCK` amb un missatge de bloqueig.
7. `tooling/gates/obrir_torn.mjs` comprova SDP-LOCK i **es nega a obrir cap sessió nova** mentre existisca.

**Resultat operatiu**: cada agent que para deixa el repositori bloquejat. El desbloqueig és manual (`rm .agents/SDP-LOCK`). Si un agent extern (Codex, Qwen, Claude Code) crida el hook Stop automàticament després de cada torn, el sistema es bloqueja sol, sense necessitat que ningú faça res malament.

Aquest és l'exemple més pur de «canó carregat i hostil». **No està desactivat: està apuntant-se a la pròpia cama cada torn.**

### 2.2 `SKILLS_SEAL` — el segell és invàlid per disseny

`.agents/SKILLS_SEAL.json` diu:

```json
{
  "timestamp": "2026-09-10T00:51:36.281Z",
  "hash": "494838904867f95cefca38ea760bfbd7d2df2eb2c89600dcef90de99d3185a42",
  "filesCount": 11
}
```

Tres problemes:

1. **`filesCount: 11`** però al disc hi ha **9 SKILL.md** (`core-context-panic`, `core-restauracio-segellada`, `pedra-seca`, `skill-acte-reflex`, `skill-cicle-de-vida`, `skill-consell-bundle`, `skill-estudi-mercat`, `skill-iaia-identitat`, `universal-page`). El segell és d'una generació anterior. `tooling/gates/segella.mjs` **no admet** `--update` al `package.json`; només pot fallar.
2. **El hash depèn del camí absolut.** Mireu `segella.mjs`:
   ```js
   const agentsDir = path.resolve(process.cwd(), '.agents/skills');
   // …
   for (const file of files) {
     const content = fs.readFileSync(file);
     combinedHash.update(file);       // <-- aquí
     combinedHash.update(content);
   }
   ```
   `file` és la ruta absoluta. Un clon a `/Users/foo/projecte/` i un altre a `/home/bar/projecte/` donaran hashes diferents. **El segell és intransferible entre màquines i, per tant, mai ha estat una garantia real.**
3. **El missatge d'error és correcte però inútil**: «Ruptura de segell detectada!» — correcte, sí, però la causa és que el propi algoritme està mal dissenyat. L'auditor humà pensaria que algú ha manipulat les skills, quan el que ha passat és que el segell no pot ser vàlid.

### 2.3 `reflex_petorreta.mjs` — el lease mai no es pot segellar

El sistema de lease (open → seal → verify → consume) és un intent seriós d'implementar l'equivalent a un «two-man rule» per a mutacions d'alt risc. Però està mort en néixer:

```js
function ruleCandidates() {
  return [
    ['.agents/AGENTS.md'],
    ['.agents/PROTOCOL_PETORRETA.md'],
    ['.agents/skills/socdepoble-workflow/SKILL.md'],
  ];
}
```

`.agents/skills/socdepoble-workflow/SKILL.md` **no existeix al bundle**. `.agents/skills/00_INDEX_SKILLS.md` no el llista. `.agents/manifest.yaml` no el declara.

Conseqüència immediata: qualsevol crida a `openReflex()` fa `loadRules()`, que llança `Error: Falta regla obligatòria: .agents/skills/socdepoble-workflow/SKILL.md`. **Cap lease es pot obrir mai. Cap mutació d'alt risc pot passar pel Reflex.** El protocol sencer, amb els seus 12 punts, els seus claims d'un sol ús, la seua materialització d'arbre, el seu `consume-commit`… és teatre.

Açò explica per què `tancament.mjs` i `tancar.mjs` s'han de suportar amb SDP-LOCK: el sistema primari (Reflex) no funciona, i s'ha hagut de construir un pany de fusta (SDP-LOCK) al costat.

### 2.4 `Baselines de deute` — permisos permanents disfressats de ratchets

Hi ha 8 fitxers `.agents/deute/*.json`:

| Fitxer | Deute congelat |
|---|---|
| `.design-guard-deute.json` | `inline-style: 125`, `touch-too-small: 12`, `raw-color: 33`, … |
| `.estucat-deute.json` | `orfes: 57` (classes CSS) |
| `.pedra-seca-deute.json` | `LLEI_01_CLASSE_ORFENA: 116`, `LLEI_03_ESTIL_EN_LINIA: 121`, `LLEI_08_SUBARBRE_ORFE: 7` |
| `.promesa-deute.json` | `P2: 9`, `P3: 5` |
| `.rutes-deute.json` | `literal-orfe: 103` |
| `.sollutia-deute.json` | *(2 errors RLS pendents)* |
| `.teixit-deute.json` | `penjats: 59` |
| `.vocabulari-deute.json` | `classe-forastera: 168`, `classe-opaca: 13`, `css-de-seccio: 3` |

La idea és que cada número «només pot baixar». Però **res al sistema empeny la baixada**. Les portes comproven `count <= max`. Si cap developer va a reduir els números (i no hi ha cap recordatori, cap alarma, cap gràfic, cap pressió), el resultat pràctic és:

- 168 classes forasteres al vocabulari «canònic» de Pedra Seca, per sempre.
- 103 literals de ruta òrfena, per sempre.
- 59 enllaços penjats declarats, per sempre.
- 121 estils en línia a components que es diuen «Pedra Seca», per sempre.

Açò no és un ratchet: és un **permís de contaminació permanent**. La diferència entre «açò no pot créixer» i «açò no ha de créixer» és que la primera frase s'atura al recompte; la segona exigeix pressió política que no existeix.

### 2.5 `verificador-scc.mjs` — el vigilant que sempre diu «sí»

Aquesta és la versió tècnica del «canó desactivat»:

```js
isOperative(filePath) {
  // La regla és clara: CAP zona exclosa. Tot el que penja del repositori
  // s'ha de mesurar. Ja no amaguem 90_historic ni .agents.
  return true;
}
```

Sempre retorna `true`. Els camps `this.operativePrefixes` i `this.excludedPrefixes` són decoratius. El comentari diu «no amaguem 90_historic» però el codi subsegüent fa servir `IGNORED_DIRS = ['.obsidian', '.quarantena-260830', '.git', 'node_modules', 'dist', 'scratch', 'assets']` — o siga, **amaga `assets/`**, que és un directori d'origen del projecte.

La funció fa la feina contrària del que diu el comentari. Un auditor que llig el codi pensa que vigila tot; el que fa és vigilar `_wiki_de_poble/` menys els quatre directoris que ha decidit ignorar.

### 2.6 `verify.mjs` — tres noms de fitxer que salten la Llei 6

La Llei 6 de `.agents/hooks/verify.mjs` exigeix un rebut Matrix al `.agents/.diari_sessio.jsonl` abans de permetre crear cap document nou a la Wiki. Però:

```js
if (['task.md', 'walkthrough.md', 'implementation_plan.md'].includes(base)) {
  resp('allow', 'fitxer de planificació de l\'arnés');
}
```

Tres noms —`task.md`, `walkthrough.md`, `implementation_plan.md`— salten la llei sencera. Un agent que vulga crear un document sense haver executat `matrix.mjs` només cal que li pose eixe nom i el col·loque **dins de `_wiki_de_poble/`**. La comprovació posterior de «documents a la Wiki» no el veurà, però el fitxer quedarà al repositori i, per tant, al proper bundle i al proper RAG.

**Açò és una porta desactivada amb una etiqueta de «conegut» al costat.** No és un bug d'implementació: és un bypass intencionat que cap document del sistema admet que existeix.

---

## 3. Referències a fitxers que no existeixen

Cada referència d'ací és una bomba de rellotgeria: algú llegeix la doc, escriu codi que assumeix l'existència, i peta en un context on no pot depurar.

| Referència | On | Estat |
|---|---|---|
| `node generar_indexs.mjs` | `.agents/hooks/tancar.mjs` (via `tancament.mjs`) | **absent del repositori** |
| `.agents/skills/socdepoble-workflow/SKILL.md` | `tooling/wiki/reflex_petorreta.mjs:ruleCandidates()` | **absent del repositori** |
| `06_EINES/canonada.mjs` | `tooling/wiki/pre-commit.mjs` | **absent del repositori** |
| `npm run precommit:sdp` | citat a `AUDITORIA_CANONICA.md`, `DOC_Governanca.md` | **no definit a `package.json`** |
| `npm run wiki:test` | citat a `reflex_petorreta.mjs` (comentari), `autoneteja_wiki.mjs` | **no definit** |
| `npm run wiki:audit:strict` | citat a les mateixes fonts | **no definit** |
| `npm run reflex:doctor` | citat a `DOC_Governanca.md` | **és `porta:reflex`** |
| `90_arxiu_historic/` | citat a `.agents/AGENTS.md §5` | **s'anomena `90_historic/` al disc** |
| `_wiki_de_poble/05_Escriptori_Soc_de_Poble` | citat a `.agents/AGENTS.md §3`, `project_paths.mjs`, `sincronitzar_skills.mjs` | **al disc és `04_Escriptori/`** |
| `_wiki_de_poble/00_SER_Brain_Identitat` | citat a `sincronitzar_skills.mjs` (destinació d'escriptura) | **al disc és `01_Ser/`** |
| `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica` | citat a `.agents/BASELINE.md`, `ADR-2026-08` | **al disc és `02_Saber/`** |

Suma: una vintena de referències a coses que no existeixen, o que existeixen amb un altre nom. **El sistema confia en la documentació per a navegar el codi i la documentació menteix.**

---

## 4. Deute estructural: tombstones i scripts morts

`tooling/wiki/` conté, com a mínim, **vuit fitxers el propòsit dels quals és llançar un error**:

- `tooling/wiki/neteja_arrel.mjs` → tombstoned
- `tooling/wiki/neteja_termodinamica.mjs` → tombstoned
- `tooling/wiki/purge_empty_nodes.mjs` → `throw`
- `tooling/wiki/purge_ghost_links.mjs` → només `--apply` està bloquejat però el cos existeix i fa feina
- `tooling/wiki/escombra_penjats.mjs` → `throw` incondicional amb `eslint-disable no-unreachable` al capdamunt
- `tooling/wiki/sanador_wiki.mjs` → `throw` incondicional, mateix patró
- `tooling/wiki/escriptori_to_wiki.js` → tombstoned
- `tooling/wiki/consolidar_etiquetes.mjs` → `throw` incondicional
- `tooling/wiki/tallafocs.cjs` → `process.exit(2)` incondicional

El patró és sempre el mateix: un `throw` o un `process.exit` al capdamunt, la resta del fitxer conservada com a «referència» per si mai es restaura. El resultat pràctic:

- **El directori `tooling/wiki/` té 60 fitxers, dels quals 10 no fan res més que morir.** Un nou contribuent ha de llegir cada un per saber quin és viu.
- **Cap eina de neteja automàtica ho detecta.** `tractor-arrel.mjs` no comprova «aquest fitxer té contingut útil o és un throw disfressat?». `verificador-scc.mjs` no ho mira.
- **`package.json` els cita.** `"time-machine"` apunta a un script que ja no hi és. `"porta:scc"`, `"porta:segella"` etc. existeixen per a fitxers que, alguns, només llancen errors.

La decisió de tombstonar en compte d'esborrar ve d'una doctrina respectable («no esborrar sense preguntar»). Però **aplicar-la a scripts interns del tooling és contraproduent**: el git ja guarda la història. Un `git rm` no és destructiu; és exactament per a això que existeix el control de versions.

### 4.1 Duplicacions de concepte

Dins de `tooling/`:

- **Tres routers de persona diferents**:
  - `tooling/brain/persona_router.mjs`
  - `tooling/session/persona_router.mjs`
  - `tooling/wiki/lib/persona_router.mjs`
  
  El primer llegeix `skills_index.json`; el segon, el mateix; el tercer, `PERSONA_ROUTER.json`. Cap està sincronitzat amb els altres.

- **Dos «teixidors» diferents**:
  - `tooling/wiki/teixidor.mjs` — mesura cohesió del graf, escriu deute
  - `tooling/wiki/teixidora_sinapsis.mjs` — enllaça conceptes al cos del text
  - `scripts/teixidor-backlinks.mjs` — versió antiga, separada del directori principal

- **Dos «sistemes immunitaris»**:
  - `scripts/immunitari/plaquetes.mjs` — el que descriu la wiki
  - `tooling/gates/verificador-scc.mjs` — el que crida `tancament.mjs`

- **Tres «llistats de skills»**:
  - `.agents/skills/00_INDEX_SKILLS.md` (que diu «únic registre oficial»)
  - `.agents/skills_index.json` (que diu «índex canònic de skills»)
  - `.agents/manifest.yaml` (que diu «GENERAT. No l'edites a mà.»)
  
  I **quatre consumidors** que llegeixen de fonts distintes: `matrix.mjs` (de l'índex md), `build_skills_index.mjs` (del directori), `persona_router.mjs` (del JSON), `manifest.yaml` (d'ell mateix).

Aquesta duplicació és **exactament el patró que `.agents/AGENTS.md §1` prohibeix**: «Està prohibit crear o llegir còpies de regles». El sistema incomplix la seua pròpia regla número u.

### 4.2 El «Regla Sagrada» i la seua còpia

`.agents/consell.json` diu:

> «Regla: Cap document del projecte pot enumerar el Consell amb prosa pròpia. Tot cens es genera d'ací.»

I `.agents/skills/skill-iaia-identitat/SKILL.md` diu:

> «## Regla Sagrada del Consell (obligatòria)
> Sempre que parlis del Consell, de les Petorretes o de l'equip d'IAs, **enumera TOTES sense excepció**:
> 1. Z.ai — …
> 2. Qwen — …
> …»

La skill **enumera els dotze amb prosa pròpia**, violant literalment la regla que el `consell.json` acaba de declarar. I `tractor-cens.mjs` C5 comprova que `skill-consell-bundle` cite `consell.json`, però **no comprova que `skill-iaia-identitat` no el copie**. El cànon del Consell i la seua duplicació conviuen al mateix bundle.

---

## 5. Colls d'ampolla operatius

### 5.1 La cadena de portes és llarga i està mal ordenada

`tooling/gates/run-portes.mjs` encadena **43 portes**. Si la porta 5 falla, les 38 següents no s'executen. Açò vol dir:

- Un error trivial al pas 5 amaga tots els errors dels passos 6-43.
- L'ordre és: primer `tractor-llavor`, després `porta:promesa`, després `porta:tdz`, després `porta:arrel`, després `porta:enxufe`… Un canvi cosmètic a `src/` pot encendre 20 portes alhora i l'auditor no sap quina és la causa real.
- No hi ha **paral·lelisme**: 43 scripts s'executen un rere l'altre, molts d'ells repetint la mateixa lectura de fitxers. `porta:arrel`, `porta:enxufe`, `porta:manifest`, `porta:doctrina` recorren `tooling/` quatre voltes cadascun.

### 5.2 `arrelSegura()` mor si falta `src/`

A `tooling/lib/arrel.mjs`:

```js
{ cami: 'src', tipus: 'directori', critic: true, nota: 'codi font del Frontend' },
```

I:

```js
if (d.absentsCritics.length) {
  console.error(`❌ [${nom}] Falten peces crítiques del repositori:`);
  …
  return false;
}
```

**Qualsevol eina que cride `prefaci()` o `arrelSegura()` peta en un entorn on `src/` no hi és** — per exemple, un CI que només fa lint de la Wiki, o una imatge Docker que només munta `.agents/` i `tooling/`. El comentari deia que els corroboradors no maten, però `critic: true` sí que mata.

### 5.3 `hooks.json` + `hooks/*.mjs` — l'agent està assegut sobre una cadira de dues potes

- `preflight_matrix_wrapper.mjs` es disculpa al `catch`: «Aquest hook no bloqueja res (PreInvocation no admet decisions)». O siga, el «bootloader» és informatiu.
- `verify.mjs` és l'únic gate real i té tres forats (`task.md`, `walkthrough.md`, `implementation_plan.md`).
- `tancar.mjs` dispara SDP-LOCK.

**Resultat**: el sistema de protecció d'agents depèn d'un sol fitxer (`verify.mjs`) que té un bypass conegut, i un sistema de bloqueig (`SDP-LOCK`) que és el principal risc operatiu de tot el repositori. L'agent està, en la pràctica, **menys protegit que abans de tindre hooks**.

---

## 6. Sostenibilitat a 5 anys

Pregunta: **Aguanta aquesta arquitectura cinc anys?**

Resposta: **no, no aguanta ni dos** — llevat que s'ature el creixement del propi sistema. Anàlisi del vector de destrucció:

**Vector 1 · La complexitat creix exponencialment mentre el contingut útil no ho fa.**
Cada regla nova crea superfície per a una regla nova. `verify.mjs` va passar de tres línies a 200 per fer complir una llei; després va caldre `matrix.mjs` per verificar que `verify.mjs` no es desobeïsca; després caldrà un verificador de `matrix.mjs`. El bundle té **10 cops més línies de codi sobre el codi que línies de codi de producte**. Dins de dos anys, el tooling serà la meitat del repositori i ningú el podrà auditar.

**Vector 2 · La divergència document ↔ codi és acumulativa, no convergent.**
Avui hi ha quatre noms per al mateix node de la wiki. Dins de dos anys, n'hi haurà set. Cap mecanisme del sistema comprova que `.agents/AGENTS.md` diga la veritat sobre les rutes; `tractor-doctrina.mjs` comprova que els camins **citats** existisquen, però no que els camins **canònics** siguen els correctes. La documentació derivarà per sempre.

**Vector 3 · Els «canons carregats» faran fallar el primer dia útil.**
`SDP-LOCK` bloqueja el repositori a cada parada d'agent. `SKILLS_SEAL` rebutja qualsevol verificació. `reflex_petorreta` impedeix qualsevol mutació d'alt risc. Si l'Mestre intenta fer un canvi gros (reanomenar un directori, per exemple), no podrà passar pel sistema. La gent començarà a fer `--no-verify` i `git commit --no-verify`. Una vegada que el bypass es normalitza, tot el sistema és decoratiu.

**Vector 4 · Els baselines no decreixeran mai.**
Cap dels 8 fitxers de deute té data de caducitat, mecanisme de reducció, o cap alarma si no baixa. En cinc anys, `classe-forastera: 168` serà `classe-forastera: 250`, i el cànon s'haurà mogut per acceptar-ho. Açò no és un problema d'eines: és un problema de cultura. L'arquitectura cognitiva actual **no té cap mecanisme per a reduir el deute, només per a detectar-ne de nou**. Un sistema sense mecanisme de sanació acumula.

**Vector 5 · El coneixement útil s'ofega en meta-coneixement.**
Dins de `_wiki_de_poble/` hi ha al voltant de 50 fitxers. D'aquests, **la meitat parlen del propi sistema** (`arquitectura_tecnica_unificada`, `GENOTIP`, `EQUIP_IA`, `Consola_Termodinamica`, `CORE_Registre_Automillora`, `Sistema_Immunitari`, `DOC_Governanca`, `DOC_Taula_Mestra`, `anatomia_cognitiva`, etc.). Una quarta part són plantilles i plantilles de plantilles. Una quarta part és contingut real (pobles, esdeveniments, identitat). El coneixement rural útil —allò pel qual existeix el projecte— està en minoria dins de la seua pròpia casa.

**Vector 6 · El sistema és hermèticament opac a un nouvingut.**
Un nou desenvolupador humà arriba al repositori i troba:
- 43 portes en una cadena.
- 8 baselines de deute amb noms crítics.
- 12 skills amb frontmatter inconsistent.
- 5 maneres de carregar skills.
- 4 noms per a la mateixa carpeta.
- Un SDP-LOCK que bloqueja la primera acció.
- Un `matrix.mjs` que diu que el context està carregat però que no bloqueja res.
- Un `reflex_petorreta.mjs` que no pot segellar res.

**Temps mitjà d'incorporació estimat**: dos dies per a entendre les regles, un més per a aprendre a esquivar-les. Cost real: 3-5 dies per developer. Multiplicat per cada contribuent nou, és el cost més alt del sistema.

---

## 7. Diagnòstic agregat

**Fortaleses reals** (n'hi ha, i són genuïnes):
- El `discoverProjectRoot()` de `arrel.mjs` és un disseny excel·lent.
- El sistema de lease del Reflex (open → seal → verify → consume) és conceptualment correcte.
- L'Autoneteja amb `plan digest`, `manifest` i `restore` és el patró correcte per a migracions massives.
- La idea dels ratchets de deute és honesta.
- `PROTOCOL_PETORRETA.md` està escrit amb una claredat poc comuna.
- `tooling/lib/codi.mjs` és un bon exemple de com fer un parser sense dependències.

**Debilitats crítiques**:
- SDP-LOCK és actiu i hostil.
- SKILLS_SEAL és invàlid per disseny (path absolut).
- Reflex no arranca (skill absent).
- Naming físic divergix del naming referenciat en 4 àncores alhora.
- 20+ referències a fitxers inexistents.
- 10 fitxers tombstonats sense política d'esborrament.
- 3 llistes de skills descoordinades.
- Baselines sense mecanisme de reducció.
- Bypass documentat (o no) al `verify.mjs`.

**Trajectòria**: **negativa i accelerada**. El sistema està afegint complexitat a un ritme superior a la seua capacitat de mantenir-la coherent. El proper canvi gros (per exemple, refactor de `src/`, migració de `Supabase`, integració real amb Sollutia) encendrà 15 portes alhora i no es podrà avançar.

---

## Nota final

Avaluació **específicament de la robustesa i resiliència de l'arquitectura cognitiva i de tooling** analitzada:

# 3 / 10

Justificació dels components:

| Dimensió | Nota | Motiu |
|---|---|---|
| Coherència conceptual | 7/10 | Moltes idees bones, principis ben formulats (Reflex, ratchets, arrel única, plan+manifest+restore). |
| Coherència interna | 2/10 | Quatre noms per al mateix node, tres llistes de skills, dues àncores contradictòries. |
| Executabilitat real | 2/10 | SDP-LOCK bloqueja, Reflex no arranca, SKILLS_SEAL és invàlid per disseny. |
| Tolerància a fallades | 3/10 | El sistema falla tancat però ho fa en el moment equivocat i sense via de recuperació automàtica. |
| Mantenibilitat a 5 anys | 2/10 | Vector de complexitat creixent, mecanismes de reducció absents, cost d'entrada alt. |
| Honestedat documental | 2/10 | La documentació descriu un sistema que no és el que hi ha al disc. |
| Bypass i salvaguardes | 3/10 | Tres bypass coneguts (`task.md`, `walkthrough.md`, `implementation_plan.md`) que cap norma interna reconeix. |

**Un 3 és un «no apte per a producció com a arquitectura cognitiva»**. El que hi ha no és una base sobre la qual es puga construir; és una base que cal **reduir abans de poder-hi construir**. La diferència entre un 3 i un 6 no és afegir més regles: és **llevar-ne**, unificar la nomenclatura, fer que SDP-LOCK deixe de disparar-se, i decidir si el Reflex s'implementa de veritat o s'esborra.

**Recomanacions mínimes** (per si vols un full de ruta, no demanat però pertinent):
1. Esborrar `.agents/hooks/tancar.mjs` i SDP-LOCK del sistema. La seua feina la fa (o hauria de fer) el Reflex.
2. Triar **un** esquema de noms — el físic (`01_Ser`, `02_Saber`, `03_Actuar`, `04_Escriptori`) o el semàntic (`00_SER_Brain_Identitat`, etc.) — i actualitzar les 20+ referències que divergeixen.
3. Esborrar (no tombstonar) els 10 scripts morts.
4. Reduir les 3 llistes de skills a una i fer que els 4 consumidors llisquen d'ella.
5. Decidir si `reflex_petorreta.mjs` s'implementa (afegint la skill que li falta) o s'esborra.
6. Reescriure `segella.mjs` perquè use rutes relatives.
7. Posar data de caducitat als 8 fitxers de baseline.

Cap d'aquests set punts és gran. Cadascun lleva coses. Tots junts podrien portar el sistema d'un 3 a un 6 en un mes. **Però cal fer-los en l'ordre invers a com s'han anat acumulant**: llevar primer, unificar després, afegir mai (o només quan el que ja hi ha no puga cobrir la necessitat).
