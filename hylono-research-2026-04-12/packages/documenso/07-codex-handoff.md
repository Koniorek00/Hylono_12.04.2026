# Documenso — Codex Handoff

## Phase F — Direct instructions for the coding agent

### Read first
1. `01-overview.md`
2. `03-setup-guide.md`
3. `04-blueprints-and-assets.md`
4. `08-sources.md`

### Best implementation path
- Use Documenso for clearly bounded document workflows first (for example rental agreements or acknowledgements), and keep signed artifacts in controlled storage.
- Default to **minimal integration**, not architectural takeover of the public Next.js site.
- Preserve the existing server-first App Router architecture; use APIs, webhooks, background jobs, or embeds when that is the lower-risk path.

### What to verify before coding
- Read self-host docs and define document classes and legal expectations before integrating anything into the site.
- Confirm the researched version and licensing at coding time.
- Confirm whether this app is a **system of record**, an **integration service**, or an **internal tool**.
- Confirm whether the app belongs behind SSO/internal network boundaries.

### Use / ignore guidance
- **Use:** official docs, official repo, official examples, and the indexed blueprint assets listed in `04-blueprints-and-assets.md`.
- **Ignore or distrust by default:** stale blog posts, Vite/SPA-only frontend assumptions, and community templates that contradict current official docs.

### Never-assume list
- Never assume a signature workflow is legally or operationally sufficient without human validation of the exact document use case.
- Never rewrite the public site around this app unless the package explicitly requires it.
- Never guess at webhook payloads, auth scopes, license terms, or required backing services.