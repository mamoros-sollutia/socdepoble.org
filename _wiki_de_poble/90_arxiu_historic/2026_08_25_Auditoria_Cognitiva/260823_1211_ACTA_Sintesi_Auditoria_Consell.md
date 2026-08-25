---
estat: "Acta"
tipus: "document"
description: "Notes i síntesi del feedback rebut pel Consell d'Intel·ligències sobre l'auditoria global."
---

# Acta: Respostes i Feedback de l'Auditoria Global (El Consell)

Aquest document servirà per a recopilar totes les opinions, alertes i preguntes de les diferents IAs del Consell respecte a l'auditoria de codi i arquitectura abans d'iniciar el Xat.

**ATENCIÓ:** No s'executarà cap canvi al codi fins que tot el Consell haja parlat i el Mestre done l'ordre.

---

## 1. Qwen (Auditoria Final i Estratègia CRDT)

Qwen ha lliurat la seua auditoria final centrant-se en l'aplicació de la "Navalla Rústica", la seguretat del WordPress i l'estratègia per als CRDTs:

1. **Navalla Rústica (Static Analysis):** Exigeix l'ús d'eines com `knip`, `ts-prune`, `Fallow` i `vite-plugin-unused-code` per escombrar tot el codi mort de React abans de tocar res.
2. **Seguretat del Plugin WP:** Avisa de les vulnerabilitats recents de WordPress (XSS2Shell i wp2shell) i exigeix fortificar el nostre plugin secundari: prefixar totes les funcions, assegurar el `if (!defined('ABSPATH')) { exit; }` i carregar coses d'admin només amb `if (is_admin())`.
3. **Falsa Seguretat del Shadow DOM:** Reitera que el Shadow DOM no és una barrera de seguretat, només d'estils. La seguretat ha de ser a nivell de lògica (XSS sanitization).
4. **Offline-First i Xifrat Local:** L'estratègia exigeix utilitzar llibreries com Redux Offline o SignalDB per a la cua de sincronització, i llança una advertència vital: les dades sensibles en IndexedDB s'han d'encriptar localment ("security in depth") per protegir la privacitat si roben el dispositiu.
5. **Estratègia CRDT:** Per preparar l'arribada dels CRDTs (Yjs, Fireproof), la PWA ha de deixar de tractar la UI com la font de la veritat; les dades ho són. Aconsella encapsular totalment el Xat darrere d'una "API de Servei per a la Sincronització" agnòstica, desconnectant la lògica de la presentació.

---

## 2. Claude (Seient Núm. 5 - El Tractor del Consell)

Claude ha passat el `tractor-consell.mjs` i ha assenyalat 39 infraccions de les normes estructurals (Lleis):

1. **Interruptor Mort:** El backend està capat incondicionalment a `src/data/supabaseBackend.js` amb `CAPAR_BACKEND = true`, forçant el `seed` i ofegant qualsevol escriptura remota.
2. **Tema Fosc Trencat:** Fallades en la lògica del tema on el CSS (`:root[data-theme]`) no té el seu reflex equivalent per al Web Component (`:host([data-theme])`), a més de la fallada del React per resoldre l'estat `system`.
3. **SEO Silenciós:** Absència del `dist/seo-routes.json`, el que provoca errors 404 continus en les rutes quan React pinta la pàgina en l'entorn PHP.
4. **Fuites de Claus de Producció:** Vite està injectant les claus (`VITE_SUPABASE_URL`, etc.) en l'artefacte publicat.
5. **UI/Accessibilitat:** Incompliment de la "Llei de Vida" (botons interactius de menys de 44px).
6. **JSX Shim Incoherent:** Fallades estructurals en el suport `jsx-runtime` personalitzat per a React.

---

## 3. Gemini (Auditoria Quirúrgica de Rendiment i CRDT)

Gemini ha alertat que el sistema no sobreviurà a l'estrès d'un Xat CRDT a causa de l'actual estat monolític i les decisions de persistència:

