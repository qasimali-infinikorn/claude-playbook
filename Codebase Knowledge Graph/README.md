# Codebase Knowledge Graph

Every agent session that starts by globbing the repo, reading twenty files, and rebuilding the same mental model is paying for exploration that was already done last week. A codebase knowledge graph caches that exploration as committed Markdown: one document per module, service, data model, decision, or runbook, cross-linked, and kept honest by automation rather than goodwill.

The hard part is not writing the first version. It is keeping a thousand-document graph accurate while a team ships forty commits a day. A graph that silently rots is worse than no graph, because agents trust it.

This guide uses the **Open Knowledge Format (OKF)** as the on-disk contract, and describes the commit-triggered pipeline that keeps it fresh.

> Research note (28 July 2026): prompted by Udaykiran Estari's July 2026 article, [“Stop Wasting LLM Tokens: Building a Self-Updating Codebase Knowledge Graph with OKF”](https://medium.com/@UdaykiranEstari/stop-wasting-llm-tokens-building-a-self-updating-codebase-knowledge-graph-with-okf-20284060c1b1). The article proposes the idea but ships no format details or working code; every field name, filename convention, and conformance rule below is taken from the [OKF specification](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md) itself. The pipeline design, resolver code, and lint gates are this playbook's, not the article's or the spec's.

---

## What OKF Is

OKF is an open, vendor-neutral specification from Google Cloud for representing curated knowledge that AI systems consume. v0.1 was announced on 2026-06-12 by Sam McVeety and Amir Hormati of the Google Cloud Data team; the specification in the public `GoogleCloudPlatform/knowledge-catalog` repository is at v0.2 as of this writing, under Apache 2.0.

The whole format is:

- A directory of Markdown files with YAML frontmatter (an OKF **bundle**).
- `type` is the only always-required key. A document carrying nothing but `type` is fully conformant.
- Cross-links between documents form the graph.
- No schema registry, no central authority, no required SDK or runtime.

That minimalism is the point: the files stay readable with `cat`, render on GitHub, diff in a pull request, and are consumed by a model verbatim without a parsing step.

### Reserved filenames

| Filename | Purpose |
|---|---|
| `index.md` | Directory listing, for progressive disclosure |
| `log.md` | Chronological history of updates, newest first |

Neither may be used for a regular concept document. `index.md` at the bundle root is the only index file permitted to carry frontmatter, where `okf_version: "0.2"` declares the target version.

### Frontmatter fields worth using

| Field | Required | Meaning |
|---|---|---|
| `type` | Yes | Short string naming the concept kind — `Module`, `Runbook`, `Decision` |
| `title` | Recommended | Display name |
| `description` | Recommended | Single-sentence summary |
| `resource` | Recommended | Canonical URI for the underlying asset |
| `tags` | Recommended | List of categorization strings |
| `sources` | Optional | Provenance entries with `id`, `resource`, `title`, `last_modified` |
| `generated` | Optional | `{ by: <actor>, at: <timestamp> }` — who produced this document |
| `verified` | Optional | List of `{ by: <actor>, at: <timestamp> }` confirmations |
| `status` | Optional | `draft` \| `stable` \| `deprecated` |
| `stale_after` | Optional | `YYYY-MM-DD` after which the document should be re-checked |

Actors in `generated.by` and `verified[].by` use three forms: `<producer>/<version>` for agents (`claude-code/opus-5`), `human:<id>` for people (`human:qasim`), and `process:<id>` for automation (`process:okf-nightly`).

### Conformance in one line

A bundle conforms if every non-reserved `.md` file has parseable frontmatter containing a non-empty `type`, and reserved filenames follow their structures. Consumers **must not** reject a bundle for missing optional fields, unknown types, unknown keys, or broken links.

That last clause matters for a self-updating graph: a half-migrated bundle is still a valid bundle, so you can roll this out incrementally instead of big-bang.

---

## Why a Codebase Graph Is Not a Source Wiki

[`../Obsidian/`](../Obsidian/) describes the LLM-wiki pattern: capture external sources, synthesize concepts, keep a developer second brain. OKF formalizes that same pattern into an interoperable spec. But a codebase graph inverts two properties:

