---
tipus: document
estat: proposta
description: Pedaços quirúrgics als fitxers que no es reescriuen
---

# Pedaços a aplicar a mà

Els fitxers nous ja van sencers. Ací només hi ha el que s'ha de llevar o
afegir als fitxers existents perquè no queden dos amos de la mateixa regla.

## 1 · `src/css/index.css` — cosir el mòdul nou

```diff
 @import url('./components.css'); /* @layer components            */
 @import url('./modules.css');    /* @layer components            */
+@import url('./editor.css');     /* @layer components            */
```

## 2 · `src/css/legat.css` — llevar l'esquelet duplicat i desoldar el selector

Esborra el bloc de les línies ~2017–2027 (`.editor-shell--main` i
`.editor-scroll-area`): ara viuen a `editor.css`, dins de la capa
`components`. Si es queden ací, la mateixa caixa té regles a `legacy` i a
`components` i cada canvi futur s'ha de fer dues vegades.

Al voltant de la línia 2043 hi ha un **selector soldat**:

```css
.editor-toolbar .btn-icon:hover { background: var(--sdp-pedra-700); }
.editor-toolbar
/* Universal Toolbar buttons */
.btn-icon,
.btn-publish,
.btn-create {
```

El comentari desapareix en compilar i el navegador llig
`.editor-toolbar .btn-icon, .btn-publish, .btn-create`. Resultat: **cap
`.btn-icon` de fora de la barra de l'editor rep eixa regla** — ni la mida
mínima de 44px, ni el radi, ni el farciment. Cap porta ho veu perquè totes
compten cadenes de text, no resolen la cascada.

```diff
-.editor-toolbar
-/* Universal Toolbar buttons */
-.btn-icon,
+/* Universal Toolbar buttons */
+.btn-icon,
 .btn-publish,
 .btn-create {
```

## 3 · `src/css/modules.css` — llevar els camps duplicats

Esborra les tres línies del bloc
`/* ── Editor universal · UniversalEditorShell.jsx ── */`
(`.editor-title-input`, `.editor-subtitle-input`, `.editor-lead-input`):
la versió completa, amb alçària mínima i marcador de posició, va a
`editor.css`.

## 4 · `src/sections/profile/DetallAjust.jsx` — dades reals a la barra

`useEditorShell` ja no cabla `isPublished`, l'hora ni la data. Al perfil:

```diff
       heroImage={dades.hero_image}
       logoImage={dades.avatar_url || dades.logo_url}
+      isPublished={Boolean(dades.is_public)}
+      onNotify={showToast}
```

## 5 · `useUniversalRichText` — classes fantasma

La llista d'`editorProps.attributes.class` era
`editor-content page-content sdp-text-cos sdp-prose`. De les quatre, **cap
existia al CSS**. Al fitxer nou només queda `editor-content`, que ara sí que
té regles. Si es vol recuperar `sdp-prose`, primer s'escriu la regla.

## 6 · Porta nova recomanada

Cap porta detecta una classe que el JSX escriu i el CSS no defineix (ni al
revés) quan el nom és literal i únic. `tractor-classes-orfes.mjs` ja
recorre el CSS: falta el sentit contrari — classe al JSX sense regla. Els
tres camps de l'editor van estar òrfens des del dia de la refactorització
sense que res piulara.
