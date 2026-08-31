# 🛡️ ACTA DEL CONSELL DE LA PETORRETA (Codex)
## Auditoria d’immortalitat, Pedra Seca i Baseline 2022

**Dictamen executiu**: La fallada no és "la IA oblida". És que la Wiki no és un contracte executable.
Troballa més greu: **`.agents/skills` encara no és durable en Git**. El commit conserva un symlink cap a un cervell eliminat (`cervells/inicial_...`).

## 🎯 MISSIÓ 1: EL MISTERI DE LA DESOBEDIÈNCIA INVOLUNTÀRIA
**Causes arrel:**
1. Recuperació (RAG) no equival a autoritat.
2. Massa "fonts úniques".
3. Prosa normativa sense tipus.
4. Regles sense criteri d'activació.
5. Sense prova de comportament.

**Solució: Compilador d'Identitat IAIA**
- `AGENTS.md` a l'arrel, mínim.
- `policy/iaia.policy.yaml` per a regles executables.
- `council.registry.json` amb la llista de les 12 IAs.
- Bootloader i Postflight (per bloquejar respostes si falta el Consell).

## 🎯 MISSIÓ 2: AUDITORIA DE SKILLS I GENOTIP
10 contradiccions detectades (ex: online-first vs offline-first encara coexisteixen).
**Fusions exactes:**
- `core-change-control` (bounded-action + verified-change)
- `core-sealed-restore` (safe-restore + restauracio-segellada)
- `trellat` (absorbeix cog-deliberation)
- `council-review` (abocament-total + multi-agent-review)

## 🎯 MISSIÓ 3: RESCAT DE PEDRA SECA
4 fonts competidores de Pedra Seca. 1.188 línies manuals a `DesignSection.jsx`. Design Guard "passa" amb 210 crítics.
**Arquitectura objectiu:** 
Generar `tokens.css` des de `tokens.source.json`.
Crear `packages/ui/` amb primitives i patrons.
**Mecanismes:** AST JSX per bloquejar `style={{...}}`.

## 🎯 MISSIÓ 4: CACERA DE FANTASMES
- **P0 (Urgència màxima):** Fer durable el cervell en Git (trencat pel symlink). Reparar portes verdes honestes (`npm run gate` falla amb 128 errors).
- **P1 (Baseline 2016 mort):** Llevar `-webkit-overflow-scrolling`, UUID zero compartit.
- **P1 (Offline mort):** Eliminar `fake-indexeddb` i restes de Dexie/PWA.
- **P1 (Pedra Seca):** Migrar i eliminar `legacy-components.css`.
- **P2 (Sollutia):** Publicar un `@socdepoble/embed-contract` sense React.
