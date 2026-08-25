---
estat: "actiu"
tipus: "acta"
---

# Síntesi de l'Auditoria Pedra Seca Extrema (Consell d'IAs)

> Aquest document consolida totes les auditories rebudes de l'Honorable Consell sobre l'arquitectura front-end de Pedra Seca. Cap canvi serà executat fins que no s'hagen rebut totes les opinions rellevants i el Mestre done l'ordre d'aplicar el pla.

## 1. Gemini (Rebuda: 26/08/26 02:09)
Gemini ha realitzat una auditoria profunda i ha posat damunt la taula problemes crítics d'esquizofrenia visual i conflictes greus d'arquitectura.

### 🧨 Poda i Extirpació de Brossa
- **`DesignSection.jsx`**: Actua com un abocador d'HTML hardcodejat amb classes residuals `sosp-*`, incomplint el paradigma d'usar components React universals reals.
- **`sosp-components.css`**: Arrossega 12KB d'estils legacy que cal guillotinar completament.
- **`ConnectarSection.css`**: Ha violat la norma de Pedra Seca creant el seu propi CSS amb classes inventades (`.c-alert-foraster`). Cal fusionar-ho i eliminar l'arxiu.

### 🕸️ Deute Tècnic i SEO (Llarg Termini)
- **`useSEO.js` vs Yoast/RankMath**: El nostre codi injecta títols al `<head>` del `document` global, la qual cosa provocarà una "guerra termonuclear" amb els plugins SEO de WordPress.
- **Shadow DOM Invisible**: L'encapsulament amaga l'HTML als crawlers lents. Caldria pre-renderitzar la informació crítica des del backend de Sollutia/WP abans que la SPA React hidrate la vista.
- **Accessibilitat (ARIA)**: Falten etiquetes ARIA en botons interactius com `ActionControl`.

### 🧱 Integració i Supervivència (Entorn Hostil)
- **Routing**: `BrowserRouter` a `PedraSecaEmbed.jsx` causarà errors 404 a WP sense un *catch-all*. Gemini proposa canviar a `HashRouter`.
- **Aïllament Global**: Els listeners globals (`window.addEventListener('storage')`) a `AppDataContext.jsx` no garanteixen aïllament estricte en l'entorn de WP.
- **Fugues de CSS**: Encara que estem dins del Shadow DOM, l'`index.css` defineix selectors globals (com `body { ... }`) que podrien fugar-se en desenvolupament.

### 🤖 Blindatge del Sistema (Skills i IA)
- **Guillotina Topològica**: Gemini proposa afegir una regla estricta a `socdepoble-criteri-visual/SKILL.md` que prohibisca crear fitxers `.css` nous.
- **Eliminar Prop `className`**: Obligar futures IAs a no utilitzar la propietat `className` lliurement en React, forçant-les a utilitzar només les variants de propietats ja existents als components Pedra Seca (ex: `UniversalCard`).

## 2. Grok (Rebuda: 26/08/26 02:09)
Grok ha realitzat una anàlisi magistral i demolidora, assenyalant que el nostre sistema és "més literatura i intenció que un contracte executable".

### 🧨 Poda i Sanejament
- **Museus de codi**: `DesignSection.jsx` i `LegacySections.jsx` s'han convertit en abocadors i museus de codi antic amb redundàncies de *tokens* i classes. Cal moure-les a rutes de documentació aïllades o extirpar-les.
- **Estils Fantasma i Tailwind residual**: El CSS arrossega pràctiques globals i utilitàries no compatibles amb l'aïllament Pedra Seca.

