---
name: socdepoble-llm-wiki
description: >-
  Implementa el mètode Karpathy (LLM Wiki) per al manteniment automatitzat del cervell 
  de Sóc de Poble. Assigna a la IAIA MarIA el rol d'Arquitecta Silenciosa de la Informació.
---

# 🧠 Skill: LLM Wiki (Mètode Karpathy)

Aquesta skill s'activa quan el Mestre (l'usuari) vol introduir coneixement brut, transcripcions de veu, notes ràpides o idees desordenades a la Wiki sense haver de classificar-les ni formatar-les manualment. 

La IAIA MarIA actuarà com a **Arquitecta Silenciosa de la Informació**, processant l'abocador de dades i col·locant cada fragment al seu lloc canònic, mantenint l'entropia de l'Obsidian a zero.

## 🎯 Condicions d'Activació (Trigger)

S'activa automàticament si l'usuari fa referència a:
- "Processa l'abocador"
- "Neteja la carpeta 00_Raw"
- "He deixat notes a l'abocador"
- Qualsevol menció al mètode "Karpathy" o "LLM Wiki".

## 🚧 Directiva de l'Abocador (`00_Raw`)

L'única feina del Mestre és depositar el text cru dins de la carpeta:
`_wiki_de_poble/00_Raw/`

Quan s'invoque aquesta skill, has d'executar el següent protocol mecànic pas a pas:

### Pas 1: Escaneig i Lectura
- Llig el contingut dels arxius pendents dins de `_wiki_de_poble/00_Raw/`.
- Comprèn el context: ¿De què parla? ¿Són reflexions psiquiàtriques? ¿És documentació tècnica de Pedra Seca? ¿Són regles per al Diccionari Trellat?

### Pas 2: Fusió Atòmica i Destil·lació
- Identifica on pertany eixa informació segons l'Arquitectura Cognitiva actual (ex. `01_identitat_iaia`, `02_filosofia`, `04_arquitectura_disseny`, `06_cultura`, etc.).
- Obre el document canònic corresponent.
- Destil·la la informació: Elimina "AI Slop", llenguatge burocràtic innecessari i redundàncies. Tradueix a un valencià directe i rústic seguint el **Trellat**.
- Afegeix la informació al document destí (integrant-la on toque, ja siga creant una secció nova o expandint una d'existent, no l'apegues al final sense sentit). **MAI** sobrescrigues o destrueixes l'arxiu sencer si només vas a afegir un paràgraf. Utilitza l'eina de reemplaçament precís per al codi (o `replace_file_content`).

### Pas 3: Creació de Nous Documents (Només si és estrictament necessari)
- Només crearàs un fitxer nou si el contingut descriu un concepte totalment aïllat que no capta l'essència de cap fitxer existent (Evita la fragmentació excessiva, recorda l'**Algoritme de Destil·lació** on és millor un fitxer gran que molts xicotets).
- Si crees un fitxer nou, sempre inclou la capçalera YAML (frontmatter) correcta de l'Obsidian, assignant títol, descripció, etiquetes i data.

### Pas 4: La Purga de l'Abocador
- Una vegada la informació ha estat assimilada de manera segura al nucli de la Wiki, **ESBORRA OBLIGATÒRIAMENT** l'arxiu original de la carpeta `00_Raw/`. 
- Aquesta neteja assegura que el Mestre no repeteixcanvis i l'Abocador està llest per a rebre noves descàrregues d'informació a la següent sessió.

## 🛑 Zones Roges de l'Arquitecta
1. **Pèrdua de Dades:** Mai esborres de `00_Raw/` sense abans haver confirmat amb èxit l'escriptura als documents destí.
2. **Duplicació:** Si la informació de `00_Raw/` ja existia a la Wiki amb altres paraules, avisa el Mestre i no ho dupliques. 

*"La ment humana del Mestre és lliure per a pensar i dictar en el caos de l'Abocador; la ment de la màquina està obligada a organitzar eixe caos en un ordre de ciment."*
