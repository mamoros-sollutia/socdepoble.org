---
tipus: auditoria
estat: canonic
description: Dictamen del Seient Núm. 5 sobre NotesSection (mòbil, !important) i el graf cognitiu de les skills
tags:
  - auditoria
  - disseny
  - graf
---
# DICTAMEN DEL SEIENT NÚM. 5 — NOTESSECTION I GRAF COGNITIU

> **Anclatge**: aquest document pertany a l'[[00_INDEX_ESCRIPTORI]].
> **Mètode**: extracció completa del bundle `260902_2208_BUNDLE_auditoria.md`, verificació SHA-256 de 429/429 fitxers, i anàlisi executada sobre el codi real. Cap afirmació d'ací baix és una impressió: totes tenen ordre reproduïble.

## 0. Verificació prèvia del bundle

Abans de dir res, he complit el vostre propi contracte de verificació.

```
Manifest declara : 429 fitxers / 3555930 bytes
Cossos trobats   : 429
SHA-256 OK       : 429
SHA-256 KO       : 0
Al manifest sense cos: 0
```

**El bundle és honest.** El patró «Coix Bundle» no apareix. `crear_bundle.mjs` ja no menteix. Açò és mèrit acumulat i cal dir-ho abans de la crítica.

## 1. NOTA: 6,5 / 10

### Per què no és més baixa

Quatre reparacions de sessions anteriors **han aguantat**, i ho he comprovat, no ho he suposat:

- Abastabilitat des de l'àncora: **81/81 (100 %)**. Zero orfes per grau d'entrada. La feina de connectivitat va quallar.
- Frontmatter: **10 propietats distintes en 81 notes**, 0 notes sense frontmatter. La reducció canònica va quallar.
- `triggers_on` canònic en **12/12** skills. La clau morta `triggers_ca` està erradicada.
- `run-portes.mjs` ja **no** encadena amb `&&`: itera amb `spawnSync` i acumula *totes* les fallades. El bug de la cadena morta està arreglat a l'agregador.
- `sanitizeHtml()` embolcalla **tots** els `dangerouslySetInnerHTML` de `NotesEditor.jsx`.

### Per què no és més alta

Dues coses que creieu certes no ho són, i les dues són del tipus més car: **l'instrument existeix, però no està endollat**.

1. `npm run gate` passa en verd mentre una porta que falla **10× per damunt del seu sostre** no s'executa mai.
2. La secció el mòbil de la qual voleu optimitzar **no té cap regla mòbil**. Zero `@media` en 617 línies de CSS.

Un projecte amb aquesta disciplina documental hauria de tindre un 8. El descompte no és per la qualitat de la pedra, és perquè la porta que havia de vigilar-la està tancada per fora.

## 2. PROBLEMA A — L'espai vertical: el diagnòstic és incorrecte

### L'editor no està estret al mòbil: no hi és

`NotesSection.css` declara tres columnes en fila amb amplades fixes i `flex-shrink: 0`:

```css
.notes-shell        { display: flex; flex-direction: row; overflow: hidden; }
.notes-column--left { width: 250px; flex-shrink: 0; }   /* Carpetes */
.notes-column--middle { width: 320px; flex-shrink: 0; } /* Notes */
.notes-column--editor { flex: 1 1 auto; min-width: 0; } /* Editor */
```

Aritmètica a Mobile S:

```
Amplada viewport          : 320px
Columnes fixes (250+320)  : 570px  [flex-shrink:0 → no cedeixen mai]
Queda per a l'EDITOR      :   0px  [flex:1 1 auto amb min-width:0]
Desbordament ocult        : 250px  [.notes-shell overflow:hidden]
```

**A 320px l'editor rep zero píxels i queda retallat 250px fora de pantalla.** El que veieu no és «poc espai per escriure»: és la columna de Carpetes i mitja columna de Notes. La `NotesToolbar` no és el lladre.

### El vertical: el pressupost és negatiu

Amb els vostres propis tokens (`--sdp-alt-negra: 64px`, `--notes-header-height: 52px`) i el padding declarat:

