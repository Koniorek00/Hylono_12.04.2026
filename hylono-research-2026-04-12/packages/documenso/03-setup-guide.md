# Documenso — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Start with the official Docker Compose path; validate document retention, audit logs, and legal sufficiency before production rollout. [https://docs.documenso.com/, 2026-04-12, current]
    - **Deployment methods to prefer:** Official Docker and Docker Compose options are available; production requires external database, file storage, and mail configuration.
    - **Required infrastructure:** PostgreSQL or supported DB, object/file storage, mailer, TLS, and strong secret management.
    - **Env / secret pattern:** DB URL, NEXTAUTH/app secrets, storage credentials, mail config, app URLs, and enterprise license key if applicable.
    - **Persistence / backup requirement:** Back up database and document storage together; test integrity of audit records and signed artifacts.
    - **Upgrade / maintenance focus:** Version upgrades, storage migration, email deliverability, and document retention/governance need explicit ownership.
    - **Common failure points:** Assuming 'open-source e-sign' automatically equals legal sufficiency for every workflow, or mixing signed-doc truth across multiple systems.

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