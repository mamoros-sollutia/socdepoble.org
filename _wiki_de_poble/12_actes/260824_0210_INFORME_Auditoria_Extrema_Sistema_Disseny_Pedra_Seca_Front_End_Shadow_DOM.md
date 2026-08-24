---
estat: "actiu"
tipus: "informe"
seient: "Núm. 5 · Auditor Sènior"
abast: ["front-end", "css", "jsx", "shadow-dom", "seo", "wordpress", "sollutia"]
bundle: "260824_0158_BUNDLE_Codi_Complet_Absolut_Sollutia_Pedra_Seca.md"
data: 2026-08-24
---

# Auditoria Extrema del Sistema de Disseny Pedra Seca

**Seient Núm. 5 · Auditor Sènior**
Bundle auditat: 119 fitxers, 1.936.110 caràcters, 42.283 línies.

---

## 0. Mètode i límits

No he llegit el bundle: l'he **trossejat en 119 fitxers reals** i l'he interrogat amb greps i anàlisi de graf. Cada troballa d'este informe porta fitxer i línia i és reproduïble amb una ordre. On no he pogut verificar una cosa, ho dic.

**El que NO hi ha al bundle i limita l'auditoria:**

| Absent | Què no puc afirmar |
|---|---|
| `vite.config.js` | Com emet Rollup els CSS d'efecte lateral; els alias de `jsx-runtime` |
| `package.json` | Quines dependències hi ha realment instal·lades |
| Plugin PHP de WordPress | Si algú escriu `data-theme` a l'`<html>` abans del primer pintat; si hi ha SEO servit |
| `index.html` de producció WP | Si existix el script bloquejant del `<head>` |

El `farcell.mjs` torna a lliurar un bundle incomplet. La troballa P0-2 depén d'esta llacuna i la marque com a **probable, no confirmada**; la resta són confirmades.

---

## 1. Sentència

> **El 62% del vocabulari visual que l'aplicació escriu al DOM no existix.**

718 classes escrites al JSX no tenen cap regla al full que entra a l'arrel ombra. 355 en tenen. No és brossa acumulada per sedimentació: són **cinc dialectes simultanis** dins del mateix component, cadascun deixat per una sessió d'agent diferent que no va comprovar el que ja hi havia.

| Dialecte | Classes mortes | Origen |
|---|---|---|
| Tailwind | 295 | Mai compilat. No hi ha `@tailwind` ni configuració en tot el projecte |
| `sosp-*` | 128 | Prefix prohibit pel vostre propi manual |
| BEM/kebab | 121 | `login-*`, `notes-*`, `devices-*`, `section-hero__*` |
| camelCase | 23 | Migració a CSS Modules que no es va fer mai |
| `sdp-*` sense regla | 24 | Escala d'utilitats amb forats als dos costats |

I la ironia estructural: **el manual que ensenya Pedra Seca està escrit en un vocabulari prohibit que no renderitza res.** Qualsevol IA futura que òbriga `src/components/design-system/` per aprendre la UI aprendrà Tailwind d'un subarbre que ningú importa.

---

## 2. Troballes P0 · Fallades silencioses en producció

### P0-1 · Sis seccions es renderitzen crues

`src/components/SectionChrome.jsx` emet set classes: `.section-shell`, `.section-hero`, `.section-hero__kicker`, `.section-hero__title`, `.section-hero__subtitle`, `.section-hero__meta`, `.pill`.

**Cap de les set està definida en cap CSS del projecte.**

L'usen sis punts:

| Fitxer | Què és |
|---|---|
| `src/sections/login/LoginSection.jsx:59` | **La primera pantalla d'un veí nou** |
| `src/sections/profile/ProfileSection.jsx:12` | Perfil |
| `src/sections/ia/IaSection.jsx:48` | L'ànima de la IAIA |
| `src/sections/detail/PageDetailSection.jsx:28` | Detall de pàgina |
| `src/pages/NotFoundPage.jsx:18` | 404 |
| `src/app/App.jsx:256` | Pantalla d'error de base de dades |

Estes sis vistes només reben els estils d'element base (`h1`, `p`). Cap targeta, cap graella, cap espaiat del sistema.

### P0-2 · Dos fulls sencers no entren mai a l'arrel ombra

L'única porta al Shadow DOM és `PedraSecaEmbed.jsx:38`:

```js
import styles from './css/index.css?inline';
```

Però hi ha tres imports de CSS **sense** `?inline`:

