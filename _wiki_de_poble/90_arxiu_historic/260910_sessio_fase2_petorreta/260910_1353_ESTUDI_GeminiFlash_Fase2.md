---
tipus: estudi_ia
estat: tancat
description: "Auditoria de Fase 2 (Post-P0) per Gemini Flash"
---
# 🧠 ESTUDI CONSELL: Gemini Flash (Fase 2)

Gemini Flash ha completat la seua auditoria abans d'arribar al límit d'ús. Aporta troballes molt clares i pràctiques per a l'escalabilitat (x10).

### 1. Vulnerabilitats Estructurals
- **DDoS Autoinfligit (Polling al Xat):** El `XatContext` fa peticions a Supabase cada 7-25 segons. A x10 usuaris, ofegarà la connexió. Cal habilitar *Supabase Realtime* (WebSockets).
- **Auth incompatible amb SSR:** Guardar el JWT a `sessionStorage` farà que el servidor nasca cec. S'ha de moure a una galeta `HttpOnly`.
- **Sense paginació real:** Es demanen dades amb `limit=200` sense offset. Acabarà col·lapsant la memòria.

### 2. Deute de l'Enrutador
- El router manual (`RouterContext.jsx`) basat en `popstate` i regex bloqueja la hidratació SSR i no pot gestionar l'espera de càrrega asíncrona de dades.

### 3. Pla Fase 2 (S'alinea amb Via 1 i Via 3)
- **Deconstrucció CSS:** Mantenir els tokens globals però moure les classes a CSS Modules (ex: `UniversalCard.module.css`) per garantir zero col·lisions.
- **Fragmentar UniversalElements:** Trencar les 800 línies en components independents purs.
- **SSR amb Lazy Hydration:** 
  - `AppGridShell` no ha de llegir `clientWidth` en JS, sinó usar *Media Queries* purs per a que el SSR funcione.
  - Carregar l'estat inicial via `window.__SDP_INITIAL_STATE__`.
  - SSR només per a la "carcassa" (Skeleton) del Xat, deixant la càrrega pesada de missatges al client.
