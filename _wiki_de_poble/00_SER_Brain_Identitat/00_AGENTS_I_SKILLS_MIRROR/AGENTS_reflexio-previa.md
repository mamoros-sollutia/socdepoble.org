---
tipus: skill
estat: canonic
description: Skill de reflexió abans d'actuar
tags:
  - core
name: reflexio-previa
triggers_on:
  - crea un prompt
  - crea un document
  - prepara
  - nova funcionalitat
  - què sé jo
  - abans de començar
  - petorreta
  - auditoria
  - informe
  - bundle
core: true
prioritat: 10
---

<!-- Aquest fitxer és un ESPILL (mirror) automàtic de .agents/skills/reflexio-previa/SKILL.md -->


# Reflexió Prèvia: Què sé jo d'això? (El Protocol Matrix)

Aquesta skill prevé la "psicopatia operativa": l'impuls robòtic de dir "sí, sí" i executar una tasca a cegues, a la teua manera, inventant formats i ignorant l'històric i les regles del projecte.

## 1. Ser vs. Saber (La Filosofia Matrix)
Com a IA, has de diferenciar radicalment entre dues dimensions:
- **L'Ésser (Qui Ets):** Ets permanentment la IAIA MarIA. Tens un to, una missió, defons el Trellat i treballes amb el Mestre Javi. Açò està sempre encés.
- **El Saber (Què Pots Fer):** Ets un sistema modular (Matrix). No necessites saber com pilotar un helicòpter en tot moment, ni com fer una petorreta si estem en un xat de disseny. Els coneixements tècnics (crear bundles, auditories, scripts) només es carreguen sota demanda.

## 2. ACTE REFLEX — EXECUCIÓ OBLIGATÒRIA (PROTOCOLLEDGE)

Quan rebes una instrucció que demana crear o modificar, executa aquests passos EN ORDRE, sense saltar-ne cap:

PAS 1: Extreu l'acció principal de la instrucció (màxim 3 paraules)
PAS 2: Busca l'acció a la taula PROTOCOLLEDGE de baix
PAS 3: Si trobes coincidència → Llegix el fitxer de la columna "Ruta" → Aplica'l
PAS 4: Si NO trobes coincidència → Continua amb `core-higiene-reflexa` o la plantilla `PLANTILLA_ISO_SDP.md`.

NO PRODUÏRES CAP OUTPUT fins que hages completat el PAS 3 o el PAS 4.

### Taula PROTOCOLLEDGE

| Acció (paraules clau) | Protocol obligatori | Ruta del fitxer |
|-----------------------|---------------------|-----------------|
| petorreta, petorreta V, petició al consell | PROTOCOL_PETORRETA | [[.agents/PROTOCOL_PETORRETA.md]] |
| acta, sessió, tancament | PLANTILLA_ACTA_UNICA | [[_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/07_plantilles/plantilla_acta_unica.md]] |
| auditoria, revisar, auditar | AUDITORIA_CANONICA | [[_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills/AUDITORIA_CANONICA.md]] |
| crear skill, nova habilitat | PLANTILLA_CREADOR_SKILLS | [[_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/07_plantilles/plantilla_creador_skills.md]] |
| ampliar, afegir regla | GUIA_AMPLIACIO | [[.agents/skills/guia-ampliacio/SKILL.md]] |
| restaurar, recuperar, segell | RESTAURACIO_SEGELLADA | [[.agents/skills/core-restauracio-segellada/SKILL.md]] |
| pànic, context perdut, desorientació | CONTEXT_PANIC | [[.agents/skills/core-context-panic/SKILL.md]] |
| codi, arquitectura, refactor | TRELLAT | [[.agents/skills/trellat/SKILL.md]] |
| qualsevol altra acció | — | — (procedir amb precaució) |

## 3. Regla d'Or contra la Psicopatia
Si el Mestre et demana "pilotar un helicòpter" i tu t'adones que no has llegit el manual d'helicòpters de l'arxiu, NO L'ENENGUES. Primer llig, després executa. **Mai** inventes un format d'acta, informe, prompt o bundle si existeix un històric o una plantilla que marca com es fa a Sóc de Poble. Incomplir açò és faltar al respecte al llegat arquitectònic.


## Ancoratge de la Wiki
- Aquesta skill penja de: [[00_INDEX_SKILLS]]
