---
tipus: acta
estat: lliurat
description: Auditoria post-destrucció i robustesa d'integració amb Sollutia. Seient Núm. 5 (Claude, Auditor Sènior).
---

# AUDITORIA POST-DESTRUCCIÓ — SEIENT NÚM. 5

**Verificació del bundle:** 398/398 fitxers extrets i validats contra el SHA-256 del manifest. Zero discrepàncies. El que ve davall no és lectura de codi: són funcions del vostre repositori executades amb entrades reals.

---

## VEREDICTE

Demà no podeu connectar açò. No per una escletxa ni per una cursa: **l'aplicació no arriba a pintar mai**, en cap ruta, en cap navegador, amb backend o sense. És determinista i el podeu reproduir en trenta segons.

Hi ha dos defectes independents, cadascun suficient per a matar la demostració, i un tercer que la mataria només en l'entorn de Sollutia i no en el vostre. A més, el document que Sollutia llegirà demà descriu un producte que ja no existeix.

---

## P0-1 · L'app peta en el primer render. Sempre.

`RouterContext.jsx:131` construïx els patrons així:

```js
'^' + path.replace(/\//g, '\\/')          // escapa les barres
          .replace(/\*/g, '(.*)')
          .replace(/:([^/]+)/g, '(?<$1>[^/]+)')   // ← ací
```

L'ordre està invertit. Quan arriba el tercer `replace`, la cadena ja porta contrabarres. `[^/]+` **no exclou la contrabarra**, així que se l'emporta dins del nom del grup:

```
/e/:slug/*   →   /^\/e\/(?<slug\>[^/]+)/(.*)$/   →   SyntaxError: Invalid capture group name
```

Peta tot paràmetre que no siga l'últim segment. Executat contra la vostra taula real:

```
75 patrons declarats · 2 llancen SyntaxError
   /e/:slug/*            (App.jsx:527)
   :sectionId/:itemId    (App.jsx:617)
```

Això seria un 404 lleig si es quedara ahí. No es queda. `IdentitatContext.jsx:15`:

```js
const entitatMatch = matchPath('/e/:slug/*', location.pathname);
```

Sense condició, en el cos del proveïdor, en **cada render**. `IdentitatProvider` embolica `<App/>` sencera. L'`ErrorBoundary` de `PedraSecaEmbed` està per damunt i el caça, així que el que veurà Sollutia demà, en la primera càrrega, en la URL que siga, és:

> **No s'ha pogut carregar Sóc de Poble**
> `SyntaxError: Invalid regular expression…`

No és intermitent. És el 100% de les càrregues.

---

## P0-2 · Encara arreglant això, tot `/jo/**` és un 404 silenciós

`ActorRoutes` (App.jsx:590-620) declara les rutes en **idioma react-router v6**: relatives, sense barra inicial.

```jsx
<Route path="multimedia" element={<MultimediaSection />} />
<Route path="perfil/:agentId" element={<ProfileSection … />} />
<Route path=":sectionId/:itemId" element={<ItemDetailSection />} />
<Route path="*" element={<NotFoundPage />} />
```

Però el vostre `Routes` casa contra el `pathname` **sencer**, amb àncores `^…$`, i no té cap noció de prefix consumit. Traça real per a `/jo/multimedia`:

```
no casa   /              no casa   el-meu-perfil
no casa   xat            no casa   perfil
no casa   mur            no casa   perfil/:agentId
no casa   mercat         …
no casa   multimedia     PETA      :sectionId/:itemId
no casa   pobles         CASA ►►►  *
```

`multimedia` no casa `/jo/multimedia` perquè li falta la barra. Cap relativa casa. El comodí final se les enduu totes. **Tota la secció d'identitat activa —Xat, Mur, Mercat, Notes, Perfil, Dispositius— pinta `NotFoundPage`.** I com que no llança, no hi ha error a la consola: és mut.

Vau extirpar `react-router-dom` però vau conservar la taula de rutes escrita per a `react-router-dom`. El recanvi implementa un subconjunt que no inclou el que la taula fa servir.

---

## P0-3 · `basename` és codi mort. Això és el que us mata en Sollutia i no ací.

`PedraSecaEmbed.jsx:359-361` calcula el basename a partir de `basePath` amb cura, i `:72` el passa:

