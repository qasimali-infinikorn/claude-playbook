# Hooks Cookbook

Hooks are deterministic commands Claude Code runs at lifecycle events. Use hooks when a rule should not depend on the model remembering it.

Hooks are powerful. Keep them narrow, fast, and obvious.

---

## Good Hook Uses

- Block secret reads.
- Block dangerous shell patterns.
- Run a focused formatter after file edits.
- Notify when a long task stops.
- Log tool usage for audit.
- Enforce project-specific boundaries.

Avoid hooks for:

- Full test suites on every shell command.
- Hidden behavior nobody on the team understands.
- Destructive cleanup.
- Replacing human code review.

---

## Common Events

| Event | Use for |
|---|---|
| `PreToolUse` | Block or inspect before a tool runs |
| `PostToolUse` | Format, log, or check after a tool runs |
| `UserPromptSubmit` | Check prompt policy |
| `Stop` | Notify, summarize, or run final checks |

Confirm exact event and matcher support against current Claude Code docs before relying on a snippet.

---

## Recipe: Block Secret Reads

```json
{
  "permissions": {
    "deny": [
      "Read(.env)",
      "Read(.env.*)",
      "Read(secrets/**)"
    ]
  }
}
```

Use permission denies before hooks when possible.

---

## Recipe: Block Dangerous Bash

```bash
#!/usr/bin/env bash
set -euo pipefail

payload="$(cat)"

if echo "$payload" | rg -q 'rm -rf|git reset --hard|git push --force|DROP TABLE'; then
  echo "Blocked dangerous command. Ask the user for explicit approval." >&2
  exit 2
fi
```

---

## Recipe: Focused Docs Gate

```bash
#!/usr/bin/env bash
set -euo pipefail

if git diff --name-only | rg -q '(^README.md|\\.md$|^\\.vitepress/)'; then
  npm run docs:build
fi
```

Do not attach this to every `Bash` call. Use it at a sensible stop/checkpoint.

---

## Recipe: Tool Log

```bash
#!/usr/bin/env bash
set -euo pipefail

mkdir -p .claude/logs
cat >> .claude/logs/tool-events.jsonl
echo >> .claude/logs/tool-events.jsonl
```

Add `.claude/logs/` to `.gitignore` unless logs are intentionally reviewed.

---

## Hook Design Checklist

- [ ] Is a permission rule simpler?
- [ ] Is it fast?
- [ ] Is it deterministic?
- [ ] Does it have a clear error message?
- [ ] Does it avoid secrets in logs?
- [ ] Is it scoped to the right tool/event?
- [ ] Can developers bypass it safely when needed?
- [ ] Is it documented?

---

## Anti-Patterns

- Running lint/test/build before every shell command.
- Logging prompts or secrets.
- Making hooks mutate large parts of the repo.
- Hiding business policy in shell scripts.
- Adding hooks without testing one small task.

---

## See Also

- [`../Claude Directory Layout/`](../Claude%20Directory%20Layout/)
- [`../Codebase Knowledge Graph/`](../Codebase%20Knowledge%20Graph/)
- [`../Security Guardrails/`](../Security%20Guardrails/)
- [`../Harness/`](../Harness/)
- [Claude Code hooks docs](https://code.claude.com/docs/en/hooks)
