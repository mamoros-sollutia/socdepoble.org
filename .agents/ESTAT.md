---
tipus: document
estat: canonic
description: "Estat Actual: Blindatge del Sistema Pedra Seca finalitzat i Píndoles de Vista Comprimida implementades. Solució estructural de Bundles (actes i skills_mirror)."
---
# ESTAT.md (Registre d'Estat Cognitiu)

## Sessió 260911 · Sahumerio de Notes i arquitectura universal

- `AppGridShell` incorpora separadors de columna redimensionables sense dependències: punter/tàctil i teclat (`←`, `→`, `Home`, `End`), amb semàntica `role="separator"`, límits i valor accessibles.
- La graella ampla conserva tres scrolls independents; en 720–1089 px usa llista + contingut amb Carpetes superposada, i per davall de 720 px mostra un panell cada vegada amb la resta marcada `inert`.
- Carpetes i Notes comparteixen la capçalera fosca canònica. La barra secundària usa el fons subtil: `Tot` gran + Ajustos en Carpetes, i cerca + Crear nota en Notes.
- En plegar Carpetes només queden expandir + Ajustos. En plegar Notes queda una única lupa que torna a expandir la columna; Crear nota desapareix.
- Eliminat el segon bloc CSS contradictori de `UniversalManager`, llevats els estils en línia d'esta superfície i purgats imports/estat morts en `UniversalPage`, `UniversalToolbar`, `ManagerContext` i `NotesEditor`.
- `UniversalPage layout="contained"` té ara una classe estructural canònica, i la pàgina Disseny documenta Top Bar + Sidebar + Contingut, estats responsive i contracte dels separadors.
- Validació: `build:web` ✅, `build:wp` ✅, lint de l'abast ✅, proves dirigides 3/3 ✅, `porta:graella` ✅, `porta:tokens` ✅, `porta:58px` ✅, `porta:build` ✅, `porta:frontera` ✅ i `porta:antitailwind` ✅.
- QA visual local: 1800×1000 i 390×844 ✅; el separador de Carpetes canvia de 270 a 286 amb teclat; no hi ha separadors en mòbil.
- Deute preexistent fora de l'abast: `porta:inlinestyles` conserva una sola infracció en `src/sections/gestoria/views/GestoriaHome.jsx:70`; la suite global continua afectada pel renderer Preact amb VNodes congelats i per errors en tooling ja presents al worktree.

## Objectius Assolits (Sessió Actual)
- **Correccions Bloc de Notes**:
  - Arreglada la imatge (Bloc notes vintage) a `pageContent.js`.
  - Corregida la redirecció de la targeta a `MurSection.jsx` canviant `href` a `/jo/notes` per evitar conflictes relatius de l'enrutador cap a llocs inexistents (404).
- **Petorreta Generada per al Mòdul Perfil (Fail-Closed)**:
  - Netejats els antics bundles de l'escriptori cap a l'arxiu històric.
  - Generat el nou bundle complet de l'aplicació (`260911_2038_BUNDLE_auditoria.md`).
  - Refinat el `260911_2038_PROMPT_auditoria.md` amb instruccions específiques per al Consell: clonar `NotesSection` a `PerfilShell`, aplicar Pedra Seca i implementar `Fail-Closed` per a evitar pantalles en blanc davant d'errors 404 de backend (Llei L6).

## Objectius Assolits (Sessió Anterior)
- **Llei de la Fitxa de Gestor (Pedra Seca)**:
- **Bug P0 del Perfil Resolt**:
  - A `src/components/universal/manager/ManagerList.jsx`, la clau i selecció de files s'ha canviat de `item.id` a `getItemId(item)`, evitant xocs d'IDs entre ajustos i permetent la navegació i selecció fluida de cada secció del Perfil.
- **Pàgina 404 Centrada i Estètica**:
  - `NotFoundPage.jsx` redissenyada amb `.sdp-404-cos`, icona brúixola, botó d'acció centrat i estils a `index.css`. Provada al navegador i aprovada pel Mestre.
- **Consumidors Migrats**:
  - `NotesSection.jsx`, `PerfilShell.jsx` i `AdminSection.jsx` integrats amb `getItemCard`.
- **Rescat Gestoria 3T & Fix RLS Perfil**:
  - Rescatada la maquinària de gestoria a `public/gestoria/` lliure de mode fosc forçat per SO, adaptada a Pedra Seca clara (`#fbf9f5` / `#ffffff`).
  - Resolt el bug 403 RLS de pujada de fotos a perfils mitjançant fallback de metadades a `auth.users` i sincronització de sessió.
  - Avatar de perfil actiu en rodó (`50%`) a la cantonada superior dreta del TopNav.
  - Panell de Control (`/control`): targetes d'acció centrades, targeta "Animalets", i nova secció `Utilitats` amb "Gestoria de Poble".
