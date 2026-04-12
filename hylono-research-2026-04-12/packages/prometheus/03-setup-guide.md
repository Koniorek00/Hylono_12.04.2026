# Prometheus — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Deploy alongside Grafana and Alertmanager when more than lightweight uptime checks are needed. [https://prometheus.io/docs/introduction/overview/, 2026-04-12, v3.11.1]
    - **Deployment methods to prefer:** Straightforward container/Kubernetes deployment. Design scrape targets and retention deliberately.
    - **Required infrastructure:** Persistent storage, exporters, service discovery config, and alert routing.
    - **Env / secret pattern:** Scrape configs, retention, storage path, alert configs, and exporter endpoints.
    - **Persistence / backup requirement:** Back up configuration; TSDB backups depend on retention needs and remote-write strategy.
    - **Upgrade / maintenance focus:** Target discovery, alert tuning, storage sizing, and metrics cardinality control matter.
    - **Common failure points:** Unbounded cardinality, poor alert hygiene, and exposing metrics publicly.

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