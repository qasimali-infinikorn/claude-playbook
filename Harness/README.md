# Harness

A harness is the test rig around an AI agent.

It gives the agent a controlled task, tools, fixtures, limits, and a verifier; then it records what happened so you can improve the system instead of guessing. If loop engineering answers "how does the agent keep going?", harness engineering answers "how do we run that agent repeatably and know whether it worked?"

Use a harness when a prompt, skill, subagent, or workflow matters enough that you need evidence: pass/fail, traces, cost, latency, retries, and regression history.

---

## What "harness" means here

In this playbook, a harness can mean three related things:

| Harness type | Purpose | Example |
|---|---|---|
| **Agent runtime harness** | Controls the agent's tools, action space, observations, memory, and recovery paths | A subagent can read files and run tests, but cannot edit or push |
| **Eval harness** | Runs repeatable tasks and scores the result | "Given this bug report, does the agent produce a regression test and fix?" |
| **Operational harness** | Runs the workflow in CI, cron, or a queue with logging and human gates | Nightly docs drift check opens a PR only when docs changed |

Most serious agent workflows need all three: runtime control, evaluation, and operational discipline.

---

## R&D summary

Current AI harness practice has converged on a few patterns:

- **Evals as unit tests for AI behavior.** OpenAI Evals describes evals as a framework for evaluating LLMs and systems built with LLMs, with custom evals for use-case-specific behavior.
- **Task/dataset/solver/scorer structure.** Inspect, the UK AI Security Institute's eval framework, organizes evaluation around tasks, datasets, solvers, scorers, agents, tools, limits, and logs.
- **Trace-first debugging.** LangSmith and the OpenAI Agents SDK both emphasize traces: you need to inspect the sequence of model calls, tool calls, and outputs to understand why an agent passed or failed.
- **Agent scaffolds matter.** Modern agent evaluations test the whole system, not just the base model: prompt, tools, permissions, memory, retrieval, environment, and verifier.
- **Deterministic graders are preferred.** Model graders are useful for open-ended output, but release gates should prefer code, schema, diff, test, or reconciliation checks when possible.

Sources worth reading:

