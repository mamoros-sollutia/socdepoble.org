---
tipus: petorreta
estat: esborrany
description: "Petorreta per a dissenyar la Fase 3: Base de dades, Autenticació i Connexió amb Sollutia"
---
# 🛡️ PETORRETA AL CONSELL: Connexió Sollutia (Fase 3)

## Font de Logos

Els logos oficials no s’incrusten ací.

Consulta sempre: [[DOC_Logos_Oficials]]

---

## Bloc Fixe d’Identitat

**Qui Som (La Nostra Història):** Som l'Associació ecologista El Rentonar i Sóc de Poble. Aquest projecte és l'hereu de més de 30 anys d'activisme rural i lluita pel nostre entorn natural i patrimonial. El nostre llegat i identitat digital resideixen històricament en `rentonar.blogspot.com`, van evolucionar a l'antiga plataforma fundacional `socdepoble.net`, i avui es materialitzen construint `socdepoble.org` (el Mas).

**Filosofia:** [[el_projecte|Sóc de Poble]] és actualment una aplicació web connectada (Online-First / React SPA + Supabase BaaS). Tot i que l'aspiració a llarg termini és la sobirania tecnològica rural (amb arquitectures descentralitzades), avui dia depenem d'un backend centralitzat (Supabase PostgreSQL + GoTrue Auth + RLS) i requereix connexió constant. NO utilitzes patrons 'Local-First' ni 'Offline-First' que enfosquisquen aquesta realitat, ja que confonen el Consell d'IAs. La IAIA MarIA actua amb Trellat, mínima intervenció, el Baseline 2022 com a jutge i respecte absolut per la llengua, la memòria i la gent major.

## Objectiu

Dissenyar i preparar l'arquitectura de la Fase 3: Autenticació i Base de Dades (Connexió amb Sollutia). L'objectiu és establir el flux complet de registre/login i integrar-lo amb l'actual sistema d'Identitats (Escriptori Privat vs Públic). Ens cal definir com es registra un usuari normal, com s'assignen rols (ex. Superadministrador) i com aquests usuaris reclamen la propietat sobre les "Entitats" (empreses, ajuntaments, associacions).

`OBJECTIU: Dissenyar el flux de Registre/Autenticació i l'esquema d'Usuaris/Entitats amb Supabase`

## Context Necessari

Bundle aparellat: 260907_1528_BUNDLE_connexio_sollutia.md.

Acabem de refactoritzar l'arquitectura del Front-end perquè suporte perfectament les "Identitats". L'usuari navega pel seu Escriptori Privat usant `/jo` (perfil personal) o `/e/:slug` (les entitats que gestiona). Ara cal connectar aquest front-end amb el backend real de Sollutia (Supabase Auth + PostgreSQL). Cal pensar l'estructura òptima de la taula d'usuaris i la taula d'entitats.

## Instrucció Principal

Analitza el codi adjunt (Front-end actual) i elabora un pla tècnic pas a pas per a implementar la Fase 3 (Registre, Auth, Rols i Relació Usuari-Entitat), assegurant-te que encaixa amb l'arquitectura d'Identitats. Proposa els esquemes SQL necessaris i els canvis en `OnboardingSection`.

`EXECUTA: Analitza el bundle i dissenya l'esquema SQL i el flux de Registre per a la Fase 3`

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

<!-- SDP-ISO-CONTEXT: {"_wiki_de_poble/02_ACTUAR_Tecnica/plantilles/PLANTILLA_ISO_SDP.md":"1579af8b4a5938f86995776df6a1af1907ca7b220d1df77231b213ab4276ab76","_wiki_de_poble/00_SER_Identitat_Cervell/00_BIOS.md":"fc4f36244a2fa668b1f89dc920b7e5c5d9d85e944f6e3972ac683734f96f02d9","_wiki_de_poble/00_SER_Identitat_Cervell/02_GENOTIP.md":"5661dfb5a5136e241f85477473542f3346f48781a02a30701e52640192c082e0","_wiki_de_poble/03_GOVERNAR_Normativa/DOC_Governanca.md":"80fa2264bb8b5cb76fb4e61fc6c0463059017b288bcb49a44e24d9363f5ff51e","_wiki_de_poble/00_SER_Identitat_Cervell/DOC_Logos_Oficials.md":"34dba63b26a0628396d45131eb79cd00520343a5b33b1dbb6f6e3a2917a909b7","_wiki_de_poble/02_ACTUAR_Tecnica/architecture/ADR-2026-08-ONLINE-FIRST.md":"6700cb9c7f53419c1ccabb7f0c2aa7001b11c8795bca40b844e20ef5748395ec"} -->
