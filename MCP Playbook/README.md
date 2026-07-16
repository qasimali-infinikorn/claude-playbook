# MCP Playbook

MCP (Model Context Protocol) is how Claude Code connects to tools and data outside the repo: issue trackers, databases, design tools, monitoring systems, docs, browsers, and custom internal services.

Use MCP when you keep copying information from another system into chat. Do not use MCP just because it exists; every connected server expands what the agent can read or do.

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

---

## Checklist

- [ ] Server has a clear job.
- [ ] Credentials are least-privilege.
- [ ] Config does not commit secrets.
- [ ] Tools/resources were inspected.
- [ ] First run was read-only.
- [ ] Dangerous writes require approval.
- [ ] Usage is documented in `CLAUDE.md`.

---

## See Also

- [`../Security Guardrails/`](../Security%20Guardrails/)
- [`../Claude Directory Layout/`](../Claude%20Directory%20Layout/)
- [`../Harness/`](../Harness/)
- [`../Loop Engineering/`](../Loop%20Engineering/)
- [Claude Code MCP docs](https://code.claude.com/docs/en/mcp)