```
Alçada CSS iPhone SE      : 568
Menys barra Safari        : 508
Menys barra negra (64)    : 444
Menys barra blava (64)    : 380
Menys editor-toolbar (52) : 328
Menys padding vertical    : 136   (page-article 40×2 + editor-container 32+80)
Amb teclat obert (216)    : -80
```

I en horitzontal: `page-article` posa 48px de padding a cada costat i `editor-container` 24px més. Són **144px de padding en una pantalla de 320px — el 45 % de l'amplada** — que deixen 176px de columna de text.

El culpable principal no són les barres (180px, exactament el vostre `--sdp-alt-barres`). És **el padding d'escriptori aplicat sense excepció al mòbil**, més tres terres dures que cap `@media` pot tocar:

- `NotesEditor.jsx` injecta `style: 'min-height: 300px; …'` dins `editorProps.attributes`. És un estil en línia: especificitat 1-0-0. **Cap fulla d'estil el pot rebaixar.**
- `.editor-tiptap-container { min-height: 250px }`.
- `.notes-shell { height: calc(100vh - var(--sdp-alt-negra)) }` mentre `:host { height: 100dvh }`. A Safari iOS `100vh` és el viewport gran: **el `.notes-shell` és més alt que el seu propi amfitrió** per l'alçada de la barra d'URL, i eixa franja inferior no s'assoleix mai.

### La proposta: `master-detail`, no compressió

No compriméssiu la barra d'eines. Canvieu la topologia. En `< 768px` el patró correcte no és tres columnes estretes, és **una columna amb navegació per capes**.

```css
@media (max-width: 767px) {
  .notes-shell { flex-direction: column; height: 100dvh; }

  /* Carpetes i Notes deixen de ser columnes i passen a ser calaix */
  .notes-column--left,
  .notes-column--middle {
    position: fixed; inset: var(--sdp-alt-negra) auto 0 0;
    width: min(86vw, 320px);
    transform: translateX(-100%);
    transition: transform .22s cubic-bezier(.2,.7,.3,1);
    z-index: 40;
  }
  .notes-shell[data-calaix="obert"] .notes-column--left { transform: none; }

  /* L'editor ocupa tot */
  .notes-column--editor { flex: 1 1 auto; width: 100%; }

  /* El padding d'escriptori no viatja al mòbil */
  .page-article     { padding: 16px 14px; border: 0; box-shadow: none; border-radius: 0; }
  .editor-container { padding: 0; max-width: none; }
}
```

Tres regles addicionals, totes de cost zero i alt rendiment:

- **`100dvh`, mai `100vh`.** Ja useu `100dvh` a `:host`; la incoherència és només ací.
- **Barra d'eines com a accessori del teclat**, ancorada baix amb `position: fixed; bottom: 0` i `padding-bottom: env(safe-area-inset-bottom)`. Ocupa la franja que el teclat deixa igualment i cau sota el polze (Fitts): dalt és la pitjor zona d'una pantalla de mà.
- **Amagar la barra blava per intersecció, no per scroll.** Un sentinella d'1px i un `IntersectionObserver` — zero escoltadors de `scroll`, zero *jank* en maquinari vell.

### Guany estimat

Passar de 180px de crom + 152px de padding vertical a ~64px de crom + ~32px de padding recupera **al voltant de 236px verticals**: de −80px (impossible) a ~156px amb el teclat obert, és a dir de zero línies visibles a unes 6-7. En horitzontal, de 176px a ~292px de columna de text. **És una estimació aritmètica sobre els vostres valors declarats, no una mesura al dispositiu**; cal verificar-la amb el `visualViewport` real abans de donar-la per bona.

### Bonus: la barra d'eines ja sobra per la meitat

`NotesToolbar.jsx` renderitza **13 botons**. En té **6 amb `onClick`**. Els altres **7 són morts** — inclosos els d'imatge, vídeo i enllaç que citeu al plantejament:

```
botons totals        : 13
amb onClick          :  6
SENSE onClick (MORTS):  7
amb aria-label       :  0
amb type="button"    :  0
```

