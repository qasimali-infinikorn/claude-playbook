# Prompt Library

Ready-to-copy prompts for common Claude Code work. Adapt file paths, commands, and constraints to the project.

---

## Understand A Codebase

```text
Explain how <system> works in this codebase.
Start from the entry point, trace the flow, and reference files by path.
Do not change anything.
```

## Plan Before Code

```text
Before editing files, make a plan:
- files you will inspect
- likely files to change
- approach
- risks
- verification commands
Wait for my approval.
```

## Small Bug Fix

```text
Fix <bug>.
Constraints:
- smallest diff
- no unrelated refactor
- add/update a regression test
- run focused tests
- show me the diff before committing
```

## Strict Review

```text
Review the current diff for correctness bugs, security issues, and regressions.
Findings first, ordered by severity.
For each: file:line, failure scenario, and fix direction.
No style nits unless they hide real risk.
```

## Docs Update

```text
Update docs for <change>.
Keep it concrete and example-driven.
Link the new/updated page from README and navigation if needed.
Run the docs build.
```

## Harness Design

```text
Design a harness for this workflow:
- task
- fixtures
- allowed tools
- denied actions
- graders
- metrics
- report format
Do not implement yet.
```

## Loop Design

```text
Design a bounded loop for this recurring task.
Define goal, state, actions, verifier, boundaries, retry cap, escalation, and human gate.
Call out failure modes before implementation.
```

## PR Description

```text
Write a PR description from the diff.
Include:
## What
## Why
## How to test
## Risks / notes
Do not claim tests were run unless they were.
```

## Handoff

```text
Create a handoff for a fresh session.
Include goal, current state, changed files, decisions, verification, risks, and next step.
Omit raw logs unless needed.
```

---

## See Also

- [`../Prompting Patterns/`](../Prompting%20Patterns/)
- [`../Example Walkthroughs/`](../Example%20Walkthroughs/)
- [`../Cheat Sheet/`](../Cheat%20Sheet/)
