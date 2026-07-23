# Claude Plugins Playbook

Claude Code plugins package reusable capabilities so you can install them as a unit. A plugin can contain skills, agents, hooks, MCP servers, LSP servers, and monitors. That makes plugins convenient, but it also makes them executable dependencies: inspect them before granting trust.

This guide explains what plugins are, how marketplaces work, how to choose useful plugins, and how to install and govern them safely.

> Research note (23 July 2026): the popularity examples below come from PluginMarketplace.ai's live install ranking. Popularity is a discovery signal, not proof of security, maintenance quality, or fit.

---

## The Mental Model

```text
Marketplace (catalog)
└── Plugin (installable package)
    ├── Skills and commands      reusable instructions and shortcuts
    ├── Agents                   specialized workers
    ├── Hooks                    automatic actions around tool events
    ├── MCP servers              connections to external tools and data
    ├── LSP servers              code intelligence
    └── Monitors                 background observation
```

Adding a marketplace only registers a catalog. It does **not** install every plugin in that catalog. You choose and install plugins separately.

### Plugin vs skill vs MCP

| Thing | What it is | Use it when |
|---|---|---|
| Skill | A reusable instruction pack | Claude needs a repeatable method for a task |
| Agent | A specialized worker with its own role and context | Work benefits from focused delegation |
| Hook | An automatic event-triggered action | A check or policy must run consistently |
| MCP server | A connector that exposes external tools or data | Claude needs to interact with another system |
| LSP server | A language-aware code intelligence service | Claude needs definitions, references, and diagnostics |
| Plugin | A package containing one or more of the above | You want versioned installation and distribution |
| Marketplace | A catalog of installable plugins | You want discovery, updates, or team distribution |

An MCP server is not synonymous with a plugin. A plugin may configure an MCP server, but it can also contain no MCP integration at all.

---

## What the Two Shared Sources Tell Us

### PluginMarketplace.ai

