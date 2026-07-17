# Shannon: Autonomous AI Pentesting

Shannon is an autonomous, white-box pentester for web applications and APIs. You give it both a running target and the application's source repository. It reads the code to plan attacks, explores the live application, attempts real exploits, and produces a Markdown report containing findings it could prove with a working proof of concept.

This guide covers **Shannon Open Source**, the local CLI published by [Keygraph](https://github.com/KeygraphHQ/shannon). It is written against the upstream documentation and v2.0.0 release line available on **July 17, 2026**. Shannon changes quickly, so verify commands against the upstream README before automating it.

> **Shannon is an active security-testing tool, not a passive scanner.** Run it only against applications you own or have explicit written authorization to test. Use a local, disposable, or isolated staging environment—never production.

---

## What Shannon Actually Does

Traditional static analysis asks, "Does this code look dangerous?" A dynamic scanner asks, "Does this running application respond like it may be vulnerable?" Shannon combines both perspectives:

1. It reads the source to identify frameworks, endpoints, authentication logic, data flows, and likely attack paths.
2. It explores the running application and correlates runtime behavior with the code.
3. Specialized agents investigate Injection, XSS, SSRF, Authentication, and Authorization issues.
4. Exploitation agents try to turn each hypothesis into a reproducible attack.
5. The reporting agent keeps proven findings and assembles the evidence and remediation guidance.

The key idea is **proof by exploitation**. Shannon is designed to omit an unproven hypothesis from the final report rather than present it as a confirmed vulnerability. That should reduce speculative alerts, but it does not eliminate the need for human review.

```text
Source repository                   Running test application
       │                                      │
       ▼                                      ▼
Pre-reconnaissance ─────────► Live reconnaissance
                                      │
               ┌──────────────────────┼──────────────────────┐
               ▼                      ▼                      ▼
          Vulnerability          Vulnerability          Vulnerability
            analysis               analysis               analysis
               │                      │                      │
               ▼                      ▼                      ▼
           Exploitation          Exploitation          Exploitation
               └──────────────────────┼──────────────────────┘
                                      ▼
                         Evidence + Markdown report
```

Shannon Open Source is white-box only: it expects access to the source repository. The commercial Keygraph platform adds broader code analysis, continuous operation, finding management, and other enterprise features. Do not assume platform features exist in the open-source CLI.

---

## Where It Fits

Use Shannon when:

- A web application or API is running in a safe test environment.
- You can provide the matching source repository.
- You want exploit-backed evidence before a release or after a security-sensitive change.
- You can give the scan disposable accounts and data.
- A human can validate, triage, fix, and re-test the results.

Do not use Shannon when:

- You do not have explicit authority to test the target.
- The only available target is production.
- State changes, emails, webhooks, payments, or outbound requests cannot be safely contained.
- The repository or application is untrusted; source code can contain prompt-injection instructions aimed at an AI agent.
- You need a complete replacement for SAST, dependency scanning, secrets scanning, threat modeling, manual review, or a professional penetration test.
- You need a black-box scan without source access; that is outside Shannon Open Source's stated scope.

### What It Covers

The open-source pipeline currently focuses on five attack domains:

| Domain | Typical questions Shannon investigates |
|---|---|
| Injection | Can untrusted input reach SQL, command, template, or similar interpreters unsafely? |
| Cross-site scripting (XSS) | Can attacker-controlled content execute in a user's browser? |
| Server-side request forgery (SSRF) | Can input make the server request an unintended internal or external resource? |
| Broken authentication | Can login, sessions, tokens, MFA, or account recovery be bypassed or abused? |
| Broken authorization | Can one user access or modify another user's resources or privileged functions? |

Coverage is not a guarantee. A clean report means Shannon did not prove an issue during that run; it does **not** prove the application is secure.

---

## Before You Run It

### Prerequisites

- Docker, running and able to pull the worker image.
- Node.js 18 or newer for the recommended `npx` workflow.
- An AI-provider credential. Anthropic is the recommended and officially supported route; upstream also documents AWS Bedrock and compatible proxy configurations.
- The source repository on the local machine.
- A reachable instance of the same application, populated only with disposable test data.
- Written authorization and an agreed test scope.

The first `npx` run pulls a worker image of roughly 1 GB. The repository is mounted read-only in the worker container, but the **target application is not read-only**: exploitation can create users, submit forms, modify records, trigger emails, call webhooks, or initiate other side effects.

### Preflight Checklist

- [ ] Written authorization names the target, time window, and allowed techniques.
- [ ] Target is local or isolated staging—not production.
- [ ] Database snapshot or reset path is available.
- [ ] Test accounts and credentials are disposable and least-privilege.
- [ ] Email, payment, webhook, cloud-metadata, and third-party integrations are sandboxed or disabled.
- [ ] Sensitive routes are excluded with rules of engagement.
- [ ] Rate and cost limits are understood.
- [ ] Docker networking from the worker to the target has been tested.
- [ ] Someone owns triage and cleanup after the run.

---

## Quick Start

### 1. Start the Target Safely

Run the application against disposable data. For example:

```bash
# Example only—use the project's documented development command.
npm run dev
```

Because Shannon runs inside Docker, `localhost` from the container is not always the host machine. On macOS and Windows, use `host.docker.internal` when needed:

```text
http://host.docker.internal:3000
```

Keep the URL that actually works from Docker. The upstream platform guide contains Linux and custom-hostname notes.

### 2. Configure the AI Provider

The recommended setup wizard stores `npx`-mode configuration under `~/.shannon/config.toml`:

```bash
npx @keygraph/shannon setup
```

Alternatively, provide a credential in the current shell:

```bash
export ANTHROPIC_API_KEY="your-api-key"
```

Do not put real credentials in the repository, command history, scan report, or committed YAML. Environment variables override saved `npx` configuration.

### 3. Run a First Scan

Use the smallest safe target first:

```bash
npx @keygraph/shannon start \
  -u http://host.docker.internal:3000 \
  -r /absolute/path/to/your/repository \
  -w local-security-check
```

The important arguments are:

| Argument | Meaning |
|---|---|
| `-u` | URL of the running target application |
| `-r` | Local path to the matching source repository |
| `-w` | Optional stable workspace name |
| `-c` | Optional YAML configuration file |
| `-o` | Optional directory to receive copied deliverables |

### 4. Monitor the Run

```bash
npx @keygraph/shannon status
npx @keygraph/shannon logs local-security-check
npx @keygraph/shannon workspaces
```

Upstream estimates a full run at roughly **1 to 1.5 hours**, varying with application complexity, concurrency, model behavior, and rate limits. It also incurs model usage costs.

### 5. Stop and Clean Up

```bash
npx @keygraph/shannon stop
```

`stop --clean` removes Shannon infrastructure and asks for confirmation. Review what you need from the workspace before cleaning:

```bash
npx @keygraph/shannon stop --clean
```

Do not add `--yes` casually; the confirmation is useful protection.

---

## Authenticated and Scoped Testing

A configuration file lets you describe the environment, supply a test login, focus or avoid paths, limit vulnerability classes, set rules of engagement, and tune concurrency.

```yaml
description: >
  Local test instance of the customer portal. Disposable seeded data only.
  Email, payment, and external webhooks are disabled.

# Start narrowly, then expand after the first safe run.
vuln_classes: [auth, authz]

rules_of_engagement: |
  - Test only the supplied local URL.
  - Do not brute-force passwords.
  - Use only the two disposable test accounts.
  - Keep requests below 3 per second per endpoint.
  - Stop on repeated 429 or 5xx responses.
  - Do not send email or call third-party services.
  - Do not access real customer data.

authentication:
  login_type: form
  login_url: "http://host.docker.internal:3000/login"
  credentials:
    username: "security-test@example.test"
    password: "replace-at-runtime"
  login_flow:
    - "Type $username into the Email field"
    - "Type $password into the Password field"
    - "Click the 'Sign in' button"
  success_condition:
    type: url_contains
    value: "/dashboard"

rules:
  avoid:
    - description: "Do not trigger logout during authenticated testing"
      type: url_path
      value: "/logout"
    - description: "Destructive account deletion is out of scope"
      type: url_path
      value: "/settings/delete-account"
  focus:
    - description: "Focus on API authorization boundaries"
      type: url_path
      value: "/api"

pipeline:
  max_concurrent_pipelines: 2
  retry_preset: subscription
```

Run it with:

```bash
npx @keygraph/shannon start \
  -u http://host.docker.internal:3000 \
  -r /absolute/path/to/your/repository \
  -c /absolute/path/to/shannon-local.yaml \
  -w portal-auth-check
```

Keep the real password out of committed configuration. The sample above demonstrates the schema; use a temporary local file, secret injection, or another approved credential mechanism for actual values.

Supported rule selectors include URL path, domain, subdomain, HTTP method, header, parameter, and repository-relative code path. Rules guide an AI system rather than enforcing a hard network boundary, so containment must also exist outside Shannon: firewall rules, sandbox integrations, disposable data, and restricted credentials.

### Login-Flow Tips

- Perform the login manually in a fresh private browser first.
- Use exact visible labels, placeholders, and button text.
- Describe steps in the exact order a user performs them.
- Set a success condition that unambiguously proves authentication.
- Use `$username`, `$password`, and `$totp` placeholders rather than copying a secret into an instruction.
- Give Shannon a low-privilege account unless a privileged role is explicitly in scope.

---

## Worked Examples

### Example 1: Local Pre-Release Check

Goal: test a branch before it is released.

1. Deploy the branch to an isolated local stack with seeded data.
2. Disable or fake integrations that have external side effects.
3. Run a named Shannon workspace against the branch's repository.
4. Review the final report and reproduce each finding manually.
5. Fix confirmed issues in a separate development workflow.
6. Reset the environment and re-run the scan to verify.

```bash
npx @keygraph/shannon start \
  -u http://host.docker.internal:8080 \
  -r "$PWD" \
  -c ./shannon-local.yaml \
  -w release-candidate-42 \
  -o ./security-artifacts/rc-42
```

Do not commit generated reports blindly: they may contain sensitive endpoints, exploit steps, screenshots, tokens, or test data.

### Example 2: Authorization Regression

Goal: check whether tenant A can read tenant B's resources after an authorization refactor.

- Seed two disposable tenants with distinct users and records.
- Configure a login for one tenant.
- Focus on `/api/documents` and related code paths.
- State the invariant in the rules of engagement: a user may access only records belonging to their tenant.
- Review whether Shannon produces a reproducible cross-tenant request.

Shannon can explore this boundary, but a deterministic automated regression test should preserve the fix afterward. The pentest finds evidence; the test suite prevents reintroduction.

### Example 3: Narrow First Pass

Goal: validate setup without immediately launching the widest scan.

```yaml
vuln_classes: [xss]
pipeline:
  max_concurrent_pipelines: 1
```

Run against a disposable target, confirm authentication, networking, logs, output paths, and side effects, then expand scope deliberately. A narrow first pass is easier to observe and cheaper to debug.

---

## Reading the Results

In `npx` mode, workspaces live under:

```text
~/.shannon/workspaces/
```

The run directory has a final report at the top level and internal evidence beneath `.shannon/`:

```text
<workspace>/
├── Security-Assessment-Report.md
└── .shannon/
    ├── agents/
    ├── deliverables/
    ├── prompts/
    ├── scratchpad/
    ├── session.json
    └── workflow.log
```

Treat the report as a high-quality lead, not an automatic verdict. For each finding:

1. Verify the target, affected role, endpoint, and prerequisites.
2. Reproduce the proof of concept manually in the disposable environment.
3. Confirm impact without expanding beyond the authorized scope.
4. Trace the behavior to the relevant source code.
5. Check for duplicate manifestations of the same root cause.
6. Assign severity using your application's real data and threat model.
7. Fix the root cause and add a deterministic regression test.
8. Reset the target and re-test the exact behavior.
9. Re-run the relevant Shannon scope for defense in depth.

### Report Handling

Pentest artifacts are sensitive. They may contain working exploits, architecture details, screenshots, request data, and credentials captured during the run.

- Store them in restricted, encrypted project storage.
- Redact secrets and personal data before sharing.
- Do not paste complete reports into public issues or pull requests.
- Define a retention period.
- Rotate any credential accidentally exposed in logs or evidence.

---

## Source Build

Use the source-build route only when you need to inspect or modify Shannon itself. It additionally requires `pnpm`:

```bash
git clone https://github.com/KeygraphHQ/shannon.git
cd shannon
cp .env.example .env
pnpm install
pnpm build
./shannon start -u https://your-test-app.example -r /path/to/your/repo
```

In source-build mode, results default to `./workspaces/` inside the Shannon clone. Review the AGPL-3.0 obligations before modifying, distributing, embedding, or offering a modified version as a network service.

---

## Shannon Open Source vs Keygraph Platform

| Capability | Shannon Open Source | Keygraph platform |
|---|---|---|
| Primary use | On-demand local white-box pentest | Continuous managed AppSec workflow |
| Source access | Required | White-, grey-, and black-box modes are advertised |
| Analysis | Source-guided attack planning | Broader parsed-code analysis, SAST, SCA, secrets, IaC, and containers |
| Findings | Local Markdown report | Managed, deduplicated findings, ownership, SLAs, dashboards, integrations |
| Remediation | Developer fixes and re-runs | Automated patch/PR and point re-test workflow advertised |
| Deployment | Local CLI + Docker worker | Commercial self-hosted/air-gapped options |
| License | AGPL-3.0 | Commercial |

This distinction matters when evaluating claims. Features described for the commercial platform should not be attributed to the open-source CLI.

---

## Limitations and Failure Modes

- **False negatives remain possible.** The agent may miss an attack path, fail to navigate the app, lack the right state, or run out of context, time, or model quota.
- **Reports can still be wrong.** Upstream explicitly says LLM-generated details can be weakly supported or incorrect, even though the pipeline attempts proof by exploitation.
- **Coverage is deliberately narrow.** Open source focuses on five exploit classes; it is not comprehensive SAST, SCA, secrets, IaC, or container analysis.
- **State can be mutated.** Read-only source mounting does not make the target safe.
- **Rules are not a security boundary.** Natural-language avoid rules help guide the agent but cannot replace network and environment controls.
- **Model and cost matter.** Smaller, alternative, or proxied models may be incomplete or unstable; full scans consume time and paid model tokens.
- **Prompt injection is a risk.** Do not scan adversarial or untrusted code merely because it is available.
- **A PoC is not a severity score.** Business impact depends on data sensitivity, reachable roles, compensating controls, and deployment context.

---

## Recommended Team Workflow

```text
Written authorization
        ↓
Disposable test environment + scoped config
        ↓
Narrow Shannon run
        ↓
Human reproduction and triage
        ↓
Root-cause fix + regression test
        ↓
Focused re-test + broader security checks
        ↓
Restricted report storage and environment cleanup
```

Shannon works best as one evidence-producing layer in a wider program:

- Threat modeling decides what must never happen.
- Code review and SAST catch problems before runtime.
- Dependency and secrets scanners cover categories Shannon Open Source does not.
- Deterministic tests protect known security invariants.
- Shannon tries to prove exploitable paths in a realistic running system.
- Human pentesters handle novel reasoning, chained impact, and assurance requirements that automation may miss.

---

## Troubleshooting

| Problem | What to check |
|---|---|
| Target cannot be reached | Docker-to-host networking; use `host.docker.internal` on macOS/Windows; verify the port and protocol |
| Login fails | Exact field labels/button text, success condition, test account state, MFA/TOTP clock, redirects |
| Scan stalls or rate-limits | `status`, workspace logs, provider quota, `retry_preset: subscription`, lower concurrency |
| Too many side effects | Stop the run, reset the environment, narrow scope, add avoid rules, disable integrations externally |
| No findings | Confirm the right source and deployment match, authentication worked, target was explored, scope was not overly narrow |
| Report seems implausible | Reproduce manually, inspect evidence and logs, trace to code, treat unsupported details as unconfirmed |
| Interrupted run | Use the named workspace and upstream resume workflow rather than starting an unrelated duplicate run |
| Secrets appear in artifacts | Restrict access, redact, rotate exposed credentials, review retention and configuration |

---

## Practical Checklist

### Before

- [ ] Authorization and scope recorded.
- [ ] Current upstream version and documentation checked.
- [ ] Disposable target and data ready.
- [ ] Third-party side effects contained.
- [ ] Temporary credentials created.
- [ ] Configuration reviewed by a human.
- [ ] Cost and stop conditions agreed.

### During

- [ ] Status and logs monitored.
- [ ] Target health observed.
- [ ] Rate limits and unexpected external calls watched.
- [ ] Run stopped if it leaves scope or damages the environment.

### After

- [ ] Every accepted finding manually reproduced.
- [ ] Severity set from real application context.
- [ ] Root cause fixed and covered by a regression test.
- [ ] Focused re-test passed.
- [ ] Reports stored securely and redacted where needed.
- [ ] Test data, accounts, containers, and temporary credentials cleaned up.

---

## Sources and Further Reading

Primary sources checked July 17, 2026:

- [Shannon upstream repository and quick start](https://github.com/KeygraphHQ/shannon)
- [Source build, CLI commands, and output paths](https://github.com/KeygraphHQ/shannon/blob/main/docs/development.md)
- [Authentication, rules, scope, and pipeline configuration](https://github.com/KeygraphHQ/shannon/blob/main/docs/configuration.md)
- [Safety and limitations](https://github.com/KeygraphHQ/shannon/blob/main/docs/safety.md)
- [Platform and Docker networking notes](https://github.com/KeygraphHQ/shannon/blob/main/docs/platforms.md)
- [Workspaces and resuming](https://github.com/KeygraphHQ/shannon/blob/main/docs/workspaces.md)
- [Coverage and roadmap](https://github.com/KeygraphHQ/shannon/blob/main/docs/coverage-roadmap.md)
- [Open-source and commercial editions](https://keygraph.io/docs/explanations/editions/)
- [GNU Affero General Public License v3.0](https://github.com/KeygraphHQ/shannon/blob/main/LICENSE)

## See Also

- [`../Security Guardrails/`](../Security%20Guardrails/)
- [`../Verification Recipes/`](../Verification%20Recipes/)
- [`../AI Coding Standards/`](../AI%20Coding%20Standards/)
- [`../Release and Deployment/`](../Release%20and%20Deployment/)
- [`../Harness/`](../Harness/)
