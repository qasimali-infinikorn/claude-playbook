# AI Coding Standards

These standards apply to code written with an agent. They are not special because AI wrote the code; they are explicit because agent output can be fast, broad, and confidently wrong.

---

## Core Rules

- Smallest diff that satisfies the task.
- Reuse existing patterns before adding abstractions.
- Tests for changed behavior.
- No unrelated formatting/refactors.
- No new dependencies without reason.
- No weakening security controls.
- No secrets in code, logs, prompts, or docs.
- Verify with commands or real behavior.
- Human reviews before merge.

---

## Code Quality

Agent-written code should be:

- Local to the requested change.
- Consistent with surrounding style.
- Named clearly.
- Covered by focused tests.
- Easy to delete if the approach is wrong.
- Free of invented APIs.

---

## Comments

Add comments only when they explain non-obvious reasoning, constraints, or tradeoffs.

Bad:

```ts
// Increment i
i++
```

Good:

```ts
// Keep this branch synchronous because the caller holds a DB transaction.
```

---

## Dependencies

Before adding a dependency:

- Check if the repo already has a solution.
- Check maintenance and license.
- Avoid large packages for small helpers.
- Document why the dependency is needed.
- Run install/build/test.

---

## Review Checklist

- [ ] Does it solve the requested problem?
- [ ] Is the diff scoped?
- [ ] Are tests meaningful?
- [ ] Did verification run?
- [ ] Any secret/security issue?
- [ ] Any invented API?
- [ ] Any dependency added?
- [ ] Any generated file changed unexpectedly?

---

## See Also

- [`../Common Mistakes/`](../Common%20Mistakes/)
- [`../Git and PR Workflow/`](../Git%20and%20PR%20Workflow/)
- [`../Harness/`](../Harness/)
