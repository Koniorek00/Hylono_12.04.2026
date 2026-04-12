# Cal.com — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Use official self-host docs. Validate booking flows, availability rules, and calendar sync before public rollout. [https://cal.com/docs, 2026-04-12, current]
    - **Deployment methods to prefer:** Self-host via official docs with PostgreSQL and scheduled jobs; production needs calendar provider setup, reverse proxy, and reliability on webhooks/cron.
    - **Required infrastructure:** PostgreSQL, Node runtime, cron/background jobs, mail, calendar provider credentials, and OAuth/app credentials for integrations.
    - **Env / secret pattern:** DATABASE_URL, NEXTAUTH/APP secrets, calendar provider creds, email config, base URLs, cron settings, and webhook endpoints.
    - **Persistence / backup requirement:** Back up PostgreSQL and preserve booking/event configurations.
    - **Upgrade / maintenance focus:** Cron reliability, calendar webhook delivery, timezone correctness, and provider API quota/permission review.
    - **Common failure points:** Broken calendar sync, timezone mistakes, and over-embedding without testing SSR/security behavior in the main site.

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