No cal dissenyar res per encabir-los. **Esborreu-ne 7 i la barra es queda en la meitat.** I mentre hi sou: `.btn-icon` fa `32px × 32px` — la vostra Llei de Vida en demana 44. Teniu 13 dianes tàctils per davall del vostre propi mínim, i **cap nom accessible** en cap botó d'icona. Per a una plataforma cívica a l'Estat espanyol açò no és estètica, és el RD 1112/2018 i l'EN 301 549: WCAG 4.1.2 incomplit.

## 3. PROBLEMA C — L'`!important` no és un problema d'especificitat

### El diagnòstic real

N'hi ha **quatre**, no un, a `NotesSection.css` (línies 31, 40, 41, 436). I la regla de la barra blava **està duplicada literalment en dos fitxers**:

`src/sections/notes/NotesSection.css:28`
```css
:host(:has(.notes-shell)) header.bar-blue,
.sdp-root:has(.notes-shell) header.bar-blue,
.app-main:has(.notes-shell) header.bar-blue,
header.bar-blue:has(~ .content-wrapper .notes-shell) { position: static !important; }
```

`src/css/index.css:738`
```css
.app-main:has(.notes-shell) header.bar-blue,
.app-main-content:has(.notes-shell) header.bar-blue,
header.bar-blue:has(~ .content-wrapper .notes-shell) { position: static !important; }
```

Dos dels tres selectors són idèntics byte a byte. I `index.css` fa `@import` de `NotesSection.css` a la seua línia 2 — o siga que la còpia de baix guanya sempre a la de dalt. **L'`!important` no lluita contra `UniversalPage`: lluita contra una còpia de si mateix.**

### La prova que l'`!important` sobra

L'estructura real de `UniversalPage` (línies 562 i 700 de `UniversalComponents.jsx`) és:

```jsx
<>
  <header className="bar-blue">…</header>
  <article className="content-wrapper">{children}</article>
</>
```

`header.bar-blue` **és** germà anterior de `.content-wrapper`, i `.notes-shell` **és** dins. El selector `header.bar-blue:has(~ .content-wrapper .notes-shell)` sí que casa. La seua especificitat:

| Selector | Especificitat |
|---|---|
| `header.bar-blue` (regla base, sticky) | **0-1-1** |
| `header.bar-blue:has(~ .content-wrapper .notes-shell)` | **0-3-1** |

`:has()` pren l'especificitat del seu argument més específic. 0-3-1 guanya a 0-1-1 amb tres classes de marge. **L'`!important` mai va fer falta.** Era un tret d'escopeta: es van escriure quatre selectors perquè no se sabia quin era l'ancestre real, i es va posar `!important` perquè almenys un encertara.

### La reparació, en tres passos

**Pas 1 — Esborrar la duplicació.** Fora la regla de `index.css:737-742`. La secció posseeix el seu comportament; `index.css` no ha de saber què és una `.notes-shell`.

**Pas 2 — Deixar un sol selector, sense `!important`.**

```css
header.bar-blue:has(~ .content-wrapper .notes-shell) { position: static; }
```

`:host(:has(…))` és de suport dubtós i no aporta res: fora també.

**Pas 3 — La reparació de veritat: invertir el control.** Un component no ha de ser *sobreescrit*; ha de ser *parametritzat*. Les propietats personalitzades **hereten pel DOM i ignoren l'especificitat** — el valor es resol al punt d'ús, no al selector. Elimina la guerra en compte de guanyar-la:

```css
/* UniversalComponents: la barra ja no decideix que és sticky */
header.bar-blue {
  position: var(--sdp-barra-posicio, sticky);
  top: var(--sdp-barra-dalt, var(--sdp-alt-negra));
}

/* NotesSection: la secció declara el seu contracte, sense tocar la barra */
.notes-shell { --sdp-barra-posicio: static; --sdp-barra-dalt: auto; }
```

Zero `:has()`, zero `!important`, zero coneixement de l'arbre alié. I com que `--sdp-*` ja és el vostre sistema, no és arquitectura nova: és la que ja teniu, aplicada ací.

### La causa que reproduirà el problema

