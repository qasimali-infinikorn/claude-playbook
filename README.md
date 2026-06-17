# Claude Playbook

A personal, growing knowledge base of findings, patterns, and templates for working effectively with **Claude** and **Claude Code**. The goal is simple: write down what I learn once, so I (and anyone else) can reuse it on the next project instead of rediscovering it.

> Treat this repo as a living notebook. Every time something works well — a prompt pattern, a project-setup trick, a CLAUDE.md convention — capture it here.

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
└── CLAUDE.md Best Practices/
    ├── README.md                   ← how to write a great CLAUDE.md (the 10 standard sections)
    └── CLAUDE.md                   ← a fill-in-the-blank CLAUDE.md template
```

As the playbook grows, new topics get their own top-level folder (e.g. `Prompting Patterns/`, `Skills/`, `Agent Workflows/`), each with its own `README.md`.

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
| [CLAUDE.md Best Practices](./CLAUDE.md%20Best%20Practices/) | The 10 standard sections + a ready-to-use template |

_More topics added over time._
