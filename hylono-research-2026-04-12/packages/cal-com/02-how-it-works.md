# Cal.com — How It Works

## Phase B — Core architecture
- **Runtime model:** Next.js/Node-based application stack with PostgreSQL, Prisma, background jobs, integrations, and calendar providers. [https://cal.com/docs, 2026-04-12, current]
- **Main components:** Web app, DB, cron/jobs, calendar integrations, emails/webhooks, and optional embed flows. [https://github.com/calcom/cal.com/releases, 2026-04-12, v6.2.0]
- **Typical deployment model:** Self-host via official docs with PostgreSQL and scheduled jobs; production needs calendar provider setup, reverse proxy, and reliability on webhooks/cron. [https://cal.com/docs, 2026-04-12, current]
- **Runtime dependencies:** PostgreSQL, Node runtime, cron/background jobs, mail, calendar provider credentials, and OAuth/app credentials for integrations.
- **Primary data stores:** PostgreSQL primary datastore.
- **Auth model:** Local/workspace auth plus calendar/provider auth and optional SSO paths depending on plan/setup.
- **API / integration surface:** Booking APIs, webhooks, embeds, OAuth/provider integrations, and scheduling/event workflows.
- **Operational complexity:** **Medium**
- **Security / compliance considerations:** Bookings can expose personal contact details and availability data. Harden admin/user access and validate webhook/auth flows carefully.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service or internal hostname. Keep it off the customer-facing surface by default. Integrate with the Next.js site via server-side APIs, webhooks, or deep links; use SSO when possible.
- **Integration boundary:** Prefer subdomain/internal-domain isolation over importing its UI into the public site.
- **Blast-radius note:** Moderate. High user-facing value, but calendar sync and scheduling edge cases create support load.