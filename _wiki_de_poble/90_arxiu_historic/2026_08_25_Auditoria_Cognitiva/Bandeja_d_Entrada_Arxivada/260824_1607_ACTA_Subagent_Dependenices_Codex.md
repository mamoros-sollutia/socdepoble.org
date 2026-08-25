---
estat: "registre_proposta"
tipus: "acta"
---

# ACTA: INFORME DE DEPENDÈNCIES D'SCRIPTS (CODEX)

**Data:** 24 d'agost de 2026 (16:10)

Aquest és l'informe definitiu del tercer subagent de Codex, especialitzat en les dependències d'scripts i el mapeig de rutes codificades. Desmunta qualsevol intent de fer moviments a cegues, advertint de múltiples perills d'execució.

## 1. Rutes Codificades i Hardcoded (Intocables)
El subagent ha detectat dependències crítiques que ens obliguen a prendre decisions conservadores:
- `socdepoble-iaia-actriu/PERSONA_ROUTER.json` està codificat a `iaia-boot.mjs:10`. Per tant, `socdepoble-iaia-actriu` s'ha de mantenir com a ID o super-skill final, i el recurs ha de romandre al seu lloc.
- `socdepoble-workflow/SKILL.md` està codificat a `AGENTS.md:9` i a `reflex_petorreta.mjs`. S'ha de conservar exactament amb aquest nom.
- Els directoris de recursos interns com `json-canvas/references/` s'han de moure de forma íntegra juntament amb la skill propietària. No s'han d'extreure ni barrejar.

## 2. Destí del Tooling (No moure a skills)
L'informe prohibeix taxativament dispersar els scripts executables dins de les carpetes de skills. El tooling ha de romandre al seu lloc:
- `scripts/` (build/producte) → Intactes.
- `scripts/immunitari/` → `mirall_identitat.mjs` arxivat a favor de `sync_agent_mirror.py`. `plaquetes.mjs` a quarantena.
- `tooling/archive_scripts/**` → No aplanar ni moure mai a skills.
- **La Tanca (Claude):** No instal·lar en paral·lel. Les seues propietats de dry-run, rollback i radi d'explosió s'han d'integrar directament dins de `core/mutation_kernel.mjs` i el Reflex, evitant crear una segona API de mutació que trencaria l'arquitectura existent.

## 3. L'engany dels 48 vs 64
El subagent detecta que l'inventari conceptual de 64 skills no és real al sistema de fitxers. En la realitat només hi ha **48 directoris de skill i 54 fitxers**, sent **35 untracked**. El BUNDLE va etiquetar references, scripts i arxivats com si foren skills noves. Aquest mapeig neteja l'embolic.

## 4. Protocol de Migració Segura
1. Segellar el snapshot del cervell actual (inclosos els *untracked*).
2. Crear les super-skills noves i moure `references/` respectant l'estructura.
3. Conservar els IDs `socdepoble-workflow` i `socdepoble-iaia-actriu`.
4. Adaptar `socdepoble-mutacio-segura` a Reflex/mutation kernel, descartant La Tanca com a ens autònom.
5. Regenerar mirall i context packs al final de tot.

---
*Aquest informe tanca definitivament el trencaclosques de com fer el moviment físic dels arxius sense rebentar els centenars d'scripts de l'ecosistema Sóc de Poble.*
