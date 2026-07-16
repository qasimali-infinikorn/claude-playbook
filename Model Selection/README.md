# Model Selection

Pick the model and reasoning depth based on risk, ambiguity, and cost. Bigger is not always better; smaller is not always cheaper if it retries.

---

## Decision Table

| Task | Use |
|---|---|
| Rename, formatting, simple docs | Fast/cheap model |
| Normal feature work | Balanced model |
| Hard debugging | Strong reasoning model |
| Security review | Strong reasoning model |
| Architecture tradeoffs | Strong reasoning model |
| Bulk extraction/classification | Fast/cheap model + schema |
| UI taste/design critique | Strong model or design subagent |
| Test writing | Balanced model |

---

## Escalate When

- The first attempt fails for a reasoning reason.
- The task spans many files or systems.
- There is a security/data risk.
- You need architectural judgment.
- The model is inventing APIs.
- A failed result would cost more than the model upgrade.

---

## De-Escalate When

- The task is mechanical.
- The harness is deterministic.
- You are generating many similar artifacts.
- The prompt has tight examples/schema.
- You only need summarization or extraction.

---

## Reasoning Depth

Ask for deeper reasoning when:

- Debugging ambiguous failures.
- Planning multi-file changes.
- Reviewing security or data correctness.
- Comparing architecture options.

Keep it terse when:

- Running commands.
- Applying a known pattern.
- Producing structured output.

---

## Anti-Patterns

- Using the strongest model for every task.
- Using the cheapest model on high-risk changes.
- Measuring cost per attempt instead of cost per success.
- Not changing the prompt/harness when switching models.

---

## See Also

- [`../Cost and Observability/`](../Cost%20and%20Observability/)
- [`../Harness/`](../Harness/)
- [`../Subagents/`](../Subagents/)
