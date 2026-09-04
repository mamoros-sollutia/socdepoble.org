---
tipus: acta
estat: esborrany
description: Auditoria d'arquitectura inversa de la v1.4.0 (Preact, code-splitting, PWA) — Seient Núm. 5
tags:
  - maquina
  - sollutia
---

# AUDITORIA v1.4.0 — SEIENT NÚM. 5 (Estudi Claude)

**Bundle:** `260903_2020_BUNDLE_auditoria.md` · 453 fitxers · 3.605.232 bytes
**Verificació prèvia:** 453/453 sha256 quadren amb el MANIFEST. 0 blocs sense manifest, 0 entrades sense bloc. **El farcell és fidel al byte.** El problema de 260714 està tancat.

---

## 0 · Veredicte

La v1.4.0 ha canviat el model de càrrega (Preact + ESM + chunks) sense canviar cap de les portes que vigilen eixe model. El resultat és que **les tres optimitzacions grans introduïxen tres regressions que cap tractor pot veure**, i que la porta que hauria de jutjar-les — `tractor-doctrina-maquinari.mjs` — no verifica res.

No és un problema de codi. És el mateix patró de sempre: *Saber ≠ Fer*. Ara el saber és correcte i el fer també, però **el jutge està buit**.

---

## 1 · P0 — Sang

### P0-A · El filtre `type="module"` mata l'app en temes clàssics

`wordpress-plugin/soc-de-poble.php:155`

```php
return str_replace( ' src', ' type="module" src', $tag );
```

WordPress només omet `type='text/javascript'` si el tema declara `add_theme_support('html5', ['script'])`. En un tema clàssic — el que tindrà l'ajuntament del poble — `WP_Scripts::do_item()` escriu:

```html
<script type='text/javascript' src='...soc-de-poble.standalone.js' id='soc-de-poble-js'></script>
```

I el `str_replace` el deixa així:

```html
<script type='text/javascript' type="module" src='...'></script>
```

**Atribut `type` duplicat.** El parser d'HTML es queda amb el PRIMER i descarta el segon. El bundle es carrega com a script clàssic, la primera sentència `import` és un `SyntaxError`, i l'app no arranca. Pantalla en blanc, sense missatge.

El pitjor: en un tema de blocs modern funciona. **Falla exactament en els llocs on s'ha de desplegar.**

Arreglament — no tocar el `$tag`, construir-lo:

```php
add_filter( 'script_loader_tag', function ( $tag, $handle, $src ) {
	if ( SDP_HANDLE !== $handle ) return $tag;
	return sprintf(
		'<script type="module" src="%s" id="%s-js"></script>' . "\n",
		esc_url( $src ), esc_attr( $handle )
	);
}, 10, 3 );
```

### P0-B · La finestra d'injecció de Sollutia s'ha tancat, i s'ha tancat al revés

`src/host.js:186` documenta la llei:

> «només arriba a temps un `<script>` SÍNCRON del host. Amb `defer`, `async` o `type="module"` […] el host arriba tard»

Amb la v1.4.0 el bundle **és** un mòdul. Els mòduls s'executen diferits. Per tant:

| Script del host | Quan corre | Resultat |
|---|---|---|
| `<script>` síncron | **abans** del bundle | `window.SocDePoble` no existix → injecció impossible |
| `type="module"` | després del bundle | depén de si el `setTimeout(0)` guanya la cursa contra el següent script diferit — no està especificat |

El comentari no és obsolet: **ara diu exactament el contrari de la veritat**. Un integrador de Sollutia que el seguisca al peu de la lletra escriurà un `<script>` síncron i tindrà `undefined`.

La petorreta diu «la integració actual és online i Sollutia-first». **Ara mateix Sollutia no pot injectar res.**

### P0-C · `tractor-enxufe.mjs` certifica precisament el que no mira

La porta imprimix:

> `✅ El port és abastable, el contracte quadra i el pany es tanca on toca.`

Comprova E1 (ningú importa `supabaseBackend` fora del port), E2 (contracte sincronitzat), E3 (el `freeze` no viu al cicle de vida), E4 (una sola superfície global). Les quatre són **forma estàtica**. Cap toca la paraula *abastable*:

- no llig `wordpress-plugin/soc-de-poble.php`
- no sap que hi ha un filtre `type="module"`
- no comprova cap finestra temporal

La llei que va motivar la porta (auditoria 260830) era una llei **de temps**. La porta que se'n va derivar és **d'estructura**. Per això va tornar a passar en verd el mateix dia que la llei tornava a ser inassolible.

