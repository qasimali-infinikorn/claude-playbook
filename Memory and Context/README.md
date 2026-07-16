# Memory And Context

Good agent output depends on the right context at the right time. Too little context makes Claude guess. Too much context makes it slow, stale, and easier to mislead.

This guide explains what belongs in `CLAUDE.md`, memory, handoffs, docs, skills, and the current chat.

---

## Context Layers

| Layer | Lifetime | Put here | Do not put here |
|---|---|---|---|
| Prompt | One turn | The exact current task | Permanent project rules |
| Session | One conversation | Investigation notes, current decisions | Long-term facts |
| `CLAUDE.md` | Project lifetime | Stable conventions and guardrails | Full README duplication |
| Skills | Task-specific | Repeatable workflow instructions | Project facts unrelated to the skill |
| Handoff | Next session | Current state and next steps | Raw logs and giant diffs |
| Memory | Cross-session | Durable user/project preferences | Secrets, volatile counts, guesses |
| Docs | Human/project source | Product specs, setup, architecture | Private personal notes |

---

## What Goes In `CLAUDE.md`

Use `CLAUDE.md` for:

- Project overview.
- Stack and versions that matter.
- Architecture boundaries.
- Coding conventions.
- Safe-change rules.
- Quality bar commands.
- File placement rules.

Keep it stable and short. Link out to detail.

---

## What Goes In Memory

Use memory for:

- User preferences: "Do not add AI co-author trailers."
- Stable project facts: "API client lives in `lib/api.ts`."
- Recurring workflow preferences.
- Naming conventions not obvious from the repo.

Do not store:

- Secrets.
- Customer data.
- Temporary task details.
- Counts that rot quickly.
- Inferences that were never verified.

---

## Handoff Template

```md
# Handoff: <task>

## Goal
What we are trying to finish.

## Current state
What has been done.

## Important files
- `path/file`

## Decisions made
- Decision + reason.

## Verification
- Commands run and result.

## Open risks
- What still needs attention.

## Next step
The next concrete action.
```

---

## Context Hygiene

Use `/clear` when switching unrelated tasks.

Use `/compact` or a handoff when:

- The thread is long.
- The agent is repeating stale assumptions.
- You finished one phase and are starting another.
- Tool outputs have bloated the context.

Ask:

```text
Create a handoff for the next session.
Keep only durable facts, decisions, changed files, verification, and next steps.
Do not include raw command logs unless needed.
```

---

## Stale Memory Cleanup

Run periodically:

```text
Review project memory and identify stale, duplicated, or unsafe entries.
Do not delete anything automatically.
Group findings into:
- keep
- update
- remove
- move to CLAUDE.md
- move to project docs
```

---

## Anti-Patterns

- Putting every discovery into memory.
- Copying the README into `CLAUDE.md`.
- Letting stale memory override current code.
- Continuing a derailed thread instead of starting fresh.
- Pasting huge logs when a focused error excerpt is enough.

---

## Checklist

- [ ] Stable rules are in `CLAUDE.md`.
- [ ] Task-specific procedures are skills/commands.
- [ ] Current task state is in the session or handoff.
- [ ] Long-lived facts are verified before memory.
- [ ] Secrets are never stored.
- [ ] Stale memory is periodically reviewed.

---

## See Also

- [`../CLAUDE.md Best Practices/`](../CLAUDE.md%20Best%20Practices/)
- [`../Prompting Patterns/`](../Prompting%20Patterns/)
- [`../Troubleshooting and FAQ/`](../Troubleshooting%20and%20FAQ/)
- [Claude Code memory docs](https://code.claude.com/docs/en/memory)
