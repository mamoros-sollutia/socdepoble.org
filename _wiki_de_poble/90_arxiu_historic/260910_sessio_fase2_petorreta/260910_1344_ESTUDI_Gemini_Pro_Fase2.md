---
tipus: estudi_ia
estat: tancat
description: "Auditoria de Fase 2 (Post-P0) per Gemini Pro"
---
# 🧠 ESTUDI CONSELL: Gemini Pro (Fase 2)

El bloc P0 ha assegurat els fonaments i ha tancat les vies d'aigua més urgents. Hem aturat la "Fossilització Inversa", l'autenticació ja no depèn d'emmagatzematge local persistent corrupte, i hem acceptat la realitat de l'Online-First. Però si volem que el Mas aguante una crescuda x10 i es prepare per a la renderització en servidor (SSR), l'arquitectura actual encara té clivells perillosos.

Ací teniu l'Auditoria de Fase 2, directa i sense anestèsia.

---

### 1. Vulnerabilitats Estructurals Latents (Post-P0)

Tot i els pedaços, el teixit connectiu entre React i el backend (Supabase) presenta fragilitats que explotaran sota càrrega:

* **L'Embut dels Contextos (Pyramid of Doom):** En `App.jsx`, l'aplicació envolta el contingut amb una cascada de cinc proveïdors (`CoreContentProvider` > `MurProvider` > `NotesDataProvider` > `XatProvider` > `MultimediaProvider`). Cada un fa la seua pròpia crida a Supabase en muntar-se. Qualsevol canvi d'estat al `CoreContent` forçarà un re-renderitzat massiu de tota la cascada inferior, creant colls d'ampolla a la interfície.

* **Gestió d'Estat Lligada al DOM:** L'autenticació depèn d'esdeveniments purs del DOM (`window.dispatchEvent(new CustomEvent('sdp:auth-change'))`) per notificar a React. Si un component no està muntat exactament en el moment del tret, perdrà el canvi d'estat. És una mescla perillosa de patrons imperatius i declaratius.

* **Data Fetching cec i seqüencial:** Dins dels contextos (ex: `XatContext.jsx`), es carreguen les dades mitjançant `useEffect`. Aquest patró "renderitza, després carrega" és ineficient i trenca completament la il·lusió d'instantaneïtat.

### 2. El Deute Tecnològic Més Crític (Escalabilitat x10)

Si el projecte creix x10 en usuaris i dades, el mur col·lapsarà per aquests dos motius estructurals:

* **El Monòlit de 3.700 línies (`index.css`):** Actualment teniu un sol fitxer de 3766 línies que ho governa pràcticament tot. Encara que està dividit per comentaris (Tokens, Base, Components), qualsevol canvi en un component aïllat obliga a processar i transmetre tot el bloc. La "Pedra Seca" demana aïllament; aquest fitxer és formigó armat inescalable.

* **Enrutament tòxic per a SSR:** El vostre enrutador fet a mà (`RouterContext.jsx`) interacciona directament amb `window.location` i `window.history.pushState` en la seua inicialització. En un entorn de servidor (Node.js per a SSR), `window` no existeix. Aquest enrutador provocarà una fallada fatal instantània ("window is not defined") si s'intenta pre-renderitzar al backend.

### 3. Pla de Fase 2: Deconstrucció, Fragmentació i SSR

Per preparar el Mas per a un futur líquid i robust, caldrà executar un patró arquitectònic quirúrgic, mantenint l'estètica "Pedra Seca" però refent la plomeria:

#### A. Deconstrucció CSS (Zero Tailwind, Màxima Modularitat)
* **Extracció de Tokens:** `design-tokens.css` i la Capa 2 (Variables Semàntiques) s'han de mantenir com a base global.
* **CSS per Component (Colocation):** En comptes d'un `index.css` monolític, cada component ha de tenir la seua fulla d'estils al costat (ex: `UniversalCard.jsx` i `UniversalCard.css`). Això permetrà que el `PedraSecaEmbed.jsx` o Vite carreguen només el CSS necessari per a la vista actual, reduint l'overhead de la xarxa.

#### B. Fragmentació de Components
* **Trossejar l'abisme:** `UniversalElements.jsx` té 795 línies i conté des de botons genèrics fins a estructures complexes de targetes. S'ha de dividir en àtoms (`Button.jsx`, `Badge.jsx`, `Icons.jsx`) i molècules (`UniversalCard.jsx`). Açò afavoreix el *tree-shaking* i evita que pantalles senzilles importen codi mort.

#### C. Preparació per a SSR (Hidratació)
La hidratació exigeix que el HTML generat al servidor siga idèntic al primer render del client. Per aconseguir-ho:
1. **Agnosticisme del DOM:** Desvincular l'enrutador de `window`. Cal crear un adaptador que injecte l'estat inicial de la URL (una memòria interna per al servidor i `popstate` per al client).
2. **Injecció d'Estat Inicial:** Substituir els `useEffect` de càrrega de dades per un patró de *Loaders*. El servidor (o backend de Sollutia) ha de fer les crides a Supabase, compilar les dades i injectar-les al HTML com una variable global (ex: `window.__SDP_INITIAL_STATE__`).
3. **Hidratació Síncrona:** Els contexts de React (`MurContext`, `XatContext`) han de llegir aquest estat inicial en muntar-se, evitant el parpelleig o un segon *fetching* inútil al client.
