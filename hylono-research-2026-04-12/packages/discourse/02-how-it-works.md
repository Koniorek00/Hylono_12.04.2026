# Discourse — How It Works

## Phase B — Core architecture
- **Runtime model:** Rails/Ember application stack with PostgreSQL, Redis, Sidekiq jobs, and mail integration. [https://meta.discourse.org/t/discourse-official-install-guide/23657, 2026-04-12, current]
- **Main components:** Web app, PostgreSQL, Redis, Sidekiq, uploads/storage, mail ingress/egress, and plugin ecosystem. [https://github.com/discourse/discourse, 2026-04-12, current monthly channel]
- **Typical deployment model:** Official self-hosting is Docker-on-Linux oriented; production requires mail, storage, backups, and moderation operations. [https://meta.discourse.org/t/discourse-official-install-guide/23657, 2026-04-12, current]
- **Runtime dependencies:** PostgreSQL, Redis, Docker/Linux host, mail delivery, storage, CDN/reverse proxy if scaled.
- **Primary data stores:** PostgreSQL and Redis plus uploads storage.
- **Auth model:** Local accounts, SSO/OIDC options, moderation roles, and trust levels.
- **API / integration surface:** REST API, webhooks, plugins, SSO, email ingestion, and admin surfaces.
- **Operational complexity:** **Medium to High**
- **Security / compliance considerations:** Public communities need strong moderation, email security, plugin discipline, and abuse/spam controls.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service or internal hostname. Keep it off the customer-facing surface by default. Integrate with the Next.js site via server-side APIs, webhooks, or deep links; use SSO when possible.
- **Integration boundary:** Prefer subdomain/internal-domain isolation over importing its UI into the public site.
- **Blast-radius note:** Moderate product/ops risk; community tooling needs human stewardship.