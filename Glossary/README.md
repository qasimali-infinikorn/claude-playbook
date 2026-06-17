# Glossary

Plain-English definitions of the terms you'll hear when working with Claude and Claude Code. No prior knowledge assumed.

---

## The basics

**Claude** — Anthropic's AI model (the "brain"). Comes in sizes: **Opus** (most capable, for hard problems), **Sonnet** (balanced everyday default), **Haiku** (fastest/cheapest, for simple high-volume tasks).

**Claude Code** — the AI coding *agent* that runs in your terminal/IDE. It uses Claude plus tools (read files, edit code, run commands, git) to actually do work in your repo.

**Prompt** — what you type to Claude. The instruction or question. Better prompts = better results.

**Agent** — an AI that can take actions (run tools, edit files), not just chat. Claude Code is an agent.

**Token** — the unit of text the model processes (roughly ¾ of a word). Cost and limits are measured in tokens.

**Context window** — how much text Claude can "hold in mind" at once (your conversation + files it has read). When it fills up, older parts get summarized.

---

## Working with the codebase

**`CLAUDE.md`** — a file at the repo root that Claude reads automatically. It tells the agent the project's purpose, stack, conventions, and rules. The single most important file for agent productivity. → `../CLAUDE.md Best Practices/`

**`AGENTS.md`** — same idea as `CLAUDE.md` but read by multiple AI coding tools; sometimes `CLAUDE.md` just imports it with `@AGENTS.md`.

**Diff** — the set of changes between before and after (added/removed lines). Always review the diff before accepting a change.

**Memory** — persistent notes Claude keeps across sessions (your preferences, project facts) so you don't re-explain them every time.

---

## Commands & extensions

**Slash command** — a command you trigger with `/`, e.g. `/clear`, `/code-review`. Type `/` to see what's available.

**Skill** — a specialized capability Claude can use, often triggered by a slash command (e.g. `/grill-me`) or auto-invoked when your request matches. → `../Skills/`

**Plan mode** — a mode where Claude designs the approach (which files, what steps) and waits for your OK *before* writing code. Use it for anything non-trivial.

**Hook** — an automated action the tool runs at certain points (e.g. run the linter after every edit). Configured in settings, not by the agent.

**MCP (Model Context Protocol)** — a standard that lets Claude connect to external tools and data sources (Figma, Gmail, a database, etc.) through "MCP servers."

**MCP server** — a connector that exposes a tool/service to Claude over MCP (e.g. the Figma MCP server lets Claude read/write designs).

**Subagent** — a separate agent Claude can spawn to handle a focused task in its own context, then report back.

---

## Quality & workflow

**Quality bar** — the explicit checklist that defines "done" for a change (e.g. typecheck clean + tests pass + build ok). → `../CLAUDE.md Best Practices/`

**Hallucination** — when the model states something confidently that isn't true (a made-up API, a wrong file path). Why you always verify.

**Prompt caching** — an API feature that reuses unchanged parts of a prompt across calls to cut cost/latency. Put stable content first to benefit.

**Few-shot** — giving the model examples of the input→output you want, so it follows the pattern.

**Extended thinking** — letting the model reason step-by-step before answering, for harder problems.

---

_Heard a term that's not here? Add it — future newcomers will thank you._
