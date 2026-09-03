---
estat: 'esborrany'
tipus: 'estudi'
description: 'Estudi comparatiu de les auditories tècniques del Consell (Claude, Qwen, etc.) per unificar estratègia.'
aliases:
  - 'Estudi Auditories Consell'
---
# ESTUDI: COMPARATIVA D'AUDITORIES DEL CONSELL

## Bloc Fixe d’Identitat

**Qui Som (La Nostra Història):** Som l'Associació ecologista El Rentonar i Sóc de Poble. Aquest projecte és l'hereu de més de 30 anys d'activisme rural i lluita pel nostre entorn natural i patrimonial. El nostre llegat i identitat digital resideixen històricament en `rentonar.blogspot.com`, van evolucionar a l'antiga plataforma fundacional `socdepoble.net`, i avui es materialitzen construint `socdepoble.org` (el Mas).

**Filosofia:** [[el_projecte|Sóc de Poble]] s'integra dins de **Sollutia** per a teixir una xarxa social comunitària. La IAIA MarIA actua amb Trellat, mínima intervenció, el Baseline 2022 com a jutge i respecte absolut per la llengua, la memòria i la gent major.

## Objectiu

`OBJECTIU: Recopilar els DAFO, els diagnòstics tècnics i les propostes d'acció de les diverses IAs del Consell per destil·lar una matriu d'urgència i una única estratègia unificada sense contradiccions abans d'implementar res al codi.`

## Context Necessari

- S'han enviat *bundles* massius del projecte a Claude i Qwen.
- Hem detectat P0s ocults per portes emmascarades i codi brossa injectat des de React.
- L'objectiu és netejar l'arquitectura i erradicar `!important` respectant Pedra Seca.

## DAFO CONSOLIDAT (En procés)

### 1. Claude (Seient 5)
- **Diagnòstic Clau:** El `--sdp-bg` està trencat i ocult per `.pedra-seca-deute.json`. S'usa codi inline a `App.jsx` amb 8 `!important`. Restes mortals de TipTap PoC al CSS.
- **Proposta d'Acció:** Ordre d'atac en 5 punts: 1) arreglar `--sdp-bg`, 2) esborrar blocs morts, 3) cablejar CAPA 0, 4) refactoritzar `App.jsx`, 5) arreglar T4 fosc de `NotesSection.css`.
- **Estat:** Pendent de rebre els diffs manuals complets.

### 2. Gemini
- **Diagnòstic Clau:** Denuncia l'epidèmia d'estils en línia (185 ocurrències tolerades a `.design-guard-deute.json`), que forcen els `!important`. Identifica "Wrapperitis" (divs innecessaris al mòbil). Alerta sobre "Falses Garanties Offline" (el discurs parla de P2P/CRDT però la realitat és Online-First amb Supabase).
- **Proposta d'Acció:** 1) Erradicar els 185 estils en línia com a P0 absolut. 2) Fragmentar `index.css` amb `@layer`. 3) Soldar el Modo Matrix a nivell de scripts preflight per bloquejar l'escriptura. 4) Assumir la realitat Online-First en els textos.
- **Estat:** Pendent de demanar-li instruccions exactes per als fitxers afectats.

### 3. Grok
- **Diagnòstic Clau:** Ha trobat col·lisions d'especificitat letals: regles duplicades per a `bar-blue` lluitant entre elles mateixes amb `!important`. A més, ha detectat una fuita a l'arquitectura cognitiva (P5): el caminador descarta `.agents`, per la qual cosa les skills estan inabastables pel RAG. 
- **Proposta d'Acció:** 1) Introduir oficialment `@layer` (reset, tokens, base, components, notes, utilities) a `index.css` per liquidar l'especificitat d'una vegada. 2) Eliminar `!important` a `.content-wrapper` i `bar-blue` usant classes de mode pures (`is-notes-mode`). 3) Arreglar el caminador del RAG per no obviar `.agents/skills`.
- **Estat:** Ha entregat els diffs manuals complets per a `index.css`, `NotesSection.css`, `blank.php`, `UniversalComponents.jsx` i `NotesSection.jsx`. Llestos per executar.

