---
name: socdepoble-workflow
lang: en
description: "Enforces strict agent workflow, file routing, path management, and thermodynamic naming conventions for the socdepoble.org ecosystem."
triggers_ca: ["escriptori", "petorreta", "acta", "flux", "rutes"]
triggers_en: ["workflow", "path", "file routing"]
version: 3.0.0
status: canonic
abast: ["global"]
---

## Core Concepts

**Workspace Anchor**: Discover the project root with `git rev-parse --show-toplevel`, canonicalize it with `realpath`, and anchor every operation there. The old workspace (`Sóc de Poble`) is strictly READ-ONLY.

**Directory Mapping**:
- `.agents/`: The **Genotype**. Contains immutable rules, architecture guidelines, and skills.
- `_wiki_de_poble/05_Escriptori_Soc_de_Poble/`: The **Active Workspace (Workbench)**. Editorial temporary work, daily actas, and ordinary petorretas are created here before being resolved.
  - **`produccio/` (subfolder)**: Active non-markdown assets (HTML exports, active images, temporary designs) that are currently in use MUST be kept here, NOT deleted. When cleaning the Inbox (`00_Bandeja_d_Entrada`), move active files here instead of erasing them.
- `.sdp-reflex/bootstrap/<sessionId>/`: Machine-only pre-lease bootstrap reserved by `open`. Its exact Petorreta + manifest pair is the sole routing exception and never enters the Wiki.
- `_wiki_de_poble/04_ARXIU_Documents_Historics/`: Curated historical knowledge (synthesized and distilled) that must remain visible in active memory.
- `_arxiu_wiki_de_poble/` beside the repository: **The Cold Archive**. Use this for human-custodied bulk acts, Mega-Petorretas, forensic bundles, and heavy raw history. Whenever the active Brain accumulates too much historical weight, you MUST synthesize the learnings into a single General Act inside `_wiki_de_poble`, and move the heavy original files here to keep the active Brain light and fast.
- `_comunicacio_de_poble/` beside the repository: Investigation, communication, marketing, and sociology (e.g. WhatsApp chats). WhatsApp chats must NEVER enter `_wiki_de_poble`. **AI PERMISSION**: The AI has explicit read/write permission to manage files and folders here.
- `_gestoria_de_poble/` beside the repository: Financial, administrative, legal, and bureaucratic data. **AI PERMISSION**: The AI has explicit read/write permission to manage files and folders here.
- `.gemini/antigravity-ide/brain/`: The **Machine Unconscious**. Contains IDE logs and recordings. **PROHIBITED FOR USER FILES**: Never save prompts, artifacts, or documents here that you want the human user to open or upload to the web. Always save user-facing files to `05_Escriptori_Soc_de_Poble` following the Thermodynamic Naming Convention.

**AI WORKSPACE PERMISSION**: The AI is fully authorized to navigate, read, and write across ALL root directories of the project (`_wiki_de_poble`, `_arxiu_wiki_de_poble`, `_comunicacio_de_poble`, `_gestoria_de_poble`, `_multimedia_de_poble`, etc.) to effectively route documentation to its correct functional warehouse. There is no sandbox restricting the AI to `_wiki_de_poble`.

## Universal Language Policy
- **Skills (`.agents/skills/*/SKILL.md`)**: `lang: en` by default. English is the optimal lingua franca for LLM parsing of technical constructs.
- **Wiki (all `_wiki_de_poble/`)**: `lang: ca` (Valencian). The language of the town.
- **Source Code**: English for variables and comments.
- **Exceptions**: Spanish is permitted in direct quotes, proper nouns, and universal technical terms without forced translation.

## Workflow Patterns

### 1. File Creation & Routing (Avoid Orphan Nodes)
When the user asks to create an "Acta" or "Petorreta":
1. **Mandatory Preflight**: Any skill or script that can write must start by executing the reflex preflight:
   `node tooling/wiki/reflex_petorreta.mjs open --intent "..." --risk high|medium --ops "create,write,move" --scopes "05_Escriptori_Soc_de_Poble,src/..."`
2. Read the rules it prints **entirely**. Only after this can you create the Petorreta and manifest exclusively inside the reserved `.sdp-reflex/bootstrap/<sessionId>/` directory.
3. After creation and approval, execute `seal` to obtain the lease receipt and consume it in every mutating script.
4. **NO ORPHANS (CRITICAL)**: Obsidian relies on a connected graph. Every new Markdown file MUST have bi-directional links:
   - **Incoming Link**: Immediately after creating the file, you MUST edit the corresponding Index file (e.g., `00_INDEX_ESCRIPTORI.md`) and add a wikilink to the new file.
   - **Outbound Link (Anchor)**: The new file itself MUST contain a footer explaining its context, typically pointing back to the index: `--- \n **Ancoratge de Seguretat:** [[00_INDEX_ESCRIPTORI]]`. 
   A file created without both incoming and outbound links is a "dead node" in the Obsidian graph and is considered a failure.

### 2. Thermodynamic Naming Convention
**CRITICAL**: Every generated Acta, report, audit or Petorreta in `05_Escriptori` must follow the Thermodynamic Naming Pattern exactly.
Format: `YYMMDD_HHMM_CATEGORY_Descriptive_Title_of_Eight_to_Twelve_Words.md`
- `YYMMDD_HHMM`: Timestamp (e.g., `260714_1106`).
- **`CATEGORY`** (MANDATORY): Use one category accepted by `tooling/wiki/schema.json` (e.g., `PROMPT`, `ACTA`, `INFORME`).
- `Descriptive_Title`: The title MUST be descriptive, spanning between **8 and 12 words**. Short titles are strictly prohibited. 

