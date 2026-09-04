---
tipus: petorreta
estat: esborrany
description: "Auditoria tècnica del paquet disseny_notes_editor"
---
# 🛡️ PETORRETA AL CONSELL: DISSENY NOTES EDITOR

## Font de Logos

Els logos oficials no s’incrusten ací.

Consulta sempre: [[DOC_Logos_Oficials]]

---

## Bloc Fixe d’Identitat

**Qui Som (La Nostra Història):** Som l'Associació ecologista El Rentonar i Sóc de Poble. Aquest projecte és l'hereu de més de 30 anys d'activisme rural i lluita pel nostre entorn natural i patrimonial. El nostre llegat i identitat digital resideixen històricament en `rentonar.blogspot.com`, van evolucionar a l'antiga plataforma fundacional `socdepoble.net`, i avui es materialitzen construint `socdepoble.org` (el Mas).

**Filosofia:** [[el_projecte|Sóc de Poble]] és un sistema Local-First per a sobirania tecnològica rural. La IAIA MarIA actua amb Trellat, mínima intervenció, el Baseline 2022 com a jutge i respecte absolut per la llengua, la memòria i la gent major.

## Objectiu

Auditar el paquet disseny_notes_editor amb evidències verificables

`OBJECTIU: Auditar el paquet disseny_notes_editor amb evidències verificables`

## Context Necessari

Bundle aparellat: 260904_0230_BUNDLE_disseny_notes_editor.md.

La integració actual és online i Sollutia-first; la sobirania local és una meta de llarg termini.

## Instrucció Principal

Analitza el codi i la Wiki adjunts mitjançant una auditoria destructiva i d'arquitectura inversa. Busca fallos per tots els llocs (bugs ocults, AI slop residual, incompliment de lleis de Pedra Seca, corrupció de dades).

Exigim que en el teu veredicte incorpores:
1. Una anàlisi de possibles fallos estructurals pensant en el futur.
2. Un anàlisi DAFO (Debilitats, Amenaces, Fortaleses, Oportunitats) sobre l'estat actual de la UI de l'editor de notes i la integració amb UniversalPage.
3. Una matriu d'Importància vs. Urgència per a classificar les solucions que proposes.
4. Solucions clares, directes i concretes.
5. **Repte d'UI i Usabilitat (Responsive):** Actualment en pantalles mitjanes (tablet) es perd l'accés a la columna "Carpetes", i en mòbil desapareix tant "Carpetes" com "Notes". Volem que dissenyeu una solució arquitectònica on:
   - L'editor de text siga l'element principal i MAI desaparega, estant sempre visible a la part inferior de la pila.
   - En pantalles mòbils, les columnes "Carpetes" i "Notes" no necessiten botons nous: simplement els propis encapçalats existents (els divs foscos on diu CARPETES i NOTES) es col·loquen horitzontalment a la part superior de la pantalla, i en tocar-los despleguen la columna sencera. Així tindrem: encapçalat Carpetes, encapçalat Notes i davall l'Editor.
   - En pantalles de tauleta, podríem tindre "Carpetes" com a desplegable superior, mantenint la llista de "Notes" i l'Editor un al costat de l'altre, per no perdre la usabilitat.

`EXECUTA: Auditoria destructiva, anàlisi de futur, DAFO, matriu Importància/Urgència i Solució Responsive UI`

## Output Esperat

`FORMAT: markdown`

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

<!-- SDP-ISO-CONTEXT: {"_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/plantilles/PLANTILLA_ISO_SDP.md":"a2d6ff5f64a7e63021e7a8721f0ae998bee137ec4db32ebdd85403763fb9f5b1","_wiki_de_poble/00_SER_Brain_Identitat/00_BIOS.md":"ffef690325c36f0674c42060ad05de3485cf01405160de800f263fad1fdac11f","_wiki_de_poble/00_SER_Brain_Identitat/02_GENOTIP.md":"0ec98e65d4adb62b321b09cb985df2994a369765c7441c269d788af51deb3fb1","_wiki_de_poble/03_GOVERNAR_Normativa_Regles/DOC_Governanca.md":"80fa2264bb8b5cb76fb4e61fc6c0463059017b288bcb49a44e24d9363f5ff51e","_wiki_de_poble/00_SER_Brain_Identitat/DOC_Logos_Oficials.md":"34dba63b26a0628396d45131eb79cd00520343a5b33b1dbb6f6e3a2917a909b7","_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/architecture/ADR-2026-08-ONLINE-FIRST.md":"6700cb9c7f53419c1ccabb7f0c2aa7001b11c8795bca40b844e20ef5748395ec"} -->
