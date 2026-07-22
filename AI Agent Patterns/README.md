# AI Agent Patterns

Start with the smallest pattern that can complete the job and prove it. A single tool-using agent with a good verifier is usually more reliable than a team of agents with overlapping roles.

This guide is framework-neutral. The same patterns can be implemented with Claude Code, an agent SDK, a workflow engine, or a small application around an LLM API.

Different ecosystems use different names for the same coordination shapes. See [`Agent Orchestration Terminology`](../Agent%20Orchestration%20Terminology/) for a vendor-by-vendor translation.

---

## Choose a Pattern

| Need | Start with | Add only when needed |
|---|---|---|
| One bounded task | Single agent | Tools and a deterministic verifier |
| Different kinds of requests | Router + specialists | Fallback route and confidence threshold |
| Several dependent stages | Sequential pipeline | Typed handoffs and per-stage gates |
| Independent research or review | Parallel fan-out/fan-in | Deduplication and independent judge |
| Answers grounded in private data | RAG agent | Retrieval grading and citation checks |
| Repeated work over time | Always-on agent | Durable state, idempotency, alerts, human gates |
| Interactive artifacts, not prose | Generative UI agent | Schema validation and client-side controls |
| Spoken interaction | Voice agent | Interruption, latency, transcript, and escalation handling |

Do not choose a pattern because its diagram looks sophisticated. Choose it because a simpler shape has a measured limitation.

---

## 1. Single Tool-Using Agent

One agent owns the task, chooses from a narrow toolset, observes results, and stops when a verifier passes.

```text
request → agent → tool → observation → agent → verifier → result
```

Use it for:

- Repository questions and small code changes.
- Data lookup with one or two APIs.
- Drafting an artifact from known inputs.
- A first version of almost any agent workflow.

Example contract:

```yaml
goal: Update CLI documentation for every public flag
tools: [read_files, search_text, edit_docs, run_docs_build]
denied: [edit_source, install_packages, push_git]
done_when: docs build exits 0 and every flag appears in the reference
max_attempts: 3
```

Main failure: giving the agent many overlapping tools and no clear completion check. Tool count is not capability if the agent cannot choose reliably.

---

## 2. Router + Specialists

A router classifies the request and sends it to one specialist with the right prompt, tools, and context.

```text
                         ┌→ billing specialist
request → typed router ──┼→ technical specialist
                         └→ account specialist
```

Use it when requests have genuinely different tool or policy requirements. A support request about a refund should not share the same action space as a documentation question.

Router output should be structured:

```json
{
  "route": "technical_support",
  "confidence": 0.91,
  "reason": "The user reports an API authentication error."
}
```

Guardrails:

- Use an explicit route enum, not arbitrary agent names.
- Define a safe fallback for low confidence.
- Log route decisions and corrections.
- Test ambiguous and adversarial inputs.
- Keep authorization outside the model; routing cannot grant permissions.

Main failure: adding a router when there are only two simple tools. Direct tool selection may be cheaper and easier to evaluate.

---

## 3. Sequential Pipeline

Each stage performs one transformation and passes a typed artifact to the next stage.

```text
research → evidence gate → analysis → fact gate → draft → editorial gate
```

Use it for work with dependent phases: research reports, data enrichment, migration planning, content production, or security triage.

Every handoff needs a contract:

```json
{
  "claims": [
    {
      "claim": "...",
      "source_url": "...",
      "source_date": "2026-07-17",
      "confidence": "high"
    }
  ],
  "open_questions": []
}
```

Guardrails:

- Validate schema between stages.
- Stop the pipeline when required evidence is missing.
- Preserve source attribution rather than asking the writer to reconstruct it.
- Record which stage introduced each fact or decision.

Main failure: passing prose blobs between agents. Ambiguous handoffs compound errors and make root cause invisible.

---

## 4. Parallel Fan-Out / Fan-In

Independent workers process disjoint tasks concurrently; an aggregator verifies and combines their outputs.

```text
                 ┌→ worker A ─┐
plan + briefs ───┼→ worker B ─┼→ verifier/aggregator → result
                 └→ worker C ─┘
```

Use it for:

- Researching independent companies, files, or incidents.
- Running security, performance, and correctness reviews in parallel.
- Generating alternatives that will be judged by the same rubric.

Each worker brief must be self-contained:

```md
Objective: Review package A for license and maintenance risk.
Inputs: package manifest, upstream repository URL.
Output: fixed JSON schema.
Acceptance: every claim cites a primary source.
Boundary: do not evaluate other packages.
```

Guardrails:

- Partition work so two workers do not edit the same files.
- Give every worker identical evidence and output rules where comparison matters.
- Treat partial worker failure explicitly.
- Make the aggregator verify rather than merely concatenate.
- Budget total work before dispatch; parallelism multiplies token and tool cost.

