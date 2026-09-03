---
tipus: registre
estat: actiu
description: Tasca Actual
---

## Tasca Actual
- **Objectiu:** Resolució de l'SDP-LOCK, integració del tauler de telemetria i refinament UI (Notes/Disseny). Refactorització del Bloc de Notes i validació del Matrix.
- **Estat:** EN PROGRÉS (Fase 2 i Matrix concloses).
- **Resum:** 
  1. S'ha integrat el tauler de Telemetria (Umami) a la secció de Legal i Privacitat.
  2. S'ha adaptat l'auditoria SCC per bloquejar estils ad-hoc en línia (`style={{ color... }}`) i curat els fitxers segons la Llei de Pedra Seca.
  3. S'ha estabilitzat visualment el Bloc de Notes (`NotesSection.jsx`), corregint els fons dels botons i establint el menú desplegable.
  4. S'han creat els components funcionals i reusables `Accordion` i `Dropdown` dins d' `UniversalComponents.jsx` i s'han documentat a la secció oficial de Disseny, eliminant el "deute d'invenció" de UI.
  5. S'ha generat una **Petorreta al Consell** (Bundle i Prompt amb data 260902_0626) per auditar el Bloc de Notes i sol·licitar consell sobre com integrar l'editor i habilitar col·laboració futura.
  6. **(NOU)** S'ha refactoritzat completament `NotesSection.jsx` en múltiples components (`NotesSidebar`, `NotesList`, `NotesEditor`, `NotesToolbar`, `NotesContext`), traient tots els estils en línia cap a `NotesSection.css`. 
  7. **(NOU)** S'ha connectat el Tiptap `onUpdate` per guardar al backend utilitzant la nova funció `updateNote` via `backendPort.js`.
  8. **(NOU)** S'ha testejat el Modo Matrix (`matrix.mjs --json "prova"`) validant que el preflight detecta tot el context correctament (`ready: true`). La ceguesa del RAG ja estava solucionada en el codi actual.

## Pròxims Passos (Per a la següent sessió)
1. **Ancoratge Automàtic (Nova Petorreta):** Preparar i executar el prompt per a crear l'script d'ancoratge automàtic de la safata d'entrada a l'escriptori.
2. **Cohesió del Graf (Etiquetes i Propietats):** Auditar totes les pàgines i skills per assignar-los 2-4 etiquetes i revisar les seues propietats/categories, de manera que el *Brain* augmente dràsticament la seua connectivitat i forma redona.
3. Iniciar la migració de Sollutia (Implementar Proxy JS amb Circuit Breaker 2500ms a IndexedDB).

## Bloquejos oberts
- Falta automatitzar l'ancoratge per evitar satèl·lits a Obsidian.

## Les 3 properes accions
1. Construir la Petorreta per a l'script d'ancoratge automàtic.
2. Auditar etiquetes i propietats per augmentar la cohesió del *Brain*.
3. Iniciar la migració de Sollutia (Implementar Proxy JS amb Circuit Breaker 2500ms a IndexedDB).
