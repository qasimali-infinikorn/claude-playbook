# Claude Playbook

A personal, growing knowledge base of findings, patterns, and templates for working effectively with **Claude** and **Claude Code**. The goal is simple: write down what I learn once, so I (and anyone else) can reuse it on the next project instead of rediscovering it.

> Treat this repo as a living notebook. Every time something works well — a prompt pattern, a project-setup trick, a CLAUDE.md convention — capture it here.

**👋 New to Claude Code?** Start with [`Getting Started/`](./Getting%20Started/), keep the [`Cheat Sheet/`](./Cheat%20Sheet/) handy, and skim the [`Glossary/`](./Glossary/) when a term trips you up.

---

## Why this exists

Working with an AI coding agent gets dramatically better when the project gives it the right context up front. A lot of that knowledge is reusable across projects but easy to forget. This repo is where I bank it:

- **Repeatable conventions** — e.g. the standard sections every `CLAUDE.md` should have.
- **Templates** — copy-paste starting points so a new project is set up correctly in minutes.
- **Findings** — things I learned the hard way, so I don't relearn them.

---

## Repository structure

```
claude-playbook/
├── README.md                       ← you are here
│
│   # Start here (newcomers)
├── Getting Started/                ← install, auth, first session, day-one commands
├── Glossary/                       ← plain-English definitions of the jargon
├── Example Walkthroughs/           ← annotated real sessions (bug fix, feature, review)
├── Cheat Sheet/                    ← one-page quick reference
│
│   # Working well
├── Prompting Patterns/             ← how to prompt for reliable results
├── Skills/                         ← the skills I use most, and when
├── Common Mistakes/                ← mistakes + the fix for each
│
│   # Doing it safely
├── Git and PR Workflow/            ← branch, review, commit, PR — without footguns
├── Security Guardrails/            ← the non-negotiables
├── Troubleshooting and FAQ/        ← "it's not working" → fixes
│
│   # Setting up projects
├── CLAUDE.md Best Practices/       ← the 10 standard sections + a fill-in template
└── Project Setup Checklist/        ← make a new project agent-ready
```

As the playbook grows, new topics get their own top-level folder, each with its own `README.md`.

---

## How to use it

- **Starting a new project?** Open [`CLAUDE.md Best Practices/`](./CLAUDE.md%20Best%20Practices/), copy the template `CLAUDE.md` into your repo root, and fill in the 10 sections.
- **Learned something new?** Add it to the relevant folder (or create a new one) and link it from this README.
- **Browsing?** Each folder's `README.md` is the entry point for that topic.

---

## What's a `CLAUDE.md`?

`CLAUDE.md` is a file Claude Code reads automatically to understand a project: its purpose, stack, conventions, and the rules it must follow. A good one turns a generic agent into one that already knows your codebase's house style. The first topic in this playbook documents how to write one well.

---

## Contributing to my future self

Keep entries:

- **Concrete** — real commands, real rules, real examples, not vague advice.
- **Reusable** — guidance that applies beyond the one project it came from.
- **Honest** — note what *didn't* work too; negative findings save time.
- **Linked** — add a pointer from the nearest `README.md` so it's discoverable.

---

## Index

| Topic | What's inside |
|---|---|
| **Start here** | |
| [Getting Started](./Getting%20Started/) | Install, authenticate, your first session, the commands you need day one |
| [Glossary](./Glossary/) | Plain-English definitions (skill, agent, MCP, CLAUDE.md, plan mode, …) |
| [Example Walkthroughs](./Example%20Walkthroughs/) | Annotated real sessions: fix a bug, add a feature, review a diff, learn a codebase |
| [Cheat Sheet](./Cheat%20Sheet/) | One-page quick reference: commands + do's/don'ts + when-stuck |
| **Working well** | |
| [Prompting Patterns](./Prompting%20Patterns/) | Patterns for prompting Claude & Claude Code, plus API/SDK findings |
| [Skills](./Skills/) | The skills I use most (ui-ux-pro-max, grill-me, frontend-design, docs…) and when to use each |
| [Common Mistakes](./Common%20Mistakes/) | Mistakes I've made working with Claude + the fix for each |
| **Doing it safely** | |
| [Git & PR Workflow](./Git%20and%20PR%20Workflow/) | Branch, review the diff, commit, open a PR — without footguns |
| [Security Guardrails](./Security%20Guardrails/) | The non-negotiables: secrets, destructive commands, prod, never weaken security |
| [Troubleshooting & FAQ](./Troubleshooting%20and%20FAQ/) | Common "it's not working" situations and their fixes |
| **Setting up projects** | |
| [CLAUDE.md Best Practices](./CLAUDE.md%20Best%20Practices/) | The 10 standard sections + a ready-to-use template |
| [Project Setup Checklist](./Project%20Setup%20Checklist/) | Steps to make a new project agent-ready from the first prompt |

_More topics added over time._
