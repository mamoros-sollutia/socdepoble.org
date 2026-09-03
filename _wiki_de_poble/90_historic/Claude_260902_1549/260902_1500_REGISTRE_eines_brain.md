---
tipus: registre
estat: esborrany
description: Registre canonic de les 164 eines del Brain amb tipus, estat, etiquetes i invocador declarats.
tags:
  - maquina
  - skills
---

# REGISTRE D'EINES DEL BRAIN

> Un `.mjs` no pot portar frontmatter d'Obsidian. Este document és la
> projecció llegible de `tooling/REGISTRE_EINES.json`, que usa **el mateix
> vocabulari tancat** que `esquema_frontmatter.json`. Una sola llei per a
> documents i per a eines.

**Vocabulari tancat (16):** acta · arquitectura · core · disseny · escriptori · genoma · govern · graf · identitat · legal · maquina · saber · seguretat · skills · sollutia · temporal

**Estat:** `actiu` = el crida npm o un altre script · `orfe` = només citat en documentació · `mort` = ningú el nomena enlloc.

**Totals:** 164 fitxers · 126 actius · 37 orfes · 1 mort.


## `scripts/` — 11 fitxers · 8 sense cridador

| Fitxer | tipus | estat | etiquetes | escriu | falla tancat | invocador |
|---|---|---|---|:-:|:-:|---|
| `audit-accessibility.sh` | eina | **orfe** | maquina | — | — | — |
| `audit-performance.sh` | eina | **orfe** | maquina | — | — | — |
| `enllacat-intelligent-wiki.mjs` | eina | actiu | graf, maquina | — | — | — |
| `fetch_town_media.mjs` | eina | **orfe** | maquina | sí | — | — |
| `fix_pedra_seca.mjs` | eina | **MORT** | maquina | sí | — | — |
| `generate-supabase-seed.mjs` | eina | actiu | maquina | sí | — | — |
| `generate-supabase-seed.sh` | eina | actiu | maquina | — | sí | `npm run db:seed:generate` |
| `migrate-component.sh` | eina | **orfe** | maquina | — | — | — |
| `sync_agents_to_wiki.mjs` | eina | **orfe** | maquina | — | — | — |
| `sync_brain_to_wiki.sh` | eina | **orfe** | maquina | — | — | — |
| `teixidor-backlinks.mjs` | eina | **orfe** | graf, maquina | sí | sí | — |

## `scripts/immunitari/` — 1 fitxers

| Fitxer | tipus | estat | etiquetes | escriu | falla tancat | invocador |
|---|---|---|---|:-:|:-:|---|
| `plaquetes.mjs` | eina | actiu | maquina | sí | sí | — |

## `tooling/` — 4 fitxers · 2 sense cridador

| Fitxer | tipus | estat | etiquetes | escriu | falla tancat | invocador |
|---|---|---|---|:-:|:-:|---|
| `escala_sdp_root.mjs` | eina | **orfe** | maquina | sí | sí | — |
| `preflight.mjs` | eina | actiu | maquina | — | sí | — |
| `verify-bios.mjs` | eina | actiu | identitat, seguretat | — | sí | — |
| `verify-ledger.mjs` | eina | **orfe** | govern, seguretat | sí | sí | — |

## `tooling/agents/` — 2 fitxers · 2 sense cridador

| Fitxer | tipus | estat | etiquetes | escriu | falla tancat | invocador |
|---|---|---|---|:-:|:-:|---|
| `autoneteja_safata_produccio.sh` | eina | **orfe** | escriptori, genoma | — | — | — |
| `force_read_petorreta_rules.sh` | eina | **orfe** | genoma, govern | — | — | — |

## `tooling/brain/` — 24 fitxers · 7 sense cridador

