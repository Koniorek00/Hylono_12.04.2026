# RefRef — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Do not put into production without testing maturity and workflow completeness. [https://github.com/amical-do/refref/releases, 2026-04-12, no stable releases observed]
    - **Deployment methods to prefer:** Self-host docs exist, but the project signals alpha/breaking changes; production use requires caution.
    - **Required infrastructure:** Database, mail/notification tooling, tracking links/events, and reward process design.
    - **Env / secret pattern:** DB settings, app URL, mail, secrets, and any reward/integration config.
    - **Persistence / backup requirement:** Back up program DB and audit referral events if used.
    - **Upgrade / maintenance focus:** Program abuse handling, reward reconciliation, and upstream breaking changes are the main risks.
    - **Common failure points:** Assuming alpha software is ready for customer-facing programs without additional hardening.

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