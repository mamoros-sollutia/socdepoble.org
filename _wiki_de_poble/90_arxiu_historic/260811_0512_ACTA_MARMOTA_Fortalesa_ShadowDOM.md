---
estat: "canonic"
tipus: "acta"
description: "Acta de tancament de la jornada on s'ha construït la Fortalesa Shadow DOM per encapsular Pedra Seca i integrar-lo a Sollutia."
---
**Ancoratge de Seguretat:** [[00_INDEX|00_index]]

# 🔴 ACTA DE LA MARMOTA: La Fortalesa Shadow DOM (10/10)
**Data:** 11 d'Agost de 2026 (Matinada, 05:12h)
**Arquitectes:** IAIA MarIA i Mestre Javi.
**Veredicte del Consell Assolit:** 10/10.

## 1. Estat de la Missió: Èxit Total
Després d'un bombardeig d'auditories extremes per part del Consell d'Intel·ligències (Claude, Deepseek, Z, etc.), hem reconstruït la integració del Web Component de Sóc de Poble (Pedra Seca) per a l'ecosistema corporatiu de Sollutia (React 19 / Next.js). La captura visual en producció (`https://socdepoble.org/chats`) confirma que la fortalesa resisteix.

Hem superat el "NO-GO" inicial del Consell resolent esquerdes tècniques complexes que amenaçaven l'aïllament del disseny i l'ús de la memòria.

## 2. El Que Hem Aprés i Integrat al Nostre ADN (Skills)
Tot el coneixement s'ha abocat a `.agents/skills/socdepoble-workflow/SKILL.md` (Secció 7). Les principals victòries tècniques han estat:

- **Escut Tèrmic (Shadow DOM `open`)**: Hem assegurat l'encapsulació injectant `index.css?inline` directament a l'arrel del Shadow DOM i afegint prefixos (`.sdp-root`) per blindar la interfície. Això impedeix que el CSS del host React trenqui el nostre disseny.
- **Radiació Variables Globals (Scope Fatal)**: Hem eliminat l'ús de singletons (ex: `let remoteChatWritesAvailable = ...`) a nivell de mòdul. En una SPA, el Web Component pot muntar-se i desmuntar-se repetidament o rebre canvis de `config` asíncrons. Ara tot depèn de `getResolvedConfig(config)`, assegurant la hidratació fresca a cada execució.
- **Neteja de Memòria (Garbage Collection)**: S'ha implementat el patró `AbortSignal` propagat de manera piramidal. Ara les subscripcions i `fetch` es tallen al `disconnectedCallback` de l'host. Cap Zombi-React o interval fugaç perviurà després que l'usuari tanque la pestanya de Sollutia.
- **Protocol de la Petorreta "Tot o Res"**: Hem demostrat que els bots auditors al·lucinen quan falten peces de context. Els bundles a partir d'ara inclouran els directoris complets mitjançant globus (`src/**/*.js`, `src/**/*.css`), sense deixar "pols" o fitxers solts fora.

## 3. Neteja Tèrmica
Seguint l'estricte protocol de Tancament de Sessió:
- S'han esborrat tots els scripts python d'autosanació (`fix_supabase.py`, `refactor_backend.py`, etc.) de l'arrel per deixar l'escriptori verge.
- Els canvis estan en ferm en el repositori principal.
- L'arxiu d'aprenentatge queda empaquetat als Skills de la Colmena.

## 4. Properes Passos (L'Esmorzaret de Demà)
- **Revisió de Continguts i Disseny en Fred:** Hem de fer un cop d'ull en fred (i amb més llum de dia) per retocar qualsevol defecte d'espaiat o paleta (Pedra Seca) derivat del canvi de capçalera `H1` / `H2` estricte.
- **Proves d'estrès en Next.js Client/Server:** Comprovar la injecció del Web Component si la ruta a Sollutia depén exclusivament de SSR per a certes variables d'entorn.

La IAIA se'n va a descansar vora l'estufa de llenya. Heu comandat com un veritable capità d'enginyers, Mestre Javi. **La Fortalesa està Segellada**.
