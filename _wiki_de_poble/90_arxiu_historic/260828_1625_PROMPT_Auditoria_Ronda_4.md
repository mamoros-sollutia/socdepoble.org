---
doc_id: SDP-DOC-260828_1625
doc_type: "[WIKI_DOC]"
authoring_agent: "IAIA MarIA"
version_semver: 1.0.0
owner: Consell de la Petorreta
domain: global
locale: ca-valencia
hora_creacio: "16:25"
academic_metadata:
  data_creacio: "2026-08-28"
  nivell_maduresa: "Esborrany"
---

# Prompt Auditoria Ronda 4

> **Anclatge de Seguretat**: Aquest document està ancorat a l'índex central [[00_INDEX_ESCRIPTORI]] / [[00_index]] per evitar l'orfenesa i garantir la consciència de la IA en futures auditories.

Salutacions Alt Consell (Kimi AI, Claude, ChatGPT, Grok, Qwen, DeepSeek, Dola, Perplexity, Mistral Vibe, Gemini, Copilot).

Vos presente la Ronda 4 (i espere que l'última) d'auditoria de L'Herència de Pedra Seca. Després de triturar l'Outbox i el Sincronitzador en la Ronda 3, hem aplicat absolutament totes les vostres exigències per aconseguir eixa eterna persistència offline, incloent:

- Promisificació robusta de transaccions i `queueMicrotask` a l'Embed per evitar la destrucció del DOM de Gutenberg.
- Implementació del Circuit Breaker amb quarantena temporal (en comptes d'esborrat total) per combatre la inestabilitat d'IndexedDB de WebKit.
- Refactorització total de `sincronitzador.js` per assegurar que els missatges només s'envien un colp i es lligen de manera autònoma (i durable) al cicle de vida.
- Lògica UUID adaptada (legacy compatible).
- El BIOS Executable i les Portes Mecàniques ara funcionen perfectament sense infraccions i sense permetre regressió de codi (0 errors a les Portes i a l'Ecosistema).

Abans d'avaluar-ho, us recorde el context fonamental perquè la vostra auditoria siga vàlida per a la nostra realitat:
1. **La Veritat Actual:** Actualment estem col·laborant amb la nostra empresa sòcia, Sollutia. Ells ens ofereixen un sistema excel·lent que funciona completament *online* i ens permet validar la viabilitat del projecte de forma sòlida. **MOLT IMPORTANT: SOLLUTIA NO TÉ RES A VEURE AMB WORDPRESS.** Quan parlem de l'entorn de proves en WordPress on estem incrustant l'App (l'embed), eixe és un projecte paral·lell nostre per provar l'aïllament; no ho barregeu mai amb el sistema de Sollutia en les vostres conclusions.
2. **L'Aspiració:** L'objectiu a llarg termini és, justament amb l'ajuda de Sollutia, poder independitzar-nos d'Internet (ser 100% Offline-First). Som un projecte de "des-escalada" (una xarxa anti-xarxa social) i estem preparant el terreny perquè en el futur Sollutia puga mantindre eixa versió descentralitzada i offline. El codi que proposeu ha d'afavorir aquesta transició conjunta de forma pacífica i mantenible per ells.

Adjunt un document amalgamat amb tot el nucli (Outbox, Sincronitzador, Embedded React i la governança del BIOS i LEDGER actualitzat). Feu allò que sabeu fer de la millor manera, busqueu qualsevol forat possible!
