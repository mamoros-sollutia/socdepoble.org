---
tipus: veredicte
estat: lliurat
description: "Veredicte del Seient Núm. 5 sobre el paquet disseny_notes_editor"
---

# ⚖️ VEREDICTE — SEIENT NÚM. 5 — DISSENY NOTES EDITOR

**Data:** 2026-09-04 · **Bundle:** `260904_0230_BUNDLE_disseny_notes_editor.md` (452 fitxers, sha256 per fitxer, contracte d'abast declarat).
**Abast auditat:** `src/sections/notes/*`, `src/components/universal/UniversalComponents.jsx`, `tooling/gates/tractor-vocabulari.mjs`, `tooling/gates/tractor-estucat.mjs`, els nou fitxers `.*-deute.json`.
**Nota prèvia sobre el bundle:** és complet i verificable. No és coix. El deixe dit perquè les rondes anteriors sí que ho eren.

---

## 1. LA TROBALLA PRINCIPAL: EL DEUTE COM A AMNISTIA

Açò no és un bug de CSS. És una cadena causal que ha deixat cec el sistema de portes sobre un mòdul sencer.

`tractor-vocabulari.mjs` declara dues **lleis dures**:

```js
const FULL_CANONIC = 'src/css/index.css';
const LLEIS_DURES = new Set(['classe-forastera', 'css-de-seccio']);
// V3 · css-de-seccio  Cap fitxer .css pot viure sota src/sections/.  LLEI DURA.
```

`src/sections/notes/NotesSection.css` viola V3. És **l'única violació de V3 de tot el projecte**:

```json
"css-de-seccio": { "max": 1, "identitats": [
  "css-de-seccio|src/sections/notes/NotesSection.css|src/sections/notes/NotesSection.css" ] }
```

I ací ve el dany. Com que el vocabulari canònic només ix de `src/css/index.css`, **cada classe definida dins de `NotesSection.css` és, per construcció, una `classe-forastera`**. La conseqüència mecànica està escrita al disc:

| Mesura | Valor |
|---|---|
| `classe-forastera.max` global | **258** |
| Entrades de deute que apunten a `src/sections/notes/` | **142** |
| Percentatge del deute cromàtic/vocabulari del projecte que ve d'un sol mòdul | **~55 %** |

Les 142 entrades inclouen `.notes-column`, `.folder-item`, `.note-card`, `.editor-toolbar`… classes que **sí que existixen** i estan ben definides. Són falsos positius de la porta.

I enmig d'eixe soroll hi ha les dues úniques entrades reals:

```json
"classe-opaca": { "identitats": [
  "classe-opaca|src/sections/notes/NotesSection.jsx|mobile-panel-${…}",
  "classe-opaca|src/sections/notes/NotesSection.jsx|notes-page${…}" ] }
```

`mobile-panel-${mobilePanel}` **no té cap regla CSS enlloc del projecte**. És una classe morta que s'escriu al DOM en cada render. La porta la va detectar. El fitxer de deute la va indultar. I ara està amagada entre 142 falsos positius on ningú la trobarà.

**Diagnòstic:** amnistiar una llei dura una vegada va generar 142 amnisties derivades, i eixes 142 amnisties són la cortina que oculta les 2 troballes autèntiques. El sistema immunitari no ha fallat en detectar; ha fallat en **triar**. `Saber ≠ Fer`, ronda enèsima.

**Solució:** no llevar el deute a mà. Arreglar l'arrel:
1. `tractor-vocabulari.mjs` ha d'alimentar el vocabulari **també** des de qualsevol `*.css` importat per un component (el regex de `tractor-estucat.mjs` ja resol `?inline` correctament: reutilitza eixa funció `cssCarregat()` en compte de reimplementar-la).
2. Amb això, les 142 entrades cauen soles i `.mobile-panel-` queda nua i visible.
3. Decidix llavors, explícitament, si V3 (`css-de-seccio`) és una llei o no ho és. Ara mateix és una llei amb una excepció permanent, que és la definició de no ser una llei.

---

## 2. AUDITORIA DESTRUCTIVA — TROBALLES

### P0 · L'estat local guardat es perd en silenci quan el servidor falla

`NotesContext.jsx` → `saveNoteField`:

```js
setLocalNoteField(noteId, field, netejat);        // optimista
try { await updateNote(noteId, { [field]: netejat }, externalConfig); return true; }
catch (e) { showToast('El canvi no ha arribat al servidor. Reintenta-ho.', 'error'); return false; }
```

No hi ha rollback. No hi ha cua. No hi ha marca de brut. `localNoteOverrides` viu **només en memòria de React**. Escenari real per a l'usuari objectiu: iaia escrivint amb 3G rural, cau la connexió, ix un toast de 3 segons que no llig, el text continua en pantalla perfectament visible, tanca la pestanya, i el text no existix.

Agreujant: `src/data/outbox.js` **existix a l'arbre i té zero importadors**. La peça que resoldria açò està construïda i desconnectada. És el mateix patró que l'adaptador de Supabase de les rondes anteriors.

**Solució mínima (sense trencar l'ADR Online-First):**
- Mantindre un `Set` de camps bruts. Mentre hi haja bruts, l'encapçalat de l'editor mostra un indicador persistent (no un toast) — «Sense guardar».
- `beforeunload` només si hi ha bruts.
- Persistir `localNoteOverrides` a `sessionStorage` en cada canvi de camp. No és Local-First, és una xarxa. Cinc línies.
- O connectar `outbox.js`, que ja està escrit. Decidix-ho i esborra el que no gastes.

### P0 · L'editor desapareix i s'emporta el cursor

`NotesEditor.jsx`: `hidden={isCompact && mobilePanel !== 'editor'}`. En compacte, l'editor està a `display:none` en 2 dels 3 estats.

`hidden` no desmunta ProseMirror (bé), però **`display:none` sí que destruïx `document.activeElement`**. Cada volta que l'usuari toca «NOTES» per a mirar una cosa i torna, perd el cursor i la posició de scroll dins de la nota. Escrivint un article llarg des del mòbil, això és inutilitzable.

En iOS a més, amagar un `contenteditable` enfocat amb el teclat obert deixa el teclat penjat i el viewport descolocat.

**Açò és exactament el que arregla el teu requisit 1.** No és estètica: és la causa mecànica de la ferida.

### P0 · Les píndoles de dins de l'editor són una trapa

`NotesEditor.jsx` passa a `UniversalPage`:

```js
labels={etiquetesDeNota(activeNote, noteFolders, {
  carpeta: handleSelectFolder, categoria: handleSelectCategory, etiqueta: handleSelectTag })}
```

I al context, les tres funcions fan `setMobilePanel('notes')`.

Resultat: en compacte, **tocar la píndola de la carpeta dins de l'editor t'expulsa de l'editor**. En escriptori és un filtre inofensiu; en mòbil és una expulsió. Mateix codi, dos significats.

Pitjor, encadenat amb:

```js
const activeNote = filteredNotes.find((n) => n.id === activeNoteId) || filteredNotes[0] || notes[0];
```

Canviar el filtre pot fer que `activeNoteId` ja no estiga dins de `filteredNotes`, i llavors **l'editor salta silenciosament a una altra nota**. La cadena completa: toques una píndola dins de la teua nota → canvia el filtre → l'editor et canvia la nota → i t'expulsa a la llista.

*Crèdit on toca:* el guardat pendent **sí** que es purga bé en eixe salt (l'`useEffect` de neteja amb `pendingSaveRef` està ben fet). No hi ha pèrdua de dades ací. Però hi ha pèrdua de lloc, que per a l'usuari és igual de violenta.

**Solució:** les píndoles no han de canviar de panell mai. Separa `filtrar(id)` de `navegarA(id)`. I `activeNoteId` no ha de caure a `filteredNotes[0]`: si la nota activa ix del filtre, es queda oberta i el filtre s'aplica només a la llista.

### P1 · L'editor porta dins una eixida d'emergència prohibida

`NotesEditor.jsx` renderitza un **segon** `UniversalPage` amb `chrome="context"`, que activa la `bar-blue`:

```js
const handleBack = onBack || (() => navigate(-1));
```

Ningú passa `onBack`. Dins de l'editor de notes hi ha un botó «Tornar arrere» que fa `history.go(-1)` — el patró que este projecte té prohibit per comportament erràtic a Safari PWA. Amb text sense guardar en pantalla.

Del mateix `UniversalPage`, dos defectes més que només es manifesten ací:

```js
navigator.share({ title: title || document.title, url: safeHref })
```
`title` en l'editor és un **element JSX** (el `<span contentEditable>`), no una cadena. Compartir una nota envia `[object Object]`.

```js
const actualTitleText = props.titleText || … ;
const handleConnect = onConnect || (() => navigate('/connectar?item_id=' + encodeURIComponent(actualTitleText)));
```
`titleText={activeNote.title}` i eixe títol es guarda com a **`innerHTML` cru** (`onInput` fa `setLocalNoteField(id,'title', e.currentTarget.innerHTML)`, sense sanejar). Per tant el botó CONNECTAR posa marcatge HTML del contingut de l'usuari dins d'un paràmetre d'URL, que va a l'historial i al referrer.

**Solució:** passa `onBack`, `onShare` i `onConnect` explícits des de `NotesEditor`, o millor: `chrome="none"` en l'editor i que la barra taronja de metadades es renderitze a banda. I saneja en **entrada** (`onInput`), no només en eixida. La invariant ha de ser: res sense sanejar entra mai a l'estat.

### P1 · La barra d'eines subscriu i després ignora la subscripció

`NotesToolbar.jsx` crida `useEditorState({ editor, selector: … })`, guarda el resultat a `state`… i **`state` no s'usa en cap lloc**. Els botons llegixen `editor?.isActive('bold')` directament durant el render.

`isActive` no és reactiu. Sense la subscripció, els estats actius dels botons només es refresquen quan alguna altra cosa provoca un render. El mecanisme correcte està escrit i desconnectat, dos línies més amunt del mecanisme incorrecte. Slop residual de llibre.

**Solució:** `className={\`btn-icon ${state.bold ? 'active-text' : ''}\`}`. Esborrar les crides a `isActive`.

### P2 · `100vw` dins d'un mòdul que presumix de no mirar el viewport

`NotesSection.css` diu al comentari: *«La mida és la del mòdul: funciona també dins d'un host estret en escriptori»*. I dos-centes línies més avall:

```css
.notes-page .dropdown-menu { max-width: calc(100vw - var(--sdp-space-8)); }
```

Dins d'un Shadow DOM incrustat en una columna de WordPress de 720px sobre un monitor de 1440px, `100vw` val 1440. El menú es desborda del mòdul. És l'única regla del fitxer que trenca la seua pròpia doctrina declarada.

**Solució:** `max-width: 100%` o `100cqi` amb `container-type: inline-size` a `.notes-page`.

### P2 · Mutació d'una `ref` durant el render

`NotesEditor.jsx`, cos del component:

```js
if (currentNoteRef.current.id !== activeNote?.id) { currentNoteRef.current = { … }; }
```

Escriure una ref durant el render no és segur amb React 18 concurrent ni amb StrictMode. Ací alimenta un `dangerouslySetInnerHTML`, o siga que un doble render pot deixar el títol i el cos descoordinats. Ja hi ha `key={\`title-${activeNote.id}\`}` que força el remuntatge; la ref és redundant.

**Solució:** llevar la ref i llegir directament d'`activeNote`, que la `key` ja garantix el remuntatge net.

### P2 · Imatges de portada en base64 dins del camp de la nota

`triaImatge` fa `readAsDataURL` fins a 512 KB → ~683 KB de base64 que van a `localNoteOverrides` (memòria), a la fila de la base de dades, i al `payload` de `publishNote`. Per a l'usuari objectiu, en connexió rural, cada nota amb portada són ~0,7 MB per lectura.

**Solució:** pujar a Storage i guardar l'URL. Si això encara no existix, baixar el límit a 128 KB i dir-ho a la interfície.

### P3 · Menors, verificades

- `<article class="content-wrapper">` de `UniversalPage` conté `<article class="notes-shell">`. `<article>` niat sense motiu.
- `NotesSection` passa `title={t('section.notes.title')}` amb `chrome="none"`, i `showPageHeader` val `false`. **El títol es descarta silenciosament.** Prop morta.
- `TableOfContentsDrawer` es renderitza **dos vegades** (una per `UniversalPage`), les dues consulten tot el shadow root, i escriuen `el.id = 'toc-heading-N'` sobre nodes que React posseïx, inclòs el `<h1>` contenteditable.
- `.d-desktop-only` no té regla base. Funciona per accident (hereta `inline-flex` de `.btn-icon`), no per disseny.
- `NotesEditor` importa `Globe` de lucide i no el gasta.
- `alert()` i `window.confirm()` conviuen amb `showToast`/`AvisadorEfimer`. Dos sistemes de diàleg.
- `useState('n1')` per a `activeNoteId`. Cadena màgica.
- `@tiptap/*` 3.31 + ProseMirror sencer en un projecte amb doctrina Pedra Seca. No dic que estiga mal — dic que **no hi ha cap ADR que l'autoritze**. Una dependència d'eixa grandària ha d'estar declarada, no heretada.

---

## 3. FALLOS ESTRUCTURALS DE FUTUR

1. **El precipici de 960 no escala.** `isCompact` és un booleà. Cada requisit nou de layout multiplica els casos dins d'un únic `if`. Amb tres nivells i un booleà, la lògica ja no cap.
2. **La quarta columna.** Quan arribe cerca, adjunts o versions, `grid-template-areas` amb tres nivells × N columnes explota combinatòriament. Posa ara el límit per escrit: **màxim tres panells laterals**, o genera les àrees des de dades.
3. **El retorn del Local-First.** L'ADR actual és Online-First, però el NLnet es va presentar amb CRDT. Si torna, `saveNoteField` ha de passar de «guardar» a «fusionar». Dissenya-la **ara** com a `async` que retorna promesa i que accepta un resultat de fusió, encara que hui sempre resolga igual. La signatura sobreviu al canvi d'arquitectura; la implementació no cal que ho faça.
4. **Dos `UniversalPage` niats.** Mentre l'editor renderitze un `UniversalPage` complet dins d'un altre, cada millora de `UniversalPage` (barres, TOC, compartir, connectar) es duplicarà o xocarà ací. És deute que creix sol amb cada canvi que no toca notes.
5. **Doble incrustació a la mateixa pàgina.** Si algun dia hi ha dos `<soc-de-poble>` en un post de WordPress, els `id` fixos del TOC (`toc-heading-N`) col·lisionen. Passa a `useId()`.
6. **Divergència CSS/JS de llindars.** Ara el llindar (960) viu només en JS. Si algú afig un `@media` al CSS, tindràs dues autoritats que no es parlen. La secció 6 tanca esta porta.

---

## 4. DAFO

### Fortaleses
- **`isCompact` ja mesura el mòdul, no el viewport.** El `ResizeObserver` sobre `pageRef` és la decisió arquitectònica correcta i és rara de vore. Tota la solució responsive es construïx damunt d'això sense tirar res.
- **Un sol arbre de components.** No hi ha bifurcació mòbil/escriptori. No cal desfer cap «Mente Colmena».
- **La purga de guardat pendent en canviar de nota funciona.** Està ben escrita.
- Els encapçalats ja fan 59px (`--sdp-alt-accio: 58px` + 1). Ja complixen la Llei de Vida sense tocar-los. La teua idea de reutilitzar-los com a botons és viable *hui*.
- Sanejat present a la frontera de guardat (`netejaCamp`, `sanitizeHtml`, `esFontImatgeSegura`).

### Debilitats
- No hi ha nivell intermedi. Dos estats: tres columnes o una.
- L'estat `mobilePanel` no distingix «quin panell mire» de «quin panell està obert damunt de l'editor». Són conceptes distints amb una sola variable.
- 142 entrades de deute que cobrixen el mòdul de qualsevol porta de CSS.
- L'escriptura optimista sense rollback ni persistència.
- `UniversalPage` és un Fragment amb 40 props opcionals. Cada consumidor n'inventa un contracte distint (`title` cadena ací, `title` JSX allà). No hi ha contracte, hi ha costum.

### Amenaces
- **`position: fixed` dins de Shadow DOM sota WordPress.** Si la solució responsive es fa amb `fixed`, qualsevol tema que pose `transform`, `filter` o `contain` en un ancestre convertix el `fixed` en relatiu a eixe ancestre i el panell apareixerà en el lloc equivocat. Silenciosament, i només en algunes instal·lacions. La secció 6 evita `fixed` completament.
- Teclat tou d'iOS + `100vh`: `vh` no descompta la barra dinàmica. Qualsevol alçada nova ha d'anar en `dvh` o en percentatge del contenidor.
- L'usuari objectiu no informa d'errors. Una pèrdua de text silenciosa no genera un tiquet, genera un abandonament.
- La dependència de Tiptap sense ADR és un punt d'atac en la sol·licitud de finançament: «zero dependències» i ProseMirror sencer en el mateix repositori exigix una explicació.

### Oportunitats
- Fer que el mòdul responga **només** a la seua pròpia caixa el fa incrustable en qualsevol amplada de WordPress: barra lateral, columna estreta, pàgina completa. Això és sobirania real i és un argument de subvenció fort, no només una millora d'UI.
- El patró «l'encapçalat és el control» és reutilitzable en la resta de seccions de `UniversalPage`. Un patró, no una excepció de notes.
- Arreglar `tractor-vocabulari` per a llegir CSS de component elimina 142 entrades de deute d'un colp. És la reducció d'entropia més barata que tens damunt de la taula.
- La mateixa màquina d'estats regala un «mode concentració» en escriptori sense codi nou.

---

## 5. MATRIU IMPORTÀNCIA × URGÈNCIA

| | **Urgent** | **No urgent** |
|---|---|---|
| **Important** | **FES-HO JA**<br>· §2 P0 pèrdua silenciosa en fallada de xarxa<br>· §2 P0 editor amagat → cursor perdut<br>· §2 P0 trapa de les píndoles<br>· §6 arquitectura responsive de tres nivells | **PLANIFICA**<br>· §1 arreglar `tractor-vocabulari` i purgar 142 deutes<br>· §2 P1 desniar els dos `UniversalPage`<br>· §3.3 signatura `async` de guardat per al retorn del CRDT<br>· ADR que autoritze Tiptap<br>· Portada a Storage en compte de base64 |
| **No important** | **DELEGA / RÀPID**<br>· `state` no usat a la barra d'eines<br>· `100vw` → `100%`<br>· `Globe` sense usar<br>· prop `title` morta a `NotesSection`<br>· `'n1'` màgic | **DEIXA-HO**<br>· `<article>` niat<br>· `.d-desktop-only` sense regla base<br>· duplicat de `TableOfContentsDrawer`<br>· unificar `alert`/`confirm` amb `showToast` |

**Ordre d'execució recomanat:** el requisit 5 (responsive) **abans** dels altres P0, perquè treure el `display:none` de l'editor és el que fa desaparèixer la pèrdua de cursor sense codi addicional. Els altres dos P0 es resolen damunt del nou model d'estat.

---

## 6. SOLUCIÓ ARQUITECTÒNICA RESPONSIVE

### 6.1 Les tres lleis

1. **El CSS decidix el layout; el JS només decidix atributs.** Cap component pot triar-se a si mateix segons la mida. Un sol arbre, tres graelles. Si algun dia veus `{esMobil && <Component/>}`, és una regressió.
2. **Una sola autoritat de llindar.** Ja tens un `ResizeObserver` que mesura el mòdul. Es queda com a única font: escriu una classe (`--estret`/`--mitja`/`--ample`) i el CSS només consulta eixa classe. **Zero `@media`, zero `@container`, zero `100vw`.** Així no hi pot haver desacord entre el que creu el CSS i el que creu el JS.
3. **Cap `position: fixed`, cap `position: absolute` per als panells.** La superposició es fa apilant en la mateixa cel·la de graella. Immune als `transform` del tema de WordPress.

### 6.2 El canvi de DOM necessari (i per què és inevitable)

Vols que els encapçalats es col·loquen **horitzontalment dalt** mentres la seua columna es desplega **davall**. Això vol dir que l'encapçalat i el cos de la columna han d'ocupar cel·les distintes de la graella. Hui l'encapçalat viu **dins** de la columna, i un fill no pot col·locar-se en una cel·la distinta de son pare.

Les eixides són tres i dues són roïnes:
- `display: contents` sobre la columna: perd el fons, el `overflow` i l'`hidden`, i té historial d'errors d'accessibilitat en navegadors vells d'Android. **Descartada** per a l'usuari objectiu.
- Duplicar els encapçalats (un per a ample, un per a estret): dos arbres. **Descartada** per la llei 1.
- **Pujar l'encapçalat a la closca.** És la correcta i l'argument és net: *l'encapçalat és un control del layout, no de la columna; pertany a qui posseïx el layout.*

Cost real: ~25 línies mogudes entre tres fitxers. Cap lògica nova.

```jsx
// NotesSection.jsx — la closca passa a ser la graella i posseïx els encapçalats
<article className="notes-shell" data-panell={panellObert ?? 'cap'}>
  <NotesColumnHeader col="carpetes" />   {/* cel·la capC */}
  <NotesSidebar />                       {/* cel·la colC — ja sense encapçalat */}
  <NotesColumnHeader col="notes" />      {/* cel·la capN */}
  <NotesList />                          {/* cel·la colN — ja sense encapçalat */}
  <NotesEditor />                        {/* cel·la ed — MAI hidden */}
  <div className="notes-vel" />          {/* vel, tanca en tocar */}
</article>
```

Sis elements de graella. Profunditat de DOM sense canvis respecte d'ara.

### 6.3 Màquina d'estats

Substituïx `mobilePanel: 'folders'|'notes'|'editor'` per **`panellObert: 'carpetes'|'notes'|null`**, i `isCompact: boolean` per **`mida: 'ample'|'mitja'|'estret'`**.

La diferència conceptual és tot el disseny: abans la variable deia *«quin panell mire»* (i per tant l'editor era un panell més, i podia desaparéixer). Ara diu *«què hi ha obert damunt de l'editor»*, i l'editor deixa de ser un cas.

| `mida` | Carpetes | Notes | Editor | `panellObert` vàlid |
|---|---|---|---|---|
| `ample` (≥960) | columna fixa | columna fixa | columna fixa | ignorat |
| `mitja` (600–959) | desplegable dalt | columna fixa | columna fixa | `carpetes` \| `null` |
| `estret` (<600) | desplegable dalt | desplegable dalt | **sempre visible** | `carpetes` \| `notes` \| `null` |

Transicions:

```
tocar encapçalat X   → panellObert = (panellObert === X ? null : X)
triar carpeta        → panellObert = (mida === 'estret' ? 'notes' : null)
triar nota           → panellObert = null            // torna sempre a l'editor
Escape / tocar vel   → panellObert = null
canvi de mida        → si panellObert ja no és plegable en la mida nova → null
```

Estat inicial: **`null`**. En estret, la iaia obri la secció i veu la seua nota, no una llista de carpetes.

### 6.4 CSS

```css
/* ── Llindars: única font de veritat, llegida pel JS ── */
.notes-page { --notes-llindar-mitja: 600; --notes-llindar-ample: 960; }

.notes-page .notes-shell {
  display: grid;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}
.notes-page .notes-column { min-width: 0; min-height: 0; }

/* ═══ AMPLE ═══ tres columnes, idèntic a hui */
.notes-page--ample .notes-shell {
  grid-template-columns: var(--notes-col-sidebar) var(--notes-col-list) minmax(0, 1fr);
  grid-template-rows: var(--notes-header-height) minmax(0, 1fr);
  grid-template-areas:
    "capC capN ed"
    "colC colN ed";
}

/* ═══ MITJÀ ═══ Carpetes desplegable dalt; Notes i Editor costat a costat */
.notes-page--mitja .notes-shell {
  grid-template-columns: minmax(220px, 34%) minmax(0, 1fr);
  grid-template-rows: var(--notes-header-height) var(--notes-header-height) minmax(0, 1fr);
  grid-template-areas:
    "capC capC"
    "capN ed"
    "colN ed";
}

/* ═══ ESTRET ═══ dos encapçalats dalt, editor davall i sempre visible */
.notes-page--estret .notes-shell {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: var(--notes-header-height) minmax(0, 1fr);
  grid-template-areas:
    "capC capN"
    "ed   ed";
}

/* ── Col·locació ── */
.notes-column-header--carpetes { grid-area: capC; }
.notes-column-header--notes    { grid-area: capN; }
.notes-column--editor          { grid-area: ed; }
.notes-page--ample .notes-column--left   { grid-area: colC; }
.notes-page--ample .notes-column--middle { grid-area: colN; }
.notes-page--mitja .notes-column--middle { grid-area: colN; }

/* ── Panells plegables: apilats damunt de l'editor, SENSE position ──
   Comparteixen cel·la amb l'editor. La graella els apila; el z-index mana.
   Cap `fixed`, cap `absolute`: immune als `transform` del tema de WordPress. */
.notes-page--mitja  .notes-column--left,
.notes-page--estret .notes-column--left,
.notes-page--estret .notes-column--middle {
  grid-area: ed;
  align-self: start;
  max-height: 70%;          /* deixa vore l'editor davall: requisit 1 */
  z-index: 30;
  display: none;
  box-shadow: var(--sdp-ombra-3);
}
.notes-page--mitja  .notes-shell[data-panell="carpetes"] .notes-column--left,
.notes-page--estret .notes-shell[data-panell="carpetes"] .notes-column--left,
.notes-page--estret .notes-shell[data-panell="notes"]    .notes-column--middle {
  display: flex;
}

/* ── Vel ── */
.notes-vel { grid-area: ed; z-index: 20; display: none; background: rgb(0 0 0 / .28); }
.notes-page--ample .notes-vel { display: none !important; }
.notes-shell:not([data-panell="cap"]) .notes-vel { display: block; }

/* ── L'encapçalat com a control ── */
.notes-column-header { min-height: var(--notes-header-height); z-index: 40; }
.notes-page--estret .notes-column-header,
.notes-page--mitja  .notes-column-header--carpetes { cursor: pointer; }
```

Notes de correcció:
- L'`overflow: hidden` de `.notes-shell` i el `min-height: 0` de les columnes són el que impedix que la graella crega en compte de fer scroll intern. Ja ho tens ben posat hui; no ho toques.
- `max-height: 70%` és percentatge de la **cel·la de graella**, no del viewport. Res de `vh`, res de teclat d'iOS.
- L'ordre de les regles importa: base → `--ample` → `--mitja` → `--estret`. Cada nivell posseïx les seues regles i no n'hereta cap altre nivell.

### 6.5 JS

```js
// NotesSection.jsx
useLayoutEffect(() => {
  const page = pageRef.current;
  const cs = getComputedStyle(page);
  const lMitja = parseInt(cs.getPropertyValue('--notes-llindar-mitja'), 10) || 600;
  const lAmple = parseInt(cs.getPropertyValue('--notes-llindar-ample'), 10) || 960;
  const mesura = () => {
    const w = page.clientWidth;
    setMida(w >= lAmple ? 'ample' : w >= lMitja ? 'mitja' : 'estret');
  };
  mesura();
  const ro = new ResizeObserver(mesura);
  ro.observe(page);
  return () => ro.disconnect();
}, [setMida]);

// Reconciliació en canviar de mida: cap panell obert que ja no siga plegable.
useEffect(() => {
  if (mida === 'ample') setPanellObert(null);
  else if (mida === 'mitja' && panellObert === 'notes') setPanellObert(null);
}, [mida, panellObert]);
```

L'encapçalat, amb atributs — mai amb arbres:

```jsx
function NotesColumnHeader({ col, titol, icona, children }) {
  const { mida, panellObert, setPanellObert } = useNotes();
  const plegable = mida === 'estret' || (mida === 'mitja' && col === 'carpetes');
  const obert = panellObert === col;
  const alterna = () => setPanellObert(obert ? null : col);

  return (
    <div
      className={`notes-column-header notes-column-header--${col}`}
      // Atributs condicionals. L'element és sempre el mateix.
      role={plegable ? 'button' : undefined}
      tabIndex={plegable ? 0 : undefined}
      aria-expanded={plegable ? obert : undefined}
      aria-controls={plegable ? `notes-col-${col}` : undefined}
      onClick={plegable ? alterna : undefined}
      onKeyDown={plegable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); alterna(); }
      } : undefined}
    >
      {icona}
      <div className="notes-column-title">{titol}</div>
      {children /* el botó «replegar columna», que ja és d-desktop-only */}
    </div>
  );
}
```

L'`<aside>` i la `<section>` de les columnes reben `id={`notes-col-carpetes`}` / `notes-col-notes` per a lligar l'`aria-controls`.

### 6.6 Focus i teclat

- **En obrir un panell:** focus al primer `.folder-item` / `.note-card`.
- **En tancar amb Escape o vel:** focus torna a l'encapçalat que el va obrir.
- **En triar nota:** `panellObert = null` i `editor.commands.focus()`. És l'única volta que el focus va a l'editor, i és deliberat.
- **Disclosure, no diàleg.** No poses `role="dialog"` ni `aria-modal`: exigirien trampa de focus, i ací no la vols. El vel bloqueja el toc; el teclat pot passar de llarg sense problema.
- Com que **l'editor ja no s'amaga mai**, ProseMirror conserva la selecció sola. No cal guardar ni restaurar `Range`. Este és el guany real del requisit 1.

### 6.7 Portes noves

Ordenades per honestedat mecànica. Les tres primeres es poden fer bé; la quarta la deixe marcada com el que és.

| Porta | Comprova | Mecànicament honesta? |
|---|---|---|
| `porta-arbre-unic.mjs` | Cap `mida ===` / `esMobil` / `isCompact` dins d'un `return` de JSX que trie components. AST amb `@babel/parser`, que ja tens a `tractor-vocabulari`. | **Sí.** Detecció estructural, no regex. |
| `porta-viewport.mjs` | Cap `vw`/`vh`/`@media` dins de CSS carregat per un component de Shadow DOM. | **Sí.** Absència d'un token en un fitxer. |
| `porta-superposicio.mjs` | Cap `position: fixed` en CSS injectat al shadow root. | **Sí.** Igual. |
| ~~`porta-tacte.mjs`~~ | Que tot control faça ≥44px | **No.** Un regex sobre `min-height` declarat no verifica la mida **calculada**. Seria una porta que certifica el que no comprova — exactament el que ens ha portat ací. Si la vols de veres, ha de ser una prova de render amb Playwright i `getBoundingClientRect`. Si no la pots fer així, no la faces. |

I la porta que et deu més: fer que `tractor-vocabulari.mjs` reutilitze `cssCarregat()` de `tractor-estucat.mjs` i purgar les 142 entrades. No és una porta nova; és fer que una que ja tens deixe de mentir.

---

## 7. TANCAMENT

Sense SDP-LOCK: cap acció proposada destruïx dades.

El que t'has trobat en tauleta i mòbil no és un problema de CSS responsive. És que la variable es diu `mobilePanel` i tracta l'editor com un panell més. Canviar-li el nom i el significat — *«què hi ha obert damunt de l'editor»* en compte de *«quin panell mire»* — resol el requisit 1, la pèrdua de cursor i la meitat de la fragilitat d'esta secció. La graella de tres nivells és la conseqüència, no la causa.

I la lliçó de §1 no és de notes: **un fitxer de deute amb 142 entrades no és una llista de tasques, és una vena als ulls d'una porta.**
