# Meilisearch — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Good later addition if current site search becomes a real product need. [https://www.meilisearch.com/docs, 2026-04-12, v1.38.2]
    - **Deployment methods to prefer:** Operationally light compared with Elasticsearch-class systems.
    - **Required infrastructure:** Persistent storage, indexing pipeline, API key governance, and monitoring.
    - **Env / secret pattern:** Master key, storage path, env mode, dump/snapshot config, and network settings.
    - **Persistence / backup requirement:** Use dumps/snapshots and backups of index data or rebuild pipelines.
    - **Upgrade / maintenance focus:** Reindexing strategy, ranking tuning, and index freshness matter.
    - **Common failure points:** Indexing the wrong data, stale indexes, or exposing privileged search datasets.

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