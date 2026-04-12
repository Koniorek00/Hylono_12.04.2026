# Mautic — How It Works

## Phase B — Core architecture
- **Runtime model:** PHP application with DB, queues/cron, mail, and campaign/segment logic. [https://docs.mautic.org/, 2026-04-12, 7.0.1]
- **Main components:** Campaign builder, contacts/segments, forms/emails, DB, cron/jobs, and integrations. [https://github.com/mautic/mautic/releases, 2026-04-12, 7.0.1]
- **Typical deployment model:** Self-host is possible but operationally heavier than Listmonk. [https://docs.mautic.org/, 2026-04-12, 7.0.1]
- **Runtime dependencies:** Database, mail, cron/queue, storage, and marketing-process ownership.
- **Primary data stores:** Relational database.
- **Auth model:** Admin users and API access.
- **API / integration surface:** Marketing APIs, forms, webhooks, and campaign automations.
- **Operational complexity:** **Medium to High**
- **Security / compliance considerations:** Marketing contacts, tracking, and consent handling require strong process governance.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service or internal hostname. Keep it off the customer-facing surface by default. Integrate with the Next.js site via server-side APIs, webhooks, or deep links; use SSO when possible.
- **Integration boundary:** Prefer subdomain/internal-domain isolation over importing its UI into the public site.
- **Blast-radius note:** Moderate overlap/complexity risk.