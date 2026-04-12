# Ditto — How It Works

## Phase B — Core architecture
- **Runtime model:** Web app/API/worker platform with database, queueing, and channel-provider integrations. [https://docs.dittofeed.com/, 2026-04-12, current]
- **Main components:** Campaign UI, event ingestion, customer profiles, workers, templates, and delivery-provider connectors. [https://github.com/dittofeed/dittofeed, 2026-04-12, UNVERIFIED current]
- **Typical deployment model:** Self-host docs mention Docker Compose and Helm. Production still requires message-provider setup and customer data governance. [https://docs.dittofeed.com/, 2026-04-12, current]
- **Runtime dependencies:** Database, queues/workers, storage, provider credentials, and ingestion endpoints.
- **Primary data stores:** Relational database and/or analytics stores depending on product design; verify current architecture before deployment.
- **Auth model:** Local users/roles and API keys.
- **API / integration surface:** Event ingestion, campaign APIs, provider integrations, and self-host admin surfaces.
- **Operational complexity:** **Medium to High**
- **Security / compliance considerations:** Campaign tools centralize customer identifiers and event data. Retention, consent, and preference handling matter.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service. Keep the Hylono public site as the server-first customer surface and integrate through server-side API routes, webhooks, queued jobs, or SDKs.
- **Integration boundary:** Avoid rewriting the public site around this tool’s frontend unless the package explicitly says the tool should own that surface.
- **Blast-radius note:** High overlap and identity ambiguity.