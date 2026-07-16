# Worktrees And Parallel Agents

Worktrees let you run isolated attempts against the same repository without each attempt editing the same files. They are useful when several agents or approaches need to run in parallel.

Use worktrees when parallelism would otherwise create branch conflicts, overwritten files, or confusing diffs.

---

## When To Use

Use worktrees for:

- Trying multiple implementation approaches.
- Running planner/builder/reviewer roles independently.
- Comparing UI variants.
- Debugging two hypotheses in parallel.
- Long-running agent work while keeping `main` clean.

Avoid worktrees when:

- One focused branch is enough.
- The task is small and serial.
- You cannot afford the cleanup overhead.
- Shared services/database state would collide anyway.

---

## Basic Pattern

```bash
git worktree add ../project-attempt-a -b attempt-a
git worktree add ../project-attempt-b -b attempt-b
```

Run a separate Claude session in each worktree:

```bash
cd ../project-attempt-a
claude
```

Compare results from the original repo:

```bash
git diff main...attempt-a
git diff main...attempt-b
```

Cleanup:

```bash
git worktree remove ../project-attempt-a
git branch -d attempt-a
```

---

## Parallel Agent Pattern

```text
Create two worktrees:
- attempt-a: minimal fix
- attempt-b: refactor-based fix

In each worktree:
1. Reproduce the failing test.
2. Implement the approach.
3. Run the same verifier.
4. Write a summary of changes, risks, and command outputs.

Return a comparison table and recommendation.
Do not merge either branch automatically.
```

---

## UI Variant Pattern

```text
Use separate worktrees to build three design directions from the same brief:
- variant-functional
- variant-editorial
- variant-brutalist

For each:
1. Build one vertical slice.
2. Capture desktop and mobile screenshots.
3. Run the same accessibility checks.
4. Save screenshots and a short rationale.

Then compare the variants and recommend one.
```

---

## Guardrails

- Keep each worktree on its own branch.
- Use the same verifier across variants.
- Do not share mutable `.env` or local database state casually.
- Name worktrees clearly.
- Clean up stale worktrees.
- Merge only after human review.

---

## Comparison Checklist

| Question | Why |
|---|---|
| Which attempt passes the verifier? | Function first |
| Which has the smallest diff? | Reviewability |
| Which changes public behavior? | Risk |
| Which adds dependencies? | Maintenance |
| Which is easiest to explain? | Long-term ownership |
| Which has better tests? | Regression protection |

---

## Anti-Patterns

- Running several agents in the same checkout.
- Comparing approaches with different success criteria.
- Keeping abandoned worktrees around.
- Letting the winning agent merge itself.
- Ignoring environment collisions.

---

## See Also

- [`../Loop Engineering/`](../Loop%20Engineering/)
- [`../Harness/`](../Harness/)
- [`../Subagents/`](../Subagents/)
- [Claude Code worktrees docs](https://code.claude.com/docs/en/worktrees)
