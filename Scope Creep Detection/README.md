# Scope Creep Detection

Scope creep is the gap between the requested change and the delivered diff. It is not measured by line count: a five-line dependency upgrade can be unrelated, while a necessary regression test may be completely in scope.

Use this workflow before committing or opening a PR. It reconstructs the change contract, inventories the diff, classifies every changed file, and asks for a decision on anything that cannot be traced to the original intent.

---

## The Change Contract

Write the request as a compact contract before judging the diff:

```yaml
intent: Add CSV export to the orders page
acceptance:
  - Export includes the currently filtered orders
  - Columns match the visible table
  - Existing permissions still apply
allowed_areas:
  - app/orders/
  - lib/export/
  - tests/orders/
constraints:
  - No new production dependency
  - No unrelated UI redesign
  - No database schema change
verifier:
  - npm test -- orders
  - npm run typecheck
```

If the request is only “clean this up,” clarify it before running a scope review. A detector cannot compare a diff against an undefined boundary.

---

## Classify Every Changed File

| Classification | Meaning | Default action |
|---|---|---|
| Required | Directly implements an acceptance criterion | Keep |
| Supporting | Test, type, docs, fixture, or refactor necessary for the required change | Keep and explain |
| Incidental | Mechanical output caused by the change, such as a lockfile or generated artifact | Verify and justify |
| Unrelated | Cannot be traced to the contract | Revert or split |
| Risky expansion | Broadens public behavior, dependencies, schema, permissions, or architecture | Stop for approval |
| Unclear | Evidence is insufficient | Ask; do not silently keep |

“While I was here” is not a supporting justification. Supporting work must be necessary to make, test, document, or safely operate the requested behavior.

---

## Manual Review Workflow

### 1. Record the baseline

```bash
git status --short
git diff --name-status
git diff --stat
```

Use the correct comparison base for the workflow: unstaged changes, staged changes, or the full branch against its merge base.

```bash
# Working tree
git diff

# Staged commit candidate
git diff --cached

# Branch against main's merge base
git diff "$(git merge-base HEAD origin/main)"...HEAD
```

### 2. Inspect high-signal expansion indicators

```bash
git diff --name-only
git diff -- package.json package-lock.json pnpm-lock.yaml yarn.lock
git diff -- '*.sql' 'db/**' 'migrations/**'
git diff -- '.github/**' '.claude/**' '*config*'
git diff --numstat
```

Look for:

- Files outside the named feature area.
- New dependencies or large lockfile changes.
- Schema, infrastructure, CI, or permission changes.
- Deleted or skipped tests.
- Public API changes not required by the request.
- Formatting churn mixed with behavior changes.
- Generated files changed without their source.
- Secrets, local paths, logs, or temporary artifacts.

### 3. Build a ledger

```md
| File | Classification | Contract link | Evidence | Decision |
|---|---|---|---|---|
| app/orders/export.ts | Required | CSV export | Implements serializer | Keep |
| tests/orders/export.test.ts | Supporting | Export correctness | Regression coverage | Keep |
| package.json | Risky expansion | None | Adds CSV library | Replace or approve |
| app/profile/avatar.ts | Unrelated | None | Drive-by cleanup | Split |
```

### 4. Verify the retained diff

After removing or splitting unrelated work, rerun the project verifier and repeat the file inventory. Scope review is incomplete if cleanup breaks the intended change.

---

## Agent Prompt

```text
Perform a scope-creep review. Do not edit files.

Original intent:
<request or issue>

Acceptance criteria:
<criteria>

Constraints:
<constraints>

Compare the complete branch diff with the merge base.
Classify every changed file as required, supporting, incidental,
unrelated, risky expansion, or unclear.

For each file, cite the acceptance criterion or constraint it serves.
Flag dependency, schema, config, permission, generated-file,
public-API, and test-deletion changes separately.

Return:
- verdict: clean | review-needed | split-required
- file ledger
- scope risks ranked by impact
- recommended keep/split/revert decisions
- verification commands

Do not call a change unrelated solely because its path was not named.
Judge necessity from evidence.
```

Use a read-only reviewer. The same agent that authored a broad diff is likely to rationalize it.

---

## Automate the Deterministic Part

A CI scope gate can reliably detect changed paths and policy boundaries. It cannot reliably infer product intent by itself.

```bash
changed_files="$(git diff --name-only origin/main...HEAD)"

# Example: flag production dependency changes for human review.
if printf '%s\n' "$changed_files" | rg -q '^(package.json|.*lock.*)$'; then
  echo "Dependency files changed: approval required"
  exit 1
fi
```

Prefer repository-owned allow/deny rules for hard boundaries:

```yaml
scope_policy:
  approval_required:
    - "migrations/**"
    - ".github/workflows/**"
    - "package.json"
    - "**/*lock*"
  forbidden_artifacts:
    - "**/.env"
    - "**/*.log"
    - "tmp/**"
```

Keep model judgment advisory until its false-positive and false-negative rates are measured on historical PRs.

---

## Examples

### Bug fix with a regression test

Request: fix a crash when an empty CSV is imported.

- Parser guard: required.
- Empty-file fixture: supporting.
- Regression test: supporting.
- Renaming all parser functions: unrelated unless the fix genuinely requires it.
- Replacing the CSV library: risky expansion requiring approval.

### Documentation-only request

Request: document a new CLI flag.

- CLI reference and navigation: required.
- Docs snapshot update: incidental/supporting.
- Source default change: risky and outside a docs-only contract.
- Formatting every Markdown file: unrelated churn.

### Refactor request

Request: split a 1,200-line module without behavior changes.

- New modules and import rewiring: required.
- Characterization tests: supporting.
- Public API redesign: risky expansion.
- Feature behavior added during extraction: unrelated.

---

## False Positives to Avoid

- A test outside the feature folder may be the correct integration test.
- A type definition may need to change because it is the actual shared contract.
- A lockfile change is expected when an approved dependency changes.
- Generated output may be required when its source changed.
- A security fix may need a wider boundary than the symptom suggests.

Classification must follow causal necessity, not path proximity.

---

## Review Checklist

- [ ] Original intent and acceptance criteria are written down.
- [ ] Correct merge base and complete diff were inspected.
- [ ] Every changed file appears in the ledger.
- [ ] Dependency, schema, config, permission, CI, and generated changes are explicit.
- [ ] Supporting changes explain why they are necessary.
- [ ] Unrelated work is reverted or split into another commit/PR.
- [ ] Risky expansion has human approval.
- [ ] The retained diff passes the verifier.
- [ ] The PR description matches what the diff actually does.

## Sources and Further Reading

- [Awesome LLM Apps: scope-creep-detector](https://github.com/Shubhamsaboo/awesome-llm-apps/tree/main/agent_skills/scope-creep-detector) — inspiration for comparing diff intent with implementation
- [Git diff documentation](https://git-scm.com/docs/git-diff)
- [Claude Code code review](https://code.claude.com/docs/en/code-review)

## See Also

- [`../Verification Recipes/`](../Verification%20Recipes/)
- [`../Git and PR Workflow/`](../Git%20and%20PR%20Workflow/)
- [`../Spec to Implementation/`](../Spec%20to%20Implementation/)
- [`../AI Coding Standards/`](../AI%20Coding%20Standards/)
- [`../Skills/`](../Skills/)