| Fitxer | tipus | estat | etiquetes | escriu | falla tancat | invocador |
|---|---|---|---|:-:|:-:|---|
| `260830_neteja_deute.mjs` | migracio | actiu | escriptori, genoma | sí | sí | — |
| `260830_pedacos_arrel.mjs` | migracio | actiu | genoma | sí | sí | — |
| `260830_purga_maquinari.mjs` | migracio | actiu | escriptori, genoma | sí | sí | — |
| `260831_rescat_tokens.mjs` | migracio | **orfe** | disseny, genoma | sí | — | — |
| `add_frontmatter_to_agents.mjs` | eina | **orfe** | genoma, saber | sí | — | — |
| `ancora.mjs` | eina | actiu | genoma, graf, seguretat | sí | sí | — |
| `brain_distill.py` | eina | actiu | core, genoma | — | — | `npm run brain:distill` |
| `build_context_pack.py` | eina | **orfe** | core, genoma | sí | — | — |
| `build_skills_index.mjs` | eina | actiu | genoma, graf, skills | sí | sí | `npm run skills:index` |
| `cens_cromatic.mjs` | eina | **orfe** | disseny, genoma | — | — | — |
| `consolidar_baselines.mjs` | eina | actiu | genoma | sí | — | `npm run deute:revisa` |
| `crear_bundle.mjs` | eina | actiu | core, genoma | sí | — | `npm run bundle` |
| `crear_document.mjs` | eina | **orfe** | genoma | sí | sí | — |
| `desenterrar.mjs` | eina | **orfe** | genoma, seguretat | sí | sí | — |
| `despertar.mjs` | eina | actiu | genoma, skills | — | sí | `npm run despertar` |
| `farcell.mjs` | eina | actiu | core, genoma | — | — | — |
| `maintain.sh` | eina | actiu | genoma | — | — | `npm run brain:maintain` |
| `migrate_skills.mjs` | eina | **orfe** | genoma, skills | sí | — | — |
| `persona_router.mjs` | eina | actiu | genoma, identitat, skills | — | sí | — |
| `reparar_frontmatter_skills.mjs` | eina | actiu | genoma, saber, skills | sí | sí | — |
| `sync_agent_mirror.py` | eina | actiu | genoma | — | — | — |
| `tests/test_brain_tools.py` | prova | actiu | genoma | sí | — | — |
| `time-machine.mjs` | eina | actiu | genoma, temporal | sí | sí | — |
| `tractor-pedra-seca.mjs` | porta | actiu | disseny, genoma | sí | sí | `npm run porta:baseline`, `npm run porta:pedra-seca` |

## `tooling/gates/` — 28 fitxers

