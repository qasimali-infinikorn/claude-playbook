# Example Walkthroughs

Annotated, realistic sessions showing *how* to work with Claude Code — the actual prompts, why they work, and what to do at each step. Learn by example.

> These are illustrative templates, not transcripts of a specific repo. Adapt the prompts to your project.

---

## Walkthrough 1 — Fixing a bug

**Situation:** the cart total shows `NaN` when an item quantity is 0.

**Step 1 — give context, not just symptoms**
> "In `src/cart/total.ts`, the cart total shows `NaN` when an item's quantity is 0. Here's the function: [paste or point to it]. Find the cause and propose a fix. Show me the diff before changing anything."

*Why:* names the file, describes the exact symptom, and asks for a plan/diff first.

**Step 2 — review the proposed diff**
Read it. Does it fix the root cause or just hide the symptom? Ask: "Will this also handle a missing/undefined quantity?"

**Step 3 — verify**
> "Add a unit test that reproduces the NaN case, then run the tests and show me the output."

*Why:* proves the fix and prevents regression. Don't accept "should work now."

**Step 4 — commit (when you're satisfied)**
> "Commit this with a clear message. Don't push."

---

## Walkthrough 2 — Adding a small feature

**Situation:** add a "Clear all" button to the favorites page.

**Step 1 — ask for a plan first**
> "I want a 'Clear all' button on the favorites page that removes all saved items after a confirm dialog. Before coding, outline the files you'll touch and the approach. Follow the existing patterns in `components/`."

**Step 2 — review the plan, correct assumptions**
> "Good, but reuse the existing `ConfirmDialog` component instead of a new one, and the API already has a bulk-delete endpoint — use it."

*Why:* catching this now is free; catching it after 200 lines is not.

**Step 3 — let it build, then review the diff**
Read it against your conventions. → `../Common Mistakes/`

**Step 4 — verify in the real app**
> "Run the app and confirm the button works and the list empties." (or use the `verify` skill)

---

## Walkthrough 3 — Reviewing your own work before a PR

**Situation:** you finished a change and want it clean before a senior sees it.

**Step 1 — self-review**
> "Review my staged changes for correctness bugs and anything that could be simpler or reused. Be strict." (or run `/code-review`)

**Step 2 — tighten**
> "Apply the low-risk simplifications you suggested; leave the behavior changes for me to decide."

**Step 3 — write the PR**
> "Write a PR description: what changed, why, and how to test it." → `../Git and PR Workflow/`

---

## Walkthrough 4 — Understanding an unfamiliar codebase

**Situation:** you just joined and don't know how auth works.

> "Explain how authentication works in this codebase. Start with the entry point, trace the flow, and reference files by path. Don't change anything."

Follow up:
> "Show me where the token is attached to API requests."

*Why:* Claude is an excellent onboarding tutor. Read-only exploration is safe and fast.

---

## The pattern across all of these

1. **Context first** — name files, paste errors, point at conventions.
2. **Plan before code** on anything non-trivial.
3. **Review the diff** — every time.
4. **Verify** — run it, test it, don't just trust it.
5. **Control commits** — "show me the diff", "commit but don't push."

_Add your own walkthroughs here as you hit instructive situations._
