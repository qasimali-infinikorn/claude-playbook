# The 10 Levels of Claude Code

A progression, not a checklist — each level builds on the one before it. Most people live at Level 1–3 forever and get real value; Levels 7–10 are where Claude Code stops being "a chat window in the terminal" and starts being infrastructure. Climb one level at a time, and only when the level below is actually earning its keep.

> Read this alongside [`../Claude Directory Layout/`](../Claude%20Directory%20Layout/) (the `.claude/` tree in detail) and [`../Subagents/`](../Subagents/) (a deep dive on Level 7).

---

## Lvl 1 — Terminal

You open Claude Code in your terminal, in the repo where your project already lives, and ask it to write or fix code.

**What it is:** `claude` in a shell, `cwd` set to your project. No extra config needed to start.

**Use cases:**
- "Fix the failing test in `auth.spec.ts`."
- "Add a `--dry-run` flag to this CLI script."
- Cloning a repo and asking Claude to get it running locally.

**Gotcha:** Claude Code has full filesystem access from wherever you launch it. `diff secret.key ~/workspace/...` works because nothing stops it from reading outside the project unless you scope permissions — see [`../Security Guardrails/`](../Security%20Guardrails/).

---

## Lvl 2 — `CLAUDE.md`

A file at your repo root that Claude reads automatically at the start of every session — stack, conventions, rules — so you stop re-explaining the same things.

**What it is:** plain Markdown, no special syntax. Loaded once per session, before your first message.

**Use cases:**
- Stop typing "we use Postgres, kebab-case filenames, named exports" every session.
- Encode hard rules once: "never edit generated files," "always run `npm run typecheck` before reporting done."
- Give a new teammate (human or agent) instant project context.

**Go deeper:** [`../CLAUDE.md Best Practices/`](../CLAUDE.md%20Best%20Practices/) — the 10 standard sections + a fill-in template.

---

## Lvl 3 — Commands (built-in)

Slash commands that steer the *session itself*, not your code.

