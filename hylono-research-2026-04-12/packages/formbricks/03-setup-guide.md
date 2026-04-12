# Formbricks — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Good later addition for customer research, post-rental feedback, or NPS. [https://formbricks.com/docs/self-hosting, 2026-04-12, current]
    - **Deployment methods to prefer:** Self-host docs are mature; HTTPS and modest resources are required.
    - **Required infrastructure:** Database, storage, HTTPS, email if used, and event/targeting integrations.
    - **Env / secret pattern:** DB settings, app URL, HTTPS, secrets, mail, and survey targeting config.
    - **Persistence / backup requirement:** Back up DB and response data; define retention for response history.
    - **Upgrade / maintenance focus:** Survey targeting, consent/context, and response analysis ownership matter.
    - **Common failure points:** Using it to collect sensitive health-like data without proper framing and governance.

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