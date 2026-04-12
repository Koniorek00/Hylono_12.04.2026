# Infisical — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Prioritize early if the stack grows. Start with core app/environment secrets, then onboard dependent services in phases. [https://infisical.com/docs/self-hosting/overview, 2026-04-12, current]
    - **Deployment methods to prefer:** Self-host docs are mature; production requires reliable DB, key management, backup, and role design.
    - **Required infrastructure:** Database, encryption keys/KMS strategy, SSO/auth, backup plan, and agent/injection method choices.
    - **Env / secret pattern:** Bootstrap admin, DB settings, encryption keys, base URL, auth provider config, and secret-sync targets.
    - **Persistence / backup requirement:** Back up database and key material; test disaster recovery because secrets loss or compromise is severe.
    - **Upgrade / maintenance focus:** Access review, key rotation, secrets rotation, audit review, and onboarding discipline matter more than raw install complexity.
    - **Common failure points:** Migrating too many apps at once, mishandling root keys, or assuming every app can ingest secrets the same way.

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