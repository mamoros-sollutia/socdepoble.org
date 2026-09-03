---
tipus: informe
estat: canonic
description: Auditoria tècnica (DAFO i neteja de deute) generada per Claude (Seient 5).
---

# 🛡️ INFORME D'AUDITORIA — SEIENT NÚM. 5 (CLAUDE)

## 0. Verificació del bundle

`sdp.bundle.v2` — **448/448 fitxers, 448 SHA-256 correctes, 0 divergències, 0 absències.** Cap patró "Coix Bundle". El manifest diu la veritat.

Dues correccions meues durant l'anàlisi, que declare per honestedat: el meu primer parser va donar 49 falses absències (fences de 4 backticks) i la primera auditoria de tokens va donar 29 falsos orfes (línies amb declaracions múltiples). Tot el que ve a continuació és de la passada verificada.

---

## 1. P0 REGRESSAT — La correcció P0-8 "Marc Brillant" està morta

El pitjor que he trobat, i no ho hauries vist mai llegint el codi.

`src/PedraSecaEmbed.jsx:414` afirma: *"`--sdp-bg` viu ara als blocs de tema del sistema de disseny"*.

**`--sdp-bg` no es declara enlloc del projecte.** Cerca exhaustiva: apareix 12 vegades, totes com a consum o comentari. Cap `--sdp-bg:`.

Conseqüència mecànica a `_pintaAmfitrio()` (línia 436):

```js
valor = getComputedStyle(punt).getPropertyValue('--sdp-bg').trim();  // → ''
if (!valor) return;   // ← ix SEMPRE. El pont no pinta MAI.
```

`blank.php:40` cau sempre al fallback beix `#f4eee6`. El fosc només funciona per `prefers-color-scheme`, no per `data-theme`. Si algú activa el mode fosc a mà amb el SO en clar, **l'app negra torna a quedar emmarcada en beix**: exactament el bug que P0-8 diu haver arreglat. De nit, per a gent major, enlluerna.

I per què no salta cap porta: `.pedra-seca-deute.json:118` el té a la llista blanca `LLEI_02_TOKEN_FANTASMA/coneguts`. **Una entrada de deute està silenciant una correcció regressada.** Aquest és el patró "Fossil Contrast" replicat: el comentari sobreviu, el mecanisme mor, el gate certifica.

**Fix:** declarar `--sdp-bg` als dos blocs de tema d'`index.css` (amb el mateix valor que `--sdp-fons-app`) i **traure'l** de `coneguts` perquè la porta el vigile.

---

## 2. CAPA 0 desconnectada de la sortida

`src/config/design-tokens.json` es proclama `"font_unica_de_veritat": true`. Genera dos tokens vius: `--sdp-touch-min: 44px` (Llei de Vida) i `--sdp-font-min: 16px` (anti-zoom iOS).

**Cap dels dos es consumeix.** `index.css:204` fa `--sdp-touch: 44px;` — literal escrit a mà. La Llei de Vida s'aplica per un duplicat, no pel cànon.

Si canvies el JSON de 44 a 48, el gate passa i **la interfície no es mou**. La font de veritat no té cable a l'eixida.

**Fix, 2 línies a `index.css`:**
```css
--sdp-touch: var(--sdp-touch-min);        /* línia 204 */
```
I `--sdp-font-min` cal cablejar-lo als controls de formulari — ara mateix no hi ha cap `font-size` d'input ancorat a ell, així que la protecció anti-zoom d'iOS depèn de `1rem` solts.

---

## 3. `!important` — 69 en total, tres categories

No et propose eradicar-los tots. Distingir és part de la faena.

**Legítims (32) — no els toques:**
- `blank.php` (13): lluiten contra la cascada de WordPress/Sollutia, que no controles. Cas de llibre.
- `prefers-reduced-motion` i `prefers-contrast` (11): estàndard d'accessibilitat.
- Utilitats de visibilitat `.sdp-ocult`, `.mobile-only`, `.d-mobile-only` (8).

**Provablement morts (4) — esborra la regla sencera:**
- `index.css:2521-2523` `.xat-settings-btn` (3 `!important`)
- `index.css:2682` `.xat-empty .sp-main-content` — el selector és mort (§4)

**Deute real (11) — ataca ací:**

`src/app/App.jsx:404-408` és el pitjor. Un `<style>` inline dins del render amb 8 `!important`:
```jsx
:host { height: 100% !important; display: block !important; }
.sdp-root { height: 100% !important; ... }
.app-main { flex: 1 1 0% !important; ... }
```
Això és el sistema de disseny lluitant contra si mateix des de dins de React, injectat a cada render. Mou-ho a `index.css` sense `!important` — no hi ha res que li competisca en especificitat un cop fora del JSX.

`index.css:513/518` (`:first-child`/`:last-child` margins) no necessiten `!important`: `h1:first-child` ja té més especificitat que `h1`.

---

## 4. Codi mort — 32 classes CSS verificades sense cap consumidor

Comprovades una a una contra tot `src/`, `wordpress-plugin/`, `public/`. Vaig descartar `toc-level-*` i `mobile-panel-*` com a falsos positius: es generen amb plantilla.

