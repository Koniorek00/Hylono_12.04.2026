# Outline — How It Works

## Phase B — Core architecture
- **Runtime model:** Node.js web app with database, storage, search, and auth integrations. [https://github.com/outline/outline, 2026-04-12, v1.6.1]
- **Main components:** Web app, relational DB, Redis/cache if configured, storage, search, and auth providers. [https://github.com/outline/outline/releases, 2026-04-12, v1.6.1]
- **Typical deployment model:** Self-hosting exists, but licensing and environment complexity are less friendly than BookStack. [https://github.com/outline/outline, 2026-04-12, v1.6.1]
- **Runtime dependencies:** Database, storage, mail/auth provider, reverse proxy, and possibly Redis/search.
- **Primary data stores:** Relational DB plus file storage and optional cache/search.
- **Auth model:** SSO/provider integrations and local/admin models depending on setup.
- **API / integration surface:** Document APIs, auth integrations, and import/export surfaces.
- **Operational complexity:** **Medium**
- **Security / compliance considerations:** Internal docs may be sensitive. License review and auth/storage hardening matter.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service or internal hostname. Keep it off the customer-facing surface by default. Integrate with the Next.js site via server-side APIs, webhooks, or deep links; use SSO when possible.
- **Integration boundary:** Prefer subdomain/internal-domain isolation over importing its UI into the public site.
- **Blast-radius note:** Moderate due to license and overlap.