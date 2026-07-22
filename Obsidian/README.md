# Obsidian with Claude and Claude Code

An Obsidian vault is a folder of Markdown files plus an `.obsidian/` configuration directory. That makes it unusually friendly to coding agents: Claude Code can read, search, create, link, and reorganize notes using ordinary filesystem tools without requiring an Obsidian-specific API.

The safe model is simple: **Obsidian remains the knowledge interface; the Markdown files remain the source of truth; Claude works on a narrowly scoped copy or Git branch and proves exactly what changed.**

---

## What Obsidian Is

Obsidian stores notes as Markdown-formatted plain-text files inside a **vault**, which is an ordinary folder on the local filesystem. The vault also contains `.obsidian/`, where vault-specific settings, hotkeys, themes, and plugin configuration live. Because the notes are files, other editors and tools can modify them, and Obsidian refreshes its view when files change.

Useful native concepts:

| Concept | What it means | Agent implication |
|---|---|---|
| Vault | Root folder containing notes and configuration | Treat it as the agent's workspace boundary |
| Note | A Markdown file | Read and edit with normal file tools |
| Internal link | `[[Note]]` or a Markdown link | Preserve targets when renaming or generating notes |
| Backlink | A note that links to the current note | Useful for relationship discovery and orphan checks |
| Properties | YAML-compatible structured metadata | Gives agents stable fields for status, type, owner, and dates |
| Template | Reusable note structure | Constrains generated notes and reduces format drift |
| Base | A structured view over notes and properties | Makes consistent metadata more valuable |
| Canvas | Visual `.canvas` data | Treat as structured application data, not ordinary prose |

Official behavior checked on **July 22, 2026**. Recheck plugin and Sync behavior before automating a shared vault.

---

## Good Uses

- Turn meeting notes into decisions, actions, and linked project notes.
- Normalize properties and headings across a known folder.
- Create daily or weekly summaries from selected notes.
- Find orphaned, duplicate, stale, or weakly linked notes.
- Build maps of content that link related notes without moving everything.
- Convert research material into source-linked permanent notes.
- Maintain a changelog or documentation vault from a repository.
- Draft notes from a stable template and leave them for human review.

Avoid broad autonomous editing when:

- The vault mixes personal, medical, financial, customer, or company-confidential data.
- Sync or collaboration is active and concurrent edits are likely.
- Community plugins generate or rewrite files in ways you have not inspected.
- The request is subjective, such as “organize my whole brain.”
- There is no version history, Git repository, or reliable backup.

---

## Safe Setup

### 1. Back up or version the vault

Obsidian Sync includes version-history features, but Sync is not a substitute for reviewing an agent diff. For agent-assisted bulk work, use a test copy or Git repository when appropriate for the data.

```bash
cd /path/to/vault
git init
git add .
git commit -m "chore: baseline vault before agent edits"
```

Do not put confidential vault content in a remote Git host unless that storage is explicitly approved and protected.

### 2. Decide what belongs in Git

The `.obsidian` directory contains useful shared configuration and noisy per-user workspace state. Obsidian's documentation specifically notes that `workspace.json` and `workspaces.json` change as files are opened.

A common starting point:

```gitignore
.obsidian/workspace.json
.obsidian/workspaces.json
.trash/
```

Whether to commit plugin settings, themes, snippets, or the rest of `.obsidian/` is a team decision. Review each file rather than ignoring or committing the whole directory blindly.

### 3. Start Claude Code at the vault root

```bash
cd /path/to/vault
claude
```

Starting at the vault root makes the intended file boundary visible. Additional filesystem permissions should be exceptional and read-only where possible.

### 4. Add vault instructions

Create a `CLAUDE.md` in the vault root:

````md
# Vault Instructions

## Purpose
This vault stores engineering learning, project decisions, and meeting notes.

## Allowed edits
- `Inbox/`, `Projects/`, and `Permanent Notes/`
- Markdown notes only unless explicitly requested

