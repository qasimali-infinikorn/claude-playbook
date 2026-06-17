# The `.claude/` Directory Layout

`CLAUDE.md` is the project brain that loads **every** session. The `.claude/` directory is the tooling *around* it — config that loads **only when relevant**: subagents you delegate to, slash commands, hook scripts that gate actions, and the `settings.json` that wires permissions and hooks together.

The point of splitting things out: a single fat `CLAUDE.md` loads everything every time and nobody agrees what belongs in it. `.claude/` lets the right context show up for the right task.

> Read this alongside [`../CLAUDE.md Best Practices/`](../CLAUDE.md%20Best%20Practices/) (what goes in the always-loaded brain) and [`../Security Guardrails/`](../Security%20Guardrails/) (why `deny` rules come first).

---

## The structure

```
your-repo/
├── CLAUDE.md                ← Project brain — always loaded (repo root)
└── .claude/
    ├── agents/              ← Subagent personas you delegate to
    ├── commands/            ← Custom slash commands (/fix-issue …)
    ├── hooks/               ← Shell scripts run at tool boundaries
    ├── skills/              ← SKILL.md packs, loaded when the task matches
    └── settings.json        ← Permissions, hook wiring, defaults
```

`settings.json` is checked in and shared with the team. `settings.local.json` (git-ignored) is for **your** machine-specific overrides — keep personal allow-lists there, not in the shared file.

> **Field names change between Claude Code versions.** Treat every YAML/JSON snippet here as a starting template and confirm against the current docs (`/help`, or type `/` to see what your client actually supports) if something refuses to load.

---

## 1. `agents/` — subagents you delegate to

Each `.md` file is a specialist with its own context window, tool access, and system prompt. Claude delegates to one when a task matches its `description` (or you ask explicitly). Useful for keeping a heavy, repeatable job (review, debugging, research) out of the main thread.

`.claude/agents/code-reviewer.md`:

```markdown
---
name: code-reviewer
description: Reviews staged changes for bugs and security issues before merge. Use before committing or opening a PR.
tools: Read, Glob, Grep, Bash
model: sonnet
---

You are a senior code reviewer.

1. Run `git diff --cached` and read every changed file.
2. Security: grep for hardcoded secrets, check input validation, verify auth isn't weakened.
3. Quality: no dead code, functions stay small, no obvious duplication.
4. Report findings as CRITICAL / WARNING / SUGGESTION. Block the merge if anything is CRITICAL.
```

**Verified frontmatter fields:** `name`, `description`, `tools` (optional — omit to inherit all), `model` (optional — `sonnet` / `opus` / `haiku` / `inherit`).

> ⚠️ Some blog templates show `memory:` and `maxTurns:` agent fields — those are **not** standard Claude Code subagent frontmatter. Don't add them expecting them to do anything.

---

## 2. `commands/` — custom slash commands

Write a prompt once, invoke it with `/name`. The file body is the prompt; `$ARGUMENTS` (or `$1`, `$2`) interpolate what you type after the command.

`.claude/commands/fix-issue.md`:

```markdown
---
description: Fix a GitHub issue end to end
argument-hint: [issue-number]
---

Fix GitHub issue #$ARGUMENTS:
1. `gh issue view $ARGUMENTS` — read the issue.
2. Find the relevant source files.
3. Implement the minimal fix.
4. Add a regression test.
5. Run the quality bar (see CLAUDE.md → Specific Commands); all green.
6. Open a PR — do not push to main directly.
```

Usage: `/fix-issue 42`. You can also run shell inline with `!`​`command`​` and reference files with `@path`.

**Useful frontmatter:** `description`, `argument-hint`, `allowed-tools`, `model`. All optional.

---

## 3. `hooks/` — hard gates at tool boundaries

Hooks are shell commands Claude Code runs automatically at defined events (`PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `Stop`, …). Use them when you need a **deterministic** gate the model can't talk its way past: lint, typecheck, tests, policy checks. A `PreToolUse` hook that exits non-zero **blocks** the tool call and feeds its stderr back to Claude.

`.claude/hooks/quality-gate.sh`:

```bash
#!/usr/bin/env bash
# Block a tool call if the working tree doesn't pass the quality bar.
set -euo pipefail

npx tsc --noEmit          || { echo "Typecheck failed — fix before continuing." >&2; exit 2; }
npx eslint . --quiet      || { echo "Lint failed." >&2; exit 2; }
npm test --silent         || { echo "Tests failed." >&2; exit 2; }

echo "Quality bar passed."
```

Make hooks executable: `chmod +x .claude/hooks/*.sh`

