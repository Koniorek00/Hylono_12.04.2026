# Apache Answer — How It Works

## Phase B — Core architecture
- **Runtime model:** Go/Node-style web platform (verify exact runtime components) with DB/cache/storage and plugin/support features. [https://answer.apache.org/docs/installation, 2026-04-12, current]
- **Main components:** Q&A app, admin UI, database, storage, and optional integrations/plugins. [https://github.com/apache/answer/releases, 2026-04-12, v2.0.0]
- **Typical deployment model:** Docker quick-start exists; production still needs DB, storage, auth decisions, and moderation processes. [https://answer.apache.org/docs/installation, 2026-04-12, current]
- **Runtime dependencies:** Database, storage, mail/auth, reverse proxy, and backup plan.
- **Primary data stores:** Relational database and storage.
- **Auth model:** Local auth plus possible external provider integrations; verify current options.
- **API / integration surface:** Q&A platform APIs and admin/plugin surfaces.
- **Operational complexity:** **Medium**
- **Security / compliance considerations:** Public question content, user accounts, moderation, and spam controls require attention.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service or internal hostname. Keep it off the customer-facing surface by default. Integrate with the Next.js site via server-side APIs, webhooks, or deep links; use SSO when possible.
- **Integration boundary:** Prefer subdomain/internal-domain isolation over importing its UI into the public site.
- **Blast-radius note:** Moderate overlap risk.