`design_guard` tolera **191 estils en línia** (`.design-guard-deute.json`). Un estil en línia té especificitat 1-0-0 i **només es pot vèncer amb `!important`**. Mentre el sostre siga 191, el projecte fabrica les condicions exactes que obliguen a l'`!important` que voleu erradicar. El sostre ha de baixar amb cada sessió, o la llei és nominal.

## 4. PROBLEMA B — L'Efecte Matrix: la skill ja existeix i el graf la mata

### La troballa central

He mesurat el graf amb resolució d'enllaços a l'estil Obsidian real (per ruta i per nom curt), i separant components **dèbils** (no dirigits) de **forts** (SCC, Tarjan):

```
Notes                     : 81
Arestes dirigides         : 593
Enllaços trencats         : 248   (40 destins distints)
Orfes (0 entrants)        : 0
Components DÈBILS         : 1     ← sembla perfecte
Components FORTS (SCC)    : 16    [15 singletons]
SCC més gran              : 66/81  (81,5 %)
Abastables des de l'àncora: 81/81  (100 %)
Fora de l'SCC principal   : 15
```

Les dues mesures diuen coses oposades. La dèbil diu «1 component, tot connectat». La forta diu «15 notes són carrerons sense eixida». **I les 15 són exactament aquestes:**

```
00_AGENTS_I_SKILLS_MIRROR/AGENTS_abocament-total          (in:1  out:0)
00_AGENTS_I_SKILLS_MIRROR/AGENTS_core-context-panic       (in:1  out:0)
00_AGENTS_I_SKILLS_MIRROR/AGENTS_core-higiene-reflexa     (in:1  out:0)
00_AGENTS_I_SKILLS_MIRROR/AGENTS_core-restauracio-segellada (in:1 out:0)
00_AGENTS_I_SKILLS_MIRROR/AGENTS_council-review           (in:1  out:0)
00_AGENTS_I_SKILLS_MIRROR/AGENTS_guia-ampliacio           (in:1  out:0)
00_AGENTS_I_SKILLS_MIRROR/AGENTS_identity-iaia-core       (in:1  out:0)
00_AGENTS_I_SKILLS_MIRROR/AGENTS_identity-iaia-voice      (in:1  out:0)
00_AGENTS_I_SKILLS_MIRROR/AGENTS_pedra-seca               (in:1  out:0)
00_AGENTS_I_SKILLS_MIRROR/AGENTS_reflexio-previa          (in:1  out:0)
00_AGENTS_I_SKILLS_MIRROR/AGENTS_socdepoble-workflow      (in:1  out:0)
00_AGENTS_I_SKILLS_MIRROR/AGENTS_trellat                  (in:1  out:0)
+ 3 PROMPT de l'escriptori                                (out:0)
```

**Les dotze skills. Totes. Grau d'eixida zero.**

Demaneu «enllaços bidireccionals que donen força a la memòria de la IA». La situació real és pitjor que unidireccional: **cap skill enllaça enlloc**. Un agent que aterra a `AGENTS_pedra-seca` no té cap camí de tornada ni cap camí endavant. Pot llegir la skill; no pot *navegar* des d'ella. El cervell té sinapsis d'entrada i cap d'eixida. Això és, exactament i al nivell de les dades, l'Efecte Matrix que no s'activa.

### Per què passa: teniu dos cervells i no es toquen

`.agents/skills/00_INDEX_SKILLS.md` **existeix** i és excel·lent: jerarquia d'autoritat, Norma Mare, i enllaços reals a cada skill. Però viu a `.agents/`, **fora del vault d'Obsidian** (`_wiki_de_poble/`). Obsidian no l'indexa mai.

- **Cervell A** (`.agents/`): el registre executiu, amb índex, jerarquia i enllaços. Invisible al graf.
- **Cervell B** (`_wiki_de_poble/`): el mirall automàtic de les skills, dins del graf, però sense l'índex i sense cap enllaç d'eixida.

El generador del mirall copia el frontmatter i el cos, i **deixa fora l'únic fitxer que faria les skills navegables**. Per això `[[00_INDEX_SKILLS]]` apareix com a enllaç trencat des de `00_INDEX`: l'índex de skills existeix i el graf no el troba.

