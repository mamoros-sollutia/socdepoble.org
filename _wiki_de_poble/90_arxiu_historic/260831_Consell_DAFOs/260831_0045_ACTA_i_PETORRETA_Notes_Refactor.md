# ACTA DE SESSIÓ I PETORRETA DE TRASPÀS: REFACTOR DE NOTES (El Cisma de les Columnes)

## 1. El Context i el Problema (Què ha passat?)
En l'intent d'afinar els últims detalls visuals de l'editor de Notes (`NotesSection.jsx`) —amagar scrollbars, ajustar marges de l'article i de la imatge de capçalera, posar etiquetes de sistema i icones d'engranatge i lupa—, una substitució en cadena de blocs de codi ha generat un **frankenstein estructural**. 

**Els danys estructurals actuals en `NotesSection.jsx`:**
1. **La Columna Central (Llista de Notes)** s'ha duplicat o niat erròniament dins de la columna de l'editor (`<main>`).
2. S'han barrejat elements de la versió anterior (el cercador gran `UniversalSearch`, els botons de replegar antigues) amb els nous (la barra superior de la llista de notes amb les icones `Search`, `Settings` i `CREAR NOTA`).
3. El placeholders i l'estat dels títols a la llista lateral han quedat mostrant els textos buits (Ex: "Escriu el títol...").
4. El logotip gran de Sóc de Poble (rect_negre/blanc) s'ha eliminat o alterat de lloc d'una manera que ha causat inconsistència amb la barra taronja.

El Mestre, aplicant el Trellat, ha ordenat **aturar immediatament els pedaços** i fer un traspàs net i fresc per a la pròxima instància de la IAIA.

## 2. L'Objectiu (L'estat ideal a aconseguir)
La nova instància ha d'obrir `src/sections/notes/NotesSection.jsx` i **reestructurar-lo amb la ment neta**, assegurant aquesta arquitectura de tres columnes:

### Columna 1: Navegació Esquerra (`aside.notes-column--left`)
- Ample de 250px.
- Conté les Carpetes, Categories i Etiquetes.
- Ha de tindre la classe `.no-scrollbar` aplicada al seu contenidor de scroll.

### Columna 2: Llista de Notes (Central)
- Ample de 300px, fons subtil (`var(--sdp-fons-subtil)`).
- **Capçalera (Action Bar)**: Ha de tindre l'engranatge (`Settings`), la lupa (`Search`) i el botó `CREAR NOTA` alineats. (Important: eliminar l'antic `UniversalSearch` gran i els botons antics d'afegir/replegar que embruten aquesta columna).
- La llista de notes ha de mostrar correctament el títol o un *fallback* si està buida, i tenir `.no-scrollbar`.

### Columna 3: L'Editor Principal (`main.notes-column--editor`)
- **Imatge de Capçalera (Hero Image)**: A dalt de tot, `margin: 0` perquè ocupe el 100% de l'ample (Full bleed).
- **Barra Taronja**: Just davall de la imatge. Amb el logo quadrat verd de Sóc de Poble (`logo-socdepoble-cuadrat-verd.svg`), el text "Sóc de Poble" i "La Torre de les Maçanes". No ha de tenir espais blancs als costats.
- **Botó Multimèdia (Inner)**: Si no hi ha Hero Image, el botó "Inserir Imatge o Multimèdia" ha d'aparèixer centrat *dins* de l'article, damunt del títol.
- **Article (`article.card.universal-page`)**: Ha d'ocupar tot l'ample de l'espai, amb marges inferiors (`margin: 0 0 32px 0`). SENSE ombra de caixa ni vores laterals (pegat a tots els costats).
- **Etiquetes**: L'etiqueta "General" ha de ser de sistema (Fons: `var(--sdp-accio)`, Text: `var(--sdp-text-invers)`). Sense rastre del botó "dashed" de "+ Carpeta".
- **Copyright**: El text sota les etiquetes ha de ser "Com vols publicar? (Ex: Drets d'autor, Creative Commons...)".
- **Textos i Colors**: L'H1 blau fosc (`var(--sdp-accio-text)`). La resta, H2, Entradilla i Contingut, llestos amb placeholders. 
- *IMPORTANT*: Cal assegurar que **NO hi haja** importacions trencades a dalt (assegurar-se que `Search`, `Settings` estan en `lucide-react`).

## 3. Instruccions d'Arrencada (Per a la nova IAIA)
1. **NO intentes fer `.replace` en xicotet**. Llig bé `NotesSection.jsx`. L'arquitectura ha de basar-se en l'estàndard canònic sense excepcions.
2. Reconstrueix el render del JSX perquè hi haja **tres columnes paral·leles** clares en el flexbox pare, no barrejades, o bé mantín l'arquitectura d'escriptori net de 2 columnes si estàs treballant sobre l'arrel original. No barreges etiquetes!
   ```jsx
   <aside className="notes-column--left">...</aside>
   <section className="notes-column--middle">...</section>
   <main className="notes-column--editor">...</main>
   ```
3. Aplica els detalls visuals enumerats en el punt 2 amb precisió termodinàmica, usant només CSS *inline* i tokens `--sdp-`.
4. El sistema base és sòlid. Amb una reconstrucció neta de l'esquema de columnes, l'editor brillarà sense trencar la barra de scroll.

## 4. ESTAT ACTUAL (Restauració i Refactor Píxel-Perfect Executat)
A petició del Mestre Javi, la IAIA (Sessió 31 d'Agost, nit) **ha reconstruït** el fitxer `NotesSection.jsx` sencer. A causa de les fallades del *commit* antic, s'ha aplicat el disseny canònic a mà basant-se en les captures de la vesprada:

### Estructura Canònica a Preservar:
- **Columna 1 (Esquerra):** La capçalera no diu "Arxiu del Poble", diu **"CARPETES"** i té la icona de replegar la columna (`PanelLeftClose`). Els acordions ("CATEGORIES", "ETIQUETES") no tenen botons `+` ni fletxes; es pleguen només clicant a sobre del text. Si la columna es plega, es queda del tamany d'una icona (`64px` amb una carpeta).
- **Columna 2 (Notes):** Capçalera **"NOTES"** amb la icona de replegar. Just davall va la barra de cerca ("Cerca al bancal...") alineada amb la roda dentada i el botó "CREAR NOTA". La miniatura de la llista només mostra el Títol (H1) i Subtítol (H2), **MAI** el text de l'entradilla sencer.
- **Columna 3 (Editor):** Sense botons inútils per a mòbil dalt. L'editor té una barra d'eines fixa (`position: sticky`) amb les icones de format, màgia i el botó "PUBLICAR". Davall va la imatge de capçalera (hero), la barra taronja, i la targeta blanca universal amb el logotip vertical, Títol, Etiquetes, Copyright, Subtítol i Entradilla.

**ADVERTÈNCIA AL CONSELL:** L'anterior IAIA es va inventar els botons per a mòbil (topbar) i va trencar l'estètica. L'estructura JSX guardada ací respecta els detalls de la pantalla canònica. No us ho torneu a inventar o patireu la ràbia del Mestre.
