# Fasten Health — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Do not prioritize; keep outside the roadmap unless product direction changes dramatically. [https://github.com/fastenhealth/fasten-onprem, 2026-04-12, v1.1.x]
    - **Deployment methods to prefer:** Self-hostable, but strategic value for Hylono is low unless the business moves into patient-controlled records.
    - **Required infrastructure:** Storage, auth, healthcare connectors, and data persistence.
    - **Env / secret pattern:** App settings, storage, connector credentials where relevant.
    - **Persistence / backup requirement:** Sensitive health records would require strong backup/encryption controls if ever used.
    - **Upgrade / maintenance focus:** Connector maintenance and sensitive-data governance are the main issues.
    - **Common failure points:** Confusing a personal-record product with a business operations platform.

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