```
src/sections/connectar/ConnectarSection.jsx:6   → ./ConnectarSection.css          (351 línies)
src/sections/disseny/DesignSection.jsx:3        → ../../pages/features/sosp-components.css  (485 línies)
src/components/design-system/DesignSystemPage.jsx:3 → (el mateix)
```

Un `import './x.css'` va al `document`, no a l'arrel ombra. Doble fallada simultània:

1. **Fuguen cap a WordPress** — estilen la pàgina amfitriona, que és exactament el que el Shadow DOM havia d'impedir.
2. **Estan morts dins del component** — la secció Connectar i el manual de disseny no reben eixos estils.

I hi ha un tercer efecte que ho remata: els tokens `--sdp-*` només es declaren dins d'`index.css`, que viu **només** dins de l'ombra. Per tant tots els `var(--sdp-*)` d'eixos dos fitxers (836 línies) no resolen res a l'àmbit del document. Encara que la fuga arribara, no pintaria.

> *Confirmació pendent: sense `vite.config.js` no puc saber si el build de WP concatena o emet un `style.css` separat. El fet mecànic que sí que puc afirmar és que `?inline` és l'única porta a l'arrel ombra i estos tres imports no la usen.*

### P0-3 · La pantalla de càrrega de rutes no té CSS

`src/app/App.jsx:41-52` renderitza `RouteFallback` amb set classes:
`sdp-route-loading-screen`, `__glow`, `__glow--left`, `__glow--right`, `__panel`, `__logo`, `__title`, `__subtitle`, `__dots`.

Cap té regla. Com que **totes** les seccions són `lazy()`, esta pantalla apareix en cada navegació. Cada transició mostra un flaix cru.

### P0-4 · L'anell de focus de la barra superior està mort

`src/css/index.css:1821`:

```css
.sdp-top-bar-btn:focus-visible {
  outline: 2px solid var(--sdp-color-focus);
  outline-offset: 2px;
}
```

`--sdp-color-focus` **no es declara enlloc**. Cadena mecànica:

1. `var()` sense fallback i sense declaració → la declaració és *invàlida en temps de càlcul*.
2. `outline` no és heretada → cau a `initial` → `outline-style: none`.
3. Esta regla és **més específica** que la global de `:focus-visible` (línia 513, que sí que funciona) → la mata.

Afecta els cinc botons de la barra superior (`App.jsx:214-226`): idioma, IAIA, cerca, **canvi de tema** i perfil. És la navegació principal de l'aplicació.

**Fallada WCAG 2.4.7 (Focus Visible), nivell AA.** Un usuari de teclat navega a cegues per la barra.

### P0-5 · `useSEO` no té cap configuració en què siga correcte

`src/hooks/useSEO.js:10`:

```js
const shouldManageHead = externalConfig?.manageDocumentHead ?? !externalConfig?.pluginUrl;
```

