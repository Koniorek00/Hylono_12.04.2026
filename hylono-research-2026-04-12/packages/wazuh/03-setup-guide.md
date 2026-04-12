# Wazuh — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Defer until the platform footprint and security maturity justify centralized SIEM/EDR-style tooling. [https://documentation.wazuh.com/current/, 2026-04-12, v4.14.4]
    - **Deployment methods to prefer:** Self-hostable but operationally heavy. Best introduced when there are enough systems to secure centrally.
    - **Required infrastructure:** Compute/storage, agent management, network design, rules tuning, and security operations ownership.
    - **Env / secret pattern:** Cluster/indexer settings, certificates, agent enrollment, dashboard auth, and storage sizing.
    - **Persistence / backup requirement:** Security logs and indexes require retention policy and storage planning.
    - **Upgrade / maintenance focus:** Rule tuning, false positives, agent lifecycle, and incident workflows dominate.
    - **Common failure points:** Deploying SIEM tooling before there is a team/process to operate it.

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