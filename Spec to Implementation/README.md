# Spec To Implementation

This is the bridge from "we need X" to a reviewed, verified PR.

Use it for issues, PRDs, design briefs, bug reports, or stakeholder requests that are too large for a single direct prompt.

---

## Workflow

1. **Intake** - read the source request.
2. **Clarify** - resolve ambiguity before coding.
3. **Scope** - define in/out.
4. **Acceptance criteria** - make done testable.
5. **Plan** - identify files and sequence.
6. **Implement** - smallest vertical slices.
7. **Verify** - run commands and observe behavior.
8. **Review** - code, tests, security, docs.
9. **PR** - summarize what, why, how to test.

---

## Intake Template

```md
# Spec Intake

## Source
Issue/PRD/design brief/link.

## User problem
What human problem is this solving?

## Required behavior
What must change?

## Out of scope
What must not change?

## Acceptance criteria
- [ ] Machine/human-verifiable criterion.

## Risks
Security, data, migration, performance, UX.
```

---

## Implementation Prompt

```text
Turn this spec into an implementation plan.
Before editing files:
1. Read the relevant code.
2. Identify files to change.
3. Define acceptance criteria.
4. Call out risks and unknowns.
5. Wait for my approval.
```

---

## Build Prompt

```text
Implement the approved plan in the smallest vertical slice.
Do not refactor unrelated code.
Add or update tests for changed behavior.
Run the quality bar.
Show the diff before committing.
```

---

## PR Template

```md
## What

## Why

## How to test

## Risks / rollback

## Screenshots
```

---

## Anti-Patterns

- Coding directly from a vague issue.
- Letting the agent invent acceptance criteria after implementation.
- Building horizontal layers with no verifiable slice.
- Skipping tests because the change is "small".
- Writing a PR description from memory instead of the diff.

---

## See Also

- [`../Prompting Patterns/`](../Prompting%20Patterns/)
- [`../Harness/`](../Harness/)
- [`../Git and PR Workflow/`](../Git%20and%20PR%20Workflow/)
- [`../Design Process/`](../Design%20Process/)