```js
const routerProps = config.basename ? { basename: config.basename } : {};
…
<RouterComponent {...routerProps}>
```

I `RouterContext.jsx:177`:

```js
export function BrowserRouter({ children }) {
  return <RouterProvider>{children}</RouterProvider>;
}
```

`basename` s'ignora. `RouterProvider` llig `window.location.pathname` cru i `navigate()` escriu `pushState` cru. Incrustats sota, posem, `sollutia.example/el-meu-poble/`:

- `currentPath` és `/el-meu-poble/`. Cap `<Route>` casa. `Routes` torna `null`. **Pantalla en blanc, sense error.**
- El primer `navigate('/jo/xat')` reescriu la barra d'adreces del host a `sollutia.example/jo/xat`. Si l'usuari recarrega, WordPress torna un 404 seu. **Heu segrestat la URL d'un lloc que no és vostre.**

En local no ho veureu mai, perquè arreleu en `/`. És exactament el tipus de defecte que només apareix davant del client.

---

## P0-4 · `TypeError` garantit en cada desmuntatge

`_despintaAmfitrio()` és `static` dins de `class SocDePobleElement` (línia 465). Es crida dues vegades com a mètode d'un objecte diferent:

```js
// línia 313
else PedraSecaEmbed._despintaAmfitrio();
// línia 555
if (activeElements.size === 0) { destroyToastSystem(); PedraSecaEmbed._despintaAmfitrio(); }
```

`PedraSecaEmbed` és el **component funcional de React** de la línia 69. No té eixe mètode. `TypeError: PedraSecaEmbed._despintaAmfitrio is not a function`, sense caçar, en la consola del host, cada volta que se'n va l'última instància o que es lleva `pinta-amfitrio`.

Correcció: `SocDePobleElement._despintaAmfitrio()` en els dos llocs, i moure `_fonsPrevi` a la classe per coherència.

---

## P0-5 · El document vinculant descriu un altre producte

`_wiki_de_poble/02_Saber/ESTANDARD_Integracio_React.md`, `estat: canonic`, capçalera: *«Document vinculant per a l'equip de Sollutia»*. És el que llegiran esta nit. Contradiu el codi en set punts. Dos són letals.

**Letal A — l'exemple canònic deixa l'app morta.** L'exemple d'integració injecta:

```js
backend: { loadAppData: …, getCurrentUser: … }
```

`loadAppData` **no és a `CONTRACTE_BACKEND`**. `configura()` el classifica com a desconegut i l'ignora amb un `console.warn`. Queda injectat només `getCurrentUser`. I `arrenca()` és de mode estricte:

```js
if (injectats.length > 0) {
  const pendents = CONTRACTE_BACKEND.filter(k => !injectats.includes(k));
  if (pendents.length > 0) throw new Error('[host] Injecció incompleta…');
}
```

Un mètode injectat, 28 pendents, excepció. Seguir el manual al peu de la lletra produïx una app que no es munta.

**Letal B — l'excepció no es veu.** El manual diu *«El host no necessita cridar `arrenca()`»*, i el capçal de `host.js` documenta el patró contrari amb `arrenca()` explícit i **sense `.catch()`**. La pintada de la caixa roja d'error viu només dins de `arrencaAuto()`. Pel camí documentat en `host.js`, l'excepció ix com a *unhandled rejection* i l'usuari veu blanc.

La resta:

| El document promet | El codi fa |
|---|---|
| «arrencarà en el següent tick de **microtasques**» | `setTimeout(…, 0)` — macrotasca. El propi `host.js:239` ho corregix. Dos manuals incompatibles en el mateix repositori. |
| «encapsula el seu propi **HashRouter**» | No existix cap HashRouter. Només `BrowserRouter`. És justament el que necessita un mòdul incrustat. |
| «peer deps: react 19, react-dom 19, **react-router-dom 7**» | Build IIFE amb **Preact dins**. `react-router-dom` extirpat. Contradiu la LLEI 1 del mateix document. |
| «fa servir `vite-plugin-pwa`» | No és a `package.json`. |
| «cap modificació d'estils globals sobre `html` o `body`» | `_pintaAmfitrio()` escriu `document.documentElement.style` i `carregarFonts()` injecta `<link>` al `<head>`. És *opt-in*, però el document diu «cap». |
| «`data-theme` a la seua arrel `.sdp-root`, mai al body» | `this.dataset.theme` va a l'**element amfitrió**, no a `.sdp-root`. Si Sollutia estila `.sdp-root[data-theme]`, el mode fosc no s'aplica. |

