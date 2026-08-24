---
name: socdepoble-sociologia-whatsapp
lang: en
description: "Designs WhatsApp-first transparent, consented and idempotent flows for lists and community coordination. Use when a task should remain inside WhatsApp."
triggers_ca: ["sociologia", "whatsapp", "bot", "llistes", "grup"]
triggers_en: ["whatsapp flow", "whatsapp lists"]
version: 2.0.0
status: canonic
abast: ["global"]
---

# WhatsApp-first with consent (WhatsApp Sociology)

## Principle
Reduce friction without hiding data processing. The bot only processes messages explicitly directed to it, documented commands, or groups with visible activation and notice. It does not ingest the general history nor "centralize secretly" (fictitious privacy).

## Flow
1. Normalize message, conversation, actor, and source identifier.
2. Verify tenant, consent, role, activation, and limits before persisting (Authorization occurs before persistence).
3. Interpret deterministic commands (`!apunta`, `!baixa`, `!llista`, `!ajuda`).
4. If the language is ambiguous, create a structured proposal (no DB write) and ask for confirmation.
5. Write with an idempotency key and save the response in a durable outbox.
6. Confirm the real enum: `PENDING`, `CONFIRMED`, `REJECTED`, or `CANCELLED`.

## Data and Routes (Very Important)
Keep only necessary fields, with configurable retention, access, and deletion. Do not publish phone numbers or private information in summaries. Offer `!privacitat` and `!baixa`. Administrative actions require a verified role and remain audited. The `DEFAULT_USER_ID = 'foraster'` cannot be shared between different users for writes.

**STRICT PROHIBITION:** NEVER, under any circumstances, can the record, dump, extract, or log of a WhatsApp chat be saved inside the Wiki (`_wiki_de_poble`). Any output, sociological research, marketing, or chat related to WhatsApp MUST be mandatorily routed to the `../../_comunicacio_de_poble` folder (at the root of the Som de Poble project).

## Experience
The main interface can be the chat. Links are optional, not mandatory. Summaries have configurable frequency and only show authorized data.