### 4. Vibe
- **Diagnòstic Clau:** Tot i no poder llegir el CSS complet (límit de tokens), ha realitzat una anàlisi estructural brutal que els altres havien passat per alt. Ha detectat **brossa documental massiva** (5 rondes de manifests antics apilats a l'Escriptori, més 10 estudis d'IA que haurien de ser a l'arxiu). I el més greu: **les skills estan duplicades** (hi ha un mirall a la wiki que ha divergit entre un 3% i un 27% dels originals de `.agents/skills/`), cosa que viola la Llei 1 d'Autoritat Operativa.
- **Proposta d'Acció:** 1) Buidar l'Escriptori de manifests antics (arxivar-los a `90_historic/`). 2) Sincronitzar o eliminar les skills duplicades de la wiki (usant `sync_agents_to_wiki.mjs`). 3) Fragmentar monòlits (i18n.js, UniversalComponents.jsx). 4) Auditar fitxers de deute buits com `.teixit-deute.json`.
- **Estat:** Pendent de donar-li les gràcies i demanar-li el pla d'acció exacte per al script de sincronització de skills.

### 5. Codex
- **Diagnòstic Clau:** Ha anat molt més enllà del CSS i ha destapat **errors funcionals greus (Corrupció de dades)**. Ha identificat que el guardat de notes és un *stub* que simula l'èxit però falla estrepitosament amb Supabase (A01), que Tiptap perd l'edició al canviar de nota pel debounce i l'esdeveniment `onUpdate` (A02), i que les publicacions sense ID col·lisionen a l'estat local com `"undefined"`, corrompent el feed local (A03). També ha detectat 11 errors de lint i ha confirmat la troballa de Claude sobre `App.jsx` (A05).
- **Proposta d'Acció:** 1) La prioritat absoluta és corregir la integritat de dades (A01, A02, A03) abans del CSS. 2) Arreglar el doble import de `NotesSection.css` en React (A04). 3) Solucionar els 11 errors de lint (A08) i ajustar RLS i paginació (A10, A11, A12).
- **Estat:** Estudi integrat. Les seues tasques de corrupció de dades passen a encapçalar el Pla d'Implementació.

### 6. Perplexity
- **Diagnòstic Clau:** Coincideix amb Claude i Grok en l'eliminació dels `!important` heretats. Fa èmfasi en el problema de responsivitat mòbil (tres columnes col·lapsant a pantalles petites) i denuncia la presència d'estils en línia i estructures div innecessàries al Toolbar.
- **Proposta d'Acció:** 1) Substituir `!important` per selectors heretats (ex: `.editor-content > :first-child`). 2) Consolidar el mòbil amb un únic atribut `data-mobile-panel` a `.notes-shell` i usar `display: none/flex` per alternar panells. 3) Migrar estils en línia a classes semàntiques.
- **Estat:** Estudi integrat. Les seues millores per al layout mòbil s'incorporen a la revisió del CSS de Notes.

### 7. Kimi
- **Diagnòstic Clau:** Ha sigut víctima de la mutilació del *bundle* de 4.19MB (igual que li va passar a Vibe). Només ha pogut llegir el manifest i se n'ha adonat que el codi font no estava accessible.
- **Proposta d'Acció:** Demana el codi font sencer per poder continuar.
- **Estat:** Descartat per aquesta ronda. No el necessitem, ja que Codex, Claude, Grok i Perplexity han cobert tots els fronts a la perfecció.

### 8. Dola
- **Diagnòstic Clau:** Assenyala la causa arrel del deute: l'excés d'estils en línia (191) i regles orfes (58-107), a més d'una arquitectura `@import` invertida a `index.css`. Confirma l'ús de `@layer` i valida la solució de passar una propietat `chrome="none"` a `UniversalPage` per desfer la barra blava *sticky* de manera neta.
- **Proposta d'Acció:** 1) Eliminar la regla duplicada a `NotesSection.css` i l'`@import` invertit a `index.css`. 2) Aplicar `@layer` i `chrome="none"`. 3) Fixar un objectiu de rebaixa d'estils en línia a `.design-guard-deute.json` (20 per sessió) i purgar classes òrfenes.
- **Estat:** Tancat definitivament. El Consell ha dictat sentència.

