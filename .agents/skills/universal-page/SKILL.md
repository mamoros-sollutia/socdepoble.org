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

## 1. Anatomia Estàndard (Els Blocs)

Una `UniversalPage` completa està formada pels següents blocs estratificats, que han d'aparèixer en aquest ordre i respectar aquestes regles de maquetació:

### A. La Barra Blava (`bar-blue`)
És el centre de control i navegació de la pàgina/document. Les accions es divideixen en tres grups:
- **Esquerra:** Tornar arrere, Tornar avant, **Índex**.
  - *Regla Sagrada:* El botó d'Índex és fonamental. Gràcies a ell, no cal omplir la pàgina de múltiples etiquetes `<h1>` per a separar contingut. L'Índex navega per les seccions internes, garantint que **només hi haja un H1 per pàgina**, complint de manera estricta amb l'estàndard SEO i d'arquitectura d'informació de Sóc de Poble.
- **Centre:** Traduir, Comentar (Xat Privat), Compartir.
- **Dreta:** Botó Connectar.

### B. El Frame de Capçalera (Hero Image)
- **Amplària Completa (Full Width):** La imatge Hero (o element multimèdia equivalent) **ha d'ocupar el 100% de l'ample del contenidor**. NO té marge. NO té padding.
- Si en algun moment hi ha un padding lateral fantasma (p. ex. 40px), s'ha d'eliminar exclusivament per a la imatge Hero, permetent-li tocar les vores de la pantalla o del panell de l'editor. L'altura serà proporcional.

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
