# Invoice Ninja — How It Works

## Phase B — Core architecture
- **Runtime model:** Laravel/PHP application with database, mail, payment integrations, background jobs, and client portal. [https://invoiceninja.github.io/, 2026-04-12, v5]
- **Main components:** Web app/API, relational database, mailer, payment connectors, cron/jobs, and PDF/document generation. [https://github.com/invoiceninja/invoiceninja/releases, 2026-04-12, v5.13.10]
- **Typical deployment model:** Docker and self-host docs are mature. Production needs mail, backups, payment/webhook testing, and PDF/document storage planning. [https://invoiceninja.github.io/, 2026-04-12, v5]
- **Runtime dependencies:** Database, PHP runtime, mailer, payment provider credentials, cron, and storage.
- **Primary data stores:** Relational database plus generated invoice/document storage.
- **Auth model:** Local auth, client portal users, API tokens, and payment-provider credentials.
- **API / integration surface:** REST API, webhooks, client portal, payment integrations, and invoice/quote generation.
- **Operational complexity:** **Medium**
- **Security / compliance considerations:** Financial documents and customer details require standard finance-app hardening and role separation.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service. Keep the Hylono public site as the server-first customer surface and integrate through server-side API routes, webhooks, queued jobs, or SDKs.
- **Integration boundary:** Avoid rewriting the public site around this tool’s frontend unless the package explicitly says the tool should own that surface.
- **Blast-radius note:** Moderate. Useful but finance scope must be explicit.