The [Best Claude Plugins ranking](https://pluginmarketplace.ai/best-claude-plugins) says it sources install counts from `claude.com/plugins` and refreshes them daily. On 23 July 2026, its leading entries included Frontend Design, Superpowers, Code Review, Context7, Skill Creator, Code Simplifier, GitHub, Playwright, CLAUDE.md Management, and Feature Dev.

Use this list to answer **what should I inspect?**, not **what should I trust?** Install totals do not reveal:

- whether a plugin fits your workflow;
- what permissions or credentials it needs;
- whether its hooks execute shell commands;
- how quickly its maintainers patch vulnerabilities;
- whether it duplicates capabilities already in your setup;
- whether the current release is the same one users originally installed.

### Towards AI's “10 Claude Plugins” article

The [Towards AI article](https://pub.towardsai.net/the-10-claude-plugins-you-actually-need-in-2026-and-what-they-are-85674941c324), published 18 March 2026, frames plugins as a way to add coding, browsing, connected data, browser control, live documentation, and memory. Its publicly accessible text also describes the ecosystem largely through MCP.

That is a useful capability overview, but the implementation distinction matters: Claude Code plugins are broader packages, while MCP is specifically the protocol used for external tool and data connections. The article's itemized top-ten section was not publicly readable during this review, so this playbook does not reproduce or guess that list.

---

## Choose by Job, Not Rank

Start with a bottleneck you can name. Then test one plugin that addresses it.

| Need | Candidates worth inspecting | What to measure |
|---|---|---|
| Better UI implementation | Frontend Design, Figma | Visual review pass rate, accessibility defects, rework |
| Safer code changes | Code Review, PR Review Toolkit, CodeRabbit, Semgrep | Useful findings, false positives, escaped defects |
| Current library knowledge | Context7, Microsoft Docs | Correct API usage, citation freshness, retrieval latency |
| Browser verification | Playwright, Chrome DevTools | Reproducible scenarios, flake rate, runtime |
| Repository operations | GitHub, GitLab, Commit Commands | Manual steps removed, permission breadth, failure recovery |
| Language intelligence | TypeScript LSP, Pyright LSP, gopls, rust-analyzer | Diagnostics caught before tests, setup failures |
| Project instructions | CLAUDE.md Management | Instruction accuracy, context overhead, conflicting rules |
| Security review | Security Guidance, Semgrep, Aikido Security | True-positive rate, severity accuracy, remediation quality |
| Deployment | Vercel, Cloudflare, Railway, Netlify Skills | Preview reliability, approval gates, rollback clarity |
| Service integration | Slack, Linear, Atlassian, Supabase, Stripe | Least privilege, auditability, accidental-write risk |

These are inspection candidates, not blanket recommendations. Names and rankings change; verify the current catalog before installing.

### A small starter stack

For most software teams, begin with no more than three additions:

1. The LSP plugin matching the main language.
2. A browser-testing or code-review plugin tied to an existing quality gate.
3. One integration for the system where work already happens, such as GitHub or Linear.

Add another only after the previous plugin demonstrates measurable value. A large plugin collection increases prompt surface, tool-selection ambiguity, credential exposure, update churn, and debugging effort.

---

## Install a Plugin

The official Anthropic marketplace, `claude-plugins-official`, is normally available automatically.

### Interactive installation

1. Run `/plugin` in Claude Code.
2. Open **Discover**.
3. Select a plugin and inspect its details.
4. Choose user, project, or local scope.
5. Run `/reload-plugins` after installation.
6. Test one low-risk task.

### Direct installation

```text
/plugin install github@claude-plugins-official
/reload-plugins
```

If the official catalog is missing or stale:

```text
/plugin marketplace update claude-plugins-official
```

If it was removed:

```text
/plugin marketplace add anthropics/claude-plugins-official
```

### Add another marketplace

```text
/plugin marketplace add owner/repository
/plugin marketplace list
/plugin install plugin-name@marketplace-name
/reload-plugins
```

Anthropic also publishes a demonstration catalog:

```text
/plugin marketplace add anthropics/claude-code
/plugin install commit-commands@anthropics-claude-code
/reload-plugins
```

Plugin skills are namespaced. For example, the commit plugin can expose:

```text
/commit-commands:commit
```

Each plugin has its own interface. Read its description and homepage instead of assuming its commands from its name.

---

## Pick the Right Scope

| Scope | Who receives it | Best for | Main risk |
|---|---|---|---|
| User | You, across projects | Personal productivity plugins | Unintended availability in sensitive repos |
| Local | You, in one repository | Evaluation and project-specific experiments | Results are not shared with teammates |
| Project | Everyone using repository settings | A reviewed team standard | Broad blast radius if configuration is unsafe |
| Managed | Users selected by an administrator | Enterprise policy and standardized tooling | Users cannot independently change it |

Use local scope for the first evaluation. Promote to project scope only after review, testing, documentation, and team agreement.

CLI example:

```bash
claude plugin install formatter@your-marketplace --scope local
claude plugin install formatter@your-marketplace --scope project
```

---

## Security Review Before Installation

Plugins can execute code, invoke hooks, connect to external systems, and influence Claude's behavior. Treat their source and updates as part of your software supply chain.

### Review checklist

- [ ] Confirm the publisher and source repository.
- [ ] Read the README, license, release history, and open security issues.
- [ ] Inspect the plugin manifest and every declared component.
- [ ] Read skill and agent instructions for hidden or conflicting behavior.
- [ ] Inspect hooks for shell commands, network calls, and automatic writes.
- [ ] Inspect MCP configuration, package commands, and external endpoints.
- [ ] Identify every credential and permission requested.
- [ ] Check whether dependencies are pinned or resolved dynamically.
- [ ] Decide which data the plugin could read or transmit.
- [ ] Install at local scope and test with non-sensitive fixtures.
- [ ] Record removal and credential-revocation steps.

### Questions to ask

```text
Inspect this plugin without installing or executing it.

Report:
1. Source, publisher, version, license, and maintenance signals.
2. Skills, agents, hooks, MCP servers, LSP servers, and monitors it adds.
3. Files, commands, network hosts, credentials, and external services it can access.
4. Automatic actions and any destructive or irreversible behavior.
5. Dependency and update-chain risks.
6. Overlap or conflict with our existing configuration.
7. Recommended scope: reject, local trial, user, or project.
8. A low-risk test plan and complete uninstall/revocation plan.

Separate verified facts from inference. Do not install it.
```

### Warning signs

- An installer uses `curl | sh` without a reviewable pinned artifact.
- A plugin requests broad filesystem or account access unrelated to its purpose.
- Hooks make commits, deploy, delete, or message people without an approval gate.
- An MCP server sends repository content to an undocumented host.
- Dependencies use floating versions or execute install scripts unexpectedly.
- The repository has no license, ownership trail, releases, or maintenance activity.
- Marketing promises are precise, but evaluation methods are absent.

Official marketplace placement improves discoverability; it does not remove your responsibility to inspect requested access. Anthropic's documentation explicitly warns that it does not control or verify all third-party MCP servers, files, or software included in plugins.

---

## Evaluate Value With Evidence

Run the same representative tasks with and without the plugin.

### Evaluation card

```markdown
# Plugin evaluation: <name>@<marketplace>

- Version or commit:
- Scope: local
- Evaluator/date:
- Capability being tested:
- Baseline workflow:

## Tasks
1. Normal case:
2. Edge case:
3. Failure/permission case:

## Measures
- Correct task completions:
- Human corrections required:
- Useful findings / false positives:
- Runtime and token change:
- New permissions and credentials:
- Errors or conflicts:

## Decision
- Reject / continue local trial / approve for project
- Reason:
- Review again on:
- Rollback owner:
```

Do not count “the command ran” as success. Measure the outcome the plugin is supposed to improve.

### Suggested acceptance rules

- It improves at least one named metric across representative tasks.
- It introduces no unexplained network access or automatic mutation.
- Its permissions match its job.
- Failure is visible and recoverable.
- The team can disable or uninstall it without losing project state.
- A maintainer owns updates and periodic review.

---

## Manage Installed Plugins

Open `/plugin` and use the **Installed**, **Marketplaces**, and **Errors** tabs. You can also manage plugins directly:

```text
/plugin disable plugin-name@marketplace-name
/plugin enable plugin-name@marketplace-name
/plugin uninstall plugin-name@marketplace-name
/plugin marketplace update marketplace-name
/reload-plugins
```

Removing a marketplace also uninstalls plugins installed from it. Update a marketplace instead of removing and re-adding it when you only need a refresh.

Third-party marketplace auto-updates are disabled by default in Claude Code, while official marketplaces have them enabled by default. For higher-risk teams, review version changes before rolling them into project scope.

### Troubleshooting

| Symptom | Likely cause | Action |
|---|---|---|
| Plugin not found | Catalog is missing or stale | Update or add its marketplace |
| Newly installed capability is absent | Session has not reloaded plugins | Run `/reload-plugins` |
| LSP says executable not found | Language-server binary is missing from `PATH` | Install the required binary, then reload |
| Skill command is unknown | Namespaced command was not used | Try `/plugin-name:skill-name` |
| Plugin works only for you | Installed at user/local rather than project scope | Review it, then install at project scope if appropriate |
| Duplicate or erratic behavior | Overlapping plugins or hooks | Disable candidates one at a time and inspect `/plugin` Errors |
| Tool cannot authenticate | Credential is absent, expired, or wrong scope | Re-authenticate with least privilege; do not paste secrets into prompts |

---

## Team and Enterprise Use

A team marketplace gives you a controlled catalog for internal plugins. Project settings can declare known marketplaces and enabled plugins:

```json
{
  "extraKnownMarketplaces": {
    "company-tools": {
      "source": {
        "source": "github",
        "repo": "your-org/claude-plugins"
      }
    }
  },
  "enabledPlugins": {
    "code-review@company-tools": true
  }
}
```

For every project-wide plugin, document:

- the problem it solves;
- approved version/source;
- owner and review date;
- permissions and data boundaries;
- commands and example use;
- expected verification;
- update policy;
- disable, uninstall, and credential-revocation steps.

Use a staged rollout: maintainer fixture, local pilot, small team, then project-wide enablement. Re-evaluate after meaningful version changes.

---

## Anti-Patterns

- Installing the current top ten without a defined need.
- Treating install count as a security audit.
- Calling every integration “MCP” and missing hooks or agents in the package.
- Enabling multiple overlapping review plugins and counting duplicate findings as quality.
- Giving a connector write access when read-only access is sufficient.
- Sharing a local success without recording version and configuration.
- Allowing silent auto-updates for a high-impact production plugin.
- Keeping unused plugins enabled “just in case.”
- Putting secrets in `CLAUDE.md`, settings committed to Git, or prompts.

---

## Practical Decision Flow

```text
Can you name the recurring bottleneck?
├── No  → do not install a plugin yet
└── Yes
    ├── Is built-in Claude Code enough?
    │   └── Yes → keep the simpler setup
    └── No
        ├── Can you inspect source, behavior, access, and updates?
        │   └── No → reject or isolate it
        └── Yes
            ├── Run a local-scope A/B evaluation
            ├── Improvement is measurable and risk acceptable?
            │   ├── No  → uninstall and revoke access
            │   └── Yes → document, pin/review, and promote carefully
```

---

## Sources and Further Reading

- [Discover and install prebuilt plugins — Claude Code documentation](https://code.claude.com/docs/en/discover-plugins)
- [Plugins reference — Claude Code documentation](https://code.claude.com/docs/en/plugins-reference)
- [Create plugins — Claude Code documentation](https://code.claude.com/docs/en/plugins)
- [Create and distribute a plugin marketplace — Claude Code documentation](https://code.claude.com/docs/en/plugin-marketplaces)
- [Best Claude Plugins by installs — PluginMarketplace.ai](https://pluginmarketplace.ai/best-claude-plugins)
- [The 10 Claude Plugins You Actually Need in 2026 — Towards AI](https://pub.towardsai.net/the-10-claude-plugins-you-actually-need-in-2026-and-what-they-are-85674941c324)

## See Also

- [`../Skills/`](../Skills/)
- [`../MCP Playbook/`](../MCP%20Playbook/)
- [`../Security Guardrails/`](../Security%20Guardrails/)
- [`../Eval-Driven Skill Improvement/`](../Eval-Driven%20Skill%20Improvement/)
- [`../Cost and Observability/`](../Cost%20and%20Observability/)
