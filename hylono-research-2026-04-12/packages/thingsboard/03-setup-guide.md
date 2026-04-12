# ThingsBoard — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Only implement when Hylono has real connected-device requirements beyond simple monitoring. [https://thingsboard.io/docs/, 2026-04-12, current]
    - **Deployment methods to prefer:** Self-hosting is mature but operationally meaningful. Production architecture should match actual device scale.
    - **Required infrastructure:** Databases, brokers/queues, storage, and device/MQTT connectivity.
    - **Env / secret pattern:** DB/broker settings, transport config, auth/device credential settings, and cluster sizing.
    - **Persistence / backup requirement:** Depends on telemetry/storage design; backups must include config and metadata.
    - **Upgrade / maintenance focus:** Device lifecycle, telemetry volume, rule-chain correctness, and multi-tenant data separation matter.
    - **Common failure points:** Deploying a full IoT platform before confirming device telemetry is a strategic requirement.

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