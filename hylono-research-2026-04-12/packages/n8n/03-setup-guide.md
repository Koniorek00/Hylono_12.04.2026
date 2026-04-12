# n8n — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Use official self-host docs; deploy with persistent DB, reverse proxy/TLS, and public webhook routing. Add queue mode only when concurrency or reliability requires it. [https://github.com/n8n-io/n8n/releases, 2026-04-12, 2.15.1]
    - **Deployment methods to prefer:** Docker is standard; production may use queue mode with Redis, separate workers, persistent database, and public webhook reachability.
    - **Required infrastructure:** Database, optional Redis for queue mode, webhook ingress, mail/notifications, secrets handling, and storage for binary data if used.
    - **Env / secret pattern:** DB settings, encryption key, webhook URL, host/base URL, Redis settings if queue mode, execution retention, and credential secrets.
    - **Persistence / backup requirement:** Back up database and export important workflows; review binary data retention and execution logs.
    - **Upgrade / maintenance focus:** Webhook delivery, failed execution handling, credential rotation, workflow versioning, and worker scaling.
    - **Common failure points:** Using it as an ungoverned shadow backend, leaking secrets into workflow nodes, and failing to test webhook callbacks end to end.

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