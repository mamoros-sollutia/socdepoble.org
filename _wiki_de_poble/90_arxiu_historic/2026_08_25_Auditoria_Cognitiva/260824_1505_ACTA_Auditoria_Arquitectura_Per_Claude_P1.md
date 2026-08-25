---
**Ancoratge de Seguretat:** [[00_INDEX_ESCRIPTORI]]
---
# ACTA: SÍNTESI DE L'AUDITORIA INVERSA DE CLAUDE (PART 1)

**Data:** 24 d'agost de 2026 (15:05)

En resposta a la Petorreta d'Auditoria Global, el membre del Consell **Claude (Seient Núm. 5)** ha presentat un informe d'una precisió letal, havent compilat i desmuntat el codi realment. Ha identificat la **causa exacta del col·lapse d'ahir**.

## 1. La Causa del Col·lapse (P0-1 i P0-2)

1. **El Shim de JSX Destructiu (P0-1):** `src/shims/jsx-runtime.js` implementa malament la funció de React. Sobreescriu l'argument de la clau (`key`) amb els fills (`children`). Açò fa que tots els components dins de llistes (pobles, mercat, mur, xat) perden la seua identitat de reconciliació i es repinten de zero, desmuntant-ho tot contínuament.
2. **Mutació Cega de Codi (P0-2):** El script `tooling/brain/fix-inline.mjs` mutava text brut sense entendre l'AST de React. Això ha provocat que s'imprimisquen literalment 45 comentaris com a text visible (`// eslint-disable-next-line`) en 13 fitxers diferents, trencant la interfície visual. Més greu encara: **s'executa sense guarda, només per ser importat**.

## 2. El Diagnòstic de Govern (L'Escriptura Insegura)

Claude revela que el problema no és la qualitat del codi font, sinó la **Topologia d'Autoritat**:
- **Nucli de Seguretat Buit (P0-3):** Les eines a `safety.mjs` (`withRollback`, `withLock`) **mai s'invoquen**. Més encara, la funció anti-symlink falla estrepitosament amb un `ReferenceError` ofegat, deixant l'aplicació vulnerable a escriptures fora del directori arrel.
- **Portes Ignorades (P0-4):** El script `tractor-consell.mjs` llança falsos positius, fet que ha acostumat l'equip a ignorar-lo i fer builds per la força bruta, permetent que errors crítics passaren a producció.
- **Pre-commit Desenfocat (P0-5):** Audita el contingut Markdown de la Wiki, però no vigila el codi font (`src/`). 

## 3. Vulnerabilitats Greus Addicionals (P1)

- **Injecció XSS Confirmada:** A `NotesSection.jsx`, l'ús de `dangerouslySetInnerHTML` està lliure, sense `DOMPurify`.
- **Fuita de CSS:** `DesignSection.jsx` importa CSS sense `?inline`, pringant el DOM principal de WordPress de Sollutia i fallant al Shadow DOM.
- **Conflicte d'Especificació CSS:** L'ús de `@import` a `index.css` falla quan es carrega via `CSSStyleSheet.replaceSync()` (comportament crític a l'iPad A10 en Safari).
- **Caiguda a la Frontera d'Integració:** Una crida a `JSON.stringify` a `_recalcularConfig()` llançaria una excepció no capturada si hi haguera dependències circulars al DOM, trencant el contracte amb Sollutia.

---
**NOTA DE PROCEDIMENT:** Claude no ha pogut imprimir els 4 nous *skills* ni les solucions de pegats a causa del límit d'eixida del seu context. Estem **a l'espera de la Part 2** per rebre el script definitiu `tanca.mjs` (el coll de botella d'escriptura segura) i les seues 4 capacitats cognitives. No prendrem cap acció fins a completar aquesta recepció.