1. **Bomba de Rellotgeria del localStorage:** `saveLocalAppSnapshot` guarda absolutament tot (usuaris, xat, mur, esdeveniments) en el `localStorage`, el qual té un límit dur de 5MB. Un sol missatge gros d'imatge bloquejarà tota la PWA. **Solució Obligatòria:** Migrar l'emmagatzematge massiu (Snapshots i Xat) a **IndexedDB** (`idb` o `localforage`).
2. **Duplicitat d'Emmagatzematge:** Unificar tota I/O del navegador a `src/config/storage.js` en comptes d'escampar `localStorage` per tots els arxius.
3. **Aïllament del Xat (Estat Monolític):** Actualment el `AppDataContext.jsx` repinta TOTA l'aplicació per un sol missatge de xat. **Solució Obligatòria:** Treure el Xat del context global cap a un magatzem aïllat (Zustand, o un `ChatContext` separat).
4. **Optimització Estructura Xat:** Passar l'array pla de missatges a una estructura clau-valor normalitzada (diccionaris `byId`) per fer cerques i merges òptims.
5. **BroadcastChannel:** Passar deltes (canvis) a les altres pestanyes, no forçar una recàrrega sencera del snapshot local per cada ping.
6. **Precaució SEO (WP):** Assegurar que la configuració de Sollutia mai injecte `manageDocumentHead: true` i provoque col·lisions amb els recurrents plugins de SEO.

---

## 4. Copilot (Auditoria de Seguretat i Tooling CI/CD)

Copilot ha centrat el seu informe executiu en la seguretat, la resiliència del pipeline i l'amenaça XSS/CORS:

1. **Secrets i Pre-commits:** Insisteix en la perillositat dels secrets en text pla (`.env`) o incrustats en l'App. Proposa la integració immediata de hooks de pre-commit (`husky` + `git-secrets`) per avortar pujades que continguen claus privades i forçar el lintatge.
2. **Hardenització de Rutes (Middleware JWT i Validació):** Demana un refactor per validar rigorosament els JWT (caducitat, signatures, claims) tant a Sollutia (WP) com al Frontend, així com esquemes de validació (tipus Zod) per a tot l'input abans d'escriure a Supabase o WP.
3. **Sanejament d'HTML (XSS):** Identifica el perill potencial d'usos insegurs d'innerHTML per injeccions. Aconsella usar `DOMPurify` dins d'un wrapper de `SafeHtml`.
4. **Modularització i Codi Duplicat:** Demana un "Sprint de Sanejament" purament arquitectònic per unificar utilitats en llocs comuns, documentar els "contractes d'API" entre els elements i posar fi als components duplicats.
5. **Degradació Graciosa:** Reforça la necessitat exposada per Gemini de construir un suport local (IndexedDB) i una sincronització de CRDT sòlida pensant exclusivament en l'escenari on el servidor de WordPress o Supabase es cau de forma intermitent.

---

## 5. Grok (Auditoria Global Infrangible i Higiene Estricta)

Grok ha tancat el Consell dictaminant que el sistema està actiu però "carregat d'entropia històrica". Ha marcat una estratègia de neteja estricta:

1. **Vulnerabilitats Crítiques:** Assenyala l'ús de `dangerouslySetInnerHTML` i regex com a "sanititzadors" com a pràctiques inacceptables i exigeix l'eliminació de qualsevol codi que els utilitze. Netejar qualsevol rastre de secrets.
2. **Llei de l'Enxufabilitat Violada:** Detecta que la resolució d'imatges de pobles (`resolveTownImageUrl`) i el mapatge de pobles (`benifallim`, `sella`...) està hardcoded al frontend (React). Aquesta lògica de negoci ha de viure al plugin de Sollutia o al backend.
3. **Codi Brossa i Neteja Mecànica:** Recomana purgar llibreries no usades com `workbox-window` i duplicats com `lucide` vs `lucide-react`. Demana unificar el THEME de l'aplicació i centralitzar els helpers (com `normalizeText`).
4. **Optimització DOM_DEPTH:** Implementar el patró *Slot* a les seccions actives per a reduir el DOM i preparar el terreny per al Xat.
5. **Separació del Bundle d'i18n:** Demana separar l'idioma públic del privat per a no filtrar noms de rutes internes (`pull.release`, etc.) cap a l'artefacte de producció.
6. **Veredicte:** El codi és madur però carregat d'història. *Prohibeix* iniciar el Xat fins que les Fases de Seguretat i Higiene estiguen completades.

