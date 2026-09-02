---
tipus: protocol
estat: esborrany
description: Conserva com a proposta futura l'homologació de peces pures sense contradir la carcassa React/Vite actual.
tags:
  - govern
---
# Forja a Core — proposta futura

Este protocol **no està implementat en la baseline actual**. No existixen
`src/forja/` ni `src/core/`, i tampoc hi ha una comanda operativa
`npm run porta`. Per tant, cap agent pot usar este document per a
moure components, rebutjar React o declarar una homologació superada.

La decisió canònica vigent és la de [[DOC_Governanca]] i
[[ESTANDARD_Pedra_Seca]]: React/Vite és la carcassa productiva legítima. El codi
es localitza en `src/sections/`, `src/components/`, `src/config/` i `src/data/`.

## Hipòtesi que es conserva

En el futur pot ser útil extraure una peça a JavaScript o Web Components purs
quan un cas d'ús real necessite reutilització fora de React. La promoció seria
optativa i incremental; no una reescriptura general per decret.

Abans d'activar este protocol caldria:

1. una ADR que definisca el problema, la frontera i el cost de mantindre dos
   models de components;
2. crear les rutes reals i adaptar les regles d'agents;
3. implementar una prova reproduïble al Baseline 2022 (Safari/iOS 16);
4. definir compatibilitat, accessibilitat i funcionament offline mesurables;
5. integrar el gate en CI i demostrar-lo amb una regressió negativa;
6. establir un rollback i una política que impedisca duplicar components.

## Criteris candidats d'homologació

Només després de l'activació anterior, una peça candidata podria exigir:

- cap dependència UI injustificada;
- CSS basat en tokens `--sp-*`;
- HTML semàntic, focus visible i objectius tàctils verificats;
- prova offline en l'scope declarat;
- zero imports creuats que trenquen la frontera acordada;
- informe generat per proves, no un JSON escrit manualment.

## Sinapsis

- [[ESTANDARD_Pedra_Seca]]
- [[DOC_Governanca]]
- [[00_arquitectura_tecnica_unificada]]


## Taxonomia
- **Categoria:** [[Govern]]
- **Etiquetes:** [[Graf]]


**Ancoratge de Seguretat:** [[00_INDEX]]


---

**Ancoratge de Seguretat:** [[00_INDEX]]

## Sinapsis Entrants (Autogenerat)

- [[00_INDEX_IDENTITAT|00_SER_Brain_Identitat/00_INDEX_IDENTITAT.md]] — `[[00_BIOS]]` és una redirecció històrica i `[[FORJA_TO_CORE]]` una proposta
- [[AUDITORIA_CANONICA|02_ACTUAR_Maquina_Tecnica/skills/AUDITORIA_CANONICA.md]] — [[FORJA_TO_CORE]]
- [[260901_2359_BUNDLE_auditoria|05_Escriptori_Soc_de_Poble/260901_2359_BUNDLE_auditoria.md]] — `[[00_BIOS]]` és una redirecció històrica i `[[FORJA_TO_CORE]]` una proposta
- [[260902_0001_BUNDLE_auditoria|05_Escriptori_Soc_de_Poble/260902_0001_BUNDLE_auditoria.md]] — `[[00_BIOS]]` és una redirecció històrica i `[[FORJA_TO_CORE]]` una proposta
- [[260902_0156_BUNDLE_auditoria_v7|05_Escriptori_Soc_de_Poble/260902_0156_BUNDLE_auditoria_v7.md]] — `[[00_BIOS]]` és una redirecció històrica i `[[FORJA_TO_CORE]]` una proposta

<!-- FI SINAPSIS ENTRANTS - NO EDITAR MANUALMENT -->
