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

### `/goal` (built-in Claude Code command)
**What:** Sets a measurable completion condition and keeps Claude working across turns until a separate evaluator decides that condition is satisfied. It is built into Claude Code 2.1.139 and newer—there is no skill or plugin to install.
**When:** Use it for substantial work with an objective end state: finishing a migration until the build passes, implementing every acceptance criterion in a spec, reducing files below a size limit, or clearing a defined issue queue.
**Avoid when:** The task needs subjective approval, has no reliable verifier, can cause uncontrolled external side effects, or requires decisions only you can make.

#### Basic usage

Set one completion condition for the current session:

```text
/goal all tests in test/auth pass and npm run lint exits 0
```

Setting the goal starts work immediately; you do not need to send another prompt. If a goal is already active, a new `/goal <condition>` replaces it.

Check its condition, elapsed time, evaluated turns, token use, and latest evaluator reason:

```text
/goal
```

Stop it before completion:

```text
/goal clear
```

`stop`, `off`, `reset`, `none`, and `cancel` also work in place of `clear`. Starting a fresh conversation with `/clear` removes the active goal too.

#### Write a good completion condition

A useful goal contains three things:

1. **Measurable result** — what must be true when the work is done.
2. **Verifier** — the command, output, count, or other evidence that proves it.
3. **Constraints and stop bound** — what must not change and when to stop if blocked.

```text
/goal migrate src/auth from the legacy client to AuthClient; npm test -- auth and npm run typecheck both exit 0; do not change public API behavior or edit unrelated test files; stop after 15 turns if the checks still fail and report the blocker
```

The evaluator does not run commands or inspect files itself. It judges only evidence Claude surfaces in the conversation, so tell Claude which checks to run and require their results in the transcript. Conditions may be up to 4,000 characters.

**Weak:**

```text
/goal improve the codebase
```

There is no observable definition of "improve," so the evaluator cannot reliably know when to stop.

**Better:**

```text
/goal split src/api.ts into focused modules of at most 300 lines each; npm test and npm run typecheck exit 0; preserve exported APIs; stop after 12 turns and summarize any blocker
```

#### Non-interactive use

`/goal` also works with print mode, completing the loop in one CLI invocation:

```bash
claude -p "/goal CHANGELOG.md contains an entry for every PR merged this week, verified against the git log; stop after 10 turns if repository evidence is insufficient"
```

Press `Ctrl+C` to interrupt it. An active goal is restored when you resume the session with `claude --resume` or `claude --continue`, although its timer, turn count, and token baseline reset.

#### How it works and what it costs

After each main turn, Claude Code sends the condition and conversation to the configured small, fast model (Haiku by default). A "no" decision starts another turn and supplies the evaluator's reason as guidance; a "yes" decision records the goal as achieved and clears it. Those evaluator calls use tokens in addition to the main work, though they are normally much smaller.

Only one goal can be active per session. `/goal` requires a trusted workspace and the hooks system; managed settings such as `disableAllHooks` can make it unavailable.

#### `/goal` vs related features

| Feature | Starts another turn when | Stops when |
|---|---|---|
| `/goal` | The previous turn ends | A separate model confirms the condition |
| `/loop` | A scheduled interval elapses | You stop it or Claude decides it is done |
| Stop hook | The previous turn ends | Your reusable script or prompt says to stop |
| Auto mode | Does not start extra turns | Claude's current turn finishes |

Use `/goal` for a session-specific outcome. Use `/loop` for recurring time-based work, a Stop hook for reusable deterministic policy, and auto mode to reduce tool-approval interruptions inside a turn. Auto mode and `/goal` can complement each other, but permission changes do not broaden what the task is authorized to do.

**Source:** [Official Claude Code `/goal` documentation](https://code.claude.com/docs/en/goal)

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

## How to evaluate a skill before installing it

A skill is executable influence over an agent that may already have access to your shell, files, credentials, and external tools. Treat it like software, not like a harmless prompt.

### The quality bar

| Check | Good evidence | Warning sign |
|---|---|---|
| Clear job | One specific workflow and an explicit definition of done | Vague claims that it makes the agent "better" at everything |
| Real leverage | Deterministic scripts, templates, references, or domain knowledge | A long prompt repeating advice the model already knows |
| Progressive loading | Small `SKILL.md`; supporting detail loaded only when needed | Huge instructions injected into every matching turn |
| Verifiable claims | Commands, fixtures, expected outputs, or cited sources | Testimonials, benchmark numbers, or safety claims with no evidence |
| Declared effects | Files, network calls, subprocesses, and credentials are named | Hidden downloads, telemetry, or shell execution |
| Least privilege | Read-only first; narrow tools and paths | Broad filesystem, network, or write access for a narrow job |
| Failure behavior | Retry cap, cleanup path, and honest blocked state | Infinite loops, swallowed errors, or "continue until done" without limits |
| Tests or evals | Representative fixtures and an executable pass/fail check | Only a polished README or happy-path demo |
| Maintenance | Version, source, license, and recent verification date | Unpinned dependencies and no indication of compatibility |

### Review procedure

1. Read `SKILL.md` completely.
2. Follow every referenced script, template, hook, MCP configuration, and executable file.
3. Search for network calls, package installation, destructive commands, secrets access, and writes outside the project.
4. Check what triggers the skill; an over-broad description may activate it unexpectedly.
5. Inspect its dependencies and license.
6. Run its evals in a sandbox or disposable repository.
7. Try one representative success case and one failure case.
8. Install locally first. Promote it to project/team scope only after it proves useful.
9. Record the version, source, purpose, permissions, and removal command.

Useful inspection commands after cloning a candidate skill:

```bash
rg --files path/to/skill
rg -n "curl|wget|fetch\(|requests\.|subprocess|child_process|rm |sudo|\.env|API_KEY" path/to/skill
```

These searches are leads, not a security verdict. Read the code around every match.

### Minimal skill eval

```md
# Eval: <skill-name>

## Fixture
A disposable repository or input representing normal use.

## Task
The exact request that should trigger the skill.

## Pass
- Expected artifact exists.
- Required verifier exits 0.
- No file outside the allowed paths changed.
- No undeclared network or external action occurred.

## Failure case
Give it missing credentials, invalid input, or a failing verifier.
It must stop clearly without fabricating success or damaging state.

## Evidence
Record commands, outputs, changed files, runtime, and model/token cost.
```

### Installation decision

- **Install:** unique value, narrow permissions, reviewed code, representative eval passes.
- **Adapt locally:** useful idea, but triggers, permissions, dependencies, or output format need tightening.
- **Do not install:** hidden effects, unverifiable claims, excessive access, unsafe failure behavior, or no value beyond generic prompting.

Source inspiration: the evidence-first quality bar in [Awesome LLM Apps agent skills](https://github.com/Shubhamsaboo/awesome-llm-apps/tree/main/agent_skills). This checklist is adapted for the permission and verification practices in this playbook.

---

## How to discover more

- Type `/` in Claude Code to see available slash commands/skills.
- Many skills auto-trigger from natural language — you rarely *have* to type the command.
- Plugin skills are namespaced (e.g. `document-skills:docx`, `engineering-skills:code-reviewer`); the short name usually works too.

_Add skills here as you find ones worth keeping in the rotation._