---

## 6. Perplexity (Arquitectura de Transport, Identitat i Rutes)

Perplexity ha entregat un informe exhaustiu centrat especialment en l'arquitectura de comunicació i la identitat del Xat:

1. **Credencials i Seguretat:** Reitera la fuita de credencials de Supabase al bundle (`soc-de-poble.standalone.js`) i exigeix rotar-les immediatament. A més, avisa que `CAPAR_BACKEND = true` ha invalidat qualsevol prova RLS real.
2. **Identitat i Col·lisió d'Usuaris:** Alerta que l'ús de `DEFAULT_USER_ID = 'foraster'` provoca col·lisions d'escriptura. S'ha de canviar a un `guestSessionId` efímer generat pel backend, i no es pot confiar mai en el `ownerUserId` que s'envia des del client per a cap filtre.
3. **Il·lusió del Xat Actual:** Constata que el xat existent només és un joc de miralls (`localStorage` + `makeChatReply()`). A més, adverteix d'un principi fonamental trencat: el fallback local mai pot retornar un èxit de servidor si aquest últim falla.
4. **Arquitectura de Transport (Ports/Transports):** Obliga a separar les capes. El Xat ha d'usar un adaptador `ChatTransport` que permeti connectar-se per separat a `SeedChatTransport`, `LocalChatTransport`, `SupabaseChatTransport` i el futur `CrdtChatTransport`. També exigeix l'ús d'Estats d'Enviament (`pending_local`, `queued`, `sent`, etc.).
5. **Rutes Inconsistents i SEO:** Detecta rutes conflictives per al xat (`/chat`, `/chats/:threadId`, `/xat/:threadId`). Cal definir-ne només una com a canònica. Exigeix crear el contracte estricte `SdpHostConfig` per governar l'encaix React <-> Sollutia sense caure en redundàncies SEO.
6. **Scripts Morts que menteixen:** Detecta que alguns stubs de tooling (`seo_auditor.mjs`) falsegen "èxits" tot i no estar implementats. Aquests han de llançar codis d'error o dir que no estan fets, mai simular un OK.
7. **Veredicte Executiu:** Coincideix amb la resta del Consell: PROHIBIT tocar el /xat abans de l'Sprint de Sanejament i la redefinició d'Arquitectura i Transport.

---

## 7. Codex (Corrupció React, Manca de JWT i Tests Trencats)

L'auditoria de Codex aporta la visió definitiva abans de procedir. Amb un "NO-GO" taxatiu, l'informe destaca errors concrets d'implementació:

1. **El Bundle és Incomplet i Enganyós:** Confirma que el bundle usat només representa el 20% de l'App viva i conté fins a 69 imports locals trencats. Per tant, auditar sobre el dist amaga la majoria del deute tècnic.
2. **Corrupció via JSX Shim:** L'adaptador de JSX incrustat en WordPress corromp elements de React que empren la propietat `key`, la qual cosa pot destruir completament el funcionament d'una llista reactiva de missatges en el Xat.
3. **Seguretat i JWT:** Constata que les Polítiques de Seguretat de Nivell de Fila (RLS) en Supabase no són útils si el client (React) no envia un JWT de sessió autenticat real. Confiar exclusivament en l'`anon_key` obri la porta a què qualsevol "foraster" autèntic s'autoassigni rols de `admin/owner`.
4. **Falsa Promesa Offline:** Declara que el mode PWA no està ben construït. Si el servidor WordPress cau, actualment cau tota l'aplicació, trencant la resiliència promesa per l'Offline-first.
5. **Shadow DOM (No-Security Border):** Reafirma la posició de Perplexity i Copilot: el Shadow DOM només encapsula CSS, no suposa cap frontera real de seguretat.
6. **Mala salut de la CI i els Deep Links:** Descobreix que els tests de la CI no serveixen de barrera (27/55 passant en verd, la resta trencats) i que els deep links (enllaços interns) de WordPress cap a l'aplicació de React no estan establerts correctament.

---

## 8. Kimi (Auditoria Forense d'Asèpsia i Performance)

