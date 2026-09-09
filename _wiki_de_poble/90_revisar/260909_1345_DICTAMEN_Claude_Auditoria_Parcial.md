# 🛡️ DICTAMEN D'AUDITORIA — SÓC DE POBLE (PARCIAL)
**Auditor:** Claude
**Data:** 260909
**Nota:** 6,4 / 10

## 1 · EL QUE JA ESTÀ BÉ (i no s'ha de tocar)
- El triangle del contracte tanca. 31 mètodes.
- La Llei de l'Enxufabilitat es compleix de veres.
- `build:wp` existeix.
- La Llei de la Mida (58px) es compleix.
- `retall.js` és codi excel·lent.

## 2 · LA GRAN NETEJA — DEUTE DENUNCIAT
- **🔴 P0 · El botó «Nova Nota» crea notes invisibles:** `NotesList.jsx:54` crida `creaNota` sense `folderId`. Sortejat per `retall.js` però origen no arreglat.
- **🔴 P0 · XatSelection.css és mort:** Zero referències. Les classes no coincideixen amb `XatSection.jsx`.
- **🔴 noteFromMessages.js mort:** Avantpassat de `retall.js` mort.
- **🟠 6 Mòduls orfes:** `noteFromMessages.js`, `XatSelection.css`, `MyProfileSection.jsx`, `markdown.js`, `uuid.js`, `jsx-runtime.js`.
- **🟠 CSS mort:** 110 classes mortes a `index.css` (18%), incloent capa d'utilitats atòmiques tipus Tailwind.
- **🟠 Dependència morta:** `postcss-prefix-selector`.
- **🟠 Mètodes bessons:** `getRuntimeDataMode` i `normalizeDataMode`. També `DATA_SYNC_CHANNEL_NAME`.

## 3 · SINCRONITZACIÓ AMB SOLLUTIA I ELS TRACTORS
- **🔴 Porter de 58px desendollat:** `01_porta_pedra_seca_58px.mjs` no es crida.
- **🔴 Porter de cadena duplicat:** `tractor-cadena.mjs` corre la versió dolenta (regex) i la bona està òrfena i sense `export`.
- **🟠 Quatre noms de fitxer duplicats a tooling:** `run-portes.mjs`, `tractor-cadena.mjs`, `persona_router.mjs`, `sistema_nervios.mjs`.
- **🟠 Peticions redundants:** Canviar de tema/llengua refà la petició de xarxa per canvi d'identitat de `config`.
- **🟠 main.jsx:** Codi de desenvolupament no protegit per env.DEV dins l'artefacte WP.

## 4 · JUSTIFICACIÓ DE LA NOTA
**6,4 / 10.** Problema de runa i sondes no endollades, no d'estructura central.

## 5 · ORDRE D'ATAC
1. `NotesList.jsx:54` passar `folderId: 'f-notes'`.
2. Esborrar 6 mòduls orfes.
3. Definir `.xat-composer--seleccio`.
4. Endollar `01_porta_pedra_seca_58px.mjs`.
5. Promoure `tractor-cadena.mjs` a gates i posar `export`.
6. Treure `postcss-prefix-selector`.
7. Fusionar mètodes bessons contracte.
8. Memoritzar tema/llengua.
9. Protegir `#root`.
10. Purgar 110 classes CSS.

## 6 · PENDENT (Sopa de DOM i Schemas)
- Divs duplicats a `UniversalComponents.jsx` i `DesignSection.jsx`.
- `supabase/seed.sql`, `schema.sql`, `schema_notes.sql`.
- `tooling/wiki/` i `tooling/brain/`.
- `i18n.js`.
