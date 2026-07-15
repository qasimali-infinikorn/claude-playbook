# Subagents

A subagent is a separate Claude instance Claude Code can delegate to: its own context window, its own restricted tool list, optionally its own model. The parent session hands off a focused task, the subagent does the work in isolation, and only its final report comes back — the parent's context never fills up with the subagent's intermediate reads/greps/trial-and-error.

> Read this alongside [`../10 Levels of Claude Code/`](../10%20Levels%20of%20Claude%20Code/) (Lvl 7) and [`../Claude Directory Layout/`](../Claude%20Directory%20Layout/#1-agents--subagents-you-delegate-to) (frontmatter reference).

---

## Why delegate instead of just asking directly

- **Context isolation.** A code review or a debugging session can burn tens of thousands of tokens of exploratory reads. Run it in a subagent and your main session only sees the verdict, not the search.
- **Tool scoping.** A `debugger` subagent doesn't need `Write` — give it `Read, Glob, Grep, Bash` only, and it structurally can't "fix" something it should only be diagnosing.
- **Parallelism.** Independent subagents can run at the same time. Reviewing a diff and profiling its performance impact don't depend on each other — dispatch both at once instead of serially.
- **Repeatable expertise.** Write the reviewer's standards once, in one file, instead of re-explaining "check for security issues and dead code" in every prompt.

---

## Global vs project subagents

- `~/.claude/agents/*.md` — **global**, available in every repo on this machine. Use for personal habits and general engineering roles that aren't project-specific.
- `.claude/agents/*.md` — **project**, checked into git, shared with the team, specific to that codebase.

This playbook documents 7 global subagents as personal, cross-project defaults. Treat them as a reference roster: copy the roles that fit your own workflow, or create project-level versions under `.claude/agents/` when they should be shared with a team.

---

## The 7 subagents installed globally

| Subagent | Tools | Model | Triggers on |
|---|---|---|---|
| [`ui-designer`](#ui-designer) | Read, Write, Edit, Glob, Grep, Bash, WebFetch | opus | Designing/building/redesigning UI |
| [`code-reviewer`](#code-reviewer) | Read, Glob, Grep, Bash | opus | Reviewing a diff before merge |
| [`debugger`](#debugger) | Read, Glob, Grep, Bash | opus | Root-causing a failure |
| [`test-writer`](#test-writer) | Read, Write, Edit, Glob, Grep, Bash | sonnet | Adding test coverage (single function/unit level) |
| [`sdet-automation`](#sdet-automation) | Read, Write, Edit, Glob, Grep, Bash | sonnet | API/UI test automation + test strategy (SDET level) |
| [`performance-optimizer`](#performance-optimizer) | Read, Glob, Grep, Bash | opus | A measured slowness, not a hunch |
| [`hermes-manager`](#hermes-manager) | Read, Bash, Grep, Glob | sonnet | Configuring/troubleshooting the Hermes Agent install |

Notice the pattern: the four audit-only roles (`code-reviewer`, `debugger`, `performance-optimizer`, `hermes-manager`) deliberately have no `Write`/`Edit` — that's what stops a reviewer from "helpfully" fixing what it was only asked to diagnose. `ui-designer`, `test-writer`, and `sdet-automation` produce code, so they get write access.

`test-writer` vs `sdet-automation`: `test-writer` is generic — unit/integration tests for whatever code exists, in whatever framework the project already uses. `sdet-automation` is framework-aware at the SDET level — it picks RestAssured vs. Playwright vs. Selenium based on what's under test, runs exploratory test design before scripting, and prioritizes coverage by risk. Reach for `test-writer` on "add tests for this function"; reach for `sdet-automation` on "build an API test suite" or "what should we test first."

### `ui-designer`
**File:** `~/.claude/agents/ui-designer.md` · **Tools:** Read, Write, Edit, Glob, Grep, Bash, WebFetch · **Model:** opus

Builds, polishes, or redesigns UI with real design taste instead of templated output. Picks a design direction deliberately (`design-taste-frontend` / `high-end-visual-design` / `gpt-taste` / `industrial-brutalist-ui` / `minimalist-ui`) based on the brief, audits-first on redesigns (`redesign-existing-projects`), and always runs a polish pass (`emil-design-eng`). It explicitly invokes `review-animations` on any motion it writes, because that skill is set to never auto-trigger.

**Backed by these globally installed skills** (`~/.claude/skills/`): `design-taste-frontend`, `high-end-visual-design`, `gpt-taste`, `industrial-brutalist-ui`, `minimalist-ui`, `redesign-existing-projects`, `emil-design-eng`, `review-animations`, `animation-vocabulary`. Sources: [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill), [emilkowalski/skills](https://github.com/emilkowalski/skills).

**Use it for:** "design a pricing page," "this dashboard looks generic, make it feel premium," "redesign this component without breaking it," "build a landing page with strong motion."

### `code-reviewer`
**File:** `~/.claude/agents/code-reviewer.md` · **Tools:** Read, Glob, Grep, Bash · **Model:** opus

Reviews a diff (not the whole repo) for correctness bugs, security issues, and quality problems. Reads full files for context, not just diff hunks. Reports findings ranked by severity with file:line and a concrete failure scenario — no style nits, no hypothetical issues without a real trigger.

**Use it for:** "review my changes before I open a PR," "second opinion on this diff," pairing with `/code-review` for a second, independently-reasoned pass.

### `debugger`
**File:** `~/.claude/agents/debugger.md` · **Tools:** Read, Glob, Grep, Bash · **Model:** opus

Root-causes a failing test, crash, or bug report. Reproduces first, reads the actual stack trace, works backwards from the failure point using `git blame`/`git log -p` to find when behavior changed, and verifies a hypothesis with evidence before proposing a fix. Explicitly told not to stop at a symptom-level fix (e.g. catching and swallowing an exception).

**Use it for:** "why is this test failing," "this crashes in prod with X, figure out why," "this used to work and now doesn't."

### `test-writer`
**File:** `~/.claude/agents/test-writer.md` · **Tools:** Read, Write, Edit, Glob, Grep, Bash · **Model:** sonnet

Writes tests that catch real regressions: happy path, boundaries, error handling, and edge cases implied by the code's own conditionals. Matches the project's existing test framework and conventions rather than assuming one. Runs the suite after writing to confirm green.

**Use it for:** "add tests for this function," "write a regression test for the bug we just fixed," "this file has no coverage."

### `sdet-automation`
**File:** `~/.claude/agents/sdet-automation.md` · **Tools:** Read, Write, Edit, Glob, Grep, Bash · **Model:** sonnet

Builds test automation and test strategy at a senior-SDET level. Routes to the right already-installed skill based on what's under test — `api-restassured` for REST APIs, `playwright-ui-automation` or `selenium-webdriver-automation` for browser/E2E — and to `exploratory-test-designer` / `test-intelligence-feed` when the ask is strategy-shaped ("what should we test first," coverage-gap analysis, a risk-based test plan) rather than test-shaped. Runs exploratory design before scripting, matches the project's existing conventions instead of introducing a second stack, and always runs what it writes before calling it done.

**Backed by these globally installed skills** (`~/.claude/skills/`): `api-restassured`, `playwright-ui-automation`, `selenium-webdriver-automation`, `exploratory-test-designer`, `test-intelligence-feed` — the same 5-skill breakdown as [JapneetSachdeva1/sdet-automation-skills](https://github.com/JapneetSachdeva1/sdet-automation-skills), already present from an existing plugin marketplace rather than installed fresh.

**Use it for:** "build an API test suite for this service," "write E2E tests for the checkout flow," "what should we test first, we have no test plan," "find our coverage gaps." Not for a quick test on one function — that's `test-writer`.

### `performance-optimizer`
**File:** `~/.claude/agents/performance-optimizer.md` · **Tools:** Read, Glob, Grep, Bash · **Model:** opus

Profiles before touching anything — no optimization without a baseline measurement. Finds the actual bottleneck (flame graph, query plan, bundle analyzer), fixes the highest-impact one first, and re-measures to report real before/after numbers.

**Use it for:** "this page feels slow," "why is this query taking 4 seconds," "our bundle size grew, find out why." Not for speculative optimization with no measured problem.

### `hermes-manager`
**File:** `~/.claude/agents/hermes-manager.md` · **Tools:** Read, Bash, Grep, Glob · **Model:** sonnet

Configures, scripts, and troubleshoots a local [Hermes Agent](https://hermes-agent.nousresearch.com/) install (`~/.hermes`) — Nous Research's standalone, self-hosted autonomous agent runtime. This is a **separate system from Claude Code**, not a skill or plugin; the subagent operates it entirely through the `hermes` CLI. Always runs `hermes doctor` first to see what's actually configured before touching anything. Explicitly refuses to run `hermes setup` or fabricate API keys/bot tokens — provider credentials and messaging-platform tokens (Discord, Telegram, …) always require the user directly.

**Use it for:** "why is `hermes doctor` warning about X," "help me write a hermes cron job," "draft a config.yaml change to switch models," "explain what the gateway setup needs from me." Not for anything inside `.claude/` — that's a different system entirely.

---

## How to actually invoke a subagent

**Automatic delegation.** Just describe the task normally — Claude Code matches your request against every subagent's `description` and delegates on its own when one fits closely enough:

> "Review the changes I just made before I commit."

→ delegates to `code-reviewer` without you naming it.

**Explicit invocation.** Name the subagent when you want to force it, or when the automatic match might pick the wrong one:

> "Use the debugger subagent to figure out why `test_auth_flow` is flaky."

**Parallel dispatch.** Ask for multiple subagents in one message when the tasks are genuinely independent — this is the actual point of Lvl 7:

> "Have code-reviewer review this diff and performance-optimizer check whether the new query introduced an N+1, at the same time."

Claude Code runs both, then synthesizes the two reports for you. Don't parallelize subagents whose output feeds into each other — dispatch those sequentially instead (e.g. `debugger` finds the root cause → then `test-writer` writes the regression test for it).

**Senior-engineer workflow example** — shipping a feature end to end:

1. You implement the feature directly (subagents aren't for greenfield feature work — keep that in the main session where you're steering).
2. Dispatch `test-writer` to add coverage while you start the next thing.
3. Before opening the PR: dispatch `code-reviewer` and `performance-optimizer` in parallel against the diff.
4. If CI reports a flaky test: dispatch `debugger`, not `code-reviewer` — you want root cause, not a style pass.
5. If the feature has a UI surface: dispatch `ui-designer` for a taste pass before you consider it done — self-generated interfaces default to generic without an explicit push against that.

---

## Writing your own subagent

```markdown
---
name: my-subagent
description: One or two sentences a matcher can use to decide "does this task belong here." Be specific — vague descriptions cause wrong auto-delegation.
tools: Read, Glob, Grep, Bash    # omit to inherit all tools; scope it down deliberately instead
model: opus                       # optional — sonnet/opus/haiku/inherit
---

You are a <role>. <Numbered, concrete steps for how it should approach the task — not vague
"do a good job" instructions. Tell it what to check, in what order, and what "done" means.>
```

Rules of thumb learned from building the 7 above:
- **Scope `tools` down on purpose.** A reviewer or debugger shouldn't have `Write`/`Edit` — that's what keeps it from "helpfully" fixing something it was only asked to diagnose.
- **Description is the router.** Claude picks a subagent by matching your request against every installed subagent's `description`. Two subagents with overlapping descriptions will conflict — keep them distinct.
- **Reference skills by name in the body** if the subagent should lean on specific installed skills (see `ui-designer` above) — don't assume the right skill will auto-fire inside a subagent's fresh context, especially any skill with `disable-model-invocation: true`.
- **Give it a definition of done**, not just a task description — "report findings ranked by severity" beats "review the code."

---

## Related

- [`../10 Levels of Claude Code/`](../10%20Levels%20of%20Claude%20Code/) — where subagents (Lvl 7) sit relative to skills, hooks, and routines.
- [`../Claude Directory Layout/`](../Claude%20Directory%20Layout/#1-agents--subagents-you-delegate-to) — verified subagent frontmatter fields.
- [`../Skills/`](../Skills/) — skills the `ui-designer` subagent draws on.
- [`../Security Guardrails/`](../Security%20Guardrails/) — scoping `tools` and permissions before you delegate broadly.