## Never edit
- `.obsidian/`
- `Private/`
- attachments and `.canvas` files

## Note conventions
- Preserve existing meaning and author voice.
- Use `YYYY-MM-DD` dates.
- Use `[[wikilinks]]` for internal notes.
- Never invent sources, decisions, attendees, or completed tasks.
- Keep unknown property values empty rather than guessing.

## Required properties
```yaml
---
type:
status:
created:
updated:
sources: []
---
```

## Verification
- Report every changed, created, moved, and deleted file.
- Run the broken-link and property checks documented in this vault.
- Do not commit or sync changes without approval.
````

---

## Design a Stable Vault Schema

Agents work better with a small number of meaningful conventions than with a deep folder maze.

```text
Vault/
├── Inbox/
├── Daily/
├── Projects/
├── Areas/
├── Permanent Notes/
├── Sources/
├── Templates/
├── Attachments/
├── Archive/
├── Private/              # denied to agents by default
├── CLAUDE.md
└── .obsidian/
```

This is an example, not an Obsidian requirement. Use the smallest structure that matches how you retrieve knowledge.

### Properties

Prefer stable, typed fields:

```yaml
---
type: project
status: active
created: 2026-07-22
updated: 2026-07-22
owner: Qasim
aliases: []
tags:
  - engineering
sources:
  - "[[Source - Agent Orchestration]]"
---
```

Rules:

- Use one spelling and type for each property.
- Do not use properties as a dumping ground for prose.
- Quote internal links inside YAML when needed, such as `"[[Project Alpha]]"`.
- Separate source/provenance from topic tags.
- Never infer sensitive attributes from note text.

### Links

Obsidian supports both wikilinks and Markdown links. Pick one house style for generated content.

```md
Related: [[Agent Orchestration]]
Source: [[Building Effective Agents#Orchestrator-workers]]
Decision: [[2026-07-22 - Use deterministic routing first]]
```

Do not create links merely to make the graph dense. A link should state a useful relationship in surrounding prose.

---

## Practical Workflows

## Personal Knowledge Harness: LLM Wiki + Developer Second Brain

Roan Brasil Monteiro's May 2026 article, [“Building a Complete Personal Harness: LLM Wiki + Developer’s Second Brain in Obsidian”](https://medium.com/@roanmonteiro/building-a-complete-personal-harness-llm-wiki-developers-second-brain-in-obsidian-d7b61c7398ff), proposes combining two systems that are often built separately:

- **LLM Wiki:** ingests articles, papers, books, podcasts, transcripts, and other sources into linked concept knowledge.
- **Developer second brain:** preserves project state, architectural decisions, debriefs, reusable procedures, and lessons from completed work.

The combination matters. A source-only wiki remembers what other people wrote but not why your team chose an approach. A project-only journal remembers decisions but may lack the external evidence and concepts needed to challenge them.

### Four-layer architecture

```text
┌─────────────────────────────────────────────────────────┐
│ Control layer                                           │
│ CLAUDE.md · skills · schemas · permissions · verifiers  │
├──────────────────────────┬──────────────────────────────┤
│ LLM Wiki                 │ Developer second brain       │
│ concepts · entities      │ projects · ADRs · debriefs   │
│ comparisons · syntheses  │ runbooks · experiments       │
├──────────────────────────┴──────────────────────────────┤
│ Immutable source layer                                  │
│ articles · papers · transcripts · captures · citations  │
├─────────────────────────────────────────────────────────┤
│ Storage and recovery                                    │
│ Markdown vault · Git/backup · Obsidian · optional index │
└─────────────────────────────────────────────────────────┘
```

Keep the layers distinct. The agent may correct a generated concept page, but it must not silently rewrite the captured source to match its interpretation.

### Suggested vault layout

