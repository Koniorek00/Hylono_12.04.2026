# Temporal — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Do not adopt before exhausting simpler orchestration patterns. [https://docs.temporal.io/, 2026-04-12, current]
    - **Deployment methods to prefer:** Self-host Docker/Kubernetes exists, but this is serious platform infrastructure, not a casual utility.
    - **Required infrastructure:** PostgreSQL/MySQL/Cassandra depending on deployment, workers in code, monitoring, and durable queue thinking.
    - **Env / secret pattern:** Persistence DB, service config, namespace/auth, worker endpoints, and monitoring.
    - **Persistence / backup requirement:** Back up persistence DB and treat workflow histories as durable state.
    - **Upgrade / maintenance focus:** Server upgrades, SDK compatibility, namespace management, and worker reliability matter.
    - **Common failure points:** Using Temporal because it is powerful rather than because durable coded workflows are clearly needed.

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