I la ironia més fina: **`reflexio-previa` ja existeix, és exactament el que demaneu**, amb la taula PROTOCOLLEDGE i el mandat «NO PRODUÏRES CAP OUTPUT fins que hages completat el PAS 3». Però la taula apunta amb rutes entre cometes invertides (`` `.agents/PROTOCOL_PETORRETA.md` ``), no amb `[[enllaços]]`. **La skill que ordena anar a llegir un fitxer no té cap aresta cap a eixe fitxer.** És llegible, no és transitable.

### La reparació mecànica (3 canvis, invariant permanent)

**(a) Mirar l'índex.** Que el generador del mirall inclogui `00_INDEX_SKILLS.md` com a `AGENTS_00_INDEX.md` dins el vault, reescrivint `[[nom/SKILL|nom]]` → `[[AGENTS_nom]]`. Una passada de substitució.

**(b) Cada skill torna a l'àncora.** Afegir dues propietats de tipus enllaç al frontmatter de cada mirall:

```yaml
ancora: "[[00_INDEX_ESCRIPTORI]]"
governa: ["[[NotesSection.css]]", "[[design_system_specs]]"]
```

La regla que fa que açò funcione i que no cal recordar mai més: **una relació que no és un `[[enllaç]]` no existeix al graf.** El text pla `requereix: pedra-seca` descriu una relació; `requereix: "[[pedra-seca]]"` en *crea* una. Obsidian no llig la vostra intenció, llig els claudàtors.

Amb àncora→índex→skill i skill→àncora, **cada skill queda en un cicle de 2 amb l'àncora, i tot el conjunt col·lapsa en un sol SCC**. Els 16 components passen a 1. És un invariant de dues línies que tanca el problema dels orfes per sempre, no per aquesta sessió.

**(c) Enllaçar la PROTOCOLLEDGE.** Convertir les rutes de la taula de `reflexio-previa` en wikilinks. Això dona a la skill de reflexió el grau d'eixida que ara li falta, i converteix la taula de routing en arestes reals que un agent pot recórrer.

### Propietats: la prova per decidir si una propietat mereix existir

El vostre frontmatter està bé (10 propietats en 81 notes; la reducció va quallar). Per mantindre'l així, una sola regla:

> **Una propietat existeix si alguna consulta hi filtrarà o alguna porta hi asseverarà. Si no, és prosa, no metadada.**

Per això `exif_cognitiu.estat_emocional_sistema: "Aprenentatge"` del vostre prompt ISO no ha d'estar al frontmatter: no discrimina cap document (serà «Aprenentatge» en quasi tots), no tanca cap porta, i es paga en tokens en cada lectura. La poètica del projecte és valuosa i s'ha de conservar — **al cos, on és expressiva i gratuïta**, o com a etiqueta. La regla curta: **etiquetes per a l'estat, enllaços per a l'estructura.**

### El *system prompt*: per què la retòrica no bastarà

Demaneu que la IA adquirisca l'hàbit «de forma irrompible». Cal ser franc: **cap redacció de prompt fa un hàbit irrompible.** Els prompts mouen probabilitats, no garanties. Vosaltres ja ho sabeu — per això la vostra doctrina són portes de fallada tancada i no bones intencions. Apliqueu la mateixa lògica a l'agència.

**Capa 1 — Abaratir el reflex.** Es salta la lectura de skills perquè és cara. Un `00_INDEX_SKILLS` de menys de 2 KB, sempre en context, que mapege paraula clau → ruta, converteix «consultar el cervell» en una consulta, no en una cerca. Una recuperació de 200 tokens es fa; una de 20.000 s'omet.

**Capa 2 — Fer el reflex observable.** Exigir un artefacte previ diminut, amb forma d'eixida obligatòria. Els models compleixen requisits de *format* molt més fiablement que exhortacions de *conducta*:

```
DESPERTAR
1. QUÈ HA DIT      : <reformulació en una línia>
2. HO TINC AL BRAIN?: <claus consultades> → <fitxers llegits | CAP>
3. SI NO HO TINC   : <la pregunta que necessite fer>
```

