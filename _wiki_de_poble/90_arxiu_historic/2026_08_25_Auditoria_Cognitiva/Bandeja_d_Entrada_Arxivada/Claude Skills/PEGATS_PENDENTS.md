# Pegats pendents — aplicar amb La Tanca

Cada bloc és una operació independent. Executeu-los d'un en un, llegint
sempre l'assaig abans d'afegir `--procedeix`.

---

## P0-A · XSS emmagatzemat a Notes  ·  `src/sections/notes/NotesSection.jsx:183`

`activeNote.content` s'injecta cru. `TextSection`, `IaSection` i
`detailRichText` sí que sanegen; esta no.

```diff
+import DOMPurify from 'dompurify';
 ...
   <article
     className="app-note-content"
     style={{ marginTop: 24 }}
-    dangerouslySetInnerHTML={{ __html: activeNote.content }}
+    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(activeNote.content) }}
   />
```

Verifiqueu també `renderPageHtml()` a `PageDetailSection.jsx:54`: si no
sanitza internament, el mateix pegat.

---

## P0-B · Fuita de CSS cap a Sollutia  ·  `src/sections/disseny/DesignSection.jsx:4`

```diff
-import '../../pages/features/sosp-components.css';
+import sospStyles from '../../pages/features/sosp-components.css?inline';
```

I injecteu `sospStyles` al full compartit de `PedraSecaEmbed`, o moveu el
contingut a `index.css`. Tal com està ara, les 484 línies van al `<head>` de
WordPress **i** no arriben al shadow root.

---

## P0-C · Col·lisió de classes al DOM de Sollutia  ·  `src/app/App.jsx:124,212`

```diff
-host.classList.toggle('sidebar-closed');
+host.classList.toggle('sdp-sidebar-closed');
```

Actualitzeu el selector corresponent al CSS. `sidebar-closed` és un nom
genèric perillós en una pàgina WordPress amb tema i constructor visual.

---

## P0-D · Excepció cap al codi de l'amfitrió  ·  `src/PedraSecaEmbed.jsx:252`

```diff
-const configHash = JSON.stringify(rawConfig);
+let configHash;
+try {
+  configHash = JSON.stringify(rawConfig);
+} catch (err) {
+  console.warn('[soc-de-poble] config no serialitzable; s\'ignoren els camps problemàtics.', err);
+  configHash = JSON.stringify(
+    Object.fromEntries(
+      Object.entries(rawConfig).filter(([, v]) => ['string','number','boolean'].includes(typeof v))
+    )
+  );
+}
```

Si Sollutia assigna `el.config` amb una referència circular (node del DOM,
jQuery, `window`), avui l'excepció ix cap al seu script.

---

## P1-E · Llei de Vida  ·  `src/css/index.css:1723-1724`

```diff
-header.bar-black .right-icons .icon { width: 36px; height: 36px; min-width: 36px; min-height: 36px; padding: 6px; }
-header.bar-black .right-icons img.icon { width: 28px; height: 28px; min-width: 28px; min-height: 28px; }
+header.bar-black .right-icons .icon { width: 44px; height: 44px; min-width: 44px; min-height: 44px; padding: 10px; }
+header.bar-black .right-icons img.icon { width: 28px; height: 28px; }
```

L'àrea tàctil ha de fer 44px; el glif de dins pot ser més menut. Separeu
la mida del control de la mida de la icona.

---

## P1-F · Dos vocabularis de targeta

52 aparicions de `card__title`, `card__body`, `card__text`, `detail-content`,
`badge-row` i `chat-empty` en 11 fitxers JSX. **Zero definicions** en cap
CSS del bundle. El CSS canònic parla `sp-card-*`.

Decidiu quin guanya i unifiqueu en una sola passada per la Tanca. Mentre no
es faça, eixes seccions es pinten sense estil.

---

## P1-G · Llei 2 del tractor: fals positiu

`tooling/gates/tractor-consell.mjs`, Llei 2, busca l'identificador
`normalizeDataMode`. El codi implementa el comportament amb literal en línia
i és correcte. Canvieu la comprovació de nom per comprovació de
comportament, o extraieu la funció amb eixe nom. Mentre la porta done un
fals positiu, l'equip continuarà ignorant-ne l'eixida.

---

## P2 · Codi mort i i18n

- `src/config/theme.js` — `decode()` i `LEGACY_KEYS` declarats i mai usats (resolt al pegat adjunt).
- `src/data/supabaseBackend.js:9,39` — `CHAT_GUEST_DB_USER_ID_KEY` i `stripMarkdownImages`.
- `src/config/i18n.js` — `eu` li falten 19 claus, `gl` 16, i 10 claus usades al codi no existixen en cap idioma.
