# Twenty CRM — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Use official self-host Docker Compose path first; validate API/webhook behavior in a non-production workspace before wiring site automations. [https://github.com/twentyhq/twenty, 2026-04-12, v1.21.0]
    - **Deployment methods to prefer:** Official Docker Compose is the pragmatic path for self-hosting; production hardening needs persistent storage, backups, reverse proxy, and upgrade discipline.
    - **Required infrastructure:** PostgreSQL, storage, mail/outbound integrations, and likely background workers depending on deployment mode.
    - **Env / secret pattern:** DB URL, app URLs, auth secrets, mailer credentials, storage settings, webhook/API keys, and worker-related config.
    - **Persistence / backup requirement:** Back up the PostgreSQL database and any file storage; test export/restore of CRM data.
    - **Upgrade / maintenance focus:** Track upstream schema changes, API stability, webhook payload changes, and license scope before deep customization.
    - **Common failure points:** Over-customizing before core schemas stabilize, mixing source-of-truth ownership across systems, and ignoring GDPR retention/export needs.

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