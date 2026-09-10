---
tipus: document
estat: esborrany
description: "🧠 ESTUDI DEL CONSELL: AUDITORIA POST-DESTRUCCIÓ (Fase 3)"
---
# 🧠 ESTUDI DEL CONSELL: AUDITORIA POST-DESTRUCCIÓ (Fase 3)

*Estat: En recopilació (Mode Estudi activat)*
*Objectiu: Recollir, analitzar i sintetitzar totes les petorretas (auditories) del Consell d'IAs abans d'aplicar qualsevol canvi.*

---

## 1. Auditoria Gemini Pro (Rebuda)
**Foc: Race conditions i Router**
- **Connexió Sollutia:** Condició de carrera amb el `setTimeout(fes, 0)` a `host.js` + `arrencaAuto()`. Recomana arrencada explícita (`window.SocDePoble.arrenca()`). Fuga de memòria al `visibilitychange` (recomana `AbortController`).
- **RouterContext:** `MemoryRouter` modifica la URL real (ha de ser 100% memòria). S'ignora el `basename`. Enllaços externs al `<Link>` trencaran per CORS. Falla el trailing slash al regex.
- **Taxonomia:** Dissonància entre `schema.json` i els noms físics (`01_Ser`). Recomana unificar-ho a `Title_Snake_Case`.

---

## 2. Auditoria Grok (Rebuda)
**Foc: Frontera OAuth, Segellat i Illes del Cervell**
- **Connexió Sollutia & Auth:** Risc al Custom Element si rep `dataset` tard. Recomana bloquejar el muntatge fins tindre les claus obligatòries (emeti event `sdp-ready`). `RELAY_PER_DEFECTE` ha de coincidir exactament amb Sollutia. Validar origin a OAuth abans.
- **Estructura Cervell (4+2):** Valida positivament el model i el `Title_Snake_Case`. Avisa que `.agents/` és una illa aïllada i s'ha de cosir al graf (mirrors). Avisa de falses etiquetes `[[graf]]`. Reitera límit de 8.000 tokens a `01_Ser`.
- **RouterContext:** Alerta sobre el `popstate` robust (sincronitzar estat intern si el navegador fa back/forward). Gestió de query params i hash perduda actualment. Avisa de Provider Singleton i NotFoundPage via popstate.

---

## 3. Auditoria Gemini Flash (Rebuda)
**Foc: Bloquejos de Sollutia i Fallada Fatal de Rutes Niades**
- **Connexió Sollutia & host.js:** Reitera la race condition fatal del `setTimeout(fes, 0)`. Identifica el problema del `CONTRACTE_BACKEND` rígid (els 28 mètodes bloquejaran la connexió de proves de Sollutia). Denuncia que `configura()` no permet injectar `config` (Supabase URLs) en calent. Assenyala que `import()` dinàmic fallarà en format IIFE antic. Recomana relaxar el contracte en `host.js` amb un fallback/proxy.
- **RouterContext & Rutes Niades:** Identifica un bug crític on `AppRoutes` (ex: `/jo/*`) i `ActorRoutes` (ex: `mur`) col·lideixen en el `match` per culpa del regex rígid (`^mur$`), tirant-ho tot a 404. Recomana refer el RouterContext completament per suportar rutes relatives (`basePath`), subdirectoris (`basename`), recuperar el `hash` i corregir el component `Link`. Ens proporciona directament el codi corregit del `RouterContext.jsx`.
- **Estructura Cervell & Taxonomia:** Avisa de la fractura severa entre els directors físics (`01_Ser`) i els scripts tractors (`00_SER_Brain_Identitat`), la qual cosa trencarà les portes de CI demà (`npm run porta`). Remarca que el `Title_Snake_Case` ha de ser només per a l'índex i els fitxers han de ser **minúscules amb guió baix (snake_case)** o **kebab-case** en entorns Linux/Git per evitar trencaments *case-sensitive*.

---

## 4. Auditoria Vibe (Claude/Mistral) (Rebuda)
**Foc: Furgades de Memòria a Supabase, Retrys i Singleton**
- **Connexió Sollutia & Supabase:** Detecta un risc crític de *memory leak* (fuita de memòria) per no fer `unsubscribe()` dels canals de Supabase (possiblement a `supabaseBackend.js` o `PedraSecaEmbed.jsx`). Proposa que la instanciació de Supabase siga un Singleton asíncron i implementar una política de `withRetry` exponencial per si la xarxa cau demà.
- **RouterContext:** S'alinea amb les crítiques anteriors: cal suport `popstate` fort, l'estat intern (state), i proposa un `matchRoute` natiu més capaç.
- **Estructura Cervell:** Valida el model 4+2 i el patró numèric. Avala l'ús estricte de `Snake_Case` però pur (`01_IDENTITAT.md`, sense espais ni majúscules-minúscules estranyes). Proposa crear un script (`generar_indexs.mjs`) per auto-generar els índexs i validar enllaços trencats.

---

