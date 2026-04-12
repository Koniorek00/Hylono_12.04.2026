# Kong — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Adopt early for service governance if the stack expands beyond a few isolated apps. Pair with ZITADEL for IdP and Infisical for secrets. [https://github.com/Kong/kong/releases, 2026-04-12, 3.14.0.1]
    - **Deployment methods to prefer:** Docker Compose or Kubernetes are common. PostgreSQL-backed mode is practical when plugin/state features are needed.
    - **Required infrastructure:** PostgreSQL for DB-backed mode, reverse proxy/TLS, plugin config, monitoring, and careful route/policy design.
    - **Env / secret pattern:** Kong DB settings or declarative config, proxy/admin ports, TLS, plugin secrets, and service upstream definitions.
    - **Persistence / backup requirement:** If DB-backed, back up Kong PostgreSQL; if declarative, version control the config.
    - **Upgrade / maintenance focus:** Route/plugin testing, certificate handling, upgrade compatibility, and metrics/logging need ownership.
    - **Common failure points:** Overcomplicating a very small stack, or deploying Kong without a clear API catalog and route ownership model.

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