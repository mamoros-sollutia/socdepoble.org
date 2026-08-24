---
name: socdepoble-autosanacio
lang: en
description: "Audits the Sóc de Poble graph in read-only mode and generates a verifiable plan for unresolved links, orphans, and empty notes. Use when graph hygiene or repair is requested."
triggers_ca: ["autosanacio", "reparar graf", "orfes", "enllaços trencats"]
triggers_en: ["graph hygiene", "orphans", "repair links"]
version: 2.0.0
status: canonic
abast: ["global"]
---

# Graph Auto-Healing (Immune System)

## Contract and Authority

This skill executes graph diagnostics. Diagnostics are **100% READ_ONLY**. The audit generates an issue list and never mutates files directly. 
If the canonical auditor is unavailable or a precondition fails, return ERROR or NOT_RUN, never PASS. Do not deceive the user with false greens.

## Diagnostic Execution (Phase 1)

Use system tools to analyze the state of knowledge (e.g., searching for broken wikilinks, unlinked orphans, or empty pages).

For each detected issue, indicate:
- Error identifier and severity.
- File/line and evidence.
- Classification: ghost (unresolved link), ambiguous, orphan, empty, or exclusion.
- Proposed solution, confidence level of your proposal, and alternatives.
- Files that would change and rollback proof.

**Diagnostic Limits:** Do not invent destinations just to make an error disappear quickly. Do not rewrite a link purely based on name similarity without being certain. Respect canaries, exclusions, and Escriptori zones.

## Applying Solutions (Phase 2)

Applying the recommended solutions or recipes from the diagnostic is a completely different **SOURCE_MUTATION** operation. To execute it, you must comply with the Universal Workflow:
1. Re-audit the state if time has passed since the original audit.
2. Request permission from the Master with a clear plan (`implementation_plan.md` or a sealed Petorreta).
3. Obtain authorization / lease from the Reflex protocol.
4. Apply the changes with the appropriate tools.
5. Verify the resulting graph.

Quarantine can only affect exact and recoverable targets. Code or notes are never deleted without Reflex and explicit confirmation.
