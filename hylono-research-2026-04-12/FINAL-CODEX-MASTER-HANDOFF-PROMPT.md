# Final Codex Master Handoff Prompt

You have access to the Hylono research bundle. Treat it as implementation intelligence, not as prose to restate.

## Operating stance
- Do not restate package contents unless needed to justify a concrete implementation decision.
- Use the research files to reduce assumptions, narrow options, and preserve architectural discipline.
- Assume the current product is a **server-first Next.js 16 App Router application**, not a Vite SPA.
- Preserve the current site architecture unless a package explicitly establishes that a separate service should own a capability.
- Prefer API/webhook/event integration over rewriting the public site around third-party frontends.

## Required reading order
1. `MASTER-REPORT.md`
2. `master-index.csv`
3. `hylono-stack-manifest.json`
4. Packages for the current rollout wave, in the order recommended in `MASTER-REPORT.md`
5. Only then read packages for adjacent overlap alternatives

## Mandatory implementation rules
- Validate the **current version**, **license**, and **official docs path** again at coding time before you generate deployment code.
- When a package says **INFERRED**, **UNVERIFIED**, or **MISSING**, stop and re-check upstream sources before making implementation decisions.
- If official docs conflict with a community guide or starter repo, official docs win.
- If a blueprint is incomplete, use it only as scaffolding. Fill gaps from official docs and the existing Hylono architecture; do not guess.
- If a package recommends a tool only for a narrow use case, do not widen its role without explicit justification.

## Hylono-specific architecture guardrails
- Keep the public site as the customer-facing, SEO-heavy, server-rendered Next.js 16 application.
- Use separate services for tools such as CRM, scheduling, e-sign, automation, support, analytics, and internal tooling.
- Prefer **server-side integration** via route handlers, server actions, webhooks, queues, and background jobs.
- Keep admin or operator tools on separate hostnames/internal domains behind SSO when practical.
- Prefer **ZITADEL + Auth.js federation**, **Infisical for secrets**, and **Kong for service boundaries** when those services are in scope.
- Treat **PostgreSQL** as the default backbone unless a package explicitly requires another store.
- Avoid adding new datastores unless the package and current need justify them.
- Do not turn the public site into a generic admin frontend for every service.

## Recommended implementation order
1. Validate and harden the existing backbone (PostgreSQL, Redis licensing decision, MongoDB scope, object storage decision, uptime checks).
2. Establish shared control plane (ZITADEL, Infisical, Kong).
3. Harden automation and communication spine (n8n, Novu, Twenty).
4. Add customer/operations services with direct Hylono value (Cal.com, Documenso, Leihs, observability stack).
5. Add internal analytics/admin tools (Metabase, Appsmith, BookStack).
6. Only then evaluate revenue/support/content expansion or more specialized systems.

## Implementation procedure for each app
1. Read `01-overview.md`, `03-setup-guide.md`, `04-blueprints-and-assets.md`, and `07-codex-handoff.md`.
2. Re-check upstream version/license.
3. Decide the app’s role:
   - system of record
   - secondary operational tool
   - replaceable edge service
   - internal-only tool
4. Decide the integration mode:
   - separate service behind API/webhooks
   - internal hostname with SSO
   - direct Next.js integration (rare; mostly for front-end libraries only)
5. Generate deployment code/config only for the minimal viable path described in the package.
6. Add backups, health checks, logging, and secret handling before claiming production readiness.
7. Do not connect an app to live customer data until restore, auth, and rollback paths are clear.

## What to do when docs or blueprints conflict
- Official docs > official repo examples > maintained community repos > blogs/videos/reddit.
- If the official repo contains working deployment assets but the docs are vague, use the repo assets as the starting scaffold and note the discrepancy.
- If a community blueprint is better engineered than the official example, keep the architecture but swap in official configuration semantics.
- If the blueprint still leaves material uncertainty, surface the gap explicitly instead of guessing.

## What not to do
- Do not infer that “because the software exists, it should be deployed”.
- Do not refactor the current public site into a third-party admin/frontend unless the research package explicitly calls for it.
- Do not assume SPA patterns, client-side auth flows, or Vite-based integration patterns are acceptable for the current Hylono site.
- Do not duplicate sources of truth across the site DB, CRM, billing, and operational tools without an explicit ownership map.
- Do not ignore EU hosting, GDPR, or health-adjacent sensitivity just because a tool is self-hosted.

## Escalation rule
If a package leaves a key question unresolved (identity ambiguity, licensing ambiguity, stale release state, source-of-truth conflict, compliance scope), surface that question explicitly and block the implementation step that depends on it. Escalate uncertainty instead of hiding it behind “reasonable assumptions.”