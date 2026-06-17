# CLAUDE.md Best Practices

How to write a `CLAUDE.md` that makes Claude Code genuinely useful on a project — plus a ready-to-copy [template](./CLAUDE.md).

`CLAUDE.md` lives at the root of a repo (and/or in sub-projects). Claude Code reads it automatically and treats its contents as instructions that **override default behavior**. A strong `CLAUDE.md` is the single highest-leverage thing you can add to a codebase for agent productivity.

---

## The golden rule: guidance, not duplication

A `CLAUDE.md` is **not** a second copy of your README. The README documents the project for humans (exhaustive tables, setup steps). The `CLAUDE.md` gives the *agent* the **conventions, rules, and boundaries** it needs to act correctly — and points to the README for exhaustive detail.

- ✅ "Never hardcode colors — use the `C` design tokens from `@/lib/theme-tokens`."
- ❌ A 30-row dependency version table copied from the README.

If a section would just restate the README, keep it to 2–3 lines and link out.

---

## The 10 standard sections

Every `CLAUDE.md` should contain these. Tailor each to the stack — mark a section *Not applicable* with a one-line reason rather than deleting it (e.g. "UI & Design System Rules — N/A, this is an API-only backend").

| # | Section | What it answers |
|---|---|---|
| 1 | **Project Overview** | What is this, who's it for? (2–3 lines + link to README/product doc) |
| 2 | **Tech Stack** | Languages, frameworks, key libs, versions that matter |
| 3 | **Architecture** | How the pieces fit; the important boundaries and data flow |
| 4 | **Coding Conventions** | House style, patterns to follow, anti-patterns to avoid |
| 5 | **UI & Design System Rules** | Tokens, components, brand rules — *or* N/A with a reason |
| 6 | **Content & Copy Guidance** | Voice, audience, domain vocabulary, API field naming |
| 7 | **Testing & Quality Bar** | What "done" means — the exact checks that must pass |
| 8 | **File & Component Placement** | Where new code/tests/routes go |
| 9 | **Safe Change Rule** | Hard boundaries: what never to touch, what to coordinate |
| 10 | **Specific Commands** | The exact commands to run (dev, test, build, lint, deploy) |

See [`CLAUDE.md`](./CLAUDE.md) in this folder for a fill-in-the-blank version with prompts in each section.

---

## Section-by-section tips

1. **Project Overview** — Lead with the one-sentence purpose and the audience. Link to the README and any product doc. Don't re-explain the whole feature set.
2. **Tech Stack** — List only what affects how the agent writes code (e.g. "Tailwind v4 — no config file, theme lives in `globals.css`"). Call out versions that differ from the agent's training data.
3. **Architecture** — Describe the boundaries that matter: where secrets live, how services talk, the single chokepoint for API calls. A small annotated tree beats prose.
4. **Coding Conventions** — Be specific and enforceable: "fat model / thin controller", "no `any`", "all backend calls go through `lib/api.ts`". Mention the linter/formatter.
5. **UI & Design System Rules** — The big wins: "never hardcode colors / use tokens", brand palette, which styling approach for which surface, where shared components live. N/A for non-UI projects.
6. **Content & Copy Guidance** — Audience tone, the product's domain vocabulary (use it consistently), and for APIs: field naming and error-shape stability.
7. **Testing & Quality Bar** — Define *done* as a checklist of commands that must pass (typecheck, lint, unit, e2e, build, security scans). This is what stops "looks done" from shipping broken.
8. **File & Component Placement** — Tell the agent where things go so it doesn't invent a new structure: routes here, logic there, tests mirror the tree.
9. **Safe Change Rule** — The guardrails: "never edit `schema.rb` by hand — migrate", "don't weaken auth/CORS/encryption", "secrets stay in `.env`", "smallest diff; reuse before adding". For multi-repo setups, note what's a cross-repo contract change.
10. **Specific Commands** — A copy-paste block of the real commands. Saves the agent from guessing or grepping `package.json`.

---

## Placement & structure

- **Single repo:** one `CLAUDE.md` at the root.
- **Monorepo / multi-package:** a `CLAUDE.md` per package (scoped + tailored) plus a root umbrella that routes to them. The agent reads the nearest one.
- **Workspace of separate repos:** put a tailored `CLAUDE.md` in each repo, plus an umbrella in the workspace root that makes the separation explicit.

### `@import` trick

Some setups keep the shared rules in `AGENTS.md` (read by multiple agent tools) and make `CLAUDE.md` a one-liner that imports it:

```
@AGENTS.md
```

This keeps one source of truth when you use more than one coding agent.

---

## Anti-patterns to avoid

- **README duplication** — see the golden rule.
- **Vague advice** — "write clean code" tells the agent nothing. "Run `npm run lint` and `npx tsc --noEmit` before committing" does.
- **Stale, time-bound claims** — "currently 26 tests" rots fast; prefer "unit tests must pass".
- **Letting it sprawl** — if it gets long, push detail into linked docs and keep `CLAUDE.md` skimmable.
- **No quality bar** — without an explicit "done means X", the agent can't self-check.

---

## Quick checklist

- [ ] All 10 sections present (or explicitly N/A with a reason)
- [ ] Guidance, not README duplication
- [ ] Conventions are specific and enforceable
- [ ] "Done" is defined as a runnable command checklist
- [ ] Safe-change boundaries are explicit
- [ ] Commands block is copy-paste accurate
- [ ] Skimmable; detail is linked, not inlined
