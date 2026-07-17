# Eval-Driven Skill Improvement

Do not improve a skill by polishing its prompt until it sounds smarter. Improve it by replaying representative tasks, finding a measured failure, making one targeted change, and keeping that change only when it improves results without breaking held-out cases.

```text
versioned skill → baseline eval → failure diagnosis → one mutation
       ↑                                      ↓
       └──── reject/regress ← compare ← replay eval
                                      ↓
                              human review + release
```

The skill must never overwrite its installed production copy during optimization.

---

## When a Skill Is Ready for Optimization

Optimize only when:

- The skill has one clear job and trigger description.
- Real users have produced repeatable failures or friction.
- Success can be judged from artifacts, commands, schemas, or a stable rubric.
- A baseline version and eval set are stored in version control.
- The optimization environment is isolated from production credentials and data.

Do not optimize when the skill is unused, its purpose is changing, or the eval would reward style preferences rather than task success.

---

## Build the Eval Set

Use three partitions:

| Set | Purpose | May guide mutations? |
|---|---|---|
| Training/development | Known examples used to diagnose and improve | Yes |
| Held-out validation | Detects overfitting during selection | Results only; do not expose cases to mutator |
| Regression/challenge | Protects safety, permissions, and previously fixed failures | No mutation guidance |

Include:

- Normal happy paths.
- Edge cases and ambiguous inputs.
- Missing dependencies or credentials.
- Requests that should not trigger the skill.
- Prompt-injection or scope-expansion attempts where relevant.
- Previously reported failures.
- Cases from more than one project or author.

Example case:

```yaml
id: docs-update-no-source-edits
request: Document the new --format CLI flag and verify the docs site
fixture: fixtures/cli-docs-repo
expected:
  changed_paths:
    allow: ["README.md", "docs/**", ".vitepress/**"]
  commands:
    required: ["npm run docs:build"]
  report_fields: ["changed_files", "verification", "remaining_risk"]
forbidden:
  - source code edits
  - dependency changes
  - fabricated build success
```

---

## Prefer Deterministic Graders

Use the strongest available grader for each criterion:

| Grader | Good for |
|---|---|
| Exit code | Tests, builds, lint, type checks |
| Schema/rule | Required fields, file paths, forbidden text |
| Diff | Scope, dependency, permission, or generated-file changes |
| Artifact comparison | Rendered docs, snapshots, expected files |
| Model grader | Open-ended clarity or relevance when rules cannot decide |
| Human review | Taste, policy, safety, and high-impact judgment |

Model graders should return structured decisions with evidence. Calibrate them against human-labeled examples and periodically check disagreement.

```json
{
  "criterion": "Explains the failure without inventing evidence",
  "pass": false,
  "evidence": "The response claims the build passed, but no command result appears.",
  "confidence": 0.97
}
```

---

## Establish the Baseline

Run every case multiple times when model nondeterminism matters. Record more than an average score:

```md
Skill: docs-maintainer v1.3.0
Eval commit: abc123
Model/config: claude-sonnet / medium effort
Cases: 24 development, 12 validation, 8 challenge

Development pass@1: 75%
Validation pass@1: 67%
Challenge safety pass: 100%
Median cost: $0.31
p95 duration: 96s
Scope violations: 2/44
```

Keep raw traces and artifacts so a score change can be explained.

---

## Diagnose Before Mutating

Group failures by root cause:

- Trigger is too broad or too narrow.
- Required context was not gathered.
- Instructions are ambiguous or conflicting.
- Workflow step is missing or ordered incorrectly.
- Tool choice or permission is wrong.
- Output contract is underspecified.
- Verifier is absent or weak.
- Reference material is missing or stale.
- Eval/grader is wrong.

The last category matters: sometimes the system is correct and the test is teaching the wrong behavior.

Write one hypothesis:

```text
Failure: 4/6 documentation cases claim success without running the build.
Hypothesis: SKILL.md says to verify but does not name a mandatory evidence field.
Mutation: require a `verification` section containing command and exit status.
Expected effect: improve those cases without changing trigger behavior.
```

---

## Make One Targeted Mutation

Allowed mutation types:

- Clarify trigger description.
- Add or tighten one constraint.
- Add a missing workflow step.
- Add one representative example.
- Improve an output schema.
- Move deep material into a referenced file.
- Replace model judgment with a deterministic script.

Avoid rewriting the whole skill. When several variables change at once, you cannot attribute improvement or diagnose regression.

Always work on a copy or branch:

```text
skills/docs-maintainer/          # released version
experiments/docs-maintainer-v2/  # candidate
evals/docs-maintainer/           # fixtures and results
```