La línia 3 és la important. La «complaença de màquina» apareix en part perquè **l'única jugada disponible és produir una resposta**. Si li doneu una eixida legítima que no és respondre, la mossegada del llop deixa de ser necessària. I ja la teniu declarada al vostre propi `fallback_behavior` («llistar les incògnites i consultar novament a l'usuari») — declarada i mai exigida.

**Capa 3 — Fer-lo exigible.** Ací entra `governa:`. Si una tasca toca un fitxer que una skill governa i el bloc DESPERTAR no declara haver llegit eixa skill, la porta falla. La propietat fa doble feina: aresta del graf i entrada de la porta.

**I una tensió que cal que veja el Mestre.** El vostre propi prompt diu «Estalvi de Tokens Sense Penediments Diaris… vés directe als components purs» i alhora demana la pausa reflexiva. Són dues coses oposades: esteu seleccionant activament el llop mentre demaneu el pilot. Si voleu el reflex, el bloc DESPERTAR ha de comptar com a treball fet, no com a token malgastat.

## 5. LA TROBALLA MÉS CARA — Portes definides que no s'executen mai

`package.json` defineix **34 portes**. `run-portes.mjs` — l'agregador que crida `npm run gate`, que al seu torn crida `npm run build` — n'executa **28**. En falten **6**:

```
porta:build          -> tooling/gates/tractor-build-previ.mjs      [SI existeix]
porta:teixit         -> tooling/wiki/teixidor.mjs                  [SI existeix]
porta:scc            -> tooling/gates/verificador-scc.mjs          [SI existeix]
porta:reflex         -> tooling/wiki/reflex_petorreta.mjs          [SI existeix]
porta:frontera-auth  -> tooling/gates/tractor-frontera-auth.mjs    [NO existeix]
porta:esquemes       -> tooling/gates/tractor-esquemes.mjs         [NO existeix]
```

Dues apunten a fitxers que **no són al repositori**: cridar-les peta amb `MODULE_NOT_FOUND`.

He executat les dues del wiki. Les dues **fallen**:

```
$ node tooling/wiki/teixidor.mjs
· T2 · PENJAT — 236 màx 22
✅ T3 · ILLA — 0 component(s) fora de l'àncora
PARAT. El deute de teixit puja: penjats.

$ node tooling/gates/verificador-scc.mjs
{ "code": "ORPHAN_OPERATIVE", … }
```

`teixidor` para amb **236 enllaços penjats contra un sostre de 22** — un factor de 10,7 — i `npm run gate` continua verd, perquè eixa porta no és a la llista. **Vau construir l'instrument correcte, `verificador-scc.mjs`, i el vau deixar desendollat.** El bug de la porta que certifica sense verificar ja no és una porta trencada: és una porta fora de la cadena.

I `T3 · ILLA` dona 0 perquè mesura *abastabilitat des de l'àncora*, no connectivitat forta — que és, exactament, la confusió dèbil/SCC que ja coneixeu. El `verificador-scc.mjs` és el que mesura bé, i és el que no corre.

**Reparació immediata**: afegir les quatre portes que existeixen a `run-portes.mjs`; esborrar o crear les dues que no existeixen; i baixar el sostre de `penjats` a 22 arreglant la causa (vegeu més avall). Cost: cinc línies.

### Els 248 enllaços trencats són tres bugs, no 248

```
 62×  [[260901_2359_BUNDLE_auditoria]]
 62×  [[260902_0001_BUNDLE_auditoria]]
 62×  [[260902_0156_BUNDLE_auditoria_v7]]
 12×  [[ESTANDARD_Pedra_Seca]]
```

**186 dels 248 (el 75 %) vénen d'un peu de pàgina automàtic** que injecta en 62 de 81 notes un enllaç al bundle de la sessió — i els bundles no viuen al vault. Una correcció al generador del peu (o excloure els bundles de l'anclatge) i desapareixen 186 d'un colp. `[[ESTANDARD_Pedra_Seca]]` × 12 és un document canònic citat dotze vegades que no existeix: o es crea o es reapunta.

