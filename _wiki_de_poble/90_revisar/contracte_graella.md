---
tipus: contracte
estat: canonic
description: Contracte del Framework de Graella (AppGridShell i AppGridColumn)
porta: porta:graella
---
# Contracte del Framework de Graella

> **Anclatge**: pertany a l'[[00_INDEX_ESCRIPTORI]]. Verificat per
> `tooling/gates/tractor-graella.mjs` (`npm run porta:graella`).

Esta fitxa no és prosa il·lustrativa. Cada taula d'ací baix la compara una
porta amb la signatura real del component. Si divergixen, el build cau. És
la diferència entre saber i fer: `disseny_pedra_seca.html` porta 3.146
línies que ningú comprova, i per això la petorreta del 04/09 afirmava que
les columnes s'amaguen amb `data-visible` quan `data-visible` no existix
enlloc del repositori.

## Què és

Una graella de tres columnes reutilitzable. Substituïx la lògica que vivia
dins de `NotesSection`. La fan servir el Bloc de Notes i el Gestor de
Perfils, i qualsevol secció futura amb forma de *navegador → llista →
detall*.

## Les tres disposicions

Es decidixen mesurant el contenidor, **no** la finestra: dins de WordPress
i del Shadow DOM la finestra menteix.

| Disposició | Amplada del contenidor | Què es veu |
|---|---|---|
| `ample` | `>= 1090px` | Les tres columnes alhora. Sense pestanyes. |
| `mitja` | `720px` – `1089px` | Llista + detall. L'esquerra se superposa. |
| `estret` | `< 720px` | Una columna. Pestanyes dalt. |

Els valors `720px` i `1090px` són els mateixos que la porta llig
d'`AppGridShell.jsx`. Canviar-ne un sense tocar l'altre fa caure el build.

## AppGridShell

| Prop | Tipus | Per a què |
|---|---|---|
| `children` | node | CSS de la pàgina injectat abans de la graella. |
| `leftColumn` | node | Columna de navegació (carpetes, identitats). |
| `middleColumn` | node | Columna de llista (notes, ajustos). |
| `rightColumn` | node | Columna de detall. Mai es desmunta. |
| `leftTitle` | string | Text de la pestanya esquerra en compacte. |
| `middleTitle` | string | Text de la pestanya central en compacte. |
| `initialPane` | `'left'\|'middle'\|null` | Panell obert al muntar. |
| `aria-label` | string | Nom accessible de la graella. |
| `className` | string | Ganxo de la pàgina amfitriona. |

### El que AppGridShell **no** fa

- No sap què és una carpeta, una nota, una etiqueta ni una organització.
- No crea res. No guarda res. No navega.
- No desmunta cap columna: per això no es perd ni el cursor ni el scroll.

### El que sí ha de fer, i la porta ho comprova

Una columna desplaçada amb `translateX(-100%)` continua sent focusable.
Les columnes tancades porten `inert` i `aria-hidden`. Sense això, tabular
des de l'editor et fica dins de columnes que no es veuen.

## AppGridColumn

Capçalera única de columna. Substituïx les quatre implementacions
escampades que hi havia (`notes-column-header`, la variant `--collapsed`,
la variant `--accordion` i `perfil-columna-capcalera`). Cap fitxer fora
d'ací pot tornar a escriure una capçalera a mà: la porta ho detecta.

| Prop | Tipus | Per a què |
|---|---|---|
| `titol` | string | Nom de la columna. |
| `icona` | component | Icona opcional al costat del títol. |
| `accions` | array | Botons d'acció. Vegeu el contracte de baix. |
| `plegable` | bool | Mostra el chevron d'acordió. |
| `obert` | bool | Estat de l'acordió (`aria-expanded`). |
| `onPlega` | function | Plega o desplega l'acordió. |
| `onReplega` | function | Replega la columna sencera (escriptori). |
| `variant` | `null\|'accordion'\|'collapsed'` | Forma de la capçalera. |
| `children` | node | Extres a la dreta (menús, comptadors). |

### Contracte de `accions` — el botó «+»

```js
{ id, icona, etiqueta, onAcciona, desactivat }
```

Ordre visual imposat: `[plec] TÍTOL … [+] [replegar]`.

Tres regles, i les tres tenen motiu:

1. **`onAcciona` es crida sense arguments.** Si es passara l'event del DOM,
   arribaria com a càrrega útil a l'acció del domini. Va passar mentre
   s'escrivia este component: la primera organització creada eixia amb el
   nom buit perquè rebia un `PointerEvent` en compte de les dades.
2. **Sense `onAcciona`, el botó ix `disabled`.** Un botó que no fa res ha
   de dir-ho. Al codi ja hi ha cinc botons muts (dos «Cercar», «CREAR
   NOTA», les etiquetes del sidebar i el cadenat taronja de l'editor); no
   se n'afig cap més.
3. **`AppGridColumn` no interpreta l'acció.** Qui sap del domini és la
   columna. Si demà el «+» ha de crear una empresa en compte d'una carpeta,
   ací no es toca res.

### Zona tàctil

El cercle en pinta 32px, però un pseudo-element `::after` de
`var(--sdp-touch-min)` (44px) li dóna la zona tàctil de la Llei de Vida
sense inflar l'alçada de la capçalera.

## Estat de les accions per columna

La porta no ho comprova encara, però convé tindre-ho escrit:

| Columna | Acció «+» | Camí al backend | Es pot pintar? |
|---|---|---|---|
| Identitats | Crear empresa o grup | `createOrganization` → `rpc/create_organization` | **Sí** |
| Ajustos | — | — | No en cal |
| Carpetes | Crear carpeta | **cap** | **No** |
| Notes | Crear nota | **cap** (`createNote` no existix a cap capa) | **No** |
| Etiquetes | Crear etiqueta | **cap** | **No** |

La taula `public.notes` sí que té política d'`insert` a
`supabase/schema_notes.sql:59`. El que falta és el camí
`NotesContext → backendPort → supabaseBackend`. Fins que existisca, el
«+» de les tres columnes de notes seria un botó mut més.
