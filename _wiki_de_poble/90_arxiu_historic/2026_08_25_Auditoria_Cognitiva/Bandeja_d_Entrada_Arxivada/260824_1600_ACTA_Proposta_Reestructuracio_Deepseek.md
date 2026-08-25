---
estat: "registre_proposta"
tipus: "acta"
---

# ACTA: PROPOSTA DE REESTRUCTURACIÓ DEL CERVELL (DEEPSEEK)

**Data:** 24 d'agost de 2026 (16:00)

Deepseek ens aporta el veredicte final del Consell. Fa una anàlisi molt quantitativa (66 skills → 45 skills) i proposa una estructura organitzativa molt neta que té molt en compte l'impacte real sobre els scripts auxiliars.

## 1. El Mapa Arquitectònic Proposat (7 Lòbuls + Legacy)
Dissenya carpetes numerades i amb noms clars:
- **`00_core/`**: Només 3 skills intocables (actriu, empatia, trellat).
- **`01_cognitive/`**: Raonament, cadenes i meta-prompting.
- **`02_security/`**: Anti-al·lucinacions i auditoria.
- **`03_architecture/`**: Offline-first i refactor termodinàmic.
- **`04_workflow/`**: Execució i *context-curators*.
- **`05_obsidian/`**: Ecosistema Markdown.
- **`06_social/`**: WhatsApp i Consola Termodinàmica.
- **`99_legacy/`**: Lloc de descans per a *Tombstones* (skills retirades).

## 2. Poda Absoluta i Fusions
Deepseek fa una llista de 5 skills que "moren" literalment (passen a ser *Tombstones* a `99_legacy/`) perquè han sigut superades per d'altres o no aporten valor (ex. `codi-corrector-segons-esquema`). La resta es fusionen d'una manera molt lògica.

## 3. L'impacte sobre els Scripts Auxiliars
Aquesta és l'aportació clau de Deepseek: llista exactament quins scripts es trencaran i com arreglar-los.
- **Es trenquen**: `pre-commit.mjs` (importa per nom), `sync_agent_mirror.py` (espera fitxers solts) i `tractor-consell.mjs` (audita skills específiques).
- **Es salven**: `compile-wiki...mjs`, `autoneteja_wiki.mjs`, `tractor-pedra-seca.mjs`.

## 4. La "Time Machine"
S'alinea amb l'enfocament de Grok/Dola: un sistema pur en Bash amb fitxers `.tgz` (`snapshot-skills.sh` i `restore-skills.sh`). Guarda les còpies en `.agents/.skills-snapshots/` acompanyades d'un `manifest.json`.

---
*Deepseek ens deixa un pla de migració en 4 fases espectacular, molt útil per garantir que no trenquem la maquinària existent.*