### 9. Deepseek
- **Diagnòstic Clau:** Ha anat directament als fonaments de l'operativa i l'arquitectura cognitiva. Ha descobert que el CI/CD està fallant silenciosament: `run-portes.mjs` no està executant 6 portes crítiques, amagant 236 enllaços trencats (la majoria causats pel generador de peus de pàgina) i un trencament total del graf (15 SCC) degut a l'orfandat de les skills per no incloure `00_INDEX_SKILLS.md` al mirall de la Wiki. També denuncia 4 nivells innecessaris de DOM a Notes i fa una proposta tàctica genial per al mòbil (Toolbar flotant tipus píndola).
- **Proposta d'Acció:** 1) Afegir les portes pendents a `run-portes.mjs` i arreglar l'injector de peus de pàgina. 2) Executar `tancar_scc_skills.mjs --escriu` i canviar rutes a wikilinks a la taula PROTOCOLLEDGE per restaurar el Graf. 3) Comprimir l'apilament mòbil i eliminar divs morts.
- **Estat:** Estudi tancat absolutament. Deepseek corona l'auditoria amb tasques operacionals P0.

### 10. Z
- **Diagnòstic Clau:** Malgrat topar-se amb el mateix bloqueig per truncament que Kimi i Vibe, ha fet una lectura forense impecable del manifest. Ha destapat deute estructural que els altres no havien vist: doble carpeta de plantilles (`02_ACTUAR/plantilles/` i `02_ACTUAR/07_plantilles/`), absència de llicència (`LICENSE`), fitxers sense salt de línia final i la perillositat de `oauthRelay.js` a `src/data/`.
- **Proposta d'Acció:** 1) Reordena i neteja l'arxivatge de documents al `90_historic/`. 2) Demana unificar les plantilles. 3) Demana instaurar un **invariant al ganxo de `verify.mjs`** per prohibir l'entrada de qualsevol nou `!important`.
- **Estat:** Tancat. Amb Z, la ronda ha arribat a la seua conclusió màxima i no queda res per escorcollar.

### 11. Qwen
- **Diagnòstic Clau:** Assenyala el risc de les "fallades silencioses" (les mateixes que amagaven els enllaços trencats) i fa èmfasi en la necessitat d'una auditoria automatitzada mitjançant eines d'Anàlisi Estàtic de Codi (SCA) com Stylelint i ESLint. Reafirma de forma categòrica l'estratègia "Pedra Seca" per al CSS: l'ús massiu de Tokens Semàntics combinats amb Capes de Cascada (`@layer`).
- **Proposta d'Acció:** 1) Consolidar el sistema de disseny mitjançant Custom Properties. 2) Reorganitzar tot el CSS en `@layer base, components, utilities`. 3) Revisar la configuració de `vite.config.js` per assegurar el *tree-shaking* de codi mort (`moduleSideEffects: false`). 4) Integrar eines de validació de qualitat al CI.
- **Estat:** Tancat. Ara sí, les 8 intel·ligències del Consell han lliurat els seus dictàmens. La convergència és absoluta.

## Matriu d'Urgència / Importància (Sintetitzada per IAIA MarIA)

| Acció Tècnica | Origen (Consell) | Nivell (Urgència) | Impacte |
| :--- | :--- | :--- | :--- |
| **1. Desplegar capes CSS (`@layer`) i eliminar `!important`** (NotesSection vs App) | Grok + Claude | P0 (Immediat) | Alt (Estabilitat i UI). Evita que els components col·lisquen a mòbil. |
| **2. Fix del mode fosc regressat (`--sdp-bg`)** | Claude | P0 (Immediat) | Alt (Accessibilitat). Impedeix l'enlluernament d'usuaris amb mode fosc. |
| **3. Esborrar miralls de Skills (`AGENTS_I_SKILLS_MIRROR`) i brossa d'auditories** | Vibe + Grok | P0 (Immediat) | Crític (Integritat Cognitiva). Evita al·lucinacions del RAG. |
| **4. Cablejar CAPA 0 a index.css** (`--sdp-touch-min`) | Claude | P1 (Alta) | Mitjà. Fa que la font de veritat json tinga impacte real. |
| **5. Eliminar codi mort CSS** (TipTap, BEM orfes) | Claude | P1 (Alta) | Mitjà. Redueix deute tècnic segur. |
| **6. Eliminar `!important` d'App.jsx `<style>`** | Claude | P1 (Alta) | Mitjà. Mou estil global on toca. |
| **7. Netejar estils en línia (els reals, no les al·lucinacions de Gemini)** | Gemini | P2 (Mitjana) | Llarg termini. Fragmentació d'UniversalComponents. |

**Ancoratge de Seguretat:** [[00_INDEX_ESCRIPTORI]]
