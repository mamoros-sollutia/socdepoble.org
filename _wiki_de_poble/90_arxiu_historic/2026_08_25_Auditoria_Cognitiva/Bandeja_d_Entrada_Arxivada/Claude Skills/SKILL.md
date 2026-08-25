---
name: socdepoble-mutacio-segura
lang: en
description: "Governs every operation that writes to source files. Enforces dry-run first, structural validation before write, declared blast radius, receipts and one-command rollback. Use whenever a task would create, edit, move or delete project files, or whenever a script is written that does so."
triggers_ca: ["mutació", "escriure fitxers", "modificar codi", "script de correcció", "refactor massiu", "netejar", "purgar"]
triggers_en: ["mutate files", "bulk edit", "fix script", "refactor across files", "cleanup", "purge"]
version: 1.0.0
status: canonic
abast: ["global"]
---

# Safe Mutation (La Tanca)

## Why this exists

On 2026-08-23 a forty-four-line script called `fix-inline.mjs` inserted the
literal string `// eslint-disable-next-line` above every line containing
`style={{` across `src/`. In JSX attribute position that is a legal comment.
In JSX **children** position it is text — it renders on screen. The script
could not tell the difference because it matched lines with
`String.includes` instead of parsing.

Forty-five visible text defects landed across eleven sections. There was no
dry-run, no snapshot, no confirmation and no rollback. `scanDir(ROOT)` ran at
module top level with no entry guard, so merely *importing* the file mutated
the tree.

The failure was not the regex. The failure was that a script was allowed to
write to disk at all without passing a checkpoint.

## The rule

**No mutation reaches disk except through `tooling/gates/tanca.mjs`.**

```js
import { obriTanca } from 'tooling/gates/tanca.mjs';

const tanca = await obriTanca({
  nom: 'nom-descriptiu',
  argv: process.argv,
  pressupost: { maxFitxers: 8, maxLiniesPerFitxer: 120, maxPercentFitxer: 30 }
});

await tanca.escriu('src/app/App.jsx', nou);
await tanca.transforma('src/config/theme.js', (abans) => abans.replace(a, b));
await tanca.mou('vell.md', 'nou.md');
await tanca.esborra('fantasma.js');

await tanca.tanca();   // valida · pressuposta · fa instantània · escriu · segella
```

`tractor-tanca.mjs` fails the build if any script under `tooling/` or
`scripts/` calls `writeFile`, `rm`, `unlink`, `rename` or `truncate` without
it, and if any mutating script executes at import time.

## The six checkpoints

1. **Dry-run by default.** Without `--procedeix` nothing is written. Always
   read the dry-run output before authorising. The dry-run is the plan.
2. **Clean git tree.** If the tree already has uncommitted work, `git
   checkout` can no longer distinguish your work from the tool's damage. The
   safety net has to exist *before* the risk.
3. **Structural validation, differential.** The result is checked before it
   is written. Compare the file against **itself before the edit**, not
   against perfection: a zero-dependency lexer cannot tell JSX text from
   code, and a Valencian apostrophe (`d'una`) inside a text node opens a
   false string literal. Absolute validation would reject healthy files, and
   a validator that cries wolf gets switched off.
4. **Declared blast radius.** Files touched, lines changed, percentage of the
   file rewritten. A change that touches 119 files is not a patch, it is an
   incident. If a legitimate change exceeds the budget, raise the budget
   *explicitly in the call* — never silently.
5. **Snapshot then receipt.** Literal copy of every file before it is
   touched, then an NDJSON line with before/after hashes.
6. **Rollback in one command.** `node tooling/gates/tanca.mjs --desfer <id>`.

## Writing a mutating script

- **Parse, don't match.** If the target is JSX, JS, JSON, YAML or CSS, use a
  parser or a validated structural detector. Line-oriented `includes()` and
  `replace()` on structured text are the mechanism of every mass corruption
  in this project's history.
- **Guard the entry point.** `if (import.meta.url === \`file://${process.argv[1]}\`)`.
  A module must never mutate on import.
- **Name the operation.** The `nom` becomes the receipt and the snapshot
  directory. `anonim` is a smell.
- **One concern per script.** A script that renames tokens *and* reformats
  *and* removes dead code cannot be rolled back partially.

## What is never acceptable

- `--force`, `--yes` or any flag that skips the dry-run in an automated run.
- Mutating a path derived from untrusted input without `dinsDeLArrel()`.
  Symlink escape is real: a new file inside a symlinked directory resolves
  inside the root textually while landing outside it physically. Canonicalise
  the deepest existing ancestor, then rejoin the missing segments.
- Silencing an error inside an empty `catch {}` in a safety path. The
  previous kernel called `basename()` without importing it; the
  `ReferenceError` fell into an empty catch and disabled the anti-symlink
  guard for every non-existent path — that is, for every new file. A safety
  check that fails open is worse than none, because it is trusted.

## Reporting

State what was changed, how many lines, and the rollback id. If the operation
was refused, quote the refusal and the specific budget or validation that
tripped. Never report a mutation as done without the receipt id.
