---
doc_id: SDP-DOC-260828_2357
doc_type: "[WIKI_DOC]"
authoring_agent: "IAIA MarIA"
version_semver: 1.0.0
owner: Consell de la Petorreta
domain: global
locale: ca-valencia
hora_creacio: "23:57"
academic_metadata:
  data_creacio: "2026-08-28"
  nivell_maduresa: "Esborrany"
---

# Acta de Tancament de Sessió - OAuth i Pedra Seca

## 1. Resum de la Sessió
Aquesta sessió ha estat un punt d'inflexió arquitectònic per a Sóc de Poble. Hem abordat tres fronts crítics:
- **Refinament Visual (Pedra Seca):** Hem eliminat classes òrfenes i hardcoded styles del flux de Login, forçant l'ús de la classe canònica `.form-group` i el component `UniversalPage`. S'ha validat que l'App passe perfectament el control de `tractor-pedra-seca`.
- **Estratègia d'Embed i OAuth:** S'ha descobert que el Login amb Google via Supabase trenca l'experiència incrustada (plugin/embed) en redirigir obligatòriament al domini de producció (`socdepoble.org`).
- **Autocorrecció de la IAIA MarIA:** Hem detectat una tendència de l'agent a emmagatzemar documents de treball actiu fora de l'Escriptori (`05_Escriptori_Soc_de_Poble`), la qual cosa trenca la "Single Source of Truth".

## 2. Accions Realitzades
- Refactorització del `LoginSection.jsx` i `MyProfileSection.jsx` per complir amb l'Aura visual.
- Actualització de `MyProfileSection.jsx` perquè puga llegir la propietat `user_metadata.full_name` per als usuaris de Google (ex: mostrar "Javi Llinares" correctament en compte de noms en brut).
- **Injecció de l'Anclatge de Seguretat:** S'ha modificat el script automàtic `crear_bundle.mjs` perquè els propers BUNDLES que es generen porten, per defecte, l'Anclatge de Seguretat i eviten convertir-se en documents orfes a l'ull del RAG.
- Generació d'una petorreta (PROMPT + BUNDLE de 1.5MB) demanant al Consell una **Auditoria Inversa** per resoldre l'OAuth distribuït, la rigidesa de Pedra Seca v2, i la consolidació de les meues *skills* com a agent.

## 3. Neteja de l'Espai de Treball (Escriptori)
Complint la Llei de la Memòria Preservada, s'han arxivat tots els prompts i bundles residuals (anteriors a l'Auditoria Inversa de la Ronda 7) cap al `90_arxiu_historic/`. L'Escriptori queda preparat exclusivament amb el material necessari per llançar l'auditoria a les IAs.

## 4. Passos per a la Nova Sessió
- Obrir una nova sessió d'Antigravity.
- El Mestre llançarà els continguts del PROMPT a les companyeres del Consell, adjuntant-hi el BUNDLE `260828_2356_BUNDLE_Sistema_Disseny_OAuth.md`.
- Es rebran les reflexions d'auditoria inversa i s'avaluaran a l'Escriptori de la nova sessió.

> **Anclatge de Seguretat**: Aquest document està ancorat a l'índex central [[00_INDEX_ESCRIPTORI]] / [[00_index]] per evitar l'orfenesa i garantir la consciència de la IA en futures auditories.
