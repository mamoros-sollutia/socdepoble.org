---
tipus: skill
estat: canonic
description: Estàndard d'arquitectura, anatomia i configuració de la UniversalPage de Sóc de Poble. Defineix l'estructura visual, el comportament del scroll i els blocs que la formen.
tags:
  - core
name: universal-page
triggers_on:
  - UniversalPage
  - chrome
  - bar-blue
  - page-header
core: true
---

# SKILL: UniversalPage — Anatomia i Comportament

Aquest manual defineix l'arquitectura i les regles inviolables de la `UniversalPage`, el component base per construir pàgines i vistes de lectura/edició dins de Sóc de Poble.

> [!IMPORTANT]
> **FONT DE VERITAT ÚNICA (Single Source of Truth):**
> L'única referència vàlida i òptima per copiar i replicar el codi de la `UniversalPage` (amb tots els seus blocs, filtres, targetes i estructura) és la pàgina oficial de Disseny: `src/sections/disseny/DesignSection.jsx`. Qualsevol IA o agent ha de consultar exclusivament el codi d'aquesta pàgina per entendre i reproduir la implementació canònica de la `UniversalPage`. Cap altra secció o component s'ha d'utilitzar com a referència.


## 1. Anatomia Estàndard (Els Blocs)

Una `UniversalPage` completa està formada pels següents blocs estratificats, que han d'aparèixer en aquest ordre i respectar aquestes regles de maquetació:

### A. La Barra Blava (`bar-blue`)
És el centre de control i navegació de la pàgina/document. Les accions atòmiques i la disposició es divideixen estrictament en tres grups:
- **Esquerra (Navegació):** Un trio d'icones compost per "Tornar arrere", "Tornar avant" i l'**Índex**.
  - *Regla Sagrada de l'Índex:* Aquest botó és fonamental. Evita haver d'omplir la pàgina de múltiples etiquetes `<h1>` per a separar contingut, permetent navegar per les subseccions (`<h2>`, `<h3>`). Això garanteix que **només hi haja un únic H1 per pàgina**, mantenint la puresa SEO i l'arquitectura d'informació.
- **Centre (Interacció):** Un trio d'icones centrat compost per "Traductor", "Comentar (Xat)" i "Compartir".
  - *Regla del Botó Comentar:* No obri cap fil de comentaris públics davall de la targeta. Funciona com un missatge directe: enllaça sempre al xat privat de l'autor o creador d'eixe contingut.
- **Dreta (Acció Principal):** El botó "Connectar".

> [!IMPORTANT]
> **Equivalència Atòmica (La Targeta i la Pàgina):**
> L'equivalent directe de la Barra Blava (`bar-blue`) en la versió reduïda del component és **el peu de la Targeta Universal (`UniversalCard footer`)**. Són atòmicament els mateixos elements. Les accions que s'afigen, canvien o s'eliminen a la Barra Blava s'han de reflectir exactament igual al peu de la Targeta Universal, i viceversa. Formen part del mateix sistema d'interacció.

