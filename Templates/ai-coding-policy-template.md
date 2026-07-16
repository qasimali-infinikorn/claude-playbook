# AI Coding Policy

## Allowed

- Read-only codebase exploration.
- Small code/docs changes on feature branches.
- Test generation.
- PR summaries and review assistance.

## Requires Human Approval

- Commits.
- Pushes.
- Dependency additions.
- Database migrations.
- External comments/messages.
- Deployments.
- Production data access.

## Never Allowed

- Secrets in prompts.
- Production writes without explicit authorization.
- Weakening auth, validation, encryption, or TLS.
- Auto-merging agent output.
- Committing `.env` or private credentials.

## Review Requirements

- Human reads the diff.
- Verification evidence is included.
- PR explains what, why, and how to test.
- High-risk changes include rollback notes.
