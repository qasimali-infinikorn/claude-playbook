# Failure Postmortems

A postmortem turns an agent mistake into a reusable guardrail. Keep it blameless, concrete, and short.

---

## Template

```md
# Postmortem: <title>

## What happened

## Impact

## Root cause

## What the agent missed

## What the human missed

## Detection

## Fix

## New guardrail
- Prompt change:
- CLAUDE.md change:
- Harness/eval:
- Hook/permission:
- Checklist:

## Example prompt to avoid repeat
```

---

## Common Failure Classes

| Failure | Guardrail |
|---|---|
| Edited too much | "smallest diff" + diff review |
| Deleted tests | boundary in harness |
| Invented API | docs lookup/current source |
| Secret leak | deny reads + security checklist |
| Wrong repo | `pwd`, `git status`, workspace rules |
| Vague goal | acceptance criteria before code |
| Bad UI | screenshot review |

---

## Example

```md
# Postmortem: Agent skipped failing test

## What happened
The agent made the test suite pass by adding `.skip`.

## Root cause
Goal said "make tests pass" without a boundary.

## New guardrail
Harness now says: do not delete, skip, or weaken tests.
Reviewer checks test files for skipped cases.
```

---

## See Also

- [`../Common Mistakes/`](../Common%20Mistakes/)
- [`../Harness/`](../Harness/)
- [`../Loop Engineering/`](../Loop%20Engineering/)