**E2 té a més un forat mecànic.** El regex és `^export const (\w+) = `. `backendPort.js` exporta també:

```js
export function destroy() {
  if (currentImpl && typeof currentImpl.destroy === 'function') currentImpl.destroy();
}
```

`destroy` **no és al `CONTRACTE_BACKEND`** i `supabaseBackend.js` **no l'exporta**. És un no-op permanent i silenciós. La llei E2 diu «el contracte i els exports del port no divergixen»; divergixen; la porta no ho veu perquè només mira `export const`.

**E4 és cec** a `window['x'] =`, a `||=`/`??=`, i a `Object.defineProperty(window, …)` — que és el mecanisme que usa `exposaGlobal()`. La porta no pot veure l'única superfície global que ella mateixa autoritza.

### P0-D · `tractor-doctrina-maquinari.mjs` és una porta buida

260 línies, capçalera magnífica («LA MORT DEL CISMA DE L'A10»), cinc lleis. La política que li dona contingut és `tooling/gates/maquinari-baseline.json`, i és sencera així:

```json
{
  "baseline": { "nom": "2022", "declaracio_canonica": ".agents/BASELINE.md",
                "minims": { "safari_ios": "16.0", "chrome": "100", "firefox": "100" } },
  "stubs_css": { "prohibit": false, "motiu": "…" }
}
```

No hi ha `abast_doctrina`. No hi ha `termes_prohibits_en_doctrina`. No hi ha `prohibits_css`. No hi ha `prohibits_js`. El codi fa:

```js
for (const abast of pol.abast_doctrina ?? [])            // M2 → 0 iteracions
escaneja(abs, pol.prohibits_css ?? [], 'M3', …)          // M3 → 0 patrons
escaneja(abs, pol.prohibits_js  ?? [], 'M4')             // M4 → 0 patrons
if (pol.stubs_css?.prohibit) { … }                       // M5 → false, saltat
```

**M2, M3, M4 i M5 donen ✅ automàtic.** M1 comprova un `existsSync`. La porta que governa el maquinari verifica **que existix un fitxer**, i després escriu:

> `✅ Doctrina i codi diuen el mateix sobre quin maquinari se suporta.`

### P0-E · El cisma de l'A10 ha tornat, i l'ha tornat el Mestre

`.agents/BASELINE.md`, canònic, signat 260830:

> «Tot suport a navegadors o dispositius anteriors (**com l'iPad A10 / iOS 15**) ha sigut **formalment i definitivament revocat** per decisió del Mestre.»

Aquesta petorreta, 260903:

> «Estem optimitzant fort per al **Baseline 2022 (iPad A10)**.»

La porta que existix per a impedir això no pot veure-ho perquè M2 no té àmbit. Cal decidir-ho **ara**, i no en prosa: o `BASELINE.md` canvia, o la petorreta és nul·la. Mentrestant hi ha dos objectius de rendiment simultanis i incompatibles, que és com es va arribar als dotze documents contra un LEDGER.

Nota tècnica que decidix el debat: la teua pròpia P0-4 (`adoptedStyleSheets`) **necessita Safari 16.4**. El baseline diu 16.0. Al sòl declarat, `new CSSStyleSheet()` llança i cau al `<style>` per instància — el defecte que la P0-4 deia haver tancat. **El baseline i el codi ja no quadren, i la porta ho firma en verd.**

### P0-F · Code-splitting sense cap xarxa sota

Zero coincidències de `vite:preloadError` en tot `src/`. Amb 24 rutes en `lazy()`:

1. Un chunk que falla → `Suspense` propaga → l'`ErrorBoundary` de `PedraSecaEmbed` substituïx **tota** l'app per «No s'ha pogut carregar Sóc de Poble».
2. Pitjor, a `host.js:arrenca()`:

```js
const supabaseImpl = await import('./data/supabaseBackend.js');
…
freezeImplementation();
defineCustomElement();   // ← mai s'arriba ací si l'import rebutja
```

Si eixe chunk no baixa, `defineCustomElement()` no es crida, `<soc-de-poble>` no s'actualitza mai, i l'usuària veu **una pàgina en blanc amb un `console.error`**. Cap missatge.

Abans de la v1.4.0 hi havia un sol fitxer: baixava o no baixava. Ara hi ha N fitxers i **N oportunitats de mig-fallar**. El públic objectiu és gent gran amb cobertura rural. Això no és un cas límit; és el dimarts.

Mínim exigible:

```js
window.addEventListener('vite:preloadError', (e) => { e.preventDefault(); /* reintent + avís visible */ });
```

…i un `catch` a `arrencaAuto()` que pinte alguna cosa al DOM, no a la consola.

### P0-G · Comptes fantasma

`src/data/supabaseBackend.js:534`

```js
export async function registerWithEmail(email, password, name, config = {}) {
  const { hasSupabaseConfig } = getResolvedConfig(config);
  if (!hasSupabaseConfig) {
    const mockUser = usuariSimulat(email, name);
    setVal('socdepoble-jwt', 'mock-jwt-token');
    setVal('socdepoble-user', mockUser);
    return { access_token: 'mock-jwt-token', user: mockUser };
  }
```

`hasSupabaseConfig` és `Boolean(supabaseUrl && supabaseAnonKey)`. Després de la frontera de credencials de 260903 — que està **ben feta** — eixos valors només ixen de `SDP_SUPABASE_URL` i `SDP_SUPABASE_ANON_KEY`. Si l'administrador no els ha definit a `wp-config.php` (l'estat per defecte d'una instal·lació nova), el camí fals s'activa **en producció**.

Una dona del poble s'apunta, rep «Benvingut de nou!», es veu registrada, i **no existix enlloc**. Cap error. Cap traça.

`host.js` argumenta amb raó que arrencar amb un backend buit «és pitjor que no muntar-se». La capa d'autenticació fa exactament el contrari. **Fail-closed a l'arrencada, fail-open al registre.** Si no hi ha configuració, ha de llançar.

---

## 2 · P1 — Ferides que sagnen a poc a poc

**El `refresh_token` viu a `localStorage` de l'origen de WordPress.** `src/config/storage.js` raona la modelització d'amenaces perfectament… per al verificador PKCE:

> «quedaria a l'abast de qualsevol script de la pàgina amfitriona (Sollutia, WordPress) indefinidament»

Exacte. I el `refresh_token` — credencial de llarga vida, reemissora d'accés — es queda allà. Cada plugin, cada tema, cada tag d'analítica d'eixe domini el pot llegir. **S'ha protegit el bé menor i s'ha deixat el major on es deia que no podia estar.**

**El forat de `tractor-persistencia` està escrit al codi com a TODO.** `storage.js:52`:

> «⚠ tractor-persistencia.mjs (L2) només vigila `localStorage.`. Amplia'l perquè vigile també `sessionStorage.`»

Confirmat: `if (/localStorage\s*\./.test(net) && rel !== CAPA)`. La correcció està redactada en un comentari en compte d'estar feta. És *Saber ≠ Fer* literal, en una línia.

**`App.jsx` reescriu el `box model` de la pàgina amfitriona.** Sense guarda, a cada muntatge:

```js
style.textContent = `html, body { height:100%; width:100%; margin:0; padding:0; } #root {…}`;
document.head.appendChild(style);
```

Etiquetat «to fix #root height dynamically via HMR». Tres problemes: (1) és un pedaç de desenvolupament que viatja a producció; (2) `#root` no existix dins del Shadow DOM — la regla és morta; (3) `html, body { margin:0 }` **trenca la capçalera i el peu del tema de WordPress** a qualsevol pàgina que incruste el bloc. Vas fer `pinta-amfitrio` opt-in per a un únic color de fons, amb un comentari de vint línies explicant per què. Dos-cents línies més avall es repinta el document sencer sense demanar permís.

**119 kB de CSS dins del chunk d'entrada.** `import styles from './css/index.css?inline'` posa `index.css` (118.779 bytes) com a **cadena JS** a l'entrada. Conseqüències:

- `cssCodeSplit: false` al `vite.standalone.config.js` és **configuració morta**: amb `?inline` no hi ha cap actiu CSS a dividir.
- El full es parseja dues voltes: com a JS i després per `replaceSync`.
- No es pot cachejar per separat ni el parseja el fil de CSS.
- **Has dividit 24 rutes i has deixat el full sencer indivisible.** Qui entra a `/mur` baixa el CSS de Notes, del Mercat i del panell de disseny.

**`lucide-react` continua al camí crític.** Vas construir `src/icons.jsx` amb 7 icones a mà — el moviment Pedra Seca correcte. Però `src/config/sections.js:1` importa **17 icones de `lucide-react`**, i `App.jsx` importa `sections.js` estàticament. Resultat: dos sistemes d'icones, l'extern a l'entrada, i `Search`, `Settings`, `UserRound` i `Globe` **existixen als dos**. La dependència que volies llevar no s'ha llevat; s'ha duplicat.

**`touchmove` amb `passive:false` sobre el contenidor de scroll.** El pull-to-refresh registra `mainEl.addEventListener('touchmove', onTouchMove, { passive: false })` i crida `preventDefault()`. Això lleva el camí ràpid del compositor **per a tot el scroll de `main`**, no només per al gest. En un A10 això és el jank que després es busca a un altre lloc.

**Un sol `<Suspense>` per a totes les rutes, amb Preact.** Cada primera navegació esborra la pantalla i pinta «Carregant contingut del poble…». Amb React 18 això es resol amb `startTransition`, que manté la UI anterior mentre baixa el chunk. **`preact/compat` implementa `startTransition` com a crida síncrona: eixa eixida no existix.** No és un error; és una conseqüència estructural de combinar Preact amb divisió per ruta, i s'ha d'assumir explícitament o s'han d'agrupar rutes.

---

## 3 · P2 — Cohesió

**Tres versions, cap acord.**

| Font | Valor |
|---|---|
| `package.json` | `1.0.0` |
| `soc-de-poble.php` (capçalera i `SDP_VERSIO`) | `1.1.0` |
| Aquesta petorreta | `1.4.0` |

`SDP_VERSIO` és alhora la clau de cache-busting de WordPress i el `$config['version']` que consumix `assetResolver.js`. Tres números, i el que mana és el que ningú ha tocat.

**Etiquetes mentideres** — la teua pròpia regla, a `core-restauracio-segellada`:

| Fitxer | Diu | Realitat |
|---|---|---|
| `soc-de-poble.php:18` | «És un IIFE clàssic, NO un mòdul ESM: **per això no hi ha cap filtre `type="module"`**» | el filtre és a la línia 155 del mateix fitxer |
| `host.js:198` | «El build standalone no és ESM» | `formats: ['es']` |
| `host.js:200` | «És l'**ÚNICA** assignació a `window` del projecte» | `PedraSecaEmbed.jsx` assigna `window.__SDP_GLOBAL_ERRORS_BOUND__` |
| `main.jsx:2` | «Punt d'entrada del build de desenvolupament **i del standalone**» | el standalone entra per `wp-standalone.js` |

La quarta és la que fa mal: E4 **s'ha esmenat** per a permetre `__SDP_GLOBAL_ERRORS_BOUND__` a `PERMESOS_GLOBAL`. La porta es va relaxar per a que passara la violació, i la prosa no es va actualitzar. També s'hi permet `__SDP_OUTBOX_QUARANTINED__`, d'una outbox que el gir a Quadrant A va eliminat.

**Zero proves sobre `src/`.** Hi ha 6 fitxers de test, tots a `tooling/wiki/`. `npm test` no és ni a `run-portes.mjs` ni al script `build`. `vitest` i `@testing-library/react` estan instal·lats i no s'executen mai. **35 portes verifiquen la forma del codi. Res verifica que l'aplicació pinte.** Un `render(<App/>)` que passe hauria trobat P0-F en cinc minuts.

**`tenantId` és sempre el mateix.** `getResolvedConfig` cau a `'11111111-2222-3333-4444-555555555555'` i el plugin de WordPress **no assigna `tenantId` enlloc**. La multi-tenancy d'una plataforma per a *pobles* és nominal: tots escriuen al mateix llogater.

**La PWA no s'instal·la al dispositiu objectiu.** `vite.config.js` declara només icones `image/svg+xml`. Safari a iOS/iPadOS **no accepta SVG** per a «Afegir a la pantalla d'inici»; vol PNG i `apple-touch-icon`. A més `theme_color: '#ffffff'` està escrit a mà, fora del cànon cromàtic que `tractor-cromatic` vigila. I `App.jsx` esborra `socdepoble-app-snapshot-v1` a cada muntatge: **la PWA no té dades amb què estar fora de línia.**

**Build standalone:** `assetFileNames: 'assets/[name][extname]'` — els chunks porten hash, els actius no. Amb la caché de WordPress i qualsevol CDN, els actius queden ranci després d'un desplegament. I `sourcemap: true` publica els mapes a producció.

**`sanejaConfig` — bypass de protocol-relatiu.** Es bloqueja `//`, però l'analitzador WHATWG tracta `/\` com a `//` en esquemes especials: `new URL('/\\evil.com', origin)` → `https://evil.com/`. `cruUrl.startsWith('//')` no ho veu. `fontsHref` acaba com un `<link rel="stylesheet">` **al `head` del document amfitrió**. A més `oauthRelayUrl` és a `CLAUS_PERMESES` però **no** a `CAMPOS_URL`: un camp que és una URL pel nom i que no passa per la validació d'URL.

**Empaquetat incoherent:** `react`, `react-dom` i `react-router-dom` estan a `devDependencies` i alhora a `peerDependencies`. Tot va empaquetat, així que les `peerDependencies` menteixen a qui llija el `package.json`. `postcss-prefix-selector` és una eina de build i està a `dependencies`.

---

## 4 · El que està ben fet

No tot és deute, i dir-ho també és Trellat:

- **El farcell és fidel al byte.** 453/453. El contracte d'abast declarat, els absents declarats. Això és exactament el que faltava el juliol.
- **`skills_index.json` es regenera idèntic.** He executat `build_skills_index.mjs`: 0 línies de diferència amb el fitxer comitejat. 10 core, 4 efímeres, 122 gallets. El compilador i l'artefacte diuen el mateix. Un semàfor verd que sí que mira.
- **El triangle contracte/port/implementació quadra.** 14 mètodes al `CONTRACTE_BACKEND`, 14 delegats al port, 14 exportats per `supabaseBackend`. Cap divergència en cap direcció (excepte `destroy`, apuntat més amunt).
- **La frontera de credencials** (P0 260903) està ben raonada i ben tancada. El vector de `shortcode_atts` era real i està mort.
- **La cursa de `arrenca()`**: marcar la fase síncronament i memoritzar la promesa és la correcció correcta.
- **P0-6 «germà assassinat»** i **P0-7 avisos compartits**: dos defectes que només es troben pensant en l'usuari real (dos blocs de Gutenberg a la mateixa pàgina). Ben trobats i ben tancats.
- **RLS present** a `supabase/schema.sql` (36 referències a polítiques).
- **`src/icons.jsx`** és la direcció correcta. Només falta acabar-la.

---

## 5 · Ordre d'atac

| # | Acció | Cost |
|---|---|---|
| 1 | Reescriure el filtre `script_loader_tag` amb `sprintf`, no `str_replace` | 5 min |
| 2 | Decidir el cisma A10: actualitzar `BASELINE.md` **o** retirar l'A10 de la petorreta | 0 min, 1 decisió |
| 3 | Omplir `maquinari-baseline.json` amb `prohibits_js`, `prohibits_css`, `abast_doctrina` | 1 h |
| 4 | `vite:preloadError` + `catch` visible a `arrencaAuto()` | 1 h |
| 5 | Fer llançar `registerWithEmail`/`loginWithEmail` quan `!hasSupabaseConfig` | 15 min |
| 6 | Llevar la injecció `html, body` d'`App.jsx` | 5 min |
| 7 | Reescriure la documentació d'injecció de `host.js` per al món ESM, i afegir a `tractor-enxufe` una llei E5 que llija el PHP | 2 h |
| 8 | `refresh_token` fora de `localStorage` (cookie `HttpOnly` via relay, o acceptar-ho per escrit al LEDGER) | 1 dia |
| 9 | Migrar les 17 icones de `sections.js` a `icons.jsx` i traure `lucide-react` de `dependencies` | 2 h |
| 10 | Un sol test: `render(<App/>)` i `npm test` dins de `run-portes.mjs` | 2 h |
| 11 | Unificar la versió en una sola font | 30 min |
| 12 | Ampliar `tractor-persistencia` L2 a `sessionStorage` | 10 min |

Els punts 1–6 són d'avui. El punt 10 val més que els altres onze junts: **és l'únic que canvia la classe de defecte que el sistema pot detectar.**

---

## 6 · Valoració estructural

El sistema de portes és seriós i no té equivalent en projectes d'aquesta grandària. El problema no és la quantitat sinó la **classe**: 35 tractors verifiquen *que el codi tinga la forma correcta*, i cap verifica *que el codi faça la cosa correcta*. Per això les tres regressions de la v1.4.0 (mòdul ESM, chunks diferits, CSS inlined) han travessat la cadena sense que sonara res: no canvien cap forma. Canvien el temps i la xarxa, que és on no mira ningú.

Dos patrons per anotar al `CORE_Registre_Automillora`:

1. **Una porta amb la política buida és pitjor que cap porta.** `tractor-doctrina-maquinari` genera confiança activa i no en té dret. Regla proposada: tota porta amb política externa ha de comprovar que la política **té contingut** i eixir amb codi 2 si no. Un `?? []` que produïx un ✅ és una mentida.
2. **Quan una llei parla de temps, la porta ha de mesurar temps.** L'enxufabilitat és una llei d'ordre d'execució i s'ha mecanitzat com a anàlisi d'imports. Va tornar a trencar-se el mateix dia.

---

**Ancoratge de Seguretat:** [[00_INDEX_ESCRIPTORI]]
