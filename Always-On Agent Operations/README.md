# Always-On Agent Operations

An always-on agent is a service, not a long chat. It wakes on a schedule or event, reads durable state, decides whether work is needed, performs bounded actions, records evidence, and returns to waiting.

The useful test is not “did it produce a good answer once?” It is “can it run repeatedly without duplicate work, silent failure, runaway cost, or unauthorized external effects?”

---

## The Operating Loop

```text
schedule/event
      ↓
acquire lease → load checkpoint → fetch changes → decide
      ↓                                │
      ├─ no change → record heartbeat ─┘
      │
      └─ work needed → prepare artifact → verify → approval gate → deliver
                                             ↓
                                  save checkpoint + run record
```

Every run should have a unique ID and a stable idempotency key derived from the event or source version.

---

## When to Use One

Good candidates:

- Daily or weekly intelligence brief.
- CI failure triage.
- Documentation drift detection.
- Dependency or security advisory monitoring.
- Queue or issue classification.
- Scheduled data-quality checks.

Avoid always-on operation when:

- The task is rare and a manual command is cheaper.
- “Interesting” or “done” cannot be evaluated consistently.
- Required credentials are broader than the value of the task.
- The agent would publish, deploy, merge, message customers, or spend money without approval.
- Inputs are untrusted and the action surface cannot be isolated.

---

## Durable State Model

Chat history is not an operational database. Persist the minimum state needed to resume safely:

```json
{
  "workflow": "daily-docs-drift",
  "checkpoint": "commit:abc123",
  "last_success_at": "2026-07-17T09:00:00Z",
  "last_run_id": "run_01J...",
  "processed_keys": ["release:v2.4.0"],
  "consecutive_failures": 0,
  "next_allowed_run_at": "2026-07-18T09:00:00Z"
}
```

Separate:

- **Checkpoint:** last source position known to be processed successfully.
- **Deduplication keys:** individual events already handled.
- **Run records:** immutable evidence of attempts and outcomes.
- **Configuration:** versioned policy, prompt, model, scopes, and limits.
- **Secrets:** external secret manager; never state or logs.

Advance the checkpoint only after the required artifact and delivery step succeed.

---

## Idempotency and Concurrency

A retry must not send the same email, open the same issue, or apply the same change twice.

Use an idempotency key:

```text
<workflow>:<source>:<source-version>:<action>
docs-drift:repo-a:commit-abc123:open-pr
```

Before acting:

1. Acquire a lease or distributed lock with an expiry.
2. Check whether the idempotency key already succeeded.
3. Record the attempt.
4. Execute the bounded action.
5. Record outcome atomically where possible.
6. Release the lease.

Handle expired workers: a lock needs a TTL, but a replacement worker must reconcile external state before retrying.

---

## Delivery Levels

Start at the lowest effect level and promote only with evidence:

| Level | Agent may | Human gate |
|---|---|---|
| Observe | Read sources and save internal report | None beyond normal access review |
| Recommend | Create a draft artifact | Human decides action |
| Prepare | Create branch/draft PR or queued message | Human approves send/merge |
| Act narrowly | Perform reversible allow-listed action | Pre-approved policy plus audit |
| High impact | Deploy, pay, delete, notify customers | Explicit per-action approval |

Most useful agents should remain at Recommend or Prepare.

---

## Scheduling Options

| Mechanism | Best for | Important limitation |
|---|---|---|
| Claude Code `/loop` | Repeating inside an active session | The session must remain alive; not durable service scheduling |
| Claude Code scheduled tasks | Supported scheduled prompts in Claude Code environments | Follow current product/runtime availability and permissions |
| GitHub Actions schedule | Repository workflows and artifact generation | Cron can be delayed; credentials and write permissions need care |
| Cloud scheduler + worker | Production service with queue/state/alerts | More infrastructure to own |
| Queue/event trigger | High-volume or event-driven work | Requires idempotency, backpressure, and dead-letter handling |

Do not use an infinite shell loop as production scheduling.

---

## Run Contract

```yaml
workflow: weekly-docs-drift
trigger: monday 09:00 UTC
source: repository default branch
checkpoint: last successful commit
allowed:
  - read repository
  - create branch
  - edit markdown and docs navigation
  - run npm run docs:build
  - open draft pull request
denied:
  - modify source code
  - merge pull request
  - push to default branch
limits:
  wall_time_minutes: 20
  attempts: 2
  max_changed_files: 20
  max_cost_usd: 3
verifier:
  - docs build exits 0
  - changed files are docs-only
escalation:
  - return blocked report and alert owner
```