## 6. NETEJA ESTRUCTURAL — Divs fantasmes concrets

No cal una sonda per a aquests; són a la vista:

- `NotesToolbar.jsx`: `<div className="toolbar-actions">` dins `.editor-toolbar`, que ja és `display:flex; justify-content:space-between`. I un `<div>` **sense classe** embolcallant el botó Publicar. Els dos són pas directe. **−2 nivells.**
- `NotesEditor.jsx`: `.editor-tiptap-container` embolcalla `<EditorContent>`, que ja renderitza un `div`. Els seus estils (`flex:1 1 auto; min-height`) es poden posar a `editorProps.attributes.class`. **−1 nivell.**
- `.notes-list-container` → `.notes-column__scroll` → `.note-list`: tres columnes flex imbricades per a una llista. **−1 nivell.**
- `.editor-container` (max-width 820px, padding) i `.page-article` (padding 40/48) fan la mateixa feina de centrat i respiració. **Fusionables.**

Camí actual fins al primer caràcter que escriu l'usuari: `content-wrapper > notes-shell > main.notes-column--editor > .editor-scroll-area > .editor-container > article.page-article > .editor-tiptap-container > div.ProseMirror > p`. **Vuit nivells.** Amb els talls de dalt: cinc.

I dos residus verificats:

- `.notes-column-header` i `.editor-toolbar` declaren `position: sticky; top: 0; z-index: 15`, però el seu ancestre `.notes-column` té `overflow: hidden` i ells no tenen cap contenidor de scroll per damunt. **El sticky és inert.** Ja estan fixats per `flex-shrink: 0`. CSS mort.
- `.timer-indicator` és `position: absolute` i `.note-card`, el seu contenidor lògic, no declara `position: relative`. S'ancorarà on no toca.
- **58 classes CSS òrfenes** declarades i mai usades (`.estucat-deute.json`).

## 7. DAFO EN 5 DIMENSIONS

### Social

- **F**: valencià natiu de cap a peus i base d'usuaris real via El Rentonar; competència pràcticament nul·la en tecnologia cívica rural en llengua minoritzada.
- **D**: el vocabulari intern (Petorreta, Pedra Seca, IAIA MarIA, Seient Núm. 5) és una barrera d'entrada alta. Una infraestructura cívica que només una persona pot mantindre no és infraestructura: és un projecte personal amb vocació cívica.
- **A**: la bretxa digital rural juga en contra. Amb el model «Terminal Tonto» *online-first*, els usuaris amb pitjor connectivitat són precisament els destinataris. La decisió del Quadrant A té aquest cost i convé tindre'l escrit.
- **O**: finançament institucional valencià (Generalitat, diputacions) per normalització lingüística i digitalització. Un projecte lliure, auditat i documentat en valencià és inusualment finançable.

### Personal

- **F**: disciplina documental extraordinària; el ritual d'auditoria genera responsabilitat externa real.
- **D**: factor autobús d'1. El consell d'IAs multiplica la cognició, no el manteniment. Cap altre humà pot agafar el relleu ara mateix.
- **A**: desgast per pes ritual. Plantilla ISO, frontmatter, DAFO, consell — cada sessió porta cerimònia. Quan la cerimònia creix més de pressa que l'enviament, la cerimònia esdevé el projecte.
- **O**: el marc de governança és, en si mateix, publicable. «Com portar un projecte en solitari amb un consell d'IAs» és material original i atrauria col·laboradors: converteix la barrera (D) en canal de captació.

### Tècnic

