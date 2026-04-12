# Metabase — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Deploy after key operational data sources stabilize; expose curated dashboards rather than raw DB access everywhere. [https://www.metabase.com/docs/latest/, 2026-04-12, v0.59.5]
    - **Deployment methods to prefer:** Self-host is mature; production needs metadata DB, SSO decisions, and data-source governance.
    - **Required infrastructure:** Application runtime, metadata DB, source DB connectivity, reverse proxy, and optional SSO.
    - **Env / secret pattern:** MB_DB settings, source DB credentials, app URL, mail, auth config, and embedding settings.
    - **Persistence / backup requirement:** Back up metadata DB and version key dashboard definitions as needed.
    - **Upgrade / maintenance focus:** Upgrade metadata DB carefully, manage source permissions, and avoid uncontrolled analyst-level DB access.
    - **Common failure points:** Connecting it to production databases with overly broad privileges, or using it to paper over poor source-of-truth design.

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