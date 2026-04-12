# Grafana — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Deploy with Prometheus and exporters as part of the observability wave. [https://grafana.com/docs/grafana/latest/, 2026-04-12, 12.4.2]
    - **Deployment methods to prefer:** Straightforward self-hosting; usually paired with Prometheus and exporters.
    - **Required infrastructure:** Metadata storage, data-source connectors, auth/SSO, reverse proxy, and alerting config.
    - **Env / secret pattern:** Admin creds, datasource settings, auth/SSO, SMTP, and storage path.
    - **Persistence / backup requirement:** Back up Grafana config/DB or provision dashboards as code.
    - **Upgrade / maintenance focus:** Datasource governance, dashboard sprawl control, and version/plugin upgrades matter.
    - **Common failure points:** Letting Grafana become a manual dashboard graveyard without provisioning discipline.

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