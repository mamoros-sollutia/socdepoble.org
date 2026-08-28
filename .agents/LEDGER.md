# Llibre d'Obra (LEDGER) de Sóc de Poble

Aquest és el registre immutable de tots els canvis estructurals i tècnics del projecte.
Qualsevol IA (o humà) que modifique codi està obligada a afegir-hi una entrada abans de finalitzar la seua tasca, complint amb la **Skill Trellat**.

---

## Deute Històric i Arqueologia (L'Herència de Pedra Seca)
*Aquest apartat documenta les decisions preses abans de la creació d'aquest LEDGER (Fase Pre-Mecànica) que condicionen fortament l'arquitectura actual i futura.*
- **Offline-First vs Sollutia (Online-First temporal):** El sistema va nàixer descentralitzat però hem assumit dependència de Supabase i del Plugin de WordPress de Sollutia temporalment per garantir el "time to market" (ADR-2026-08-ONLINE-FIRST). El sincronitzador actual reflecteix aquest deute: fa servir `src/data/outbox.js` però guarda la memòria cau de lectura gairebé com a element descartable o tèrmic.
- **La Guerra contra WordPress (Gutenberg):** S'han hagut d'introduir panys globals (`window.__SDP_REACT_MOUNTED__`) i `queueMicrotask` a `src/PedraSecaEmbed.jsx` perquè el DOM de WordPress destrueix, remunta i mou instàncies indiscriminadament, generant zombies i competició per la IndexedDB.
- **Mentides de WebKit i Circuit Breaker:** Gran part de la complexitat a `src/data/outbox.js` ve de tractar els `onabort` muts i `onblocked` infinits del motor d'IndexedDB en iPad/iOS (A10). Això va obligar a crear un sistema de quarantena en lloc de cridar `db.clear()` i perdre dades davant la corrupció d'IDB.

---

## 2026-08-28 — Inicialització del Llibre d'Obra
- **Què:** Creació del `LEDGER.md`, `tooling/preflight.mjs`, `.agents/skills/trellat/SKILL.md` i els hooks d'Antigravity.
- **Per què:** Per aturar la precipitació cognitiva de les IAs i complir amb el "Pas 0" de l'auditoria (La Porta de Pedra Seca).
- **Fitxers:** `.agents/LEDGER.md`, `.agents/skills/trellat/SKILL.md`, `tooling/preflight.mjs`, `.agents/hooks/verify.mjs`, `.agents/hooks.json`.
- **Risc:** Baix. (Per revertir-ho, es poden esborrar aquests fitxers i deshabilitar els hooks).

## 2026-08-28 — Tall de Maquinari Lliure de Deute (2022)
- **Què:** Establiment del tall de suport de maquinari a dispositius de **2022** (motors web moderns, iOS 16+, Chrome 100+). Elimina l'obligació de suportar iPad A10 o iOS 15.8.
- **Per què:** Per assolir un estat de **ZERO Deute Tècnic**. Els motors web moderns suporten nativament optimitzacions (`content-visibility`, `adoptedStyleSheets`, JS actual) sense necessitat de *polyfills*, trucs bruts de manipulació de DOM o "rellotges vigilants" extrems. Qualsevol tècnica (com el *Circuit Breaker*) es manté només si aporta robustesa general a l'arquitectura *Offline-First*, no com a pegat per al *legacy*.
- **Conseqüència Tècnica:** Es prohibeix la introducció de codi condicional o caigudes de rendiment (*fallbacks* penalitzadors) dirigides a donar suport a navegadors antics.


<!-- HASH: 1080755f84bfb32ec943e48a96b3dabb5767771fc085550e58c7e43dca10becc -->