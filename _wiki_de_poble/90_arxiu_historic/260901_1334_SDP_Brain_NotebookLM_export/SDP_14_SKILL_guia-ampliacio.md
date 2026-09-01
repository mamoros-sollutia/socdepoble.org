---
name: guia-ampliacio
description: Com entendre i ampliar l'arquitectura de Sóc de Poble seguint la doctrina Pedra Seca.
lang: ca
status: active
version: 1.0.0
triggers_on: ["afegir funcionalitat", "nova feature", "ampliar arquitectura", "crear skill", "com afegir"]
---

# Guia d'Ampliació (Com afegir funcionalitat)

L'arquitectura de Sóc de Poble és altament modular i segueix el model de "Pedra Seca". Qualsevol IA o desenvolupador que vulga afegir funcionalitats ha de seguir aquests passos:

## 1. Respectar l'Online-First (Integració amb Sollutia)
Qualsevol component o mòdul ha d'estar pensat perquè funcione 100% connectat a la xarxa a través de `src/data/backendPort.js`. La persistència local i l'outbox s'han eliminat en favor d'una arquitectura Online-First directa.

## 2. Aïllament i *Fail-Closed*
Cada nova *Skill* o funcionalitat s'ha de dissenyar per fallar de manera segura. Si falla, el sistema ha de seguir funcionant. 
Utilitza `ErrorBoundary` (com a `src/PedraSecaEmbed.jsx`) per protegir el domini de l'aplicació.

## 3. Registre Immutable (LEDGER)
Abans de qualsevol canvi estructural, cal afegir-ho a `.agents/LEDGER.md` i executar `npm run porta`.

## 4. Tractors (Portes Mecàniques)
Cap codi pot trencar les regles de validació. Les regles estan definides en els Tractors (`tooling/gates/`). En afegir una nova funcionalitat, si canvia l'estructura de dades, caldrà actualitzar el tractor corresponent.

## 5. UI i *Design Tokens*
Tot component visual ha de consumir els tokens de `src/config/design-tokens.json` (usant variables CSS) i seguir la filosofia de disseny "Pedra Seca". 

## 6. Components React
- Els cicles de vida (com els listeners en `useEffect`) s'han de desmuntar SEMPRE correctament per evitar Zombis.
- No deixar estats enganxats a `window` si no és absolutament necessari per comunicar amb l'exterior (com amb Sollutia).

Sempre referiu-vos a l'índex de `_wiki_de_poble/` abans d'iniciar tasques complexes.
