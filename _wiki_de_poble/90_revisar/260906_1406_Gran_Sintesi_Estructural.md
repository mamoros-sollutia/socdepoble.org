---
tipus: sintesi
estat: actiu
description: LA GRAN SÍNTESI ESTRUCTURAL (Consell dels 12)
---

# LA GRAN SÍNTESI ESTRUCTURAL (Consell dels 12)

Aquest document resumeix les troballes de les 12 auditories (Codex, Claude 1 & 2, Copilot, Gemini, Grok, Perplexity, Kimi, Dola, Deepseek, Z, Qwen) sobre l'arquitectura de Sóc de Poble.

## LES 5 GRANS VIES D'AIGUA (Punts de Trencament)

### 1. El Monstre a la Memòria (God Context)
- **Problema:** `AppDataContext.jsx` centralitza absolutament tot (sessió, idioma, llistes massives d'agents i missatges).
- **Símptoma:** Qualsevol interacció força el re-renderitzat de tota l'App. En mòbils i iPads vells (A10) això genera *Layout Thrashing* (caiguda de FPS), agreujat pel `useLayoutEffect` a `App.jsx`.
- **Risc:** Rendiment inacceptable, especialment en zones rurals amb dispositius modestos.

### 2. Autenticació Fràgil i XSS
- **Problema 1:** Els tokens JWT (la clau de casa) es guarden al `localStorage`, vulnerables a atacs XSS per qualsevol script de tercers (com plugins de WordPress).
- **Problema 2:** L'OAuth Relay usat per comunicar-se des de l'iframe de Sollutia (amb `window.opener.postMessage`) es trencarà amb el bloqueig de cookies de tercers i el COOP estricte dels navegadors moderns. 
- **Problema 3:** `RELAY_PER_DEFECTE` no coincideix amb els orígens permesos reals, provocant errors silenciosos de login.

### 3. Base de Dades Foradada
- **Problema 1:** Falten Claus Foranes (FK) crítiques (ex: `town_memberships.user_id` cap a `auth.users`), permetent la inserció d'usuaris fantasma. Les que hi ha no estan indexades.
- **Problema 2:** Les polítiques RLS per l'aïllament del multi-tenant (Sollutia) són incertes i la UI es fia d'amagar botons en lloc d'esperar a l'escut del backend.
- **Problema 3:** Operacions no atòmiques. Crear una organització i afegir-ne el propietari són crides separades. Si una falla, queda corrupte.

### 4. Integració Sollutia Inexistent (Ficció)
- **Problema:** No hi ha adaptador, ni contracte d'API, ni claus d'idempotència. El React de Sóc de Poble parla directament amb Supabase.
- **Símptoma:** A `MyProfileSection.jsx` s'arriba a "simular" que les dades es guarden amb èxit abans d'enviar-les.
- **Risc:** Quan Sollutia intente interactuar, hi haurà duplicitats, conflictes d'estat i dades esclafades perquè un ERP no ha de manar sobre els invariants de la BD sense una Capa de Domini al mig.

### 5. La Cadena de Portes (CI) es mossega la cua
- **Problema 1:** Bucle `S3` al `package.json`. `npm run build` falla en un clon net perquè exigeix un fitxer de SEO que es genera *després* de passar la porta que el comprova.
- **Problema 2:** Si falta un llibre de deute (`.X-deute.json`), la cadena es trenca i oculta els errors de les portes següents.
- **Problema 3:** `react` i `react-dom` estan a `devDependencies` en compte de `dependencies`.

---
**Ancoratge de Seguretat:** [[00_INDEX_ESCRIPTORI]]
