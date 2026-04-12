# Chatwoot — How It Works

## Phase B — Core architecture
- **Runtime model:** Rails/Postgres/Redis-style application with websockets, workers, and channel integrations. [https://www.chatwoot.com/docs/self-hosted, 2026-04-12, current]
- **Main components:** Web app, inboxes, agent UI, PostgreSQL, Redis, workers, and channel adapters. [https://github.com/chatwoot/chatwoot/releases, 2026-04-12, v4.12.1]
- **Typical deployment model:** Mature self-host docs exist. Production needs email/channel integrations, storage, and support operations. [https://www.chatwoot.com/docs/self-hosted, 2026-04-12, current]
- **Runtime dependencies:** PostgreSQL, Redis, storage, mail/chat channel credentials, and background jobs.
- **Primary data stores:** PostgreSQL and Redis plus uploads storage.
- **Auth model:** Agent/user auth and channel/customer identity within conversations.
- **API / integration surface:** REST APIs, web widget, webhooks, and channel integrations.
- **Operational complexity:** **Medium**
- **Security / compliance considerations:** Support conversations can contain PII and sensitive service details. Access control and retention matter.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service or internal hostname. Keep it off the customer-facing surface by default. Integrate with the Next.js site via server-side APIs, webhooks, or deep links; use SSO when possible.
- **Integration boundary:** Prefer subdomain/internal-domain isolation over importing its UI into the public site.
- **Blast-radius note:** Moderate, but useful when customer support scales.