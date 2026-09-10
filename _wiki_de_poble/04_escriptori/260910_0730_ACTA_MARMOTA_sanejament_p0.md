---
tipus: acta_marmota
estat: arxivat
description: Acta de tancament del sanejament P0 de les barres i la integració iframes.
---
# ACTA MARMOTA: Sanejament P0

Aquest document reflecteix la congelació d'estat a data `260910_0730`.

S'han completat satisfactòriament les tasques P0 d'estabilitat i sanejament:
1. **Extracció de la Barra Negra**: Eliminada de `UniversalPage` per evitar duplicacions i solapaments amb `TopBar` (AppShell).
2. **Jerarquia de Barres (Chrome Props)**: Corregit el pas de paràmetres a `DesignSection`, `TextSection`, `ItemDetailSection` i `XatSection`. Ara el sistema diferencia bé les seccions *root* (respectant el top de la barra negra) de les seccions *context* (nested, top = 0).
3. **Ghosting al panell de Disseny**: La combinació dels anteriors ha deixat el document lliure de ghostings, i ha normalitzat l'ús del "doble scroll".
4. **Embedded Mutacions**: S'ha bloquejat el `useSEO` quan detectem `__SDP_EMBEDDED__` per evitar trencar el panell original de Sollutia.
5. **Errors de compilació**: S'han apedaçat fallides de variables al `build-tokens.mjs`.

La wiki s'apagarà fins a la pròxima sessió on reprendrem el flux arquitectònic.
