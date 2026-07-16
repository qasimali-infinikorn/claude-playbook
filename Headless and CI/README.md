# Headless And CI

Headless Claude Code means running prompts non-interactively: from scripts, CI jobs, scheduled tasks, or release automation.

Use it for bounded, repeatable jobs. Do not use it to bypass review.

---

## Good Use Cases

- Summarize PR diffs.
- Check docs drift.
- Generate release notes from commits.
- Run a read-only security checklist.
- Triage failing CI and open an issue/PR.
- Update generated docs on a schedule.

Avoid headless runs for:

- Production deploys without a human gate.
- Ambiguous product decisions.
- Secret handling.
- Broad repository rewrites.
- External posting unless explicitly approved.

---

## Basic Command

```bash
claude -p "Summarize the current diff and list risks." --output-format json
```

Pipe output to tools:

```bash
claude -p "List changed files and test recommendations." --output-format json \
  | jq -r '.result'
```

---

## CI Safety Rules

- Prefer read-only prompts first.
- Run on PR branches, not `main`.
- Use minimal tokens and timeouts.
- Store output as an artifact or PR comment.
- Do not give write credentials until the read-only job is useful.
- Keep deterministic CI checks as required gates; AI checks can start advisory.

---

## GitHub Actions Pattern

```yaml
name: Claude PR Summary

on:
  pull_request:

jobs:
  summarize:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
      - name: Summarize diff
        run: |
          claude -p "Summarize this PR diff, risks, and test plan. Do not edit files." \
            --output-format json > claude-summary.json
```

Start by saving artifacts. Post comments only after the format is stable.

---

## Scheduled Docs Drift

```text
Every Monday:
1. Compare README, docs nav, package scripts, and public commands.
2. If drift exists, create a branch and docs-only PR.
3. Run npm run docs:build.
4. Do not merge.
```

---

## Prompt Template

```text
Run in headless mode:
- Task:
- Allowed actions:
- Denied actions:
- Verifier:
- Output JSON schema:
- Stop conditions:

If blocked, return BLOCKED with reason and do not guess.
```

---

## Output Schema Example

```json
{
  "status": "pass | fail | blocked",
  "summary": "",
  "changed_files": [],
  "commands_run": [],
  "risks": [],
  "next_actions": []
}
```

---

## Anti-Patterns

- Letting a headless job push to `main`.
- Hiding AI output inside logs nobody reads.
- Running expensive prompts on every commit.
- Giving CI broad repository or cloud credentials.
- Treating a model review as a required security gate before it is validated.

---

## See Also

- [`../Harness/`](../Harness/)
- [`../Loop Engineering/`](../Loop%20Engineering/)
- [`../Git and PR Workflow/`](../Git%20and%20PR%20Workflow/)
- [Claude Code GitHub Actions docs](https://code.claude.com/docs/en/github-actions)
- [Claude Code SDK docs](https://code.claude.com/docs/en/agent-sdk/overview)
