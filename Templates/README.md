# Templates

Copy these templates when you need a repeatable artifact: handoff, release checklist, postmortem, harness eval, PR description, or shared Claude Code policy.

Templates are intentionally plain Markdown/JSON so they can be used in any repo.

---

## Available Templates

| Template | Use it for |
|---|---|
| [`handoff-template.md`](./handoff-template.md) | Passing a session to a fresh agent or teammate |
| [`release-checklist.md`](./release-checklist.md) | Preparing a safe release/deploy |
| [`postmortem-template.md`](./postmortem-template.md) | Turning an agent failure into a guardrail |
| [`harness-eval-template.md`](./harness-eval-template.md) | Defining repeatable agent/eval checks |
| [`pr-description-template.md`](./pr-description-template.md) | Writing reviewable PR descriptions |
| [`ai-coding-policy-template.md`](./ai-coding-policy-template.md) | Team policy for agent-assisted coding |
| [`claude-settings.example.json`](./claude-settings.example.json) | Starting point for shared Claude Code settings |

---

## How To Use

1. Copy the relevant template into the target repo.
2. Replace placeholders.
3. Delete sections that do not apply.
4. Link it from `CLAUDE.md` or the nearest project docs page.

Do not copy secrets, live credentials, or private customer data into templates.
