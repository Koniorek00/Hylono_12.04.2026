# Redis 7 — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Use official Redis 7 packages or containers only after licensing is approved internally; enable persistence only where required and document eviction policy explicitly. [https://github.com/redis/redis/releases, 2026-04-12, 7.4.8 observed]
    - **Deployment methods to prefer:** Single-node with persistence for smaller app clusters; HA or managed equivalent only when justified by queue criticality and recovery targets.
    - **Required infrastructure:** RAM headroom, persistent storage if durability matters, monitoring, auth/TLS, and app-level retry logic.
    - **Env / secret pattern:** REDIS_PASSWORD, appendonly/save settings, maxmemory, eviction policy, TLS certs, and network binding.
    - **Persistence / backup requirement:** Choose AOF/RDB deliberately. Do not pretend volatile cache and durable queue workloads have the same recovery requirements.
    - **Upgrade / maintenance focus:** Memory pressure review, eviction monitoring, persistence checks, replica health, and version/license review before upgrades.
    - **Common failure points:** OOM kills, silent key eviction, unauthenticated network exposure, and using Redis as a durable queue without operational guardrails.

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