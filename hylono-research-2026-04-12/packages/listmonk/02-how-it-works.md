# Listmonk — How It Works

## Phase B — Core architecture
- **Runtime model:** Single binary/web app with PostgreSQL and SMTP/provider integration. [https://listmonk.app/docs/, 2026-04-12, v6.1.0]
- **Main components:** Admin UI, campaign engine, subscriber/list management, templates, API, and optional media storage. [https://github.com/knadh/listmonk/releases, 2026-04-12, v6.1.0]
- **Typical deployment model:** Relatively easy self-host path; PostgreSQL and SMTP/provider config are the main requirements. [https://listmonk.app/docs/, 2026-04-12, v6.1.0]
- **Runtime dependencies:** PostgreSQL, SMTP or email provider, reverse proxy/TLS, and media/file storage if using uploads.
- **Primary data stores:** PostgreSQL primary datastore.
- **Auth model:** Local admin users plus API tokens; OIDC support exists.
- **API / integration surface:** REST API, import/export, webhooks/integrations, and campaign/list operations.
- **Operational complexity:** **Low to Medium**
- **Security / compliance considerations:** Subscriber data and marketing consent must be handled carefully; keep admin access tight and double-check unsubscribe/consent flows.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service or internal hostname. Keep it off the customer-facing surface by default. Integrate with the Next.js site via server-side APIs, webhooks, or deep links; use SSO when possible.
- **Integration boundary:** Prefer subdomain/internal-domain isolation over importing its UI into the public site.
- **Blast-radius note:** Low to moderate.