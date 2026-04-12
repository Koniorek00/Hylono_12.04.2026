# Metriport — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Keep off roadmap unless business strategy changes materially toward regulated healthcare interoperability. [https://docs.metriport.com/, 2026-04-12, current]
    - **Deployment methods to prefer:** Self-hosting is possible but domain-specific and compliance-heavy.
    - **Required infrastructure:** Healthcare connectivity, auth, secure storage, and domain expertise.
    - **Env / secret pattern:** Healthcare integration credentials, storage, auth, and service settings.
    - **Persistence / backup requirement:** Sensitive health data demands strong backup/encryption controls if ever used.
    - **Upgrade / maintenance focus:** Connector maintenance and compliance would dominate.
    - **Common failure points:** Confusing health-adjacent wellness operations with healthcare interoperability needs.

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