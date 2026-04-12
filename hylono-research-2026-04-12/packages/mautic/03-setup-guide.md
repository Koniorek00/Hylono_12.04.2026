# Mautic — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Only adopt if advanced nurture journeys become a real growth need. [https://docs.mautic.org/, 2026-04-12, 7.0.1]
    - **Deployment methods to prefer:** Self-host is possible but operationally heavier than Listmonk.
    - **Required infrastructure:** Database, mail, cron/queue, storage, and marketing-process ownership.
    - **Env / secret pattern:** DB settings, mail, app secrets, cron, storage, and tracking config.
    - **Persistence / backup requirement:** Back up DB and templates/assets.
    - **Upgrade / maintenance focus:** Deliverability, campaign QA, consent management, and cron reliability matter.
    - **Common failure points:** Overkill compared to simpler newsletter/transactional stack.

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