---
name: security-application
description: Skill for security-application operations.
version: 2.0.0
status: active
owner: project-governance
purpose: Revisió de codi adversària i coherència de contractes de seguretat.
use_when: []
skip_when: []
scope: []
effects: []
requires:
- core-trust-boundary
conflicts_with: []
authority_level: procedural
freshness:
  reviewed_at: '2026-08-25'
  review_after: '2026-11-25'
tests:
- tests/triggers.yaml
- tests/behavior.yaml
triggers_on:
  - security-application
---

# security-application

Aquesta és una skill purificada creada per Codex. El contingut detallat serà implementat en les iteracions posteriors de disseny.
