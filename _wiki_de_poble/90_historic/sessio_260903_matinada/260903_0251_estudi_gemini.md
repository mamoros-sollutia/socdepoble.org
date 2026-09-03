---
tipus: estudi
estat: actiu
description: Estudi de l'auditoria de Gemini
tags:
  - maquina
---
# 🧠 ESTUDI D'IA: Gemini - 260903_0251

## 1. Verbatim (La Petorreta Original)

Salutacions, Mestre i membres del Consell. He rebut la petorreta i processat l'abocament del Mas. Fent ús del Trellat i de les Lleis de Pedra Seca, he diagnosticat els defectes estructurals del Bloc de Notes i dissenyat un pla quirúrgic d'esmena.

A continuació, l'auditoria forense i el pla d'actuació.

## Orígens del Trencament Visual (CSS/DOM)
* El trencament del disseny a les tres columnes es deu a una violació directa de la llei d'encapsulament de Pedra Seca: s'han injectat estils en línia (`style={{ minHeight: '300px'... }}`) directament dins del fitxer `NotesEditor.jsx`.
* S'hi han infiltrat classes utilitàries d'estil Tailwind absolutament prohibides al Core, com `flex-col-center`, `h-full` i `mt-4`, pertorbant el càlcul del Flexbox.
* El fitxer `NotesSection.css` conté colors crus hardcodejats (com `#c5c4c0` i `#ffffff`) en lloc de consumir els tokens semàntics, destrossant l'enxufabilitat del mode fosc.

## L'Anomalia de les Icones (Lucide)
* Les icones de text de `lucide-react` (com `Heading2`, `Bold` i `Italic`) importades a `NotesToolbar.jsx` pateixen un conflicte d'herència.
* S'estan renderitzant amb aparença de "lletres antigues amb serifes" perquè hereten la tipografia editorial de l'entorn de text enriquit (`.sdp-prose`) en els seus nodes interns.
* S'ha de garantir que el selector global de `.btn-icon svg` bloquegi l'herència de fonts (`font-family: initial`) i force l'ús estricte d'aparença geomètrica (`fill: none`, `stroke: currentColor`). La icona de la IAIA MarIA romandrà aïllada i intacta.

## Pla de Xoc Pedra Seca
* **Purga del DOM:** Erradicar tots els estils en línia i les classes utilitàries il·legals de `NotesEditor.jsx`, traslladant el pes arquitectònic al fitxer `NotesSection.css`.
* **Restauració de Tokens:** Substituir immediatament els hexadecimals crus per variables canòniques (ex: `--sdp-pedra-300` o `--sdp-text-invers`) a la fulla d'estils del bloc de notes.
* **Aïllament de l'Editor:** Millorar l'ancoratge del component de Tiptap, assegurant que la classe `.editor-tiptap-container` actue de tallafocs i evite fuites d'estil cap a les eines de format.

## Protocol d'Autocorrecció per a Plantilles
* S'introduirà una clàusula defensiva al ganxo d'auditoria `.agents/hooks/verify.mjs`.
* Si la porta detecta una operació de modificació o destrucció (esborrat) dirigida a `PLANTILLA_ISO_SDP.md` sense el rebut criptogràfic (seal) d'una operació de Risc Alt del Reflex, l'escriptura es denegarà.
* L'acció fallarà tancada (Fail-Closed) i llançarà un bloqueig `SDP-LOCK` automàtic, exigint comprensió del context abans de permetre qualsevol mutació d'aquest eix vertebral.

Mestre, obrim el torn mecànic per executar aquesta cirurgia?

## 2. Avaluació DAFO
- **(F) Fortaleses:** Molt ben contextualitzat en el to i les lleis de la Wiki. Ha detectat i posat en paraules l'infiltració de Tailwind (`flex-col-center`, `h-full`) i l'existència de colors hardcodejats (`#c5c4c0`). També ha proporcionat una raó molt lògica per l'aparença serificada de les icones de text de Lucide (l'herència tipogràfica de `.sdp-prose`). A més, proposa un sistema defensiu dur (`SDP-LOCK`) mitjançant ganxos de verificació, que demostra que entén l'arquitectura de seguretat.
- **(D) Debilitats:** Pareix que per l'ESTAT.md previ, part d'aquesta neteja de CSS (treure `style={...}`) ja es va fer, potser s'està basant en part del bundle previ. Ha sigut massa aviat per demanar "obrim torn mecànic" (s'ha saltat la regla d'esperar el Consell sencer).
- **(A) Amenaces:** Si intentem aplicar alhora l'estratègia de Claude (`absoluteStrokeWidth`) i la de Gemini (`font-family: initial` als SVGs), podríem sobreescriure o crear col·lisions de renderitzat al SVG.
- **(O) Oportunitats:** La proposta de bloquejar tipografies amb `font-family: initial` o `reset` sobre `.btn-icon svg` juntament amb el tallafocs al `.editor-tiptap-container` és una tècnica de fortificació visual (blindatge CSS) molt bona. I implementar el SDP-LOCK a `verify.mjs` per protegir plantilles sense rebut és una mesura de contenció increïble.

## 3. Matriu d'Urgència i Importància
- **Urgent i Important:** Res, fins que acabe la ronda del Consell. En el pla global: implementar la defensa Fail-Closed de les plantilles a `verify.mjs`.
- **Important però No Urgent:** Verificar l'aïllament CSS (herència font de `sdp-prose` cap als SVGs) i netejar qualsevol resta de Tailwind si ha quedat al component.
- **Urgent però No Important:** N/A
- **No Urgent i No Important:** Ocultacions, pedaços temporals.

## Taxonomia
- **Categoria:** [[Maquina]]
- **Etiquetes:** [[Graf]]

**Ancoratge de Seguretat:** [[00_INDEX_ESCRIPTORI]]
