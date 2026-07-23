# MCP Playbook

MCP (Model Context Protocol) is how Claude Code connects to tools and data outside the repo: issue trackers, databases, design tools, monitoring systems, docs, browsers, and custom internal services.

Use MCP when you keep copying information from another system into chat. Do not use MCP just because it exists; every connected server expands what the agent can read or do.

MCP is one layer of a production agent's connectivity stack. Skills define **how work should be done**, MCP exposes **structured remote capabilities**, and CLI tools perform **scriptable local execution**. Mature agents often use all three, with each layer doing the job it is easiest to test and secure.

> Research note (23 July 2026): this framing was prompted by Ana Bildea's May 2026 article, [“How to Build Production-Ready AI Agents: MCP, CLI, and Skills”](https://medium.com/agentic-builders/how-to-build-production-ready-ai-agents-mcp-cli-and-skills-the-right-tool-for-the-right-job-701dc102863f). Its accessible introduction supports the layered approach; the implementation and safeguards below are cross-checked against official Claude Code and MCP documentation.

---

## Skills vs MCP vs CLI

These mechanisms overlap at the edges, but they solve different problems.

| Layer | Primary job | Best at | Weakness if used alone |
|---|---|---|---|
| Skill | Encode procedure, judgment, and output rules | Repeatable playbooks, domain guidance, checklists, orchestration | Instructions cannot create access or guarantee deterministic execution |
| MCP | Expose typed tools, resources, and prompts from another system | SaaS APIs, databases, shared services, remote data, OAuth | Adds a server, protocol, authorization, latency, and prompt-injection surface |
| CLI | Execute a local program through arguments, stdin/stdout, and exit codes | Repo tools, scripts, bulk operations, CI, deterministic verification | Interfaces may be text-heavy, machine-specific, or unsafe without argument controls |

The choice is not “which one wins?” It is “where should this responsibility live?”

### Use a skill when

- The missing piece is a repeatable method, not a new external capability.
- The workflow combines tools in a particular order.
- Claude needs domain-specific checks, examples, templates, or a result schema.
- The procedure should be readable and easy to revise as Markdown.

Example: a `/release-check` skill tells Claude which changelog, test, security, and rollback evidence a release must contain. The skill may call existing CLI and MCP tools, but it owns the procedure.

### Use MCP when

- The capability lives behind a service or API.
- The agent needs structured tool discovery and typed arguments.
- Authentication, tenancy, and authorization should be handled by a connector.
- Multiple MCP-compatible hosts should reuse the same server.
- The server should expose resources or prompts in addition to actions.

Example: a Sentry MCP server exposes issue lookup and event details. The agent does not need to scrape the dashboard or memorize a vendor-specific CLI output format.

### Use a CLI when

- A maintained command already exists and works locally or in CI.
- Exit codes and machine-readable output make verification deterministic.
- The operation is repository-local, batch-oriented, or shell-native.
- Adding a long-lived server would create more complexity than value.

Example: use `npm test -- --runInBand`, `git diff --check`, or `gh pr checks --json ...` when those commands already provide the exact operation and evidence required.

### Do not confuse “CLI” with “Claude Code CLI”

Two meanings appear in agent discussions:

1. **Claude Code CLI** — the `claude` terminal application that hosts the agent.
2. **A tool's CLI** — programs such as `git`, `gh`, `kubectl`, or an internal `acme` command that the agent invokes.

In the connectivity stack, CLI usually means the second: an executable interface available to the agent. Claude Code itself is the host coordinating skills, MCP servers, and command execution.

---

## Decision Framework

Use the smallest interface that gives you a clear contract and verifier.

```text
Is the missing capability mainly knowledge or procedure?
├── Yes → Skill
└── No
    Is it an existing local/scriptable operation with reliable output?
    ├── Yes → CLI
    └── No
        Does it require structured access to a remote/shared system?
        ├── Yes → MCP
        └── No → built-in tool or a small application function may be enough
```

Then check whether the job needs a combination:

- Skill + CLI: encode a migration procedure and run the project's migration/test commands.
- Skill + MCP: encode a support-triage policy and read tickets through MCP.
- MCP + CLI: retrieve a deployment incident remotely, then inspect local logs with a CLI.
- Skill + MCP + CLI: coordinate an end-to-end workflow with remote context, local execution, and explicit verification.

### Selection scorecard

Score candidate interfaces before building another integration.

| Question | Skill | MCP | CLI |
|---|---:|---:|---:|
| Needs new access to a remote service? | 0 | 3 | 1 |
| Mostly reusable instructions or judgment? | 3 | 1 | 0 |
| Existing executable already solves it? | 0 | 1 | 3 |
| Must work across different agent hosts? | 2 | 3 | 1 |
| Needs deterministic exit status or piping? | 0 | 1 | 3 |
| Needs typed discoverable tools/resources? | 0 | 3 | 1 |
| Must be easy for humans to read and edit? | 3 | 1 | 2 |

