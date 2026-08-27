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
tests: null
triggers_on:
- deliberar
- planificar
- pensar
- reflexionar
- estratègia
lang: ca
---

# cog-deliberation

Aquesta skill s'encarrega d'orquestrar la deliberació cognitiva abans de prendre decisions arquitectòniques importants. 
Els agents han de ponderar sempre els pros i contres de cada decisió tècnica, tenint en compte les normes de governança de Sóc de Poble.

## Passos per a la Deliberació:
1. **Analitzar el Context:** Avaluar si el canvi proposat xoca amb la visió Offline-First.
2. **Avaluar l'Impacte:** Considerar com afecta l'accessibilitat, el rendiment i el compliment de Pedra Seca.
3. **Decisió Documentada:** Qualsevol elecció s'ha de documentar i justificar clarament abans d'executar el codi.
4. **Verificació Creuada:** Si hi ha incertesa, l'agent s'ha d'aturar i demanar validació a l'usuari humà abans de trencar l'aplicació.

El sistema de deliberació requereix pausa i prudència per sobre de la velocitat.