**Dins de WordPress:** `pluginUrl` sempre arriba (`PedraSecaEmbed.jsx:248-250` s'assegura explícitament que arribe). `manageDocumentHead` **no es defineix en cap lloc del bundle** — només es llig, mai s'escriu. Per tant `shouldManageHead === false` i **el hook no s'executa mai**. Cap `<title>`, cap OG, cap canonical, cap JSON-LD s'ha escrit mai en producció.

**Fora de WordPress:** cap de les sis cridades passa `canonical`. Per tant s'executa la branca `else` (línies 81-85), que **esborra** el `link[rel="canonical"]` existent i **tots** els `link[rel="alternate"][hreflang]` del document. Si Yoast o RankMath n'han escrit, el component els destruïx.

**Cobertura:** només 6 de 19 seccions criden `useSEO`. Només una passa `jsonLd` (`ItemDetailSection.jsx:70`). Cap passa `canonical`.

> El hook o és inert o és destructiu. No hi ha tercera opció.

### P0-6 · Contingut invisible per al canal de distribució real

Tot el contingut viu dins de Shadow DOM sense cap light DOM de reserva. Googlebot aplana l'arrel ombra i el veu; **WhatsApp, Telegram, Signal i Facebook no executen JavaScript**. Llegixen només l'HTML estàtic que servix el servidor.

Per a un projecte que distribuïx pels grups de WhatsApp del poble a través de la IAIA MarIA, **el canal principal està mort per disseny**. Cada enllaç compartit és una targeta buida.

---

## 3. Troballes P1 · Contradiccions estructurals

### P1-7 · Tres escriptors del tema, un lector, i `'system'` inabastable

| Qui | On | Què escriu |
|---|---|---|
| `PedraSecaEmbed` | `:200` | `this.dataset.theme` al host |
| `App.jsx` | `:72` | `rootNode.host.setAttribute('data-theme')` |
| `App.jsx` | `:74` | **`document.documentElement.setAttribute('data-theme')`** |
| `theme.js` | `:15` | *llig* `document.documentElement` com a "font de veritat" |

**El bucle:** l'App escriu l'atribut que després llig com a autoritat. Conseqüència mecànica:

- Després del primer render, `<html data-theme>` sempre val `'light'` o `'dark'` concret.
- `readThemePreference()` (theme.js:15-16) troba eixe valor i el retorna abans d'arribar al `localStorage`.
- `toggleTheme()` (AppDataContext.jsx:138-145) només escriu `'dark'` o `'light'`, mai `'system'`.

**→ La preferència `'system'` no es pot recuperar mai després del primer render.** Existix al `VALID` de theme.js, existix la lògica de `matchMedia` a AppDataContext:127-134, i és codi mort.

**L'agreujant:** `App.jsx:74` muta l'`<html>` de WordPress **incondicionalment**, fora de qualsevol comprovació. Si el tema de WP usa `data-theme` (patró habitual), li'l trepitgeu en cada canvi de tema. Això és **bloquejant per a Sollutia**: no es pot integrar en una plataforma de tercers un component que reescriu l'element arrel de l'amfitrió.

**La justificació que no es sosté:** `index.css:249-252` diu textualment que la resolució de la preferència de sistema la fa "el script mínim del `<head>`, que escriu data-theme a l'`<html>` abans del primer pintat. Per això ACÍ NO hi ha cap `@media (prefers-color-scheme)`".

Eixe script **no existix enlloc del bundle**. L'`index.html` (18 línies) no en té cap. Sense el script i sense el media query, el mode fosc automàtic és inabastable per dues vies independents.

### P1-8 · La Llei de Vida es deroga a si mateixa

`index.css:501-506` declara la llei:

```css
/* ── LLEI DE VIDA · cap control per davall de --sdp-touch ── */
button, .btn, .nav-item, .sp-card-action, .page-btn,
.download-card-btn, .audio-play-btn, .file-item-action, summary.accordion-header {
  min-width: var(--sdp-touch);   /* 44px */
  min-height: var(--sdp-touch);
}
```

`index.css:1673-1675`, dins de `@media (max-width: 480px)`:

```css
.sp-card-action  { width: 36px; height: 36px; min-width: 36px; min-height: 36px; }
.sp-card-connect { height: 32px; min-height: 32px; }
```

Mateixa especificitat, més avall al fitxer → guanya. **La llei es cancel·la exactament al dispositiu per al qual existix.** Un iaio del poble amb un mòbil de 5 polzades és qui rep els objectius de 32px.

### P1-9 · La Llei del Quadrat es trenca en temps d'execució

`src/sections/detail/detailRichText.jsx:45` injecta a cada imatge de markdown:

```js
'<img src="$2" alt="$1" style="max-width:100%;border-radius:18px;margin:18px 0;" />'
```

Estil en línia **i** radi sobre imatge, generat en execució dins d'una cadena. Cap linter de CSS ni de JSX el veurà mai.

### P1-10 · 137 estils en línia contra la llei publicada

`DesignSection.jsx:41`, text que es renderitza als veïns a `/disseny`:

> *"Prohibició d'estils en línia: Està terminantment prohibit l'ús de `style={{}}` en tot el codi JSX."*

Realitat: **137 ocurrències en 25 fitxers.** 57 usen tokens `--sdp-*` (l'ús defensable: el `style` com a conducte de tokens). **80 contenen valors literals.** Nou contenen colors durs: `#fff`, `#171717`, `rgba(...)` a `ItemDetailSection.jsx:19,24,31,36`, `NotesSection.jsx:82-84`, `ConnectarSection.jsx:57`, `Buttons.jsx:33`.

El manual conté un `style={{}}` en el mateix fitxer on publica la prohibició.

### P1-11 · 30 referències a tokens que no existixen

**Al CSS (11):** `--sdp-color-focus`, `--sdp-color-surface-hover`, `--sdp-radius-md`, `--sdp-t-rapida`, `--sdp-t-normal`, `--sdp-ombra-5`, `--sdp-text-normal`, `--sdp-text-blau`, `--sdp-pedra-75`, `--sdp-font-family-display`, `--mida`.

**Al JSX (19):** entre elles **quatre `--md-sys-color-*`** (tokens de Material Design 3, a `ColorPalette.jsx`) i set `--sosp-*` a `LegacySections.jsx`.

Efectes concrets verificats:

| Regla | Conseqüència |
|---|---|
| `.toc-drawer` (1943) | Sense ombra (`--sdp-ombra-5`) i **sense animació** (`--sdp-t-normal`) |
| `.toc-overlay` (1938) | Sense animació d'entrada (`--sdp-t-rapida`) |
| `.toc-item button` (2008) | **Sense color de text** (`--sdp-text-normal`) |
| `.sdp-top-bar-btn` (1813-1821) | Sense radi, sense hover, **sense focus** |

A l'altre costat: **23 tokens declarats i mai usats**, entre ells un joc anglés complet (`--sdp-color-bg-base`, `--sdp-color-text-body`, `--sdp-color-text-heading`, `--sdp-shadow-sm`, `--sdp-shadow-md`).

**Diagnòstic:** les últimes ~400 línies d'`index.css` (des del bloc "FASE 4 · EXPERIÈNCIA PRÈMIUM") estan escrites en un **dialecte anglés que no existix**. És sediment d'una sessió que va escriure CSS sense consultar la taula de tokens de dalt del mateix fitxer.

### P1-12 · Subarbre mort: `src/components/design-system/`

**Onze fitxers, ~107 KB, més de 1.900 línies. Ningú importa `DesignSystemPage.jsx`.**

Verificat pel graf de mòduls des de les dues entrades reals (`main.jsx`, `wp-standalone.js`). La ruta `/disseny` va a `src/sections/disseny/DesignSection.jsx`, un fitxer completament diferent.

Este subarbre conté **267 de les 295 classes Tailwind** del projecte i les set referències a `--sosp-*`. Inclou `LegacySections.jsx` (1.435 línies) amb IDs duplicats (`progres` ×2), divs buits i un `<iframe>`.

**Sentència: supressió íntegra.**

### P1-13 · `IaSection.jsx` és codi mort (troballa del tractor)

Esta no l'havia vista jo: la va traure el gate 8. `src/sections/ia/IaSection.jsx` (9,5 KB) **no l'importa ningú**. La ruta `/ia` va a `<TextRoute pageKey="anima" />` (`App.jsx:333`), que llig de `pageContent.js:118`. La secció sencera, amb el seu `DOMPurify` i el seu `SectionChrome`, està desconnectada.

---

## 4. Troballes P2 · Deute concret

**Rutes trencades.** `App.jsx:290` i `:292`:

```jsx
<Route path="/xat/:threadId"   element={<Navigate to="/chat/:threadId" replace />} />
<Route path="/chats/:threadId" element={<Navigate to="/chat/:threadId" replace />} />
```

`<Navigate to>` accepta un camí literal, **no un patró**. Un usuari que arribe a `/xat/abc` acaba a `/chat/%3AthreadId`. Dos enllaços històrics trencats i dues cadenes de redirecció que moren.

**`SECTION_ORDER` no ordena res.** `App.jsx:34` fa `SECTIONS.filter(s => SECTION_ORDER.includes(s.id))`. `.filter()` conserva l'ordre de **`SECTIONS`**, no el de `SECTION_ORDER`. La constant és una llista blanca amb nom d'ordenació. Efecte lateral: `events` i `mapa` estan a `SECTIONS` però no a `SECTION_ORDER` → no apareixen mai al menú.

**Dues portades que no coincidixen.** `sections.js:25` declara `DEFAULT_SECTION_PATH = '/chat'`. `App.jsx:288` declara `<Route path="/" element={<Navigate to="/pobles" replace />} />`. Totes dues s'usen (`App.jsx:238` usa la constant). Dues fonts de veritat per a la mateixa pregunta.

**Fonts: l'escala de pesos no és entregable.** `noto-sans.css` declara quatre `@font-face` amb pesos 400, 600, 700 i 800 apuntant **tots al mateix fitxer** `.woff2`. Si és una font variable, la forma correcta és una sola declaració amb `font-weight: 100 900`. Tal com està, el navegador o renderitza tot al pes per defecte o sintetitza la negreta. La jerarquia tipogràfica del manual no existix físicament.

**El component encara es pensa amo del viewport.** Herència del PWA:

```css
:host        { height: 100dvh; }                                    /* index.css:328 */
.toc-overlay { position: fixed; width: 100vw; height: 100vh;
               z-index: 9999; }                                     /* index.css:1929-1936 */
```

Dins de WordPress això dobla el scroll (component a alçada completa **dins** d'una pàgina que ja té capçalera i peu) i el drawer tapa la pàgina amfitriona sencera. A més hi ha **dues declaracions de `:host` en conflicte**: `PedraSecaEmbed.jsx:91` injecta `:host{display:block;width:100%}` **abans** de `styles`, així que la d'`index.css` guanya. Guanya la roïna.

També conviuen dues convencions de viewport al mateix full: `100dvh` (correcta a iOS) i `100vh` (bug de la barra d'URL de Safari).

**La config es JSON-ifica i perd coses.** `PedraSecaEmbed.jsx:256`:

```js
this._config = JSON.parse(configHash);   // configHash = JSON.stringify(rawConfig)
```

Este viatge d'anada i tornada destruïx en silenci funcions, `Date`, `Map` i `undefined`. Si Sollutia us passa un `getToken()`, un `onNavigate()` o un client autenticat per la propietat `config` (que existix precisament per a "passar objectes rics", segons el comentari de la línia 149), desapareix **sense cap error**.

**Iframe de tercers sense contenció.** `MurSection.jsx:196`: `<iframe src={buildMapEmbedUrl()}>` cap a `openstreetmap.org`, **sense `sandbox`**, amb `referrerPolicy="no-referrer-when-downgrade"` → filtra l'URL de la pàgina amfitriona a un tercer. I `.sdp-filtre--mapa` (el contenidor) **no té CSS** → l'iframe ix a la mida per defecte de 300×150. La regla que li corresponia, `.mur-map` (`index.css:2189`), existix i és òrfena: canvi de nom sense migració.

Per a un projecte amb bandera de sobirania tecnològica, això mereix una decisió explícita, no un descuit.

**i18n: dos idiomes coixos i un manual monolingüe.**

| Idioma | Claus | Diferència |
|---|---|---|
| ca | 280 | base |
| es | 280 | 0 |
| en | 280 | 0 |
| **eu** | **261** | **-19** |
| **gl** | **264** | **-16** |

Falten els blocs `nav.control`, `nav.dispositius`, `nav.gestoria` i `section.control.*`.

I `DesignSection.jsx:7` fa `const { t } = useAppData();` i **no usa `t` ni una sola vegada**. Són 1.072 línies de manual codificades a mà en valencià dins d'una aplicació de cinc idiomes.

**Altres:** IDs duplicats (`progres` ×2, `targetes` ×2). `assetResolver.js:69-76` cabla **set noms de poble a mà** (Benifallim, Sella, Orxeta, Relleu, Alcoleja, Xixona, Tibi) dins del resolutor d'actius: mur d'escalabilitat per a Sollutia i contingut dins del codi. Radis màgics fora de l'escala de tokens: `40px`, `26px`, `22px`, `14px`, `12px`, `4px`×7, `2px`×2.

**El que està bé i vull deixar escrit:** els cinc `dangerouslySetInnerHTML` passen tots per `DOMPurify`, inclòs el de `PageDetailSection` (via `renderPageHtml`). Les 37 `<img>` tenen totes `alt`. Només hi ha dos `key={index}`. No hi ha cap `window.history.back()`. `@media (prefers-reduced-motion)` i `(prefers-contrast: more)` existixen i estan ben fets. La capa de tokens OKLCH amb els ràtios de contrast documentats a la vora és bona feina i el fet de dir obertament que el taronja no arriba a AAA és honest.

---

## 5. Resposta objectiu per objectiu

### Objectiu 1 · Poda i sanejament

| A eliminar | Volum | Risc |
|---|---|---|
| `src/components/design-system/` (11 fitxers) | ~107 KB | **Cap** (no accessible des de cap entrada) |
| `src/pages/features/sosp-components.css` | 485 línies | **Cap** (no arriba a l'ombra) |
| `src/sections/ia/IaSection.jsx` | 9,5 KB | **Cap** (no importat) |
| 53 selectors CSS orfes | — | Baix (verificat contra tot el codi) |
| 23 tokens declarats i mai usats | — | Baix |

Això és el que es pot esborrar **hui**, sense pensar. La resta de la poda (les 718 classes) no és esborrar: és decidir a quin dialecte es queda cada vista i migrar-la.

### Objectiu 2 · Blindar Pedra Seca contra la rotació d'IAs

El problema no és que les IAs siguen roïnes. És que **cada llei d'este projecte està escrita en tres llocs i verificada en zero**:

1. `.agents/skills/socdepoble-criteri-visual/SKILL.md`
2. El manual renderitzat a `/disseny`
3. Els comentaris dins d'`index.css`

Tres declaracions, cap porta. Un agent que no recorde la llei la trenca i ningú se n'assabenta fins que ho veu un humà.

**Proposta central: `tractor-pedra-seca.mjs`** (lliurat amb este informe, verificat contra el codi real). Vuit portes amb `process.exit(1)`, zero dependències, criquet amb memòria d'identitats. Documentat a la secció 7.

**Proposta segona, i crec que és la important: el manual s'ha de generar, no escriure.** Mentre `DesignSection.jsx` siga HTML a mà, mentirà — ja ho fa: publica la prohibició d'estils en línia en un fitxer amb estils en línia. Si el manual es genera des del CSS i des del JSON de tokens, **no pot mentir**. I això és l'única forma real de fer el sistema independent d'una IA concreta: l'agent futur no llig una *descripció* del sistema, llig el sistema.

**Proposta per a les `skills`:**

- `socdepoble-criteri-visual/SKILL.md` és bona com a document de gust (les regles hero/avatar, l'ordenació termodinàmica de `/pobles`, el pes estètic del calendar badge). No és auditable. **Separeu-la en dos:** el gust (prosa, per a l'humà i per al criteri de l'agent) i el contracte (taula de classes canòniques i tokens, generada des del codi).
- La secció §1 de la skill diu "Només hi ha un H2 per pàgina". `/disseny` en té dos, i **dos `<h1>`**: un de `UniversalPage` (`UniversalComponents.jsx:632`) i un altre dins del contingut (`DesignSection.jsx:155`, amb el text literal `H1: Títol Principal (40px)`). Un rastrejador llig això com el títol de la pàgina. Cap agent ho va detectar perquè cap ho podia detectar.
- Falta l'skill que hauria d'existir i no existix: **`socdepoble-shadow-dom`**. Les tres regles no negociables del muntatge (una sola porta CSS, cap escriptura al document amfitrió, cap unitat de viewport dins del host) no estan escrites en cap lloc. Són precisament les tres que s'han trencat.

### Objectiu 3 · SEO, accessibilitat i deute a llarg termini

**SEO:** vegeu P0-5 i P0-6. El resum és que **el SEO d'esta aplicació no existix i mai ha existit en producció**, i que el canal de distribució real (WhatsApp) no en veurà mai res mentre depenga de JS.

L'única solució correcta és **servir des del PHP**: el plugin escriu `<title>`, OG, canonical i JSON-LD al `<head>` **abans** que arribe el JavaScript, i `useSEO` es limita a actualitzar el títol en navegació interna i **mai** esborra res que no haja escrit ell. La regla: *qui no ha escrit una cosa no la pot esborrar.*

**Accessibilitat:**

| Troballa | Norma | Nivell |
|---|---|---|
| Anell de focus mort a la barra superior (P0-4) | WCAG 2.4.7 | **AA · fallada** |
| Objectius tàctils de 32-36px a ≤480px (P1-8) | Llei de Vida pròpia | Llei pròpia (WCAG 2.5.8 el permet) |
| `.toc-item button` sense color de text (P1-11) | WCAG 1.4.3 | Risc, no confirmat |
| 65 `aria-label` sobre 153 `<button>` | WCAG 4.1.2 | A revisar un per un |

Els 37 `<img>` amb `alt` i les preferències de moviment i contrast estan bé.

**Responsive:** l'escala té sis punts de tall (480, 720, 800, 1100, 1101, 1400, 1440) però no hi ha res per davall de 480. La base de 320px no està verificada per cap regla. `--sdp-ctrl-vw: clamp(320px, 100vw, 1024px)` reconeix el sòl de 320 però és l'únic lloc que ho fa.

### Objectiu 4 · Supervivència en WordPress i Sollutia

Tres bloquejos durs per a una plataforma de tercers, per ordre de gravetat:

1. **El component escriu a l'`<html>` de l'amfitrió** (`App.jsx:74`). Cap plataforma seriosa acceptarà això. És el primer que ha de caure.
2. **El component es reserva el viewport sencer** (`:host{height:100dvh}` + `.toc-overlay{position:fixed;100vw;100vh;z-index:9999}`). Un component encastat no pot decidir l'alçada de la pàgina ni tapar-la.
3. **La config perd tot el que no és JSON** (`PedraSecaEmbed.jsx:256`). Sollutia us passarà credencials o callbacks. Es perdran en silenci.

I dos de mitjans: la fuga de CSS cap al document (P0-2) i els noms de poble cablejats a `assetResolver.js`.

**El que està ben pensat i s'ha de conservar:** l'arquitectura de `PedraSecaEmbed` és sòlida. Les cinc correccions P0 documentades a la capçalera (moviment de DOM, cursa del `setTimeout`, `@font-face` fora de l'ombra, full compartit per `adoptedStyleSheets`, identitat de la config) són correctes i estan ben raonades. El problema no és l'embolcall: és que la capa React de dins encara es comporta com si fóra una PWA amb el document sencer per a ella.

### Objectiu 5 · Autocrítica destructiva

**El diagnòstic de fons és el vostre, repetit per quarta vegada: Saber ≠ Fer.** Però hi ha una capa nova que crec que encara no s'ha dit.

El vostre model de treball produïx **sediment**. Cada sessió d'agent afig una capa que no pot veure les anteriors: la capa "FASE 4 · PRÈMIUM" amb tokens anglesos que no existixen; el subarbre `design-system/` amb Tailwind; el `SectionChrome` amb el seu vocabulari propi; els `sosp-*` en dues valencianitzacions incompatibles (`sosp-btn`/`sosp-card` contra `sosp-boto`/`sosp-targeta`, dins del mateix prefix prohibit).

Cap agent va **eliminar** la capa anterior perquè cap podia saber si estava viva. **Este és el cost real de no tindre portes: no és que s'escriga codi roín, és que ningú pot esborrar codi vell amb seguretat.** Sense un gate de subarbres orfes, esborrar és un acte de fe, i cap agent prudent l'assumix. Per això el projecte només creix.

La segona autocrítica, i és per a mi: **jo no vaig detectar `IaSection.jsx`.** El gate 8 sí. Això és exactament l'argument a favor de les portes i en contra dels auditors, humans o IA.

I la tercera, incòmoda: el bundle diu "Codi Complet Absolut" i li falten `vite.config.js`, `package.json` i el plugin PHP. `farcell.mjs` es va construir per a fer impossible això. O no s'està executant, o la seua definició de complet no inclou la configuració de build. Si no incloeu la config de build, cap auditoria de front-end pot ser concloent, perquè la config de build és qui decidix on va cada CSS.

---

## 6. Pla de reestructuració

### Fase 0 · Amputació (una sessió, risc zero)

Esborrar `src/components/design-system/`, `src/pages/features/sosp-components.css`, `src/sections/ia/IaSection.jsx`, els 53 selectors orfes i els 23 tokens morts. Tot verificat com a inaccessible.

### Fase 1 · Una sola porta al Shadow DOM

Cap `import './x.css'` al projecte. Tot el CSS entra per `?inline` o no entra. `ConnectarSection.css` es fusiona dins d'`index.css`. **Gate 5 ja ho vigila.**

### Fase 2 · Un sol amo del tema

L'element custom és l'únic escriptor de `data-theme`, sobre el host i **mai** sobre `document.documentElement`. `theme.js` deixa de llegir l'`<html>`. I decidiu una de les dues, però que existisca:

- **(a)** Escriure el script bloquejant del `<head>` que el CSS ja documenta, o
- **(b)** Afegir `@media (prefers-color-scheme: dark)` al bloc de tema fosc.

L'opció (b) és més barata i no depén de WordPress. **Gate 6 vigila l'escriptura al document.**

### Fase 3 · SEO al servidor

El plugin PHP escriu `<title>`, OG, canonical i JSON-LD abans del JS. `useSEO` es queda només amb l'actualització del títol en navegació interna i perd tota capacitat d'esborrar. Afegir contingut de reserva al light DOM perquè els rastrejadors sense JS tinguen alguna cosa.

### Fase 4 · Un sol vocabulari

Decidir **un** dialecte de classes i migrar-hi tot. La meua recomanació: `sdp-*` en valencià, que és el que ja domina el full que realment pinta. Congelar el deute amb `--baseline` i baixar-lo per seccions, no de colp.

### Fase 5 · El manual generat

`DesignSection.jsx` deixa de ser HTML a mà. Es genera des d'`index.css` i des d'un `tokens.json`. Un manual generat no pot mentir.

---

## 7. `tractor-pedra-seca.mjs`

Lliurat amb este informe. Zero dependències, ESM, `process.exit(1)`.

**Eixida real contra el codi d'este bundle:**

```
══ TRACTOR PEDRA SECA ══════════════════════════════════════

· LLEI_01_CLASSE_ORFENA         718  màx 718
· LLEI_02_TOKEN_FANTASMA         30  màx 30
· LLEI_03_ESTIL_EN_LINIA        137  màx 137
✗ LLEI_03_COLOR_EN_LINIA          9  (DURA)
✗ LLEI_04_VIDA                    6  (DURA)
✗ LLEI_05_PORTA_UNICA             3  (DURA)
· LLEI_06_ENCAPSULAMENT          11  màx 11
· LLEI_07_PARITAT_I18N           35  màx 35
· LLEI_08_SUBARBRE_ORFE          12  màx 12

PARAT. El deute puja o s'ha trencat una llei dura.
```

### Les vuit portes

| Llei | Falla si… | Tipus |
|---|---|---|
| 01 · Classe òrfena | Una classe del JSX no té regla al full de l'ombra | Criquet |
| 02 · Token fantasma | Un `var(--…)` apunta a un token no declarat | Criquet |
| 03 · Estil en línia | Hi ha `style={{` — i **DURA** si conté un color literal | Mixta |
| 04 · Llei de Vida | Un control baixa de `--sdp-touch` | **DURA** |
| 05 · Porta única | Un import de CSS no acaba en `?inline` | **DURA** |
| 06 · Encapsulament | La UI toca `document.documentElement/head/body` | Criquet |
| 07 · Paritat i18n | Un idioma no té totes les claus del base | Criquet |
| 08 · Subarbre orfe | Un fitxer no penja de cap entrada real | Criquet |

### El criquet

Una porta que falla 718 vegades el primer dia s'apaga el segon. Per això el tractor usa un **criquet**:

- `--baseline` congela el deute actual a `.pedra-seca-deute.json`.
- Les execucions posteriors fallen si el deute **puja**. Només pot baixar.
- Les **tres lleis dures** es congelen a 0: fallen sempre que es violen.

El fitxer de deute guarda **identitats**, no només comptadors. Verificat: llevar una infracció i afegir-ne una de nova no compensa; el tractor detecta la nova encara que el total no canvie, i la nomena.

Les línies no formen part de la identitat: afegir una línia en blanc a dalt d'un fitxer no fa "créixer" el deute.

### Excepcions

Dos fitxers estan exclosos del gate 8 amb raó escrita dins del codi: `src/shims/jsx-runtime.js` (entra per alias de `vite.config`) i `src/assets/fonts/noto-sans.css` (es carrega en execució via `fonts-href`). **Tota excepció ha de portar raó escrita: si no en té, no és excepció, és codi mort.**

### Integració

```bash
node tooling/tractor-pedra-seca.mjs --baseline   # una sola vegada
node tooling/tractor-pedra-seca.mjs              # a cada commit i al build
node tooling/tractor-pedra-seca.mjs --detall     # llista completa
```

A `package.json`: `"prebuild": "node tooling/tractor-pedra-seca.mjs"`. Si no està al `prebuild`, no és una llei.

---

## 8. Ordre d'atac recomanat

| # | Acció | Esforç | Efecte |
|---|---|---|---|
| 1 | Definir `--sdp-color-focus` i els 10 tokens fantasma del CSS | 15 min | **Recupera l'anell de focus de la barra superior (WCAG AA)** |
| 2 | Fase 0 · amputació | 1 sessió | −107 KB, −267 classes Tailwind |
| 3 | Escriure el CSS de `SectionChrome` o migrar-lo a `UniversalPage` | 1 sessió | **Sis vistes deixen d'estar crues, inclòs el login** |
| 4 | Llevar `document.documentElement` d'`App.jsx:74` | 10 min | **Desbloqueja Sollutia** |
| 5 | Instal·lar el tractor amb `--baseline` al `prebuild` | 30 min | El deute deixa de créixer |
| 6 | Els tres imports de CSS a `?inline` | 1 h | Tanca la fuga cap a WordPress |
| 7 | SEO al PHP | 1 sessió | El SEO existix per primera vegada |

Els punts 1 i 4 sumen 25 minuts i arreglen una fallada d'accessibilitat AA i el bloqueig d'integració amb Sollutia. Jo començaria per ahí.

---

**Ancoratge de Seguretat:** [[00_INDEX_ESCRIPTORI]]
