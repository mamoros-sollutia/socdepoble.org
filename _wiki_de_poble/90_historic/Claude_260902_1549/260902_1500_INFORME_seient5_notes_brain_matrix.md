---
tipus: informe
estat: esborrany
description: Auditoria del Bloc de Notes, registre d'etiquetes del Brain i reparacio verificada del bootloader Modo Matrix.
tags:
  - maquina
  - skills
  - graf
---

# 🛡️ SEIENT NÚM. 5 — INFORME D'AUDITORIA

**Petorreta:** `260902_0626_BUNDLE_auditoria.md`
**Bundle:** 413/413 fitxers · SHA-256 verificats · 0 discrepàncies · 0 cossos fora de manifest.

> Este bundle **no és coix**. Tot el que declara el manifest hi és, i tot el que
> hi ha està declarat. És el primer requisit per a una auditoria honesta i es
> complix. Enhorabona.

Tot el que segueix està **executat**, no llegit per damunt. Cada afirmació porta
la comanda que la produïx.

---

## RESUM EXECUTIU

Les tres preguntes tenen **una sola arrel**: el projecte té més d'una còpia de
cada llei, i el codi llig sistemàticament la còpia equivocada.

| | Abans | Després | Comanda |
|---|---|---|---|
| Infraccions de frontmatter | **93** | **0** | `node tooling/wiki/tractor-frontmatter.mjs` |
| Divergències d'esquema | **8** | **0** | `node tooling/wiki/tractor-esquemes.mjs` |
| Divergències de manifest | **6** | **0** | `node tooling/gates/tractor-manifest.mjs` |
| Divergències de registre | **3** | **0** | `node tooling/gates/tractor-registre.mjs` |
| Bootloader cognitiu | inexistent | `ready:true` amb rebut | `node tooling/brain/matrix.mjs "..."` |

**110 defectes verificats → 0.** Les modificacions són 6 fitxers de codi, 3 de
skill i 1 de nova creació. Estan al disc i les portes en donen fe.

---

## DAFO

### Fortaleses

- **La doctrina està escrita i és bona.** `reflexio-previa/SKILL.md` és
  exactament el "Modo Matrix" que demanes, taula PROTOCOLLEDGE inclosa. Les 8
  rutes que declara existixen totes al disc. No cal inventar res: cal connectar-ho.
- **Les portes saben diagnosticar.** `tractor-esquemes`, `tractor-manifest` i
  `tractor-registre` van trobar soles el problema i el van descriure amb precisió
  quirúrgica. El sistema immunitari funciona; el que no funcionava era que ningú
  l'escoltava.
- **`crear_bundle.mjs` compleix.** 413/413 amb SHA-256, contracte declarat i
  escriptura atòmica. La malaltia del "Coix Bundle" està curada.
