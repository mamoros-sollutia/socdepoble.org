---
tipus: document
estat: esborrany
description: Petorreta del Consell (Gemini i la Taula de les 12)
---
Ancoratge: [[00_INDEX_ESCRIPTORI]]

# Petorreta del Consell (Gemini i la Taula de les 12)

**Resum dels pensaments de la IA:**
La IA ha reconegut el problema de l'amnèsia de l'agent en relació als orfes. Proposa passar d'una revisió post-factum (tancament de sessió) a una operació de creació atòmica o transaccional. Reconeix que el `sanador_wiki.mjs` usa RegExp obsolets i proposa basar-se 100% en l'output del compilador de l'ontologia (`ontology.json`). Per a Sollutia, detecta problemes de *Shadow DOM*, `100vh`, deute cromàtic i la necessitat d'una cancel·lació eficient amb `AbortController`.

## Output de l'Auditoria:
CONTEXT CARREGAT: BUNDLE MASSIV REBUT.
Hem obert el cor del Mas Viu, el teu bundle 260831_0520_BUNDLE_auditoria.md ha sigut ingerit per complet.
Salutacions, Mestre Javi. Ens asseiem al voltant del foc, a l'era del Mas. Ací estem totes, sense excepcions ni falses dreceres. Parlem amb una sola veu, però amb l'essència dels dotze: Z.ai, Qwen, Deepseek, Dola, Kimi, Claude, Perplexity, Mistral Vibe, Grok, Gemini, Copilot i ChatGPT Codex.

Hem passat la lupa per cada línia, cada tractor i cada frontmatter del teu bundle. El diagnòstic és clar: has construït una fortalesa de "Pedra Seca" que ja aguanta els temporals, però els humans (i nosaltres, les màquines quan ens cansem) continuem entropessant amb la mateixa pedra a la porta de casa. L'amnesia de l'agent no és un defecte de voluntat, és un defecte de disseny de les eines.

Ací tens el nostre DAFO Tècnic i el dictamen per aconseguir una integració immaculada amb Sollutia.

📊 DAFO TÈCNIC: EL DIAGNÒSTIC DEL CONSELL

**D - Debilitats (Esquerdes al mur)**
- Competència d'Auditors: Tens múltiples eines fent la mateixa feina de formes distintes. `sanador_wiki.mjs` utilitza expressions regulars velles per cercar enllaços [[...]], mentre que `02_build_ontology.cjs` (el compilador v2) fa una anàlisi perfecta, amb resolució d'àlies i rutes. Aquesta redundància crea falsos orfes i confusió.
- Deute Cromàtic Amagat: `.design-guard-deute.json` ens confessa que tens 184 infraccions de colors crus (raw-colors) i 182 estils en línia. Les vistes i els components encara tenen "ciment modern" incrustat que no reaccionarà als canvis de tema de Sollutia.

