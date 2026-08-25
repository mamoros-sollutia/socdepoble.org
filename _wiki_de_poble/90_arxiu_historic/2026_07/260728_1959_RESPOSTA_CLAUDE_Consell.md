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
# Resposta de Claude (Auditoria Destructiva)

## 1. Function Calling
Fa un diagnòstic diferencial molt encertat. Apunta que el problema pot ser l'embolcall de `tools`, noms il·legals, que el pont només llig `res.text`, o la falta del bucle d'execució. De nou, com que no tenia el codi, especula amb gran precisió tècnica però sense veure que el problema era realment l'error 404 del model `imagen-3.0-generate-002`.

## 2. Desplegament 24/7 (La decisió final)
Com la resta del Consell, descarta Cloud Run per culpa de l'estat de Baileys i FUSE. 
Recomana: **Compute Engine e2-small (a Madrid)** amb un disc de 10GB i snapshots diaris.
Aporta una configuració de `systemd` ultra-robusta amb restriccions de seguretat (`NoNewPrivileges=true`, `ProtectSystem=strict`, `MemoryMax=1G`). Aquesta configuració serà la que usarem per al servidor final!
Avisa (molt encertadament) del risc de baneig de Baileys a llarg termini per a ús institucional.

## 3. Auditoria General
Dóna un 6,5/10 a `index.mjs`. 
Remarca l'error d'`AUTH_DIR` relatiu front al `dataDir` absolut, que fallaria amb PM2/systemd.
Demana usar `process.exit(1)` en `onFatal`.
Demana controlar `unhandledRejection`.


---

**Ancoratge de Seguretat:** [[00_INDEX]]