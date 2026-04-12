# Fides — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Only prioritize once Hylono commits to a real privacy program beyond basic cookie banners and policy docs. [https://docs.ethyca.com/, 2026-04-12, current]
    - **Deployment methods to prefer:** Production docs exist for modern container orchestration. This is a real platform, not a lightweight plugin.
    - **Required infrastructure:** Database, workers, mail, app/data-system connectors, secrets management, and privacy-process ownership.
    - **Env / secret pattern:** DB settings, app secrets, connector configs, mail, auth, and deployment-specific worker settings.
    - **Persistence / backup requirement:** Back up the DB and preserve privacy request/state integrity.
    - **Upgrade / maintenance focus:** Connector maintenance, privacy workflow ownership, legal/policy updates, and access review are ongoing.
    - **Common failure points:** Deploying a governance platform before the organization has clear privacy processes and data maps.

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