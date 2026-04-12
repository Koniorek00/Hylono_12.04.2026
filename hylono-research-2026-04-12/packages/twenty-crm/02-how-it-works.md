# Twenty CRM — How It Works

## Phase B — Core architecture
- **Runtime model:** Web application with API layer, background processes, database, storage, and extension/webhook surfaces. [https://github.com/twentyhq/twenty, 2026-04-12, v1.21.0]
- **Main components:** Frontend, API, PostgreSQL-backed data layer, worker/background jobs, file storage, and webhook/API interfaces. [https://github.com/twentyhq/twenty/releases, 2026-04-12, v1.21.0]
- **Typical deployment model:** Official Docker Compose is the pragmatic path for self-hosting; production hardening needs persistent storage, backups, reverse proxy, and upgrade discipline. [https://github.com/twentyhq/twenty, 2026-04-12, v1.21.0]
- **Runtime dependencies:** PostgreSQL, storage, mail/outbound integrations, and likely background workers depending on deployment mode.
- **Primary data stores:** PostgreSQL primary datastore; storage for files and imports/exports.
- **Auth model:** Built-in auth with workspace/users; evaluate SSO path against ZITADEL if needed.
- **API / integration surface:** REST and GraphQL APIs, webhooks, imports/exports, and extension/developer surfaces.
- **Operational complexity:** **Medium**
- **Security / compliance considerations:** CRM data will include customer and partner context. Access control, auditability, backup encryption, and GDPR-ready retention matter.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service or internal hostname. Keep it off the customer-facing surface by default. Integrate with the Next.js site via server-side APIs, webhooks, or deep links; use SSO when possible.
- **Integration boundary:** Prefer subdomain/internal-domain isolation over importing its UI into the public site.
- **Blast-radius note:** Moderate. Valuable and implementable, but CRM data-model ownership can become messy if sync rules are weak.