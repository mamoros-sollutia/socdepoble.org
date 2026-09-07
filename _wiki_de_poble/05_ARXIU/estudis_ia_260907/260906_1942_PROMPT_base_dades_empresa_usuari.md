---
tipus: petorreta
estat: esborrany
description: "Auditoria tècnica del paquet base_dades_empresa_usuari"
---
# 🛡️ PETORRETA AL CONSELL: BASE DADES EMPRESA USUARI

## Font de Logos

Els logos oficials no s’incrusten ací.

Consulta sempre: [[DOC_Logos_Oficials]]

---

## Bloc Fixe d’Identitat

**Qui Som (La Nostra Història):** Som l'Associació ecologista El Rentonar i Sóc de Poble. Aquest projecte és l'hereu de més de 30 anys d'activisme rural i lluita pel nostre entorn natural i patrimonial. El nostre llegat i identitat digital resideixen històricament en `rentonar.blogspot.com`, van evolucionar a l'antiga plataforma fundacional `socdepoble.net`, i avui es materialitzen construint `socdepoble.org` (el Mas).

**Filosofia:** [[el_projecte|Sóc de Poble]] és actualment una aplicació web connectada (Online-First / React SPA + Supabase BaaS). Tot i que l'aspiració a llarg termini és la sobirania tecnològica rural (amb arquitectures descentralitzades), avui dia depenem d'un backend centralitzat (Supabase PostgreSQL + GoTrue Auth + RLS) i requereix connexió constant. NO utilitzes patrons 'Local-First' ni 'Offline-First' que enfosquisquen aquesta realitat, ja que confonen el Consell d'IAs. La IAIA MarIA actua amb Trellat, mínima intervenció, el Baseline 2022 com a jutge i respecte absolut per la llengua, la memòria i la gent major.

## Objectiu

1. Oferir una instrucció SQL exacta i segura (incloent consideracions d'RLS) per a esborrar 3 registres orfes de la taula `public.profiles` on el camp `username` és literalment `NULL`, ja que no existixen a `auth.users`.
2. Proposar un model arquitectònic (BBDD + React Context) que separe la identitat personal de la identitat d'empresa/grup. L'usuari ha de poder gestionar i compartir lliurement les dades entre els seus diferents nivells d'identitat.

`OBJECTIU: Definir la neteja SQL dels perfils zombis i l'arquitectura de separació d'identitats (Persona vs Empresa/Grup).`

## Context Necessari

Bundle aparellat: 260906_1942_BUNDLE_base_dades_empresa_usuari.md.

La integració actual és purament online i centrada en crear una connexió perfecta per al sistema de la nostra empresa sòcia, Sollutia. 
Context Específic:
1. En un intent d'esborrar registres de prova, es van esborrar des d'Autenticació (`auth.users`) però s'han quedat orfes a `public.profiles`. Cal un SQL segur per a que el Mestre els purgue manuals des del Studio (els 3 orfes tenen el camp `username` literalment com `NULL`).
2. Tota la lògica de React està amuntegada ara mateix en un gran `AppDataContext.jsx`. Necessitem dissenyar (arquitectònicament, no codificar-ho tot) com el descomposem per suportar Entitats (Persones vs Empreses/Grups), complint el requisit del Mestre: *L'usuari ha de poder elegir els seus dades i passar-los lliurement entre empresa o personal.*

## Instrucció Principal

1. Escriu la sentència SQL exacta per purgar els perfils zombis (`username IS NULL`). Explica breument per què van quedar orfes (manca de CASCADE).
2. Dissenya l'arquitectura de context per a Sóc de Poble: com modelem la relació BBDD entre el Perfil (Persona) i l'Entitat (Grup/Empresa), i com separem l'actual `AppDataContext.jsx` en sub-contextos perquè puga gestionar i moure dades "al màxim nivell".

`EXECUTA: Genera l'script SQL de neteja i el document d'arquitectura de Dades Personals vs Entitats per a React/Supabase.`

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
