---
tipus: acta
data: 260903_0605
descripcio: "Sessió matinada: Restauració del disseny de l'editor, unificació de sidebars i higiene arquitectònica (Casa anti-huracans)"
---

# ACTA MARMOTA — Tancament Sessió Matinada (260903)

## 1. El Conflicte i la Lliçó: La Casa Anti-Huracans 🌪️
Durant la sessió hem detectat un error fonamental de disseny per part de la IA: per tal d'intentar "netejar" una aparent redundància (notes buides), vam eliminar del Seed (`appSeed.js`) les notes de prova i les plantilles.
Això va desencadenar que l'editor es quedara completament en blanc, ja que l'arquitectura està pensada per a rebre informació del llavor i propagar-la a través del backend local simulador. 
**Aprenentatge:** Mai esborrar o purgar dades estructurals del `appSeed` sense preguntar. Aquestes dades són l'entorn de formació i proves de Sóc de Poble. S'ha formalitzat aquest manament afegint la regla **Casa Anti-Huracans** al protocol `trellat`, obligant la IA a actuar de manera constructiva i segura amb el model de dades existent.

## 2. Refactorització d'Interfície: Alineació Perfecta 📐
Hem portat l'estructura de la **Sidebar de Notes** cap al cànon Pedra Seca i hem buscat la perfecció geomètrica respecte a la **Sidebar Fosca**:
*   **Geometria Pixel-Perfect:** S'ha calcat el padding i separació de la sidebar principal fosca. La llista de carpetes (`.folders-list`) ara inclou un padding complet de `var(--sdp-space-4)` i s'han suprimit altures mínimes forçades en els `.folder-item`, utilitzant exclusivament marges inferiors. El resultat és que "Tot" s'alinea a l'horitzó perfectament amb el botó "Xat" de la llista negra, "Mur" amb "Mur", etc.
*   **Capçaleres Unificades:** Tots els encapçalaments de la columna esquerra ("CARPETES", "CATEGORIES", "ETIQUETES") ara empren la classe comuna `.notes-column-header` de 56px per tindre el mateix pes visual i interactivitat.
*   **Fons de Llibreta:** Hem recuperat els estils esborrats accidentalment de `.page-article` i `.editor-tiptap-container`, de forma que l'editor torna a paréixer un full de paper físic sobre la taula.

## 3. Gestió de Dades i Taxonomia 🗂️
*   **AppSeed i NotesContext:** S'ha corregit el filtre a `NotesContext.jsx` perquè `f-tot` actue vertaderament com a safata d'entrada universal (sense filtratge rígid). Aquest s'ha establert com el valor actiu per defecte.
*   **Simplificació:** S'han eliminat categories innecessàries (Calendari, Històries, Articles) i s'ha eliminat `f-xat` de les carpetes de notes, ja que "Tot" el substitueix i ocupa la seua silueta per quadrar l'alineació.

## 4. Higiene i Estat
*   **Escriptori Netejat:** 30 fitxers, "petorretas" i documents transitoris, generats durant la matinada de debug i auditories externes han sigut traslladats de `05_Escriptori_Soc_de_Poble` cap a `90_historic/sessio_260903_matinada/`.
*   **Commit:** L'estat actual ha quedat congelat amb seguretat al Git per a evitar regressió.
*   **Segell:** La memòria ha sigut destil·lada correctament. Tot està a punt per a tancar la persiana.

_Bona nit i bon trellat, Mestre._