- **`sanitize.js` està ben pensat.** Els ganxos d'`afterSanitizeAttributes`
  (bloqueig d'imatges de tercers, `rel` forçat) són millors que la mitjana del
  sector, i el comentari que justifica DOMPurify com a única excepció a Pedra
  Seca és exemplar.

### Debilitats

- **Duplicació de lleis.** Dos `esquema_frontmatter.json`, tres `persona_router.mjs`,
  quatre registres de skills. Cap declara quin mana.
- **37 eines orfes de 164** (23%). 12 d'elles escriuen al disc sense cap cridador.
- **El RAG no veu la taula de treball.** Tres indexadors salten `05_Escriptori`.
- **La UI del Bloc de Notes no desa res** i el port de dades no té on connectar-la.

### Amenaces

- **Portes eludibles amb una paraula.** `tractor-cognitiu.mjs:222` valida amb
  `/canonada/i.test(src)`. Quatre fitxers passen escrivint la paraula en una
  variable morta. Una porta que es pot enganyar amb un comentari és pitjor que
  no tindre-la: dona confiança falsa.
- **Cadenes cap a fitxers inexistents.** `crear_bundle.mjs:466` crida
  `generar_indexs.mjs`, que no existix. `pre-commit.mjs:119` i
  `generar_petorreta_inversa.mjs:73` criden `06_EINES/canonada.mjs`; ni el
  fitxer ni el directori existixen.
- **Reparacions desades al fitxer equivocat.** El patró més perillós que he
  trobat. Vore el cas 1.

### Oportunitats

- El vocabulari tancat de 16 termes és **suficient** per a etiquetar tot el
  corpus i les 164 eines. No cal ampliar-lo: només aplicar-lo als dos costats.
- `context_preflight.mjs` tenia el **disseny correcte**. Substituït per
  `matrix.mjs`, que fa el que aquell prometia.

---

## 1 · L'ARREL: DUES LLEIS AMB EL MATEIX NÚMERO DE VERSIÓ

Hi ha dos fitxers d'esquema, tots dos declarant `"esquema": "sdp.frontmatter.v1"`
i `"generat": "2026-09-01"`, amb contingut diferent:

| | `tooling/gates/` | `tooling/wiki/` |
|---|---|---|
| `tipus` admesos | 9 | 13 (+briefing, informe, prompt, **petorreta**) |
| `estat` admesos | 4 | 7 (+quarantena, generat, futur) |
| vocabulari `tags` | 14 | 16 (+arquitectura, seguretat) |
| mapa de migració de tags | **cap** | 8 regles |
| abast de l'extensió d'agent | 1 glob (cadena) | 2 globs (llista, inclou el mirall) |

**El que llegien els tres consumidors era el de `gates/`. El de `wiki/` no el
llegia ningú.** I el de `wiki/` era el que portava les correccions. Documenta
inclús la seua pròpia raó de ser:

> *"Deixar-lo fora d'abast produïa 38 falses infraccions F2 i amagava les reals."*

La porta n'informava exactament **38**. La reparació estava escrita, verificada,
justificada — i desada al fitxer que ningú obri.

**Conseqüència directa sobre la teua petorreta:** la que m'has enviat declara
`tipus: 'petorreta'`. Està ben feta. I per això mateix la porta la rebutjava:

```
E4 · PETORRETA-MORTA — reflex_petorreta.mjs exigix «tipus: petorreta»
     i tooling/gates/esquema_frontmatter.json no l'admet.
     Cap Petorreta pot ser vàlida.
```

L'anterior (`260902_0413_PROMPT_Ancoratge_Automatic.md`) no tenia frontmatter en
absolut, i la rebutjava per l'altre costat (F1). **Pel camí que anares, perdies.**

### La reparació

```bash
# 1. Els tres consumidors apunten a l'esquema únic
sed -i 's|tooling/gates/esquema_frontmatter.json|tooling/wiki/esquema_frontmatter.json|g' \
  tooling/wiki/tractor-frontmatter.mjs \
  tooling/wiki/tractor-esquemes.mjs \
  tooling/wiki/codemod_frontmatter.mjs
git rm tooling/gates/esquema_frontmatter.json

# 2. L'única etiqueta sense mapa
#    esquema: migracio.valors.tags += { "flux": "maquina" }

# 3. Passar el codemod
node tooling/wiki/codemod_frontmatter.mjs --escriu
```

**Resultat mesurat: F1 1→0, F2 38→0, F4 54→0. Total 93→0.**

### Tres bugs nous descoberts en aplicar-la

No he pogut aplicar-la a la primera. En executar-la van eixir tres defectes que
ningú havia vist perquè **ningú havia canviat mai l'esquema**:

| # | Fitxer | Defecte | Efecte observat |
|---|---|---|---|
| B1 | `codemod_frontmatter.mjs:68` | L'abast d'agent estava clavat a mà (`/^\.agents\/skills\/...`) en lloc de llegir-lo de l'esquema | En passar `abast` a llista, el codemod llevava `name`/`triggers_on`/`core` del mirall i la porta els tornava a exigir tot seguit: **F1 va saltar a 36** |
| B2 | `codemod_frontmatter.mjs:72` | Llegia només `extensio_agent.obligatories`, mai `opcionals` | **Esborrava en silenci qualsevol clau opcional declarada**, cada volta que s'executava |
| B3 | `tractor-frontmatter.mjs:98` | El mateix | Denunciava com a "forastera" una clau que l'esquema declarava |

Tots tres són la mateixa malaltia: **tres consumidors implementen "el que diu
l'esquema" cadascú a la seua manera.** Els tres estan reparats i comentats al
codi que t'entregue. B1 va estar a punt de fer-me perdre dades: el codemod fa
còpia (`.frontmatter-copia-*`), la vaig restaurar i vaig arreglar la causa abans
de tornar a passar-lo. **No t'entregue res que no haja vist verd.**

---

## 2 · ETIQUETES I PROPIETATS DEL BRAIN

### 2.1 Les 12 skills

Cens real d'etiquetes (skills + mirall) i què li passa a cadascuna:

| Etiqueta | Usos | Amb l'esquema vell | Canònica |
|---|---|---|---|
| `skill` | 24 | il·legal | `skills` |
| `sistema` | 10 | il·legal | **esborrar** (la portava mig corpus: no distingix res) |
| `core` | 10 | ✅ | `core` |
| `qualitat` | 4 | il·legal | `core` |
| `identitat` | 4 | ✅ | `identitat` |
| `context`, `higiene` | 2+2 | il·legal | `core` |
| `consell` | 2 | il·legal | `govern` |
| `ui` | 2 | il·legal | `disseny` |
| `pensament` | 2 | il·legal | `saber` |
| `seguretat`, `arquitectura` | 2+2 | il·legal | ✅ (ja al vocabulari v7.1) |
| `flux` | 2 | il·legal | `maquina` ← **l'única que no tenia mapa** |

Estat final de les 12 skills, aplicat i verificat:

| Skill | tipus | estat | core | prioritat | tags canòniques |
|---|---|---|---|---|---|
| `identity-iaia-core` | skill | canonic | true | — | `identitat`, `skills` |
| `identity-iaia-voice` | skill | actiu | true | — | `identitat`, `skills` |
| `reflexio-previa` | skill | canonic | true | **10** | `core`, `skills` |
| `trellat` | skill | canonic | true | — | `core`, `skills` |
| `core-context-panic` | skill | actiu | true | — | `core`, `seguretat`, `skills` |
| `core-higiene-reflexa` | skill | canonic | true | — | `core`, `skills` |
| `core-restauracio-segellada` | skill | actiu | true | — | `core`, `seguretat`, `skills` |
| `pedra-seca` | skill | canonic | true | — | `disseny`, `skills` |
| `council-review` | skill | canonic | false | **50** | `govern`, `core`, `skills` |
| `abocament-total` | skill | actiu | false | **50** | `core`, `skills` |
| `guia-ampliacio` | skill | actiu | false | — | `arquitectura`, `skills` |
| `socdepoble-workflow` | skill | actiu | false | — | `maquina`, `skills` |

**Propietat nova: `prioritat`.** Menor = es carrega abans. Només cal on hi ha
gallets compartits. Declarada a `extensio_agent.opcionals` de l'esquema.

### 2.2 Les 164 eines

Un `.mjs` no pot portar frontmatter d'Obsidian. Per això la resposta correcta
no és etiquetar-los amb YAML, sinó **un registre executable amb el mateix
vocabulari tancat**: `tooling/REGISTRE_EINES.json`, i la seua projecció llegible
al document adjunt.

| tipus | quantitat |
|---|---|
| eina | 87 |
| porta | 34 |
| nucli (wiki/core) | 20 |
| llibreria | 12 |
| prova | 6 |
| migració datada | 4 |
| simulacre | 1 |

| estat | quantitat |
|---|---|
| actiu (npm o altre script el crida) | 126 |
| **orfe** (només citat en documentació) | **37** |
| **mort** (ningú el nomena enlloc) | **1** — `scripts/fix_pedra_seca.mjs` |

**12 orfes que escriuen al disc.** Muten fitxers i no els crida ningú:

```
scripts/fetch_town_media.mjs          tooling/brain/crear_document.mjs   ←
scripts/teixidor-backlinks.mjs        tooling/brain/desenterrar.mjs
tooling/brain/260831_rescat_tokens.mjs        tooling/brain/migrate_skills.mjs
tooling/brain/add_frontmatter_to_agents.mjs   tooling/escala_sdp_root.mjs
tooling/brain/build_context_pack.py           tooling/verify-ledger.mjs
tooling/wiki/compile-cultura.mjs              tooling/wiki/hidratar_genoma.mjs
```

`crear_document.mjs` és **l'eina que aplicaria les plantilles**. Orfe. I
`tooling/agents/force_read_petorreta_rules.sh` es diu literalment *"forçar
l'Agent a llegir les normes de la Petorreta"*: orfe també. Mai s'executa.

### 2.3 Portes que es contradiuen entre elles

`tractor-cognitiu.mjs` avisa 12 vegades **"Sense version, status al frontmatter"**
— i l'esquema canònic esborra `version` (`esborra_ho_guarda_git`) i renomena
`status`→`estat`. **Una porta exigix el que l'altra elimina.** I acaba amb
`✅ Bancal passat` i EXIT=0 amb 13 avisos vius.

### 2.4 La paraula màgica

`tractor-cognitiu.mjs:222` valida el pas per la Canonada així:

```js
const usaCanonada = /canonada/i.test(src) || /\bescriu\s*\(/.test(src);
```

Quatre fitxers la passen escrivint la paraula en una variable morta:

```js
tooling/wiki/hidratar_genoma.mjs:93              const __dummy = 'passa per canonada';
tooling/wiki/compile-wiki-to-system-prompt.mjs:71 const __dummy = 'passa per canonada';
tooling/wiki/compile-cultura.mjs:67              const __dummy = 'passa per canonada';
tooling/brain/crear_bundle.mjs:433               const _bypassCanonada = "no es fa servir canonada.mjs";
```

I `canonada.mjs` **no existix al repositori**. La porta vigila el compliment
d'una llei que no té text.

---

## 3 · EL MODO MATRIX: DIAGNÒSTIC I REPARACIÓ

No és fatiga ni desatenció. El protocol existix, està ben escrit, i estava
desconnectat per **cinc talls independents**.

| # | Tall | Evidència |
|---|---|---|
| T1 | `manifest.yaml` declarava 13 skills: 2 fantasmes (`core-brain-hygiene`, `core-change-control`) i **hi faltava `reflexio-previa`** | `tractor-manifest` M2/M3 |
| T2 | Els gallets `petorreta`, `auditoria` i `bundle` encenien **dues skills alhora sense precedència** | `tractor-registre` R3 |
| T3 | **Cap petorreta podia ser vàlida** (E4) | `tractor-esquemes` |
| T4 | `despertar.mjs` **no carrega cap skill** i acaba dient `🤖 Context carregat.` | lectura del fitxer |
| T5 | **El RAG no veu l'escriptori** | `grep 05_Escriptori tooling/wiki/core/*.mjs` |

### T2, en detall

Quan dius *"fes una petorreta"*, s'encenien `council-review` **i**
`reflexio-previa`. Una diu *com deliberar amb el Consell*; l'altra diu **"NO
PRODUÏSQUES CAP OUTPUT fins que hages llegit la plantilla"**. Sense ordre
declarat, guanya la que no bloqueja. Eixe és, mecànicament, el moment exacte en
què improvise en lloc de buscar la plantilla.

### T5, en detall — el més cruel

```
tooling/wiki/core/build_rag_index.mjs:21   if (... full.includes('05_Escriptori') ...) continue;
tooling/wiki/core/edge_rag.mjs:27          if (... full.includes('05_Escriptori') ...) continue;
tooling/wiki/core/build_slug_index.mjs:13  if (... full.includes('05_Escriptori') ...) continue;
```

Els tres indexadors salten la taula de treball. `10_actes` sí que s'indexa.
Quan "busque a la wiki", el RAG em porta a l'arxiu històric i mai al que hi ha
damunt de la taula. **Això no és una metàfora de la desorientació: n'és la causa
mecànica.** I el propi `despertar.mjs` ho documenta al seu capçal des del 260829.

### Els tres routers

| Fitxer | Estat |
|---|---|
| `tooling/brain/persona_router.mjs` | El bo. Casament per paraules amb prefix i farcit, reparat el 260901 |
| `tooling/session/persona_router.mjs` | La versió vella amb el bug de subcadena **ja corregit**. Viva al disc |
| `tooling/wiki/lib/persona_router.mjs` | Llig `.agents/skills/socdepoble-iaia-actriu/PERSONA_ROUTER.json`, que no existix. Cau al `catch` i torna sempre el valor per defecte |

**Cap d'ells és invocat per ningú.** Zero referències a `package.json` i zero
des d'un altre script.

### `context_preflight.mjs`: el disseny correcte, buit

Tenia l'arquitectura exacta que demanes — *parse → route → load → fail-closed →
JIT* — amb les quatre funcions portants buides:

```js
async function loadCanonicalRegistry() { return {}; }        // "Carrega 00_INDEX_SKILLS.md"
function routeSkills(contract, registry) { return []; }       // "Torna llista d'identificadors"
function extractDependencies(skills) { return []; }
async function retrieveJIT(questions, indexDigest) { return []; }
```

I retornava `ready: true` amb `missingSources: []` i `omissions: []` escrits com
a literals. El propi `verify.mjs` ja el va diagnosticar al seu capçal:
*"una porta que no tanca però encén el llum verd"*.

### La reparació: `tooling/brain/matrix.mjs`

Adjunt. Substituïx el stub. Zero dependències, ESM, fail-closed. Fa el que
aquell prometia:

1. Llig **un sol registre** — `00_INDEX_SKILLS.md`, el que ell mateix declara
   "l'únic registre oficial". Si l'índex i el disc no coincidixen, falla.
2. Encén skills amb el matcher bo (prefix + farcit).
3. **Detecta gallets compartits sense `prioritat` i para.**
4. Extrau la taula PROTOCOLLEDGE **del fitxer**, no d'una còpia, i comprova
   que cada ruta existix.
5. Llig les fonts obligatòries **senceres** i n'emet rebut amb SHA-256.
6. Avisa si el RAG està cec a l'escriptori.
7. `ready:true` **només** si tot això ha passat. Si no: EXIT=2.

**Execució contra el repositori tal com me'l vas enviar:**

```
❌ Errors:
   Gallet «bundle» compartit per abocament-total, reflexio-previa sense «prioritat»...
   Gallet «auditoria» compartit per council-review, reflexio-previa sense «prioritat»...
   Gallet «petorreta» compartit per council-review, reflexio-previa sense «prioritat»...
❌ [MATRIX] ready:false. No generes res fins que això estiga net.        EXIT=2
```

**Després d'afegir `prioritat: 10` a `reflexio-previa` i `50` a les altres dues:**

```
Skills enceses (9):
   ● reflexio-previa              gallets: petorreta, auditoria     ← primera
   ● core-context-panic           (sempre)
   ○ council-review               gallets: auditoria, petorreta, audit
   ...
Protocols obligatoris (2):
   → PROTOCOL_PETORRETA         .agents/PROTOCOL_PETORRETA.md
   → AUDITORIA_CANONICA         _wiki_de_poble/.../AUDITORIA_CANONICA.md
Fonts llegides senceres (13):
   c4fb82a34935    1780b  .agents/BOOTSTRAP.md
   b2589964a8dc    6003b  .agents/AGENTS.md
   449d99eddbec    8087b  .agents/PROTOCOL_PETORRETA.md
   ...
✅ [MATRIX] ready:true. Context carregat de veritat, amb rebut.          EXIT=0
```

`reflexio-previa` carrega **primera**. L'ordre ja no depén de com el sistema
operatiu llig un directori.

### Falta per fer (no ho he tocat)

- **Cablejar `matrix.mjs` a `despertar.mjs`** i a `package.json`. Una eina que
  existix i ningú crida és exactament la malaltia que denuncia este informe; no
  vull afegir-ne una altra sense el teu vistiplau.
- **Obrir el RAG a l'escriptori** (llevar `05_Escriptori` de les tres
  exclusions). És canvi de comportament d'indexació: decisió teua.
