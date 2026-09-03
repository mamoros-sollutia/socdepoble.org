---
tipus: plantilla
estat: esborrany
description: Plantilla base per crear documents coherents amb l'esquema de metadades v2 de la Wiki.
tags:
  - maquina
---
# 🛡️ PETORRETA AL CONSELL: AUDITORIA

## Font de Logos

Els logos oficials no s’incrusten ací.

Consulta sempre: [[DOC_Logos_Oficials]]

---

## Frontmatter Obligatori

```yaml
---
estat: 'esborrany'
tipus: '{document|index|norma|protocol|registre|skill|plantilla|acta|informe|prompt|petorreta}'
description: '{descripció concreta i accionable, de 12 a 140 caràcters}'
aliases:
  - '{àlies opcional; elimina aquest bloc si no en cal cap}'
---
```

`aliases` i `revisat` són opcionals. Només una decisió humana pot canviar
`estat` a `canonic`; Git i el rebut del Reflex en són la traça autoritativa.
Si cal mostrar la data dins d'Obsidian, es pot afegir `revisat: 'AAAA-MM-DD'`
sense convertir-la en un duplicat obligatori. El directori, el `tipus` i els
enllaços del cos fan de taxonomia: no reintroduïsques `categoria` ni `tags`.

## Bloc Fixe d’Identitat

**Qui Som (La Nostra Història):** Som l'Associació ecologista El Rentonar i Sóc de Poble. Aquest projecte és l'hereu de més de 30 anys d'activisme rural i lluita pel nostre entorn natural i patrimonial. El nostre llegat i identitat digital resideixen històricament en `rentonar.blogspot.com`, van evolucionar a l'antiga plataforma fundacional `socdepoble.net`, i avui es materialitzen construint `socdepoble.org` (el Mas).