| | Source wiki | Codebase graph |
|---|---|---|
| Corpus | External articles, papers, transcripts | Your own source tree |
| Update trigger | Human decides to ingest something | Every merged commit |
| Ground truth | The captured source packet | The code, always |
| Failure mode | Stale synthesis, missed evidence | Confidently describing code that no longer exists |
| Contradiction rule | Record both sides, never auto-resolve | Code wins, immediately and silently |

The second column is why automation is mandatory here and optional there. Nobody merges forty new research papers a day.

---

## Concept Types for a Codebase

Start with these; add types when a real query needs one, not preemptively.

| `type` | Owns | `resource` points at |
|---|---|---|
| `Module` | A cohesive unit of code and its invariants | A directory |
| `Service` | A deployable, its dependencies and endpoints | A directory or manifest |
| `Data Model` | A table, schema, or core domain entity | A migration, model file, or schema |
| `Entry Point` | A CLI, job, route table, or queue consumer | A file |
| `Decision` | An ADR — context, options, consequences | The ADR source, if kept separately |
| `Convention` | A house rule with its rationale | A linter config, or nothing |
| `Runbook` | How to perform or recover an operation | A script |
| `Attested Computation` | A sanctioned, runnable command | A script under `references/` |

Granularity is the whole game. One concept per source file produces a graph as expensive to read as the code it describes. Aim for one per module, service, or bounded context, and cap bodies at roughly 200–400 lines.

---

## Bundle Layout

```text
knowledge/                     # the OKF bundle, committed beside the code
├── index.md                   # okf_version lives here (root index only)
├── log.md
├── modules/
│   ├── index.md
│   ├── payments-ledger.md
│   └── auth-session.md
├── services/
│   ├── index.md
│   └── checkout-api.md
├── models/
├── decisions/                 # ADRs
├── conventions/               # the rules CLAUDE.md keeps repeating
├── runbooks/
└── references/                # mirrors external material and runnable code
    ├── computations/
    │   └── ledger-tests.sh
    └── skills/
        └── run-pytest.md
```

`references/` is an OKF convention: external material, run instructions, and code are mirrored there as first-class concepts rather than pasted into prose.

---

## Anatomy of a Concept Document

```markdown
---
type: Module
title: Payments Ledger
description: Double-entry ledger recording every money movement.
resource: src/payments/ledger/
tags: [payments, core, money]
sources:
  - id: ledger-src
    resource: src/payments/ledger/
    title: src/payments/ledger (18 files)
    last_modified: 2026-07-24
generated: { by: claude-code/opus-5, at: 2026-07-24T11:02:00Z }
verified:
  - { by: human:qasim, at: 2026-07-25T09:30:00Z }
status: stable
stale_after: 2026-10-24
---

# Responsibility

Owns the append-only ledger. Nothing else in the repo may write `ledger_entries`.

# Public surface

- `post_entry(txn)` — the only write path. See [entry model](/models/ledger-entry.md).
- `balance_at(account, ts)` — replays entries; see gotchas before using in a request path.

# Invariants

- Entries are immutable; corrections are compensating entries.[^adr-014]
- Every posting balances to zero across accounts.

# Depends on

[Postgres pool](/references/db-pool.md) · [Auth session](/modules/auth-session.md)

# Depended on by

[Checkout API](/services/checkout-api.md) · [Nightly reconciliation](/runbooks/reconcile.md)

# Gotchas

`balance_at` has no snapshotting — it degrades past roughly 100k entries per account.

# Verification

[Ledger test suite](/references/computations/ledger-tests.md)

[^adr-014]: [ADR-014 immutable ledger](/decisions/014-immutable-ledger.md)
```

Two conventions in use above:

- **Bundle-relative links** begin with `/` and are recommended over `./` relative paths — they survive a document being moved between directories.
- **Per-claim attribution** uses Markdown footnotes keyed to a `sources[].id`, so a specific sentence is traceable rather than the document as a whole.

`# Schema` and `# Examples` are conventional body headings with defined meaning in the spec; use them for `Data Model` concepts.

---

## Attested Computations

The underrated type for a codebase. It converts "how do I check this module still works" from prose an agent must interpret into a sanctioned command with a declared receipt.

```markdown
---
type: Attested Computation
title: Ledger test suite
description: Runs the ledger unit and property tests.
runtime: python
parameters:
  - { name: k, type: string, required: false }
computation: references/computations/ledger-tests.sh
executor:
  resource: references/skills/run-pytest.md
  receipt: [command, exit_code, failed_tests]
---
```