Kimi ha detectat 20 escletxes i "fugides de calor" (termodinàmiques) vitals per garantir que l'App funcione correctament en un iPad A10:

1. **Nivell 1 (Crític):**
   - L'ús de `useSEO.js` permet injecció d'HTML si s'usen cometes. Exigeix canviar-ho al mètode nadiu `setAttribute`.
   - Adverteix de col·lisions imminents en els IDs dels missatges del Xat. S'ha de passar a l'API criptogràfica `crypto.randomUUID()`.
   - Denúncia que actualment els errors de Seguretat de Nivell de Fila (RLS) s'apaguen en silenci, oferint a l'usuari un error fals.
2. **Nivell 2 (Arquitectura):**
   - El hack del Shadow DOM usant `.getRootNode()` falla si el DOM no està ancorat; el mode de shell s'ha de passar explícitament via Prop (`shellMode`).
   - S'està usant `classList.toggle` directament en l'`App.jsx` per obrir la sidebar, un error que trenca el procés de reconciliació de React. Exigeix `useState`.
   - `JSON.stringify` massiu a `stableExternalConfig` ofega el procés. 
   - Proposa el Lazy-Loading (`import()`) de les traduccions de 5 idiomes per no sobrecarregar la càrrega inicial en iPads antics.
3. **Nivell 3 (Performance A10):**
   - L'animació infinita de la icona `.iaia-icon` (pulsació) crema la GPU inútilment. El selector `:has()` al CSS també redueix el framerate a 15fps. 
   - La regla `will-change: transform, opacity` a totes les `.sdp-card` ofega la memòria de textura del navegador. 
   - L'event `pull-to-refresh` a `App.jsx` usa paràmetres incorrectes i bloqueja el scroll de l'usuari. Cal emprar `touch-action: pan-y`.
4. **Nivell 4 (CSS):**
   - El mode de "contrast alt" (`prefers-contrast: more`) no funciona perquè utilitza variables CSS inexistents en Pedra Seca (es fa un mapatge erroni).
5. **Nivell 5 (WordPress):**
   - L'arxiu `blank.php` és vulnerable: usa `the_content()`, donant marge perquè qualsevol editor de WP afegisca codi que trenqui React per dalt. 
   - El bundle minificat s'ha de traure de GIT i posar a `.gitignore`.

---

## 9. Deepseek (Componentització i Paginació Sitemaps)

Deepseek valida l'estat general però introdueix millores arquitectòniques que eviten re-renders i optimitzen l'estructura de React i el plugin de WP:

1. **Components Massa Grans i Context Fusionat:** Adverteix que `UniversalCard` té massa props (>30) i que el `useAppData` fusiona dades i accions innecessàriament, causant re-renders massius. Aconsella separar en subcomponents i dividir el context en `AppStateContext` i `AppActionsContext`.
2. **Manteniment de CSS i Neteja:** Demana utilitzar `purgecss` per eradicar classes mortes i unificar keyframes CSS. 
3. **Efectes Secundaris al SEO:** Demana netejar meta etiquetes quan el component es desmunte en el hook `useSEO` per evitar conflictes.
4. **Limitació del Sitemap (WP) i Rutes:** Recomana afegir un límit estricte de 50.000 URLs per sitemap al plugin per alinear-se amb els límits imposats per Google. Així mateix, l'ús de `blank.php` que força margin-0 trenca panells d'administració; s'ha de limitar al funcionament PWA.
5. **Arquitectura del Xat:** Confirma la necessitat d'una capa de servei independent (`chatService.js` / Transport), i utilitzar exclusivament `id` + timestamp per optimitzar l'emmagatzematge i la lògica d'unió de missatges.

---

## 10. Z (Auditoria Global Infractible)

La IA Z ha realitzat una "Auditoria Global Infractible" destapant 23 incidències crítiques, altes i mitjanes que cal resoldre abans de fer res:

