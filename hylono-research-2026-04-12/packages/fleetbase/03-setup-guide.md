# Fleetbase — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Start from repo blueprints only after confirming a real logistics use case; otherwise keep it off the active roadmap. [https://github.com/fleetbase/fleetbase, 2026-04-12, v0.7.29]
    - **Deployment methods to prefer:** Self-hosting appears well-supported in repo assets (compose, Helm, Caddy). Still only justified if logistics becomes a true internal capability.
    - **Required infrastructure:** Database, storage, mail, reverse proxy, scheduler/jobs, mapping/tracking integrations depending on use case.
    - **Env / secret pattern:** DB settings, app URL, mail, storage, map/tracking provider keys, scheduler/job config, and reverse-proxy settings.
    - **Persistence / backup requirement:** Back up DB and any operational document storage; location/event data retention needs policy.
    - **Upgrade / maintenance focus:** Extension compatibility, dispatch workflow quality, mobile/operator UX, and data retention all require attention.
    - **Common failure points:** Deploying it without a real fleet/logistics domain, or overlapping responsibilities with Leihs, CMMS, and standard shipping tooling.

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