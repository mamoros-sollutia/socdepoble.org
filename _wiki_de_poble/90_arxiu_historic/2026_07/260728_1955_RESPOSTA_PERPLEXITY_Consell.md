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
# Resposta de Perplexity (Auditoria Destructiva)

## 1. Function Calling
Sospita el mateix: diu que hi falta el bucle d'orquestració on s'executa l'eina i es torna el resultat al model, o que la funció no s'està interceptant correctament. (Com als anteriors, no ha vist el `cervell.mjs` on sí que s'intercepta).

## 2. Desplegament 24/7
Recomana exactament el mateix que la resta del Consell: **Compute Engine (VM petita)** amb disc persistent muntat a `/data` per guardar `.iaia_auth` i `var/baileys-runtime`, orquestrat amb `systemd` o Docker.
Descarta rotundament Cloud Run per l'estat persistent necessari per al WebSocket de Baileys.

## 3. Auditoria General
Comenta el mateix: els camins de dades haurien de ser configurables per variable d'entorn i no dependre del `process.cwd()`, i apunta a un potencial coll d'ampolla a l'historial del model. Demana la resta del codi per afinar.


---

**Ancoratge de Seguretat:** [[00_INDEX]]