- **Petorreta 260911_0624 (Uniformització Gestoria & Selector de Píndola)**:
  - Generat el Bundle `260911_0624_BUNDLE_auditoria.md` i Prompt `260911_0624_PROMPT_auditoria.md` per al Consell d'IAs.
  - Objectiu: blindar el patró de botons en píndola `[Universal Cards] [Vista Comprimida]` i guiar la unificació visual sense barrejar CSS antic.
- **Auditoria Visual Pedra Seca (Consell d'IAs)**:
  - Recepcionats els estudis de Gemini Flash, Grok, Mistral Vibe i Dola.
  - Vibe ha detectat (i al·lucinat) una duplicitat irreal de `UniversalCard.jsx`.
  - Dola ha forçat a introduir defenses CSS anti-Serif (`!important`) i l'obligatorietat de l'`Entradilla` davall de cada `H2`.
  - Totes les conclusions útils han estat afegides als contractes de `DesignSectionContent.jsx` i `index.css`.
- **Auditoria Estructural del Bundle (Deepseek)**:
  - Deepseek ha auditat metodològicament la generació de Bundles.
  - Ha detectat l'orfandat de `.agents` i la falta de la cadena d'actes (`10_actes`), a més de qüestionar els `skills_mirror`. Aquestes tasques queden en l'aire per decisió del Mestre.
- **Blindatge del Sistema Pedra Seca**:
  - Incorporació dels dictàmens de l'auditoria (Grok i Gemini Flash) al codi de `DesignSectionContent.jsx`.
  - Afegits contractes estrictes contra al·lucinacions de la IA: Taula canònica H1-H6, ritme vertical (0 i 16px per a paràgrafs), llistes "Prohibit Inventar", contracte DOM de l'UniversalCard i contracte de mides dels avatars.
  - Purgats els antics valors `rgb(255, 115, 0)` i `rgb(9, 132, 227)` de les plantilles `plantilla_branding.md` i `estandard_ui_universal.md` per evitar desincronització termodinàmica.
  - Creat el nou tractor `tooling/gates/tractor-tipografia.mjs` que llança Error 1 (EXIT 1) si detecta la injecció de tipografies `serif` (tret de `sans-serif`) o l'ús de RGB directes (colors tallats a mà).
- **Consolidació Estructural & IU (Sessió 260911 - Part 2)**:
  - Definida la "Universal System (L'Entorn)" a `_wiki_de_poble/02_saber/estandard_ui_universal.md`.
  - Implementat `PillToggle` per a "Vista Comprimida" a `GestoriaContactes.jsx` i `GestoriaFacturacio.jsx` alternant `.sdp-taula--densa`.
  - Ancorada l'`.editor-toolbar` afegint `display: flex` al contenidor pare `.editor-shell--main` a `index.css`.
  - Arreglats els errors de `crear_bundle.mjs`: `.agents` estava ja llistat correctament però ocult si s'al·lucinava el seu exclòs. Exclòs `skills_mirror/` per alleujar pes i creat el camí per a `10_actes/` en `.arrel.mjs`.

## Agenda i Briefing Integral (Documentat a `_wiki_de_poble/04_escriptori/260911_0520_ACTA_MARMOTA_tancament_sessio.md`)
1. **Bloc de Notes - Restauració de Capçalera Doble i Alineació**:
   - Reposar l'acordió vertical a la columna `CARPETES` (amagar/desplegar seccions) + botó replegar `[|<]`.
   - Sub-barra de Carpetes: pastilla destacada `[Inbox] Tot` + rodeta d'engranatge `⚙` per a la gestió global del bloc de notes.
   - Columna `NOTES`: títol de columna amb icona + botó de replegar. Sub-barra amb icona lupa compacta `🔍` + botó `CREAR NOTA` blau alineat amb la barra blava de l'editor.
   - Plegat harmònic: les 4 icones es mantenen alineades i visibles fins i tot quan les columnes estan plegades.
2. **Barra Blava Fixa (UniversalPage / Disseny)**:
   - Evitar que la barra blava superior desaparega amb l'scroll vertical; ancorar-la fermament a la part superior de la pàgina.
3. **Supabase (Xat)**:
   - Executar migracions `260908_xat_v2.sql` i `260908_xat_v2_correccions.sql` al SQL Editor de Supabase per registrar la funció RPC `xat_fils_meus` i eliminar els 404 del xat.
4. **Petorreta al Consell d'IAs**:
   - Fer córrer el prompt `260911_0624_PROMPT_auditoria.md` amb el bundle pel Consell (Qwen, DeepSeek, Claude, ChatGPT, Grok, etc.) per rebre els dictàmens d'uniformització.
