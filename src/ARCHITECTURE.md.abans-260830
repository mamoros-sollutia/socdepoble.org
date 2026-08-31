# Arquitectura de Sóc de Poble (L'Herència de Pedra Seca)

Aquest document és el far per a futures generacions d'intel·ligències artificials i desenvolupadors. Conté el resum del model arquitectònic que dona vida a Sóc de Poble.

## 1. El Viatge: De Sollutia a l'Offline-First Total
- Sóc de Poble naix amb una vocació purament Offline-First, inspirada en eines com Obsidian. Totes les dades s'han de poder llegir i escriure sense connexió a Internet.
- **L'Estat Transitori:** Actualment (Agost 2026), treballem conjuntament amb Sollutia usant Supabase. Això és una mesura pragmàtica (Online-First temporal). La memòria cau actual actua gairebé com a memòria "tèrmica" (descartable), mentre que Supabase és la font de la veritat pràctica. Aquest disseny està documentat a `ADR-2026-08-ONLINE-FIRST.md` i ha de ser revertit gradualment fins assolir la descentralització total.

## 2. La Capa de Persistència (El Cor)
La capa de persistència (`src/data/outbox.js` i `sincronitzador.js`) ha sigut forjada a través de dures batalles (Auditories Extremes de l'Alt Consell).
- **Atomicitat Absoluta:** Les operacions a `outbox.js` es fan en una sola transacció `readwrite` per assegurar el compromís (commit). Si l'esborrat falla, s'utilitzen làpides (tombstones) per no duplicar missatges.
- **Circuit Breaker i Quarantena:** La persistència sap quan aturar-se. Si hi ha errors crítics reiterats d'IndexedDB, el sistema no destrueix les dades (`m.clear()`), sinó que declara Quarantena (`__SDP_OUTBOX_QUARANTINED__`) protegint el coneixement local de l'usuari.
- **Fi del Suport Legacy (Baseline 2022):** Com s'indica al LEDGER, per assolir un estat de **ZERO Deute Tècnic**, Sóc de Poble ha deixat de suportar l'iPad A10 (iOS 15.8) i estableix el tall a dispositius de **2022** (iOS 16+, Chrome 100+). No s'admet codi brut, condicional ni fallbacks per acomodar navegadors antics.

## 3. Govern i Aïllament
- **Tractors:** Utilitzem el concepte de "Tractors" o "Portes Mecàniques" (`tooling/gates/`) que executen regles estructurals immutables a través de scripts (ex. el tractor de persistència prohibeix que `storage.js` siga asíncron).
- **Gutenberg vs React:** Com que el component es munta a través de l'editor de blocs de WordPress, s'utilitzen panys globals (`window.__SDP_REACT_MOUNTED__`) i microtasques (`queueMicrotask`) per evitar instàncies zombis i fuites de memòria en el cicle de vida de React.
- **El LEDGER:** A `.agents/LEDGER.md` trobaràs el registre immutable de les decisions estructurals i arquitectòniques aplicades al codi base.

## 4. Filosofia Pedra Seca
Resiliència sense ciment. Les dependències s'afegeixen només si l'esforç de mantenir-les és menor que el dolor del problema que resolen.
Llegiu `.agents/skills/pedra-seca/SKILL.md` per més detalls sobre l'estètica i els tokens.

*"Digues 'no ho sé' quan la font no arriba. Inventar és trair el poble."*