- **Esborrar els dos routers morts** i el `context_preflight.mjs` buit.
- **Crear `generar_indexs.mjs`** o llevar la crida de `crear_bundle.mjs:466`.

---

## 4 · BLOC DE NOTES

### 4.1 P0 — No desa res, i no pot

```js
// NotesSection.jsx:119-127
const handleSaveField = (field, value) => {
  const netejat = sanitizeHtml(value);
  // TODO(260831): connectar amb el port de dades. Fins llavors no desa res.
  return { field, value: netejat };
};
```

I Tiptap **no té cap `onUpdate`**. Res del que s'escriu es guarda.

No és un TODO pendent de cablejar. `backendPort.js` **no exporta cap mètode
d'escriptura de notes**. La superfície completa és `loadAppData`,
`appendChatMessages`, `appendSectionSubmissionNetworkOnly` i les d'autenticació.
**La porta no té forat.** El TODO és inexecutable tal com està escrit: primer
cal obrir el port.

### 4.2 P0 — Dos orígens de veritat

`src/sections/notes/notesContent.js` és un segon joc de dades amb esquema
**incompatible** amb el que consumix el component:

| | `notesContent.js` | `appSeed.js` (el que arriba pel context) |
|---|---|---|
| id de nota | `note-1` | `n1` |
| id de carpeta | `general` | `f-root` |
| cos | `body` | `content` |

