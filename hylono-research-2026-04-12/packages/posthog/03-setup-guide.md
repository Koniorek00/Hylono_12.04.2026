# PostHog — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** If Hylono already uses PostHog cloud and that satisfies EU/data requirements, keeping it managed is likely simpler than self-hosting. [https://github.com/PostHog/posthog, 2026-04-12, current]
    - **Deployment methods to prefer:** Operationally heavy self-hosting. Official docs emphasize hobby/beta self-host paths and recommend cloud for most users.
    - **Required infrastructure:** ClickHouse, PostgreSQL, Redis, object storage, background workers, secure ingress, and capacity planning.
    - **Env / secret pattern:** Multiservice infra config, object storage, databases, secrets, SDK keys, and worker settings.
    - **Persistence / backup requirement:** All backing stores need coordinated backup strategy in self-hosted mode.
    - **Upgrade / maintenance focus:** Event volume, cost/capacity, data retention, schema drift, and privacy controls dominate.
    - **Common failure points:** Self-hosting for control without resourcing the full data/ops burden, or duplicating analytics across multiple tools.

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