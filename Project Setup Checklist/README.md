# Project Setup Checklist

My checklist for setting up a new project so Claude Code is productive from the first prompt. Spending 15 minutes here saves hours of the agent guessing, inventing conventions, or breaking things.

> The goal: when an agent opens this repo, everything it needs to act correctly is either in the repo or in `CLAUDE.md`.

---

## 1. Repository & git

- [ ] Repo created (decide **public vs private** deliberately — public is hard to fully un-publish).
- [ ] `git init`, sensible default branch (`main`).
- [ ] `.gitignore` covers OS files (`.DS_Store`), editor dirs, build output, `node_modules`/vendored deps, logs, and **`.env`**.
- [ ] `README.md` with: one-line purpose, stack, setup steps, and run commands.
- [ ] License chosen (or intentionally omitted for private work).
- [ ] Branch protection / PR rules if collaborating.

## 2. `CLAUDE.md` (the highest-leverage step)

- [ ] `CLAUDE.md` at the repo root with the **10 standard sections** (Project Overview, Tech Stack, Architecture, Coding Conventions, UI & Design System Rules, Content & Copy Guidance, Testing & Quality Bar, File & Component Placement, Safe Change Rule, Specific Commands). → see `../CLAUDE.md Best Practices/`.
- [ ] Guidance, not a README copy; link out for exhaustive detail.
- [ ] Git/commit rules stated (branch model, "don't push without asking", multi-repo notes, no AI co-author trailers if that's your preference).
- [ ] Multi-package/repo? A `CLAUDE.md` per package + a root umbrella that routes to them.

## 3. Secrets & config

- [ ] `.env` is git-ignored; only `.env.example` is committed.
- [ ] `.env.example` lists every required variable with safe placeholder values.
- [ ] No real keys/tokens anywhere in the repo or history.
- [ ] Secret manager / CI secrets configured for deploy environments.

## 4. Tooling & quality gates

- [ ] Linter + formatter configured (and the command is in `CLAUDE.md`).
- [ ] Type checking set up (e.g. `tsc --noEmit`) if applicable.
- [ ] Test framework installed with at least one passing test (proves the harness works).
- [ ] **Quality bar defined as runnable commands** — the exact checklist that means "done."
- [ ] Pre-commit hooks (optional) for lint/format/typecheck.
- [ ] Dependency/security audit command available (e.g. `npm audit`, `bundler-audit`, `brakeman`).

## 5. CI/CD

- [ ] CI runs the quality bar on every push/PR (lint, typecheck, tests, build, security scan).
- [ ] Build/deploy pipeline defined (and documented in `CLAUDE.md` → Specific Commands).
- [ ] CI is green before inviting the agent to build on top.

## 6. Project structure

- [ ] Clear, conventional directory layout — documented in `CLAUDE.md` → File & Component Placement.
- [ ] Tests mirror the source tree.
- [ ] Shared config/constants/design tokens have a single home (so the agent reuses, not duplicates).

## 7. Agent enablement (Claude Code)

- [ ] `CLAUDE.md` present and accurate (step 2).
- [ ] Persistent **memory** seeded with non-obvious project facts and your working preferences.
- [ ] Frequently-needed permissions allow-listed to reduce prompts (`/fewer-permission-prompts`).
- [ ] Relevant skills noted (→ see `../Skills/`).
- [ ] For fast-moving deps, point the agent at the installed docs in `CLAUDE.md`.

## 8. First-prompt readiness

- [ ] A fresh agent can answer: *What is this? What's the stack? Where does code go? How do I know a change is done? What must I never touch?* — from the repo + `CLAUDE.md` alone.
- [ ] If it can't, the gap is in `CLAUDE.md`.

---

## Minimal "new repo" sequence

```bash
mkdir my-project && cd my-project
git init -b main
# add README.md, .gitignore (incl. .env), .env.example
# copy the CLAUDE.md template from ../CLAUDE.md Best Practices/ and fill it in
# set up linter + tests; add the quality-bar commands to CLAUDE.md
git add -A && git commit -m "Initial commit: scaffold + CLAUDE.md"
gh repo create my-project --private --source=. --remote=origin --push
```

_Tune this list per stack — trim what doesn't apply, add what's missing._
