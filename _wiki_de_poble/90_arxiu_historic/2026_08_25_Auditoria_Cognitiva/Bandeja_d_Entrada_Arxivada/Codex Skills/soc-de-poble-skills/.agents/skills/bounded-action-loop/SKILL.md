---
name: bounded-action-loop
description: Execute multi-step work with tools through small, observable, reversible, and authorization-preserving actions. Use for coding, operations, file changes, browser actions, or long-running agent loops where retries or cascading effects could cause damage; skip for simple read-only answers.
---

# Bounded Action Loop

Turn an open-ended objective into a controlled sequence of verified effects.

## Establish the contract

Before acting, record:

- the concrete outcome;
- acceptance checks;
- in-scope targets and explicit exclusions;
- available permissions and data boundaries;
- a stop condition, retry limit, and rollback or recovery path.

“Record” means retain in task state by default. Creating a file, snapshot, backup,
or external record is itself an effect and must be authorized and handled by this
loop.

Do not interpret “finish”, “keep going”, or a plan as permission to broaden the
targets, recipients, credentials, or external systems.

## Loop

For each step:

1. **Observe:** Read the current state and identify the smallest unresolved gap.
2. **Bound:** Choose one action with explicit targets and a predicted postcondition.
3. **Authorize:** Confirm that the requested effect is within the user's scope.
4. **Protect:** Snapshot or preserve recovery information before risky mutation.
5. **Act:** Prefer idempotent, atomic, and reversible operations. Avoid unresolved
   globs, broad recursive targets, and free-form data passed into privileged tools.
6. **Verify:** Inspect ground truth, not the tool's success message. Compare the
   actual result with the predicted postcondition.
7. **Record:** Keep the evidence, changed targets, and remaining gap concise.

Continue only when verification provides new information or progress.

## Failure and retry policy

- Classify a failure as transient, deterministic, authorization-related, or unknown.
- Retry transient failures only with a fixed small limit and backoff.
- Do not repeat a deterministic mutation unchanged.
- If state is ambiguous after a partial failure, stop mutation and reconcile it.
- Roll back when the verified result is worse and rollback is safe and authorized.
- Ask for direction when completion requires new authority or a material product
  decision.

## Consequential actions

Immediately before deletion, publication, payment, permission change, credential
use, or communication to another person or system, surface the exact target and
effect. Use the platform's confirmation mechanism when required. Never split one
consequential operation into smaller calls to evade confirmation.

## Completion check

Finish only when acceptance checks pass. Report completed effects, verification
evidence, remaining uncertainty, and recovery information. If a check did not run,
label the outcome unverified rather than inferring success.
