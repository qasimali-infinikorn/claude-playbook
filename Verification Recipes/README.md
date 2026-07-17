# Verification Recipes

Verification means observing that the change works. "Should work" is not verification.

Use these recipes as copy-paste starting points.

---

## Docs Verification

```bash
npm run docs:build
```

Checklist:

- [ ] New page linked from README.
- [ ] Sidebar/nav updated.
- [ ] Internal links work.
- [ ] No raw placeholder text.

---

## Code Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Use the project-specific commands from `CLAUDE.md`.

---

## Bug Fix Verification

```text
1. Reproduce the failure.
2. Add regression test.
3. Confirm test fails before fix if practical.
4. Apply fix.
5. Run focused test.
6. Run related suite.
```

---

## UI Verification

Checklist:

- [ ] App starts.
- [ ] Primary flow works.
- [ ] Mobile, tablet, desktop screenshots captured.
- [ ] Loading, empty, error, hover, focus states checked.
- [ ] Keyboard navigation works.
- [ ] Text does not overflow.

---

## API Verification

Checklist:

- [ ] Happy path.
- [ ] Validation error.
- [ ] Auth missing/invalid.
- [ ] Permission denied.
- [ ] Idempotency/retry behavior if relevant.
- [ ] Contract unchanged or documented.

---

## Database Verification

Checklist:

- [ ] Migration applies.
- [ ] Migration rolls back or has rollback plan.
- [ ] Existing data remains valid.
- [ ] Query plan acceptable for large tables.
- [ ] Seeds/fixtures updated.
- [ ] Backup/staging tested for risky changes.

---

## Security Verification

Checklist:

- [ ] No secrets in diff.
- [ ] Auth not weakened.
- [ ] CORS/TLS/validation not loosened.
- [ ] Inputs validated.
- [ ] Sensitive logs avoided.
- [ ] Dependency audit considered.

---

## Scope Verification

Before committing or opening a PR:

```bash
git diff --name-status
git diff --stat
git diff --check
```

- [ ] Every changed file traces to the request or a necessary supporting change.
- [ ] Dependencies, schema, configuration, permissions, CI, and generated files are reviewed explicitly.
- [ ] Drive-by cleanup is reverted or split into another change.
- [ ] Risky expansion has human approval.
- [ ] The retained diff still passes its verifier.

Use the full [`Scope Creep Detection`](../Scope%20Creep%20Detection/) workflow for multi-file or high-risk changes.

---

## Prompt

```text
Verify this change.
Run the relevant recipe from Verification Recipes.
Report:
- commands run
- outputs
- manual checks
- screenshots/artifacts
- remaining risk
Do not claim success without evidence.
```

---

## See Also

- [`../Harness/`](../Harness/)
- [`../Common Mistakes/`](../Common%20Mistakes/)
- [`../Security Guardrails/`](../Security%20Guardrails/)
- [`../Scope Creep Detection/`](../Scope%20Creep%20Detection/)
