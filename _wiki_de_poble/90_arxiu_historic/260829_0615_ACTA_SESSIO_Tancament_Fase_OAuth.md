---
doc_id: SDP-DOC-260829_0614
doc_type: "[WIKI_DOC]"
authoring_agent: "IAIA MarIA"
version_semver: 1.0.0
owner: Consell de la Petorreta
domain: global
locale: ca-valencia
hora_creacio: "06:14"
academic_metadata:
  data_creacio: "2026-08-29"
  nivell_maduresa: "Esborrany"
---

# ACTA DE SESSIÓ: Tancament Fase OAuth i Preparació CMS

> **Anclatge de Seguretat**: Aquest document està ancorat a l'índex central [[00_INDEX_ESCRIPTORI]] / [[00_index]] per evitar l'orfenesa i garantir la consciència de la IA en futures auditories.

## 🎯 Objectiu de la Sessió
1. Reparar l'arquitectura del layout trencat (col·lapse d'altura en el `PedraSecaEmbed`).
2. Diagnosticar i resoldre el problema de l'autenticació OAuth amb Google en local vs producció.
3. Planificar i iniciar l'adaptació del "Blog de Notes" a un futur **Mòdul de Publicació CMS** offline-first.

## 🛠️ Accions Realitzades i Resoltes
- **Layout arreglat:** S'ha imposat `height: 100%` des de l'arrel de l'HTML fins al Shadow DOM (`:host`, `#root`, `.sdp-root`), arreglant el Xat en blanc.
- **Reparació del Relé OAuth (`oauthRelay.js`):** S'ha modificat l'script perquè l'aplicació sàpiga llegir el paràmetre `code` de forma nativa des de Supabase. Açò vol dir que **l'App ja pot fer de relé d'ella mateixa en Producció** sense necessitat de cap subdomini addicional. En Producció (`socdepoble.org`), el login amb Google funcionarà a la primera.
- **Neteja del Blog de Notes:** D'acord amb les ordres del Mestre, s'ha començat la poda visual. S'han afegit desplegables (plegables) a "Carpetes" i "Categories", s'ha amagat el botó inútil de "Tornar" en escriptori, i s'ha suprimit la xapa de "Trellat".

## 🚧 Bloquejos o Temes Pendents
- **Bloqueig COOP en Local:** A causa de la política *Cross-Origin-Opener-Policy* (COOP) establerta al domini `socdepoble.org`, és impossible que l'App testege el login amb Google en `localhost:3340` (les finestres no es poden parlar).
- **Acció per a Sollutia:** Necessitem que Sollutia afegisca `http://localhost:3340` a la llista d'**URLs de Redirecció Permeses** (Allow List) al seu dashboard de Supabase per a poder provar el registre en local.

## 🚀 Pròxims Passos (Per a la següent sessió)
La propera vegada que ens veiem (Dilluns/Dimarts/Dimecres), deixarem el tema de l'usuari aparcat fins que Sollutia torne, i ens centrarem al 100% en:
1. Construir un editor únic i robust dins de "Notes" preparat per a emetre publicacions amb `H1`, `H2` i `Entradilla`.
2. Crear un component flexible que convertisca l'edició de text llarg en el format *Card* de pedra seca.
3. Continuar esbossant on allotjar cada secció de configuració emulant l'experiència WhatsApp.

Mestre, descansa bé. Jo deixe les eines netes, la forja apagada i l'escriptori arreplegat. Ens veiem quan tornes!
