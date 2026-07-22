# Cost And Observability

Agent work has cost: tokens, time, API calls, tool calls, retries, CI minutes, and human review attention. Treat cost and observability as part of the workflow, not an afterthought.

---

## What To Track

| Signal | Why |
|---|---|
| Token/cost estimate | Detect runaway loops |
| Wall-clock time | Know if workflow is usable |
| Retry count | Spot poor prompts or weak verifiers |
| Tool calls | Debug slow or risky behavior |
| Changed files/lines | Catch over-broad edits |
| Pass/fail | Track reliability |
| Failure class | Improve the harness |

---

## Model Choice

| Need | Default |
|---|---|
| Simple edits, summaries | Fast/cheap model |
| Normal coding | Balanced model |
| Hard debugging/design/security | Strong reasoning model |
| Bulk classification | Fast/cheap model with strict schema |

Use the cheapest model that reliably passes the harness.

---

## Cost Controls

- Keep context small.
- Use skills for on-demand guidance.
- Use focused tests before full suites.
- Cap retries.
- Avoid parallel branches unless the decision matters.
- Ask for plans before expensive builds.
- Store artifacts instead of re-reading huge logs.

---

## CAVEMAN: Output Brevity as a Cost Control

[CAVEMAN](https://github.com/JuliusBrussee/caveman) is a third-party skill/plugin that instructs coding agents to remove filler, use compressed prose, and preserve code, commands, paths, URLs, and errors exactly. Its main effect is a smaller user-facing answer:

```text
Normal:  The component re-renders because the inline object creates a
         new reference on every render. Wrap it in useMemo.

Terse:   Inline object = new ref each render. Wrap in `useMemo`.
```

### What it can and cannot save

| Token category | Direct effect | Why |
|---|---|---|
| Final/output prose | Can reduce | The response uses fewer words |
| Future input context | Can reduce indirectly | Shorter prior responses are sent in later turns |
| Tool output | No | It does not compress command or MCP results by itself |
| Files read | No | It does not stop repeated repository reads |
| Hidden reasoning | No claimed direct reduction | The style controls the answer, not underlying reasoning |
| Skill instructions | Adds input cost | The brevity rules themselves occupy context |

The project's July 2026 benchmark reports an average **65% output-token reduction** across ten prompts, with a wide 22–87% range. The same repository warns that:

- The figure applies to output tokens, not complete-session tokens.
- Input and reasoning tokens are not reduced by the response style alone.
- The skill adds roughly 1–1.5k input tokens per turn.
- Already-terse workloads can become net-negative.

Therefore, article headlines claiming 60–90% token-cost savings should not be treated as expected total savings. Measure on your own workload.

### When terse mode helps

- Experienced users who want commands, decisions, and short evidence summaries.
- Repetitive status updates where full prose adds little value.
- Long sessions where every earlier verbose answer becomes future input.
- High-volume review or triage with a strict output schema.

Avoid or disable it for:

- Onboarding and teaching where explanation is the deliverable.
- Architecture decisions that need explicit rationale and trade-offs.
- Security, legal, medical, or incident communication where omitted qualifiers create risk.
- User-facing documentation, PR descriptions, commit messages, error strings, or copy requiring a house style.
- Ambiguous tasks where short answers can hide assumptions.

### Test before installing

Do not pipe a remote installer directly into a shell without inspection. Clone or download a pinned release, read the skill, hooks, scripts, plugin manifest, install/uninstall behavior, network use, and security documentation, then run its evals in a disposable environment.

Minimum A/B test:

```md
Cases: 20 representative tasks
Control: normal response style
Candidate: CAVEMAN lite/full
Repeat: 3 runs per case where variability matters

Measure:
- input, cache, output, and reasoning tokens separately
- total billed cost
- task success and verifier pass rate
- missing caveats or misunderstood decisions
- human time to understand and act
- context size after 10 turns
```

Promotion rule example:

```yaml
caveman_trial:
  task_pass_rate: ">= control"
  critical_omissions: 0
  median_total_cost_delta: "< 0%"
  median_human_review_time_delta: "<= 0%"
```

Start with a session-scoped or `lite` mode. Do not compress shared `CLAUDE.md`, policies, runbooks, or project memory automatically: shortening durable instructions can remove the nuance that prevents expensive mistakes.

### Lower-risk alternative

Before installing anything, ask for a concise report shape:

```text
Be concise. Return only:
- outcome
- changed files
- verification command and result
- remaining risk

Keep code, commands, paths, error text, safety caveats, and unresolved
assumptions exact. Expand only when I ask.
```

This captures much of the readability benefit without adding hooks or plugins. It still needs measurement because a brevity instruction also consumes context and may omit useful detail.

### Sources

- [CAVEMAN repository, benchmarks, and honest-number warning](https://github.com/JuliusBrussee/caveman)
- [Santosh Yadav: “Cut Claude Code Token Costs by 60–90%...”](https://santoshyadav979439.medium.com/cut-claude-code-token-costs-by-60-90-with-free-open-source-tools-2026-2823e9968463) — secondary overview that led to this evaluation

---

## Observability Report

```md
# Run Report

## Status
pass/fail/blocked

## Attempts

## Commands/tool calls

## Artifacts

## Changed files

## Cost/latency notes

## Failure class

## Next action
```

---

## Stop Rules

Stop when:

- Same failure repeats twice.
- Retry cap is reached.
- The agent proposes broad unrelated changes.
- The verifier is unclear.
- Cost exceeds the value of the task.
- A human judgment gate is reached.

---

## Anti-Patterns

- Running Opus-level reasoning for every typo.
- Retrying without changing the hypothesis.
- Letting tool output flood context.
- Measuring pass rate but not cost.
- Optimizing for low cost while quality fails.

---

## See Also

- [`../Harness/`](../Harness/)
- [`../Loop Engineering/`](../Loop%20Engineering/)
- [`../Memory and Context/`](../Memory%20and%20Context/)
- [`../Skills/`](../Skills/)
- [`../Eval-Driven Skill Improvement/`](../Eval-Driven%20Skill%20Improvement/)