Aquest document és el vostre risc reputacional més gran de demà, per damunt del codi. El codi el podeu arreglar esta nit. Un document `canonic` que menteix el llegiran abans que vosaltres parleu.

---

## P1 · Fugues, riscos i coses que us cauran a la segona setmana

**F1 · Comptador de fonts que no baixa mai.** `_recalcularConfig()` (PedraSecaEmbed:377-385) crida `carregarFonts()` cada volta que `canviat` és cert, encara que `fontsHref` no haja canviat. `descarregarFonts()` només es crida una volta al desmuntatge. Cada canvi d'atribut en calent deixa el comptador un punt més amunt; mai arriba a zero; el `<link>` es queda al `<head>` del host per sempre. Corregiu-ho movent la crida dins del `if (oldFontsHref !== nou)`.

**F2 · Desmuntatge diferit que no arriba mai.** `disconnectedCallback` (línies 568-584): si el document està ocult, s'ajorna el desmuntatge amb un listener de `visibilitychange` que reté `this`. Si l'usuari no torna a eixa pestanya, l'arbre de React sencer i el node desconnectat queden vius i no es poden recollir. En un host que intercanvia contingut amb la pestanya en segon pla, s'acumula. Poseu-hi un temps màxim.

**F3 · Cap `base` a la configuració de Vite.** Ni a `vite.config.js` ni a `vite.standalone.config.js`. Per a `build:web` (`dist/`), tot referencia `/assets/…` en absolut. Servit des d'un subcamí, els trossos donen 404 i `arrenca()` es rebutja: exactament el que el vostre gestor de `vite:preloadError` (`host.js:73`) està esperant sense poder resoldre. Per al build IIFE és menys greu, però `resolveAsset()` depén de `pluginUrl` i `main.jsx:35` el codifica a `'/'`.

**F4 · `main.jsx` segresta `#root`.** El build standalone és el mateix `main.jsx`, que injecta un `<soc-de-poble>` en qualsevol `#root` que trobe, amb `pluginUrl: '/'` i credencials buides. `#root` és un identificador extraordinàriament comú en temes i connectors de WordPress. Si la pàgina de Sollutia en té un, apareix una segona instància fantasma amb configuració errònia. Poseu-hi un identificador vostre (`#sdp-root`) o feu que el standalone tinga la seua pròpia entrada sense auto-injecció.

**F5 · L'ordre dels àlies de Vite emmascara una entrada.** A `vite.config.js:36-42`, `'react'` va abans que `'react/jsx-runtime'`. `@rollup/plugin-alias` casa per prefix i pren el primer, així que `react/jsx-runtime` es resol via l'entrada `'react'` i l'entrada explícita és morta. Ara funciona per casualitat (`preact/compat/jsx-runtime` existix). Poseu les entrades més específiques primer.

**F6 · Dependències declarades que no s'usen.** `react: ">=18.0.0"` i `react-dom: ">=18.0.0"` són a `dependencies` però estan aliasades a `preact/compat`: no entren mai al build. Rang sense sostre superior, a més. Per doctrina Pedra Seca, fora, o baixeu-les a `devDependencies` amb versió fixada.

**F7 · CSP.** El `Content-Security-Policy` de `index.html` només protegix la vostra pàgina de desenvolupament. Demà mana la CSP de Sollutia. Necessiteu, com a mínim, que la seua permeta `connect-src https://*.supabase.co wss://*.supabase.co` i `style-src 'unsafe-inline'` (pel `<style data-sdp-fallback>` quan no hi ha `adoptedStyleSheets`). **Pregunteu-ho abans d'endollar res**; és el fracàs més humiliant possible i es resol amb un correu.

