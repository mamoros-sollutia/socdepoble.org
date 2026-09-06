---
tipus: estudi
estat: actiu
font: Gemini
data: "2026-09-06T14:00:33+02:00"
---

# Auditoria Gemini

## 1. Vulnerabilitats d'Autenticació i Enxufabilitat
* JWT al `localStorage` suposa vulnerabilitat XSS.
* Relé `oauthRelay.js` usant `window.opener.postMessage` és fràgil amb COOP (Cross-Origin Opener Policy) estricte.
* El pany de `host.js` congela implementació de forma asíncrona, si Sollutia l'injecta tard, falla.

## 2. Gestió d'Estat: El Monstre a la Memòria
* `src/app/AppDataContext.jsx` actua com un "God Object" (centralitza sessió, idioma i col·leccions).
* Qualsevol inserció mínima força un re-renderitzat global.
* Actualització optimista (Optimistic UI) fa rollback en memòria si la xarxa falla: dada perduda si l'usuari tanca la finestra.
* Manca total d'una cua de sincronització fora de línia real (RuralSyncQueue).

## 3. Base de Dades i Seguretat de Tenants
* Polítiques RLS per tenant incompletes (segons el deute de Sollutia).
* Risc de creuament de dades fatídic entre diferents pobles si el filtre `tenant_id` falla.

---
**Ancoratge de Seguretat:** [[00_INDEX_ESCRIPTORI]]
