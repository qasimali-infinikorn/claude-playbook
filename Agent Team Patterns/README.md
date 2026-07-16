# Agent Team Patterns

Agent teams split work across specialized roles. The goal is not "more agents"; it is better separation of planning, execution, review, and judgment.

---

## Core Roles

| Role | Owns | Should not own |
|---|---|---|
| Planner | Scope, tasks, acceptance criteria | Production code |
| Builder | Implementation | Final approval |
| Reviewer | Bugs, security, regressions | Editing by default |
| Test writer | Regression coverage | Product decisions |
| Debugger | Root cause | Cosmetic cleanup |
| Judge | Verification result | Changing criteria |

Keep the judge independent from the builder.

---

## Pattern: Planner → Builder → Reviewer

Use for medium features.

```text
1. Planner reads issue and repo conventions.
2. Planner writes task list and acceptance criteria.
3. Builder implements the smallest slice.
4. Reviewer checks diff for bugs/security.
5. Main agent synthesizes and asks human for approval.
```

---

## Pattern: Debugger → Test Writer → Builder

Use for bugs.

```text
Use debugger to root-cause the failure.
Then use test-writer to add a regression test.
Then implement the smallest fix in the main session.
Finally run code-reviewer.
```

---

## Pattern: Parallel Review

Use when checks are independent.

```text
Run code-reviewer and performance-optimizer in parallel on the current diff.
Have each report independently.
Synthesize conflicts and recommend fixes.
```

Do not parallelize when one output feeds another.

---

## Pattern: Design + Engineering

Use for UI.

```text
ui-designer reviews visual direction.
test-writer adds interaction/behavior tests.
code-reviewer checks implementation risk.
Main agent applies selected fixes.
```

---

## Team Dispatch Prompt

```text
Dispatch an agent team for this task:
- planner: define scope and acceptance criteria
- builder: implement only after plan approval
- test-writer: add regression coverage
- code-reviewer: review final diff

Keep roles separate. The builder may not change acceptance criteria.
Return one synthesized report.
```

---

## Anti-Patterns

- Spawning agents without clear roles.
- Letting every subagent edit files.
- Asking several agents the same vague question.
- Treating agent consensus as correctness.
- Forgetting to synthesize into one decision.

---

## See Also

- [`../Subagents/`](../Subagents/)
- [`../Loop Engineering/`](../Loop%20Engineering/)
- [`../Harness/`](../Harness/)
- [Claude Code agent teams docs](https://code.claude.com/docs/en/agents)
