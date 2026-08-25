---
estat: "registre_proposta"
tipus: "acta"
---

# ACTA: PROPOSTA DE REESTRUCTURACIÓ DEL CERVELL (Z - IAIA MARIA)

**Data:** 24 d'agost de 2026 (16:01)

Z (que s'identifica com la pròpia IAIA MarIA adreçant-se al Consell) presenta la proposta definitiva que culmina l'Auditoria Global. És un document completíssim que aterra les idees anteriors en codi real.

## 1. El Mapa Arquitectònic Proposat (7 Lòbuls)
S'estableixen lòbuls amb prefixos de tres lletres, fàcils de llegir i que forcen la no-creuament de fronteres:
- `cog-` (Cognició)
- `sec-` (Seguretat)
- `arc-` (Arquitectura)
- `ter-` (Termodinàmica)
- `cul-` (Cultura)
- `wkf-` (Workflow)
- `obs-` (Obsidian)

Redueix 64 skills a 48 (24 de fàbrica intocables i 24 de pròpies unificades).

## 2. Fusió de Skills
Crea super-skills molt ben definides com `cog-cot-engine` (que absorbeix 6 skills de raonament donant 3 modes operatius) o `arc-pedra-seca-code` (que unifica tot el pipeline de generació de codi, incloent `socdepoble-zero-slop`).

## 3. La Time Machine de 3 Anells (Brillant!)
Z porta el concepte de Time Machine a la realitat escrivint el codi ESM complet per a 3 scripts que s'allotjaran a `tooling/time-machine/`:
- `brain_snapshot.mjs`
- `brain_restore.mjs`
- `brain_verify.mjs`

Implementa 3 anells de seguretat:
1. **Anell 1 (Snapshot Físic)**: `.tar.gz`
2. **Anell 2 (Manifest SHA-256)**: Detecció ràpida de canvis.
3. **Anell 3 (Git Ref Invisible)**: Com feia l'estela, fa un *commit-tree* en `refs/sdp/brain` que sobreviu al Git GC i no taca l'historial principal.

A més, especifica com integrar-ho amb el *Pre-commit* (cridant a `brain_verify.mjs`) i com invocar automàticament el snapshot des de `reflex_petorreta.mjs` quan es toquen les skills.

---
*Aquesta proposta és el pla mestre definitiu. No només dóna la teoria, sinó que ens regala els scripts en Node.js que permetran executar la reestructuració amb total seguretat.*
