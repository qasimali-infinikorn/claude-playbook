# Real Design Process

![Designer Skills — Claude Code, Cursor, GitHub Copilot](./design_skills_hero.png)

How to run a **professional design process inside the terminal** — instead of asking Claude to "build me a nice UI" and hoping. The idea: don't skip the steps a designer would actually take. Each step produces a document that feeds the next, so by the time code gets written, the agent already knows *what* it's building, *for whom*, and *why*.

> The core insight, from Julian Oczkowski's write-up of his designer-skills set: **"Speed without direction just means you waste time faster."** AI lets you generate a UI in seconds — but without process, judgment, and accountability you just generate the *wrong* UI faster. ([source article](https://medium.com/@julian.oczkowski/7-claude-code-design-skills-that-follow-a-real-design-process-b871b8673d05))

---

## Why a process at all?

When you one-shot a prompt like "build a dashboard," the agent has to *guess* everything you didn't say: who uses it, what matters most, what the brand feels like, how pages connect. It guesses generic. You then spend more time correcting a polished-but-wrong result than you'd have spent stating the requirements up front.

A staged process front-loads the decisions. Each stage is cheap (it's just a conversation that writes a markdown/CSS file), and each one removes a class of "wrong guesses" before the expensive stage — writing the actual frontend.

---

## The 7 stages

Run them in order. Each reads the documents the previous stages produced.

| # | Stage | Produces | The question it answers |
|---|---|---|---|
| 1 | **Grill the requirements** | a requirements/grill summary | *What* are we building and *why*? |
| 2 | **Design brief** | a design brief doc | What should it look and feel like? |
| 3 | **Information architecture** | an IA doc (pages, nav, hierarchy) | How is it structured? |
| 4 | **Design tokens** | a theme file (CSS custom properties) | What are the exact colors/type/spacing? |
| 5 | **Brief → tasks** | a sequenced task list | In what order do we build it? |
| 6 | **Frontend build** | working components/pages | Build it. |
| 7 | **Design review** | issues + fixes | Is the output actually good? |

### 1. Grill the requirements
Stress-test the requirements *before* any code. Walk a decision tree — app type, who the users are, scale, edge cases — probing deeper based on each answer. Output a short summary capturing the discussion.

> Rule of thumb: **if you can't articulate what you're building and why, the agent shouldn't be building it yet.**

In this playbook you already have a tool for exactly this: **`grill-me`** (`/grill-me` or `/cs:grill-me <plan>`) — one question per turn, recommended answer + rationale, explores the codebase before asking. See [`../Skills/`](../Skills/).

### 2. Design brief
Generate design documentation that's **informed by the actual codebase**, not invented from nothing. The agent examines existing components and any design system in the repo, asks design-tone questions (mood, references, brand), and suggests visual references. Output a design brief saved to the project.

Pair with **`ui-ux-pro-max`** (styles, palettes, font pairings) and **`frontend-design`** for the aesthetic direction.

### 3. Information architecture
Map the structure: pages, navigation patterns, content hierarchy. The agent reviews all prior docs and asks clarifying questions for complex flows. Output a documented IA. This is what stops the build stage from inventing a random page layout.

### 4. Design tokens
Establish visual consistency by generating complete **CSS custom properties** — colors, typography, spacing, elevation, border radius. If the repo already has a design system, **skip this** and consume the existing one. Output a theme file the frontend imports.

> Tokens-first is what makes the eventual UI look *intentional and consistent* instead of one-off styled per component.

### 5. Brief → tasks
Break the design into actionable work items with **dependencies and sequence**: foundation first, then core UI, then polish. Output a markdown task file with status tracking. Now the build has a checklist, not a vibe.

### 6. Frontend build
*Now* write code — components, pages, layouts — using every document produced above. Because intent, structure, and tokens are already decided, the output is intentional rather than generic. Use **`frontend-design`** / **`ui-ux-pro-max`**; if it's a standalone marketing page, **`landing`** (`/cs:landing`) fits.

### 7. Design review
Audit the output. The agent analyzes the generated frontend and — with the **Playwright MCP server** — can capture screenshots of every page and analyze them, surfacing issues and proposing (or directly applying) fixes.

Stack this with the playbook's general quality gates from [`../Skills/`](../Skills/): **`verify`** (does it actually work when run?), **`code-review`**, and **`simplify`**.

---

## How it maps to skills you already have

You don't need a separate plugin to follow this process — most stages map onto skills already documented in [`../Skills/`](../Skills/):

| Stage | Use |
|---|---|
| 1 Grill | `grill-me` / `/cs:grill-me` |
| 2 Brief | `ui-ux-pro-max`, `frontend-design` (tone + references) |
| 3 IA | Plan mode + a written IA doc (see [`../Prompting Patterns/`](../Prompting%20Patterns/)) |
| 4 Tokens | `ui-ux-pro-max` (palettes, type, spacing) → a theme file |
| 5 Tasks | Plan mode / a `tasks.md` with sequenced, dependency-ordered items |
| 6 Build | `frontend-design`, `ui-ux-pro-max`, `landing` |
| 7 Review | `verify`, `code-review`, `simplify`, Playwright MCP screenshots |

### The dedicated skill set (vendored here)

If you want the opinionated, ready-made version, the original `designer-skills` set is **vendored in [`./skills/`](./skills/)** so you can read exactly what each one does. It bundles **8** `SKILL.md` files — the 7 stages above plus a `design-flow` orchestrator that runs the whole sequence:

| Folder | Stage |
|---|---|
| [`skills/grill-me/`](./skills/grill-me/SKILL.md) | 1 — grill the requirements |
| [`skills/design-brief/`](./skills/design-brief/SKILL.md) | 2 — design brief |
| [`skills/information-architecture/`](./skills/information-architecture/SKILL.md) | 3 — information architecture |
| [`skills/design-tokens/`](./skills/design-tokens/SKILL.md) | 4 — design tokens |
| [`skills/brief-to-tasks/`](./skills/brief-to-tasks/SKILL.md) | 5 — brief → tasks |
| [`skills/frontend-design/`](./skills/frontend-design/SKILL.md) | 6 — frontend build |
| [`skills/design-review/`](./skills/design-review/SKILL.md) | 7 — design review |
| [`skills/design-flow/`](./skills/design-flow/SKILL.md) | — orchestrates all of the above in order |

To install them as live skills instead of just reading them:

```bash
npx skills add julianoczkowski/designer-skills
```

> Vendored from [`julianoczkowski/designer-skills`](https://github.com/julianoczkowski/designer-skills) under the **Apache-2.0** license (see [`skills/LICENSE`](./skills/LICENSE)). Install third-party skills the same way you'd vet any dependency — read what they do first. See [`../Security Guardrails/`](../Security%20Guardrails/).

---

## How to actually run it

1. **One stage per turn, in order.** Don't jump to "build" — let each doc land first.
2. **Keep the artifacts in the repo** (e.g. `design/brief.md`, `design/ia.md`, `design/tokens.css`, `design/tasks.md`). They're context for every later stage *and* for the next session.
3. **Skip stages that don't apply.** Existing design system? Skip tokens. Tiny single component? You may only need stages 1, 6, 7.
4. **Don't skip the grill.** It's the cheapest stage and prevents the most expensive mistakes.
5. **Review with your eyes, not just "done."** Run the app; use screenshots. → [`../Common Mistakes/`](../Common%20Mistakes/)

---

## The one-line version

> Bring the **process** (stages in order), the **judgment** (you make the calls the agent surfaces), and the **accountability** (you review the real output). The terminal just makes each step faster — it doesn't make the steps optional.

---

## See also

- [`../Skills/`](../Skills/) — the design & quality skills referenced above
- [`../Prompting Patterns/`](../Prompting%20Patterns/) — plan-before-code, writing good briefs
- [`../Common Mistakes/`](../Common%20Mistakes/) — including "trusting *done* without verifying"
- [`../Security Guardrails/`](../Security%20Guardrails/) — vetting third-party skills/MCP servers