- [OpenAI Evals](https://github.com/openai/evals)
- [Inspect](https://inspect.aisi.org.uk/)
- [LangSmith evaluation concepts](https://docs.langchain.com/langsmith/evaluation-concepts)
- [OpenAI Agents SDK tracing](https://openai.github.io/openai-agents-python/tracing/)
- [Claude Code subagents](https://code.claude.com/docs/en/sub-agents)
- [Claude Code skills](https://code.claude.com/docs/en/skills)
- [Claude Code hooks](https://code.claude.com/docs/en/hooks)

---

## The core model

Every harness has nine parts:

| Part | What it controls | Example |
|---|---|---|
| Task | The job the agent must complete | "Fix this failing test without changing public API" |
| Fixture | The starting state | Repo snapshot, input files, issue body, failing output |
| Action space | What the agent can do | Read, edit, run tests, call MCP, spawn subagents |
| Observation format | What the agent sees after each action | Structured tool result with status, summary, artifacts |
| Limits | Cost, time, attempts, tools, files | 3 retries, no network, no writes outside repo |
| Verifier | Pass/fail mechanism | Test command, schema check, screenshot review, human checklist |
| Trace | Record of what happened | Prompts, tool calls, outputs, diffs, costs |
| Report | Human-readable result | Pass/fail, evidence, risks, next actions |
| Baseline | Previous known result | pass@1, pass@3, last green commit, release snapshot |

If a loop is the engine, the harness is the dashboard, brakes, test track, and crash recorder.

---

## When to build a harness

Build a harness when:

- You repeat the same agent workflow more than twice.
- The workflow produces code, docs, customer-visible text, or external actions.
- You need to compare prompts, models, skills, or subagents.
- You need to prevent regressions after changing `CLAUDE.md`, skills, tools, or prompts.
- The task has a meaningful "done" condition.
- You care about pass rates, cost, latency, or failure modes.

Do not build a harness when:

- The task is one-off and low-risk.
- You cannot define expected behavior.
- The verifier would be pure vibes.
- The setup is more expensive than the task.
- There is no owner who will maintain the fixtures and baselines.

---

## Harness maturity levels

### Level 1: Manual checklist

You run the workflow by hand and check a few pass/fail criteria.

Good for: new workflows, rough prompts, early exploration.

```md
Task: Update docs for new CLI flag.
Pass:
- README mentions the flag.
- CLI reference includes example usage.
- npm run docs:build passes.
Fail:
- Source code changes.
- Package versions changed.
```

### Level 2: Saved prompt + verification command

The task is reusable, but still manually started.

Good for: project commands, skills, PR checks.

```text
Run the docs drift harness:
1. Compare package.json scripts, README, and docs nav.
2. Make docs-only changes.
3. Run npm run docs:build.
4. Report changed files and build result.
```

### Level 3: Eval file with fixtures and graders

The workflow has test cases and recorded outcomes.

Good for: prompt/model comparisons, regression suites.

```text
.claude/evals/
  docs-drift.md
  docs-drift.fixtures/
  docs-drift.log
```

### Level 4: CI or scheduled harness

The harness runs automatically and reports results.

Good for: release checks, nightly audits, dependency drift.

### Level 5: Multi-agent harness

Planner, builder, reviewer, and judge are separated, often with worktrees.

Good for: high-value workflows where reliability matters more than token cost.

---

## Recommended file layout

Use `.claude/evals/` for agent/eval harnesses that belong to a repo:

```text
.claude/
  evals/
    README.md
    docs-drift/
      eval.md
      fixtures/
        package.before.json
        README.before.md
      expected/
        required-links.txt
      runs/
        2026-07-16T0900Z.md
    bug-fix/
      eval.md
      fixtures/
      runs/
```

Use `docs/harness/` when the harness is a human-facing process document rather than executable repo machinery:

```text
docs/
  harness/
    pr-review.md
    design-review.md
    dependency-audit.md
```

Use CI artifacts or `runs/` for outputs. Do not bury results only in chat; future runs need something to compare against.

---

## Eval definition template

```md
# Eval: <name>

## Purpose
What behavior does this eval protect?

## Task
The exact instruction given to the agent.

## Fixture
Starting files, branch, issue body, test failure, screenshot, or API response.

## Allowed tools
What the agent may use.

## Denied actions
What the agent must never do.

## Success criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Graders
- Code grader:
- Rule/schema grader:
- Model grader:
- Human grader:

## Metrics
- pass@1:
- pass@3:
- cost:
- latency:
- retry count:

## Report format
What the harness must output after each run.
```

---

## Grader types

### 1. Code grader

Best for deterministic checks.

Examples:

```bash
npm run docs:build
npm test -- auth
bundle exec rspec spec/models/user_spec.rb
python -m pytest tests/test_parser.py
```

Use for:

- Build success
- Unit/integration tests
- Type checks
- Lint
- Security scanners
- Snapshot comparisons

### 2. Rule or schema grader

Best for structured output.

Examples:

```bash
jq -e '.title and .steps and (.risks | type == "array")' report.json
rg -q "Loop Engineering" README.md
test -f ".design/pricing-page/DESIGN_BRIEF.md"
```

Use for:

- JSON/YAML shape
- Required headings
- Required links
- File existence
- Forbidden text or patterns

### 3. Diff grader

Best for "only these files may change" rules.

Example:

```bash
git diff --name-only | rg -v '^(README.md|docs/|\\.vitepress/config\\.mts)$' && exit 1
```

Use for:

- Docs-only changes
- No generated files
- No lockfile changes
- No schema changes

### 4. Model grader

Best for subjective or semantic quality.

Use it when code cannot judge the output alone:

- Does this answer the user's question?
- Is the PR summary accurate?
- Does the design match the brief?
- Is the explanation understandable for a junior?

Keep model graders rubric-based:

```md
Score this PR description from 1-5:
1. Correctly summarizes the diff.
2. Explains why the change was made.
3. Includes concrete test steps.
4. Does not claim work that was not done.

Return JSON:
{
  "score": 1-5,
  "pass": true|false,
  "reasons": []
}
```

Do not use a model grader as the only release gate for security, money movement, production deploys, or external communications.

### 5. Human grader

Use when judgment matters:

- Product acceptance
- Security-sensitive changes
- Legal/compliance text
- UX taste
- Brand voice
- Customer-facing emails

The harness should prepare evidence, not make the final call.

---

## Metrics to track

| Metric | Meaning | Why it matters |
|---|---|---|
| pass@1 | First attempt succeeds | Measures direct reliability |
| pass@3 | Succeeds within three attempts | Measures recoverability |
| pass^3 | Three runs all succeed | Measures stability |
| retry count | Attempts before pass/fail | Detects loop churn |
| cost | Token/API/tool spend | Prevents hidden runaway cost |
| latency | Wall-clock time | Shows whether the harness is usable |
| edit size | Lines/files changed | Catches over-broad diffs |
| failure class | Why it failed | Guides prompt/tool/fixture fixes |

For critical workflows, optimize pass^k, not only pass@k. A workflow that passes once after three tries may be useful interactively, but it is not stable enough for unattended automation.

---

## Action space design

The harness should make the right action easy and the dangerous action impossible.

### Tool granularity

| Risk | Tool shape | Example |
|---|---|---|
| Low | Macro-tool is fine | `read_project_docs` |
| Medium | Narrow command/tool | `run_docs_build` |
| High | Micro-tool with approval | `deploy_staging`, `rotate_secret`, `run_migration` |

Avoid catch-all tools when the workflow is high-risk. A single "run shell" action can do anything; that is useful for a human-supervised coding session and dangerous for an autonomous harness.

### Good tool response shape

Every tool or command wrapper should return:

```json
{
  "status": "success | warning | error",
  "summary": "One-line result",
  "artifacts": ["path/or/id"],
  "next_actions": ["What the agent should try next"],
  "stop_condition": "When not to retry"
}
```

This makes recovery easier. A vague error makes the agent guess.

---

## Observation design

Bad observation:

```text
Failed.
```

Good observation:

```text
status: error
summary: docs build failed because /Harness/ linked to a missing page
artifact: .vitepress/dist/build.log
next_actions:
- inspect the broken link path
- fix the link or add the missing page
stop_condition:
- stop after 3 build failures with different link errors
```

The harness should compress noisy output into the facts the agent needs:

- What failed?
- Where?
- Why likely?
- What artifact proves it?
- What is safe to try next?
- When should it stop?

---

## Recovery contract

Every harness needs explicit recovery rules.

```md
If verifier fails:
1. Read the failure output.
2. Identify the smallest likely cause.
3. Make one targeted change.
4. Re-run only the focused verifier.
5. Repeat at most 3 times.
6. If still failing, stop and report:
   - attempted fixes
   - current failure
   - likely blocker
   - what human input is needed
```

Do not allow:

- deleting tests to pass
- weakening assertions
- changing acceptance criteria
- hiding errors
- broad refactors to escape a local failure

---

## Sample harnesses

### Example 1: Docs harness

Use this when docs updates are common.

```md
# Eval: docs-navigation

## Task
Add or update documentation and wire it into the site.

## Fixture
Current repo docs and `.vitepress/config.mts`.

## Allowed tools
Read, edit markdown, edit VitePress config, run docs build.

## Denied actions
- No source code changes.
- No package version changes.
- No deployment.

## Success criteria
- [ ] New page exists.
- [ ] README links to it.
- [ ] VitePress sidebar links to it.
- [ ] `npm run docs:build` passes.

## Graders
- Code: `npm run docs:build`
- Rule: `rg -q "Harness" README.md`
- Diff: changed files are markdown or `.vitepress/config.mts`

## Report
List changed files, build result, and remaining review points.
```

Prompt:

```text
Run the docs harness for a new topic:
1. Create the topic README.
2. Link it from README.md.
3. Add it to VitePress rewrites and sidebar.
4. Run npm run docs:build.
5. If build fails, fix docs/config only.
6. Stop after 3 failures and report the blocker.
```

### Example 2: Bug-fix harness

```md
# Eval: bug-fix-regression

## Task
Fix a reported bug and prove it cannot regress.

## Fixture
Bug report, failing command, relevant source files.

## Success criteria
- [ ] Failure reproduced.
- [ ] Regression test added.
- [ ] Focused test passes.
- [ ] Existing related tests pass.
- [ ] Public API unchanged unless requested.

## Denied actions
- Do not delete/skip tests.
- Do not weaken assertions.
- Do not silence errors.
- Do not refactor unrelated files.

## Metrics
- pass@1 for focused test.
- pass@3 for full related suite.
- edit size.
```

Prompt:

```text
Use the bug-fix harness:
1. Reproduce the bug.
2. Add a regression test that fails before the fix.
3. Make the smallest fix.
4. Run the focused test.
5. Run related tests.
6. Report exact commands and outputs.
Do not delete or skip tests.
```

### Example 3: PR-review harness

```md
# Eval: pr-review-quality

## Task
Review a diff for correctness, security, and regression risk.

## Fixture
Current branch diff against main.

## Allowed tools
Read, grep, git diff, test commands.

## Denied actions
- No edits.
- No commits.
- No comments posted externally unless requested.

## Success criteria
- [ ] Reads full changed files, not only hunks.
- [ ] Reports findings by severity.
- [ ] Each finding has file:line and failure scenario.
- [ ] Says clearly if no findings.
- [ ] Lists residual risks.

## Graders
- Human grader reviews usefulness.
- Rule grader checks report contains severity, file reference, and test notes.
```

Prompt:

```text
Run the PR-review harness on this branch.
Read the full diff and changed files.
Return findings first, ordered by severity.
For each finding include file:line, concrete failure scenario, and fix direction.
Do not edit files.
```

### Example 4: Design-review harness

```md
# Eval: design-review

## Task
Review a UI implementation against its design brief.

## Fixture
.design/<feature>/DESIGN_BRIEF.md
running app URL
changed frontend files

## Success criteria
- [ ] Screenshots captured at 375, 768, 1280.
- [ ] Findings reference screenshot filenames.
- [ ] Accessibility basics checked.
- [ ] Responsive behavior checked.
- [ ] Must-fix items separated from polish.

## Graders
- Screenshot evidence.
- Human visual review.
- Optional model grader with rubric.
```

Prompt:

```text
Run the design-review harness:
1. Read the design brief.
2. Start or use the running app.
3. Capture mobile, tablet, and desktop screenshots.
4. Review hierarchy, spacing, type, color, states, responsiveness, accessibility.
5. Save DESIGN_REVIEW.md with must-fix, should-fix, could-improve.
```

### Example 5: Agent prompt regression harness

Use this when changing a skill, subagent, or `CLAUDE.md`.

```md
# Eval: prompt-regression

## Task
Compare old and new prompt behavior on representative tasks.

## Fixture
10 stored task prompts with expected behavior.

## Success criteria
- [ ] New prompt passes all safety boundaries.
- [ ] New prompt does not increase average retries.
- [ ] New prompt improves or maintains pass@1.
- [ ] New prompt does not increase cost by more than 20% unless justified.

## Graders
- Code/rule graders for deterministic outputs.
- Model grader for explanation quality.
- Human grader for final sign-off.
```

---

## Minimal executable harness pattern

You can start with a shell script before adopting a full eval framework:

```bash
#!/usr/bin/env bash
set -euo pipefail

echo "== Harness: docs =="

echo "Checking required links..."
rg -q "Harness" README.md
rg -q "Harness" .vitepress/config.mts

echo "Building docs..."
npm run docs:build

echo "Checking changed files are docs/config only..."
git diff --name-only | rg -v '^(README.md|Glossary/README.md|10 Levels of Claude Code/README.md|Subagents/README.md|Harness/README.md|\\.vitepress/config\\.mts)$' && {
  echo "Unexpected non-doc file changed"
  exit 1
} || true

echo "PASS"
```

Turn it into a real project script only after it proves useful.

---

## Claude Code usage patterns

### Ask for a harness before implementation

```text
Before building this workflow, define a harness:
- fixtures
- allowed tools
- denied actions
- success criteria
- verifier commands
- retry cap
- report format
Wait for my approval before writing code.
```

### Ask Claude to run under a harness

```text
Run this task under the docs harness.
If the verifier fails, make one targeted fix and retry.
Stop after 3 attempts.
Report evidence, not claims.
```

### Ask for a harness review

```text
Review this harness for weak spots:
- vague success criteria
- model-only grading
- missing denied actions
- missing fixtures
- flaky graders
- cost/latency risk
- no human gate
Return must-fix issues first.
```

### Ask for metrics after a run

```text
Summarize this harness run:
- pass/fail
- attempts
- commands run
- artifacts produced
- token/cost estimate if available
- changed files
- failure class if failed
- next action
```

---

## CI pattern

A CI harness should be boring:

```yaml
name: Agent Harness

on:
  pull_request:
    paths:
      - "Harness/**"
      - "README.md"
      - ".vitepress/**"

jobs:
  docs-harness:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run docs:build
```

Keep AI calls out of required CI until they are stable and cost-bounded. Start with deterministic checks, then add model graders as non-blocking reports.

---

## Best practices

### Define evals before changing the agent

If you are editing a skill, subagent, prompt, or `CLAUDE.md`, write the harness first. Otherwise you will not know whether the change improved reliability or merely felt better.

### Prefer deterministic graders

Use tests, schemas, diffs, and build commands wherever possible. Model graders are helpful, but they should explain and classify; they should not be the only thing standing between a risky change and release.

### Keep fixtures realistic

Toy examples overfit quickly. Use real bug reports, real docs drift, real PRs, real screenshots, and real failure logs with sensitive data removed.

### Separate generation from judgment

The builder should not be able to change the test, rubric, or acceptance criteria. Store those in fixtures/eval files and treat them as read-only during the run.

### Track failures as assets

Every failed run should improve the harness:

- Add a fixture.
- Add a clearer boundary.
- Add a better grader.
- Improve observation formatting.
- Add a stop condition.

### Keep harnesses small

One harness should protect one behavior. A giant "agent quality harness" becomes slow, vague, and ignored.

### Version harnesses with the repo

The harness is part of the product. If the code changes but the harness does not, the harness will rot.

### Report uncertainty

If a grader is subjective, say so. If a fixture is synthetic, say so. If a test is flaky, do not use it as a hard gate.

---

## Anti-patterns

### The demo harness

Only tests the one case you showed in a demo.

Fix: include boring edge cases and previous failures.

### The vibes grader

Passes if the output "looks good".

Fix: replace with a rubric, schema, or human review gate.

### The hidden mutable test

The agent can edit the test that grades it.

Fix: make fixtures and graders read-only during the run.

### The no-trace harness

Reports pass/fail but gives no tool calls, diffs, logs, or artifacts.

Fix: preserve run logs and evidence.

### The over-broad action space

The agent can deploy, push, delete, or modify secrets while trying to pass.

Fix: deny dangerous tools and run in a branch/worktree.

### The expensive harness nobody runs

Too slow or costly for everyday use.

Fix: split into fast smoke evals and slower nightly/release evals.

---

## Harness review checklist

Before trusting a harness:

- Is the task clear?
- Are fixtures realistic and versioned?
- Are allowed and denied actions explicit?
- Is the verifier deterministic where possible?
- Are subjective graders rubric-based?
- Can the agent edit the grader or fixture? If yes, fix that.
- Are traces and artifacts saved?
- Is pass/fail reproducible?
- Are retries capped?
- Is cost/latency tracked?
- Is there a human gate for high-risk output?
- Does the harness test at least one known failure case?

---

## One-line version

> A harness is how you stop treating agent behavior as magic: give it fixtures, tools, limits, graders, traces, and baselines, then improve the system from evidence.

---

## See also

- [`../Loop Engineering/`](../Loop%20Engineering/) - designing the feedback loops the harness runs and evaluates.
- [`../Subagents/`](../Subagents/) - splitting planner, builder, reviewer, debugger, and judge roles.
- [`../Skills/`](../Skills/) - packaging harness procedures as reusable skills.
- [`../Claude Directory Layout/`](../Claude%20Directory%20Layout/) - where agents, skills, hooks, and settings live.
- [`../Security Guardrails/`](../Security%20Guardrails/) - safety boundaries for automated agent runs.
- [`../10 Levels of Claude Code/`](../10%20Levels%20of%20Claude%20Code/) - how harnesses relate to hooks, headless runs, and routines.
