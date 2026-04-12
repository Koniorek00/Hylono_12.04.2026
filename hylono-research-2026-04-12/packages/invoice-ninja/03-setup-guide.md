# Invoice Ninja — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Use official self-host docs and test Stripe/payment integration thoroughly before production. [https://invoiceninja.github.io/, 2026-04-12, v5]
    - **Deployment methods to prefer:** Docker and self-host docs are mature. Production needs mail, backups, payment/webhook testing, and PDF/document storage planning.
    - **Required infrastructure:** Database, PHP runtime, mailer, payment provider credentials, cron, and storage.
    - **Env / secret pattern:** APP_URL, DB settings, mailer, app key, payment provider secrets, queue/cron, and storage paths.
    - **Persistence / backup requirement:** Back up DB and generated documents; validate invoice numbering and legal template retention.
    - **Upgrade / maintenance focus:** Upgrade cautiously around tax/PDF/payment changes; test reminder schedules and webhook flows.
    - **Common failure points:** Confusing Stripe as source of truth vs Invoice Ninja as source of truth, and duplicating invoice ownership across tools.

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