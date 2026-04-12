# MongoDB 7 — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Use official 7.0 production docs. Prefer replica sets for any meaningful workload. Plan backups, monitoring, and index review from day one. [https://www.mongodb.com/docs/manual/administration/production-notes/, 2026-04-12, 7.0]
    - **Deployment methods to prefer:** Replica set for production durability; single node only for labs or low-risk internal services.
    - **Required infrastructure:** Fast storage, memory headroom, backups, monitoring, and version-compatible drivers.
    - **Env / secret pattern:** MONGO_INITDB_ROOT_USERNAME, MONGO_INITDB_ROOT_PASSWORD, replica-set config, storage sizing, backup target credentials.
    - **Persistence / backup requirement:** Snapshot plus oplog-aware backup strategy; test restores; watch index growth.
    - **Upgrade / maintenance focus:** Patch within the 7.0 line, review slow queries/indexes, monitor replication lag, and capacity-plan storage.
    - **Common failure points:** Undersized storage, replica misconfiguration, index sprawl, and using MongoDB where relational guarantees were actually needed.

    ## Minimum viable deployment path
    1. Provision the service on isolated infrastructure or a dedicated shared platform host.
2. Store secrets in Infisical or equivalent; put public or admin ingress behind Kong / private networking as appropriate.
3. Add backups / exporters / health checks before broader rollout.
4. Integrate one real dependent service first, then scale usage.

    ## Reverse proxy / gateway pattern
    - Put externally reachable services behind TLS and a deliberate boundary. For Hylono, that generally means **Kong or a simpler reverse proxy first**, with the public Next.js site remaining the customer-facing entrypoint unless the app package explicitly calls for a separate product surface.
    - Keep admin planes private or SSO-protected wherever possible.
    - Route webhooks and callback URLs through stable, documented hostnames; do not depend on local tunnels in production.

    ## Observability hooks
    - Add health checks / uptime checks in Uptime Kuma where appropriate.
    - Export metrics to Prometheus / Grafana when the app becomes operationally important.
    - Log through a centralized approach that avoids leaking secrets or unnecessary personal data.