### 🏛️ Arquitectura i Contracte (Pedra Seca)
- **Contracte de Component**: S'ha d'exigir un "contracte" per a cada component universal (Props tipades, variants, *tokens* que consumeix, i regles d'accessibilitat), eliminant tot l'estil *inline*.
- **Capa Única de Tokens**: Eliminar tot el *hardcoding*. L'única font de veritat ha de ser `theme.js` i les variables CSS associades.
- **Noves Skills**: Suggereix crear la skill `pedra-seca-ds` per a documentar l'arbre de components i regles d'encapsulació, obligant a futures IAs a complir el contracte.

### 🕸️ SEO i Accessibilitat (A11y)
- **L'Aïllament SEO**: Confirma el diagnòstic de Gemini. El *Shadow DOM* bloqueja el rastreig de contingut per part de *crawlers*. Cal estratègia de pre-renderitzat o "Light DOM fallback".
- **Falles A11y (WCAG)**: Manca de *focus-visible* clar, zones de clic massa menudes (Target size), i manca de `loading="lazy"` o etiquetes ARIA en estructures dinàmiques.

### 🧱 Integració i Desacoblament
- **Zero Global State**: Cal eliminar qualsevol variable de mòdul o listener que depenga del *host*. Tot ha de passar per props o pel context aïllat en el muntatge.
- **Idees Radicals**: Extreure el disseny a un paquet NPM independent (`@socdepoble/pedra-seca`) per garantir un encapsulament pur i publicable. Grok proposa un **Pla de Reestructuració en 6 Fases (0 a 5)**.

## 3. Perplexity (Rebuda: 26/08/26 02:11)
Perplexity ha entregat un veredicte demolidor, assenyalant que la base és reutilitzable però el sistema està "contaminat per tres sistemes visuals simultanis" i la independència de la IA és "baixa-mitjana". Ha catalogat troballes **P0 (Crítiques)**.

### 🚨 Troballes Crítiques (P0)
- **Contracte de Router Contradictori**: La documentació diu que el *host* (Sollutia) ha de proveir el `BrowserRouter`, però `PedraSecaEmbed.jsx` en crea un internament. Dos routers xoquen. Cal separar `PedraSecaApp` (router extern) de `PedraSecaStandalone` (router intern).
- **El Mite del Prefix `.sdp-root`**: L'`index.css` té selectors globals (`html`, `body`, `h1`) que escapen o compliquen el muntatge, desmentint la promesa d'un CSS prefixat estrictament per `.sdp-root`.
- **Frontera de Privacitat Trencada**: A `AppDataContext.jsx`, escriptures com `appendSectionSubmission` cauen a l'ID d'usuari per defecte (`DEFAULT_USER_ID`) si falla el context, barrejant usuaris i trencant el mur de privacitat del foraster.
- **Login Decoratiu**: El flux de `LoginSection` presenta formularis que no envien credencials ni interactuen amb Supabase Auth. És un fals positiu visual de privacitat.
- **L'Overlay de `UniversalCard`**: Usar un enllaç absolut amb `inset: 0` damunt de la targeta destrossa l'experiència dels lectors de pantalla i emmascara l'enllaç semàntic real.

### 🧨 CSS, JSX i SEO
- **Reescriptura de Components**: `XatSection.jsx` redefineix completament `UniversalCard` dins del seu propi arxiu, creant dos contractes paral·lels.
- **SEO Client-Side Tàrdà**: L'`useSEO` injecta títols al `<head>` massa tard, destrossa *canonicals* si no s'especifiquen, i inventa *hreflangs*. Proposa generar un HTML base en SSR/Prerender i no prometre indexació sense garanties reals.
- **Shadow DOM i WordPress**: Compte amb globals d'instància (`sdpInstanceCount`) que donaran problemes en múltiples càrregues de plug-in. 

### 🤖 Independència IA i Nova Arquitectura de Skills
- **GENOMA i Skills Contradictòries**: Perplexity avisa que la memòria de l'ecosistema depèn massa del GENOMA, que és un monstre duplicat que genera "drift" (desviació) en el coneixement.
- Proposa tallar les *skills* en dominis curts i exactes: `frontend-system-contract`, `frontend-a11y-seo`, `frontend-embed-contract`, i `frontend-data-boundary`.

## 4. Kimi (Rebuda: 26/08/26 02:11)
Kimi ha entregat un informe titulat "La Constitució Pedra Seca està sent violada pel seu propi exèrcit", destacant violacions de principis fonamentals i deute tècnic termodinàmic extrem.

### ⚖️ Violacions Constitucionals i Poda
- **Violació Suprema (Estils Inline)**: Kimi denuncia que tot el front-end està infestat de `style={{...}}` (`ConnectarSection`, `RealitatSection`, etc.), violant la regla número 1 de Pedra Seca. Demana la instauració d'una regla ESLint `react/no-inline-styles` amb error bloquejant.
- **El Monoliti CSS**: `index.css` de 92KB destrossarà el rendiment de l'iPad A10. Exigeix trencar-lo en mòduls (`tokens`, `reset`, `layout`, `typography`, `components`). S'assenyalen colors *hardcodejats* ocults com `.iaia-icon { fill: `#ff6b00`; }`.
- **Injeccions HTML (Cavall de Troia)**: Hi ha 5 punts d'injecció amb `dangerouslySetInnerHTML`. Encara amb `DOMPurify`, és un risc de seguretat XSS i de SEO.
- **`DesignSection`**: No és codi, és documentació *hardcoded*. Cal esborrar-lo i moure el text a arxius Markdown reals.

### 🧠 Monolitisme al Cervell
- **`AppDataContext.jsx` (20KB)**: Està mesclant massa dominis (Tema, I18n, Supabase, Xats, Broadcast). A més, usa `useMemo` compulsius que ofeguen la memòria RAM. Cal trossejar-lo en micro-contextos (<5KB cadascun).
- **Sobredosi Hardcoded**: Els *seeds* de xat, contingut i agents (més de 45KB combinats) estan bloquejats al codi font en lloc de viure en un sistema de càrrega dinàmic o CMS.

### 🧱 Integració i Gestos Suïcides
- **Fals Shadow DOM**: Component global com `document.documentElement.setAttribute` destrossa l'encapsulació Shadow DOM. 
- **Gestos (Pull-to-refresh)**: La implementació manual amb events tàctils a `AppShell` causarà *jank* (estirades de rendiment) a l'A10 i entrarà en conflicte amb el scroll natiu d'iOS.
- **Rutes Absolutes**: Kimi assenyala que rutes com `/assets/uploads/` fallaran estrepitosament si WordPress instala el component en un subdirectori.

Kimi conclou amb un Pla de Reconstrucció de 4 Fases (Emergència, Fortificació, Conquesta i Llegat).

## 5. Deepseek (Rebuda: 26/08/26 02:14)
Deepseek consolida les troballes anteriors i aporta matisos crítics sobre l'encapsulament i la fallida en navegadors minoritaris.

### 🛠️ Poda i Descomposició
- **CSS i `sosp-components.css`**: Alerta que els blocs de demostració del manual de disseny (`.palette`, `.grid-preview`) no han d'existir al CSS global sinó en un `design-demo.css` de càrrega per on-demand.
- **UniversalComponents i React**: Exigeix trossejar l'arxiu de 39KB en components atòmics i centralitzar lògica compartida com `useCardActions`.

### 🛡️ Fallides del Shadow DOM
- **`adoptedStyleSheets` no universal**: L'ús exclusiu d'`adoptedStyleSheets` en l'embed trencarà l'aplicació en Safari < 16.4 si no injectem un `<style>` clàssic com a fallback dins del *Shadow Root*.
- **Fonts Inaccessibles**: El `<link>` de fonts s'injecta a l'arrel de l'host (WordPress), on podria ser bloquejat. Deepseek demana injectar el `@font-face` directament dins del Shadow DOM.
- **Ús incorrecte de `:host`**: El CSS de l'embed sobreescriu regles al mateix `:host` amb `display: block` que poden xocar de ple amb el DOM de WordPress.

### 🕸️ Dependències Globals i Router
- **Global `window.sdp_change_language`**: Kimi i Deepseek detecten variables penjant de l'objecte global `window` que no deuen existir mai en un entorn zero-trust com un plugin de WordPress.
- **Basename Obligatori**: Si s'utilitza un `BrowserRouter` integrat, la propietat `basename` ha de vindre injectada de l'arrel de l'host sí o sí, o les rutes es trencaran completament.

## 6. Consell "Z" (Rebuda: 26/08/26 02:16)
Zeta presenta l'Informe Definitiu consolidant la visió de tot l'eixam. Confirma el diagnòstic fatal del codi i aporta solucions estratègiques (Gos Peixater, Z-Index Wars).

### 💣 Poda i Constitució
- **Gos Peixater Estricte**: Demana imposar un linter rígid (`pedra-seca.rules.json`) que prohibisca radicalment els `style={{}}` i obligue a usar exclusivament les classes utilitàries del diccionari semàntic.
- **Fantasmes i Llegat**: Alerta sobre variables cridades a `@media (prefers-contrast: more)` que ja no existeixen. Sentència de mort definitiva per a `DesignSection.jsx` i `LegacySections.jsx` (83KB de llast).

### ⚔️ Guerres d'Integració (WordPress vs Pedra Seca)
- **Z-Index Wars**: L'Admin Bar de WordPress té un `z-index` de 9999. El nostre `--z-calaix` de 1000 quedarà per baix. Obliga a apujar els índexs globals a `99990`.
- **Sagnat Global i Tema**: Reiteren l'error fatal de posar `box-sizing` a `*` i `data-theme` a `document.documentElement`. Si no es frena, convertirem en negre l'escriptori del WordPress de Sollutia i els destrossarem el CSS. Exigeixen prefix `#soc-de-poble-root`.
- **El Dilema del Router**: Usar `BrowserRouter` causarà 404 massius a WordPress a menys que configuren `RewriteRules`. Com a alternativa de supervivència cega, proposen `HashRouter`.
- **Shadow DOM i SEO**: Alerten que el Shadow DOM no és rastrejat per Google de manera fiable. Si el text (mercat, pobles) és SEO-crític, caldrà injectar-lo al Light DOM o usar Declarative Shadow DOM (DSD).

## 7. Claude (Rebuda: 26/08/26 02:18)
Claude aporta l'anàlisi mecànica i forense de més baix nivell, trobant 591 classes mortes al JSX, 5 dialectes convivint (incloent Tailwind incompilat) i errors crítics (P0 i P1) que provoquen fallades silencioses.

### 🔬 Autòpsia del Codi (P0 i P1)
- **Sis seccions crues**: `SectionChrome.jsx` utilitza classes (`.section-shell`, `.section-hero`, etc.) que no estan definides enlloc. La primera impressió de l'app és codi cru.
- **Fuga a WordPress**: `sosp-components.css` i `ConnectarSection.css` no entren mai a l'arrel ombra perquè no utilitzen `?inline`. Fugen cap al document de WordPress, on trenquen coses i no reben les variables `--sdp-*`.
- **Focus Mort i WCAG**: L'anell de focus global està mort perquè intenta cridar a la variable `--sdp-color-focus` que no existeix, trencant l'accessibilitat de nivell AA.
- **WhatsApp i Shadow DOM**: El contingut viu 100% al Shadow DOM, però WhatsApp i Facebook no executen JavaScript. El projecte és invisible per al canal principal de Sóc de Poble.
- **Tema Bloquejat**: S'escriu a `document.documentElement` i a `rootNode.host` incondicionalment. Resultat: el tema del sistema operatiu no es pot recuperar mai un colp l'aplicació arranca.

### 🚜 Pla Tractor
Claude proposa un *linter* a mida (`tractor-pedra-seca.mjs`) amb vuit regles estrictes (portes) abans de permetre un commit. Assenyala també que la carpeta `src/components/design-system/` és un subarbre completament mort (107KB) que s'ha d'eliminar de soca-rel, i que el manual de disseny s'ha de *generar*, no escriure a mà.

## 8. Dola (Rebuda: 26/08/26 02:22)
Dola emet un diagnòstic precís que recolza tot el Consell, però posa especial èmfasi en el xoc de taxonomies, el "Contingut Llunyà Semàntic" per a SEO i les regles excessivament rígides del workflow.

### 🧹 Taxonomia i Component Déu
- **Guerra Civil de Classes**: Hi ha dues taxonomies solapades (`sdp-*` vs `sp-*`) per fer exactament el mateix (ex: `.sdp-badge` vs `.sp-card-label`). Dola exigeix unificar-ho tot cap a `sdp-*`.
- **Targeta Monolítica**: `UniversalCard` pateix de "Component Déu Tot Plegat". Té massa responsabilitats i s'hauria de trossejar en peces composables (`CardHeader`, `CardMedia`, `CardBody`, `CardFooter`).

### 🛡️ Blindatge per a WordPress i SEO
- **Cortafocs CSS Extrem**: Dola alerta que temes agressius de WordPress (que usen `* { box-sizing: content-box !important }`) poden destrossar l'element host. Proposa un blindatge absolut afegint `all: initial` al `:host` i `.sdp-root`.
- **Contingut Llunyà Semàntic**: Confirma que el Shadow DOM és invisible per a WhatsApp i xarxes socials. Aporta la solució definitiva: s'ha d'injectar un `<noscript>` o un bloc semàntic invisible al Light DOM amb un `<h1>` i la descripció, deixant-lo fora de l'arrel ombra perquè els *scrapers* sense JavaScript el puguen llegir.

### 🤖 Autocrítica de les Skills
- Dola detecta que l'`SKILL` de `socdepoble-workflow` és massa punitiva (la regla de "8 a 12 paraules" pel títol d'un arxiu) i demana relaxar-la a "6-15 paraules descriptives". Sol·licita també una `SKILL` tècnica explícita per al desenvolupament de UI, separada dels textos literaris.

