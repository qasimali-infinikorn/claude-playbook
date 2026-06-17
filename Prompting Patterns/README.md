# Prompting Patterns

My findings on how to prompt Claude (chat) and Claude Code (the agent) to get reliable, high-quality results. These are patterns I keep reaching for — captured so I stop relearning them.

> Rule of thumb: **the model is only as good as the context and constraints you give it.** Most "bad" outputs are under-specified prompts, not model failures.

---

## The core patterns

### 1. State the goal, the constraints, and "done" — up front
Don't make Claude guess the finish line. Say what you want, what it must not do, and how you'll judge success.

- ❌ "Make the login better."
- ✅ "Refactor `auth.ts` to handle expired JWTs by redirecting to `/sign-in`. Don't change the public API of `apiClient`. Done = `tsc` clean, existing auth tests pass."

**Why it works:** an explicit quality bar lets the agent self-check before handing back.

### 2. Give context before the task
Point at the real files, paste the real error, name the real conventions. Claude Code can read the repo — tell it *where* to look so it doesn't waste turns searching.

- "The pattern lives in `lib/api.ts`; follow it." beats "use our usual pattern."
- Paste the full stack trace, not a paraphrase.

### 3. Ask for a plan before code on anything non-trivial
For multi-file or ambiguous work, request the plan first, review it, *then* let it build. (In Claude Code this is **plan mode**.)

> "Before writing code, outline the files you'll change and the approach. Wait for my OK."

Catches wrong assumptions when they're cheap to fix.

### 4. Constrain the scope — "smallest diff that works"
Agents love to "improve" adjacent code. If you don't want that, say so.

> "Make the minimal change to fix this. Don't refactor or reformat unrelated lines."

### 5. Show, don't just tell (few-shot / examples)
One concrete example of the input→output you want is worth a paragraph of description. For formatting, transformations, and tone especially.

### 6. Specify the output format explicitly
If you need a table, JSON, a diff, a commit message, or bullet points — ask for exactly that. For machine-consumed output, give the schema.

### 7. Tell it what NOT to do
Negative constraints are as important as positive ones: "don't touch the DB schema", "no new dependencies", "don't add comments unless the logic is non-obvious", "don't push without asking".

### 8. Let it think on hard problems
For tricky reasoning/debugging, invite step-by-step thinking (or use extended thinking). For simple lookups, don't — it just adds latency.

> "Reason through the edge cases before you answer."

### 9. Iterate in small steps, keep it on a leash
Prefer "do X, show me, then we'll do Y" over a 10-step mega-prompt. Smaller loops = easier to catch a wrong turn and cheaper to redo.

### 10. Assign a role / lens when it sharpens output
"Review this as a security engineer" or "act as a skeptical reviewer — lead with the strongest objection" changes what the model surfaces.

### 11. Anchor to a source of truth
Tell it to follow the README/`CLAUDE.md`/an existing file rather than inventing conventions. For libraries with breaking changes, point it at the installed docs ("read `node_modules/next/dist/docs/` before using the API") — its training data may be stale.

### 12. Ask for verification, not just claims
"Run the tests and show me the output" / "prove it works by running it" beats trusting a "should work now." Make the agent observe real behavior.

---

## Claude Code–specific findings

- **A good `CLAUDE.md` is the highest-leverage prompt you'll ever write** — it's persistent context for every turn. See [`../CLAUDE.md Best Practices/`](../CLAUDE.md%20Best%20Practices/).
- **Be explicit about commits/pushes.** It won't push unless asked; say "commit when done" or "don't commit" to remove ambiguity. State repo/branch rules.
- **Reference files by `path:line`** — it's precise and clickable.
- **Parallelize independent asks** in one message; the agent can run independent tool calls together.
- **When it goes sideways, reset context** rather than fighting a derailed thread — restate the goal cleanly.
- **Persist learnings to memory** so they survive across sessions instead of being re-explained.

---

## API / SDK findings

- **Put stable, reusable context first** (system prompt, long docs, examples) and the variable part last — this maximizes **prompt cache** hits and cuts cost/latency on repeated calls.
- **Use the latest model for the job:** Opus for the hardest reasoning, Sonnet for the everyday balance, Haiku for fast/cheap high-volume tasks.
- **Structure complex prompts** with clear delimited sections (headings or XML-ish tags) so the model can tell instructions from data from examples.
- **Pin the output contract** (schema / format) when another program consumes the result, and validate it.

---

## Anti-patterns

- **Vague asks** — "improve this" with no definition of better.
- **Burying the lede** — the actual request hidden under three paragraphs of background.
- **No constraints** — then being surprised it rewrote half the file.
- **One giant prompt** for a 10-step task instead of an iterative loop.
- **Trusting "done" without verification** — always make it run/test.
- **Re-explaining the same context every session** instead of putting it in `CLAUDE.md` or memory.

---

## Quick checklist before hitting enter

- [ ] Is the goal explicit, with a definition of "done"?
- [ ] Did I provide / point to the relevant context (files, errors, examples)?
- [ ] Did I state the constraints — including what *not* to do?
- [ ] Is the scope bounded (smallest diff / single step)?
- [ ] Did I specify the output format I want?
- [ ] For hard problems: did I invite reasoning? For easy ones: did I keep it terse?
