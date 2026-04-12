# Node-RED — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Use official install docs only if an IoT/protocol need justifies it. Otherwise prefer n8n. [https://nodered.org/docs/, 2026-04-12, 4.1.8]
    - **Deployment methods to prefer:** Docker or simple service deployment is straightforward. Governance matters more than install.
    - **Required infrastructure:** Persistent storage for flows, broker/API endpoints, optional MQTT, and plugin/node governance.
    - **Env / secret pattern:** Editor/base URL, auth, storage path, node credentials, broker settings, and reverse-proxy config.
    - **Persistence / backup requirement:** Back up flows and credentials storage; version control exports for critical flows.
    - **Upgrade / maintenance focus:** Node/plugin review, flow testing, and environment separation matter.
    - **Common failure points:** Creating two competing automation platforms without a clear reason, or relying on community nodes without security review.

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