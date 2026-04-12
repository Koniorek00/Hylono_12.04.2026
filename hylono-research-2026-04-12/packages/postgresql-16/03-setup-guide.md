# PostgreSQL 16 — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Use official PostgreSQL 16 packages or containers; enable TLS, backups, autovacuum visibility, connection pooling, and metrics before broad app consolidation. [https://www.postgresql.org/about/news/postgresql-1613-1517-1422-1325-and-1229-released-3066/, 2026-04-12, 16.13]
    - **Deployment methods to prefer:** Managed service for site data or dedicated self-hosted instances for app groups that need local control, extension freedom, or network isolation.
    - **Required infrastructure:** Fast persistent storage, reliable backups, monitoring, connection pooling for higher concurrency, and disciplined schema migration workflows.
    - **Env / secret pattern:** POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, storage sizing, WAL retention, backup target credentials, and pooler settings.
    - **Persistence / backup requirement:** Base backups plus WAL archiving; test restore regularly; keep schema migration discipline per app.
    - **Upgrade / maintenance focus:** Quarterly minor patching, vacuum/bloat review, replication monitoring, slow query visibility, and capacity checks for connection spikes.
    - **Common failure points:** Connection exhaustion, slow disks, missing WAL retention, poor backup testing, and shared-cluster blast radius from noisy neighbors.

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