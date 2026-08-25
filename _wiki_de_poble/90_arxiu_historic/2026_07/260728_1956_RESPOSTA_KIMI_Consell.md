---
estat: auditat
tipus: document
tags:
- arxiu
- consell_ia
- historic
- iaia_maria
- resposta_ia
- socdepoble
---
# Resposta de Kimi (Auditoria Destructiva)

## 1. Function Calling
Sense novetats. Continua demanant el codi del `cervell.mjs` per poder auditar-ho.

## 2. Desplegament 24/7 (La Fortalesa de Pedra)
Recomanació contundent: **Compute Engine (VM)**.
Descarta Cloud Run per ser incompatible amb el WebSocket persistent de Baileys.
Aporta un esquema clar: GCE + Docker + Disc Persistent per al `AUTH_DIR`. Suggereix convertir les rutes d'autenticació en absolutes mitjançant una variable d'entorn `IAIA_DATA_DIR` per poder muntar el volum en Docker fàcilment.
Remarca la necessitat d'un Cron de backup de la sessió cada 6 hores.

## 3. Auditoria General
- **Riscos operatius:** Demana implementar `process.on('unhandledRejection')` i `uncaughtException` al `index.mjs` (com recomanava Gemini).
- **Caigudes:** Assenyala que `onFatal` en Baileys hauria de forçar un `process.exit(1)` per obligar a PM2/Docker a reiniciar el procés.
- **Observabilitat:** Recomana afegir un xicotet servidor HTTP al port 8080 per poder fer health checks.
- **Sobrecàrrega:** Falta un rate limit per evitar esgotar la quota de Gemini si hi ha molts usuaris.


---

**Ancoratge de Seguretat:** [[00_INDEX]]