```text
Vault/
├── _inbox/                    # unprocessed captures
├── sources/                   # preserved source packets
│   ├── articles/
│   ├── papers/
│   ├── transcripts/
│   └── conversations/
├── wiki/
│   ├── concepts/
│   ├── entities/
│   ├── comparisons/
│   ├── syntheses/
│   └── index.md
├── engineering/
│   ├── projects/
│   ├── decisions/             # ADRs
│   ├── debriefs/
│   ├── runbooks/
│   └── experiments/
├── meta/
│   ├── schema.md
│   ├── ingest-log.md
│   ├── status.md
│   └── review-queue.md
├── templates/
├── attachments/
├── CLAUDE.md
└── .obsidian/
```

The prefixes are optional. The important boundary is semantic: raw/captured evidence, generated knowledge, lived project history, and system control should not collapse into one folder of indistinguishable notes.

### Source packet

Capture provenance before synthesis:

```yaml
---
type: source
source_id: src-2026-07-22-agent-orchestration
title: Building Effective Agents
author: Anthropic
source_url: https://www.anthropic.com/research/building-effective-agents
captured: 2026-07-22
published:
content_hash:
ingest_status: captured
---
```

A source packet should preserve enough original material or a stable reference to audit generated claims. Respect copyright and access restrictions: do not store or republish complete protected works merely because an agent can fetch them.

### Generated wiki page

```yaml
---
type: concept
status: reviewed
confidence: medium
created: 2026-07-22
updated: 2026-07-22
sources:
  - "[[src-2026-07-22-agent-orchestration]]"
related:
  - "[[Agent Handoff]]"
  - "[[Evaluator-Optimizer Loop]]"
---
```

Every factual section should remain traceable to source notes. Label inference, disagreement, and personal conclusions rather than blending them into sourced fact.

### Developer records

Use different contracts for different knowledge:

| Record | Answers | Required evidence |
|---|---|---|
| Project note | What is active, blocked, and next? | Repository, issue, owner, current state |
| ADR | What did we decide and why? | Context, options, decision, consequences, status |
| Debrief | What happened and what should change? | Timeline, outcomes, evidence, actions |
| Runbook | How do we perform/recover this operation? | Preconditions, commands, validation, rollback |
| Experiment | What hypothesis did we test? | Setup, baseline, result, limitations |

Do not let an agent infer an ADR from code and record it as an approved decision. It may draft a candidate marked `status: proposed` for human review.

### Command surface

The article's public example uses `/wiki-ingest <URL>` and `/wiki-query "..."`. A complete but still understandable command set might be:

| Command | Job | Default effect |
|---|---|---|
| `/wiki-ingest <source>` | Capture, classify, extract concepts, propose links | Draft source and wiki notes |
| `/wiki-query <question>` | Synthesize what the vault knows with note-level citations | Read-only answer |
| `/wiki-update <project>` | Refresh project state from approved evidence | Draft project-note changes |
| `/wiki-debrief <artifact>` | Turn a completed task or incident into lessons/actions | Draft debrief |
| `/wiki-lint` | Find broken links, missing provenance, schema drift, orphans | Read-only report |
| `/wiki-status` | Show pending inbox, review queue, stale pages, recent changes | Read-only report |

These commands are design examples, not built-in Obsidian or Claude Code commands. Implement them as reviewed skills only if the workflow repeats enough to justify automation.

### `/wiki-ingest` contract

```text
Ingest the supplied source into the vault.

1. Capture provenance and preserve the source/reference.
2. Search existing source and wiki notes before creating anything.
3. Extract claims, concepts, entities, methods, and open questions.
4. Decide separately for each concept: create, update, link, or skip.
5. Cite the source note for every factual addition.
6. Record contradictions rather than choosing a winner silently.
7. Add all proposed changes to the review queue.
8. Run wiki lint and report created/updated files.

Never:
- overwrite raw source material
- invent publication metadata
- convert inference into sourced fact
- delete an existing page because a new source disagrees
- publish or sync externally without approval
```

### `/wiki-query` contract

