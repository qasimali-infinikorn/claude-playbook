# Getting Started

New to Claude Code? Start here. This gets you from zero to your first useful change in about 15 minutes.

> Claude Code is an AI coding agent that runs in your terminal (and IDE/desktop/web). It can read your repo, write and edit files, run commands, and use git — with your approval.

---

## 1. Install

Claude Code runs in the terminal. Install it (see the official docs for the current command), then verify:

```bash
claude --version
```

It's also available in **VS Code / JetBrains** (extension), the **desktop app** (Mac/Windows), and the **web** (claude.ai/code). Pick whichever fits your flow — they share the same agent.

## 2. Authenticate

The first time you run `claude`, it walks you through signing in. Use your work account if your team has one. If a command needs an interactive login (e.g. `gcloud auth login`), run it yourself in the terminal.

## 3. Open a project

```bash
cd your-project
claude
```

Claude reads the repo's `CLAUDE.md` automatically — that's how it learns the stack, conventions, and rules. (If there's no `CLAUDE.md`, ask a senior to add one, or see `../CLAUDE.md Best Practices/`.)

## 4. Your first session

Just describe what you want in plain English. Good first tasks:

- "Explain how authentication works in this codebase."
- "Where is the resource list rendered?"
- "Add a loading spinner to the favorites page. Show me the diff before committing."

Claude will read files, propose changes, and ask permission before doing anything risky.

## 5. The commands you actually need on day one

| Command | What it does |
|---|---|
| *(just type)* | Describe your task in natural language — this is 90% of usage |
| `/clear` | Start a fresh conversation (do this between unrelated tasks) |
| `/` | See available slash commands and skills |
| `! <cmd>` | Run a shell command yourself in the session (e.g. `! npm test`) |
| `Esc` | Interrupt the agent if it's going the wrong way |

That's enough to be productive. Learn the rest as you go.

---

## The golden rules for newcomers

1. **Be specific.** "Fix the bug in `cart.ts` where totals show NaN when quantity is 0" beats "fix the cart." → `../Prompting Patterns/`
2. **Read every diff before you accept it.** The agent is fast, not infallible. → `../Common Mistakes/`
3. **Verify it works** — run the app/tests, don't just trust "done."
4. **Never paste secrets** (API keys, passwords) into the chat. → `../Security Guardrails/`
5. **Don't push without reviewing.** Ask "show me the diff" first. → `../Git and PR Workflow/`
6. **One task per conversation.** `/clear` when you switch topics.
7. **When stuck, ask Claude to explain** — "walk me through what this does" is a great way to learn the codebase.

---

## Where to go next

- New terms confusing you? → `../Glossary/`
- Want to see it in action? → `../Example Walkthroughs/`
- Quick reference? → `../Cheat Sheet/`
- Setting up a brand-new repo? → `../Project Setup Checklist/`