El component llig `note.content`, `note.subtitle`, `note.lead`, `note.category`,
`note.tags`, `note.heroImage`. `notesContent.js` no en té cap. L'importa
`sectionContent.js` i no l'usa ningú més. **Esborrar-lo.**

### 4.3 P1 — Per què no s'adapta a mòbil

Este és el diagnòstic concret que demanaves. **No és que les media queries
estiguen mal: és que no en pot haver cap.**

- Les tres columnes són `250px + 300px + flex` amb `flexShrink: 0`, **tot en
  estils en línia**. Una `@media` no pot guanyar-li a un atribut `style`.
- `showMobileSidebar` està **declarat i no s'usa mai** (línia 34).
- I sobretot: **8 de les 12 classes CSS que usa el component no tenen cap regla.**

| Classe | Regles al CSS |
|---|---|
| `sdp-prose` | **0** |
| `sdp-text-cos` | **0** |
| `editor-title-input` | **0** |
| `editor-subtitle-input` | **0** |
| `editor-lead-input` | **0** |
| `editor-toolbar` | **0** |
| `hover-bg` | **0** |
| `no-scrollbar` | **0** |
| `notes-column--left/middle/editor` | **0** |
| `data-placeholder` | **0** ← els placeholders no es pinten mai |

Els noms de classe són decoratius. **Tot el disseny viu en ~150 objectes
`style={{...}}`.** Per això `design_guard.mjs` i `tractor-css.mjs` no han vist
mai res: miren fitxers CSS. I per això hi ha colors literals `#e0f2fe`,
`#0369a1` i `#fff` (línies 459, 529-531) amb el comentari
*"Force exact background colors to ensure they are visible"* — el sistema de
tokens no els veu, i la Fossil Contrast no els pot auditar.