## 5. Auditoria Dola (Rebuda)
**Foc: Orígens OAuth, CSP i Pedaços Crítics Pragmàtics**
- **Connexió Sollutia (El més crític per demà):** Lloa el `CONTRACTE_BACKEND` (el veu robust) però confirma la carrera del `setTimeout(0)`. Aporta nous esculls mortals: l'**OAuth de Google fallarà** si no afegim l'origen exacte de Sollutia a `ORIGENS_PERMESOS` (`public/auth/callback.html`). Avisa del CSP a `index.html` que pot bloquejar la seua API. Assenyala que les claus de Supabase es filtren al DOM (`config`) encara que Sollutia injecte el seu propi backend.
- **RouterContext:** Llista 12 bugs puntuals: manca de `basename`, ruta 404, escaping de regex, falta d'un CustomEvent global en navegar, errors de seguretat en `<Link>` amb orígens externs, etc. (Coincideix totalment amb la resta).
- **Estructura Cervell:** Confirma la dissonància greu entre carpetes físiques (`01_Ser`) i lògiques (`00_SER...`). Avisa que `03_Actuar` està buit i `02_Saber` massa ple. Recomana no canviar noms ara, però formalitzar el `Title_Snake_Case` a `ESTANDARD_NOMENCLATURA.md` per aturar el caos.

---

## 6. Auditoria Z (Rebuda)
**Foc: Verificació de Bundle, Checklists Implacables i Detalls Foscos**
- **Troballa Zero:** Assenyala que el bundle estava truncat (només hi havia el manifest). Això valida que és una IA que no inventa.
- **Connexió Sollutia & Embed:** 
  - Alerta que `customElements.define()` llençarà `NotSupportedError` si s'executa dues vegades. Recomana `if (!customElements.get(...))`.
  - Avisa que el host pot injectar l'atribut `config` molt tard (després del `connectedCallback`). Recomana un `MutationObserver` o bandera de *boot diferit*.
  - Assenyala que un iframe cross-origin pot bloquejar les cookies/localStorage de Supabase a Safari/Chrome (Third-party cookies). 
  - Denuncia que la modificació de `document.title` pel nostre `useSEO` pot xafar el `<title>` de la pàgina amfitriona de Sollutia.
