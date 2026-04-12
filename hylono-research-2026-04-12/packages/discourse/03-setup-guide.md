# Discourse — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Use official Docker install path only if Hylono genuinely wants a forum/community surface. [https://meta.discourse.org/t/discourse-official-install-guide/23657, 2026-04-12, current]
    - **Deployment methods to prefer:** Official self-hosting is Docker-on-Linux oriented; production requires mail, storage, backups, and moderation operations.
    - **Required infrastructure:** PostgreSQL, Redis, Docker/Linux host, mail delivery, storage, CDN/reverse proxy if scaled.
    - **Env / secret pattern:** Hostnames, SMTP, storage/uploads, Redis/PostgreSQL, SSO config, and admin/moderation settings.
    - **Persistence / backup requirement:** Back up PostgreSQL, Redis (as needed), and uploads; preserve moderation and content retention policies.
    - **Upgrade / maintenance focus:** Moderation, spam prevention, upgrade cadence, plugin compatibility, and email deliverability are ongoing responsibilities.
    - **Common failure points:** Launching a forum without community operations capacity, or using a full forum where a lighter Q&A/knowledge base would suffice.

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