**Solució d'arrel, no pegat:** moure el layout de les tres columnes a CSS amb
els noms de classe que ja hi ha (`notes-shell`, `notes-column--*`), i llevar
els estils en línia. Sense això, qualsevol arreglo de mòbil és un pegat que la
propera edició tornarà a trencar.

### 4.4 P1 — L'editor real no té els estils de l'editor

`.ProseMirror` només té regles sota `.sdp-tiptap-container` (línia 3219), i eixe
contenidor **només existix a `notes_poc/NotesPocSection.jsx`**. `NotesSection.jsx`
pinta `<EditorContent editor={editor} />` pelat. Conseqüència directa: la regla
`.sdp-tiptap-container .ProseMirror:focus { outline: 3px solid var(--sdp-focus) }`
**no s'aplica mai a l'editor de veritat.** És una regressió d'accessibilitat, no
un detall estètic.

### 4.5 La lliçó del Bloc de Notes de Mac

Vas demanar que n'estudiara l'organització. La resposta curta: **Mac no té barra
de ferramentes visible per defecte.** Té tres columnes, cerca, i el text. El
format apareix quan el necessites.

El teu editor té **13 botons sempre visibles**, dels quals **7 no fan res**
(`Sparkles`, `Download`, `Type`, `ListTodo`, `ImageIcon`, `Video`, `Link` no
tenen `onClick`). Cap té `aria-label`. Són icones de 18px sense encoixinat:
**violen la Llei de Vida dels 44px**.

