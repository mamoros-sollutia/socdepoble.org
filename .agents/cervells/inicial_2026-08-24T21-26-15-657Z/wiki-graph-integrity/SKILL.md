---
name: wiki-graph-integrity
description: Skill for wiki-graph-integrity operations.
version: 2.0.0
status: active
owner: project-governance
purpose: Garanteix que el graf d'Obsidian (links i backlinks) es mantingui estable,
  sense trencar referències.
use_when: []
skip_when: []
scope: []
effects: []
requires:
- core-verified-change
conflicts_with: []
authority_level: procedural
freshness:
  reviewed_at: '2026-08-25'
  review_after: '2026-11-25'
tests:
- tests/triggers.yaml
- tests/behavior.yaml
triggers_on:
  - wiki-graph-integrity
---

# wiki-graph-integrity

Aquesta és una skill purificada creada per Codex. El contingut detallat serà implementat en les iteracions posteriors de disseny.
