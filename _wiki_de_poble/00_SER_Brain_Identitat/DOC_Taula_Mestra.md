---
tipus: index
estat: esborrany
description: Índex Dataview de les notes operatives, ordenat per connectivitat i amb metadades de l'esquema v2.
tags:
  - core
  - genoma
  - identitat
---
# 📊 Taula Mestra de la Wiki (Vista 2D)
> **⚠️ REQUISIT:** Per veure aquesta taula renderitzada (a l'estil Notion o Excel), necessites tenir instal·lat i activat el plugin de la comunitat anomenat **Dataview** a Obsidian.

```dataview
TABLE WITHOUT ID
  file.link AS "Títol",
  estat AS "Estat",
  tipus AS "Tipus",
  description AS "Descripció",
  aliases AS "Àlies",
  revisat AS "Revisat",
  (length(file.inlinks) + length(file.outlinks)) AS "Connexions"
FROM "00_SER_Brain_Identitat"
  OR "01_SABER_Cultura_Coneixement"
  OR "02_ACTUAR_Maquina_Tecnica"
  OR "03_GOVERNAR_Normativa_Regles"
WHERE file.name != this.file.name
SORT (length(file.inlinks) + length(file.outlinks)) ASC
```


## Taxonomia
- **Categoria:** [[Identitat]]
- **Etiquetes:** [[Graf]]


**Ancoratge de Seguretat:** [[00_INDEX_IDENTITAT]]


---

**Ancoratge de Seguretat:** [[00_INDEX_IDENTITAT]]

## Sinapsis Entrants (Autogenerat)

- [[00_INDEX_IDENTITAT|00_SER_Brain_Identitat/00_INDEX_IDENTITAT.md]] — [[DOC_Taula_Mestra]]
- [[01_IDENTITAT|00_SER_Brain_Identitat/01_IDENTITAT.md]] — Tornar a:**[[00_INDEX|00_index]], [[DOC_Taula_Mestra]]
- [[260901_2359_BUNDLE_auditoria|05_Escriptori_Soc_de_Poble/260901_2359_BUNDLE_auditoria.md]] — [[DOC_Taula_Mestra]]
- [[260902_0001_BUNDLE_auditoria|05_Escriptori_Soc_de_Poble/260902_0001_BUNDLE_auditoria.md]] — [[DOC_Taula_Mestra]]
- [[260902_0156_BUNDLE_auditoria_v7|05_Escriptori_Soc_de_Poble/260902_0156_BUNDLE_auditoria_v7.md]] — [[DOC_Taula_Mestra]]

<!-- FI SINAPSIS ENTRANTS - NO EDITAR MANUALMENT -->
