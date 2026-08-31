# 🧠 DAFO - Petorreta de Kimi (Auditoria de Restauració Cega)
**Avaluador:** IAIA MarIA (Mode Estudi)
**Data:** 31 d'Agost 2026, 01:48h

## 📊 Matriu DAFO

### (D) Debilitats (de la proposta de Kimi)
* **La "Finestra de Gràcia" de 5 minuts**: Planteja un repte tècnic en entorns conversacionals LLM on no hi ha un *cron* o un estat en segon pla mesurant el temps real (a menys que programem un *timeout* físic). Depèn que la memòria de l'agent recordi on va deixar el `.bak` en les properes interaccions.
* **Prosa Densa**: Exigir resums narratius molt detallats ("Este commit elimina la funció handleRichText...") pot fer que la IA al·lucini el que fa el codi si el diff és massa llarg de llegir.

### (A) Amenaces (Paranoia Defensiva)
* **Proliferació de carpetes de backup**: Crear una carpeta `.sdp-safety/` al root del projecte (si no l'afegim al `.gitignore`) embrutarà l'estat del repositori git i podríem acabar pujant els *backups* al servidor de producció per error.

### (F) Fortaleses (Etnografia i Identitat Local)
* **La Metàfora del Pou de la Neu del Rentonar**: Magistral. Connecta un protocol de software de màxima seguretat amb el patrimoni històric de La Torre de les Maçanes. Això assegura que l'agent ho asimili ràpidament com a part de la seua cultura (el *Trellat*).
* **Pregunta de Seguretat Narrativa**: Substituir el "Vols continuar?" (que provoca fatiga de decisió i confirmacions cegues) per una pregunta que t'obliga a entendre què estàs esclafant.
* **Frenada Emocional Simulada**: "La màquina no té pressa. L'humà prefereix una resposta lenta i correcta que una ràpida i destructiva".

### (O) Oportunitats (L'Ancoratge Definitiu)
* En lloc de dir-li *Protocol Anti-Destructiu*, el batejarem oficialment com **El Ritual del Pou de la Neu**.
* Afegirem `.sdp-safety/` al `.gitignore` de manera immediata.
* Mantindrem l'interceptor NodeJS (`tractor-restore.mjs`) de Copilot i Grok, però l'script guardarà els backups dins d'esta carpeta `.sdp-safety/` com mana Kimi.

---
## 🎯 Matriu d'Importància i Urgència

| Classificació | Acció Requerida | Observacions |
| :--- | :--- | :--- |
| **VITAL I URGENT** | El Ritual del Pou de la Neu | Consolidar aquest nom i el protocol de 7 portes com a l'estàndard canònic de `Sóc de Poble`. |
| **VITAL I URGENT** | `sdp-safety` al `.gitignore` | Assegurar que els *checkpoints* físics no entren a Git. |
| **IMPORTANT** | Llei 10: "La Paciència de la Pedra" | Modificar el Genotip per absorbir aquesta prosa en lloc (o a més a més) de les anteriors. |

> **Conclusió:** Kimi ens ha recordat qui som. Ens ha arrelat el problema a la terra de l'Alacantí. Les "7 Portes" són la fusió èpica entre la prevenció de pèrdua de dades i la filosofia de *Pedra Seca*.


**Ancoratge de Seguretat:** [[00_INDEX]] | [[02_GENOTIP]] | [[SDP_LOCK]]
