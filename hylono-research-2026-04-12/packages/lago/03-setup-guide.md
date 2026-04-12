# Lago — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Start with official self-host docs and Docker Compose only after a billing domain model is agreed. Do not deploy speculatively. [https://docs.getlago.com/, 2026-04-12, current]
    - **Deployment methods to prefer:** Official Docker Compose and Helm paths exist. Production requires persistent database, background processing, mail/notifications, and finance-grade change control.
    - **Required infrastructure:** PostgreSQL, background workers/queues, email/notifications, webhooks, and payment provider integration.
    - **Env / secret pattern:** DB URL, app secrets, payment provider credentials, webhooks, mailer config, storage if needed, and background job settings.
    - **Persistence / backup requirement:** Back up the billing DB and preserve invoice artifacts. Test webhook replay and invoice regeneration assumptions carefully.
    - **Upgrade / maintenance focus:** Version upgrades require billing regression checks, webhook validation, and finance-side acceptance criteria.
    - **Common failure points:** Overlapping responsibilities with Stripe, introducing invoice truth conflicts, and deploying metering before the business pricing model is stable.

    ## Minimum viable deployment path
    1. Deploy the application as a separate service using the official docs and the indexed blueprint assets.
2. Keep the public site unchanged; integrate through server-side APIs, webhooks, or automation workflows.
3. Back up the primary datastore and attach monitoring before production cutover.
4. Pilot one bounded workflow before making the app a source of truth.

    ## Reverse proxy / gateway pattern
    - Put externally reachable services behind TLS and a deliberate boundary. For Hylono, that generally means **Kong or a simpler reverse proxy first**, with the public Next.js site remaining the customer-facing entrypoint unless the app package explicitly calls for a separate product surface.
    - Keep admin planes private or SSO-protected wherever possible.
    - Route webhooks and callback URLs through stable, documented hostnames; do not depend on local tunnels in production.

    ## Observability hooks
    - Add health checks / uptime checks in Uptime Kuma where appropriate.
    - Export metrics to Prometheus / Grafana when the app becomes operationally important.
    - Log through a centralized approach that avoids leaking secrets or unnecessary personal data.