1. **Rutes i Redirects:** Detecta un triple redirect innecessari (`/iaia` → `/chats/iaia-maria` → `/chat/iaia-maria`), i que falten les rutes `versions` i `legal` al `PAGE_ROUTE_MAP`.
2. **Codi Orfe i Duplicat:** Denúncia l'existència de funcions mortes a `supabaseBackend.js` (com `saveChatConversationMap`) i duplicitat severa d'utilitats (`normalizeText`, `stripMarkdownImages`, etc.) repartides entre `assetResolver.js`, `contentHelpers.js` i `supabaseBackend.js`. A més, hi ha imports inútils de `lucide-react`.
3. **Propietats CSS Indefinides (Crític):** Descobreix que hi ha multitud de variables CSS usades en `index.css` que no estan declarades enlloc (ex: `--sdp-radius-md`, `--sdp-color-focus`, `--sdp-t-rapida`). Açò trenca la interfície silenciosament. També troba unes 200 línies de CSS mort referent a un component TOC inexistent i inconsistències entre l'ús de les classes `.sdp-card` i `.sp-card`.
4. **Bugs de Lògica i Render:**
   - A `useSEO.js`: Les props `status` i `index` estan sent ignorades, cosa que impedeix l'enviament de `<meta name="robots" content="noindex">` a les pàgines 404, afectant greument al SEO.
   - A `supabaseBackend.js` (`request()`): Si el senyal d'avortament ja està abortat prèviament (`signal.aborted`), la funció cau en la trampa i l'ignora.
   - A `AppDataContext.jsx`: El tema `system` s'ignora completament per culpa del codi local de React tot i que el PHP intenta respectar-lo.
5. **Preparació CRDT i Xat:**
   - La funció `sendChatMessage` fa una actualització optimista però **mai fa un rollback** si la petició falla. L'usuari perd la dada sense saber-ho.
   - El sistema necessita obligatòriament un **Rellotge Lògic** (Lamport Timestamp) en comptes del `Date.now()` client-side, i un camp de versió al `mergeChatMessages` per ser viable per als CRDTs.
   - Les crides de RLS (`isRemoteUnavailable`) no tenen un TTL temporal. S'oculten permanentment els intents remots.
6. **Sincronització WordPress:** La llista `sdp_route_pattern` dins de `sdp-seo.php` necessita sincronitzar-se automàticament des de `seo-routes.json` en lloc de llistar les rutes manualment en un string hardcoded.

---

## 11. Dola (Auditoria d'Errors Silenciosos i Standalone)

Dola ha analitzat 15.938 línies de codi i ha detectat 18 problemes estructurals addicionals, destacant com a altament crítics:

1. **Ruta del Xat Inexistent (Crític):** Descobreix que, tot i haver-hi redireccions cap a `/chat`, **no hi ha cap `<Route path="/chat">` definida** a l'App.jsx. A més, el component `XatSection` s'importa però mai s'usa. El xat ara mateix porta a un 404 permanent.
2. **Falsa Sanitització a Supabase:** Verifica que la llibreria `DOMPurify` està al bundle però **no s'està cridant**. Les entrades d'usuari a `mapSectionSubmissionToItem` s'envien i s'enlairen tal qual a la base de dades sense sanititzar, permetent injecció directa de codi de tercers.
3. **UUID No Criptogràfic (Crític):** Detecta que el fallback per generar IDs a `generateUUID()` fa servir `Math.random()`, un vector dèbil per a col·lisions. Exigeix emprar `crypto.getRandomValues()`.
4. **Mala Gestió d'Errors i Timeouts:** La petició de xarxa a Supabase (`request()`) té un `setTimeout` dur de 12 segons impossible de configurar, i hi ha **14 blocs `catch {}` buits** en l'aplicació que ignoren per complet errors crucials, fent impossible l'auditoria dels fallos en producció.
5. **Mode Standalone (Offline-first real):** Si WordPress cau, la PWA actualment no pot arrancar perquè depèn de `blank.php` de WordPress. Suggereix dissenyar un `index.html` standalone independent de WP que permeta la PWA operar 100% offline fins i tot si el host ha caigut.
6. **Shadow DOM i Esdeveniments:** Els events personalitzats no travessen el Shadow DOM si no usen `composed: true`, cosa crítica per a la comunicació CRDT. A més, descobreix que el BroadcastChannel de React no té cap verificació de payload, reaccionant cegament a qualsevol event amb type `content:updated`.
