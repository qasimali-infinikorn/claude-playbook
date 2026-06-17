# Common Mistakes

My running list of mistakes I've made (or seen) working with Claude and Claude Code — and the fix for each. Most of these cost me time once; writing them down means they only cost me once.

> Pattern: nearly every bad outcome traces back to **too little context, too few constraints, or too much trust.**

---

## Prompting & expectations

### ❌ Under-specifying the task
"Fix the bug" / "make it better" — no symptom, no file, no definition of done.
**Fix:** state the symptom, point at the file, and say what "done" looks like. → see `../Prompting Patterns/`.

### ❌ Trusting "done" without verifying
Accepting "this should work now" and shipping it. It often doesn't.
**Fix:** make the agent *prove* it — run the tests, run the app, show the output. Use the `verify` skill.

### ❌ Treating confident output as correct
Claude can be fluent and wrong (hallucinated APIs, plausible-but-fake details).
**Fix:** verify against the real codebase/docs. Ask "show me where in the code this is true." Be extra skeptical of exact numbers, file paths, and library APIs.

### ❌ One giant mega-prompt for a 10-step task
A wall-of-text spec produces a wall-of-text diff that's hard to review and usually half-wrong.
**Fix:** iterate in small, reviewable steps — "do X, show me, then Y."

### ❌ No constraints, then surprised by collateral changes
The agent "helpfully" refactors/reformats unrelated code.
**Fix:** say "smallest diff that fixes this; don't touch unrelated lines."

---

## Context & memory

### ❌ Re-explaining the same context every session
Pasting the stack, conventions, and rules again every time.
**Fix:** put durable context in `CLAUDE.md` and use persistent memory. → see `../CLAUDE.md Best Practices/`.

### ❌ No `CLAUDE.md` at all
The agent invents its own conventions and structure because nothing told it yours.
**Fix:** add a `CLAUDE.md` with the 10 standard sections on day one.

### ❌ Letting a thread run too long / go stale
A derailed, bloated conversation produces worse answers and burns context.
**Fix:** reset and restate the goal cleanly; use `handoff` to carry forward only what matters.

### ❌ Mixing many unrelated tasks in one conversation
Context from task A pollutes task B.
**Fix:** one focused thread per task; start fresh for a new objective.

---

## Code & workflow

### ❌ Skipping plan mode on big changes
Going straight to code on a multi-file/ambiguous task → wrong assumptions baked in deep.
**Fix:** ask for the plan first, review it, then build.

### ❌ Not reviewing the diff
Merging what the agent wrote without reading it.
**Fix:** read every diff; run `code-review` / `karpathy-check` before committing.

### ❌ Assuming training data is current
Using an API the way it worked a year ago; fast-moving frameworks have breaking changes.
**Fix:** tell it to read the installed docs (e.g. `node_modules/<pkg>/...`) before using an API.

### ❌ Committing/pushing at the wrong time or place
Auto-committing when you wanted to review, or committing from the wrong directory in a multi-repo workspace.
**Fix:** be explicit — "don't commit" or "commit when done." State branch/repo rules in `CLAUDE.md`.

### ❌ No defined quality bar
Without "done = tsc clean + tests pass + build ok," the agent can't self-check.
**Fix:** define the bar as a runnable checklist and make passing it the definition of done.

---

## Safety & hygiene

### ❌ Pasting secrets into prompts or committing `.env`
Real keys/tokens end up in history or logs.
**Fix:** keep secrets in `.env` (commit only `.env.example`); never paste live credentials. Tell the agent never to log/echo them.

### ❌ Letting it weaken security to "make it work"
Disabling auth checks, loosening CORS, removing validation to pass a test.
**Fix:** mark security primitives as off-limits in the Safe Change Rule; never trade them for convenience.

### ❌ Running unfamiliar destructive commands unquestioned
Approving a `rm -rf`, force-push, or migration without understanding it.
**Fix:** read what a hard-to-reverse command does before approving; ask the agent to explain it first.

---

## Quick gut-check before you act on a response

- [ ] Did I give enough context, or am I about to be surprised?
- [ ] Is the scope constrained, or could it touch things I didn't intend?
- [ ] Have I verified it works — not just been told it works?
- [ ] Did I actually read the diff?
- [ ] Is any secret about to leak, or any security check about to be weakened?

_Add mistakes here as you make them — future you will thank you._