### B. El Frame de Capçalera (Hero Image)
- **Amplària Completa (Full Width):** La imatge Hero (o element multimèdia equivalent) **ha d'ocupar el 100% de l'ample del contenidor**. NO té marge. NO té padding.
- **Adaptabilitat del Format:** El contenidor de l'element multimèdia s'adapta proporcionalment a les dimensions de l'arxiu. Encara que a les targetes habituals de "Pobles" s'acostumen a gastar imatges quadrades, el sistema suporta qualsevol format (com un foli A4 per a un document PDF o una foto panoràmica), ajustant l'altura automàticament sense deformar-lo.
- **Mode Edició i Placeholder:** Quan no hi ha imatge, o quan l'usuari fa clic damunt d'una imatge existent per a canviar-la, l'espai s'ha de transformar en un menú d'accions clares. Han d'aparèixer tres botons:
  1. **"Inserir Imatge o Multimèdia"**: Per pujar un arxiu nou o reemplaçar l'actual.
  2. **"Tornar enrere"** (només si ja n'hi ha una): Per a cancel·lar el mode d'edició sense modificar res.
  3. **"Esborrar contingut"** (només si ja n'hi ha una): Un botó d'alerta (roig) per a eliminar la imatge actual i deixar l'espai en blanc.

### C. La Barra Taronja (`bar-orange`)
- Conté l'autoria de l'usuari, el seu poble i la data/hora de la publicació.
- Igual que el Hero, **ha d'adaptar-se a l'ample complet** del contenidor, llevant qualsevol _padding_ global que la constrenya lateralment.
- **Injecció i Control (API `topBarData`):** La barra taronja és responsabilitat interna de `UniversalPage` i es mostra automàticament si el paràmetre `chrome` s'estableix a `"full"` o `"context"`. **Mai** s'ha de recrear manualment com a `children` del component, ja que això trenca l'ordre del DOM (els `children` van a parar dins del `.content-wrapper`, sota el títol H1).
- Per sobreescriure les accions de la dreta (per exemple, per afegir un selector de privacitat personalitzat com al Bloc de Notes), utilitza la propietat `topBarData={{ barActions: <ElTeuComponent /> }}` en compte de modificar l'estructura base o clonar el component.

### D. La Decoració de l'H1 (El Títol i l'Escut)
- **Imatge de Capçalera (Escut/Logo o Multimèdia):** Abans de l'H1, s'ubica una imatge de capçalera (com el logotip de l'autor institucional o una imatge pujada per l'usuari). Aquesta imatge està **estrictament limitada a un màxim de 600x600 píxeles**. El seu contenidor (`div`) s'ha d'adaptar proporcionalment a l'altura de la imatge i ha de tindre *padding* superior i inferior (respirar) perquè la imatge no quede xafada, centrada sempre horitzontalment.
- **Títol i Metadades:** Conté el títol principal (`H1`), les etiquetes (píndoles de categories com "Mur", "Sistema", "Manual") i el copyright.
- **Amplària Contenida:** A diferència del Hero i la Barra Taronja, tot aquest bloc decoratiu (incloent-hi la imatge de 600px i l'H1) **NO** pot ser d'ample complet. Ha de mantindre una amplària màxima centrada (per exemple, `max-width: 800px`) i estar enganxat per dalt a la barra taronja (sense padding superior extra en el contenidor principal de l'article) per garantir la llegibilitat i l'efecte decoratiu.

## 2. Comportament d'Incrustació (Embed Mode) i Scroll

La `UniversalPage` està dissenyada per a ser incrustada (embedded) com si fóra el document de contingut d'un editor (com ara dins del `NotesEditor`). 

- **Amplària adaptativa:** Quan s'incrusta com una columna més (ex: a la dreta de la llista de notes i de les carpetes), la barra blava NO ocupa de part a part de l'aplicació, sinó només de part a part del seu propi contenidor (l'editor de notes). Així s'evita xafar l'espai de navegació lateral.
- **Zero Doble Scroll i Barres no fixes:** A diferència de la pàgina completa (on les barres blava i taronja es queden fixes a dalt, sent *sticky*), en mode incrustat **la barra blava i la barra taronja s'han d'amagar de forma natural a través de l'scroll del propi document incrustat**. Quan l'usuari desplaça cap avall la nota, tant la barra blava com la taronja pugen i s'amaguen, alliberant tot l'espai vertical i fixant l'atenció exclusivament en l'edició del contingut. Aquesta és l'única excepció de comportament d'una UniversalPage incrustada respecte a la versió independent.

## 3. L'Entorn d'Edició (Foraster vs. Connectat)
Quan un usuari ("Foraster") fa proves en un bloc de notes, està interactuant visualment amb una `UniversalPage`. Tot i que no estiga autenticat i la nota "desaparega" després, la UI ha de tindre una anatomia idèntica a la versió publicada per garantir consistència mental i anticipació del resultat.

## 4. Sistema de Classificació (Carpetes, Categories i Etiquetes)
Tota Targeta i Pàgina Universal (`UniversalPage`) exposa de manera prominent els seus metadades de classificació mitjançant píndoles (badges) sota el títol principal (H1). L'estructura semàntica i interactiva segueix sempre el següent patró estricte, renderitzant-se en aquest ordre:

1. **La Carpeta (Sistema):** És el contenidor lògic on s'arxiva el document (ex: *Mur*, *Mercat*, *Pobles*, *Esdeveniments*).
   - Estil: Fons blau fosc (`sdp-badge-system`).
   - Comportament: Si l'usuari la clica (`onClick`), ha de filtrar/navegar cap al contingut d'eixa carpeta (ex: `handleSelectFolder`).
2. **La Categoria Temàtica:** Classifica el document dins d'un àmbit temàtic transversal (ex: *Sistema*, *Productivitat*, *Manual*).
   - Estil: Fons blau clar/grisenc (`sdp-badge-category`).
   - Comportament: Al fer-hi clic, ha de filtrar i mostrar només els documents d'eixa categoria en l'àmbit actual (ex: `handleSelectCategory`).
3. **Les Etiquetes (Tags):** Definicions lliures o semàntiques del contingut (ex: *Tutorial*, *Notícia*, *Vibe*).
   - Estil: Fons taronja suau corporatiu (`sdp-badge-tag`).
   - Comportament: Clicables. Filtren el llistat per paraules clau específiques (ex: `handleSelectTag`).

*Regla de disseny visual:* Cap píndola decorativa s'ha de duplicar (ex: si el context ja es troba a la Carpeta "Mur", no s'afegeix un badge idèntic "Mur" com a Categoria). Cada element visual compleix el seu rol estricte dins del DOM de la UniversalPage per facilitar el filtratge de dades.