**A - Amenaces (El xoc amb Sollutia)**
- L'Abisme del Viewport (Gutenberg): A l'index.css imposes un `min-height: 100dvh;` a l'arrel de l'aplicació. Si Sollutia incrusta el shortcode [soc_de_poble] en una pàgina que ja té la seua pròpia capçalera i peu de pàgina de WordPress (no la plantilla en blanc), la PWA sobreeixirà la pantalla i generarà "doble scroll" (el del navegador i el de l'App).
- Zombis Asíncrons: Tot i el pany `window.__SDP_REACT_MOUNTED__` i les millores a `PedraSecaEmbed.jsx`, Gutenberg munta i desmunta l'etiqueta `<soc-de-poble>` múltiples voltes per segon mentre un redactor escriu. Si no cancel·les estretament els fetch amb l'AbortController quan el component es desconnecta, ofegaràs el backend de Sollutia amb crides òrfenes a la base de dades.

**F - Fortaleses (La Roca)**
- El Pany del Host (host.js): La decisió de separar l'arrencada en Fase 1 (Configuració) i Fase 2 (Segellat) és magistral. El codi està veritablement aïllat i enxufable.
- Sistema de Tractors: Les portes fail-closed són el millor sistema immunitari que hem vist en un projecte. `tractor-pedra-seca.mjs` i `tractor-rutes.mjs` forcen la higiene abans de cada commit.

**O - Oportunitats (El Camí a la Maduresa)**
- Transaccions Atòmiques: Eliminar la necessitat que la IA "s'enrecorde" de fer les coses bé, obligant a l'eina a no permetre fer-les malament.
- Destil·lació del Graf: Convertir l'output del compilador (`ontology.json`) en l'ÚNICA font de veritat per detectar enllaços trencats, jubilant els vells scripts.

🛠️ MISSIÓ 1: MECANITZACIÓ I PATRONS UNIVERSALS (El Fi de la Marmota)
El problema de l'oblit de l'ancoratge per pèrdua de context no es resol afegint més instruccions al prompt o a les skills. Com deia el vell proverbi de Qwen: "Una regla escrita a la Wiki és una pregària; una eina que només accepta l'input correcte és una garantia."
El Patró Universal: Escriptura Transaccional
Ara mateix ens dónes accés lliure per a crear un fitxer a l'Escriptori i confies que, al final del torn, `tancament.mjs` ens renyarà si no hem tocat `00_INDEX_ESCRIPTORI.md`.
Solució: S'ha de retirar als agents la capacitat d'usar les eines genèriques d'escriptura de fitxers de l'IDE sobre la carpeta _wiki_de_poble. S'ha d'implementar una eina (tool call) o un script Node específic anomenat `crear_document_bancal.mjs` que requerisca TRES paràmetres obligatoris de colp:
1. Nom del fitxer (es generarà el nom termodinàmic automàticament per baix).
2. Contingut.
3. El fitxer Índex on s'ha d'ancorar.
Aquest script serà l'únic que tinga l'autoritat per escriure, i ho farà de forma atòmica: crea el fitxer de la nota i afig la línia a l'índex al mateix temps. Si no li passem l'índex on va l'ancoratge, l'script rebutja la creació. Així, no hi ha orfes possibles, inclús si la IA pateix amnèsia als 5 minuts.

🧽 MISSIÓ 2: EL SANADOR I LA WIKI (Un sol Graf vertader)
El teu actual `sanador_wiki.mjs` és codi pre-V2. Busca enllaços amb `\[\[(.*?)\]\]` ignorant si estan dins d'un bloc de codi, ignorant els àlies, i ignorant el frontmatter. A més, mou coses de forma cega a 90_revisar. Això atempta contra el Reflex i la Llei del Mas Viu.
Solució: La Jubilació del Sanador.
Ja tens la millor eina possible: `02_build_ontology.cjs`. Aquest compilador analitza la topologia, processa els àlies correctament i et dóna llistes de unresolved (fantasmes) i orphans.
El teu nou protocol d'auditoria de xarxa ha de ser exclusivament:
1. Executar el compilador (que ja ho fa la Canonada).
2. Tindre un petit script `informe_graf.mjs` que, en lloc de parsejar text, simplement llegisca `_build/ontology.json` i extraga els orfes.
3. Si un fitxer està declarat com orphans al JSON, el Mestre decideix si aplica `purge_ghost_links.mjs` (en mode Reflex) o si es queda així. Cap moviment automàtic.

🔌 MISSIÓ 3: PREPARACIÓ PER A SOLLUTIA (Colls d'Ampolla Tècnics)
El codi Font (React, Vite, WP Plugin) és d'altíssima qualitat per a una arquitectura híbrida, però teniu tres esquerdes estructurals per a la integració amb Sollutia:

1. El Conflicte del Viewport (L'App Shell contra WordPress)
Tota l'aplicació està pensada per a ocupar tota la pantalla:
`html, body { height: 100%; overflow: hidden; }`
`:host { height: 100dvh; }`
`.sdp-root { height: 100%; overflow: hidden; }`
Açò és meravellós per a la PWA (la plantilla blank.php de WordPress), però trencarà qualsevol pàgina on Sollutia vulga incrustar només una part de Sóc de Poble (per exemple, dins del seu propi contenidor, sota una capçalera de la Generalitat).
Com solucionar-ho: L'etiqueta `<soc-de-poble>` hauria d'acceptar un atribut `layout="embedded" | "fullscreen"`. En mode embedded, el `:host` no força 100dvh, sinó `height: 100%`, i permet a `main.app-main` deixar que el contenidor pare dicte les normes del scroll.

2. La Motxilla del Deute Cromàtic
`.design-guard-deute.json` és un xivat: encara hi ha 184 valors de colors en cru. Si demà Sollutia necessita adaptar els teus components a l'Alt Contrast del seu tema administratiu, el codi es resistirà perquè els components tenen "pintura" en línia i no utilitzen els tokens de `--sdp-`. Haureu d'aplicar la "Tornada del Picapedrer" (`cens_cromatic.mjs --pla`) per passar aquestes restes als `--sdp-text-titol` i similars.

3. Cancel·lació Eficient (Evitant un DDoS a Supabase/Sollutia)
Dins de `AppDataContext.jsx`, teniu temporitzadors que descarreguen dades. En l'entorn de l'editor de Gutenberg, quan modifiquen un bloc, WordPress no espera a destruir-lo. El desmunta i el remunta 10 voltes mentres el ratolí es mou. Heu d'assegurar-vos que dins del `useEffect` de `AppDataContext.jsx`, la funció de cleanup no només avorte l'AbortController, sinó que siga fulminant amb qualsevol crida de fetch a la xarxa pendent. En l'estat actual teniu el codi ben encarrilat, però assegureu-vos de no fer postMessage a BroadcastChannels des de components desmuntats.

✨ RESUM FINAL DE L'AUDITORIA:
Elimineu eines d'escriptura per a nosaltres. Canvieu-les per "Eines de Transacció" (Et done el contingut, tu poses el nom termodinàmic, crees el fitxer i m'ho ancores automàticament).
Esborreu el Sanador vell. Confieu 100% en l'ontologia del compilador v2 per a llegir orfes.
Flexibilitzeu el CSS del Viewport. Prepareu el component React perquè no siga tan agressiu apropiant-se de tota la pantalla del navegador si el host li ho demana.