- **RouterContext:** 
  - Identifica que el `pushState` dins d'un iframe engreixa l'historial del navegador pare (l'usuari prem Enrere i torna enrere el widget, no la pàgina de Sollutia). 
  - Alerta que refer el valor de `RouterContext` (value object) en cada navegació re-renderitzarà tota l'app (les 1500 línies de components inferiors).
- **Estructura Cervell:** Confirma el desequilibri (`03_Actuar` buit). Validació clara per mantenir `Title_Snake_Case`, però adverteix que cal purgar el drift fent servir `aliases` frontmatter per als enllaços vells i llevant el numerat als fitxers de contingut intern (mantenint-lo només per a index).

## 7. Auditoria Deepseek (Rebuda)
**Foc: Autòpsia Sènior P0, Enrutament Imbricat i Cursa Asíncrona**
- **Connexió Sollutia:** 
  - Resol la cursa asíncrona de `host.js`: Si Sollutia fa un fetch abans d'arrencar, l'auto-arrencada `setTimeout(0)` es dispararà i els bloquejarà fora. Proposa la funció `deferArrenca()` per aturar el rellotge.
  - Alerta a `PedraSecaEmbed.jsx`: Si Sollutia injecta `el.config = {...}` abans que el Custom Element faça l'upgrade de classe, aquesta propietat pròpia ombrejarà el *setter* i l'app mai s'assabentarà de la config. Cal absorbir-la al `constructor`.
  - Bug a `main.jsx`: `if (arrel && !arrel.innerHTML)` bloqueja el muntatge si Sollutia posa un *spinner* dins del div. Cal llevar la guarda de l'innerHTML.
- **RouterContext:**
  - Diagnostica exactament el **404 perpetu** en les rutes niades: `Routes` pare passa tota la ruta als fills. Proposa propagar un `RouterPrefixContext` per anar tallant la ruta base a cada nivell i que els fills puguen fer match.
  - Detecta que `pushState` posa l'estat a `null`, perdent totes les precàrregues `location.state`.
  - Assenyala que `Navigate` usant `useEffect` provoca un fotograma en blanc en cada redirecció. Proposa `useLayoutEffect`.
  - Soluciona el bug del grup de captura del comodí `*` (`match[1]` vs `match[match.length - 1]`).
- **Estructura Cervell:** P0 de Governança. L'`schema.json` i el `tractor-esquemes.mjs` comproven carpetes falses (les velles). Recomana unificar, triar-ne una (la real) i no barrejar mai més.

## 8. Auditoria Claude (Rebuda)
**Foc: Execució Determinista, Router Destrossat i ESTANDARD Letal**
- **Troballa Zero:** Claude ha descarregat i compilat el codi real. Ha detectat que l'App ni tan sols s'obre. L'error és determinista.
- **RouterContext:**
  - **P0-1:** `pathToRegex()` té un bug d'escapament de contrabarra `(?<slug\>…)` que llança un `SyntaxError`. El 100% de les càrregues de `/e/:slug/*` (IdentitatContext) fan petar l'app i pinten blanc.
  - **P0-2:** `ActorRoutes` usa rutes relatives (`perfil/:agentId`), però `Routes` casa contra el `pathname` sencer absolut. Resultat: totes les rutes internes són 404 (Xat, Mur, Notes).
  - **P0-3:** `basename` és codi mort a `BrowserRouter`. Mai el llegeix.
- **PedraSecaEmbed:**
  - **P0-4:** `_despintaAmfitrio()` es defineix static a la classe de CustomElement però es crida a nivell de component funcional de React. Un `TypeError` silenciós destrossarà el desmuntatge.
- **Governança/Escriptori:**
  - **P0-5:** L'arxiu `ESTANDARD_Integracio_React.md` (que Sollutia llegirà aquesta nit) té un error letal: obliga a injectar `loadAppData` (que no està al `CONTRACTE_BACKEND`), promet un `HashRouter` que no existeix i obliga a instal·lar `react-router-dom 7`. L'equip de Sollutia llegirà això i seguirà un tutorial que destrossarà la seua integració per l'excepció no controlada de `host.js`.
  - Avala la conversió pura a `snake_case` (minúscules) per a tota la Wiki.

## 9. Auditoria Qwen (Rebuda)
**Foc: Estrès Teòric, Seguretat JWT i Semàntica RAG**
- **Connexió Sollutia & Seguretat (P0):**
  - Confirma el desastre de les fuites de memòria al cicle de vida del Custom Element. Remarca que a WordPress el muntatge/desmuntatge pot ocórrer de forma molt agressiva.
  - Alerta greu sobre JWT: Demana auditar qualsevol ús de `localStorage` per a desar els tokens, ja que exposa a atacs XSS. Suggereix utilitzar *HttpOnly Cookies* si Sollutia ho permet, i assegurar el refresc de sessions davant de `401 Unauthorized`.
- **RouterContext & History API:**
  - Avisa que WordPress pot manipular el `window.history` de forma hostil. Suggereix crear un "interceptor" sobre `pushState` i posar panys (locks) a les rutes perquè una navegació concurrent no trenque l'estat.
  - Recomana l'ús de la propietat `key` de React per forçar remuntatges nets en rutes complexes.
- **Estructura Cervell (RAG):**
  - Suggereix una estratègia híbrida: fitxers en snake_case però afegint metadades riques (YAML/JSON Frontmatter) per facilitar el Semantic Chunking en sistemes RAG, la qual cosa afavorirà molt la integració futura amb agents d'IA.

---

## 10. PLA D'ACCIÓ DEFINITIU (Consens d'IAs)

*Totes les IAs apunten a les mateixes dianes letals. Aquest és el **Pla de Xoc** recomanat a executar ABANS de donar accés a Sollutia:*

### BLOC 1: Blindatge Sollutia (Prioritat Màxima)
1. **L'Arrencada:** Llevarem l'auto-arrencada (`arrencaAuto()`) a `host.js` i `main.jsx`. Afegirem salvaguardes `customElements.get()`.
2. **Whitelist OAuth & CSP:** Afegirem els orígens de Sollutia a `public/auth/callback.html` i netejarem o mourem la meta CSP de `index.html`.
3. **Fuga de Claus i Memòria:** Aplicarem el sanejament del `dataset` per no deixar credencials de Supabase al DOM. Netejarem els listeners a `PedraSecaEmbed` i subscripcions a `supabaseBackend.js`.
4. **Relaxar Contracte Backend:** Crearem un *fallback/proxy* perquè no explote l'app si Sollutia no té encara tots els 28 mètodes.
5. **Aïllament SEO/Embed:** Aturar la modificació de `document.title` quan s'està incrustat.

### BLOC 2: L'Enrutador Natiu
1. **Pedaç Estructural i Rendiment:** Substituirem l'actual `RouterContext.jsx` pel codi hiper-robust proposat per Flash/Vibe.
2. **Optimització Context:** Assegurar que `value` al Provider estiga memoritzat (`useMemo`) per no provocar re-renders de tota l'App. 
3. **Pedaços de Historial:** Gestió de 404, escaping regex, event de navegació al window.

### BLOC 3: Harmonia del Cervell i Taxonomia
1. **Sincronització Taxonòmica:** Ajustarem l'script `tractor-esquemes.mjs` perquè coincidisca amb l'estructura física i crearem `ESTANDARD_NOMENCLATURA.md` assentant el `Title_Snake_Case`. (Sense renombrar les carpetes ara per evitar caos d'enllaços trencat).

### CHECKLIST FINAL 60 MINUTS (Abans de donar accés)
- [ ] 0 referències a `service_role` al codi.
- [ ] 1 sola crida a `customElements.define` amb guard.
- [ ] `createClient` s'instancia amb patró singleton robust i retardat.
- [ ] Custom Element sense atributs mostra error silenciós o placeholder, però no peta la web.
- [ ] Cap subscripció perduda (`unsubscribe` present).

*(Cap codi serà tocat fins que el Mestre ordene "EXECUTA EL PLA".)*