**F8 · OAuth.** `oauthRelay.js` està ben pensat —PKCE, relé fix, tres camins de tornada— però el propi capçal avisa que `EXCHANGE_GRANT` i `EXCHANGE_FIELD` s'han de verificar contra la vostra versió de GoTrue. A més, `RELAY_PER_DEFECTE = 'https://auth.socdepoble.org/callback'` ha d'estar a la llista blanca de Supabase i l'origen de Sollutia ha d'estar acceptat pel relé. Feu la prova amb el domini de Sollutia **abans**, no davant d'ells.

**El contracte, en canvi, està sa.** He creuat `CONTRACTE_BACKEND` (29 mètodes), les delegacions de `backendPort.js` i els exports de `supabaseBackend.js`: **zero deriva**. El treball de sincronització de les sessions anteriors aguanta. Això sí que ho podeu ensenyar.

---

## L'ENRUTADOR: recanvi, no pedaç

Adjunte `RouterContext.jsx` complet. Corregix P0-1, P0-2, P0-3 i, a més:

- **Grups numerats en lloc de grups amb nom.** Els grups amb nom són ES2018. Amb el vostre públic objectiu en iPads vells, això sol ja era motiu per a canviar-ho.
- **Comodí opcional.** `/xat/*` ara casa `/xat`. Abans no: `TextRoute` redirigix a `DEFAULT_SECTION_PATH` (`/xat`) i el mur enllaça `/notes`, `/mercat`… sense barra final. Totes eixes eren pantalles en blanc.
- **Classificació per especificitat** (estàtic 10, paràmetre 3, comodí −2). La vostra taula està escrita per a la classificació de react-router: `/jo` ha de guanyar `/jo/*`, `perfil` ha de guanyar `:sectionId/:itemId`. Amb primer-que-casa, reordenar dues línies canviava el comportament en silenci.
- **`navigate` amb identitat estable i estat de cerca com a cadena.** Abans, `navigate` es recreava cada render i `setSearchParams(new URLSearchParams(…))` mai es curtcircuitava (objecte nou sempre). `<Navigate>` depén de `[navigate, to, replace]`: si el destí era la ruta actual, el bucle no s'aturava. *Maximum update depth exceeded*. Ara `<Navigate>` compara amb la ubicació actual abans de moure's.
- **`pushState`/`replaceState` instrumentats.** No disparen `popstate`. Si Sollutia, una analítica o un altre connector toca l'historial, abans us quedàveu desincronitzats.
- **`Link` civilitzat.** Respecta Cmd/Ctrl/Maj/Alt, `target`, enllaços externs i `defaultPrevented`, i crida el `onClick` del consumidor **abans** de decidir. Abans, Cmd+clic no obria pestanya nova: navegava en la mateixa.
- **`HashRouter` de veres** (el que promet el vostre document) i **`MemoryRouter` de veres** (abans era un àlies de `BrowserRouter`: en proves tocava la URL real).

Verificat contra la vostra taula real:

```
75 patrons · 0 peten
/jo/multimedia         → /jo/*   ▸ multimedia
/jo/perfil/anna        → /jo/*   ▸ perfil/:agentId  {agentId:"anna"}
/jo/mur/123            → /jo/*   ▸ :sectionId/:itemId  {sectionId:"mur",itemId:"123"}
/e/rentonar/perfil/pep → /e/:slug/* ▸ perfil/:agentId  {agentId:"pep"}
/xat                   → /xat/*  ▸ /
```

**Una cosa que heu de fer vosaltres:** `IdentitatContext.jsx` continuarà cridant `matchPath` en cada render. Ja no petarà, però és treball inútil en cada repintada. Emboliqueu-lo amb `useMemo(…, [location.pathname])`. En un iPad de 2015 això es nota.

---

## LA PORTA QUE FALTAVA

Adjunte `tractor-rutes-compila.mjs`. Executada contra el codi d'aquest bundle:

```
tractor-rutes-compila · 76 patrons examinats
  ERROR [C1] src/app/App.jsx: el patró "/e/:slug/*" no compila…
  ERROR [C1] src/app/App.jsx: el patró ":sectionId/:itemId" no compila…
  ERROR [C2] src/app/contexts/IdentitatContext.jsx: el patró "/e/:slug/*" no compila…
PARAT. 3 patró(ns) que trenquen l'app abans del primer píxel.
```

Contra el recanvi: `Passa. Tots els patrons compilen i casen.`

