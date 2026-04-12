# Gorse — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Only add once Hylono has meaningful interaction data and a clear recommendation use case. [https://gorse.io/docs/, 2026-04-12, v0.5.5]
    - **Deployment methods to prefer:** Self-host is feasible but adds data and relevance-tuning burden.
    - **Required infrastructure:** Datastore, cache, event data, and recommendation-quality evaluation.
    - **Env / secret pattern:** DB/cache settings, model/training config, service URLs, and API keys.
    - **Persistence / backup requirement:** Back up metadata/state as needed; much value depends on event data pipelines.
    - **Upgrade / maintenance focus:** Data freshness, recommendation quality, and model tuning matter.
    - **Common failure points:** Trying to personalize too early with weak data.

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