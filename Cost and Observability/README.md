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