Main failure: dispatching the same vague task to many agents and treating agreement as truth.

---

## 5. Retrieval-Augmented Generation (RAG) Agent

The agent retrieves evidence from an indexed corpus, judges whether it is sufficient, and answers with traceable citations.

```text
question → query rewrite → retrieve → grade evidence ─┬→ answer + citations
                                                      └→ retry/fallback
```

Use it when answers must be grounded in documents too large or dynamic to place in every prompt.

Required evidence to capture:

- Original and rewritten query.
- Retrieved document/chunk identifiers and scores.
- Corpus/index version.
- Citations actually used in the answer.
- Retrieval and answer-quality grader results.

Main failure: evaluating only the final prose. Retrieval can fail even when the answer sounds convincing. See [`../RAG Failure Diagnostics/`](../RAG%20Failure%20Diagnostics/).

---

## 6. Always-On Agent

An always-on agent wakes on a schedule or event, checks current state, acts only when necessary, records the result, then waits again.

```text
trigger → read checkpoint → detect change → decide → act/gate → persist checkpoint
```

Use it for monitored queues, daily briefs, CI triage, documentation drift, or scheduled audits.

It needs more than a prompt:

- Durable checkpoint and deduplication key.
- Idempotent actions so retries are safe.
- Lease/lock to prevent two workers handling the same event.
- Retry and dead-letter behavior.
- Cost, time, and action limits.
- Human approval before publishing, messaging, merging, deploying, or spending.
- Health signal for "agent did nothing because nothing changed" versus "agent is broken."

Main failure: using chat history as durable state. Process restarts, compaction, and concurrent workers make that unreliable.

---

## 7. Generative UI Agent

Instead of returning prose, the agent emits a validated UI description that the client renders as cards, forms, charts, or editable plans.

```text
request → agent → validated UI schema → renderer → user edits/approves → action
```

Example output:

```json
{
  "type": "approval_card",
  "title": "Deploy release 42",
  "facts": ["18 tests passed", "staging smoke test passed"],
  "actions": [
    {"id": "approve", "label": "Approve deployment", "requires_confirmation": true},
    {"id": "cancel", "label": "Cancel"}
  ]
}
```

Guardrails:

- Render from an allow-listed component schema; never execute model-generated HTML or JavaScript directly.
- Validate every field and action server-side.
- Separate proposed UI from authorized action.
- Preserve keyboard, screen-reader, loading, error, and undo behavior.

Main failure: making a fluent interface that hides uncertainty or turns generated content into an action without confirmation.

---

## 8. Voice Agent

A voice agent adds streaming speech recognition and synthesis around an agent loop. The hard parts are timing and control, not merely transcription.

```text
audio → speech-to-text → agent/tools → text-to-speech → audio
          ↑ interruption / turn detection / escalation ↓
```

Design for:

- Low time-to-first-audio.
- Barge-in: the user can interrupt immediately.
- Clear disclosure when recording or using AI.
- Transcript and action confirmation.
- Recovery from silence, recognition error, and network loss.
- Human handoff for sensitive or unresolved cases.

Main failure: executing a high-impact action from misheard speech. Read back critical details and require explicit confirmation.

---

## Pattern Selection Checklist

- [ ] A single agent was considered first.
- [ ] Each extra role has a distinct tool or context boundary.
- [ ] Inputs and outputs have schemas where stages meet.
- [ ] Every model decision has observable evidence.
- [ ] Deterministic verification is used where possible.
- [ ] Retries, budgets, and stop conditions are bounded.
- [ ] External effects require the right human gate.
- [ ] Traces identify which component introduced a failure.
- [ ] A baseline exists before adding complexity.

## Sources and Examples

- [Awesome LLM Apps](https://github.com/Shubhamsaboo/awesome-llm-apps) — broad runnable examples across agents, RAG, MCP, voice, and generative UI
- [Anthropic: Building effective agents](https://www.anthropic.com/research/building-effective-agents)
- [Claude Code subagents](https://code.claude.com/docs/en/sub-agents)
- [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/)
- [Google Agent Development Kit](https://google.github.io/adk-docs/)

## See Also

- [`../Agent Team Patterns/`](../Agent%20Team%20Patterns/)
- [`../Loop Engineering/`](../Loop%20Engineering/)
- [`../Harness/`](../Harness/)
- [`../MCP Playbook/`](../MCP%20Playbook/)
- [`../RAG Failure Diagnostics/`](../RAG%20Failure%20Diagnostics/)
- [`../Cost and Observability/`](../Cost%20and%20Observability/)
- [`../Agent Orchestration Terminology/`](../Agent%20Orchestration%20Terminology/)