The computation lives either at the `computation` path or inline in a `# Computation` fence in the body. `runtime` is required, and the spec's enumeration is data-platform oriented (`bigquery`, `postgres`, `dbt`, `python`, `Looker`) — `python` covers most test runners, and consumers must tolerate unknown values, so a `runtime: node` extension is safe if slightly off-spec.

The payoff: an agent asked to verify a change reads one document and runs the blessed command, instead of inventing a `pytest` invocation that half-works.

---

## The `resource` Join Key

This is the mechanism that makes "self-updating" mechanical rather than magical.

Because every concept declares the path it describes, the set of documents invalidated by a commit is a set operation, not a judgment call:

```text
git diff --name-only  →  changed paths  →  longest-prefix match on resource:  →  dirty concepts
                                        └→  no match  →  orphan (code owned by nobody)
```

No model is asked "which docs might be stale?" — a question models answer with plausible-sounding guesses. The resolver:

```python
#!/usr/bin/env python3
"""Map changed source paths to the OKF concepts that own them.

Usage:  git diff --name-only HEAD~1 | tools/okf_dirty.py
"""
import json
import pathlib
import sys

import yaml

BUNDLE = pathlib.Path("knowledge")
RESERVED = {"index.md", "log.md"}


def load_concepts():
    """Return [(concept_path, resource_prefix)] for concepts declaring a resource."""
    concepts = []
    for path in BUNDLE.rglob("*.md"):
        if path.name in RESERVED:
            continue
        text = path.read_text(encoding="utf-8")
        if not text.startswith("---"):
            continue  # non-conformant; the linter reports it separately
        front = yaml.safe_load(text.split("---", 2)[1]) or {}
        resource = front.get("resource")
        if resource:
            concepts.append((path, str(resource).rstrip("/")))
    return concepts


def resolve(changed, concepts):
    dirty, covered = set(), set()
    for f in changed:
        matches = [(len(res), p) for p, res in concepts if f == res or f.startswith(res + "/")]
        if matches:
            dirty.add(str(max(matches)[1]))  # longest prefix wins
            covered.add(f)
    return sorted(dirty), sorted(set(changed) - covered)


if __name__ == "__main__":
    changed = [line.strip() for line in sys.stdin if line.strip()]
    dirty, orphans = resolve(changed, load_concepts())
    json.dump({"dirty": dirty, "orphans": orphans}, sys.stdout, indent=2)
```

Orphans are as valuable as dirty concepts: they are the coverage gap, reported continuously instead of discovered during an audit.

---

## The Self-Updating Pipeline

Four stages. The tempting design — run the enrichment agent on `pre-commit` — adds seconds to minutes to every commit and will be `--no-verify`'d out of existence within a week. Split cheap bookkeeping from expensive generation.

| Stage | Where | Cost | Job |
|---|---|---|---|
| 1. Record | `post-commit` hook | Milliseconds, no model | Append changed paths to a queue |
| 2. Resolve | Start of stage 3 | Milliseconds, no model | Queue → dirty concepts + orphans |
| 3. Enrich | CI on merge to `main`, or scheduled local run | Model call per dirty concept | Rewrite bodies, update frontmatter, indexes, log |
| 4. Gate | CI on every PR | Milliseconds, no model | Fail or warn on the deterministic checks below |

### Stage 1 — record

```bash
#!/usr/bin/env bash
# .githooks/post-commit — install with: git config core.hooksPath .githooks
set -euo pipefail
mkdir -p .okf/queue
git diff-tree --no-commit-id --name-only -r HEAD >> .okf/queue/pending
```

Keep `.okf/` in `.gitignore`. It is local scratch state, not shared truth.

### Stage 3 — enrich

For each dirty concept, the writing agent gets: the current document, the changed files under its `resource`, and the diff. It rewrites the body, then updates frontmatter **mechanically, not at the model's discretion**:

- Set `generated: { by: <agent>/<model>, at: <now> }`.
- **Delete the `verified` array.** The code changed; a prior human review no longer applies.
- Reset `stale_after`.
- Append a dated entry to the nearest `log.md`.
- Regenerate every affected `index.md`.

`log.md` entries follow the spec's shape — date headings, newest first:

```markdown
# Directory Update Log

## 2026-07-28
* **Update**: Regenerated [Payments Ledger](/modules/payments-ledger.md) after 4a91c2f.
* **Creation**: Established [Refund Policy](/conventions/refund-policy.md).
```

