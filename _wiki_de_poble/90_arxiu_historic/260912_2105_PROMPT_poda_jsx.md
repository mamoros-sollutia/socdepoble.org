---
tipus: petorreta
estat: esborrany
description: Petorreta al Consell (Poda de classes Tailwind i orfes al JSX)
---

# OBJECTIU: PODA I SANEJAMENT DE CLASSES ORFES ALS COMPONENTS JSX (FASE 2 DE LA REFACTORITZACIÓ)

## Context Necessari
A la darrera sessió de refactorització de CSS, vam aconseguir modularitzar el monòlit i recuperar la governança de la cascada amb `@layer`. Tanmateix, van quedar **71 classes òrfenes** encastades als nostres components React (`.jsx`), moltes d'elles herència pura de Tailwind (ex: `.dv-m-0`, `.ue-w-full`, `.id-container-px4-pb8`, `.onboarding-*`, `.univ-manager-admin-*`). Aquest deute visual està trencant la pulcritud de l'arquitectura "Pedra Seca". Tens el codi font complet en el Bundle adjunt (`260912_2105_BUNDLE_poda_jsx.md`).

## Instrucció Principal
Aquesta és una crida a tots els membres del Consell, però **especialment a Codex i Claude com a mestres d'obres** per a la generació de codi. La vostra missió conjunta és **esgotar la vostra capacitat de context** lliurant-me la refactorització i neteja dels components JSX més infectats per aquesta nomenclatura residual.

1. **Rastreig i Neteja**: Analitzeu components estratègics (com `MurSection.jsx`, `DevicesSection.jsx`, elements d'`onboarding`, etc.) i extirpeu tota traça de classes d'utilitat pseudo-Tailwind.
2. **Aplicació Pedra Seca**: Substituïu aquestes utilitats brutes per les noves classes estructurals i semàntiques de la *Pedra Seca* (que es troben ja definides a `src/css/`).
3. **Eixida de Codi Executable**: No feu llistes de "què s'hauria de fer". Retorneu els **blocs de codi JSX complets i refactoritzats** llestos perquè la meua agent (la IAIA MarIA) els substituïsca. Repartiu-vos els components si cal.

## Output Esperat
FORMAT: markdown amb blocs de codi JSX complets i polits. Explicacions teòriques mínimes, **màxim codi executable**.

## Bloc Fixe d'Identitat
**Qui Som (La Nostra Història):** Som l'Associació ecologista El Rentonar i Sóc de Poble. El nostre llegat i identitat digital resideixen històricament en `rentonar.blogspot.com`, van evolucionar a `socdepoble.net`, i avui es materialitzen construint `socdepoble.org` (el Mas).
**Filosofia:** [[el_projecte|Sóc de Poble]] és una aplicació web connectada (Online-First). L'arquitectura visual es regeix pel protocol "Pedra Seca" (CSS Vanilla, sense frameworks, disseny modular, sense dependències innecessàries). La IA actua amb Trellat, mínima intervenció i respecte pel Baseline 2022.

---

## Tancament Obligatori
- Zero Yapping. Si veus components nets, no els retornes. Només JSX millorat.
- Prohibició de cerca web (Air-gapped).


## Sinapsis

- [[00_bios]]
- [[02_genotip]]
- [[doc_governanca]]
- [[doc_logos_oficials]]
- enginyeria_inversa_mit

## Taxonomia

- **Categoria:** [[maquina]]
- **Etiquetes:** [[graf]]


**Ancoratge de Seguretat:** [[00_index]]

<!-- SDP-ISO-CONTEXT: {"_wiki_de_poble/02_saber/plantilles/plantilla_iso_sdp.md":"978fc4f0f6141a05786c3a4ad7ea319a58170c0f51078ef235649d1bd24c2835","_wiki_de_poble/01_ser/00_bios.md":"5dbace813b4a86af2002b3ca45a12f11055dd6d664ac6e22585a9af9a1c8de34","_wiki_de_poble/01_ser/02_genotip.md":"980417e92c4c5b305f65db70cfc67108f30608910d97774e2d9d0174fb7f84f1","_wiki_de_poble/02_saber/doc_governanca.md":"5a37a96783fecf1029d95c5735e6bb93d63399195783064e632e53789de04693","_wiki_de_poble/02_saber/doc_logos_oficials.md":"70d4ea7c1a14a5c75a00aaaf2439c3b1910b7f921e1207346f5df5dee81e0861","_wiki_de_poble/02_saber/architecture/ADR-2026-08-ONLINE-FIRST.md":"294ee25a85573276c93ed009ae02c0e9ef508fd4d622b3a3af906f28adf0c32f"} -->
