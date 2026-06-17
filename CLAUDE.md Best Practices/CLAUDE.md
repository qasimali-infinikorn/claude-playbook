<!--
  CLAUDE.md — TEMPLATE
  Copy this file to the root of a new project and fill in each section.
  Rule of thumb: write GUIDANCE (conventions, rules, boundaries), not a copy of the README.
  Keep it skimmable; link to the README/docs for exhaustive detail.
  Delete these comments once filled in. Mark any irrelevant section "N/A — <reason>".
-->

# <Project Name>

> One-line description: what this project is and who it's for.
> (Optional) Multi-repo note: e.g. "This is the API; the client lives in `../frontend`."

## Git Workflow

<!-- Branch model, commit message rules, what to never do (e.g. don't commit from a parent dir, no AI co-author trailers). -->

- Default branch: `main`. Branch for changes; commit/push only when asked.
- <Any repo-specific commit rules.>

# Project Overview

<!-- 2–3 lines on purpose + audience. Link to README / product doc. Don't restate the whole feature list. -->

See `README.md` for the full feature list and setup.

# Tech Stack

<!-- Only what affects how code is written. Call out versions that differ from common defaults / training data. -->

- Framework / language / runtime:
- Data store:
- Auth:
- Styling (if any):
- Tests:
- Full version table: `README.md`.

# Architecture

<!-- The boundaries that matter: how pieces talk, where secrets live, the single chokepoint for X. A small annotated tree beats prose. -->

- Entry points / layout:
- Key boundary (e.g. all API calls go through `lib/api.ts`; secrets never reach the client):
- Data flow / auth flow:

# Coding Conventions

<!-- Specific, enforceable rules. Mention the linter/formatter. -->

- Language style: <e.g. strict types, no `any`> / <e.g. RuboCop Omakase>.
- Patterns to follow: <e.g. fat model / thin controller; logic in `lib/` with tests>.
- Imports: <alias convention>.
- Run `<lint cmd>` and `<typecheck cmd>` before committing. Match surrounding style.

# UI & Design System Rules

<!-- If there's no UI, write: "N/A — API-only project. Design system lives in <where>." -->

- Colors/tokens: <e.g. never hardcode colors; use tokens from `...`>.
- Brand palette: <list / link>.
- Styling approach: <e.g. utilities for simple UI, tokens/inline for complex>.
- Components: <where shared components live; icon library; logo component>.

# Content & Copy Guidance

<!-- Voice, audience, domain vocabulary. For APIs: field naming + error-shape stability. -->

- Audience & tone:
- Domain vocabulary (use consistently): <terms>.
- Microcopy style: <concise, action-first, casing>.
- (API) Field naming + error shape: <rules; update API spec on contract change>.

# Testing & Quality Bar

<!-- Define "done" as a checklist of commands that MUST pass. This is what stops broken work shipping. -->

A change is "done" only when all of these pass:

- [ ] `<typecheck command>`
- [ ] `<lint command>`
- [ ] `<unit test command>`
- [ ] `<e2e / integration command>` (where applicable)
- [ ] `<build command>` (for changes affecting build/config)
- [ ] `<security/audit command>` (if applicable)

Add/extend tests when adding logic. New user-facing flows get an e2e test.

# File & Component Placement

<!-- Where new code/tests/routes/migrations go, so the agent doesn't invent a structure. -->

- Routes / endpoints →
- Reusable logic / types →
- Components →
- Tests → <mirror the source tree>
- DB changes → <migrations; never edit schema by hand>

# Safe Change Rule

<!-- Hard guardrails. What never to touch, what to coordinate, the smallest-diff principle. -->

- Never <e.g. edit `db/schema.rb` by hand — create a migration>.
- Don't weaken security primitives: <auth / CORS / encryption / rate limiting>.
- Secrets stay in `.env` (only `.env.example` is committed); never log or expose them.
- (Multi-repo) <X> is a cross-repo contract change — coordinate and update the API spec.
- Prefer the smallest diff; reuse existing helpers/components/tokens before adding new ones.

# Specific Commands

<!-- The real, copy-paste-accurate commands. -->

```bash
<dev command>          # run locally
<build command>        # production build
<test command>         # unit tests
<e2e command>          # end-to-end tests
<lint command>         # linter
<typecheck command>    # type check
```
