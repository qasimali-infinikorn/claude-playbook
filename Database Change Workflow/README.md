# Database Change Workflow

Database changes are high-risk because they affect persistent state. Agents can help, but the workflow must be explicit.

---

## Safe DB Rules

- Never edit generated schema files by hand.
- Use migrations.
- Test migration on realistic data when possible.
- Plan rollback before deploy.
- Keep data migrations idempotent.
- Avoid production writes from an agent session.
- Ask before running destructive SQL.

---

## Migration Prompt

```text
Plan this database change before editing files.
Return:
- schema change
- migration file(s)
- data migration needs
- rollback plan
- affected queries/models
- tests to add
- production risk
Wait for approval.
```

---

## Verification

Checklist:

- [ ] Migration applies cleanly.
- [ ] App starts after migration.
- [ ] Tests for affected models/queries pass.
- [ ] Rollback is possible or limitation is documented.
- [ ] Large-table impact considered.
- [ ] Indexes/constraints reviewed.
- [ ] Backfill is batched if needed.

---

## Dangerous Changes

Escalate to a human for:

- Dropping columns/tables.
- Backfilling large tables.
- Changing primary keys.
- Changing uniqueness constraints.
- Data deletion.
- Encryption/auth-related schema.
- Multi-service contract changes.

---

## PR Notes

```md
## DB Change

## Migration

## Rollback

## Data risk

## Verification

## Deployment order
```

---

## See Also

- [`../Security Guardrails/`](../Security%20Guardrails/)
- [`../Release and Deployment/`](../Release%20and%20Deployment/)
- [`../Verification Recipes/`](../Verification%20Recipes/)