> ⚠️ **Don't wire a full typecheck-lint-test gate to a bare `Bash` matcher.** That runs your entire test suite before *every* shell command Claude makes — slow and maddening. If you want a real pre-commit gate, the robust option is a git `pre-commit` hook (`.git/hooks/` or Husky) that fires only on `git commit`. Use Claude Code `PreToolUse` hooks for narrowly-scoped checks, and match precisely.

---

## 4. `skills/` — situational instruction packs

A skill is a `SKILL.md` (plus optional supporting files) that loads when its `description` matches the task — good for design systems, release checklists, or compliance text you don't want duplicated across prompts.

`.claude/skills/design-tokens/SKILL.md`:

```markdown
---
name: design-tokens
description: Apply the house design tokens to any UI work — colors, type, spacing.
---

Colors: import from `@/lib/theme-tokens`; never hardcode hex values.
Typography: Inter, body 15–16px, hero 48–64px.
Spacing: 64px sections, 24px card padding, 16px radius.
Dark mode: depth via gradients/borders, never flat black.
```

**Verified frontmatter:** `name`, `description` (and optional `allowed-tools`). The playbook's [`../Skills/`](../Skills/) folder covers the skills worth keeping in rotation.

> ⚠️ A `user-invocable:` field appears in some templates — it isn't a documented Claude Code skill field. Skills are surfaced by their `description`; you can also invoke one explicitly via its slash command.

---

## 5. "Rules" — use scoped `CLAUDE.md`, not a `rules/` folder

Some setups (and blog posts modeled on Cursor's `.cursor/rules/`) show a `.claude/rules/` folder with `paths:` globs that auto-load per file. **Claude Code doesn't work that way.** Its mechanism for path-scoped guidance is:

- **Nested `CLAUDE.md`** — a `CLAUDE.md` inside a subdirectory; Claude reads the nearest one when working in that tree.
- **`@import`** — keep shared rules in `AGENTS.md` and make `CLAUDE.md` a one-liner (`@AGENTS.md`) so multiple agent tools share one source of truth.

See [`../CLAUDE.md Best Practices/`](../CLAUDE.md%20Best%20Practices/#placement--structure) for placement in single-repo, monorepo, and multi-repo setups.

---

## 6. `settings.json` — permissions + hook wiring

The shared, checked-in config. Permissions define tool boundaries; hooks bind scripts to events. See [`settings.example.json`](./settings.example.json) in this folder for a copy-paste starting point.

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run lint)",
      "Bash(npm run test *)",
      "Bash(npm run build)",
      "Bash(git diff *)",
      "Bash(git status)",
      "Bash(gh issue *)",
      "Bash(gh pr *)"
    ],
    "deny": [
      "Read(.env)",
      "Read(.env.*)",
      "Read(secrets/**)",
      "Bash(rm -rf *)",
      "Bash(git push --force *)"
    ]
  },
  "model": "claude-sonnet-4-6"
}
```

**Tighten `deny` first** — secrets reads and force-pushes — *before* you widen `allow`. A `deny` rule always wins over `allow`. ([Security Guardrails](../Security%20Guardrails/) explains why these specific ones are non-negotiable.)

> ⚠️ Keys like `autoMemoryEnabled` show up in some templates but aren't documented settings — don't rely on them. Stick to `permissions`, `hooks`, `model`, `env`, and confirm anything else against the docs.

---

## How to start (don't build all of it on day one)

1. **`settings.json` `deny` rules** — block secret reads and force-push first.
2. **One agent** — the job you repeat most (usually `code-reviewer`).
3. **One scoped `CLAUDE.md`** — for the part of the codebase you touch most.
4. **Add a command** when you've typed the same multi-step prompt twice.
5. **Add a hook** when you've run the same manual check (lint/test) twice in one day.

Everything else is YAGNI until a real repeated pain justifies it.

```bash
# Minimal scaffold — create folders as you actually need them
mkdir -p .claude/agents
touch .claude/settings.json
# then add an agent / command / hook only when a repeated task earns it
```

After adding anything, run one small task and confirm permissions and hooks behave **before** you depend on them.

---

## Related

- [`../CLAUDE.md Best Practices/`](../CLAUDE.md%20Best%20Practices/) — the always-loaded project brain (10 sections + template).
- [`../Project Setup Checklist/`](../Project%20Setup%20Checklist/) — making a new repo agent-ready.
- [`../Security Guardrails/`](../Security%20Guardrails/) — why `deny` rules come first.
- [`../Skills/`](../Skills/) — the skills worth keeping in rotation.
