---
name: cog-deliberation
description: Skill for cog-deliberation operations.
version: 2.0.0
status: active
owner: project-governance
purpose: Delibera internament. Publica només decisió, evidència, alternatives i justificació;
  no el procés de raonament.
use_when: []
skip_when: []
scope: []
effects: []
requires:
- core-evidence-calibration
conflicts_with: []
authority_level: procedural
freshness:
  reviewed_at: '2026-08-25'
  review_after: '2026-11-25'
tests:
- tests/triggers.yaml
- tests/behavior.yaml
triggers_on:
  - cog-deliberation
---

# cog-deliberation

> Delibera internament. Comunica la decisió, l'evidència, els supòsits, les alternatives descartades quan siguen rellevants i la incertesa; no reveles raonament privat.