**Bloc TipTap PoC — `index.css:3211-3236, esborra'l sencer.**

El CSS defineix `.sdp-tiptap-menu` i `.sdp-tiptap-container`. `NotesEditor.jsx:161` renderitza `className="editor-tiptap-container"`, i aquesta sí està definida a `NotesSection.css:481`. El PoC va quedar orfe quan es va fer la implementació real. Aquest bloc sol genera **3 de 3 infraccions T1 i 4 de 6 T2**.

**Bloc BEM fantasma — `index.css:3147-3161`.**

El CSS ataca `.app-main__content`. `App.jsx:295` renderitza `className="app-main-content"`. **Un guionet contra dos guions baixos**: 5 regles que semblen funcionar i no fan res des del dia que es van escriure.

**Resta morta:** `.notes-editor` (3171, 3175), `.note-list .conversation-button` (3167), `.editor-container` (NotesSection.css:439), `.logo-container`/`.logo-img` (577, 582), família `.mur-*` (2232-2260), família `.xat-bubble*` (2693-2713), `.chat-bubble-ia/jl` i `.chat-time-ia/jl` (2275-2279), `.label-festes/fototeca/mapa/poble-actiu`, `.sdp-parallax-bg` (1934), `.sdp-scroll-reveal` (1922), `.sdp-quarantena-badge`, `.sdp-badges-container`, `.sdp-filtres__vistes`, `.sp-card-content-link`, `.sp-card-main-button`, `.sw-secondary-700`.

**Duplicat exacte:** `@media (prefers-reduced-motion)` està dos vegades — `index.css:1804-1810` i `2036-2043`. La segona és superconjunt de la primera (afig `scroll-behavior`). Esborra la primera.

**13 tokens declarats i mai consumits**, entre ells `--sdp-negre`, `--sdp-negre-pur`, `--sdp-measure`, `--sdp-alt-barres`, `--sdp-space-base` i quatre `--sdp-secondary-*`.

---

## 5. Estat real de les portes

Vaig executar la bateria en lloc d'especular. `run-portes.mjs`: **22 tractors en fallida** de 28 al disc / 24 a la cadena. Entre ells Linter, TDZ, Rutes, Tokens, Vocabulari, Teixit, SCC, Frontmatter, Manifest, Registre, Consell.

La porta Cadena passa (cap gate silenciat, el problema del `&&` està resolt). Però la cadena arriba al final i troba 22 focs. `tractor-tokens` sol: 21 infraccions (3 T1, 6 T2, 12 T4).

Les T4 són reals i concentrades: `NotesSection.css` cita primitives crues (`--sdp-pedra-800/50/900/700`, `--sdp-secondary-500`) a les línies 99, 100, 101, 395, 420, i `NotesEditor.jsx:72`. Aquests components **no es mouen amb el mode fosc**.

---

## 6. DAFO

**Fortaleses**
- El bundle és honest: manifest complet, SHA-256 verificable, contracte d'abast declarat. Poques bases de codi permeten això.
- 28 portes automatitzades que caçen de veritat. Quan `tractor-tokens` diu "T1 a la línia 3217", és cert i és accionable.
- Arquitectura de color de tres capes correcta com a disseny.
- L'aïllament per Shadow DOM funciona: 5 fitxers CSS per a 49 components, sense fuites cap a WordPress.
- El codi es documenta a si mateix amb el *perquè*, no el *què*. El comentari de `_pintaAmfitrio` explica l'herència cap avall de les propietats personalitzades. Això té valor real.

**Debilitats**
- `index.css` amb 3.237 línies és un monòlit. Els blocs morts s'hi apilen al final: tot el deute d'aquesta auditoria viu passada la línia 3130.
- **Els comentaris menteixen més que el codi.** Dos casos verificats (`--sdp-bg`, CAPA 0) on la prosa descriu un mecanisme que no s'executa.
- Les llistes blanques de deute conserven bugs vius. `coneguts` hauria de caducar, no acumular.
- 22 portes vermelles és massa senyal: quan tot és roig, res és urgent. El P0 real d'aquesta auditoria estava amagat entre soroll.

**Amenaces**
- **TipTap contradiu Pedra Seca.** `@tiptap/react` + `starter-kit` arrossega ~20 paquets ProseMirror. És la dependència més pesada del projecte i xoca amb la doctrina de zero dependències. Si mai has de justificar Pedra Seca davant d'algú, açò serà el primer que et rebatran.
- `react`, `react-dom` i `react-router-dom` estan a `devDependencies` mentre `@supabase/supabase-js`, `dompurify` i `lucide-react` estan a `dependencies`. Pot ser deliberat per al build de Vite, però és incoherent i un futur mantenidor s'hi trencarà.
- El patró "correcció fòssil" ja té tres casos documentats al projecte. Sense una porta que verifique que els comentaris de correcció encara descriuen codi viu, se'n repetirà.

**Oportunitats**
- Les seccions §1 a §4 són ~120 línies a esborrar i ~4 a canviar. Elimina 3 T1, 4 T2 i un P0 d'accessibilitat.
- Una porta nova, barata: *cap `var(--sdp-*)` sense declaració, sense excepcions permanents*. Ja tens el motor a `tractor-tokens`; només cal fer caducar `coneguts`.
- Cablejar CAPA 0 (§2) converteix `design-tokens.json` en font de veritat de veres. Dues línies.
- Un gate que compare classes CSS contra classes renderitzades hauria caçat `app-main__content` el dia u. El meu script fa 40 línies i el pots portar a `tooling/gates/` directament.

---

## Ordre d'atac suggerit

1. `--sdp-bg` (§1) — és accessibilitat i està en producció.
2. Esborrar `index.css:3147-3161` i `3211-3236` (§4) — mata 7 infraccions de gate sense risc.
3. Cablejar CAPA 0 (§2) — dues línies.
4. Traure el `<style>` d'`App.jsx` (§3) — 8 `!important` menys.
5. Les T4 de `NotesSection.css` — els components que no es mouen amb el tema fosc.

**Ancoratge de Seguretat:** [[00_INDEX_ESCRIPTORI]]
