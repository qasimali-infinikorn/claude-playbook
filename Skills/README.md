# Skills I Use

A curated list of the Claude / Claude Code **skills** I reach for most — what each one does, when to use it, and how to invoke it. Skills are specialized capabilities you trigger with a slash command (e.g. `/grill-me`) or that Claude auto-invokes when your request matches.

> Tip: when in doubt, just describe the task — Claude often picks the right skill automatically. Type the slash command when you want to force it.

---

## 🎨 Design & Frontend

### `ui-ux-pro-max`
**What:** UI/UX design intelligence — 67 styles, 96 palettes, 57 font pairings, charts, and 13 stacks (React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter, Tailwind, shadcn/ui). Integrates the shadcn/ui MCP for component search.
**When:** Planning, building, reviewing, or improving any UI — websites, landing pages, dashboards, admin panels, SaaS, e-commerce, mobile apps. Also for color palettes, accessibility, animation, typography, spacing.
**Invoke:** describe the UI task, or ask it to "plan / build / review / improve" a screen or component.

### `frontend-design`
**What:** Creates distinctive, production-grade frontend interfaces with high design quality — avoids generic "AI-looking" aesthetics.
**When:** Building web components, pages, artifacts, posters, or apps where the *look* matters and you want polish, not boilerplate.
**Invoke:** ask to build/style a component or page and call out that you want a strong, non-generic design.

### `landing` (`/cs:landing`)
**What:** Generates a premium single-file HTML landing page with GSAP 3D animations, scroll reveals, and parallax. Asks 4 intake questions (product / audience / brand / tone) first.
**When:** You need a polished standalone landing page fast.

---

## 🧠 Planning & Thinking

### `grill-me` (`/grill-me` or `/cs:grill-me <plan>`)
**What:** A relentless plan/design interrogator. Walks the decision tree one branch at a time, asks **one question per turn** with a recommended answer + rationale, and explores the codebase before asking.
**When:** You want to stress-test a plan or design *before* building — surfaces the decisions you haven't made yet.
**Invoke:** `/grill-me` (point it at a plan or describe what you're about to build).

### `reflect` (`/cs:reflect`)
**What:** Mid-conversation reflection — halts, re-reads the thread from the original goal, runs a 5-dimension analysis, and ends with a Continue / Pivot / Pause recommendation. Honest, no manufactured problems.
**When:** A session feels off-track or sprawling and you want a gut-check.

### `Plan` mode / "plan before code"
**What:** Have Claude design the implementation (files to change, approach, trade-offs) and wait for your OK before editing.
**When:** Any multi-file or ambiguous task. Cheap insurance against wrong assumptions. (See `../Prompting Patterns/`.)

---

## 📄 Documents

These auto-trigger when you mention the file type, or invoke by name.

| Skill | Use it for |
|---|---|
| `docx` | Create / read / edit Word docs — reports, memos, letters, templates, TOCs, tracked changes |
| `pdf`  | Read, merge, split, fill forms, watermark, OCR, or create PDFs |
| `pptx` | Build / edit PowerPoint decks |
| `xlsx` | Create / read / edit Excel spreadsheets and formulas |

**When:** Any deliverable that needs to be an Office/PDF file rather than markdown. Say e.g. "turn this into a Word doc" or "merge these PDFs."

---

## ⚙️ Workflow & Productivity

### `handoff` (`/cs:handoff <next-focus>`)
**What:** Compacts the current conversation into a handoff document for a fresh agent — references PRDs/issues instead of copying them, and recommends skills for the next session.
**When:** Ending a session, switching machines, or passing work to another agent (or a future you).

### `capture` (`/cs:capture <dump>`)
**What:** Brain-dump organizer — turns an unstructured stream of thoughts/tasks/ideas into a 4-section actionable system (Projects/Ideas, Tasks, Connections, How I Can Help). No fabricated connections.
**When:** You have a messy pile of thoughts and want structure without losing anything.

### `research` (`/cs:research <question>`)
**What:** Default research entry point — classifies the question and routes to a specialist (recency `pulse`, academic `litreview`, entity `dossier`, patents, etc.) or runs its own search workflow. Always shows the routing decision.
**When:** Any non-trivial research task.

---

## ✅ Code Quality

### `code-review` (`/code-review [low|medium|high|ultra]`)
**What:** Reviews the current diff for correctness bugs and reuse/simplification/efficiency cleanups at the chosen effort. `--comment` posts inline PR comments; `--fix` applies findings. `ultra` = deep multi-agent cloud review.
**When:** Before committing or opening a PR.

### `verify`
**What:** Verifies a change actually does what it should by running the app and observing real behavior.
**When:** Confirming a fix/feature works before pushing — not just "tests pass," actual behavior.

### `karpathy-check` (`/karpathy-check`)
**What:** Reviews staged changes against Karpathy's 4 coding principles — complexity, diff noise, hidden assumptions, goal verification.
**When:** A sanity gate before committing.

### `simplify`
**What:** Reviews changed code for reuse, simplification, efficiency, and altitude — then applies the fixes. Quality only (use `code-review` for bug-hunting).
**When:** Tightening up a diff after it works.

---

## 🛠️ Meta (build your own)

### `write-a-skill` (`/cs:write-a-skill <name>`)
**What:** Authors a new agent skill with a 3-phase workflow (Gather → Draft → Review) and a 6-item review-checklist gate.
**When:** A recurring task is worth turning into a reusable skill.

### `workflow-builder` (`/cs:workflow-build <task>`)
**What:** Designs and writes a deterministic Claude Code workflow (`.js`) — intake questions, proposes a topology, scaffolds + validates.
**When:** Automating a repeatable multi-step pipeline.

---

## How to discover more

- Type `/` in Claude Code to see available slash commands/skills.
- Many skills auto-trigger from natural language — you rarely *have* to type the command.
- Plugin skills are namespaced (e.g. `document-skills:docx`, `engineering-skills:code-reviewer`); the short name usually works too.

_Add skills here as you find ones worth keeping in the rotation._
