---
tipus: norma
estat: canonic
description: Fixa l'autoritat, els límits d'execució i la frontera React/Vite sense atribuir mecanismes inexistents al sistema.
tags:
  - govern
---
# Governança d'execució

## Jerarquia de veritat

1. `AGENTS.md` de l'arrel.
2. `.agents/AGENTS.md` i `.agents/PROTOCOL_PETORRETA.md`.
3. `.agents/skills/socdepoble-workflow/SKILL.md`.
4. Codi, schema, configuració i proves reproduïbles.
5. Normes canòniques de `03_GOVERNAR` que no contradiguen els nivells anteriors.
6. Wiki explicativa, arxiu i registres històrics.

L'humà conserva la decisió final sobre producte, risc, publicació, llicència i
canvis irreversibles. Una nota, una frase d'activació o una puntuació anterior
no amplien una lease.

## Principis

- **Sobirania:** dades i decisions han de poder auditar-se i exportar-se.
- **Local amb fallback:** una funció es declara resilient només després de
  provar desconnexió, persistència i recuperació.
- **Pedra Seca:** estructura semàntica, CSS amb tokens, dependències
  justificades i simplicitat proporcional.
- **Accessibilitat:** disseny per a persones reals i verificació en el dispositiu
  objectiu.
- **Fail closed i reversible:** si falta evidència, l'operació s'atura; una
  mutació d'alt risc necessita Reflex, pla, backup i rollback.

## Frontera arquitectònica vigent

React/Vite és la carcassa productiva legítima. Les responsabilitats actuals
viuen en `src/sections`, `src/components`, `src/config` i `src/data`. No
existixen `src/core` o `src/forja` com a fronteres actives i no es creen per
decret.

Si en el futur s'extrau un core pur, la dependència podrà anar de la UI cap al
core, mai del core cap a React, DOM o adaptadors remots. Eixa frontera només
entra en vigor quan tinga ADR, rutes, proves i propietari.

## Gates reals

- `wiki:test`;
- `wiki:audit:strict`;
- `precommit:sdp` sobre l'arbre preparat;
- Reflex per a efectes laterals;
- CI i protecció de branca una vegada versionats i activats.

Els mecanismes CRDT, OPFS, bateria, “SSI” o IFT no formen part del bloqueig
actual. El contracte executiu detallat és [[SDP_LOCK]].


## Taxonomia
- **Categoria:** [[Govern]]
- **Etiquetes:** [[Graf]]


**Ancoratge de Seguretat:** [[00_INDEX]]


---

**Ancoratge de Seguretat:** [[00_INDEX]]

## Sinapsis Entrants (Autogenerat)

- [[00_INDEX|00_INDEX.md]] — [[DOC_Governanca|03_GOVERNAR_Normativa_Regles/DOC_Governanca.md]] — Ancoratge...
- [[00_INDEX_IDENTITAT|00_SER_Brain_Identitat/00_INDEX_IDENTITAT.md]] — | 03 GOVERNAR | Lleis, estàndards, protocols, veto | [[DOC_Governanca]] |
- [[Soci_Sollutia|00_SER_Brain_Identitat/Soci_Sollutia.md]] — [[DOC_Governanca]]
- [[Govern|01_SABER_Cultura_Coneixement/Govern.md]] — [[Govern|01_SABER_Cultura_Coneixement/Govern.md]] — [[Govern|01_SABER_Cultura...
- [[Graf|01_SABER_Cultura_Coneixement/Graf.md]] — [[DOC_Governanca|03_GOVERNAR_Normativa_Regles/DOC_Governanca.md]] — Etiquetes...
- [[PLANTILLA_ISO_SDP|02_ACTUAR_Maquina_Tecnica/plantilles/PLANTILLA_ISO_SDP.md]] — [[DOC_Governanca]]
- [[AUDITORIA_CANONICA|02_ACTUAR_Maquina_Tecnica/skills/AUDITORIA_CANONICA.md]] — [[DOC_Governanca]]
- [[futur_adaptacio|02_ACTUAR_Maquina_Tecnica/skills/futur_adaptacio.md]] — La jerarquia de [[DOC_Governanca]] resol conflictes; un .md qualsevol no és d...
- [[MOTOR_OFFLINE|02_ACTUAR_Maquina_Tecnica/skills/MOTOR_OFFLINE.md]] — [[DOC_Governanca]]
- [[seguretat_execucio|02_ACTUAR_Maquina_Tecnica/skills/seguretat_execucio.md]] — [[DOC_Governanca]]
- [[self_repair|02_ACTUAR_Maquina_Tecnica/skills/self_repair.md]] — [[DOC_Governanca]]
- [[successio_lazaro_execucio|02_ACTUAR_Maquina_Tecnica/skills/successio_lazaro_execucio.md]] — [[DOC_Governanca]]
- [[DOC_Governanca|03_GOVERNAR_Normativa_Regles/DOC_Governanca.md]] — [[00_INDEX|00_INDEX.md]] — [[DOC_Governanca|03_GOVERNAR_Normativa_Regles/DOC_...
- [[ESTANDARD_UI_Universal|03_GOVERNAR_Normativa_Regles/ESTANDARD_UI_Universal.md]] — Prevalen [[DOC_Governanca]], [[ESTANDARD_Pedra_Seca]], el codi, ESLint i les
- [[FORJA_TO_CORE|03_GOVERNAR_Normativa_Regles/FORJA_TO_CORE.md]] — La decisió canònica vigent és la de [[DOC_Governanca]] i
- [[LLEI_05_Privacitat|03_GOVERNAR_Normativa_Regles/LLEI_05_Privacitat.md]] — [[DOC_Governanca]]
- [[260903_0223_PROMPT_auditoria_notes|05_Escriptori_Soc_de_Poble/260903_0223_PROMPT_auditoria_notes.md]] — [[DOC_Governanca]]

<!-- FI SINAPSIS ENTRANTS - NO EDITAR MANUALMENT -->