**La lliçó importa més que la porta.** Teniu 41 tractors. `tractor-rutes-web.mjs` vigila la taula de rutes i és una bona porta: creua `App.jsx`, `sections.js`, `navigation.js` i `seo-routes.json`, i té set lleis. Cap va detectar açò, perquè totes comparen **declaracions contra declaracions**. `<Route path="/e/:slug/*">` és una declaració impecable. El defecte només existix quan una funció concreta la converteix en `RegExp`.

Sis línies —cridar `pathToRegex()` dins d'un `try`— ho haurien parat el dia que es va escriure. Formulat com a llei per al vostre corpus:

> **Quan una funció pura decidix si l'app pinta o no pinta, la porta l'ha d'executar, no llegir-la.**

Passeu-la per la resta de portes i mireu quantes certifiquen ortografia en lloc de comportament. Segons el vostre historial, no serà l'única.

---

## EL CERVELL: la divisió de quatre anells

Vau preguntar si `01_Ser` / `02_Saber` / `03_Actuar` / `04_Escriptori` és la divisió definitiva. Els números:

```
 4 fitxers ·  20 KB · 01_Ser
56 fitxers · 274 KB · 02_Saber      ← 89% de tot
 1 fitxer  · 0,5 KB · 03_Actuar
 2 fitxers ·   2 KB · 04_ESCRIPTORI
```

**No teniu una divisió de quatre anells. En teniu una d'un anell amb tres etiquetes.** I `03_Actuar` no és que estiga poc omplit: el seu únic fitxer és un índex que declara que *«els índexs s'ompliran progressivament»*. És una promesa, no un anell. La seua pròpia norma —«el codi executable queda fora d'aquest anell»— garantix que no puga contindre res més que punters. Això no és un germà de `02_Saber`: és una taula de continguts.

Tres defectes concrets, tots barats:

**C1 · La caixa desbordada no s'ha subdividit.** `02_Saber` ja té subcarpetes (`07_plantilles`, `architecture`, `codex_huma`, `obsidian_plugins`, `plantilles`, `skills`) que són una taxonomia de segon nivell no declarada enlloc, mentre els germans de primer nivell estan buits. Els eixos reals del vostre corpus no són quatre: són *identitat · arquitectura · normativa · actes · plantilles*.

**C2 · Duplicats.** `02_Saber/07_plantilles/` i `02_Saber/plantilles/` són dues carpetes de plantilles. `02_Saber/skills/` i `.agents/skills/` són dos magatzems d'habilitats amb continguts diferents. Quan la IAIA busca una plantilla, quina guanya? No està escrit enlloc.

**C3 · La nomenclatura ja s'ha trencat.** `01_Ser`, `02_Saber`, `03_Actuar` en Title_Case; `04_ESCRIPTORI` en majúscules. Dins, `07_plantilles` en minúscula i `00_INDEX_ACTUAR` en majúscula. Si l'esquema s'erosiona amb quatre carpetes, no aguantarà quaranta.

### `Title_Snake_Case` contra `CamelCase`: la resposta té una part tècnica dura

Primer, una cosa que canvia la pregunta: **Obsidian resol `[[Enllaç]]` per nom base, no per ruta.** El prefix numèric de la carpeta no participa en la resolució. `01_Saber_Cultura` contra `SaberCultura` és, per a l'enllaçat, indiferent. El que decidix si un enllaç és estable és **la unicitat del nom base**. Ara mateix teniu una sola col·lisió, però és de nou vies: `.agents/skills/*/SKILL.md`. Qualsevol `[[SKILL]]` és ambigu, i `teixidor.mjs` continua resolent amb `path.basename()` (línies 71, 98, 140, 154) — el `resolutor.mjs` conscient de rutes no està endollat.

Dit això, per a l'eternitat trieu **`snake_case` en minúscules**, i el motiu no és estètic:

- **macOS i Windows tenen sistemes de fitxers insensibles a majúscules; Linux no.** `[[ArquitecturaTecnica]]` contra un fitxer `arquitecturatecnica.md` funciona al vostre portàtil i falla al contenidor de CI. Amb tot en minúscules, la classe d'error desapareix.
- **`CamelCase` no té límit de paraula per a les eines.** `grep`, la cerca difusa i la segmentació de RAG parteixen per no-alfanumèrics. `arquitectura_tecnica_unificada` es partix en tres termes indexables; `ArquitecturaTecnicaUnificada` és un sol testimoni. Per a un sistema el propòsit del qual és que una IA recupere el fragment adequat, això és una pèrdua directa de qualitat de recuperació.
- **El guió baix sobreviu al pas per URL, YAML, JSON i noms d'ancoratge sense escapar.** El vostre corpus creua les quatre capes.

