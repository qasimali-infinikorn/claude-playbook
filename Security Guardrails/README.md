# Security Guardrails

The non-negotiables. Read this once, internalize it, never violate it. These exist because the mistakes here are expensive, public, and sometimes irreversible.

> Claude Code asks before risky actions — but **you** approve them. Approval is your responsibility. When unsure, stop and ask a senior.

---

## 🔴 Never do these

### Never paste secrets into the chat
API keys, passwords, tokens, private keys, customer data, `.env` contents. Prompts can be logged. If a secret was exposed, treat it as compromised and **rotate it immediately**.

### Never commit secrets
`.env` stays git-ignored; commit only `.env.example` with placeholder values. Check `git status` before committing. A leaked key in git history is leaked forever (even after deletion).

### Never approve a destructive command you don't understand
`rm -rf`, `DROP TABLE`, `git push --force`, `git reset --hard`, production deploys, mass file deletes. If you can't explain what it does and why it's safe, **don't approve it** — ask Claude to explain first, or ask a senior.

### Never run anything against production without explicit authorization
No prod DB migrations, no prod data scripts, no "quick fix on the live server." Test in dev/staging.

### Never weaken security to make something work
Disabling auth checks, loosening CORS, removing input validation, hardcoding a key "just for now," turning off TLS verification. These find their way to production. If a security control is in your way, fix it properly or escalate.

---

## 🟡 Be careful with these

- **External / outward-facing actions** — sending email, posting to APIs, publishing a repo, creating issues. Confirm before anything leaves your machine; it may be cached/indexed even if deleted.
- **Installing dependencies** — new packages are supply-chain risk. Verify the package is real and trusted; don't add deps casually.
- **Granting broad permissions / tokens** — least privilege. A token needs only the scopes for the task.
- **Pasting code from unknown sources** — review before running.
- **PII / customer data** — don't feed it into prompts unless your org's policy explicitly allows it.

---

## ✅ Good habits

- Keep secrets in a secret manager or git-ignored `.env`; reference by name.
- Tell Claude in `CLAUDE.md`: "secrets stay in `.env`; never log or echo them; don't weaken auth/CORS/encryption." → `../CLAUDE.md Best Practices/`
- Review diffs for accidentally-included secrets before committing.
- Use scoped, short-lived tokens.
- When a command is irreversible, pause and double-check the target.

---

## If something goes wrong

1. **Secret leaked?** Rotate it now. Then clean history / notify whoever owns it.
2. **Ran something destructive?** Stop, don't pile on more commands, tell a senior immediately — early honesty is recoverable, hidden damage isn't.
3. **Not sure if it's a problem?** Ask. Always cheaper than guessing.

> Rule of thumb: if an action is hard to undo or sends data outside your machine, slow down and confirm.
