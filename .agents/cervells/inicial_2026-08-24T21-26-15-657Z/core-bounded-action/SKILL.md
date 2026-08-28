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
tests: null
triggers_on:
- bucle
- acció
- límits
- execució
- seguretat
- aturar
lang: ca
---

# core-bounded-action

Aquesta skill defineix els límits operatius de l'agent per assegurar que no faci accions destructives de forma autònoma.

## Principis d'Acció Limitada:
1. **No Destrucció:** Mai executar `rm -rf` en directoris no temporals sense llistar el contingut primer i demanar permís.
2. **Reversibilitat:** Tots els canvis importants han de ser fàcilment reversibles mitjançant Git. 
3. **Límits de Temps i Intents:** Els bucles d'automatització han de tenir condicions de sortida clares per no caure en cicles infinits.
4. **Alerta de Risc:** Si una acció pot sobreescriure codi canònic o desfer la feina no guardada del Mestre, cal demanar permís explícit.

L'acció autònoma està permesa, però sempre dins d'una caixa de sorra de seguretat estricta.