There is no off-the-shelf generator for this. Google's reference agent is BigQuery-metadata oriented — it ships `enrich` and `visualize` commands that build bundles from datasets and render them as an interactive force-directed graph, with sample bundles for GA4, Stack Overflow, Bitcoin, and a retail catalog. None of it reads source code. The writer is yours to build; [`../Headless and CI/`](../Headless%20and%20CI/) covers running Claude Code non-interactively as the engine.

---

## Trust Tiers and the `verified` Drop

OKF derives three tiers from the `verified` field:

| Tier | Condition | How an agent should treat it |
|---|---|---|
| Unverified | No `verified` key | A map, not a fact. Confirm against source before acting. |
| Machine-confirmed | `verified` by non-`human:` actors only | Structure is probably right; specifics need checking. |
| Human-reviewed | Any `human:<id>` in `verified` | Trust as current, within `stale_after`. |

Dropping `verified` when the underlying code changes is the load-bearing rule of the whole system. Without it, a document reviewed once in March keeps its human-reviewed badge forever while the code underneath drifts. With it, the graph degrades *visibly*: an agent reading a demoted document knows to re-check, and a human reviewing the PR sees the demotion in the diff.

The corollary, from [`../Obsidian/`](../Obsidian/): an agent may draft a `Decision` inferred from code, but only as `status: draft`. It must never mint an approved ADR from what the code happens to do.

---

## Lint Gates

Separate deterministic checks from model judgment, and only let the deterministic ones fail a build.

**Deterministic — fail the PR:**

- Non-reserved `.md` without parseable frontmatter, or with an empty `type`.
- Broken bundle-relative link. (Consumers must tolerate these; your linter should not.)
- Duplicate `resource` across two concepts — two documents claiming the same code.
- Concept whose `resource` path no longer exists.
- `generated.at` older than the newest commit touching its `resource` — the graph is behind the code.
- Changed file matching no concept (orphan) beyond an agreed coverage threshold.

**Advisory — report, never auto-apply:**

- `stale_after` in the past.
- Two concepts that appear to describe the same thing.
- A concept whose body contradicts its own links.
- Code with high churn and no concept at all.

The staleness check in shell:

```bash
# Concept is behind its code if the newest commit touching `resource` is newer than generated.at
code_ts=$(git log -1 --format=%cI -- "$resource")
[[ "$code_ts" > "$generated_at" ]] && echo "BEHIND: $concept"
```

Publish the percentage of concepts passing that check as a single number. It is the honest answer to "is this graph worth reading?", and it is the only metric that predicts whether agents should trust it.

---

## How Agents Consume It

Point at the bundle from `CLAUDE.md`, and spell out the trust rule — otherwise the graph becomes a confident hallucination source:

```markdown
## Codebase knowledge graph

Before exploring source, read `knowledge/index.md` and follow links to the relevant
concepts. Prefer the graph over globbing; it is faster and it is what other agents
have already learned.

- `verified:` contains a `human:` actor, and `stale_after` is in the future → trust as current.
- `generated` only, or `status: draft` → a map, not a fact. Confirm against source before acting.
- The concept contradicts the code → **the code wins**. Fix the concept in the same PR.
- Never cite a concept as evidence for a claim about behaviour you have not read the code for.
```

Progressive disclosure is what makes this cheap: root `index.md` → section `index.md` → two or three concepts. An index entry is one line:

```markdown
# Modules

* [Payments Ledger](modules/payments-ledger.md) - double-entry ledger, sole writer of `ledger_entries`
* [Auth Session](modules/auth-session.md) - session issuance, rotation, revocation
```

---

## Token Economics, Honestly

The saving is structural, not a compression trick. An agent reads an index and three concepts (roughly 2–4k tokens) instead of globbing, skimming twenty files, and rebuilding the same model (commonly 30–60k, and it repeats every session). The graph caches exploration; that is all.

Two caveats that decide whether the saving is real:

- **It only holds if the graph is trusted.** An agent that reads the graph *and then* verifies everything against source has paid twice. The trust tiers exist to make "when can I skip verification?" answerable.
- **The generation cost is not free.** Every merged commit touching a covered module spends a model call. For a low-churn core module read by agents daily, that trades well. For a file churning ten times a day and read once a quarter, it does not — leave it uncovered.

