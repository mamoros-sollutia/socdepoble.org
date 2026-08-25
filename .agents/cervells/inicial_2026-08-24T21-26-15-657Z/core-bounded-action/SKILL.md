---
name: core-bounded-action
description: Skill for core-bounded-action operations.
version: 2.0.0
status: active
owner: project-governance
purpose: Planifica accions amb abast, pressupost, reversibilitat i stop conditions.
use_when: []
skip_when: []
scope: []
effects: []
requires: []
conflicts_with: []
authority_level: procedural
freshness:
  reviewed_at: '2026-08-25'
  review_after: '2026-11-25'
tests:
- tests/triggers.yaml
- tests/behavior.yaml
triggers_on:
  - core-bounded-action
---

# core-bounded-action (Acció Limitada)

## Regles Operatives
1. **Blast Radius (Radi d'Explosió)**: Restringir l'abast explosiu de qualsevol canvi. Un sol commit no pot afectar a components globals i notes de disseny de forma simultània sense aprovació explícita i multi-etapa.
2. **Pressupost Estricte**: Les cerques i modificacions en massa han de tindre un límit dur (exemple: màxim de 10-12 fitxers per lot).
3. **Punts de Parada (Stop Conditions)**: Si una modificació en un fitxer genera errors estructurals o l'analitzador de *frontmatter* detecta anomalies, l'execució s'atura immediatament (Fail-Closed).
4. **Resolució Aïllada**: Els errors s'han de solucionar aïlladament abans de reprendre l'acció massiva.
