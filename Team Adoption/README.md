# Team Adoption

Claude Code becomes more useful and safer when the team agrees on shared rules: what agents may do, what humans must review, and where durable context lives.

---

## Rollout Plan

### Week 1: Personal Use

- Install Claude Code.
- Read Getting Started, Cheat Sheet, Security Guardrails.
- Use it for read-only codebase questions and small docs changes.

### Week 2: Repo Readiness

- Add `CLAUDE.md`.
- Define quality bar commands.
- Add `.env.example`.
- Document file placement and safe-change rules.

### Week 3: Review Norms

- Require diff review.
- Require tests/verification evidence.
- Define commit/PR rules.
- Decide whether AI co-author trailers are allowed.

### Week 4: Shared Automation

- Add project commands/skills only after repeated use.
- Add hooks carefully.
- Add MCP only with least-privilege credentials.
- Consider harnesses for important workflows.

---

## Team Policy Template

```md
# AI Coding Policy

## Allowed
- Read-only exploration.
- Small code/docs changes on branches.
- Test generation.
- PR summaries.

## Requires human approval
- Commits.
- Pushes.
- Dependency additions.
- Database migrations.
- External comments/messages.
- Deployments.

## Never allowed
- Secrets in prompts.
- Production writes without authorization.
- Weakening security controls.
- Auto-merging agent output.
```

---

## Shared Repo Standards

- Root `CLAUDE.md`.
- Project setup checklist complete.
- Quality bar documented.
- Security guardrails documented.
- `.claude/settings.json` denies dangerous actions.
- Team-specific commands/agents reviewed.
- MCP/project plugins reviewed before sharing.

---

## Onboarding Prompt

```text
I am new to this codebase.
Explain:
- what the project does
- stack
- architecture
- where common changes go
- how to run tests/build
- safe-change rules
Do not edit files.
Reference paths.
```

---

## Review Culture

The human owns the merge. Claude can draft, review, test, and explain, but the human is accountable for what ships.

Require PRs to include:

- What changed.
- Why.
- How it was verified.
- Risks.
- Screenshots for UI.
- Migration/rollback notes when relevant.

---

## Anti-Patterns

- Letting every developer invent their own agent rules.
- Sharing broad MCP credentials.
- Adding hooks that surprise teammates.
- Treating AI review as a replacement for human review.
- No policy for external actions.

---

## See Also

- [`../Project Setup Checklist/`](../Project%20Setup%20Checklist/)
- [`../CLAUDE.md Best Practices/`](../CLAUDE.md%20Best%20Practices/)
- [`../Security Guardrails/`](../Security%20Guardrails/)
- [`../Git and PR Workflow/`](../Git%20and%20PR%20Workflow/)
