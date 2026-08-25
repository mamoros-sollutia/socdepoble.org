---
name: core-verified-change
description: Skill for core-verified-change operations.
version: 2.0.0
status: active
owner: project-governance
purpose: Aplica precondicions, proves proporcionals al risc, comparació abans/després,
  rollback i rebut.
use_when: []
skip_when: []
scope: []
effects: []
requires:
- core-bounded-action
conflicts_with: []
authority_level: procedural
freshness:
  reviewed_at: '2026-08-25'
  review_after: '2026-11-25'
tests:
- tests/triggers.yaml
- tests/behavior.yaml
triggers_on:
  - core-verified-change
---

# core-verified-change (Canvi Verificat)

## Regles Operatives
1. **Obligatorietat del Dry-Run**: Qualsevol operació destructiva, massiva o de mutació (Purgador, Teixidora, etc.) ha d'executar-se obligatòriament primer en mode `Dry-Run`. Si no s'ofereix `Dry-Run`, no hi ha acció.
2. **Revisió de Diffs**: Després d'un `Dry-Run`, s'han d'oferir els `diffs` clars del que es pretén modificar perquè s'aprove abans de procedir.
3. **Validació d'Integritat**: Abans de donar una tasca per finalitzada, s'han de passar els tests pertinents i el codi (o Markdown) no ha d'incomplir les regles de validació canònica.
4. **Rollback i Rebuts**: Si una escriptura falla o és rebutjada pel Llevataques (Mutation Kernel), ha de ser reversible, utilitzant els bloquejos (locks) i rebuts propis de l'arquitectura.
