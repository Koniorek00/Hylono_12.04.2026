# InfluxDB — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Do not prioritize until time-series needs exceed Prometheus or simpler stores. [https://github.com/influxdata/influxdb, 2026-04-12, 3.9.0]
    - **Deployment methods to prefer:** Self-host is feasible; choose only when a clear timeseries need exists.
    - **Required infrastructure:** Persistent storage, ingest clients, and query/retention planning.
    - **Env / secret pattern:** Storage, org/bucket, tokens, retention, and network/TLS settings.
    - **Persistence / backup requirement:** Back up bucket/data as required; retention design is central.
    - **Upgrade / maintenance focus:** Cardinality, retention, storage, and query costs matter.
    - **Common failure points:** Adding a separate timeseries database before proving its necessity.

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