---
name: verified-change-gate
description: Gate code, configuration, prompt, workflow, or skill changes with risk-proportionate tests and postcondition evidence. Use while making changes, or for an explicit release-readiness or mutation-safety review where gates must be assessed; skip general read-only explanations.
---

# Verified Change Gate

Completion is a measured postcondition, not a successful edit or a green command.

## Define the gate

At the start of a change, or at the start of a release-readiness review:

1. Capture the available baseline and working-tree state. If the change already
   exists, compare it with a known base and label missing pre-change evidence
   instead of reconstructing it.
2. State the intended behavior, invariants, failure modes, and rollback path.
3. Select checks proportional to risk. Include a regression test for the reported
   failure whenever feasible.

## Implement safely

- Make the smallest coherent diff and preserve unrelated user changes.
- Prefer structured parsers, AST transforms, schemas, and typed interfaces over
  regex or line-based rewriting of code and configuration.
- For bulk mutation, require an explicit file manifest, preview, content hashes,
  snapshot, atomic replacement, bounded change budget, and verified rollback.
- Keep generated artifacts reproducible and separate from source-of-truth files.

## Verification ladder

Run the applicable levels, in order:

1. syntax and schema validation;
2. focused unit or contract tests;
3. static analysis, lint, and type checks;
4. integration and security tests across trust boundaries;
5. production-mode build or package validation;
6. runtime smoke, accessibility, and visual regression checks for user interfaces;
7. rollback or recovery rehearsal for high-risk mutations, only in an isolated,
   non-production target and when authorized; otherwise mark it not run.

Inspect the resulting diff and artifacts even when all commands return zero. Verify
that tests actually reached the intended behavior and did not silently skip.

## Prompts and skills

Evaluate behavioral changes with a small versioned suite containing:

- positive cases that must trigger;
- near-miss cases that must not trigger;
- adversarial and malformed inputs;
- tool-failure and partial-state cases;
- repeated trials where output is nondeterministic;
- a holdout set not used while editing.

Prefer deterministic graders for structure, side effects, permissions, citations,
and tool traces. Use rubric-based model grading only for qualities that require
judgment, and sample failures manually.

## Release decision

Classify each required check as pass, fail, blocked, or not run. A failed required
check blocks a completion or release recommendation. This gate never authorizes
performing a release. A blocked or omitted check lowers the confidence claim and
must be named explicitly.

Never award “10/10”, “safe”, “fixed”, or “production-ready” while a required check
is failed, missing, bypassable, or outside the audited scope. Report the exact
evidence, residual risk, and fastest path to close the gate.
