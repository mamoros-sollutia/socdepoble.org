---
estat: generat
tipus: document
description: Vista generada des de .agents/skills/core-bounded-action/SKILL.md; no editar.
source: .agents/skills/core-bounded-action/SKILL.md
source_sha256: 4db3e2378eb479af6e222ff412aab8d1035f5696dcca54b70e82fb85e8879d8e
---

> [!warning] FITXER GENERAT
> Font canònica: `.agents/skills/core-bounded-action/SKILL.md`. Qualsevol edició manual serà sobreescrita.

# core-bounded-action (Acció Limitada)

## Regles Operatives
1. **Blast Radius (Radi d'Explosió)**: Restringir l'abast explosiu de qualsevol canvi. Un sol commit no pot afectar a components globals i notes de disseny de forma simultània sense aprovació explícita i multi-etapa.
2. **Pressupost Estricte**: Les cerques i modificacions en massa han de tindre un límit dur (exemple: màxim de 10-12 fitxers per lot).
3. **Punts de Parada (Stop Conditions)**: Si una modificació en un fitxer genera errors estructurals o l'analitzador de *frontmatter* detecta anomalies, l'execució s'atura immediatament (Fail-Closed).
4. **Resolució Aïllada**: Els errors s'han de solucionar aïlladament abans de reprendre l'acció massiva.

---

**Ancoratge de Seguretat:** [[00_INDEX_MIRROR]]
