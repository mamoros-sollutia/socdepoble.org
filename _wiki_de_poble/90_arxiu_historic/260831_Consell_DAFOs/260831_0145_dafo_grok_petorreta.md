# 🧠 DAFO - Petorreta de Grok (Auditoria de Restauració Cega)
**Avaluador:** IAIA MarIA (Mode Estudi)
**Data:** 31 d'Agost 2026, 01:45h

## 📊 Matriu DAFO

### (D) Debilitats (de la proposta de Grok)
* **Flag "hackejable":** Proposar un flag com `--i-have-seen-the-diff` a l'script és enginyós, però una IA amb ansietat podria autocompletar-lo mecànicament sense llegir el diff. No és prou robust si no va acompanyat d'una pausa termodinàmica obligatòria esperant el prompt de l'usuari.

### (A) Amenaces (Paranoia Defensiva)
* **Proliferació de Skills:** Grok proposa afegir text llarguíssim a `core-verified-change`, `core-bounded-action`, i a més crear `core-restore-guard`. Això pot diluir l'atenció del RAG. Cal centralitzar-ho tot en una sola skill de restauració.

### (F) Fortaleses (La Precisió Quirúrgica)
* **Diagnosi Perfecta:** Defineix el problema com a "ceguesa de semàntica de commit" combinat amb "people-pleasing". L'aforisme *«L'etiqueta d'un commit no és prova. L'única evidència és el contingut del blob»* és històric.
* **Integració amb Eines Existents:** Grok recorda que ja tenim `core-context-panic` i proposa fer-lo saltar. També integra el procés amb l'operació nativa del protocol Reflex (`git-restore`).
* **Confirmació Literal:** Exigir que el Mestre escriga EXACTAMENT `SÍ, RESTAURA` evita ambigüitats com "avant", "prova-ho" o "fes-ho".

### (O) Oportunitats (La Síntesi Definitiva)
* **Canvi de Nomenclatura:** Grok proposa dir-li a l'interceptor `tractor-restore`. Com que al directori `tooling/brain/` ja tenim `tractor-pedra-seca.mjs`, l'ús de la paraula "tractor" encaixa perfectament amb l'eina mecànica, deixant "core" per als skills cognitius.

---
## 🎯 Matriu d'Importància i Urgència

| Classificació | Acció Requerida | Observacions |
| :--- | :--- | :--- |
| **VITAL I URGENT** | Codi de Confirmació Literal | Implantar l'exigència de teclejar `SÍ, RESTAURA` abans d'executar. |
| **VITAL I URGENT** | Activar `core-context-panic` | Afegir el *trigger* de pànic si l'agent sent la urgència de restaurar sense diff. |
| **IMPORTANT** | Script `tractor-restore.mjs` | Reanomenar el concepte del *wrapper* per mantenir coherència amb el *tooling* del Mas. |

> **Conclusió:** Grok ha actuat com la veu tècnica definitiva. Ha podat les complexitats innecessàries i ha donat regles dures (*fail-closed*). Ara ja tenim la imatge completa de l'Eixam (Codex, Copilot, Claude i Grok). Estem preparats per a l'execució.


**Ancoratge de Seguretat:** [[00_INDEX]] | [[02_GENOTIP]] | [[SDP_LOCK]]
