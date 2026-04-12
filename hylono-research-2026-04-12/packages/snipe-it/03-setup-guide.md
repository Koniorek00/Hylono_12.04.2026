# Snipe-IT — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Follow official install docs, pick a supported DB/runtime combination, and verify whether internal IT asset scope justifies separate deployment from rental tooling. [https://snipe-it.readme.io/docs, 2026-04-12, current]
    - **Deployment methods to prefer:** Commonly self-hosted via Docker or standard PHP stack behind a reverse proxy.
    - **Required infrastructure:** Database, PHP runtime, mailer, storage, cron/scheduler, and optional LDAP/AD integrations.
    - **Env / secret pattern:** APP_URL, DB settings, mailer config, app key, cron, storage path, and LDAP settings if used.
    - **Persistence / backup requirement:** Back up database and uploaded asset files.
    - **Upgrade / maintenance focus:** Laravel/PHP upgrades, cron reliability, import quality, and access-role review.
    - **Common failure points:** Trying to bend it into a customer rental system, or letting asset ownership drift between Snipe-IT and other systems.

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