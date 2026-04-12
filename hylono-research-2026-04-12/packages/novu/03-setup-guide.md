# Novu — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Start from official self-host overview, validate required MongoDB/Redis/storage dependencies, and test outbound providers end-to-end before production use. [https://docs.novu.co/platform/self-hosting/overview, 2026-04-12, current]
    - **Deployment methods to prefer:** Self-host via official guides on VMs/containers; production deployments need Redis, MongoDB, storage, secrets, and provider configuration.
    - **Required infrastructure:** MongoDB, Redis, storage, outbound providers, TLS/reverse proxy, and worker scaling.
    - **Env / secret pattern:** Mongo URL, Redis URL, storage config, API keys, JWT/app secrets, provider credentials, and base URLs.
    - **Persistence / backup requirement:** Back up MongoDB, preserve template/workflow definitions, and version control IaC for deployment settings.
    - **Upgrade / maintenance focus:** Watch queue backlogs, provider failures, webhook retries, payload drift, and version compatibility across API/dashboard/workers.
    - **Common failure points:** Assuming provider abstraction removes deliverability work, under-sizing worker/queue capacity, and storing too much sensitive context in notification payloads.

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