# Plugins Playbook

Plugins package commands, skills, hooks, MCP servers, and project conventions so they can be installed and reused. Treat plugins like dependencies: useful, powerful, and worth reviewing before trust.

---

## Plugin Vs Skill Vs MCP

| Thing | What it is | Use when |
|---|---|---|
| Skill | A reusable instruction pack | You need task-specific guidance |
| MCP server | A connector/tool provider | Claude needs access to external systems |
| Plugin | A bundle/distribution mechanism | You want to install or share a capability set |

A plugin may include skills, commands, hooks, and MCP server configuration.

---

## When To Use Plugins

Use plugins when:

- A workflow recurs across projects.
- A team needs the same commands/skills.
- A third-party package provides maintained capability.
- You want a versioned bundle instead of copy-pasted files.

Avoid plugins when:

- One local command is enough.
- You cannot review what the plugin installs.
- It asks for broad credentials or unsafe hooks.
- It duplicates existing project conventions.

---

## Installation Checklist

Before installing:

- [ ] Read the plugin README.
- [ ] Inspect included skills/commands/hooks/MCP config.
- [ ] Check whether it runs shell commands.
- [ ] Check whether it connects to external services.
- [ ] Check license and maintenance.
- [ ] Install locally before recommending to a team.

After installing:

- [ ] Run `/reload-plugins` if needed.
- [ ] Run one low-risk example.
- [ ] Remove anything you do not use.
- [ ] Document project-specific expectations in `CLAUDE.md`.

---

## Safe Prompt

```text
Inspect this plugin before I install it.
Summarize:
- what commands/skills/hooks/MCP servers it adds
- what permissions it needs
- what external systems it can access
- risky behaviors
- whether it should be installed locally, project-wide, or not at all
Do not install it yet.
```

---

## Team Use

For team-shared plugins:

1. Test locally.
2. Create a short usage doc.
3. Add only the necessary plugin/config.
4. Review security impact.
5. Put project-specific rules in `CLAUDE.md`.
6. Add a rollback/removal note.

---

## Anti-Patterns

- Installing a plugin because it sounds useful, then never using it.
- Letting plugins silently add broad MCP access.
- Using plugin hooks as invisible policy.
- Pinning team behavior to an unmaintained plugin.
- Installing overlapping plugins that fight over commands or skills.

---

## See Also

- [`../Skills/`](../Skills/)
- [`../MCP Playbook/`](../MCP%20Playbook/)
- [`../Security Guardrails/`](../Security%20Guardrails/)
- [Claude Code plugin docs](https://code.claude.com/docs/en/plugins)
