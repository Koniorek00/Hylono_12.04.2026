# Fides — How It Works

## Phase B — Core architecture
- **Runtime model:** Containerized multi-service platform with database, web app, workers, and integrations to data systems. [https://docs.ethyca.com/, 2026-04-12, current]
- **Main components:** Privacy center/admin UI, database, consent/request workflows, data connectors, and orchestration services. [https://github.com/ethyca/fides/releases, 2026-04-12, v2.78.2]
- **Typical deployment model:** Production docs exist for modern container orchestration. This is a real platform, not a lightweight plugin. [https://docs.ethyca.com/, 2026-04-12, current]
- **Runtime dependencies:** Database, workers, mail, app/data-system connectors, secrets management, and privacy-process ownership.
- **Primary data stores:** Relational database plus connector metadata.
- **Auth model:** Admin/user roles and auth integrations depending on deployment.
- **API / integration surface:** Consent/privacy APIs, connectors, request orchestration, and governance interfaces.
- **Operational complexity:** **High**
- **Security / compliance considerations:** Handles sensitive privacy inventory and request workflows. Needs careful access control and process ownership.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service. Keep the Hylono public site as the server-first customer surface and integrate through server-side API routes, webhooks, queued jobs, or SDKs.
- **Integration boundary:** Avoid rewriting the public site around this tool’s frontend unless the package explicitly says the tool should own that surface.
- **Blast-radius note:** Moderate to high process burden.