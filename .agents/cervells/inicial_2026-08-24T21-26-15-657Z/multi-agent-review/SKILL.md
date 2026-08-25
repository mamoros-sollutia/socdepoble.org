---
name: multi-agent-review
description: Skill for multi-agent-review operations.
version: 2.0.0
status: active
owner: project-governance
purpose: Organitza la revisió de treballs definint rols independents, contrastant
  evidències i discrepàncies.
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
  - multi-agent-review
---

# multi-agent-review

> Llig la composició canònica del Consell en la font designada. No codifiques models o rols en la skill. Registra només els agents realment invocats i conserva les discrepàncies.
