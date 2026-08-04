---
estat: "canonic"
tipus: "skill"
description: "Manual operatiu de plaquetes.mjs v1.1: el Sistema Immunitari que diagnostica ferides del graf (fantasmes, orfes). IMPORTANT: L'script és 100% Read-Only. Les mutacions les executa l'Agent mitjançant les eines de l'IDE complint el protocol Reflex."
temes: ["sistema"]
---

# Sistema Immunitari — Les Plaquetes 🩸

`plaquetes.mjs` circula pel vault com les plaquetes per la sang: detecta ferides (nodes fantasma, fitxers orfes), i proposa la coagulació en una **RECEPTA** llegible.
**IMPORTANT:** El script no té capacitats destructives ni de modificació (`bash`, `git rm`). Qualsevol canvi suggerit pel diagnòstic HA DE SER APLICAT per l'agent a través de l'IDE (`replace_file_content` o `write_to_file`), obeint el protocol Reflex en tot moment.

## Flux d'execució

```
diagnostic ──▶ RECEPTA (JSON, dry-run: 0 escriptures al vault)
                 │
                 ▼  l'humà o l'agent LLIG la recepta
Aprovació  ──▶  L'Agent muta els fitxers afectats mitjançant eines de l'IDE 
                (write_to_file / replace_file_content). Muta el codi sota 
                les lleis del Protocol Reflex.
```

## Les cinc línies roges (Lleis de la IAIA MarIA)

| # | Línia roja | On es força al codi |
|---|---|---|
| R1 | L'script NO muta arxius | Mai permetre que scripts generin mutacions bypassant l'agent. |
| R2 | Protocol Reflex obligatori | Tot canvi el fa l'agent demanant permís de mutació mitjançant Reflex. |
| R3 | Res s'esborra mai | L'agent mou (re-etiqueta o mou a quarantena), mai `rm` excepte si està expressament indicat. |
| R4 | El reparador no s'opera a si mateix | Cap script ni agent pot escriure a `scripts/immunitari/`, `.git/`. |
| R5 | Canaris i zones delegades intocables | `ignoraObjectius`, `exclouFonts` s'han de respectar. |

## Operacions del catàleg v1 (Executades per l'Agent, no per l'script)

- **LAPIDA** — l'agent substitueix cada `[[fantasma]]` per `[[00_MEMORIAL_Lapides#fantasma|àlies †]]` (l'àlies original es preserva) i erigeix la secció corresponent al Memorial amb origen i línia. Narrativa preservada sense mentir al graf. Els incrustats `![[...]]` mai es toquen.
- **ADOPTA** — l'agent afegeix l'orfe amb contingut a la secció «Adopcions de Les Plaquetes» de l'índex configurat.
- **QUARANTENA** — l'agent reanomena fitxers buits o els desplaça, conservant la ruta relativa.
