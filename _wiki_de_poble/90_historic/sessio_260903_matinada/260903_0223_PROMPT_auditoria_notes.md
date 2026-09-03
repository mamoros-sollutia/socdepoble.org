---
tipus: petorreta
estat: esborrany
description: Auditoria d'UI i icones de NotesSection
aliases:
  - petorreta_auditoria_notes
---
# 🛡️ PETORRETA AL CONSELL: AUDITORIA DEL BLOC DE NOTES

## Font de Logos

Els logos oficials no s’incrusten ací.

Consulta sempre: [[DOC_Logos_Oficials]]

---

## Bloc Fixe d’Identitat

**Qui Som (La Nostra Història):** Som l'Associació ecologista El Rentonar i Sóc de Poble. Aquest projecte és l'hereu de més de 30 anys d'activisme rural i lluita pel nostre entorn natural i patrimonial. El nostre llegat i identitat digital resideixen històricament en `rentonar.blogspot.com`, van evolucionar a l'antiga plataforma fundacional `socdepoble.net`, i avui es materialitzen construint `socdepoble.org` (el Mas).

**Filosofia:** [[el_projecte|Sóc de Poble]] s'integra dins de **Sollutia** per a teixir una xarxa social comunitària. La IAIA MarIA actua amb Trellat, mínima intervenció, el Baseline 2022 com a jutge i respecte absolut per la llengua, la memòria i la gent major.
*(Nota de Full de Ruta: L'objectiu a llarg termini és una sobirania tecnològica rural hiper local-first i fora de xarxa per a dispositius antics, però actualment no heu de prioritzar aquesta meta si xoca amb la integració online).*

## Objectiu

Auditar i reparar el disseny trencat del Bloc de Notes i unificar l'aparença visual de les icones de l'editor, canviant aquelles que semblen "de col·leccions diferents" per unes alternatives de la pròpia llibreria `lucide-react` perquè tot tinga coherència Pedra Seca.

`OBJECTIU: Reparar NotesSection i normalitzar icones de Lucide.`

## Context Necessari

- El component del Bloc de Notes (`src/sections/notes/`) ha patit un trencament de disseny ("se ha desmontado"). 
- El Mestre ha reportat que les icones de l'editor de text (Negreta, Cursiva, Ratllat, Encapçalament H2) no pareixen pertànyer a la mateixa col·lecció i donen la sensació de tindre un "estil antic". Aclariment tècnic: **Totes les icones provenen de `lucide-react`**, que és exactament el tipus de col·lecció lliure i completa (estil Noun Project / Flaticon) que el Mestre demana. El problema és que les icones d'edició de text dins de Lucide es renderitzen com lletres amb serifes.
- **L'Excepció:** L'única icona personalitzada que NO pertany a Lucide és la de la IAIA (a la barra superior negra, entre el traductor i la lupa). Eixa icona és disseny propi del Mestre i s'ha de respectar inalterada. Totes les altres han de ser de `lucide-react`.

## Instrucció Principal

Llig el codi referent a `src/sections/notes/`, detecta per què es trenca la maquetació en pantalles i proposa un pla de xoc per refer l'estructura visual. Neteja/canvia les icones de la barra de format buscant dins del propi catàleg de Lucide les icones d'edició de text que encaixen millor amb l'estil de línia geomètrica i no pareguen "lletres antigues". A més, **afegeix un mecanisme d'autocorrecció per garantir que MAI MÉS una IA genere un prompt esborrant el format de la `PLANTILLA_ISO_SDP.md` sense llegir el context de la Wiki (com acaba de passar)**.

`EXECUTA: Analitza NotesSection, canvia icones a Lucide adients i formula protocol d'autocorrecció de plantilles.`

## Output Esperat

Un dictamen markdown d'auditoria detallant l'origen del problema CSS/DOM del bloc de notes i les passes tècniques necessàries per restaurar-lo complint els estàndards Pedra Seca.

`FORMAT: markdown`

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

**Ancoratge de Seguretat:** [[00_INDEX_ESCRIPTORI]]

## Sinapsis Entrants (Autogenerat)

- [[02_GENOTIP|00_SER_Brain_Identitat/02_GENOTIP.md]] — [[260903_0223_PROMPT_auditoria_notes|05_Escriptori_Soc_de_Poble/260903_0223_P...
- [[DOC_Logos_Oficials|00_SER_Brain_Identitat/DOC_Logos_Oficials.md]] — [[260903_0223_PROMPT_auditoria_notes|05_Escriptori_Soc_de_Poble/260903_0223_P...
- [[el_projecte|00_SER_Brain_Identitat/el_projecte.md]] — [[260903_0223_PROMPT_auditoria_notes|05_Escriptori_Soc_de_Poble/260903_0223_P...
- [[Graf|01_SABER_Cultura_Coneixement/Graf.md]] — [[260903_0223_PROMPT_auditoria_notes|05_Escriptori_Soc_de_Poble/260903_0223_P...
- [[Maquina|01_SABER_Cultura_Coneixement/Maquina.md]] — [[260903_0223_PROMPT_auditoria_notes|05_Escriptori_Soc_de_Poble/260903_0223_P...
- [[DOC_Governanca|03_GOVERNAR_Normativa_Regles/DOC_Governanca.md]] — [[260903_0223_PROMPT_auditoria_notes|05_Escriptori_Soc_de_Poble/260903_0223_P...
- [[00_INDEX_ESCRIPTORI|05_Escriptori_Soc_de_Poble/00_INDEX_ESCRIPTORI.md]] — [[260903_0223_PROMPT_auditoria_notes]]
- [[260903_0223_PROMPT_auditoria_notes|05_Escriptori_Soc_de_Poble/260903_0223_PROMPT_auditoria_notes.md]] — [[00_INDEX_ESCRIPTORI|05_Escriptori_Soc_de_Poble/00_INDEX_ESCRIPTORI.md]] — [...

<!-- FI SINAPSIS ENTRANTS - NO EDITAR MANUALMENT -->