**What it is:** `/clear` (wipe conversation), `/compact` (summarize + compress history), `/context` (see what's filling your context window), `/help`, `/status`, and more — type `/` to see what your client supports.

**Use cases:**
- Context window getting full mid-task → `/compact` before you lose early instructions to summarization.
- Switching to an unrelated task → `/clear` instead of dragging stale context along.
- Session feels slow or confused → `/context` to see what's actually loaded (skills, MCP tool schemas, file reads) and find the bloat.

---

## Lvl 4 — Custom commands

You save a prompt you keep retyping as your own slash command, so a whole routine fires from one short token.

**What it is:** a Markdown file in `.claude/commands/` (project) or `~/.claude/commands/` (global — see below). The file body is the prompt; `$ARGUMENTS` interpolates whatever you type after the command name.

```bash
mkdir -p ~/.claude/commands
echo "AUDIT @package.json to ensure we do not have ANY unused dependencies or devDependencies installed. UPDATE our deps and devDeps accordingly." > ~/.claude/commands/audit-deps.md
```

Usage: `/audit-deps`.

**Use cases:**
- `/fix-issue 42` → fetch the GitHub issue, find the code, fix it, add a regression test, open a PR.
- `/commit` → your team's exact commit-message convention, every time, without re-explaining it.
- `/audit-deps` → prune unused dependencies on demand instead of writing the same audit prompt from scratch.

**Global vs project:** put a command in `~/.claude/commands/` when it's a personal habit useful in *every* repo (e.g. `/audit-deps`, `/sync-readme`). Put it in `.claude/commands/` when it's specific to one project's workflow and should be shared with the team via git.

---

## Lvl 5 — Skills

A skill packages a whole workflow that Claude triggers **on its own** when the moment fits — you don't have to remember to run it.

**What it is:** a `SKILL.md` (plus optional supporting files) with a `name` and `description`. Claude auto-invokes a skill when your request matches its description; you can also force it with `/skill-name`. Skills live in `.claude/skills/` (project) or `~/.claude/skills/` (global).

**Use cases:**
- `/security-review` — audit a diff for vulnerabilities before merge.
- `/deep-research` — fan-out search, verify sources, cited report.
- A design-taste skill that fires automatically whenever you ask Claude to "build a landing page," without you having to invoke anything.

**Installing third-party skills globally:**

```bash
npx skills@latest add <github-owner/repo> --global --skill "<skill-name>"
```

The `skills` CLI (maintained by Vercel) stores the actual files once in `~/.agents/skills/` and symlinks them into `~/.claude/skills/`, so the same skill works across Claude Code, Cursor, Codex, etc. Always review a skill's `SKILL.md` before installing — it runs with your full agent permissions.

> Some skills set `disable-model-invocation: true` in their frontmatter — that skill will **never** auto-trigger, you must invoke it explicitly (e.g. a strict animation-review skill that shouldn't silently rubber-stamp your own work).

**Go deeper:** [`../Skills/`](../Skills/) — the skills kept in active rotation, plus [`../Subagents/`](../Subagents/) for how skills combine with subagents.

---

## Lvl 6 — MCP

MCP (Model Context Protocol) servers connect Claude to your *real* tools and data — your database, your repos, the SaaS products you already run — instead of Claude only knowing what's in the repo.

**What it is:** a standardized connector. Add one with `claude mcp add`, or configure it in settings; Claude then gets new tools scoped to that server (e.g. `mcp__github__create_pr`, `mcp__postgres__query`).

**Use cases:**
- GitHub MCP → Claude opens/reviews/comments on PRs using your real auth, not `gh` CLI guesswork.
- Postgres MCP → "which users hit the rate limit yesterday" answered against your actual database.
- Figma MCP → pull a real design's tokens/layout instead of guessing spacing from a screenshot.
- Slack/Notion/Drive MCP → Claude reads the spec doc or the bug report thread directly instead of you pasting it in.

**Caution:** an MCP server is a trust boundary — it can read/write whatever the server's credentials allow. Scope credentials narrowly and review what a new MCP server actually exposes before wiring it in globally.

---

## Lvl 7 — Subagents

You fan out to subagents that run in parallel, each with its own context window and tool access, so several tasks move at once while you keep working (or supervising).

**What it is:** a `.md` file in `.claude/agents/` (project) or `~/.claude/agents/` (global) with `name`, `description`, `tools`, and optional `model` frontmatter. Claude delegates to one automatically when a task matches its `description`, or you invoke it explicitly.

**Use cases:**
- A ticket needs product framing, UX flow, and a technical estimate → dispatch `product-manager`, `ux-designer`, and `senior-software-engineer` subagents in parallel, synthesize their output into one spec.
- Heavy, repeatable jobs (code review, debugging, test writing) kept in their own subagent so they don't bloat your main session's context.
- A senior engineer's daily kit: `code-reviewer`, `debugger`, `test-writer`, `performance-optimizer` — each scoped to exactly the tools it needs.

**Go deeper:** [`../Subagents/`](../Subagents/) — full guide, including 5 global subagents (a `ui-designer` plus four engineering subagents) set up as part of this playbook, with concrete invocation examples.

---

## Lvl 8 — Hooks

Hooks run your own scripts automatically at defined lifecycle events — session start, before/after a tool call, the moment Claude stops — as a **deterministic** gate the model can't talk its way past.

**What it is:** shell commands wired up in `settings.json` under `hooks`, keyed to events like `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `Stop`. A `PreToolUse` hook that exits non-zero blocks the tool call.

**Use cases:**
- Block any `Bash` call matching `rm -rf` before it runs, regardless of what the model intended.
- Auto-format a file with `prettier` immediately after every edit.
- Log every tool call to a file for an audit trail.
- Desktop notification when Claude finishes a long task and is waiting on you.

**Caution:** don't wire a full lint+typecheck+test gate to a bare `Bash` matcher — that reruns your entire suite before *every* shell command. Scope hooks precisely, and use a real git `pre-commit` hook for the "gate every commit" use case instead.

**Go deeper:** [`../Claude Directory Layout/`](../Claude%20Directory%20Layout/#3-hooks--hard-gates-at-tool-boundaries) — hook examples and the scoping caveat in full.

---

## Lvl 9 — Headless

You run Claude non-interactively and script it, so it works inside CI and your own automation with no terminal open.

**What it is:** `claude -p "<prompt>" --output-format json`, invoked from a shell script, CI job, or cron entry. Pipe the JSON output into `jq` or another tool to chain steps.

```bash
claude -p "List all routes in index.ts with their HTTP method, URL pattern, and what they return" \
  --output-format json | jq -r '.result'
```

**Use cases:**
- CI step that asks Claude to summarize what a PR's diff actually changes, posted as a PR comment.
- A pre-deploy script that has Claude scan the diff for anything matching your security checklist and fails the build on a hit.
- Nightly job that regenerates API docs from source and opens a PR if they drifted.

---

## Lvl 10 — Routines

You put Claude on a schedule so it runs itself on a loop and does the job while you're asleep — no laptop open, no terminal running.

**What it is:** a cloud-scheduled agent (cron-style) that fires a prompt or command at defined intervals against a specific repo, independent of your machine being on.

**Use cases:**
- Daily `docs-update-feature` run against `claude-website` — keep docs in sync with shipped code without a human remembering to do it.
- Recurring `doctor-tool-audit` — a periodic health check across a fleet of tools/services, reported back each morning.
- On-call-style monitoring: check a metric or log source every N minutes and page only when something's actually wrong.

**Caution:** a routine acting unsupervised needs the same scrutiny as a production cron job — narrow permissions, a `deny` list for destructive actions, and somewhere the output actually gets reviewed (not just fired into the void).

---

## Where you probably are, and what to add next

| If you're doing this today... | ...the next level worth earning is |
|---|---|
| Just `claude` in a terminal, re-explaining your stack every session | Lvl 2 — write a `CLAUDE.md` |
| Retyping the same multi-step prompt | Lvl 4 — save it as a custom command |
| Manually reminding Claude to review/test/audit | Lvl 5 — a skill that auto-triggers |
| Copy-pasting data from your database/Slack/Figma into the chat | Lvl 6 — the matching MCP server |
| One long session doing product + design + engineering thinking serially | Lvl 7 — subagents in parallel |
| Manually running lint/test after every edit | Lvl 8 — a scoped hook |
| Only ever running Claude with a terminal open | Lvl 9 — headless in CI |
| A recurring task you still do by hand on a schedule | Lvl 10 — a routine |

Don't jump straight to Lvl 10. Each level below it is what makes the level above trustworthy — a routine running unsupervised is only as safe as the hooks, permissions, and subagent scoping under it.

---

## Related

- [`../Claude Directory Layout/`](../Claude%20Directory%20Layout/) — the `.claude/` tree: agents, commands, hooks, skills, settings.json.
- [`../Subagents/`](../Subagents/) — Lvl 7 in depth, plus the 5 global subagents installed alongside this doc.
- [`../Skills/`](../Skills/) — the skills kept in active rotation.
- [`../Security Guardrails/`](../Security%20Guardrails/) — why permission scoping matters before you reach Lvl 8–10.
- [`../Glossary/`](../Glossary/) — plain-English definitions of every term used here.
