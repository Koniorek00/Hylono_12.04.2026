# ZITADEL — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Use official self-host docs; start with evaluation on Docker only if needed, but target production architecture around the official Helm/Kubernetes path. [https://zitadel.com/docs/self-hosting/deploy/overview, 2026-04-12, current]
    - **Deployment methods to prefer:** Official Docker Compose exists for evaluation, but official docs recommend Kubernetes/Helm for production-scale self-hosting.
    - **Required infrastructure:** Database, TLS/reverse proxy, mail/SMS providers, secrets management, backup/restore, and identity-provider configuration.
    - **Env / secret pattern:** DB settings, external domain, TLS, machine keys, SMTP, SMS/IDP configs, org/project setup, and backup strategy.
    - **Persistence / backup requirement:** Back up the database and any relevant keys/config; identity recovery planning matters.
    - **Upgrade / maintenance focus:** Version upgrades, OIDC client management, key rotation, domain verification, email deliverability, and incident response preparedness.
    - **Common failure points:** Treating identity as a side project, underestimating migration from existing Auth.js/NextAuth flows, and misconfiguring redirect URIs or external domains.

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