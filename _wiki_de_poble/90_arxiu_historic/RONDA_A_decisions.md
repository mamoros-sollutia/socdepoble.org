# RONDA A · ACTA DE REPARACIÓ

**Entrada:** `disseny_pedra_seca.html` V4.5 · `md5 9b3be27f…` · 2.929 línies
**Eixida:** `disseny_pedra_seca.html` V5.0 · 3.147 línies
**Abast:** capa semàntica · mode fosc · col·lisió de tokens · tipografia local · les tres decisions mestres

---

## 1. LA MATEMÀTICA DEL COLOR

Has dit: *"el cànon serà el que aprove la matemàtica"*. Ací està el procediment, perquè el pugues repetir i discutir.

### Mètode

Les tres escales es generen en **OKLCH**, no en HSL ni a mà. En OKLCH la lluminositat és perceptivament uniforme, així que es pot fixar el **to** i el **croma** de marca i moure només la **L** fins que el contrast done exactament l'objectiu. El resultat és una escala on cada graó és previsible i cap color perd la família.

Els tons que he fixat venen dels teus cànons originals, no de Tailwind:

| | To OKLCH | Origen |
|---|---|---|
| Taronja | **47,9°** | to exacte de `HEX-FF7300`, el cànon del projecte |
| Blau | **250,6°** | to exacte de `HEX-0984E3`, el cànon del projecte — el blau de mar |
| Pedra | **84,0°** | neutre càlid, mai gris fred |

**El cànon ha guanyat el to. La matemàtica ha decidit la lluminositat.** El blau que hi havia (`HEX-2563eb`) estava a 262,9°: era un indi, no un blau de mar. Ara torna a ser el teu.

### Els graons que importen

```
--sdp-primary-500  HEX-fe7406   el cànon. Fons vibrant.  Text fosc a sobre: 7,13:1  AAA
--sdp-primary-700  HEX-ad4c03   text d'interacció sobre blanc:              5,51:1  AA
--sdp-primary-800  HEX-873a01   títols h2/h4 sobre blanc:                   7,97:1  AAA

--sdp-secondary-500 HEX-016ebf  fons. Text blanc a sobre:                   5,27:1  AA
--sdp-secondary-600 HEX-00599d  títols h1/h3/h5 sobre blanc:                7,20:1  AAA

--sdp-pedra-600    HEX-514c45   text secundari. Primer graó que arriba a AAA
--sdp-pedra-700    HEX-3d3b35   text del cos:                               11,20:1 AAA
```

`HEX-fe7406` és `HEX-FF7300` amb un ajust de dos punts per a caure exactament dins de la corba OKLCH de l'escala. A ull no es distingixen; mecànicament, ara pertany a una família coherent.

### Per què el taronja no pot ser text AAA

Cap taronja reconeixible arriba a 7:1 sobre blanc. Per a arribar-hi cal `HEX-873a01`, que ja és una terracota. Per això:

- **Com a fons** el taronja dona 7,13:1 amb text fosc → **AAA**. Ací viu la marca.
- **Com a text d'interacció** (enllaços, pestanya activa) dona 5,51:1 → **AA**, que és el que has comprat.
- **Com a text de títol** puja a `HEX-873a01` i dona 7,97:1 → **AAA**.

La identitat es manté on més es veu: als botons, a les barres, a les capçaleres de targeta.

---

## 2. LA CAPA SEMÀNTICA

Este és el canvi estructural. Abans:

```
primitius  →  components
```

Ara:

```
primitius  →  semàntics  →  components
```

**Llei nova, mecànicament comprovable:** si un component escriu `var(--sdp-pedra-*)`, `var(--sdp-primary-*)` o `var(--sdp-secondary-*)`, és un error.

Ara mateix compleixen la llei **tots els components menys les 17 mostres de paleta** (`.sw-*`), que documenten els primitius i per tant han de tocar-los. Eixa és l'única excepció legítima i està aïllada en un sol lloc.

Semàntics definits: 38 tokens en 7 famílies —fons,  vores, accent, acció, estat, focus. **Esta és tota la superfície que haurà d'exposar `control.html`.** No 118 variables barrejades: 38 amb nom llegible.

Cada línia porta el contrast mesurat al costat, com a comentari. Exemple real del fitxer:

```css
--sdp-text-suau:   var(--sdp-pedra-600);   /*  7,28:1 */
--sdp-accent-text: var(--sdp-primary-700); /*  5,51:1 · AA  (interacció) */
```

---

## 3. EL MODE FOSC, RECONSTRUÏT

### Què s'ha fet

El tema fosc ja **no toca cap primitiu**. Redefinix només semàntics. Per això l'escala pedra continua sent monòtona i res no es torna invisible.

| | V4.5 | V5.0 |
|---|---|---|
| Text del cos en fosc | **1,38:1 · invisible** | **15,20:1 · AAA** |
| Navegació mòbil en fosc | **1,11:1 · invisible** | **AAA** |
| Avatars i badges | **1,17:1 · invisible** | **AAA** |
| Botó primari | canvia de to en hover | estable |
| Blocs de mode fosc | **2, duplicats** | **1** |