### 3. Creating a Petorreta and Bundles
A Petorreta is an audit prompt intended for external LLMs (Claude, GPT).
- **GREETING THE CONSELL (CRITICAL)**: When creating a Petorreta, you MUST explicitly address the entire "Consell d'Intel·ligències" in the greeting.
- **CMD+A FRIENDLY BUT CANONICAL**: An ordinary Petorreta MUST contain the canonical YAML frontmatter validated by the schema. The user can still Cmd+A it.
- **DEFAULT = MEGA BUNDLE (CRITICAL)**: When a Petorreta involves auditing, fixing, or improving code, you MUST AUTOMATICALLY gather ALL relevant files (React, CSS, HTML, scripts) and the complete Global Context into a single file. 
- **LA CANONADA (MANDATORY)**: You MUST NEVER use `fs.writeFileSync` directly or rely on `process.cwd()` to generate bundles, prompts, or actas. You MUST ALWAYS import and use `06_EINES/canonada.mjs`. 
  - Generator scripts can only write through `escriu()` and resolve paths with `resol()`.
  - The only destination for Prompts and Bundles is the Escriptori. If you attempt to write to the root or convenient folders, the system will fail closed.
  - The `empaqueta()` function from `canonada.mjs` automatically blocks binary files like `.woff2` or large archives that corrupt context. Exclusively use this function to generate bundles.

### 4. Mandatory Mental Check (Before Mutating)
Before any mutation, as an agent, **you must ask yourself these questions out loud (in the thought process)**:
"What is the lease? What is the exact scope? What is the snapshot? Is there a one-time claim?"
If you do not have a clear answer, DO NOT WRITE. Reading/diagnosing is free; mutating is expensive and restricted.

### 5. Universal Deletion, Inbox & Archival Policy
1. **Grade 0 (Inbox to Production)**: When cleaning the Inbox (`00_Bandeja_d_Entrada`), DO NOT permanently delete files blindly. Any file that represents active work MUST be moved to `05_Escriptori_Soc_de_Poble/produccio/` to keep the workflow fluid.
2. **Grade 1 (Reflex Quarantine)**: Redundant/obsolete documents -> Move to quarantine, 90 days, recoverable.
3. **Grade 2 (Tombstone & Cold Archive)**: Obsolete/Heavy historical documents -> Synthesize their knowledge into a single summarized file in the active Wiki (Brain), and MOVE the raw files to the external `_arxiu_wiki_de_poble/` vault.
4. **Grade 3 (Definitive Deletion)**: IRREVERSIBLE. Only with 2 human receipts + Reflex. Never use `rm -rf` on active user files without explicit double confirmation.
"Nothing is ever deleted" means we preserve history in the Cold Archive (`_arxiu_wiki_de_poble`) or keep active files in `produccio/`.

### 6. Receiving Council Audits (El Consell)
- **DO NOT EXECUTE CHANGES YET**: Wait until the user has provided ALL opinions from the Council.
- **ONLY TAKE NOTES**: Update an Acta in `05_Escriptori_Soc_de_Poble` to synthesize feedback.

### 7. Architectural Cleanup & Index Maintenance
- **AUTOMATIC INDEX UPDATES (CRITICAL)**: When performing architectural cleanup, moving files, or deleting files, you MUST automatically find and update all index files (or other files) that link to the affected files.
- If a file is moved, update its links to point to the new location.
- If a file is deleted or archived, remove its links from active indexes to prevent ghost links.

### 8. Bundling and Encapsulation of Pedra Seca (Shadow DOM)
When compiling and integrating components (like `PedraSecaEmbed`) in corporate environments (React/Next.js):
- **CSS Isolation**: You must use Shadow DOM (`mode: 'open'`) and inject CSS manually at the root (`index.css?inline`) to prevent leaks, along with prefixes to ensure CSS variables if applicable.
- **Global Variables and Scope**: STRICTLY PROHIBITED to use singletons or global variables at the module level (e.g., `let state = ...`) that depend on configuration (like `SUPABASE_URL`). Since the host can instantiate, unmount, or alter the configuration dynamically, any context data must be resolved on every call with `getResolvedConfig(config)`.
- **Lifecycle and AbortSignal**: Asynchronous requests and listeners must be cancelable via `AbortController` in the `disconnectedCallback` or `useEffect` return to prevent memory leaks in modern SPAs.
- **Full Bundle Audits**: When creating a "Super Petorreta" to audit encapsulated architecture, the directory must be included recursively (all `src/`) so the Council can detect cross-dependencies, scope errors, and camouflaged global variables.

## Strict Constraints & Prohibitions

1. **RELATIVE PATHS RULE**: 
   - **PROHIBITED**: `cp ./file.txt ../folder/` in shell/file operations. Use absolute paths.
   - **PERMITTED**: Relative paths inside source code imports (e.g., `import ./utils`) or in manifests preceded by `$PROJECT_ROOT`. Do NOT try to "fix" relative imports in the frontend.
2. **NEVER ASSUME DIRECTORIES**: Always run a directory listing command before writing a new file to verify the target directory exists and is writable.
3. **NO SHORT EVENT NAMES**: An Acta/Petorreta/report created in `05_Escriptori` needs 8–12 descriptive words.

## Troubleshooting

- **EACCES (Permission Denied)**: If you receive a permission error writing to `_wiki_de_poble`, the folder may be locked. Use the `ask_permission` tool or unlock the directory temporarily.
- **Lost Files**: If the user cannot see a file you created, you likely wrote it to the old workspace due to relative pathing. Delete it and recreate it in the correct absolute path.

### Language and Transparency
Valencian is the default vehicular language (unless the Master changes to another out of necessity). Be completely transparent: do not hide your mental processes if they affect the system.