| Fitxer | tipus | estat | etiquetes | escriu | falla tancat | invocador |
|---|---|---|---|:-:|:-:|---|
| `build-seo-manifest.mjs` | porta | actiu | legal, maquina, skills | sí | sí | `npm run porta:seo`, `npm run build:seo` |
| `design_guard.mjs` | porta | actiu | disseny, maquina | sí | sí | `npm run porta:baseline`, `npm run porta:design-guard` |
| `obrir_torn.mjs` | porta | actiu | escriptori, maquina, temporal | — | sí | `npm run torn:obrir` |
| `run-portes.mjs` | porta | actiu | maquina | — | sí | `npm run porta` |
| `tancament.mjs` | porta | actiu | escriptori, maquina | — | sí | `npm run tancar` |
| `tractor-arrel.mjs` | porta | actiu | maquina | — | — | `npm run porta:arrel` |
| `tractor-build-previ.mjs` | porta | actiu | maquina | — | sí | `npm run porta:build` |
| `tractor-cadena.mjs` | porta | actiu | maquina | — | sí | `npm run porta:cadena` |
| `tractor-cens.mjs` | porta | actiu | maquina | — | sí | `npm run porta:cens` |
| `tractor-consell.mjs` | porta | actiu | govern, maquina | — | sí | `npm run porta:consell` |
| `tractor-cromatic.mjs` | porta | actiu | disseny, maquina | — | sí | `npm run porta:cromatic` |
| `tractor-doctrina-maquinari.mjs` | porta | actiu | govern, maquina | — | — | `npm run porta:maquinari` |
| `tractor-doctrina.mjs` | porta | actiu | govern, maquina | — | sí | `npm run porta:doctrina` |
| `tractor-enxufe.mjs` | porta | actiu | maquina | — | — | `npm run porta:enxufe` |
| `tractor-estucat.mjs` | porta | actiu | disseny, maquina | sí | sí | `npm run porta:estucat` |
| `tractor-innerhtml.mjs` | porta | actiu | maquina, seguretat | — | sí | `npm run porta:innerhtml` |
| `tractor-manifest.mjs` | porta | actiu | maquina, skills | sí | sí | `npm run porta:manifest` |
| `tractor-persistencia.mjs` | porta | actiu | maquina | — | sí | `npm run porta:persistencia` |
| `tractor-promesa.mjs` | porta | actiu | maquina | sí | sí | `npm run porta:baseline`, `npm run porta:promesa` |
| `tractor-registre.mjs` | porta | actiu | maquina, skills | — | sí | `npm run porta:registre` |
| `tractor-rutes-web.mjs` | porta | actiu | maquina | — | sí | `npm run porta:rutes-web` |
| `tractor-rutes.mjs` | porta | actiu | maquina | sí | sí | `npm run porta:rutes` |
| `tractor-shim.mjs` | porta | actiu | maquina | — | sí | `npm run porta:shim` |
| `tractor-sollutia.mjs` | porta | actiu | maquina, sollutia | — | sí | `npm run porta:frontera` |
| `tractor-tdz.mjs` | porta | actiu | maquina | — | sí | `npm run porta:tdz` |
| `tractor-tokens.mjs` | porta | actiu | disseny, maquina | — | sí | `npm run porta:tokens` |
| `tractor-vocabulari.mjs` | porta | actiu | maquina, saber | sí | sí | `npm run porta:vocabulari`, `npm run porta:baseline` |
| `verificador-scc.mjs` | porta | actiu | graf, maquina | — | sí | `npm run porta:scc` |

## `tooling/lib/` — 2 fitxers

| Fitxer | tipus | estat | etiquetes | escriu | falla tancat | invocador |
|---|---|---|---|:-:|:-:|---|
| `arrel.mjs` | llibreria | actiu | maquina | — | sí | — |
| `codi.mjs` | llibreria | actiu | maquina | — | — | — |

## `tooling/mocks/` — 1 fitxers · 1 sense cridador

| Fitxer | tipus | estat | etiquetes | escriu | falla tancat | invocador |
|---|---|---|---|:-:|:-:|---|
| `sollutiaBackend.js` | simulacre | **orfe** | sollutia | — | — | — |

## `tooling/pdf/` — 1 fitxers

| Fitxer | tipus | estat | etiquetes | escriu | falla tancat | invocador |
|---|---|---|---|:-:|:-:|---|
| `render_pdf.sh` | eina | actiu | maquina | — | sí | `npm run pdf:render` |

## `tooling/scripts/` — 1 fitxers

| Fitxer | tipus | estat | etiquetes | escriu | falla tancat | invocador |
|---|---|---|---|:-:|:-:|---|
| `build-tokens.mjs` | eina | actiu | disseny | sí | sí | `npm run build:tokens` |

## `tooling/session/` — 2 fitxers

| Fitxer | tipus | estat | etiquetes | escriu | falla tancat | invocador |
|---|---|---|---|:-:|:-:|---|
| `check-close.mjs` | eina | actiu | genoma | sí | sí | — |
| `persona_router.mjs` | eina | actiu | genoma, identitat, skills | — | sí | — |

## `tooling/wiki/` — 87 fitxers · 18 sense cridador