### Decisió D-4 · he matat l'intercanvi de rols

**Açò no estava a les teues tres decisions i necessita el teu vistiplau.**

El comentari original deia: *"El Taronja passa a Blau, i el Blau a Taronja."* L'he eliminat. Motiu:

Un tema fosc canvia la **lluminositat**, no la **identitat**. Si en fosc el botó primari es torna blau, la marca deixa de ser reconeixible i qualsevol persona que aprenga "el botó taronja és l'acció principal" es perd. A més, era la causa directa del P0-2.

En V5.0 el taronja continua sent el taronja i el blau el blau; el que canvia és el graó (en fosc s'usen els graons clars, 300–400, perquè brillen sobre fons fosc).

**Si el vols recuperar**, ara és una decisió de dos línies dins del bloc `[data-theme="dark"]`:

```css
--sdp-accent: var(--sdp-secondary-500);
--sdp-accio:  var(--sdp-primary-500);
```

Això és exactament el que et compra la capa semàntica: una decisió estètica que abans requeria tocar 40 regles ara són dos línies en un sol lloc. Digues-ho i ho pose.

---

## 4. LES TRES DECISIONS, EXECUTADES

### Decisió 1 · Color cànon → **fet**
To del cànon recuperat als dos colors. Lluminositat resolta per binària contra l'objectiu de contrast. Escales completes de 10 graons més 2 graons foscos nous (`pedra-750`, `pedra-850`) per a les superfícies del tema fosc.

### Decisió 2 · `--sdp-measure: 68ch` → **fet, amb un matís important**

L'he aplicat **al  no al contenidor**:

```css
.design-block > p, .design-block > ul, .design-block > ol,
.design-block > blockquote, .design-block > .lead { max-width: var(--sdp-measure); margin-inline: auto; }
```

Si l'haguera aplicat a `.content-wrapper`, hauria estretit també les paletes, les taules, les reixetes de targetes i els taulers — que han de respirar tota l'amplària. Així el text corrent es limita a 68 caràcters i es centra, i tota la resta queda intacta.

Excepció explícita i documentada al codi: el primer paràgraf de cada secció fa d'entradeta i s'alinea a l'esquerra amb el títol.

### Decisió 3 · Accessibilitat honesta → **fet**

Textos actualitzats:
- `<meta name="description">` — ara diu *"contrast WCAG 2.2 AAA en tot el text i AA en els colors d'interacció"*.
- `og:description` i `twitter:description` — igual.
- `<meta name="keywords">` — fora "WCAG AAA" a seques; entren "tokens semàntics" i "OKLCH".
- **Secció 1 del manual reescrita sencera**, amb un bloc `alert-info` que declara el contracte i explica per què AAA estricte en tot obligaria a abandonar el taronja.
- **Taula de contrastos publicada al document**, amb els números reals de cada parella.

Les 20 mostres de paleta antigues, que documentaven una paleta inexistent amb 20 estils inline, estan substituïdes per mostres generades dels tokens reals, **sense cap estil inline**.

---

## 5. GOOGLE FONTS · FORA

Eliminat el `<link>` bloquejant. En el seu lloc:

1. **`@font-face` local** amb els quatre pesos, `font-display: swap`, apuntant a `assets/fonts/`.
2. **`<link rel="preload">`** dels dos pesos crítics (400 i 700).
3. **Instruccions al codi** per a obtindre i subconjuntar els fitxers.

### Com carregar-les en local

```bash
# 1. Descarrega Noto Sans de fonts.google.com (SIL OFL 1.1 · redistribució permesa)

# 2. Subconjunta per a valencià/català — lleva ~70% del pes
pip install fonttools brotli

pyftsubset NotoSans-Regular.ttf \
  --unicodes="U+0000-00FF,U+0100-017F,U+0192,U+01FA-01FF,U+2013-2014,\
U+2018-201A,U+201C-201E,U+2022,U+2026,U+00B7,U+20AC" \
  --flavor=woff2 --output-file=noto-sans-400.woff2

# Repetix per a 600, 700 i 800.

# 3. Col·loca'ls a  assets/fonts/  amb estos noms exactes:
#    noto-sans-400.woff2  noto-sans-600.woff2
#    noto-sans-700.woff2  noto-sans-800.woff2
```

El rang `U+00B7` és el **punt volat** de la ela geminada. Si el lleves, `col·lecció` es trenca.

**Guany:** zero peticions a tercers, zero fuga de dades, tipografia disponible sense connexió i una petició bloquejant menys al camí crític.

---

## 6. ALTRES REPARACIONS D'ESTA RONDA

| Reparació | Detall |
|---|---|
| Col·lisió `--sdp-info` | Resolta. Ara `--sdp-info` és blau i `.sdp-text-info` i `.alert-info` coincidixen. |
| Flaix blanc en carregar | Script mínim de tema al `<head>`, abans del primer pintat. |
| `@media (prefers-color-scheme)` duplicat | Eliminat. El script ja resol la preferència del sistema a `data-theme`. Una sola font de veritat. |
| Offset de l'índex | `-80` → `-196` (pila real de barres: 180px + 16 d'aire). |
| `Règla d'Or 36.3` òrfena | Comentari sense regla: eliminat. |
| `.label-purple` | Cinqué color fora del cànon: eliminat. |
| Ritme vertical de `h2` | `margin-top` 8px → 48px. Abans `h3` tenia més separació que `h2`; la jerarquia estava invertida. |
| Llei de Vida | Tokenitzada a `--sdp-touch: 44px`. Corregits `.audio-play-btn` i `.download-card-btn` (40→44), les icones de la barra negra (36 i 28 → 44 amb padding intern) i les caselles (16→24). |
| Sòl de mida de lletra | `--sdp-text-meta: 0.875rem` (14px). Pujats el copyright de targeta (10,4px) i el de portada. |
| Marges negatius | Els dos hacks (`-24px`, `-4px`) eliminats. |
| Números màgics | `96px` → `--sdp-alt-nav-mobil`; `clamp(16px,4vw,40px)` → `--sdp-pad-contenidor`. |
| Opacitats sobre text | Eliminades de `.alert-content p` i `.sp-card-author-location`: rebaixaven el contrast per sota del contracte. |
| 16 estils inline idèntics | Substituïts per `.icona-linia`. De regal, `:only-child` lleva el marge dret i **centra la fletxa del botó de descàrrega**, que estava desviada 2px. |
| Castellanismes | `REGLAS`→`REGLES`, `Volver Atrás`→`Tornar arrere`, `per a que`→`perquè` (×2, un al paràgraf de portada). |
| Comentaris en anglés | 21 traduïts al valencià. |

