# Snipe-IT — How It Works

## Phase B — Core architecture
- **Runtime model:** Laravel/PHP web app with database, mail, queues/scheduled jobs, and file uploads. [https://snipe-it.readme.io/docs, 2026-04-12, current]
- **Main components:** Web UI/API, relational database, mailer, cron/jobs, storage, and auth integrations like LDAP/SSO options. [https://github.com/snipe/snipe-it/releases, 2026-04-12, v8.4.1]
- **Typical deployment model:** Commonly self-hosted via Docker or standard PHP stack behind a reverse proxy. [https://snipe-it.readme.io/docs, 2026-04-12, current]
- **Runtime dependencies:** Database, PHP runtime, mailer, storage, cron/scheduler, and optional LDAP/AD integrations.
- **Primary data stores:** Relational database (commonly MySQL/MariaDB).
- **Auth model:** Local accounts plus optional LDAP/AD; review SSO options if needed.
- **API / integration surface:** REST API, import/export, reports, and asset/audit workflows.
- **Operational complexity:** **Medium**
- **Security / compliance considerations:** Contains inventory records, user assignments, and audit data. Standard web-app hardening and backup controls are required.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service or internal hostname. Keep it off the customer-facing surface by default. Integrate with the Next.js site via server-side APIs, webhooks, or deep links; use SSO when possible.
- **Integration boundary:** Prefer subdomain/internal-domain isolation over importing its UI into the public site.
- **Blast-radius note:** Low to moderate if scoped internally; poor fit if stretched into rental operations.