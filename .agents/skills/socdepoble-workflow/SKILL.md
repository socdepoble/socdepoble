---
name: socdepoble-workflow
description: Enforces strict agent workflow, file routing, path management, and thermodynamic naming conventions for the socdepoble.org ecosystem. Use when creating actas, petorretas, or writing any workspace files to avoid Amnesia and Path Errors.
---

## Core Concepts

**Workspace Anchor**: Discover the project root with `git rev-parse --show-toplevel`, canonicalize it with `realpath`, and anchor every operation there. On the current workstation that resolves to `/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/`; this example is not a portable identity. The old workspace (`Sóc de Poble`) is strictly READ-ONLY and should not be modified.

**Directory Mapping**:
- `.agents/`: The **Genotype**. Contains immutable rules, architecture guidelines, and skills.
- `_wiki_de_poble/05_Escriptori_Soc_de_Poble/`: The **Active Workspace (Taula de Treball)**. Editorial temporary work, daily actas, and ordinary petorretas are created here before being resolved.
- `.sdp-reflex/bootstrap/<sessionId>/`: Machine-only pre-lease bootstrap reserved by `open`. Its exact Petorreta + manifest pair is the sole routing exception and never enters the Wiki.
- `_wiki_de_poble/04_ARXIU_Documents_Historics/`: Curated historical knowledge that must remain visible in Obsidian.
- `_arxiu_wiki_de_poble/` beside the repository: human-custodied bulk acts, Mega-Petorretas and forensic bundles. Agents may diagnose it read-only, but MUST NOT create, edit, move, delete or use it as a Reflex source/target until that sibling has its own repository and Reflex. Never widen a scope with `..`.
- `.gemini/antigravity-ide/brain/`: The **Machine Unconscious**. Contains IDE logs and recordings. Do not store project code or actas here.

## Workflow Patterns

### 1. File Creation & Routing
When the user asks to create an "Acta" or "Petorreta":
1. Resolve the repository root and verify the absolute target visually before writing.
2. Route an editorial file strictly to `_wiki_de_poble/05_Escriptori_Soc_de_Poble/` (if it is a current work item) or the appropriate wiki folder. If it is the Reflex handshake Petorreta, use only the exact `.sdp-reflex/bootstrap/<sessionId>/` path printed by `open`.
3. Before any write, follow `.agents/PROTOCOL_PETORRETA.md`: `open` does not authorize mutation; `seal` produces the required lease.

### 2. Thermodynamic Naming Convention
**CRITICAL**: Every generated Acta, report, audit or Petorreta in `05_Escriptori` must follow the Thermodynamic Naming Pattern exactly. Stable code/docs and canonical Wiki pages are not renamed mechanically by this rule.
Format: `YYMMDD_HHMM_CATEGORY_Descriptive_Title_of_Eight_to_Twelve_Words.md`
- `YYMMDD_HHMM`: Timestamp (e.g., `260714_1106`).
- **`CATEGORY`** (MANDATORY): Use one category accepted by `lib/termodinamic.mjs`. A Petorreta uses category `PROMPT` and frontmatter `tipus: petorreta`.
- `Descriptive_Title`: The title MUST be descriptive, spanning between **8 and 12 words**. Short titles are strictly prohibited. (e.g., `Explicacio_del_Flux_Cognitiu_i_Prevencio_de_Errors_de_Rutes_en_IA.md`).

### 3. Creating a Petorreta
A Petorreta is an audit prompt intended for external LLMs (Claude, GPT).
- **RELEVANT, VERIFIABLE CONTEXT**: Never bundle the entire Wiki by default. Create a selective context manifest containing only relevant sources, reasons, classifications and roles. The Reflex accepts at most 25 text sources, 2 MiB per file and 8 MiB total; it hashes them and rejects binaries, duplicates, symlink escapes and basic secret/IBAN/email/DNI/phone patterns. These patterns do not replace human privacy review. If an external LLM needs source text, generate a redacted annex from that manifest, not a blind vault dump.
- Include the exact session, intent, rules and plan hashes emitted by the Reflex.
- An ordinary editorial Petorreta MUST be saved using the Thermodynamic Naming Pattern in `05_Escriptori_Soc_de_Poble`.
- The Reflex handshake Petorreta MUST instead be one of exactly two regular direct children (Petorreta + manifest) in the reserved `.sdp-reflex/bootstrap/<sessionId>/`; it is machine state, not Wiki content. Its targets, unlike the bootstrap files, must remain inside the declared scopes.

### 4. Workspace Maintenance & Cleaning
When instructed to "clean the desktop" or "organize documentation", strictly enforce the following:
1. **Identify Anomalies:** Actively look for out-of-place folders (e.g., `src`, `docs`, `supabase`, `app`) or root-level files that were accidentally created inside `_wiki_de_poble` or `_wiki_de_poble/05_Escriptori_Soc_de_Poble`.
2. **Purge Garbage:** Delete these anomalous folders and files. `05_Escriptori_Soc_de_Poble` should ONLY contain valid Actas/Petorretas following the Thermodynamic Naming Pattern.
3. **Preserve Curated Archives (CRITICAL):** The `CEEC` folder and other external archives have been moved by the human user to the external sibling directory `_arxiu_wiki_de_poble/`. NEVER delete, move, or alter the `CEEC` folder or any other content inside `_arxiu_wiki_de_poble/`. It is a safe haven for human-curated bulk documents.

## Strict Constraints & Prohibitions

1. **NEVER USE RELATIVE PATHS FOR FILE OPERATIONS**: `cp ./file.txt ../folder/` is strictly prohibited. Use full, absolute paths for shell/file operations. Repo-relative identifiers remain valid inside Git, manifests and documentation when their parser anchors them to the verified project root.
2. **NEVER ASSUME DIRECTORIES**: Always run a directory listing command (`ls -la /absolute/path`) before writing a new file to verify the target directory exists and is writable.
3. **NO SHORT EVENT NAMES**: An Acta/Petorreta/report created in `05_Escriptori` needs 8–12 descriptive words. This does not apply to source files, README, SKILL, indexes or stable canonical notes.
4. **NO SPANISH IN WIKI CONTENT**: The internal content of the project (actas, UI, text) must be strictly in Valencian (Catalan). This English skill file is an exception solely for optimal LLM parsing of constraints.

## Troubleshooting

- **EACCES (Permission Denied)**: If you receive a permission error writing to `_wiki_de_poble`, the folder may be locked (`dr-xr-xr-x`). Do NOT silently write the file to the root directory. Instead, use the `ask_permission` tool or unlock the directory temporarily, write the file, and lock it again.
- **Lost Files**: If the user cannot see a file you created, you likely wrote it to the old `Sóc de Poble` workspace due to relative pathing. Immediately locate the file, delete it from the old workspace, and recreate it in the correct `Som de Poble/socdepoble.org` absolute path.
