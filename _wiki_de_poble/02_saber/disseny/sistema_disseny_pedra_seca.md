---
tipus: norma
estat: esborrany
description: Mapa del sistema de disseny Pedra Seca (catàleg viu a /disseny, components canònics i portes que el vigilen).
---

# Sistema de disseny Pedra Seca · mapa

El catàleg viu és a `/disseny`, que redirigix a `/jo/disseny`. Cada pàgina s'obri amb `?pagina=…`. Aquest document no repetix el catàleg: diu on està cada cosa i quina porta la vigila.

## Pàgines del catàleg

| Pàgina | Fitxer | Conté |
|---|---|---|
| Fonaments | `src/sections/disseny/DesignSectionContent.jsx` | Lleis, color, tipografia, espaiat, targeta mestra. Encara hi ha maquetes heretades. |
| Estructura | `cataleg/PaginaEstructura.jsx` | UniversalShell (bastida), UniversalPage (crom), gestor de tres columnes, Divisor. |
| Formularis | `cataleg/PaginaFormularis.jsx` | Boto, Camp, CampText, AreaText, Selector, Casella, GrupOpcions, GrupCamps, Interruptor, PillToggle, UniversalSearch, i un formulari complex de referència. |
| Diàlegs i calaixos | `cataleg/PaginaSuperposicions.jsx` | Dialeg, DialegConfirmacio, calaix, Pista, Dropdown, showToast. |
| Estats i avisos | `cataleg/PaginaRetroalimentacio.jsx` | Alerta, Insignia, EstatBuit, Carregant, Esquelet, Progres. |
| Navegació | `cataleg/PaginaNavegacio.jsx` | Pestanyes, MollaPa, Paginacio, Accordion, barra mòbil. |
| Inventari | `cataleg/PaginaInventari.jsx` | Registre complet amb estat (viu, maqueta, extern, obsolet) i deute de migració. |

## Anatomia de cada fitxa

Totes les fitxes segueixen el mateix ordre, dins d'`Especimen.jsx`:

1. Nom i fitxer.
2. Per a què serveix.
3. **Espècimen viu.** És el component real, mai HTML de mostra.
4. Contracte (props).
5. Accessibilitat.
6. Fes / no facis.

## Lleis del catàleg

- **Un component de `src/components/ui/` sense fitxa no existix.** La porta `tractor-cataleg` (C1) falla.
- **«Viu» vol dir renderitzat.** Una entrada viva que cap pàgina importa fa fallar la porta (C2).
- **CSS només en tokens semàntics**, dins de `@layer components` (`src/css/components.css`). El tema fosc funciona sense regles extra.
- **Controls natius primer.** `<dialog>`, `<progress>`, `<fieldset>`, `<select>`. No reinventem accessibilitat.
- **Cap selector soldat.** Ho vigila la porta de soldadura del pedaç de Codex.

## Decisions de normalització (260911)

- **Botons.** `sdp-boto--*` és l'únic vocabulari; `UniversalButton` queda obsolet. La Gestoria ja escrivia `sdp-boto`, `sdp-insignia`, `sdp-camp` i `sdp-control` sense CSS. Ara estan definides.
- **Alertes.** Només `error` usa `role="alert"`. `sdp-alerta--ok` queda com a àlies d'`--exit`, perquè el token es diu `--sdp-exit`.
- **Tooltips.** `title=` es substituïx per `Pista`, perquè en pantalla tàctil `title=` no existix.
- **Modals.** Són `<dialog>` natiu. En mòbil es mostren com a full inferior. En destructius, el focus va a Cancel·lar.

## Deute obert

- Hi ha 11 seccions amb `<input>` fets a mà, que han de migrar a `<Camp>`.
- Les maquetes de Fonaments (`.badge-*`, `.avatar-*`, `.tabs`, `.modal-box`, `.progress-fill`) no tenen component.
- Les regles sense capa d'`index.css` guanyen a `@layer components`. Exemple: el títol del diàleg ix taronja per una regla global d'`h2`.
- `@layer components` no és a la declaració d'ordre de capes.
