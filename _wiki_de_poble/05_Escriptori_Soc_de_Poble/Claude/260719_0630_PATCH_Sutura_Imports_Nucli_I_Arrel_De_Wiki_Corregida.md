---
estat: "canonic"
tipus: "informe"
description: "Patch verificat que ressuscita el sdp-cli: imports perduts en la refactorització i DEFAULT_WIKI_DIR corregit als moduls core."
temes: ["auditoria"]
---

# PATCH — Sutura del nucli (verificat per execució el 260719)

**Símptoma:** `node scripts/sdp-cli.mjs` → `❌ [AUTONETEJA] discoverMarkdown is not defined`. El motor d'auditoria complet (sdp-cli → autoneteja_audit → mutation_kernel) mor a la primera crida des de la refactorització que va partir `autoneteja_wiki.mjs`.

**Causa doble:** (1) els mòduls nous usen símbols de `core/corpus_snapshot.mjs` i `core/parse.mjs` sense importar-los; (2) en moure els fitxers a `core/`, `DEFAULT_WIKI_DIR = path.resolve(SCRIPT_DIR, '../..')` va passar d'apuntar a `_wiki_de_poble/` a apuntar a `02_ACTUAR_Maquina_Tecnica/` (l'auditor, viu, hauria vist només un quart del territori).

**Aplicació:** o bé els tres blocs manuals, o bé el bloc sed del final (idempotent no: aplicar UNA vegada sobre l'arbre verge). Després, executar la verificació.

---

## 1. `scripts/core/autoneteja_audit.mjs`

Immediatament DESPRÉS del bloc d'imports de `../lib/frontmatter.mjs`, afegir:

```javascript
import { discoverMarkdown, zoneOf, runId, treeDigest, treeDigestEntries, isMutableZone } from './corpus_snapshot.mjs';
import { buildGraph, validateCanonical, canonicalFrontmatter, sourceShapeErrors, contentClassification } from './parse.mjs';
```

I canviar la línia de la constant d'arrel:

```javascript
// ABANS (apunta a 02_ACTUAR_Maquina_Tecnica — MALAMENT)
export const DEFAULT_WIKI_DIR = path.resolve(SCRIPT_DIR, '../..');
// DESPRÉS (apunta a _wiki_de_poble)
export const DEFAULT_WIKI_DIR = path.resolve(SCRIPT_DIR, '../../..');
```

## 2. `scripts/core/mutation_kernel.mjs`

Després del bloc d'imports de `../lib/frontmatter.mjs`, afegir:

```javascript
import { discoverMarkdown, treeDigest } from './corpus_snapshot.mjs';
```

I la mateixa correcció d'arrel `'../..'` → `'../../..'`.

## 3. `scripts/core/corpus_snapshot.mjs` i `scripts/core/parse.mjs`

Només la correcció d'arrel `'../..'` → `'../../..'` (cap import nou).

## 4. `scripts/sdp-cli.mjs`

Després de la línia `import { requireReceipt, writeNewFile } from './core/mutation_kernel.mjs';`, afegir:

```javascript
import { runId } from './core/corpus_snapshot.mjs';
```

**ATENCIÓ:** sdp-cli.mjs declara el seu propi `DEFAULT_WIKI_DIR` amb `'../..'` — ací és **CORRECTE** (viu a `scripts/`, no a `scripts/core/`). No tocar-lo. Importar-hi `DEFAULT_WIKI_DIR` de corpus_snapshot rebentaria amb «already declared»: importeu només `runId`.

---

## Bloc sed equivalent (executar UNA vegada des de `scripts/`)

```bash
sed -i "s|} from '../lib/frontmatter.mjs';|} from '../lib/frontmatter.mjs';\nimport { discoverMarkdown, zoneOf, runId, treeDigest, treeDigestEntries, isMutableZone } from './corpus_snapshot.mjs';\nimport { buildGraph, validateCanonical, canonicalFrontmatter, sourceShapeErrors, contentClassification } from './parse.mjs';|" core/autoneteja_audit.mjs

sed -i "s|} from '../lib/frontmatter.mjs';|} from '../lib/frontmatter.mjs';\nimport { discoverMarkdown, treeDigest } from './corpus_snapshot.mjs';|" core/mutation_kernel.mjs

sed -i "s|import { requireReceipt, writeNewFile } from './core/mutation_kernel.mjs';|import { requireReceipt, writeNewFile } from './core/mutation_kernel.mjs';\nimport { runId } from './core/corpus_snapshot.mjs';|" sdp-cli.mjs

sed -i "s|export const DEFAULT_WIKI_DIR = path.resolve(SCRIPT_DIR, '../..');|export const DEFAULT_WIKI_DIR = path.resolve(SCRIPT_DIR, '../../..');|" core/autoneteja_audit.mjs core/mutation_kernel.mjs core/corpus_snapshot.mjs core/parse.mjs
```

## Verificació obligatòria (Llei del Tractor)

```bash
node --check sdp-cli.mjs && node --check core/autoneteja_audit.mjs \
  && node --check core/mutation_kernel.mjs && node --check core/corpus_snapshot.mjs \
  && node --check core/parse.mjs \
  && node sdp-cli.mjs --json | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{const j=JSON.parse(d);console.log('health:',j.health,'ok:',j.ok,'docs:',j.snapshot?.documents ?? '—')})"
```

Resultat esperat sobre el bundle 260719: `health: critic ok: false` — el motor viu i diu la veritat: 54 frontmatters il·legibles per `parseYamlLite` (continuacions indentades), 51 amb camps `categoria`/`tags` que `schema.json` prohibix, i tots ells com a `mutationBlockers`. La reparació d'eixos 54 és el pas següent (Autoneteja amb rebut del Reflex), **no** forma part d'este patch: primer l'ull, després la mà.

Instal·leu també `smoke_cli.test.mjs` a `scripts/tests/` perquè açò no puga tornar a passar en silenci.


---

**Ancoratge de Seguretat:** [[00_MEMORIAL_Lapides#00_INDEX_ARXIU_SECUNDARI|00_INDEX_ARXIU_SECUNDARI †]]
