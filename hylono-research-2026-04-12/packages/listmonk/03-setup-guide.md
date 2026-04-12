# Listmonk — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Use official docs and single-binary/container deployment. Keep it narrow: newsletters and simple campaigns. [https://listmonk.app/docs/, 2026-04-12, v6.1.0]
    - **Deployment methods to prefer:** Relatively easy self-host path; PostgreSQL and SMTP/provider config are the main requirements.
    - **Required infrastructure:** PostgreSQL, SMTP or email provider, reverse proxy/TLS, and media/file storage if using uploads.
    - **Env / secret pattern:** DB URL, app/admin config, SMTP/provider credentials, media storage, and base URL.
    - **Persistence / backup requirement:** Back up PostgreSQL and any media storage; preserve template/campaign history where needed.
    - **Upgrade / maintenance focus:** Deliverability, unsubscribe correctness, bounce handling, and consent-data integrity matter most.
    - **Common failure points:** Treating it like a full customer-data platform or duplicating preference management poorly with Novu/Mautic/site DB.

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