The orchestration layer—not the model—must enforce hard limits and denied actions.

---

## Retry, Backoff, and Dead Letters

Classify failures before retrying:

| Failure | Retry? | Response |
|---|---|---|
| Transient network/429/5xx | Yes, bounded | Exponential backoff with jitter |
| Invalid credentials | No | Alert owner; do not loop |
| Invalid input/schema | No | Dead-letter with evidence |
| Verifier failure after mutation | Limited | Diagnose once, retry within cap |
| Permission denied | No | Escalate; never broaden permissions automatically |
| External action outcome unknown | Reconcile first | Query external system by idempotency key |

A dead-letter record should contain the input reference, run ID, failure class, attempts, safe error summary, and replay instructions. Do not copy secrets or unnecessary personal data.

---

## Observability

Minimum per-run record:

```json
{
  "run_id": "run_01J...",
  "workflow_version": "git:abc123",
  "trigger": "schedule",
  "checkpoint_before": "commit:def456",
  "status": "success",
  "decision": "change_detected",
  "tool_calls": 14,
  "model_tokens": 28400,
  "cost_usd": 0.84,
  "duration_seconds": 192,
  "artifacts": ["draft-pr:142"],
  "checkpoint_after": "commit:abc123"
}
```

Monitor:

- Run success/failure/blocked rate.
- Source-to-delivery latency.
- Consecutive failures and oldest unprocessed event.
- Duplicate-action rate.
- No-op rate and last successful heartbeat.
- Token/API/CI cost per useful artifact.
- Human acceptance, edit, and rejection rates.

Alert on missing heartbeats as well as failures. Silence can mean “nothing changed” or “the scheduler is dead”; record which.

---

## Security and Prompt Injection

Always-on agents repeatedly consume external content. Treat documents, issues, web pages, emails, and tool results as untrusted data.

- Separate instructions from retrieved content.
- Restrict tools and credentials by workflow.
- Use allow-listed destinations and actions.
- Do not let content request permission changes or secret access.
- Sanitize logs and artifacts.
- Require confirmation for external communication and irreversible effects.
- Rotate credentials and review audit logs.

---

## Rollout Plan

1. **Replay:** run historical inputs offline and measure usefulness.
2. **Shadow:** run on schedule but produce internal artifacts only.
3. **Recommend:** deliver suggestions to a human-owned queue.
4. **Prepare:** create drafts or branches that require approval.
5. **Automate narrowly:** allow only proven, reversible, low-impact actions.

Define rollback before promotion. For an agent, rollback may mean disabling the schedule, revoking credentials, reverting a PR, restoring the checkpoint, and replaying from a known source version.

---

## Operational Checklist

- [ ] Workflow has an owner and service-level expectation.
- [ ] Trigger and checkpoint semantics are documented.
- [ ] Idempotency key and lease behavior are tested.
- [ ] Retries are classified, bounded, and observable.
- [ ] Dead-letter and replay paths exist.
- [ ] Permissions and destinations are allow-listed.
- [ ] External effects have the correct human gate.
- [ ] Cost, duration, and action limits are enforced outside the model.
- [ ] Heartbeats distinguish no-change from failure.
- [ ] Prompt-injection exposure is reviewed.
- [ ] Disable, rollback, credential-revocation, and cleanup procedures are tested.

## Sources and Further Reading

- [Claude Code scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks)
- [Claude Code GitHub Actions](https://code.claude.com/docs/en/github-actions)
- [GitHub Actions scheduled events](https://docs.github.com/actions/using-workflows/events-that-trigger-workflows#schedule)
- [Awesome LLM Apps always-on briefing agent](https://github.com/Shubhamsaboo/awesome-llm-apps/tree/main/always_on_agents/always_on_hn_briefing_agent) — example of interactive and scheduled operation with multiple delivery channels

## See Also

- [`../Headless and CI/`](../Headless%20and%20CI/)
- [`../Loop Engineering/`](../Loop%20Engineering/)
- [`../Cost and Observability/`](../Cost%20and%20Observability/)
- [`../Harness/`](../Harness/)
- [`../Security Guardrails/`](../Security%20Guardrails/)
- [`../Release and Deployment/`](../Release%20and%20Deployment/)
