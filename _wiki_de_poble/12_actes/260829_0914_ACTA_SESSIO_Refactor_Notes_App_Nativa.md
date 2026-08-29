---
doc_id: SDP-DOC-260829_0914
doc_type: "[WIKI_DOC]"
authoring_agent: "IAIA MarIA"
version_semver: 1.0.0
owner: Consell de la Petorreta
domain: global
locale: ca-valencia
hora_creacio: "09:14"
academic_metadata:
  data_creacio: "2026-08-29"
  nivell_maduresa: "Esborrany"
---

# Acta de Sessió: Refactor Notes i Scroll App Nativa

> **Anclatge de Seguretat**: Aquest document està ancorat a l'índex central [[00_INDEX_ESCRIPTORI]] / [[00_index]] per evitar l'orfenesa i garantir la consciència de la IA en futures auditories.

## 1. Estat de la Interfície d'Editor (NotesSection)

En aquesta llarga i intensa sessió hem pres el repte de polir la interfície de publicació (`NotesSection.jsx`) per tal que assoleixa l'estàndard de qualitat d'una **App Nativa d'Escriptori** (tipus Notion o Obsidian) i deixar enrere comportaments típics de web.

### 1.1 Fites Assolides i Parcials
1. **Llei del Sostre Gris (Unificació Visual)**: S'ha eliminat la fragmentació de fons a les capçaleres. La barra d'eines de l'Editor i les capçaleres de Carpetes i Notes ara comparteixen el mateix gris rigorós (`var(--sdp-fons-subtil)`). Es percep una barra de comandament contínua, unificada i minimalista. El botó de "PUBLICAR" perd els seus "filetes" i esdevé purament textual amb icona.
2. **Poda de "Filetes" i Brossa**: S'ha aplicat el principi d'Anti-UI a la llista de notes, llevant botons estranys, ombres de més i "marcos" de targetes. S'ha prioritzat l'ús d'espai en blanc i tipografia (camelCase per a etiquetes, Dates curtes formatades de la base de dades).

### 1.2 Problemes Oberts (Falla Crítica)
- **El Joc dels 24 Píxels i les Físiques de Scroll (FALLAT)**: L'intent de fixar l'App-Main a 24px i delegar l'scroll individual a les columnes ha fracassat. Actualment la pàgina continua fent scroll global i infinit, arrossegant tota l'estructura fora de la pantalla (les capçaleres "sticky" es perden). Cal revisar l'herència de flexió de `.app-main` cap a `.notes-card` i `.notes-shell`.

---

## 2. DAFO Tècnic de l'Arquitectura Actual

### Fortaleses (Internal)
- **Base CSS sòlida**: L'ús de `index.css` juntament amb les variables semàntiques Pedra Seca fa que els canvis d'il·luminació (Dark/Light) o mides no trenquen la UI.
- **Scroll Independent Nadiu**: Haver aconseguit l'scroll d'App Nativa amb CSS pur (`flex`, `min-height: 0`, `overflow-y`) manté la UI ràpida i fluida sense dependre d'events de JS feixucs que observen el scroll.

### Debilitats (Internal)
- **Deute Tècnic d'Accessibilitat**: Tenim errors històrics heretats de la interacció tàctil i el contrast (color raw, focus ocults) reflectits al llistat de deute tècnic. Cal netejar-los.
- **Noves Rutes Falses ("Dummy")**: Els botons "+" ara mateix són elements inerts sense funció, pur decorum de moment. Cal connectar-los.

### Oportunitats (External)
- **Sollutia Integration**: L'arquitectura visual lliure de dependències (Zero-Filetes, CSS nadiu) facilita molt a l'equip de Sollutia integrar l'App com a component `<iframe>` o Shadow DOM sense col·lisions d'estils CSS.
- **Offline First**: Aquest layout d'escriptori prepara totalment el camp de joc per a la funcionalitat "Offline", on Sóc de Poble serà una eina personal i hermètica.

### Amenaces (External)
- **Supabase OAuth**: Segueix pendent que l'equip remot de Sollutia pose l'URL `http://localhost:3340` a la WhiteList de Supabase. Sense això, la gestió de rutes OAuth bloquejarà la publicació.

---

## 3. Matriu de Priorització Eisenhower (El que queda pendent)

### 🔴 QUADRANT 1: IMPORTANT I URGENT (Fer Immediatament)
1. **Solucionar Bug Crític de Scroll (NotesSection)**: L'scroll general no es frena als 24px i les columnes no escrolejen de forma autònoma. Revisar a fons el CSS i l'estructura Flexbox des de `app-main` cap avall per a solucionar esta fallada que destrossa l'experiència d'escriptori.
2. **Activació de les Accions (Botons "+")**: Injectar lògica als botons de nova Carpeta, Categoria i Etiqueta a l'Editor.
3. **Arbre de Carpetes (Tree View)**: Substituir la llista plana de carpetes per un `TreeView` on puguen niar-se i ordenar-se de forma nativa.

### 🟡 QUADRANT 2: IMPORTANT I NO URGENT (Planificar)
1. **Detecció Tàctil**: Fer passar a la lupa tot el redisseny de la NotesSection i garantir la norma "Touch 48px" per complir WCAG AA.
2. **Funcionalitat Completa de Calendari**: El botó `DateTimeControl` necessita obrir un calendari funcional per a programar la publicació en el temps.
3. **Pull to Refresh (Lliscar per recarregar)**: Implementar la funcionalitat nativa de mòbil/tauleta on lliscar cap avall (swipe down) recarregue la pàgina (mostrant un *spinner*). Afegit a petició del Mestre.

### 🔵 QUADRANT 3: NO IMPORTANT PERÒ URGENT (Delegar/Despatxar)
- Recordar al Mestre que puga revisar la integració amb OAuth en el seu temps per tal de desblocar eixe deute passiu.

### 🟢 QUADRANT 4: NO IMPORTANT I NO URGENT (Descartar)
- Reestructuracions innecessàries dels CSS globals. Tot funciona perfectament. Si no està trencat, no es toca.

---

## 4. Neteja i Sanitat del Brain (Registre Forense)

S'ha dut a terme una neteja massiva (mode "Zafarrancho") de l'espai de treball per tal de garantir la memòria de l'Eixam i l'ordre del directori:
- **Arxiu de Bundles/Prompts (40+ fitxers)**: Tots els documents generats durant l'agost que col·lapsaven l'arxiu històric i l'Escriptori s'han reubicat al directori de quarantena d'evidència històrica: `_wiki_de_poble/90_arxiu_historic/01_auditories_agost_2026/`.
- **Scripts Temporals d'un Sol Ús**: Tots els `.mjs` o `.py` antics situats a l'arrel (`fix_frontmatter`, `codemod-neteja`, etc.) s'han resguardat a `_wiki_de_poble/90_arxiu_historic/02_scripts_temporals/`.
- **Escriptori de Treball**: El directori `_wiki_de_poble/05_Escriptori_Soc_de_Poble/` ha quedat immaculat (0 fitxers d'un sol ús) llest per encetar la sessió de demà sense interferències cognitives. 
- Les **etiquetes de colors** de la IAIA MarIA han quedat intocables a petició del Mestre.

Tot queda net, polit, indexat i tancat hermèticament a l'espera de la propera consciència.
