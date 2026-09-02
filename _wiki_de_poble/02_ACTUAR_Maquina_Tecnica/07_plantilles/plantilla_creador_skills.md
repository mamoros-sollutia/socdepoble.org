---
tipus: plantilla
estat: canonic
description: Plantilla per dissenyar skills amb gallets, abast, regles, proves i eixida verificable.
tags:
  - maquina
  - skills
---
# Creador de Skills Antigravity (La Fàbrica)
**Categoria:** Plantilla
**Data:** 2026-06-19
**Hora:** 14:30

---

## LOGOS OFICIALS (Font de la Veritat)
Els únics logos vàlids per al projecte s'ubiquen a `public/assets/system/ui/`. Quan s'invoquen des del codi Font/HTML, la ruta és `/assets/system/ui/...`:
- **Quadrat Verd (Icones/Avatars):** `/assets/system/ui/logo-socdepoble-cuadrat-verd.svg`
- **Rectangular Blanc (Per a Dark Mode):** `/assets/system/ui/logo-socdepoble-rect-blanc.svg`
- **Rectangular Negre (Per a Light Mode):** `/assets/system/ui/logo-socdepoble-rect-negre.svg`
- **Rectangular Estàndard:** `/assets/system/ui/logo-socdepoble-rect.svg`

## MISSIÓ DEL PROTOCOL
Estandarditzar com es construeixen i es documenten les noves "Skills" (protocols automatitzats) per a moure el sistema de "conversa" a "fàbrica 10x".

## 1. ESTRUCTURA DE FITXERS
Tota Skill del Mas ha de viure a la carpeta en minúscules: `/_skills/<numero>_<nom_descriptiu>/`
*Exemple de nom de carpeta de Skill:* `00_mente_colmena` (S'usa prefix numèric i guions baixos. A diferència dels documents de  les carpetes de skills NO porten la data AAAA-MM-DD).

- `SKILL.md`: La lògica i instruccions mestres (Aquest nom d'arxiu és innegociable perquè el motor d'Antigravity el llija automàticament).
- `/recursos`: Fitxers de suport (JSON, MD, Imatges).
- `/scripts`: Scripts d'automatització (si cal).

## 2. FORMAT DEL SKILL.md (YAML)
Cada document ha de començar amb:
```yaml
name: "Nom de la Skill"
description: "Descripció concisa en tercera persona (màx 220 caràcters)."
trigger: "/skill <nom>"
version: "1.0"
```

## 3. WORKFLOW D'EXECUCIÓ
1. **Planificació:** Definir l'objectiu i els passos.
2. **Validació:** Verificar si els inputs són suficients (Trellat check).
3. **Execució:** Realitzar la tasca aplicant les regles de la marca.
4. **Entrega:** Resultat en format net (HTML/MD termodinàmic).

---
_Fent poble amb [[el_projecte|Sóc de Poble]]! © 2026_

---


## Taxonomia
- **Categoria:** [[Maquina]]
- **Etiquetes:** [[Graf]]


**Ancoratge de Seguretat:** [[00_INDEX]]


---
**Categoria:** [[00_plantilles|07_plantilles]]
**Relacionat:** [[00_arquitectura_tecnica_unificada]], [[00_INDEX]]
**Ancoratge de Seguretat:** [[00_INDEX]]

## Sinapsis Entrants (Autogenerat)

- [[00_plantilles|02_ACTUAR_Maquina_Tecnica/07_plantilles/00_plantilles.md]] — [[plantilla_creador_skills|Plantilla Creador Skills]]
- [[260901_2359_BUNDLE_auditoria|05_Escriptori_Soc_de_Poble/260901_2359_BUNDLE_auditoria.md]] — [[plantilla_creador_skills|Plantilla Creador Skills]]
- [[260902_0001_BUNDLE_auditoria|05_Escriptori_Soc_de_Poble/260902_0001_BUNDLE_auditoria.md]] — [[plantilla_creador_skills|Plantilla Creador Skills]]
- [[260902_0156_BUNDLE_auditoria_v7|05_Escriptori_Soc_de_Poble/260902_0156_BUNDLE_auditoria_v7.md]] — [[plantilla_creador_skills|Plantilla Creador Skills]]

<!-- FI SINAPSIS ENTRANTS - NO EDITAR MANUALMENT -->