Measure both sides before claiming a win. [`../Cost and Observability/`](../Cost%20and%20Observability/) covers the instrumentation.

---

## Rollout Path

Do not generate a thousand documents on day one; you will get a thousand unverified documents nobody reads.

1. **Hand-write five concepts** for the parts of the repo agents ask about most. Human-verified from the start.
2. **Add the linter** in CI, warnings only. Watch the orphan list — it tells you what to cover next.
3. **Add the `post-commit` hook and resolver.** Still no generation; just observe which concepts go dirty and how often.
4. **Turn on enrichment** for the five covered concepts. Review every generated diff by hand for the first two weeks.
5. **Promote the linter to blocking** on the deterministic checks once the false-positive rate is near zero.
6. **Expand coverage** by orphan frequency, not by directory order.

Steps 2 and 3 produce the data that tells you whether steps 4–6 are worth it. That is the point of doing them first.

---

## Common Mistakes

| Mistake | Better approach |
|---|---|
| One concept per source file | One per module/service/bounded context; cap bodies at 200–400 lines |
| Running the enrichment agent on `pre-commit` | Record on commit, enrich asynchronously in CI |
| Keeping `verified` when the code changes | Drop it mechanically; visible degradation beats invisible rot |
| Asking a model "which docs are stale?" | Compute it from `resource` prefixes and `git diff` |
| Generating the whole graph on day one | Five hand-verified concepts, expanded by orphan frequency |
| Letting the linter auto-fix advisory findings | Advisory findings are reports; only deterministic checks gate |
| Treating the graph as evidence | It is a map. Code is ground truth, always |
| Storing the queue in Git | `.okf/` is local scratch state; gitignore it |
| Depending on OKF fields beyond the basics | v0.2 is young; `type` + `resource` + `verified` is the durable core |

---

## Checklist

- [ ] Bundle lives in the repo, committed with the code it describes.
- [ ] Root `index.md` declares `okf_version`.
- [ ] Every concept has `type`, and every code-backed concept has `resource`.
- [ ] `resource` values are unique across concepts.
- [ ] `post-commit` hook records changed paths; `.okf/` is gitignored.
- [ ] Resolver reports both dirty concepts and orphans.
- [ ] Enrichment drops `verified` and refreshes `generated`/`stale_after` mechanically.
- [ ] `log.md` and affected `index.md` files update in the same pass.
- [ ] Deterministic lint checks gate the PR; advisory checks only report.
- [ ] Freshness percentage is published somewhere humans see it.
- [ ] `CLAUDE.md` states the trust rule and that code wins on contradiction.
- [ ] An agent may draft a `Decision` as `status: draft`, never as approved.

---

## Sources and Further Reading

- [OKF specification (`GoogleCloudPlatform/knowledge-catalog`)](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)
- [OKF bundles, reference agent, and visualizer](https://github.com/GoogleCloudPlatform/knowledge-catalog/tree/main/okf)
- [How the Open Knowledge Format can improve data sharing — Google Cloud Blog](https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing)
- [Google Cloud Introduces Open Knowledge Format (OKF) — MarkTechPost](https://www.marktechpost.com/2026/06/16/google-cloud-introduces-open-knowledge-format-okf-a-vendor-neutral-markdown-spec-for-giving-ai-agents-curated-context/)
- [Stop Wasting LLM Tokens: Building a Self-Updating Codebase Knowledge Graph with OKF](https://medium.com/@UdaykiranEstari/stop-wasting-llm-tokens-building-a-self-updating-codebase-knowledge-graph-with-okf-20284060c1b1)

## See Also

- [`../Obsidian/`](../Obsidian/) — the same format applied to external sources and a personal second brain
- [`../Memory and Context/`](../Memory%20and%20Context/) — the graph is the durable tier below `CLAUDE.md`
- [`../Hooks Cookbook/`](../Hooks%20Cookbook/) — hook safety and installation patterns
- [`../Headless and CI/`](../Headless%20and%20CI/) — running the enrichment agent non-interactively
- [`../RAG Failure Diagnostics/`](../RAG%20Failure%20Diagnostics/) — when the retrieval layer over the graph misbehaves
- [`../Docs Maintenance/`](../Docs%20Maintenance/) — quality bar for the prose inside each concept
- [`../Cost and Observability/`](../Cost%20and%20Observability/) — measuring both sides of the token trade
