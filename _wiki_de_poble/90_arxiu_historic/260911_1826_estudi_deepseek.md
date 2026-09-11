---
tipus: estudi
estat: esborrany
description: Informe de Punts Cecs de l'auditoria de Pedra Seca realitzat per Deepseek, enfocat a la qualitat del Bundle i la Governança.
---

# ESTUDI DEEPSEEK (AUDITORIA BUNDLE)

> **Data:** 2026-09-11
> **Model:** Deepseek
> **Entrada:** Bundle `260911_1802_BUNDLE_auditoria.md`

## 1. Veredicte general
El bundle és coherent i de qualitat, però té 3 troballes estructurals importants (de fons).

## 2. Troballes

### T1 · El bundle NO conté la Wiki completa
Falta la meitat de `_wiki_de_poble` al bundle. Ex: `10_actes/`, parts de `04_escriptori/01_produccio/`, entre altres. **Risc:** El Consell audita sense la cadena completa d'actes ni la producció. **Recomanació:** Solucionar a `crear_bundle.mjs`.

### T2 · Contradicció entre `AGENTS.md` i `.agents/` (skills_mirror)
Existeixen miralls de les skills a `_wiki_de_poble/02_saber/skills_mirror/` amb el frontmatter modificat. Si `.agents/skills` i `skills_mirror` diuen coses diferents, és un trencament del cànon de Font Única de Veritat (SSOT). **Recomanació:** Eliminar `skills_mirror/` o crear una porta de sincronia estricta.

### T3 · Fitxers crítics exclosos (`PROTOCOL_PETORRETA.md`, `ESTAT.md`, etc.)
S'està excloent gran part de `.agents/` (excepte `skills/`). Açò significa que l'auditor no pot consultar el cens (`consell.json`), l'estat actual (`ESTAT.md`) ni l'històric d'obra (`LEDGER.md`). **Recomanació:** Abocar `.agents/` sencer al bundle.

## 3. Observacions menors

- **O1:** Falta "AVÍS TERMODINÀMIC" en fitxers > 2MB.
- **O2:** `_wiki_de_poble/00_index.md` desactualitzat respecte a fitxers existents/inexistents.
- **O3:** `## Orphans` de `.agents/index.md` conté falsos positius d'orfenesa per a fitxers canònics (ex: `AGENTS.md`).

## 4. Recomanacions al Mestre
| Prioritat | Acció | Responsable |
|---|---|---|
| **P0** | Incloure `.agents/` sencer al bundle. | `crear_bundle.mjs` |
| **P0** | Decidir què fer amb `skills_mirror/` (esborrar o sincronitzar) | Mestre + IAIA |
| **P1** | Incloure actes i producció | `crear_bundle.mjs` |
| **P1** | Avís termodinàmic > 2MB | `crear_bundle.mjs` |
| **P2** | Actualitzar `_wiki_de_poble/00_index.md` | IAIA |