- **F**: portes de fallada tancada, bundles amb SHA-256, sostres de deute amb ratchet, zero dependències de runtime al nucli. Poc habitual amb aquest rigor en un projecte d'aquesta mida.
- **D**: la deriva documentació-codi és crònica i reincident. Les portes verifiquen el codi; res verifica que la documentació descriga el codi. `.sollutia-deute.json` encara reclama «cua offline tipus RuralSyncQueue» i «PowerSync/ElectricSQL» — fòssils del model *offline-first* que el Quadrant A va extirpar.
- **A**: Shadow DOM + WordPress + postMessage de Sollutia són tres fronteres, i cadascuna ja ha mossegat (herència CSS, `composed`, validació d'origen). La complexitat creix més que linealment amb el nombre de fronteres.
- **O**: `governa:` tanca el bucle documentació-codi. Una porta que assevere que cada fitxer governat té una skill viva i cada skill governa fitxers vius mataria la deriva de forma permanent. **És la inversió d'enginyeria de més valor disponible ara mateix.**

### Econòmic

- **F**: zero dependències de runtime = zero cadena de subministrament, zero cinta de córrer d'actualitzacions, allotjament quasi nul.
- **D**: zero dependències també vol dir que tot es construeix una vegada i es manté per sempre — i el cost no es paga en diners, es paga en hores del Mestre, que és el recurs més escàs del sistema.
- **A**: el ritual d'auditoria de bundles de 429 fitxers té un cost recurrent que escala amb el corpus, no amb el treball fet. Sis portes fora de la cadena van sobreviure a diverses auditories completes precisament perquè el senyal es dilueix.
- **O**: auditories dirigides (un subsistema + la seua porta) costen una fracció i troben més. `.sollutia-deute.json` declara `proves_passades: false`, `endpoints_actius: []` i «JWT en localStorage vulnerable a XSS» — un P0 de seguretat esperant en un fitxer de deute. Això mereix una sessió pròpia, curta i barata.

### Futurs

- **F**: l'arquitectura és deliberadament avorrida (vanilla, CSS pla). És la millor aposta possible per la mantenibilitat el 2030.
- **D**: «IAIA MarIA» depén de la disponibilitat i el comportament de models de frontera. El marc de governança pressuposa una classe de col·laborador que pot canviar sota els peus del projecte.
- **A**: si el contracte de postMessage de Sollutia es mou, la capa d'integració ho notarà. Amb `endpoints_actius: []`, avui no hi ha superfície provada que aguante el colp.
- **O**: si el graf de wiki i skills arriba a SCC real i s'hi manté, esdevé un actiu portàtil: pot sembrar *qualsevol* agent futur, no només l'actual. **A llarg termini el producte no és la plataforma, és el substrat de coneixement.**

## 8. ORDRE DE TREBALL SUGGERIT

| # | Acció | Cost | Efecte |
|---|---|---|---|
| 1 | Afegir les 4 portes existents a `run-portes.mjs`; resoldre les 2 inexistents | 5 línies | La cadena torna a ser fiable |
| 2 | Esborrar els 7 botons morts de `NotesToolbar` | 7 línies fora | La barra es redueix a la meitat |
| 3 | Arreglar el peu que injecta `[[…BUNDLE…]]` | 1 funció | −186 enllaços trencats |
| 4 | `ancora:` + `governa:` als 12 miralls, i mirar `00_INDEX_SKILLS` | 1 script | 16 SCC → 1 SCC |
| 5 | Bloc `@media (max-width:767px)` a `NotesSection.css` | ~25 línies | L'editor existeix al mòbil |
| 6 | Llevar l'estil en línia `min-height:300px` de `NotesEditor.jsx` | 1 línia | El CSS recupera el control |
| 7 | Desduplicar la regla `bar-blue` i llevar els 2 `!important` | 8 línies | Cascada neta |
| 8 | `aria-label` + 44px als botons d'icona | ~15 línies | WCAG 4.1.2, RD 1112/2018 |

Els punts 1 a 4 són cinc minuts de teclat cadascun i tanquen els forats estructurals. El 5 i el 6 fan que el Bloc de Notes existisca al mòbil.

## 9. NOTA DE MÈTODE

Tot el que hi ha ací baix ve del bundle verificat. Tres coses que **no** he pogut comprovar i que no dic com si les sabera:

- No he executat res en un navegador real. Els números de l'apartat 2 són aritmètica sobre els vostres valors declarats, no mesures a l'iPhone.
- No sé si `:host(:has(…))` funciona al vostre Shadow DOM concret; l'he marcat com a dubtós, no com a mort.
- Els guanys verticals estimats cal validar-los amb `visualViewport` al dispositiu abans de donar-los per bons.
