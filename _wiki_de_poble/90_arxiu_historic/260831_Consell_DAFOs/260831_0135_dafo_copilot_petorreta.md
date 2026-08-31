# 🧠 DAFO - Petorreta de Copilot (Auditoria de Restauració Cega)
**Avaluador:** IAIA MarIA (Mode Estudi)
**Data:** 31 d'Agost 2026, 01:35h

## 📊 Matriu DAFO

### (D) Debilitats (de la proposta de Copilot)
* **Complexitat Excessiva:** Demana `Pull Requests`, `merge amb squash`, entorns de staging automàtics... coses inassumibles a curt termini en el flux de desenvolupament local del Mestre (estem en `localhost` amb Vite i Supabase, no en un pipeline corporatiu enorme).
* **Falsa Seguretat:** Copilot suggereix fer `git push origin backup-before-restore`. Això ompliria el repo remot de rames inútils.

### (A) Amenaces (Paranoia Defensiva)
* **Col·lapse per Burocràcia:** Si apliquem *tot* el que diu Copilot, trigarem hores a restaurar una simple coma, provocant fricció i frustració al Mestre.
* **Tokens Màgics MFA:** Requerir "Tokens MFA" generats per un sistema extern o un "Two-person rule" per confirmar (som només el Mestre i jo) és poc realista a l'arquitectura de *Pedra Seca*.

### (F) Fortaleses (El nucli bo)
* **El Script de Snapshot:** Molt pràctic; l'script d'entrada que calcula el *Blast Radius* contant els fitxers i línies tocades és espectacular per donar visibilitat abans del daltabaix.
* **Micro-Prompts situacionals:** La idea de tindre diàlegs predefinits de rebuig ("No escriure encara. Mostra'm el diff...") és excel·lent per reforçar l'actitud de la IAIA en temps real.

### (O) Oportunitats (Fusió amb Codex)
* **Interceptor:** Copilot complementa perfectament Codex en un punt: Codex defineix *què* pensar (la teoria) i Copilot defineix *com* tancar la clau (el mecanisme dur). La solució ideal és el script proposat per Copilot (`core-safe-restore.mjs`) forçant les 8 fases de Codex.

---
## 🎯 Matriu d'Importància i Urgència

| Classificació | Acció Requerida | Observacions |
| :--- | :--- | :--- |
| **VITAL I URGENT** | Càlcul de *Blast Radius* | Saber quàntes línies i fitxers perdríem en un `git checkout`. |
| **IMPORTANT I URGENT** | Creació del Script Interceptor (Wrapper) | Aplicar la solució "C" de Copilot (Fragment Node) dins de `tooling/gates/` per obligar a complir el protocol de Codex sense que la IA pugui "enganyar". |
| **DESCARTAT** | Pipelines CI/CD pesats | Estem en l'Escriptori de *Sóc de Poble*, prioritzem la fluïdesa artesanal. |

> **Conclusió:** Copilot ens dona les eines pràctiques per forçar la llei de Codex. La decisió destil·lada de la combinació d'ambdós és clara: implementar un script NodeJS de restauració amb dues fases obligatòries (inspecció + aprovació amb rebut) per bloquejar la instrucció directa `git checkout`.


**Ancoratge de Seguretat:** [[00_INDEX]] | [[02_GENOTIP]] | [[SDP_LOCK]]
