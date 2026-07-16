# Loop Engineering

Loop engineering is the practice of designing repeatable AI-agent workflows that keep working until a clear condition is met, or keep monitoring a system and act only when something changes.

Prompt engineering asks, "What should I say next?" Loop engineering asks, "What system should keep deciding the next step, checking the result, and stopping safely?"

The shift matters because an agent can now read files, edit code, run commands, use tools, create branches, call subagents, and repeat. That power is useful only when the loop has a real goal, a verifier, limits, and human sign-off where judgment matters.

---

## R&D summary

Current agent-loop practice combines several ideas:

- **Reason + act loops**: the agent alternates between deciding what to do, taking a tool action, observing the result, and updating the next step. This pattern is formalized in ReAct-style research, where reasoning traces and external actions are interleaved.
- **Self-refinement loops**: the model drafts, critiques, and revises output. Useful for writing, docs, tests, and small code changes, but weak if the same model grades its own work without an external check.
- **Reflection / memory loops**: the agent records what failed and uses that feedback on the next attempt. Useful for retrying failing tests or debugging, but only if the memory is specific and not stale.
- **Search / branching loops**: the agent explores multiple possible solutions before choosing one. Useful for design, architecture, debugging, and optimization, but expensive if unbounded.
- **Operational loops**: the agent runs on a schedule or trigger: check CI, update docs, audit dependencies, triage issues, open a PR, then wait for review.

Good loop engineering is less about clever prompting and more about control systems: goal, state, action, observation, verifier, boundaries, retry cap, and escalation path.

Sources worth reading:

- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
- [Self-Refine: Iterative Refinement with Self-Feedback](https://arxiv.org/abs/2303.17651)
- [Reflexion: Language Agents with Verbal Reinforcement Learning](https://arxiv.org/abs/2303.11366)
- [Tree of Thoughts: Deliberate Problem Solving with Large Language Models](https://arxiv.org/abs/2305.10601)
- [Claude Code subagents](https://code.claude.com/docs/en/sub-agents)
- [Claude Code skills](https://code.claude.com/docs/en/skills)
- [Claude Code hooks](https://code.claude.com/docs/en/hooks)
- [Claude Code worktrees](https://code.claude.com/docs/en/worktrees)

---

## The core model

Every useful loop has seven parts:

| Part | Question | Example |
|---|---|---|
| Goal | What should become true? | "Docs mention every public CLI flag." |
| State | What does the loop know right now? | Current diff, failing test output, issue body. |
| Action | What can the agent do? | Read files, edit docs, run tests, call subagents. |
| Observation | What happened after the action? | Build output, test result, reviewer finding. |
| Verifier | Who or what decides pass/fail? | `npm run docs:build`, CI, screenshot review, human reviewer. |
| Boundary | What must never be changed to pass? | Do not delete tests, do not weaken auth, do not push to main. |
| Stop rule | When does it stop or escalate? | Pass verifier, or stop after 3 failed attempts. |

If any part is missing, the loop will drift.

---

## When to use it

Use a loop when all of these are true:

- The work repeats often enough to deserve automation.
- Progress can be observed with files, command output, APIs, screenshots, or external state.
- "Done" can be judged by a machine or by a clear human review step.
- Mistakes are recoverable because the loop works in a branch, worktree, draft PR, staging environment, or read-only mode.
- The token/runtime cost is acceptable.

Do not use a loop when:

- The task is one-off and easier to do directly.
- The goal is vague: "make this better", "improve quality", "be more strategic".
- The verifier is only the same agent saying "looks good".
- The loop can publish, deploy, merge, spend money, email users, or touch production without a human gate.
- The repository has no quality bar, no tests, no docs, and no clear ownership. A loop amplifies existing process quality; it does not create it from nothing.

---

## Loop types

### 1. Servo loop: work until done

Use for finite tasks with a clear pass condition.

Examples:

- Fix failing tests until the suite is green.
- Update docs until `npm run docs:build` passes.
- Generate a report until the required sections are present.

Skeleton:

```text
while verifier fails and attempts < 3:
  inspect failure
  make the smallest change
  run verifier again
if verifier passes:
  summarize diff and evidence
else:
  stop and ask for human help
```

### 2. Regulator loop: maintain a state

Use for ongoing monitoring.

Examples:

- Check dependency audit weekly and open a PR only when something changed.
- Watch CI and investigate only when a failure appears.
- Check docs drift after releases.

Skeleton:

```text
on schedule:
  read source of truth
  compare against desired state
  if within tolerance: do nothing
  if drift found: create branch, fix, verify, open PR
```

### 3. Plan-build-judge loop

Use for larger work where the implementation and verification should be separated.

Roles:

| Role | Does | Must not do |
|---|---|---|
| Planner | Turns goal into tasks and acceptance criteria | Write production code |
| Builder | Implements the plan | Change the acceptance criteria |
| Judge | Runs verification and reports pass/fail | Fix the code it is judging |

This is the safest default for code work because the same agent should not grade its own homework.

### 4. Branching loop

Use when there are multiple plausible approaches.

Examples:

- Generate three UI directions, then review screenshots.
- Try two debugging hypotheses in separate worktrees.
- Compare two refactor strategies before choosing one.

Keep it small. Branching loops multiply cost quickly.

---

## Claude Code building blocks

Loop engineering in Claude Code usually combines these pieces:

| Building block | Use it for | Playbook reference |
|---|---|---|
| `CLAUDE.md` | Durable project rules, quality bar, safe-change boundaries | [`../CLAUDE.md Best Practices/`](../CLAUDE.md%20Best%20Practices/) |
| Skills | Repeatable procedures loaded only when needed | [`../Skills/`](../Skills/) |
| Subagents | Independent planner, builder, reviewer, debugger, tester roles | [`../Subagents/`](../Subagents/) |
| Hooks | Deterministic gates the model cannot talk around | [`../Claude Directory Layout/`](../Claude%20Directory%20Layout/#3-hooks--hard-gates-at-tool-boundaries) |
| Worktrees | Isolated parallel attempts without file collisions | [`../10 Levels of Claude Code/`](../10%20Levels%20of%20Claude%20Code/#lvl-7--subagents) |
| Headless mode | Scriptable one-shot or CI usage | [`../10 Levels of Claude Code/`](../10%20Levels%20of%20Claude%20Code/#lvl-9--headless) |
| Routines / schedules | Recurring loops | [`../10 Levels of Claude Code/`](../10%20Levels%20of%20Claude%20Code/#lvl-10--routines) |

Minimum setup for a safe loop:

1. `CLAUDE.md` defines the quality bar and safe-change rule.
2. The loop runs on a branch or worktree.
3. The loop has a retry cap.
4. Verification is a command or a human review checklist.
5. The loop opens a PR or report; it does not merge/publish/deploy by itself.

---

## Design checklist

Before creating a loop, fill this in:

```md
# Loop Design: <name>

## Goal
What should become true?

## Trigger
Manual, scheduled, CI event, issue label, file change, or user command?

## Inputs
What sources does the loop read?

## Allowed actions
What may the agent do?

## Denied actions
What must it never do?

## Verifier
What exact command, artifact, or review decides pass/fail?

## Retry cap
How many attempts before stopping?

## Escalation
What should it do when blocked?

## Human gate
Who approves merge, deploy, publish, spend, or external send?

## Evidence
What must the loop report at the end?
```

If you cannot fill in "Verifier", you do not have a loop yet. You have an aspiration.

---

## Best practices

### Make the goal decidable

Bad:

> Improve the docs.

Good:

> Add a Loop Engineering page, link it from README and VitePress sidebar, and pass `npm run docs:build`.

The second version has a clear output and a command that can verify it.

### Define boundaries beside the goal

Bad:

> Make tests pass.

Better:

> Make tests pass without deleting tests, weakening assertions, skipping failing cases, or changing public behavior.

Loops optimize whatever you measure. If the only metric is "tests pass", a bad loop may satisfy it by removing the test.

### Keep the judge independent

Use a separate subagent, CI job, test command, screenshot capture, or human review. Self-review is useful as a first pass, but not as the final gate for meaningful work.

### Use small retry caps

Three attempts is a good default. Past that, the loop is often repeating the same wrong assumption with new wording.

### Preserve evidence

Every loop should end with:

- What changed.
- What was checked.
- Exact command outputs or artifact paths.
- Remaining risks.
- What needs human review.

### Prefer PRs over direct changes

For code and docs, the loop should create a branch and PR. Review remains human-owned.

### Make loops cheap before making them autonomous

Start manual:

1. Run the loop once in chat.
2. Turn the prompt into a skill or command.
3. Add subagents or worktrees only if they remove real friction.
4. Add schedules only after the manual version is reliable.

---

## Sample loops

### Example 1: Docs drift loop

Use when code changes often and docs fall behind.

```md
Goal:
Update docs so public commands and docs navigation match the repository.

Trigger:
Manual before release, or weekly schedule.

Inputs:
- README.md
- .vitepress/config.mts
- package.json scripts
- docs folders

Actions:
- Scan for missing links or stale command names.
- Edit docs only.
- Run npm run docs:build.
- Open a PR.

Boundaries:
- Do not edit source code.
- Do not change package versions.
- Do not publish the site.

Verifier:
npm run docs:build passes.

Stop:
Pass verifier or stop after 3 failed build attempts.
```

Prompt:

```text
Run a docs drift loop:
1. Compare README.md, .vitepress/config.mts, and the docs folders.
2. Find stale navigation, missing pages, and outdated command references.
3. Make docs-only edits.
4. Run npm run docs:build.
5. Stop after 3 failed attempts and explain the blocker.
6. Open a PR; do not merge.
```

### Example 2: Bug fix loop

Use when there is a reproducible failure.

```md
Goal:
The failing test passes and a regression test covers the bug.

Verifier:
The specific failing test passes, then the relevant test file or suite passes.

Boundaries:
- Do not delete or skip tests.
- Do not change unrelated behavior.
- Do not broaden types to hide the problem.
- Do not commit until the diff is reviewed.
```

Prompt:

```text
Fix this bug using a bounded loop:
1. Reproduce the failure first.
2. Identify the smallest failing unit.
3. Add or update a regression test.
4. Make the smallest code change.
5. Run the focused test.
6. If it fails, repeat from the new failure output.
7. Stop after 3 attempts and summarize the blocker.
Do not delete or skip tests. Show me the diff before committing.
```

### Example 3: PR review loop

Use before opening or merging a PR.

```md
Goal:
Find correctness, security, and regression risks in the current diff.

Actions:
- Read the full diff.
- Read surrounding files for context.
- Run tests or static checks when cheap.
- Report findings by severity.

Boundaries:
- Review only; do not edit files.
- No style nits unless they hide a real bug.

Verifier:
Human reviews the findings and decides what to fix.
```

Prompt:

```text
Run a PR review loop on the current diff.
Use a read-only reviewer role.
For each finding, include file:line, severity, concrete failure scenario, and suggested fix.
If no issues are found, say so and list residual risks.
```

### Example 4: Design build loop

Use for UI work that needs visible quality.

```md
Goal:
Build the UI from the design brief and pass visual review at mobile, tablet, and desktop.

Inputs:
- .design/<feature>/DESIGN_BRIEF.md
- .design/<feature>/INFORMATION_ARCHITECTURE.md
- .design/<feature>/DESIGN_TOKENS.css
- .design/<feature>/TASKS.md

Verifier:
- App runs.
- Screenshots captured at 375, 768, and 1280 widths.
- Design review lists must-fix issues.

Boundaries:
- Reuse existing components and tokens.
- Do not introduce a new design system.
- Do not ship without visual evidence.
```

Prompt:

```text
Build the next task from .design/<feature>/TASKS.md using a loop:
1. Read the brief, IA, tokens, and task list.
2. Implement one vertical slice.
3. Run the app.
4. Capture responsive screenshots.
5. Review against the brief.
6. Fix must-fix issues only.
7. Stop and show evidence before moving to the next task.
```

### Example 5: Dependency audit loop

Use for recurring hygiene.

```md
Goal:
Dependencies are audited and only necessary updates are proposed.

Trigger:
Weekly schedule or manual release-prep command.

Actions:
- Run the package manager audit command.
- Identify direct vs transitive issues.
- Update only what is needed.
- Run tests/build.
- Open a PR with risk notes.

Boundaries:
- Do not perform major version upgrades unless requested.
- Do not change package managers.
- Do not auto-merge.
```

Prompt:

```text
Run a dependency audit loop:
1. Inspect package manager and lockfile.
2. Run the audit command.
3. Propose the minimal safe updates.
4. Apply only patch/minor updates unless a major is explicitly required.
5. Run tests/build.
6. Open a PR with what changed, why, and rollback notes.
```

---

## Anti-patterns

### Infinite "make it better" loops

The loop has no measurable end. It will burn time and tokens.

Fix: define a concrete output and a verifier.

### Same agent writes and approves

The loop becomes overly generous about its own work.

Fix: separate builder and judge, or use deterministic commands as the judge.

### Test-passing without behavior protection

The loop optimizes for green tests by weakening tests.

Fix: add boundaries: no skipped tests, no deleted assertions, no lowered coverage, no changed public behavior unless specified.

### Asking questions mid-loop

If a loop depends on clarification after it starts, it will often guess.

Fix: front-load decisions. Ambiguous cases should stop and escalate.

### Automating before stabilizing

Putting a fragile prompt on a schedule just creates scheduled confusion.

Fix: run manually first, then skill/command, then schedule.

---

## Review checklist

Before trusting a loop, ask:

- Is the goal machine-decidable?
- Is there a boundary for what must not change?
- Is the verifier independent from the builder?
- Is there a retry cap?
- Does it run in a branch, worktree, draft PR, or read-only mode?
- Does it preserve evidence?
- Does a human approve merge/deploy/publish/external sends?
- Is cost bounded?
- Is there a clear escalation path?

If any answer is "no", keep the loop manual.

---

## One-line version

> A good loop is not "agent, keep going." A good loop is "agent, work toward this decidable goal, within these boundaries, using this verifier, for this many attempts, then stop and show evidence."

---

## See also

- [`../Harness/`](../Harness/) - building the fixtures, graders, traces, and reports that prove a loop works.
- [`../Prompting Patterns/`](../Prompting%20Patterns/) - writing goals, constraints, and definitions of done.
- [`../Skills/`](../Skills/) - packaging repeatable loops as reusable skills.
- [`../Subagents/`](../Subagents/) - splitting planner, builder, reviewer, debugger, and tester roles.
- [`../Claude Directory Layout/`](../Claude%20Directory%20Layout/) - `.claude/` commands, hooks, skills, agents, and settings.
- [`../Security Guardrails/`](../Security%20Guardrails/) - what loops must never be allowed to do automatically.
- [`../10 Levels of Claude Code/`](../10%20Levels%20of%20Claude%20Code/) - where loops fit with hooks, headless mode, and routines.
