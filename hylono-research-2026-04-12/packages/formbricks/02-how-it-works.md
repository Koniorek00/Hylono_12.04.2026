# Formbricks — How It Works

## Phase B — Core architecture
- **Runtime model:** Web app with DB, analytics/response handling, and survey delivery surfaces. [https://formbricks.com/docs/self-hosting, 2026-04-12, current]
- **Main components:** Survey builder, response store, targeting, web/widget delivery, and admin UI. [https://github.com/formbricks/formbricks/releases, 2026-04-12, v4.8.7]
- **Typical deployment model:** Self-host docs are mature; HTTPS and modest resources are required. [https://formbricks.com/docs/self-hosting, 2026-04-12, current]
- **Runtime dependencies:** Database, storage, HTTPS, email if used, and event/targeting integrations.
- **Primary data stores:** Relational DB and response data.
- **Auth model:** Admin/workspace users and survey delivery controls.
- **API / integration surface:** Survey APIs, webhooks, and response/export surfaces.
- **Operational complexity:** **Low to Medium**
- **Security / compliance considerations:** Survey responses may contain personal or sensitive health-adjacent feedback. Scope surveys carefully.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service. Keep the Hylono public site as the server-first customer surface and integrate through server-side API routes, webhooks, queued jobs, or SDKs.
- **Integration boundary:** Avoid rewriting the public site around this tool’s frontend unless the package explicitly says the tool should own that surface.
- **Blast-radius note:** Low to moderate.