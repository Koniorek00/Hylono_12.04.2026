# Leihs — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Begin with leihs-instance and the main repo docs. Validate whether its workflow model matches Hylono rental logistics before deep implementation. [https://github.com/leihs/leihs-instance, 2026-04-12, current]
    - **Deployment methods to prefer:** The leihs-instance repo is the most useful public deployment blueprint; production still requires standard app hardening, storage, backups, and role design.
    - **Required infrastructure:** Database, mailer, storage, background jobs, reverse proxy/TLS, and operational process configuration.
    - **Env / secret pattern:** App secrets, DB settings, mailer, storage paths, base URLs, worker settings, and any identity/SMTP integrations.
    - **Persistence / backup requirement:** Back up database and uploaded files; treat reservations and lending records as operational truth if adopted.
    - **Upgrade / maintenance focus:** User role mapping, reservation policy tuning, upgrade testing, and reporting/export checks.
    - **Common failure points:** Underestimating workflow adaptation, ignoring customer-facing UX requirements, and assuming institutional defaults match premium commercial rental operations.

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