The numbers are a design aid, not a universal benchmark. Security, deployment environment, latency, and maintenance ownership can override the total.

---

## Production Example: Incident-to-Fix Agent

Suppose an agent must investigate a production error, patch the repository, and prepare a pull request without deploying.

```text
Skill: incident-fix procedure
  ↓
MCP: read Sentry issue and linked ticket
  ↓
CLI: rg/git/test/typecheck inspect and verify the local change
  ↓
MCP or CLI: create a draft PR only after policy gate
  ↓
Skill: produce evidence summary and remaining-risk report
```

### Responsibility split

| Responsibility | Interface | Reason |
|---|---|---|
| Triage order, evidence rules, stop conditions | Skill | Human-readable procedure and policy |
| Read production issue/event data | MCP | Structured remote access with scoped auth |
| Search source and inspect Git history | CLI/built-in tools | Fast, local, auditable |
| Run tests and type checking | CLI | Deterministic command output and exit codes |
| Create a draft PR | GitHub MCP or `gh` CLI | Choose based on existing auth/governance |
| Prohibit merge/deploy | Permission policy and human gate | Authorization must not depend on prose alone |

### Example skill contract

```yaml
name: incident-fix
inputs:
  issue_id: required
remote_reads:
  - sentry.get_issue
  - tracker.get_ticket
local_commands:
  - rg
  - git diff
  - project test command
allowed_external_writes:
  - create_draft_pull_request
denied:
  - merge_pull_request
  - deploy
  - modify_production_data
done_when:
  - root cause cites remote and local evidence
  - focused regression test fails before and passes after the fix
  - full required quality gate exits 0
  - draft PR contains verification and rollback notes
max_attempts: 3
```

The skill describes the contract. MCP and CLI provide capabilities. Settings, credentials, sandboxing, and approval gates enforce authority.

---

## When To Use MCP

Use MCP for:

- Reading tickets, PRs, docs, dashboards, or design files directly.
- Querying databases or analytics in controlled environments.
- Calling internal APIs through a typed tool surface.
- Receiving external events through channels or webhooks.
- Exposing repeatable prompts/resources from a server.

Avoid MCP when:

- The task can be solved from the local repo.
- The server requires broad credentials for a narrow task.
- You cannot audit what tools/resources the server exposes.
- The server fetches untrusted content and may introduce prompt injection.
- A simple CLI command is safer and more transparent.

---

## Server Scopes

| Scope | Use for | Risk |
|---|---|---|
| Local | Your personal setup in one project | Lowest sharing risk |
| Project | Shared repo config such as `.mcp.json` | Needs team review |
| User | Available across all projects | Easy to overexpose |

Default to local. Promote to project scope only when the whole team needs it and the credentials are not embedded in the repo.

---

## Safe Setup Flow

1. **Define the job.** What exact data/tool is needed?
2. **Pick the narrowest server.** Prefer one service-specific connector over an all-purpose browser/API connector.
3. **Scope credentials.** Read-only first; short-lived tokens where possible.
4. **Install locally first.** Test before sharing.
5. **Inspect tools.** Use `/mcp` or `claude mcp list/get`.
6. **Run one read-only task.** Confirm the server returns expected data.
7. **Document usage.** Add allowed/denied actions to `CLAUDE.md`.
8. **Promote only if useful.** Move to project config after review.

Before creating a new MCP server, check whether a narrow skill around an existing CLI would solve the job with less infrastructure. Before relying on a CLI that scrapes human-formatted output or handles complex OAuth, check whether an official MCP server offers a more stable typed contract.

---

## Common Commands

```bash
claude mcp list
claude mcp get github
claude mcp remove github

# Remote HTTP server
claude mcp add --transport http sentry https://example.com/mcp

# Local stdio server
claude mcp add --transport stdio local-tool -- node ./mcp-server.js
```

Use `/mcp` inside Claude Code to inspect connection status and authenticate remote servers.

---

## Example Servers

| Server | Useful for | Guardrail |
|---|---|---|
| GitHub | Issues, PRs, comments, repo metadata | Do not merge/push without human approval |
| Postgres | Controlled data questions | Read-only user; never production writes |
| Sentry | Error triage | Avoid exposing customer PII |
| Figma | Design tokens/layouts | Treat design system as source, not final UI |
| Docs/Context7 | Current library docs | Redact secrets from queries |
| Browser | Visual verification | Avoid external posting unless requested |

---

## Prompt Examples

```text
Use the GitHub MCP server to read issue ENG-4521 and summarize the requested behavior.
Do not edit files yet. Tell me which local files probably need inspection.
```

```text
Use the Sentry MCP server to inspect the latest errors for the checkout service.
Group them by root cause and link each to a likely owning area.
Do not create issues or post comments.
```

