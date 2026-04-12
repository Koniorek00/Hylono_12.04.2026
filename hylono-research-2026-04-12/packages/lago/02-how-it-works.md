# Lago — How It Works

## Phase B — Core architecture
- **Runtime model:** Web/API application with billing engine, workers, database, and connectors. [https://docs.getlago.com/, 2026-04-12, current]
- **Main components:** API/UI, billing engine, background jobs, PostgreSQL, message/queue layer depending on deployment, and external payment/invoicing integrations. [https://github.com/getlago/lago/releases, 2026-04-12, v1.45.1]
- **Typical deployment model:** Official Docker Compose and Helm paths exist. Production requires persistent database, background processing, mail/notifications, and finance-grade change control. [https://docs.getlago.com/, 2026-04-12, current]
- **Runtime dependencies:** PostgreSQL, background workers/queues, email/notifications, webhooks, and payment provider integration.
- **Primary data stores:** PostgreSQL primary datastore.
- **Auth model:** Built-in auth plus API keys and finance/admin roles.
- **API / integration surface:** REST APIs, webhooks, billing events, metering ingestion, invoice/subscription management.
- **Operational complexity:** **High**
- **Security / compliance considerations:** Billing systems directly affect revenue and customer trust. Webhook integrity, tax/invoice correctness, and finance-process controls matter.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service. Keep the Hylono public site as the server-first customer surface and integrate through server-side API routes, webhooks, queued jobs, or SDKs.
- **Integration boundary:** Avoid rewriting the public site around this tool’s frontend unless the package explicitly says the tool should own that surface.
- **Blast-radius note:** High domain-model risk if introduced too early.