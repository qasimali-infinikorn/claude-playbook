# Troubleshooting & FAQ

Common "it's not working the way I want" situations and how to fix them. Most aren't bugs — they're under-specified prompts or missing context.

---

## Output quality

**Q: Claude's answer is wrong or off-target.**
Usually under-specified. Add context (files, error, conventions), state constraints, and restate the goal clearly. → `../Prompting Patterns/`

**Q: It sounds confident but the code/API doesn't exist.**
That's a hallucination. Ask "show me where in the codebase this is true" and verify against the real docs. For fast-moving libraries, tell it to read the installed docs first.

**Q: It changed way more than I asked.**
Add a constraint: "smallest diff that fixes this; revert unrelated changes." Going forward, say what *not* to touch.

**Q: It keeps doing the thing I told it not to.**
The instruction may be buried or the thread is polluted. `/clear`, restate cleanly with the constraint up front, or put the rule in `CLAUDE.md` so it persists.

---

## Conversation & context

**Q: Responses got worse over a long session.**
The thread is bloated/derailed. `/clear` and restate the goal, or `/handoff` to carry forward only what matters.

**Q: I'm re-explaining the same project facts every time.**
Put durable facts/rules in `CLAUDE.md` and use memory. → `../CLAUDE.md Best Practices/`

**Q: It doesn't seem to know my project's conventions.**
There's probably no `CLAUDE.md`, or it's thin. Add/expand it.

---

## Tools, commands & permissions

**Q: It keeps asking permission for the same safe command.**
Allow-list common read-only commands (`/fewer-permission-prompts`) — but never blanket-allow destructive ones.

**Q: A command needs an interactive login (e.g. `gcloud auth login`).**
Run it yourself with `! <command>` in the session so the agent sees the output.

**Q: How do I see what skills/commands are available?**
Type `/`. Many skills also auto-trigger from plain language.

**Q: It won't commit/push.**
By design — it commits conservatively and won't push unless asked. Say "commit when done" / "push the branch." → `../Git and PR Workflow/`

---

## Verification & trust

**Q: It says "this should work now." Do I trust it?**
No — make it prove it: "run the tests/app and show the output." Use the `verify` skill.

**Q: Tests fail after its change.**
Paste the failure: "The tests fail with this output: [paste]. Diagnose and fix." Don't let it "fix" by deleting/skipping the test.

---

## When you're truly stuck

1. **Restate the goal from scratch** in a fresh conversation — half the time this fixes it.
2. **Give more context** — the file, the error, an example of what you want.
3. **Ask Claude to explain its reasoning** — "why did you do it this way?" often reveals the wrong assumption.
4. **Break it into smaller steps** — one change at a time.
5. **Ask a senior.** Some things are faster to learn from a human; don't burn an hour stuck. → `../Common Mistakes/`

---

_Add new Q&As here as you (or teammates) hit them._