```text
Answer using the vault first.

Return:
- concise answer
- supporting note links
- source note links for factual claims
- disagreements or uncertainty
- knowledge gaps

Do not treat a generated wiki page as independent evidence.
If the vault cannot support the answer, say so before offering external research.
Do not write the answer back into the vault unless explicitly requested.
```

### Ingestion state machine

```text
captured → resolved → extracted → linked → review-needed → reviewed
    └─────────────── failed / blocked ─────────────────────┘
```

Track state in properties or a registry so interrupted work can resume without duplicating pages. Use a content hash or stable source ID for deduplication.

### Query and retrieval strategy

Start without a vector database:

1. Search titles, aliases, properties, tags, and exact text.
2. Read summaries and index pages.
3. Open full notes only when needed.
4. Trace claims back to sources.

Add semantic or hybrid retrieval only after measuring failures that exact search cannot solve. If an external index is added, record its corpus version and rebuild it after approved changes. Markdown remains the source of truth; the index is replaceable derived state.

### Health checks

`/wiki-lint` should separate deterministic checks from model judgment:

**Deterministic:**

- Broken internal links.
- Duplicate stable IDs.
- Missing required properties.
- Source references that do not exist.
- Inbox items stuck in a state beyond a threshold.
- Generated page changed without updating `updated` or review status.

**Advisory:**

- Possible contradictions.
- Pages covering the same concept.
- Weak or misleading links.
- Stale synthesis requiring new evidence.
- Important project lessons not yet generalized.

Never automatically “resolve” a contradiction by deleting one side.

### Compounding loop

```text
capture source
      ↓
extract and link knowledge
      ↓
apply knowledge during project work
      ↓
record decision, experiment, or debrief
      ↓
generalize reusable lesson back into wiki
      ↓
human review and future retrieval
```

The final arrow creates compounding value: lived experience can confirm, qualify, or contradict the imported knowledge. Keep the provenance chain so future readers can distinguish published claims from your own evidence.

### Measure whether the harness is useful

Track signals that reflect retrieval and reuse, not graph size:

- Percentage of generated claims with valid source links.
- Duplicate-page rate during ingestion.
- Query answers judged supported and useful.
- Time from capture to reviewed knowledge.
- ADR/debrief retrieval during later projects.
- Stale or unreviewed page count.
- Human edit/rejection rate.
- Cost per ingested source and useful query.
- Restore/rebuild success for derived indexes.

A vault with thousands of auto-generated pages and no reviewed reuse is content accumulation, not a knowledge harness.

### Rollout

1. Create the schema and three templates manually.
2. Ingest five representative sources into a disposable vault copy.
3. Review every generated claim and link.
4. Add read-only `/wiki-query` and test ten real questions.
5. Add lint/status reporting.
6. Add project updates and debrief drafts.
7. Automate only stable, reversible stages.
8. Keep external publishing and high-impact project decisions human-controlled.