```text
Use the database MCP server in read-only mode to answer:
How many test accounts triggered the rate limiter yesterday?
Return the query and result. Do not run writes.
```

---

## Security Rules

- Never commit tokens or `.mcp.json` entries containing credentials.
- Prefer environment variables or secret managers.
- Use read-only credentials unless the workflow explicitly needs writes.
- Deny dangerous actions in `.claude/settings.json`.
- Treat remote MCP content as untrusted input.
- Require human approval before external effects: comments, emails, deploys, writes.
- Review plugin-provided MCP servers before enabling them.
- Keep authorization outside skill prose; instructions can guide behavior but cannot enforce access control.
- Prefer machine-readable CLI output and fixed argument allowlists over parsing terminal prose.
- Log the interface, operation, target, result, latency, and approval decision for externally consequential calls.
- Treat data returned by MCP and CLI tools as untrusted content, not higher-priority instructions.

### Layer-specific failure modes

| Layer | Common failure | Production control |
|---|---|---|
| Skill | Stale or vague instructions; accidental activation | Narrow trigger, versioned evals, explicit verifier |
| MCP | Excessive permissions, server outage, prompt injection, tool drift | Least privilege, timeouts, schema validation, allowlists, circuit breaker |
| CLI | Shell injection, platform drift, unstable text output, hanging process | Argument arrays, sandbox, JSON output, timeout, exit-code check |

Never interpolate untrusted model or remote content into a shell command string. Pass validated values as discrete arguments through a constrained execution layer.

---

## Troubleshooting

| Problem | Check |
|---|---|
| Server missing | `claude mcp list`, `/mcp`, project trust prompt |
| Auth failure | OAuth status, token scopes, expired credentials |
| Tool unavailable | Server exposes tools? Tool search enabled? Server still connecting? |
| Huge output | Add server-side filters; reduce query scope |
| Wrong repo/project | Check project root and server environment |
| Prompt injection concern | Use read-only mode; summarize instead of acting |
| Agent chooses the wrong interface | Reduce overlap; document ownership in the skill; test tool-selection cases |
| CLI output parsing breaks | Request JSON/structured output and pin a compatible version |
| Same action exists in MCP and CLI | Pick one canonical write path; keep the other read-only or disabled |

---

## Checklist

- [ ] Server has a clear job.
- [ ] Credentials are least-privilege.
- [ ] Config does not commit secrets.
- [ ] Tools/resources were inspected.
- [ ] First run was read-only.
- [ ] Dangerous writes require approval.
- [ ] Usage is documented in `CLAUDE.md`.
- [ ] A skill, built-in tool, or existing CLI was considered before adding a server.
- [ ] Responsibilities do not overlap ambiguously across skill, MCP, and CLI layers.
- [ ] Timeouts, retries, output limits, and audit events are defined.
- [ ] The complete hybrid workflow has an end-to-end fixture and verifier.

---

## Production Readiness Checklist

- [ ] Every capability has one named owner and one canonical interface.
- [ ] Input and output schemas are validated at boundaries.
- [ ] Credentials are scoped per environment and never embedded in skills or repository config.
- [ ] Read operations and write operations use separate permissions where possible.
- [ ] Network calls and processes have timeouts, bounded retries, and useful errors.
- [ ] External writes require idempotency keys or duplicate detection.
- [ ] High-impact actions require explicit human approval.
- [ ] Logs preserve tool name, sanitized arguments, result, duration, and trace ID.
- [ ] Evals cover normal, ambiguous, unauthorized, unavailable, and malicious-input cases.
- [ ] The system can disable one layer without silently bypassing policy through another.
- [ ] Runbooks explain credential revocation, server disablement, CLI rollback, and skill removal.

---

## See Also

- [`../Security Guardrails/`](../Security%20Guardrails/)
- [`../Claude Directory Layout/`](../Claude%20Directory%20Layout/)
- [`../Harness/`](../Harness/)
- [`../Loop Engineering/`](../Loop%20Engineering/)
- [`../Skills/`](../Skills/)
- [`../Plugins Playbook/`](../Plugins%20Playbook/)
- [`../AI Agent Patterns/`](../AI%20Agent%20Patterns/)
- [Claude Code MCP docs](https://code.claude.com/docs/en/mcp)
- [Claude Code skills docs](https://code.claude.com/docs/en/skills)
- [Claude Code CLI reference](https://code.claude.com/docs/en/cli-usage)
- [MCP architecture overview](https://modelcontextprotocol.io/docs/learn/architecture)
- [How to Build Production-Ready AI Agents: MCP, CLI, and Skills](https://medium.com/agentic-builders/how-to-build-production-ready-ai-agents-mcp-cli-and-skills-the-right-tool-for-the-right-job-701dc102863f)
