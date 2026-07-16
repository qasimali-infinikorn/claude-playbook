# Docs Maintenance

This repo is a living playbook. Docs maintenance keeps it useful as topics grow: links stay discoverable, commands stay accurate, and new pages follow the same shape.

---

## Quality Bar

Run before pushing docs changes:

```bash
npm run docs:build
```

This catches VitePress rendering errors and most broken internal page links.

For larger docs changes, also check:

- New folder has a `README.md`.
- Folder is listed in `README.md`.
- Folder is listed in `.vitepress/config.mts` rewrites.
- Sidebar includes the page.
- Related pages link back where useful.
- No stale phrases like old counts or old path conventions.
- Examples are copy-paste safe.

---

## New Topic Checklist

- [ ] Top-level folder uses Title Case.
- [ ] `README.md` starts with a plain-English definition.
- [ ] Includes "when to use" and "when not to use".
- [ ] Includes examples or templates.
- [ ] Includes guardrails/anti-patterns.
- [ ] Includes "See also".
- [ ] Added to root `README.md` structure and index.
- [ ] Added to VitePress rewrites/sidebar.
- [ ] `npm run docs:build` passes.

---

## Consistency Pass

Use this prompt after adding several pages:

```text
Review the docs for consistency.
Check:
- topic names
- section order
- link style
- stale counts
- duplicated guidance
- missing backlinks
- examples that are unsafe to copy
Return a prioritized fix list. Do not edit yet.
```

---

## Link And Navigation Audit

```text
Audit the docs navigation.
Confirm every top-level README is:
- present in the root README structure
- present in the root README index
- present in VitePress rewrites
- present in the sidebar
Report missing links.
```

---

## PR Review Checklist

- [ ] Does the new doc solve a real reader need?
- [ ] Is the guidance concrete?
- [ ] Are commands safe?
- [ ] Are external actions gated by human approval?
- [ ] Are related docs linked?
- [ ] Does the build pass?

---

## See Also

- [`../Templates/`](../Templates/)
- [`../Harness/`](../Harness/)
- [`../Verification Recipes/`](../Verification%20Recipes/)