## 9. Qwen (Rebuda: 26/08/26 02:25)
Qwen (Microsoft) posa el focus en la visió a llarg termini: l'automatització, la prevenció mitjançant *linters*, i la creació de "contractes mecanografiats" perquè futures IAs no cometen errors.

### 📜 Contractes Mecanografiats (JSON Schema)
- **Documentació Llegible per Màquines**: Les actuals *SKILLS* de la IAIA són molt narratives. Qwen proposa que el sistema de disseny passe a tindre "Contractes" (estil OpenAPI). Cada component hauria de tindre un `Button.schema.json` que definisca exactament quines `props`, `events` i variables CSS s'hi poden usar. Qualsevol IA futura només hauria de llegir el JSON per saber com muntar una targeta, evitant al·lucinacions.

### 🛡️ Tematització Segura i Purga
- **Classes al `:host`**: Confirma l'error gravíssim d'alterar l'`<html>` global per canviar el tema. Proposa que els canvis de tema (`light`/`dark`) només afigen una classe `.theme-dark` directament al `:host` del *Web Component*, aïllant-ho de WordPress per complet.
- **Cobertura i PurgeCSS**: Planteja l'ús sistemàtic de `eslint-plugin-jsx-a11y` i eines de *Coverage* per automatitzar la detecció de codi orfe i assegurar la fiabilitat futura sense requerir intervenció humana contínua.

## 10. Copilot (Rebuda: 26/08/26 02:26)
Copilot (Microsoft) fa una diagnosi molt orientada a l'estratègia DevOps i a la integració d'eines automàtiques en el pipeline per evitar que la "brossa" torne a créixer.

### ⚙️ Automatització i Eines
- **Pipeline de Neteja**: Demana no fer auditories manuals a cegues en el futur, sinó integrar eines com *PurgeCSS*, *uncss*, *axe-core* i *Lighthouse CI* directament al cicle de desenvolupament.
- **Recipes per a les SKILLS**: Suggereix que `socdepoble-workflow` no només tinga regles de restricció, sinó que incloga *recipes* (receptes pas a pas) explicant com integrar un component a WordPress o com fer proves, convertint la SKILL en una eina d'onboarding real.

---
**Ancoratge de Seguretat:** [[00_INDEX_ESCRIPTORI]]
