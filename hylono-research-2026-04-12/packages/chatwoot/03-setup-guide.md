# Chatwoot — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Good later-phase support tooling candidate. Start only when support volume justifies a dedicated platform. [https://www.chatwoot.com/docs/self-hosted, 2026-04-12, current]
    - **Deployment methods to prefer:** Mature self-host docs exist. Production needs email/channel integrations, storage, and support operations.
    - **Required infrastructure:** PostgreSQL, Redis, storage, mail/chat channel credentials, and background jobs.
    - **Env / secret pattern:** DB/Redis settings, app secrets, storage, mail, channel creds, base URL, and worker config.
    - **Persistence / backup requirement:** Back up DB and uploads; conversation history retention needs policy.
    - **Upgrade / maintenance focus:** Agent workflow, channel integrations, and response/SLA ownership matter.
    - **Common failure points:** Adding support tooling before support process is defined, or duplicating CRM/support ownership badly.

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