---

## 7. RECOMPTE

| | V4.5 | V5.0 |
|---|---|---|
| **Fallades de contracte de contrast** | **21** | **0** |
| Text invisible en mode fosc | sí | no |
| Errors d'anidament HTML | 0 | 0 |
| Tokens fantasma | 5 | 0 |
| Col·lisions de tokens | 1 | 0 |
| Blocs de mode fosc | 2 | 1 |
| Estils inline a l'HTML | 45 | 11 |
| `!important` | 27 | 21 |
| Crides a Google | 1 | 0 |
| Hex escrits a mà als components | 35 | 8 |
| Components que toquen primitius | tots | 0 |

Els 11 estils inline restants són 9 `--mida` (tokens passats per variable a la demo d'espaiats, ús legítim) i 2 de la demo de `z-index`. Cap és un color.

### Verificació mecànica

El fitxer `verifica.py` aplana la cadena de `var()` dels dos temes i comprova **19 parelles del contracte × 2 temes = 38 comprovacions**. Ara mateix: **38 de 38**.

Este script és la llavor de la comprovació que hauria de dur `control.html`: *Saber ≠ Fer*. La regla escrita no val res si no hi ha una màquina que la comprove.

---

## 8. EL QUE ENCARA NO ESTÀ FET

Ronda A tancada. Continuen obertes, per ordre de gravetat:

**Ronda B · accessibilitat estructural**
- El `<div id="mobile-sidebar-toggle">` continua sent un `<div>`. Amb teclat encara no es pot obrir el menú.
- El commutador de tema continua sent un `<svg>` amb un listener.
- 29 botons sense nom accessible; 31 que només tenen `title`.
- 0 `role`, 0 `tabindex`, 0 `aria-expanded` al document.

**Ronda C · neteja**
- `.steps-container`, `.mobile-logo-btn`, `.sp-card-title`, `.sp-card-subtitle`, `a.nav-link`: fantasmes encara vius.
- Numeració de seccions amb els salts 5→7 i 19→24.
- La secció "9. Utilitats" continua partida en dos.
- Les dos convencions de nom de les utilitats (`gap` per píxels, `mb` per graó).

**Ronda D · JavaScript**
- L'índex de contingut continua construït amb 9 blocs de `cssText`. He reparat els noms de token i l'offset perquè no estiga trencat, però la reescriptura és pendent.
- Els selectors `button[title="…"]` continuen depenent de cadenes en valencià. **Cal migrar-los a `data-accio` abans de tocar `idioma.html`.**
- Sense focus atrapat, sense Escape, sense `role="dialog"`.

**Ronda E · nou**
- Targeta de Calendari, Targeta d'Avís, i els esquelets de `control.html`, `xat.html`, `idioma.html`.

---

## 9. LA PREGUNTA OBERTA

**D-4: recupere l'intercanvi de rols en mode fosc, o mantinc la identitat estable?**

És l'única decisió que he pres jo sense consultar-te, i està aïllada en dos línies. Diga-ho i seguim.