I una regla d'or, que val més que la convenció: **el nom base és la clau primària. Tracteu-lo com a tal.** Únic en tot el vault, immutable una volta creat, i el títol humà viu al `frontmatter`, no al nom del fitxer. Si voleu canviar com es diu una cosa, canvieu `description`; el fitxer no es toca mai. Així els enllaços són eterns de veres i no per disciplina.

### Proposta d'estructura

Mantindre `01_Ser` (funciona: petit, immutable, arrencada ràpida — el `.manifest.json` amb el límit de 8.000 tokens és bona enginyeria). Partir el que està desbordat i eliminar el que és fictici:

```
01_ser/          identitat, genotip, equip          (com ara)
02_saber/        arquitectura, doctrina, glossari    (només coneixement estable)
03_normativa/    lleis de pas, contractes, ESTANDARD_*   ← extret de 02
04_actes/        sessions, auditories, decisions datades ← extret de 02
05_plantilles/   una sola carpeta, fusionant les dues actuals
06_escriptori/   safata d'entrada i treball en curs
```

`03_Actuar` desapareix com a anell i es converteix en el que ja és: un índex dins de `02_saber`. Tot en minúscules, tot amb el mateix esquema.

Un criteri per a saber si un anell està ben posat: **si dues persones no coincidixen en quin anell va un fitxer nou, l'anell està mal definit.** Proveu-ho amb `Llibre_Blanc_Produccio_Pedra_Seca.md`: ¿saber o normativa? Si dubteu, ja teniu la resposta sobre `02_Saber`.

---

## ORDRE DE FEINA PER A ESTA NIT

Per prioritat estricta. Del primer al tercer, no negociable si demà voleu ensenyar res.

1. **Substituir `RouterContext.jsx`** pel fitxer adjunt. Sense això no hi ha res que ensenyar.
2. **`SollutiaElement._despintaAmfitrio`**: corregir el nom de la classe a `PedraSecaEmbed.jsx:313` i `:555`.
3. **`ESTANDARD_Integracio_React.md`**: marcar-lo `estat: obsolet` **ara mateix**, encara que no tingueu temps de reescriure'l. Un document `canonic` que menteix és pitjor que cap document. Envieu a Sollutia el bloc d'exemple correcte —contracte sencer o cap injecció— en un correu de tres línies.
4. **Preguntar a Sollutia la CSP i el camí base de muntatge.** Dos correus, esta nit. Si el basename no és `/`, el punt 1 ja ho cobrix, però ho heu de saber per a passar-lo.
5. Afegir `tractor-rutes-compila.mjs` a `run-portes.mjs`.
6. `useMemo` al `matchPath` d'`IdentitatContext`.
7. F1 (fuga de fonts) i F4 (`#root`). Poden esperar a la vesprada.

El cervell no toca res de demà. Té setmanes.

---

## UNA COSA QUE HEU FET BÉ, I NO ÉS CORTESIA

L'arquitectura de dues fases de `host.js` és correcta. El diagnòstic de la finestra d'injecció de zero mil·lisegons —que `customElements.define()` dispara `connectedCallback` de forma síncrona quan l'etiqueta ja és al DOM— és exacte, i la solució (traure el segellat del cicle de vida i memoritzar la promesa d'arrencada) és la bona. El *fail-closed* de `arrenca()` és la decisió encertada: muntar l'app sencera amb totes les crides de dades fallant és pitjor que no muntar-la.

El contracte de tres capes està sincronitzat sense una sola deriva després de tantes sessions arreglant-lo. Això és disciplina real.

El que ha fallat no és el criteri arquitectònic. És que vau reescriure l'enrutador i no vau executar-lo mai contra la taula de rutes que ja teníeu. Trenta segons de `node` ho haurien dit. La correcció no és estudiar més: és que la porta execute.

— **Seient Núm. 5 · Auditor Sènior**
