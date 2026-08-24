---
name: socdepoble-llm-wiki
lang: en
description: "Distills raw notes into the Wiki with traceability, idempotency, and canonical schema. Use when the user asks to process 00_Raw or reorganize knowledge."
triggers_ca: ["processar", "00_Raw", "destil·lar", "notes"]
triggers_en: ["process raw", "distill notes", "reorganize knowledge"]
version: 2.0.0
status: canonic
abast: ["global"]
---

# LLM Wiki (Silent Architecture)

## Activation and Scope
Activated by an explicit request to process `00_Raw`, distill notes, or audit the graph. It does not run automatically at the start or end of a session.

## Phase A — Read-only diagnostic
1. Verify root, schema, canonical zones, and current policy.
2. Inventory only the sources included in the request.
3. For each fragment, identify destination, duplicates, conflicts, provenance, and confidence.
4. Produce a plan with proposed diff and verification criteria.

Do not assume that every orphan is trash. An orphan is an editorial signal, not a delete command.

## Phase B — Authorized integration
Only with the SOURCE_MUTATION flow:
- integrate the fragment into the correct semantic section;
- preserve meaning, authorship, and provenance;
- avoid duplicating equivalent ideas;
- create a new note only if no coherent destination exists;
- generate the frontmatter from the canonical schema, without invented fields or generic Obsidian metadata;
- verify links, schema, and diff before confirming.

## Phase C — Origin
Do not delete or move from `00_Raw` until the destination has been verified. Propose quarantine or archive as a separate and recoverable operation.

## Result
Report: read sources, integrated fragments, omitted duplicates, open conflicts, changed files, verifications, and unexecuted operations.
