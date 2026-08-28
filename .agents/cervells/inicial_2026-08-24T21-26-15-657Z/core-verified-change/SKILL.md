---
name: core-verified-change
description: Skill for core-verified-change operations.
version: 2.0.0
status: active
owner: project-governance
purpose: >
  Aplica precondicions, proves proporcionals al risc, comparació abans/després,
  rollback i rebut.
use_when: []
skip_when: []
scope: []
effects: []
requires:
- core-bounded-action
conflicts_with: []
authority_level: procedural
tests: null
triggers_on:
- canvi
- verificar
- tests
- gate
- ci
- aprovació
lang: ca
---

# core-verified-change

Aquesta skill assegura que qualsevol canvi aportat al codi sigui testejat, compilat i complerts els requisits abans de donar-lo per vàlid.

## Procés de Canvi Verificat:
1. **Executar Validacions (Gate):** Abans de finalitzar el torn, s'ha d'executar `npm run gate` si s'ha tocat codi font JSX, CSS o configuracions.
2. **Arreglar el Deute:** Si el `gate` informa de classes òrfenes o augments de deute tècnic, l'agent ha d'arreglar-ho abans de considerar la tasca feta.
3. **Construcció Completa:** S'ha de verificar que `npm run build` passa correctament. Un codi que no compila és pitjor que codi no escrit.
4. **Tancament Correcte:** Esborrar fitxers residuals, diffs temporals i tancar els recursos oberts abans d'avisar l'usuari.

Un canvi no és un canvi fins que el Tractor Cognitiu i les lleis de Pedra Seca li donen la benedicció.