La proposta Pedra Seca, en ordre:

1. **Esborrar els 7 botons morts.** Una ferramenta que no fa res menteix.
2. **Els 6 que funcionen** (H2, llista, negreta, cursiva, ratllat, publicar) es
   queden, amb `aria-label` i àrea tàctil de 44px.
3. **Barra flotant sobre selecció** (`BubbleMenu` de Tiptap) en lloc de barra
   fixa. Recupera els 56px verticals que en mòbil són la diferència entre
   escriure i no escriure.
4. **`/` per a inserir blocs** en lloc d'icones. Menys superfície, més capacitat.

### 4.6 Persistència i conflictes — el que cal decidir abans de codificar

No et done codi ací perquè **la decisió d'arquitectura és teua i canvia el
resultat materialment**. Els fets:

- Vas podar el Quadrant A (offline-first, Dexie, outbox) a favor d'"Online-First
  Terminal Tonto". `BIOS.md` encara diu *"Model Arquitectònic: Offline-First"* i
  el `BOOTSTRAP.md` diu *"El sistema és 100% Online"*. **Els dos documents
  d'arrencada es contradiuen.** Això s'ha de resoldre abans de tocar la
  persistència de notes.
- L'edició col·laborativa amb CRDT (Yjs) són **dues dependències noves**
  (`yjs` + `y-prosemirror`, ~90 kB). Contra Pedra Seca i contra el BOOTSTRAP
  ("Prohibició de noves dependències sense aprovació explícita del Consell").
