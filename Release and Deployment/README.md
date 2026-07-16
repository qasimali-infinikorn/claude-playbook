# Release And Deployment

Agent-assisted releases need stronger gates than normal coding tasks. A release changes what users run; deployment mistakes are often harder to undo than code mistakes.

---

## Release Checklist

- [ ] Working tree clean except intended release changes.
- [ ] Version/changelog updated.
- [ ] Tests, lint, typecheck, build pass.
- [ ] Security/audit checks considered.
- [ ] Migration plan reviewed.
- [ ] Rollback plan documented.
- [ ] Staging smoke test complete.
- [ ] Human approves deploy.
- [ ] Post-deploy check defined.

---

## Agent Prompt

```text
Prepare this release.
Do not deploy.
1. Inspect current branch and recent commits.
2. Draft changelog/release notes.
3. Identify migrations, config changes, and rollback risks.
4. Run the release quality bar.
5. Produce a release checklist for human approval.
```

---

## Deployment Prompt

```text
Before deployment, verify:
- branch and commit
- environment target
- migration status
- rollback command
- smoke checks
Ask for explicit approval before running any deploy command.
```

---

## Rollback Notes

Every release PR should include:

- Previous stable version/commit.
- Rollback command or process.
- Data migration rollback constraints.
- Feature flag fallback.
- Owners/on-call contacts.

---

## Never Automate Without Approval

- Production deploys.
- Production migrations.
- DNS changes.
- Payment/billing changes.
- Customer communications.
- Force pushes or history rewrites.

---

## See Also

- [`../Security Guardrails/`](../Security%20Guardrails/)
- [`../Git and PR Workflow/`](../Git%20and%20PR%20Workflow/)
- [`../Verification Recipes/`](../Verification%20Recipes/)
