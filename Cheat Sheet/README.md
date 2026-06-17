# Cheat Sheet

One page. Print it, pin it. Everything else in this playbook expands on these.

---

## Commands you'll actually use

| Command | Does |
|---|---|
| *(type plainly)* | Describe the task — 90% of usage |
| `/clear` | Fresh conversation (between unrelated tasks) |
| `/` | List slash commands & skills |
| `! <cmd>` | Run a shell command yourself in-session |
| `Esc` | Interrupt the agent |
| `/code-review` | Review the current diff before committing |
| `/grill-me` | Stress-test a plan before building |
| `/handoff` | Package the session for a fresh agent / next day |

---

## A good prompt has…

1. **Goal** — what you want.
2. **Context** — the files, the error, the conventions (point at them).
3. **Constraints** — what NOT to do; "smallest diff."
4. **Done** — how success is judged (tests pass, builds, etc.).

> "In `cart.ts`, totals show NaN when qty is 0. Fix the root cause, don't refactor unrelated code, add a test, and show me the diff. Don't push."

---

## Do ✅

- Be specific; give context up front.
- Ask for a **plan before code** on big tasks.
- **Read every diff** before accepting.
- **Verify** — run the app/tests.
- Keep `.env` secret; commit only `.env.example`.
- One task per conversation; `/clear` to switch.
- Put durable project rules in `CLAUDE.md`.

## Don't ❌

- "Make it better" with no detail.
- Trust "it works" without running it.
- Paste secrets / API keys into chat.
- Push without reviewing the diff.
- Approve a destructive command you don't understand.
- Pile 10 unrelated tasks into one thread.
- Let it weaken auth/validation to pass a test.

---

## When stuck

| Symptom | Try |
|---|---|
| Output is off | Add context + constraints; restate the goal. |
| It edited too much | "Smallest diff; revert unrelated changes." |
| Confidently wrong | "Show me where in the code that's true." Verify. |
| Thread is a mess | `/clear` and restate cleanly. |
| Same context every time | Put it in `CLAUDE.md` / memory. |
| "Should work now" | "Run it and show me the output." |

→ More in `../Troubleshooting and FAQ/`

---

## The 5-second pre-accept check

- [ ] Did I read the diff?
- [ ] Was it verified (run/tested), not just claimed?
- [ ] Any secret leaking or security check weakened?

If all clear → accept. If not → don't.
