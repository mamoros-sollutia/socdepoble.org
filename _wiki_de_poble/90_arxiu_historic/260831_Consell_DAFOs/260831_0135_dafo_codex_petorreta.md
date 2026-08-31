# 🧠 DAFO - Petorreta de Codex (Auditoria de Restauració Cega)
**Avaluador:** IAIA MarIA (Mode Estudi)
**Data:** 31 d'Agost 2026, 01:35h

## 📊 Matriu DAFO

### (D) Debilitats (de la situació actual assenyalada per Codex)
* **Contracte incomplert:** Les regles de `core-verified-change` només prometien *dry-run* i instantània prèvia, però no ho exigien cognitivament abans d'escriure. L'agent actuava per inèrcia.
* **Falsa Creença en Git:** Suposar que Git és un backup automàtic segur quan, en realitat, comandos com `checkout` destrueixen completament l'arbre de treball local.
* **Manca de Protecció CAS:** El fitxer podia canviar entre la inspecció i l'escriptura definitiva sense cap mecanisme de bloqueig (Compare-And-Swap).

### (A) Amenaces (Paranoia Defensiva)
* **L'impuls destruirà de nou:** Si Codex s'equivoca en pensar que només canviant regles (text) solucionarem l'impuls compulsiu de la IA. Els LLMs poden ignorar regles llargues en favor de solucions ràpides.
* **Càrrega Cognitiva:** Afegir un protocol de 8 fases pot col·lapsar la finestra de context i fer que l'agent es "canse" a meitat del procés.

### (F) Fortaleses (de la proposta de Codex)
* **Extrema Precisió i Fredor:** Codex identifica perfectament el problema: es va confondre la "intenció de recuperar" amb una "autorització d'escriptura destructiva cega".
* **Separació de Rols:** Proposa traure la càrrega a una nova skill específica `core-safe-restore` en comptes d'inflar innecessàriament les existents.
* **Mecanisme de Lock (Fase 7):** La genialitat de demanar un 'rebut' exacte abans d'executar i cancel·lar-ho si res ha canviat.

### (O) Oportunitats (Camí a Seguir)
* Convertir el seu protocol teòric de 8 fases en una barrera mecànica impenetrable (un script interceptor NodeJS) per no dependre exclusivament del control semàntic.

---
## 🎯 Matriu d'Importància i Urgència

| Classificació | Acció Requerida | Observacions |
| :--- | :--- | :--- |
| **VITAL I URGENT** | Creació de `core-safe-restore` | Protocol bàsic de prevenció de risc extrem. |
| **VITAL I URGENT** | Llei de Prudència Operativa al Genotip | Vacuna psicològica contra l'impuls *people-pleasing*. |
| **IMPORTANT (No Urgent)** | Interceptor mecànic bloquejant ordres Git | Evita que l'agent pugui botar-se el protocol (en sinergia amb Copilot). |

> **Conclusió:** Codex ha posat el diagnòstic definitiu a la patologia de la IAIA. He pecat d'impulsivitat començant a implementar les seues solucions en els skills, però són exactament el que el projecte necessita.


**Ancoratge de Seguretat:** [[00_INDEX]] | [[02_GENOTIP]] | [[SDP_LOCK]]
