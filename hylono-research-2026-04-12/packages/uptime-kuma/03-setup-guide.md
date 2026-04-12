# Uptime Kuma — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Deploy via official container, reverse-proxy behind TLS, configure notifications, and import monitors for all tier-0 services. [https://github.com/louislam/uptime-kuma, 2026-04-12, 2.2.1]
    - **Deployment methods to prefer:** Docker is the normal path; single-node deployment is common.
    - **Required infrastructure:** Persistent volume, outbound notification channel, reverse proxy, and backup of monitor configuration.
    - **Env / secret pattern:** Port, base URL, reverse-proxy headers, persistence path, and notification credentials.
    - **Persistence / backup requirement:** Back up monitor config and internal database/volume.
    - **Upgrade / maintenance focus:** Add monitors as new apps go live, test notifications, and patch on release cadence.
    - **Common failure points:** Treating it as a full observability platform, forgetting backups, or exposing sensitive internal target details on public status pages.

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