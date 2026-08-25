---
estat: generat
tipus: document
description: Vista generada des de .agents/skills/core-verified-change/SKILL.md; no editar.
source: .agents/skills/core-verified-change/SKILL.md
source_sha256: ce2b7053983f18c54335009ca73d8e437bd7cfb98d736414f9b0f0366f135a59
---

> [!warning] FITXER GENERAT
> Font canònica: `.agents/skills/core-verified-change/SKILL.md`. Qualsevol edició manual serà sobreescrita.

# core-verified-change (Canvi Verificat)

## Regles Operatives
1. **Obligatorietat del Dry-Run**: Qualsevol operació destructiva, massiva o de mutació (Purgador, Teixidora, etc.) ha d'executar-se obligatòriament primer en mode `Dry-Run`. Si no s'ofereix `Dry-Run`, no hi ha acció.
2. **Revisió de Diffs**: Després d'un `Dry-Run`, s'han d'oferir els `diffs` clars del que es pretén modificar perquè s'aprove abans de procedir.
3. **Validació d'Integritat**: Abans de donar una tasca per finalitzada, s'han de passar els tests pertinents i el codi (o Markdown) no ha d'incomplir les regles de validació canònica.
4. **Rollback i Rebuts**: Si una escriptura falla o és rebutjada pel Llevataques (Mutation Kernel), ha de ser reversible, utilitzant els bloquejos (locks) i rebuts propis de l'arquitectura.

---

**Ancoratge de Seguretat:** [[00_INDEX_MIRROR]]
