# BookStack — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Deploy via Docker or official install scripts; make it internal-only and connect to SSO when identity is ready. [https://www.bookstackapp.com/docs/, 2026-04-12, v25.12.9]
    - **Deployment methods to prefer:** Simple Docker or standard web-stack deployments are common and operationally light.
    - **Required infrastructure:** Database, storage, reverse proxy/TLS, mail, and auth integration if needed.
    - **Env / secret pattern:** APP_URL, DB settings, app key, mail, storage, and auth provider settings.
    - **Persistence / backup requirement:** Back up DB and uploads; content export can support disaster recovery.
    - **Upgrade / maintenance focus:** Version upgrades and content governance are straightforward.
    - **Common failure points:** Using it for public docs when Docusaurus is better, or for complex collaborative docs where Outline might be preferred.

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