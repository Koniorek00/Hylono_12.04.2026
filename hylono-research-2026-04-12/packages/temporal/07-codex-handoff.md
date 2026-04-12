# Temporal — Codex Handoff

## Phase F — Direct instructions for the coding agent

### Read first
1. `01-overview.md`
2. `03-setup-guide.md`
3. `04-blueprints-and-assets.md`
4. `08-sources.md`

### Best implementation path
- Defer until there is a clear set of long-running, failure-sensitive workflows that simpler tools cannot handle.
- Default to **minimal integration**, not architectural takeover of the public Next.js site.
- Preserve the existing server-first App Router architecture; use APIs, webhooks, background jobs, or embeds when that is the lower-risk path.

### What to verify before coding
- Read n8n limitations and workflow-complexity notes before proposing Temporal.
- Confirm the researched version and licensing at coding time.
- Confirm whether this app is a **system of record**, an **integration service**, or an **internal tool**.
- Confirm whether the app belongs behind SSO/internal network boundaries.

### Use / ignore guidance
- **Use:** official docs, official repo, official examples, and the indexed blueprint assets listed in `04-blueprints-and-assets.md`.
- **Ignore or distrust by default:** stale blog posts, Vite/SPA-only frontend assumptions, and community templates that contradict current official docs.

### Never-assume list
- Never treat Temporal as a default queue or cron replacement.
- Never rewrite the public site around this app unless the package explicitly requires it.
- Never guess at webhook payloads, auth scopes, license terms, or required backing services.