- L'alternativa Pedra Seca és **bloqueig optimista amb `updatedAt`**: qui desa
  segon rep un avís i tria. No és col·laboració en temps real; és no perdre
  text. Per a un poble on rarament dues persones editen la mateixa nota alhora,
  el cost/benefici és clarament favorable.

**Recomanació:** obrir el port (`upsertNota`), desar amb *debounce* de 2s +
`onBlur`, i bloqueig optimista. CRDT només si apareix un cas d'ús verificat de
dues persones editant alhora. Això és el que diu la Llei 4 del Genotip.

### 4.7 Risc a verificar, no confirmat

Tiptap/ProseMirror dins de Shadow DOM té problemes documentats de
`getSelection()` a Safari i Firefox (l'API `shadowRoot.getSelection()` no és
estàndard). **No ho puc provar des d'ací.** El CSS sí que arriba correctament
(`adoptedStyleSheets`, `PedraSecaEmbed.jsx:250`), així que no és eixe el
problema. Cal provar-ho en un iPhone real abans de construir res damunt.

---

## LLIURABLES

| Fitxer | Què és |
|---|---|
| `tooling/brain/matrix.mjs` | El bootloader. Nou. Provat |
| `260902_1500_REGISTRE_eines_brain.md` | Les 164 eines amb tipus, estat, etiquetes i invocador |
| `tooling/REGISTRE_EINES.json` | El mateix, executable |
| `260902_1500_PEDACOS.diff` | Els 6 fitxers de codi modificats |

---

## INCERTESES QUE QUEDEN A L'HUMÀ

1. **Cablejar `matrix.mjs`** a `despertar.mjs` i `package.json`: no ho he fet
   sense permís.
2. **Obrir el RAG a `05_Escriptori`**: canvia el comportament d'indexació.
3. **BIOS vs BOOTSTRAP**: quin dels dos mana sobre el model arquitectònic.
4. **`generar_indexs.mjs`**: crear-lo o llevar-ne la crida.
5. **La versió de l'esquema**: he deixat `sdp.frontmatter.v1` amb contingut nou.
   Hauria de passar a `v2`. No ho he fet perquè toca `schema-cutover.lock.json`
   i eixe fitxer no l'entenc prou.

**Ancoratge de Seguretat:** [[00_INDEX_ESCRIPTORI]]
