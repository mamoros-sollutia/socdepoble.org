---
estat: "Petorreta"
tipus: "document"
description: "Petorreta oficial per al Consell: Auditoria global del codi (React, Plugin WP propi, Skills) abans d'iniciar la secció de Xat."
---

# Petorreta per al Consell d'Intel·ligències: Auditoria Global Infrangible

**Context:** Ens trobem a les portes d'iniciar el desenvolupament de la secció de **Xat** (`/xat`), que serà una de les funcionalitats clau d'aquesta xarxa social descentralitzada sota l'arquitectura de Pedra Seca. Abans d'afegir aquesta complexitat, el Mestre Javi ha donat l'ordre d'aturar les màquines i auditar absolutament **TOT** el sistema.

Per a facilitar aquest propòsit, s'ha creat l'arxiu adjunt `260823_1150_BUNDLE_Auditoria_Global_Tot_Codi_Font_React_Sollutia_Tooling_Skills.md` (~2.1 MB) que inclou:
- Tot el codi font React (Components Universals, Contextos, Vistes).
- El codi complet del **nostre propi Plugin de WordPress** (carpeta `wordpress-plugin/`).
- Tots els Scripts de Tooling (Manteniment de la Wiki, Autoneteja, etc.).
- Totes les regles i Skills de les IAs (la Ment Colmena).

## ⚠️ Aclariment Vital per al Consell: L'Arquitectura "Doble Assegurança"

Heu de tindre molt clara la separació entre l'entorn de **Sollutia** i el **nostre Plugin**:

1. **Sollutia**: L'empresa Sollutia gestiona el backend i té un WordPress natiu modificat "fins a les tranques". La **Llei de l'Enxufabilitat** dicta que la nostra app React no ha de trencar ni demanar canvis al seu sistema, per a no molestar-los ni obstaculitzar el seu manteniment. Ells ens serveixen les dades i nosaltres ens connectem respectuosament.
2. **El Nostre Plugin WP (El Doble Seguro)**: Com a pla B, i precisament per a garantir un frontend 100% autònom en cas que el sistema de Sollutia caiga o siga incompatible, fa mesos vam crear **el nostre propi plugin de WordPress** (el que veieu al bundle). Aquest plugin munta el component de React (`<soc-de-poble>`) de forma aïllada com a Web Component (Shadow DOM) i pren el control total de les rutes. No l'hem auditat fa temps i el seu objectiu és ser el nostre "salvavides" d'independència tecnològica.

## Objectiu de la Petorreta

Vull elevar aquesta macro-auditoria al Consell d'Intel·ligències perquè analitzeu en profunditat aquest codi unificat. Busqueu qualsevol codi brossa, ineficiència termodinàmica, forats de seguretat o badens estructurals que hagen pogut quedar de les iteracions passades.

## Tasques per al Consell

1. **Revisió del Nostre Plugin WP (Prioritari)**:
   - Analitzeu el contingut de la carpeta `wordpress-plugin/`.
   - Comproveu la seguretat de com injecta el React i cedeix les rutes. 
   - Detecteu si hi ha vulnerabilitats en la càrrega del JSON de configuració o el Shadow DOM.
2. **Bombardeig i Neteja de Codi React**:
   - Analitzeu el codi de la PWA (`src/`). Localitzeu codi brossa, components duplicats, funcions orfes o estils innecessaris.
   - Detecteu qualsevol patró que viole la "Llei de l'Enxufabilitat" (exigint coses estranyes al backend de Sollutia).
3. **Revisió de Seguretat Global**:
   - Intenteu "trencar" lògicament l'arquitectura. Tenim el plugin propi ben blindat? L'app funciona de forma resilient i offline si fallen les connexions?
4. **Optimització per al futur Xat**:
   - Deixeu el sistema completament sanejat perquè, a l'hora d'implementar el Xat descentralitzat (offline-first amb CRDTs), l'arquitectura no tinga llast ni codi heretat que ens faça entropessar.

Poseu tota l'artilleria intel·lectual en desmuntar allò que estiga mal fet i proporcionar els "fixos" exactes que hem d'aplicar abans de procedir.
