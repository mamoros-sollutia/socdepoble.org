# Auditoria Copilot - 27 Agost 2026 (Sóc de Poble)

### Resum executiu curt
**Verdict ràpid:** la direcció és correcta però hi ha punts crítics que poden provocar bloqueigs, pèrdua de dades o regressions en entorns A10/WebKit legacy i dins d’un embed WordPress. Calen correccions concretes en la gestió d’errors asíncrons d’IndexedDB, sincronització del bootstrapping amb React mount, i reforç del singleton guard i l’aïllament de rutes. A continuació trobareu una llista prioritzada de problemes detectats, proves a executar, i pedaços de codi en Vanilla JS per mitigar riscos immediats.

---

## 1. Riscos crítics i proves immediates (ordre per gravetat)
| **Risc** | **Impacte** | **Prova ràpida** |
|---|---:|---|
| **Race entre `getSnapshot` asíncron i React mount** | App pot renderitzar amb estat incomplet; UI bloquejada o errors null deref | Simular arrencada amb IDB lent (throttle) i comprovar render inicial i rehydration |
| **Pèrdua de dades per purga agressiva al primer `QuotaExceededError`** | Usuari perd outbox/messages; inconsistència amb servidor | Forçar `QuotaExceededError` i verificar que hi ha backup temporal i retry amb backoff. |
| **MemoryRouter + embed WordPress: enllaços externs i history leaks** | Enllaços interns del WP poden trencar la navegació de l’embed o viceversa | Inserir l’embed en un WP staging amb permalinks i provar navegació profunda i refresh. |
| **Condicions de carrera en outbox (concurrent saves)** | Duplicats, corrupció de WAL, o pèrdua d’entries | Executar múltiples `saveSnapshot` paral·lels; comprovar seqüència i idempotència. |
| **Fuites de memòria per listeners globals no netejats** | Consum creixent en sessions llargues en iPad A10 | Auditar `window` listeners (quota, online/offline, message) i assegurar `removeEventListener` en unmount. |

---

## 2. Anàlisi detallat i punts concrets a revisar

### 2.1 Race condition: `getSnapshot` asíncron vs React mount
**Problema:** si `loadAppData` (ara `getSnapshot`) és completament asíncron i React no espera el resultat abans de renderitzar components crítics, es poden produir:
- render amb estat buit → components que assumeixen dades provoquen errors;
- doble inicialització de subscripcions (p. ex. outbox listeners);
- rehydration tardana que sobreescriu l’estat UI amb dades antigues.

### 2.2 Estratègia de purga en `QuotaExceededError` (Circuit Breaker)
**Problema:** purga automàtica a la primera aparició (3 falls → purga IDB) pot eliminar dades no sincronitzades (outbox) i provocar inconsistència amb el servidor. També pot ser explotable per un atac de denegació d’escriptura (forçar quota errors repetits).

### 2.3 Concurrència en Outbox / WAL (Write-Ahead Log)
**Problema:** múltiples `saveSnapshot` concurrents poden escriure la mateixa seqüència o sobreescriure punters de curs, provocant corrupció o duplicats.

### 2.4 Aïllament de rutes: `MemoryRouter` + Singleton Guard
**Problema potencial:** `MemoryRouter` evita col·lisions amb l’history del WP, però:
- si l’embed exposa enllaços que obren en la mateixa finestra, poden interferir amb el parent;
- si hi ha scripts globals del WP que manipulen `window.location` o `history`, poden provocar incoherències.

### 2.5 Listeners globals i neteja en unmount
**Problema:** listeners de `window` (quota, online/offline, message, focus) que no es retiren provoquen fuites de memòria i comportament inesperat quan l’embed és re-muntat.

---

## 5. Pedaços de codi prioritaris (Vanilla JS) — resum
- **preflightLoad** (esperar snapshot amb timeout) — evita mount amb estat incomplet.
- **handleQuotaError** (backoff + selective cleanup + backup) — evita purga immediata.
- **withLock** (mutex per saves) — serialitza escriptures al WAL.
- **ensureSingleton** (reforçat) — evita múltiples mounts.
- **addDisposableEvent / disposeAll** — neteja listeners globals.

---
Si voleu, preparo:
- **(A)** Un conjunt de tests automatitzats (scripts Node) per fer les proves d’estrès i fault injection.
- **(B)** Un patch complet (diff) amb les funcions `preflightLoad`, `handleQuotaError`, `withLock`, i `ensureSingleton` integrades en el vostre flux actual.
