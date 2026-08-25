---
name: socdepoble-porta-mecanica
lang: en
description: "Rules for writing and maintaining enforcement gates. A gate must test behaviour rather than identifier names, must exit non-zero, must be wired to an invocation point, and must produce zero false positives. Use when writing, reviewing or debugging any tractor, guard, linter or pre-commit check."
triggers_ca: ["porta", "tractor", "gate", "guardià", "pre-commit", "enforcement", "norma mecànica"]
triggers_en: ["gate", "guard", "enforcement", "pre-commit hook", "lint rule", "CI check"]
version: 1.0.0
status: canonic
abast: ["global"]
---

# Mechanical Gates

## The governing diagnosis

> **Fer una vegada ≠ Continuar fent.**

This project does not fail at building tools. It fails at keeping them
connected. Measured, not asserted:

| Component | Reality |
|---|---|
| `core/safety.mjs` · `withRollback` | 0 invocations outside its own definition |
| `core/safety.mjs` · `withLock` | 0 invocations |
| `core/safety.mjs` · `assertWriteZone` | 0 invocations |
| `tractor-consell.mjs` | 17 infractions, wired to `npm run build`, build not run |
| `pre-commit.mjs` | audits the wiki; `src/` and `wordpress-plugin/` unguarded |

A rule with no `process.exit(1)` is a preference. A gate with no invocation
point is a document. A gate that is invoked but ignored is worse than either,
because it manufactures the feeling of safety.

## Law 1 — Test behaviour, not names

`tractor-consell.mjs` law L2 checks whether `supabaseBackend.js` contains the
identifier `normalizeDataMode` or `DATA_MODES = new Set(`. The file
implements the required behaviour with an inline literal:

```js
if (!['auto','seed','local','hybrid'].includes(dataMode)) dataMode = 'auto';
```

The gate reports a violation. The code is correct. **This is the most
dangerous kind of bug a gate can have**, because it does not fail loudly — it
trains the team to skim past red output. That is how law L10, which correctly
reported the content-destroying JSX shim, survived unread for weeks.

When writing a check, ask: *would a correct implementation written a
different way pass?* If not, the check is wrong.

## Law 2 — Prefer differential to absolute

When the analysis cannot be exact, compare the artefact against **its own
previous state** rather than against an ideal. An imperfect but *consistent*
analyser is enough to detect degradation, and it produces no false positives
on pre-existing conditions. Report pre-existing findings as warnings; block
only on things the current change introduces.

## Law 3 — Measure honestly

A budget fed a false measurement blocks healthy work. Counting changed lines
by index says that deleting one line from a forty-line file rewrites 35% of
it. Use a real diff (LCS after trimming common prefix and suffix). If a
metric drives a refusal, the metric must be defensible on its own.

## Law 4 — Every gate needs a door

A gate is not deployed until it is *called*. Record where:

```json
"porta": "npm run porta:manual && npm run porta:consell && npm run porta:tanca",
"build": "npm run porta && npm run build:seo && npm run build:web"
```

Then verify the invocation actually runs — check that the build has not been
bypassed by calling `vite build` directly. A gate wired into a script nobody
runs is a gate in name only.

## Law 5 — Cover the surface that broke

`pre-commit.mjs` guards the vault. The collapse happened in `src/`. Before
adding a rule, ask which directory the last three incidents occurred in, and
confirm the gate reaches it.

## Law 6 — Do not swallow

```js
try { /* comprovació */ } catch (e) {}   // ← prohibit en una porta
```

Wrapping a check in an empty catch converts a failure into a pass. If a check
cannot run, the gate must report `NOT_RUN` and exit non-zero — never green.
The same applies to `grep` invoked relative to `process.cwd()`: if the hook
runs from another directory the pattern finds nothing and the gate silently
passes. Resolve paths from an explicit root.

## Structure of a gate

```js
#!/usr/bin/env node
// Zero dependencies. Vanilla ESM. Explicit --root.
const infraccions = [], avisos = [], OK = [];
/* Llei N · one paragraph stating what breaks if this is violated */
if (infraccions.length) { informa(); process.exit(1); }
console.log('Bancal net.'); process.exit(0);
```

Exit codes: `0` clean · `1` infractions · `2` the gate itself could not run.
Group output by law, cap the listing, and always state the consequence, not
just the condition — `"36px < 44px"` teaches nothing; `"36px < 44px on the
primary mobile control: unreachable for the target users"` does.

## Exemptions

Exemptions live in a file, carry a written justification of real length, and
are reviewed quarterly. An exemption nobody remembers the reason for should
no longer exist. A gate that accepts undocumented exemptions has no laws.