Related open implementations can be useful references, but audit them before installation. For example, [Ar9av/obsidian-wiki](https://github.com/Ar9av/obsidian-wiki) demonstrates a multi-agent-compatible skill surface, tiered retrieval, lint/status operations, and optional local semantic search. It is independent of the Medium article and should be evaluated as third-party software.

---

### Inbox triage

```text
Review Markdown files in Inbox/ only.
For each note:
- identify whether it is a project update, source note, permanent note, or task
- propose a destination and links
- flag missing source or ambiguous ownership

Do not move or edit anything yet. Return a review table.
```

After approval:

```text
Apply only the approved Inbox triage decisions.
Preserve original text under an "Original capture" heading when summarizing.
Report moved files and links added. Do not touch .obsidian or Private/.
```

### Meeting-note extraction

```text
Process Projects/Alpha/Meetings/2026-07-22.md.
Extract only explicitly supported:
- decisions
- action items with owner and due date
- open questions
- links to existing project notes

Do not infer agreement or assign an owner not named in the note.
Show the proposed edit before applying it.
```

### Research synthesis

Use separate artifacts:

```text
source note → atomic claims with citations → synthesis note → index/map note
```

Require every factual claim in a permanent note to point to a source note or external citation. Preserve uncertainty and disagreement instead of flattening sources into one confident summary.

### Vault audit

```text
Audit Projects/ and Permanent Notes/ without editing.
Report:
- Markdown links or wikilinks whose target cannot be found
- notes missing required properties
- duplicate titles or aliases
- files not modified in 12 months, without declaring them obsolete
- orphan notes with no incoming or outgoing links
- links to Private/ from non-private notes

Separate deterministic findings from recommendations.
```

---

## Bulk Change Workflow

1. Define allowed paths, note types, and exact transformation.
2. Make a backup, branch, or disposable vault copy.
3. Run a dry audit and save the proposed file list.
4. Manually review representative notes and edge cases.
5. Apply one small batch.
6. Inspect `git diff --stat`, `git diff --name-status`, and the full diff.
7. Open Obsidian and verify properties, links, backlinks, and rendering.
8. Continue in bounded batches.
9. Commit only after human approval.

Do not combine renaming, metadata migration, summarization, and folder reorganization in one pass. Separate transformations make mistakes reversible.

---

## Security and Privacy

- A local-first file format does not make every tool local. Model calls, plugins, Sync, Git remotes, and integrations may transmit content.
- Do not send an entire vault to an external model merely because the CLI can read it.
- Deny sensitive folders and attachments by default.
- Use narrow prompts and explicit paths.
- Treat imported web clips and external notes as untrusted content that may contain prompt injection.
- Inspect community plugins before installation; they execute code with access to the vault and application environment.
- Keep secrets, recovery codes, private keys, and raw credentials out of notes.
- Review deletion and rename operations separately from content edits.
- Test restore procedures before large transformations.

---

## Common Mistakes

| Mistake | Better approach |
|---|---|
| “Organize my vault” | Audit first; approve a written taxonomy and bounded batch |
| Automatically linking every matching phrase | Link only meaningful concepts and review ambiguous titles |
| Letting Claude rewrite personal notes for style | Preserve voice; add a separate summary |
| Treating tags, folders, and links as interchangeable | Give each a defined retrieval job |
| Editing `.obsidian/` during note cleanup | Scope configuration separately |
| Renaming hundreds of notes at once | Produce rename map, test a batch, verify backlinks |
| Trusting Sync as the only recovery plan | Use version history plus a tested backup/versioning strategy |
| Installing an AI plugin without review | Audit permissions, network calls, storage, prompts, and maintenance |

---

## Checklist

- [ ] Vault purpose and allowed paths are documented.
- [ ] Sensitive folders are denied by default.
- [ ] Backup or version history has been tested.
- [ ] `CLAUDE.md` records schema, link style, and non-invention rules.
- [ ] Properties have stable names and types.
- [ ] Bulk work starts with a dry audit and bounded batch.
- [ ] All created, edited, moved, and deleted files are reported.
- [ ] Links and rendering are checked inside Obsidian.
- [ ] `.obsidian/`, plugins, Sync, and Git are reviewed as separate trust boundaries.
- [ ] Human approval precedes commit, sync-sensitive changes, or publication.

## Sources and Further Reading

- [How Obsidian stores data](https://obsidian.md/help/data-storage)
- [Obsidian internal links](https://obsidian.md/help/links)
- [Obsidian properties](https://obsidian.md/help/properties)
- [Obsidian Sync version history](https://obsidian.md/help/sync/version-history)
- [Official Obsidian Help repository](https://github.com/obsidianmd/obsidian-help)

## See Also

- [`../Memory and Context/`](../Memory%20and%20Context/)
- [`../Security Guardrails/`](../Security%20Guardrails/)
- [`../Git and PR Workflow/`](../Git%20and%20PR%20Workflow/)
- [`../Scope Creep Detection/`](../Scope%20Creep%20Detection/)