| Fitxer | tipus | estat | etiquetes | escriu | falla tancat | invocador |
|---|---|---|---|:-:|:-:|---|
| `audit_estructura.mjs` | eina | **orfe** | graf | — | — | — |
| `autoneteja_wiki.mjs` | eina | actiu | escriptori, graf | — | sí | — |
| `build_context_pack.py` | eina | actiu | core, graf | sí | — | — |
| `codemod_frontmatter.mjs` | eina | actiu | graf, saber | sí | — | — |
| `compile-cultura.mjs` | eina | **orfe** | graf | sí | sí | — |
| `compile-wiki-to-system-prompt.mjs` | eina | actiu | graf | sí | sí | — |
| `compiler/01_build_index.cjs` | eina | actiu | graf | sí | — | — |
| `compiler/02_build_ontology.cjs` | eina | actiu | graf, saber | sí | — | — |
| `compiler/build_file_catalog.py` | eina | **orfe** | graf | — | — | — |
| `compiler/build.cjs` | eina | actiu | graf | — | — | — |
| `consolidar_etiquetes.mjs` | eina | actiu | graf, saber | — | — | — |
| `contradiction_engine.mjs` | eina | actiu | graf | sí | sí | — |
| `core/a11y_seo.mjs` | nucli | actiu | disseny, graf, legal | — | — | — |
| `core/audit.mjs` | nucli | actiu | graf | — | — | — |
| `core/autoneteja_audit.mjs` | nucli | actiu | escriptori, graf | — | — | — |
| `core/build_rag_index.mjs` | nucli | actiu | graf | sí | sí | `npm run rag:build` |
| `core/build_slug_index.mjs` | nucli | actiu | graf | sí | sí | `npm run slugs:build` |
| `core/corpus_snapshot.mjs` | nucli | actiu | graf, seguretat | — | — | — |
| `core/edge_rag.mjs` | nucli | actiu | graf | — | — | — |
| `core/lint.mjs` | nucli | actiu | graf | — | — | — |
| `core/mutation_kernel.mjs` | nucli | actiu | graf | sí | — | — |
| `core/parse.mjs` | nucli | actiu | graf | — | — | — |
| `core/pattern_extractor.mjs` | nucli | actiu | graf | — | sí | — |
| `core/runner.mjs` | nucli | actiu | graf | — | — | — |
| `core/safety.mjs` | nucli | actiu | graf, seguretat | sí | — | — |
| `core/search_cli.mjs` | nucli | actiu | graf | — | — | — |
| `core/self_repair.mjs` | nucli | actiu | graf | — | — | — |
| `core/sistema_nervios.mjs` | nucli | actiu | graf | — | — | — |
| `core/snapshot_engine.mjs` | nucli | actiu | graf, seguretat | sí | — | — |
| `core/tanca.mjs` | nucli | actiu | graf | — | sí | — |
| `core/translate.mjs` | nucli | actiu | graf | — | — | — |
| `core/trellat_metrics.mjs` | nucli | **orfe** | graf | — | — | — |
| `cura_robotomia.mjs` | eina | actiu | graf | — | sí | — |
| `entropia_zero_router.mjs` | eina | actiu | graf | — | — | — |
| `escriptori_to_wiki.js` | eina | **orfe** | escriptori, graf | — | — | — |
| `gen_targeta_universal.mjs` | eina | **orfe** | graf | — | — | — |
| `generar_genoma_v2.mjs` | eina | actiu | graf, identitat | sí | sí | — |
| `generar_petorreta_inversa.mjs` | eina | actiu | govern, graf | sí | — | — |
| `hidratar_genoma.mjs` | eina | **orfe** | graf, identitat | sí | — | — |
| `lib/context_preflight.mjs` | llibreria | actiu | graf | — | — | — |
| `lib/enllacos.mjs` | llibreria | **orfe** | graf | — | — | — |
| `lib/frontmatter_pla.mjs` | llibreria | actiu | graf, saber | — | — | — |
| `lib/frontmatter.mjs` | llibreria | actiu | graf, saber | — | — | — |
| `lib/persona_router.mjs` | llibreria | actiu | graf, identitat, skills | — | — | — |
| `lib/project_paths.mjs` | llibreria | actiu | graf | — | — | — |
| `lib/resolutor.mjs` | llibreria | actiu | graf | — | — | — |
| `lib/termodinamic.mjs` | llibreria | actiu | graf | — | — | — |
| `lib/text.mjs` | llibreria | actiu | graf | — | — | — |
| `lib/wiki_walker.mjs` | llibreria | actiu | graf | — | — | — |
| `llaurador_indexs.mjs` | eina | actiu | graf | sí | sí | `npm run porta:llaurador` |
| `neteja_arrel.mjs` | eina | **orfe** | escriptori, graf | — | — | — |
| `neteja_brain.mjs` | eina | actiu | escriptori, graf | sí | sí | — |
| `neteja_termodinamica.mjs` | eina | **orfe** | escriptori, graf | — | — | — |
| `pre-commit.mjs` | eina | actiu | graf | sí | sí | — |
| `purga_fantasmes_ui.mjs` | eina | **orfe** | escriptori, graf | — | — | — |
| `purge_empty_nodes.mjs` | eina | **orfe** | escriptori, graf | — | sí | — |
| `purge_ghost_links.mjs` | eina | actiu | escriptori, graf | sí | — | — |
| `reflex_petorreta.mjs` | eina | actiu | govern, graf | sí | — | `npm run porta:reflex` |
| `run-portes.mjs` | eina | actiu | graf | — | sí | — |
| `sanador_wiki.mjs` | eina | actiu | graf | sí | sí | — |
| `sdp-cli.mjs` | eina | actiu | graf | — | — | — |
| `sdp.mjs` | eina | actiu | graf | — | — | — |
| `semantic_auditor.mjs` | eina | actiu | graf | — | — | — |
| `seo_auditor.mjs` | eina | **orfe** | graf, legal | — | — | — |
| `sincronitzar_skills.mjs` | eina | actiu | graf, skills | sí | sí | — |
| `sistema_nervios.mjs` | eina | actiu | graf | — | — | — |
| `sync_brain_termodinamic.sh` | eina | **orfe** | graf | — | — | — |
| `sync_brain.sh` | eina | **orfe** | graf | — | — | — |
| `sync_sollutia_skills.mjs` | eina | **orfe** | graf, skills, sollutia | — | — | — |
| `tallafocs.cjs` | eina | **orfe** | graf, seguretat | — | — | — |
| `teixidor.mjs` | eina | actiu | graf | sí | sí | `npm run porta:baseline`, `npm run porta:teixit` |
| `teixidora_sinapsis.mjs` | eina | actiu | graf | sí | sí | — |
| `tests/frontmatter_autoneteja.test.mjs` | prova | actiu | escriptori, graf, saber | sí | — | — |
| `tests/reflex_petorreta.test.mjs` | prova | actiu | govern, graf | sí | — | — |
| `tests/safety_dry_run.test.mjs` | prova | actiu | graf, seguretat | sí | — | — |
| `tests/sistema_nervios.test.mjs` | prova | actiu | graf | sí | — | — |
| `tests/smoke_cli.test.mjs` | prova | actiu | graf | — | — | — |
| `tractor-cadena.mjs` | porta | actiu | graf | — | sí | — |
| `tractor-cognitiu.mjs` | porta | actiu | graf, skills | sí | sí | `npm run porta:cognitiu` |
| `tractor-esquemes.mjs` | porta | actiu | graf | — | sí | — |
| `tractor-frontera-auth.mjs` | porta | actiu | graf, seguretat, sollutia | — | sí | — |
| `tractor-frontmatter.mjs` | porta | actiu | graf, saber | sí | sí | `npm run porta:frontmatter` |
| `update_glossari.cjs` | eina | **orfe** | graf, saber | — | — | — |
| `validate_taxonomia.mjs` | eina | actiu | graf, saber | — | — | — |
| `validate_trellat.cjs` | eina | actiu | graf | — | — | — |
| `validate-wiki-compliance.mjs` | eina | actiu | graf | — | sí | — |
| `wiki_integritat.mjs` | eina | actiu | graf | — | — | — |
