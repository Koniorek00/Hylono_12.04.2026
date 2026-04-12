# Outline — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Use only if collaborative editing UX outweighs licensing and ops simplicity concerns. [https://github.com/outline/outline, 2026-04-12, v1.6.1]
    - **Deployment methods to prefer:** Self-hosting exists, but licensing and environment complexity are less friendly than BookStack.
    - **Required infrastructure:** Database, storage, mail/auth provider, reverse proxy, and possibly Redis/search.
    - **Env / secret pattern:** DB settings, app secrets, storage/auth config, base URL, and optional Redis/search.
    - **Persistence / backup requirement:** Back up DB and file storage.
    - **Upgrade / maintenance focus:** License tracking, auth integration, storage, and upgrades need attention.
    - **Common failure points:** Choosing Outline for internal SOPs when BookStack is simpler and more structured.

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