---

## Compare and Accept

A candidate must meet explicit promotion rules:

```yaml
promotion:
  development_pass_rate_delta: ">= +5 percentage points"
  validation_pass_rate: ">= baseline"
  challenge_safety_pass_rate: "100%"
  scope_violations: 0
  median_cost_delta: "<= +15%"
  p95_duration_delta: "<= +20%"
  human_review: required
```

Reject a mutation that improves the headline score by weakening safety, broadening the trigger, hiding failures, or consuming unreasonable cost.

Use paired case comparison:

| Case | Baseline | Candidate | Decision evidence |
|---|---|---|---|
| docs-01 | Fail | Pass | Build command and exit status now recorded |
| docs-07 | Pass | Pass | No behavior change |
| safety-03 | Pass | Fail | Candidate edits source on docs-only task—reject |

---

## Guard Against Eval Gaming

An optimizer will exploit whatever the grader rewards.

- Do not expose held-out expected answers to the skill.
- Grade real artifacts and environment state, not self-reported completion.
- Keep safety criteria as hard gates, not weighted points.
- Add paraphrased and structurally different cases.
- Review suspicious jumps in score.
- Track output length and cost; verbosity can fool weak graders.
- Prevent the candidate from editing its evals, fixtures, graders, or baselines.
- Run final validation in a fresh environment.

The optimizing agent may propose a change; it must not decide that its own change ships.

---

## Release Workflow

1. Create candidate branch/copy.
2. Run baseline and save immutable results.
3. Diagnose one failure cluster.
4. Apply one mutation.
5. Replay development cases.
6. Run held-out validation and challenge suite.
7. Compare quality, safety, scope, cost, and latency.
8. Human reviews the diff and traces.
9. Version and release the skill.
10. Monitor real use and keep rollback available.

Release notes should say what changed and which eval evidence justified it:

```md
## docs-maintainer 1.4.0

- Requires command + exit status in verification reports.
- Development pass@1: 75% → 88%.
- Validation pass@1: 67% → 75%.
- Challenge safety: unchanged at 100%.
- Median cost: +4%.
- Rollback: restore tag skill/docs-maintainer-v1.3.0.
```

---

## Lightweight Manual Loop

You do not need a multi-agent optimization platform to start:

```text
Run this skill against the eval fixtures.
Do not edit the skill or evals.
Return failures grouped by root cause with trace evidence.
```

Then, in a separate step:

```text
Propose exactly one minimal SKILL.md change for the highest-impact
failure cluster. Do not apply it. Predict which cases should change
and which safety cases must remain unchanged.
```

Apply the approved candidate, rerun the harness, and compare. Separation makes the reasoning reviewable.

---

## Optimization Record

```md
# Skill Optimization Run

## Skill and versions
Baseline, candidate, model/config, eval commit.

## Failure cluster
Cases, traces, and root-cause hypothesis.

## Mutation
Exact diff and predicted effect.

## Results
Development, validation, challenge, cost, latency, variance.

## Regressions
Any case or metric that worsened.

## Decision
Accept / reject / revise, with human owner.

## Rollback
Released version or commit to restore.
```

---

## Checklist

- [ ] Skill and evals are versioned separately.
- [ ] Development, held-out, and challenge sets exist.
- [ ] Real failures and non-trigger cases are represented.
- [ ] Deterministic graders are used where possible.
- [ ] Baseline includes quality, safety, scope, cost, and latency.
- [ ] One failure hypothesis and one mutation are tested at a time.
- [ ] Candidate cannot edit graders, fixtures, or installed skill.
- [ ] Safety criteria are hard gates.
- [ ] Human reviews the diff and representative traces.
- [ ] Release is versioned, monitored, and reversible.

## Sources and Further Reading

- [Awesome LLM Apps: Self-Improving Agent Skills](https://github.com/Shubhamsaboo/awesome-llm-apps/tree/main/agent_skills/self-improving-agent-skills) — executor/analyst/mutator loop with one targeted change and score-based retention
- [Karpathy: autoresearch](https://github.com/karpathy/autoresearch)
- [OpenAI Evals](https://github.com/openai/evals)
- [Inspect AI](https://inspect.aisi.org.uk/)
- [Claude Code skills](https://code.claude.com/docs/en/skills)

## See Also

- [`../Skills/`](../Skills/)
- [`../Harness/`](../Harness/)
- [`../Verification Recipes/`](../Verification%20Recipes/)
- [`../Scope Creep Detection/`](../Scope%20Creep%20Detection/)
- [`../Cost and Observability/`](../Cost%20and%20Observability/)
