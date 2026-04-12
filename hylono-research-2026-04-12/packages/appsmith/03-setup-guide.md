# Appsmith — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Good candidate after identity/secrets/gateway layers are in place. Use it for internal ops, not customer-facing pages. [https://docs.appsmith.com/, 2026-04-12, current]
    - **Deployment methods to prefer:** Docker Compose or Kubernetes are supported. Production requires SSO, environment promotion, and data-connector discipline.
    - **Required infrastructure:** Persistent storage, Appsmith runtime, auth/SSO, database/API credentials, and reverse proxy.
    - **Env / secret pattern:** App URL, auth settings, storage, encryption/secrets, and connector credentials.
    - **Persistence / backup requirement:** Back up metadata/config and version critical apps where possible.
    - **Upgrade / maintenance focus:** Connector governance, environment separation, and role/access review matter.
    - **Common failure points:** Letting Appsmith become an uncontrolled privileged UI over every production system.

    ## Minimum viable deployment path
    1. Deploy as a separate internal service behind TLS.
2. Integrate SSO when practical, or at minimum restrict local-admin access.
3. Connect only the minimum required data sources or APIs.
4. Pilot with internal users before exposing deeper operational reliance.

    ## Reverse proxy / gateway pattern
    - Put externally reachable services behind TLS and a deliberate boundary. For Hylono, that generally means **Kong or a simpler reverse proxy first**, with the public Next.js site remaining the customer-facing entrypoint unless the app package explicitly calls for a separate product surface.
    - Keep admin planes private or SSO-protected wherever possible.
    - Route webhooks and callback URLs through stable, documented hostnames; do not depend on local tunnels in production.

    ## Observability hooks
    - Add health checks / uptime checks in Uptime Kuma where appropriate.
    - Export metrics to Prometheus / Grafana when the app becomes operationally important.
    - Log through a centralized approach that avoids leaking secrets or unnecessary personal data.