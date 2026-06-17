# Git & PR Workflow with Claude

How to use Claude Code for git without shooting yourself in the foot. The #1 rule: **the agent is fast, you are accountable — read before you accept or push.**

---

## Ground rules

- **Claude won't push unless you ask.** It branches/commits conservatively, but always be explicit: "commit when done" or "don't commit."
- **Always review the diff** before committing — `git diff` or ask "show me the diff."
- **You own what gets merged.** A reviewer will hold *you* responsible, not the agent.

---

## A typical change, end to end

1. **Branch** (don't work on `main`):
   > "Create a branch `feat/clear-favorites` for this change."

2. **Make the change**, then **review**:
   > "Show me the full diff."  ← read it.

3. **Self-review for quality/bugs**:
   > `/code-review`  (or "review my staged changes, be strict")

4. **Verify it works**:
   > "Run the tests and show the output." / use the `verify` skill.

5. **Commit** with a clear message:
   > "Commit with a message explaining what and why. Don't push."

6. **Push when ready**:
   > "Push the branch to origin."

7. **Open the PR**:
   > "Open a PR with a description: what changed, why, and how to test."

---

## Commit messages

- **Imperative mood:** "Add favorites bulk-clear", not "Added" / "Adds."
- **What + why**, not just what. The diff shows *what*; the message explains *why*.
- Follow your team's convention (e.g. Conventional Commits: `feat:`, `fix:`, `docs:`).
- Check team rules in `CLAUDE.md` — e.g. some teams forbid AI co-author trailers, or commit from a specific directory in multi-repo setups.

## PR descriptions (template)

```md
## What
Short summary of the change.

## Why
The problem / ticket this addresses.

## How to test
1. Steps a reviewer follows to verify.

## Notes
Risks, follow-ups, screenshots.
```

Ask Claude: "Write the PR description from the diff using our template."

---

## Reviewing a PR with Claude

> "Review PR #123 for correctness bugs and risky changes. Summarize what it does and flag anything that needs a closer look."

Use `/code-review` (and `ultra` for a deeper multi-agent pass) — but make your own call; the tool assists, it doesn't approve.

---

## Pitfalls (juniors hit these)

- ❌ **Pushing unreviewed agent output.** → Always read the diff first.
- ❌ **Committing on `main`.** → Branch first.
- ❌ **Committing `.env` or secrets.** → Check `git status`; ensure `.gitignore` covers them. → `../Security Guardrails/`
- ❌ **Giant, unfocused commits.** → Keep commits small and logical.
- ❌ **Wrong directory in multi-repo workspaces.** → Confirm which repo you're in before committing.
- ❌ **Force-push without understanding it.** → Don't, unless you're sure.

---

## Quick reference

```bash
git status                 # what's staged/changed — check before committing
git diff                   # review unstaged changes
git diff --staged          # review what you're about to commit
git switch -c feat/x       # new branch
git log --oneline -5       # recent history
```
