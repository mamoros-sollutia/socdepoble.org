---
tipus: document
estat: arxivat
description: Conserva la BIOS històrica i redirigix l'arrencada de l'agent cap al Reflex i les fonts d'autoritat reals.
tags:
  - core
  - genoma
  - identitat
---
# BIOS històrica — redirecció vigent

Esta pàgina conserva el nom de l'antiga BIOS perquè els enllaços no es trenquen,
però **ja no és el punt d'entrada executable**. Les ordres antigues
`node scripts/tallafocs.cjs`, `guardrail_escriptura.js`,
`validate_knowledge.cjs` i `build_incremental.cjs` no formen un preflight vàlid
en [[el_projecte|el projecte]] actual. Tampoc hi ha una pila activa basada en `idb-keyval`,
Y.js o WebRTC.

## Arrencada actual

1. Llegir `AGENTS.md`, `.agents/AGENTS.md`,
   `.agents/PROTOCOL_PETORRETA.md` i la Skill de workflow.
2. Localitzar codi, proves i documents estrictament relacionats amb la tasca.
3. Abans de qualsevol efecte lateral, completar `reflex_petorreta.mjs open`,
   crear Petorreta + manifest al bootstrap reservat i executar `seal`.
4. Fer dry-run, aplicar només l'operació autoritzada, verificar i consumir el
   rebut corresponent.

Les fonts mecàniques són [[00_arquitectura_tecnica_unificada]],
`scripts/schema.json`, l'Autoneteja v2, els tests i els hooks/CI quan estiguen
versionats. La frase «Sóc de Poble!» és un recordatori cultural, no una clau
d'escriptura.

## Llegat útil

Es conserven tres idees de l'antiga BIOS: protegir l'humà de treball mecànic,
preferir solucions simples i verificables, i aturar una operació quan la prova
no pot demostrar seguretat. La resta queda subordinada a [[02_GENOTIP]] i a
les fonts d'autoritat actuals.


## Taxonomia
- **Categoria:** [[Identitat]]
- **Etiquetes:** [[Graf]]


**Ancoratge de Seguretat:** [[00_INDEX_IDENTITAT]]


---

**Ancoratge de Seguretat:** [[00_INDEX_IDENTITAT]]

## Sinapsis Entrants (Autogenerat)

- [[00_BIOS|00_SER_Brain_Identitat/00_BIOS.md]] — [[00_BIOS|00_SER_Brain_Identitat/00_BIOS.md]] — [[00_BIOS|00_SER_Brain_Identi...
- [[00_INDEX_IDENTITAT|00_SER_Brain_Identitat/00_INDEX_IDENTITAT.md]] — [[00_BIOS]]
- [[02_GENOTIP|00_SER_Brain_Identitat/02_GENOTIP.md]] — [[00_BIOS]]
- [[CORE_Registre_Automillora|00_SER_Brain_Identitat/CORE_Registre_Automillora.md]] — Tornar a:[[00_BIOS]]
- [[el_projecte|00_SER_Brain_Identitat/el_projecte.md]] — [[00_BIOS|00_SER_Brain_Identitat/00_BIOS.md]] — en [[el_projecte|el projecte]...
- [[Soci_Sollutia|00_SER_Brain_Identitat/Soci_Sollutia.md]] — [[00_BIOS]]
- [[Graf|01_SABER_Cultura_Coneixement/Graf.md]] — [[00_BIOS|00_SER_Brain_Identitat/00_BIOS.md]] — Etiquetes: [[Graf]]
- [[Identitat|01_SABER_Cultura_Coneixement/Identitat.md]] — [[00_BIOS|00_SER_Brain_Identitat/00_BIOS.md]] — Categoria: [[Identitat]]
- [[00_arquitectura_tecnica_unificada|02_ACTUAR_Maquina_Tecnica/00_arquitectura_tecnica_unificada.md]] — [[00_BIOS|00_SER_Brain_Identitat/00_BIOS.md]] — Les fonts mecàniques són [[00...
- [[PLANTILLA_ISO_SDP|02_ACTUAR_Maquina_Tecnica/plantilles/PLANTILLA_ISO_SDP.md]] — [[00_BIOS]]
- [[FORJA_TO_CORE|03_GOVERNAR_Normativa_Regles/FORJA_TO_CORE.md]] — [[00_BIOS|00_SER_Brain_Identitat/00_BIOS.md]] — [[FORJA_TO_CORE|03_GOVERNAR_N...
- 05_Escriptori_Soc_de_Poble/260903_0223_PROMPT_auditoria_notes.md — [[00_BIOS]]

<!-- FI SINAPSIS ENTRANTS - NO EDITAR MANUALMENT -->
