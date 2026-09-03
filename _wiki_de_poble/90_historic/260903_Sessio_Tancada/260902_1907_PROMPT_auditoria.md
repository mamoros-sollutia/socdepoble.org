---
tipus: document
estat: esborrany
description: "🛡️ PETORRETA AL CONSELL: DESIGN SYSTEM PER AL BLOC DE NOTES"
---
# 🛡️ PETORRETA AL CONSELL: DESIGN SYSTEM PER AL BLOC DE NOTES

Salutacions, membres del Consell (i en especial Flash 8B).

Teniu adjunt el BUNDLE `260902_1907_BUNDLE_auditoria.md` amb tot el context termodinàmic del projecte. 

El Mestre sol·licita la creació d'un **Design System especial i exclusiu per al Bloc de Notes** de Sóc de Poble (`NotesSection.jsx`, `NotesSidebar.jsx`, `NotesList.jsx`, `NotesEditor.jsx` i `NotesSection.css`).

Actualment, la disposició s'ha trencat per conflictes de CSS (com veureu als arxius de referència), la llista de carpetes i elements es mostren horitzontalment en compte de verticalment, i falta un sistema de disseny sòlid. El Bloc de Notes requereix una arquitectura CSS Grid / Flexbox 100% neta, responsive i que respecte els tokens de Pedra Seca.

**LA VOSTRA MISSIÓ:**
1. Llegiu atentament els fitxers de la secció de notes dins del BUNDLE (`src/sections/notes/`).
2. Genereu una proposta de Design System modern, net i minimalista (inspirat en la puresa d'Apple Notes, però amb els colors i ànima de Sóc de Poble), basat exclusivament en CSS Grid i Flexbox.
3. Assegureu-vos que:
   - La `NotesSidebar` s'apila correctament en columnes (`flex-direction: column`).
   - El layout de 3 columnes siga fluid.
   - Es defineixen correctament les variables d'estat de les targetes (hover, active).
4. Proporcioneu les regles CSS i les modificacions als components JSX per arreglar el desastre visual actual i convertir-lo en una eina d'escriptura preciosa.
5. Proporcioneu solucions arquitectòniques per adaptar el Bloc de Notes a pantalles menudes (mòbil), considerant:
   - Fins a quin punt podem arribar amb el tamany xicotet i com s'adapta.
   - Com s'haurien de plegar o amagar automàticament les dos primeres finestres (la de carpetes i la llista de notes) a mesura que es redueix la pantalla.
   - Tenint en compte que això és un cas especial d'aquesta pàgina i el seu comportament responsiu és independent de la resta del sistema (volem que l'editor funcione perfectament dins d'un mòbil).

Confiem en la vostra velocitat i agudesa arquitectònica. 
*Signat: La IAIA MarIA i el Mestre Javi.*

## Sinapsis Entrants (Autogenerat)

- [[00_INDEX_ESCRIPTORI|05_Escriptori_Soc_de_Poble/00_INDEX_ESCRIPTORI.md]] — [[260902_1907_PROMPT_auditoria]]
- [[260902_1920_dictamen_design_system_bloc_notes|05_Escriptori_Soc_de_Poble/260902_1920_dictamen_design_system_bloc_notes.md]] — Ancoratge**: aquest document pertany a l'[[00_INDEX_ESCRIPTORI]] i respon for...

<!-- FI SINAPSIS ENTRANTS - NO EDITAR MANUALMENT -->
