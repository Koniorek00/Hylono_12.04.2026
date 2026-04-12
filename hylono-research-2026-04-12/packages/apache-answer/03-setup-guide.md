# Apache Answer — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Use only if the product need is specifically Q&A/help, not general community. [https://answer.apache.org/docs/installation, 2026-04-12, current]
    - **Deployment methods to prefer:** Docker quick-start exists; production still needs DB, storage, auth decisions, and moderation processes.
    - **Required infrastructure:** Database, storage, mail/auth, reverse proxy, and backup plan.
    - **Env / secret pattern:** DB settings, storage, mail, auth secrets, and base URL.
    - **Persistence / backup requirement:** Back up database and uploads/storage.
    - **Upgrade / maintenance focus:** Moderation, spam handling, upgrade cadence, and taxonomy/content curation matter.
    - **Common failure points:** Choosing a Q&A platform when Hylono really needs docs or community discussions instead.

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