**Filosofia:** [[el_projecte|Sóc de Poble]] s'integra dins de **Sollutia** per a teixir una xarxa social comunitària. La IAIA MarIA actua amb Trellat, mínima intervenció, el Baseline 2022 com a jutge i respecte absolut per la llengua, la memòria i la gent major.
*(Nota de Full de Ruta: L'objectiu a llarg termini és una sobirania tecnològica rural hiper local-first i fora de xarxa per a dispositius antics, però actualment no heu de prioritzar aquesta meta si xoca amb la integració online).*

## Objectiu

`OBJECTIU: Realitzar una Auditoria Tècnica profunda del Bundle adjunt, detectant i eliminant deute tècnic (especialment col·lisions de CSS i codi brossa), i avaluant l'arquitectura amb un DAFO.`

## Context Necessari

- Hem refactoritzat recentment el CSS (`NotesSection.css`) per eliminar regles "fantasma" que trencaven el disseny vertical (tallaven les imatges hero).
- El Mestre Javi prioritza la "netedat" absoluta del codi i la mínima intervenció (filosofia Pedra Seca).
- Sospitem que el codi pateix de cert deute heretat. Volem erradicar els `!important` que trenquen l'especificitat del CSS i qualsevol altre codi inútil o redundant.

## Instrucció Principal

`EXECUTA: Analitza el Bundle adjunt. Identifica els blocs de codi brossa o innecessari. Proposa solucions directes per eliminar els "!important" del CSS (buscant alternatives d'especificitat o componentització adequades). Redacta també un DAFO (Debilitats, Amenaces, Fortaleses, Oportunitats) sobre l'estat tècnic del projecte i la seua escalabilitat.`

## Output Esperat

`FORMAT: Informe directe amb llista de fitxers a modificar (indicant línies exactes a esborrar o canviar) i la matriu DAFO, sense afalacs innecessaris ni "AI slop".`

---

## [IF:tipus=skill]

### Activació

Aquesta skill s’activa quan:

- `{trigger_1}`
- `{trigger_2}`

### Regles d’Execució

1. `{regla_obligatoria_1}`
2. `{regla_obligatoria_2}`
3. `{regla_obligatoria_3}`

### Output de Skill

La skill ha de retornar:

```json
{
  "ok": true,
  "summary": "string",
  "actions": [],
  "warnings": [],
  "errors": []
}
```

---

## [IF:tipus=acta]

### Decisions Preses

| Decisió | Motiu | Impacte |
|---|---|---|
| `{decisio}` | `{motiu}` | `{impacte}` |

### Pròxims Passos

- `{pas_1}`
- `{pas_2}`

---

## [IF:tipus=informe]

### Criteris

- estructura
- contradiccions
- duplicats
- scripts
- governança
- Core/Forja
- privacitat

### Output Obligatori

```json
{
  "ok": false,
  "score": 0,
  "critical": [],
  "high": [],
  "medium": [],
  "low": [],
  "next_actions": []
}
```

---

## [IF:tipus=protocol]

### Precondicions

- `{precondicio_1}`
- `{precondicio_2}`

### Procediment

1. `{pas_1}`
2. `{pas_2}`
3. `{pas_3}`

### Criteri d’Èxit

`EXIT: {criteri verificable}`

---

## Tancament Obligatori

- No yapping.
- No dependències supèrflues.
- No Tailwind al Core.
- No tocar dades personals sense base legal.
- Si hi ha risc de destrucció, activa SDP-LOCK.

## Sinapsis

- [[00_BIOS]]
- [[02_GENOTIP]]
- [[DOC_Governanca]]
- [[DOC_Logos_Oficials]]
- enginyeria_inversa_mit


## Taxonomia
- **Categoria:** [[Maquina]]
- **Etiquetes:** [[Graf]]


**Ancoratge de Seguretat:** [[00_INDEX]]

## Sinapsis Entrants (Autogenerat)

- [[00_BIOS|00_SER_Brain_Identitat/00_BIOS.md]] — [[PLANTILLA_ISO_SDP|02_ACTUAR_Maquina_Tecnica/plantilles/PLANTILLA_ISO_SDP.md...
- [[02_GENOTIP|00_SER_Brain_Identitat/02_GENOTIP.md]] — [[PLANTILLA_ISO_SDP|02_ACTUAR_Maquina_Tecnica/plantilles/PLANTILLA_ISO_SDP.md...
- [[DOC_Logos_Oficials|00_SER_Brain_Identitat/DOC_Logos_Oficials.md]] — [[PLANTILLA_ISO_SDP]]
- [[el_projecte|00_SER_Brain_Identitat/el_projecte.md]] — [[PLANTILLA_ISO_SDP|02_ACTUAR_Maquina_Tecnica/plantilles/PLANTILLA_ISO_SDP.md...
- [[Graf|01_SABER_Cultura_Coneixement/Graf.md]] — [[PLANTILLA_ISO_SDP|02_ACTUAR_Maquina_Tecnica/plantilles/PLANTILLA_ISO_SDP.md...
- [[Maquina|01_SABER_Cultura_Coneixement/Maquina.md]] — [[PLANTILLA_ISO_SDP|02_ACTUAR_Maquina_Tecnica/plantilles/PLANTILLA_ISO_SDP.md...
- [[00_plantilles|02_ACTUAR_Maquina_Tecnica/07_plantilles/00_plantilles.md]] — [[PLANTILLA_ISO_SDP.md|Plantilla Prompt ISO històrica]]
- [[PLANTILLA_ISO_SDP|02_ACTUAR_Maquina_Tecnica/plantilles/PLANTILLA_ISO_SDP.md]] — [[DOC_Logos_Oficials|00_SER_Brain_Identitat/DOC_Logos_Oficials.md]] — [[PLANT...
- [[DOC_Governanca|03_GOVERNAR_Normativa_Regles/DOC_Governanca.md]] — [[PLANTILLA_ISO_SDP|02_ACTUAR_Maquina_Tecnica/plantilles/PLANTILLA_ISO_SDP.md...

<!-- FI SINAPSIS ENTRANTS - NO EDITAR MANUALMENT -->
