# Strapi — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Only implement if the current site’s content model and editorial needs justify a dedicated CMS. [https://docs.strapi.io/, 2026-04-12, v5]
    - **Deployment methods to prefer:** Mature self-host path. Production requires DB, storage, media handling, auth, and editorial process design.
    - **Required infrastructure:** Database, file storage, reverse proxy, auth/admin security, and backups.
    - **Env / secret pattern:** DB settings, JWT/app secrets, storage provider, admin URL, and webhook settings.
    - **Persistence / backup requirement:** Back up DB and media storage; content migrations should be versioned carefully.
    - **Upgrade / maintenance focus:** Content model migrations, plugin updates, and admin security matter.
    - **Common failure points:** Adding CMS complexity when content volume/editorial workflow does not justify it.

    ## Minimum viable deployment path
    1. Deploy the application as a separate service using the official docs and the indexed blueprint assets.
2. Keep the public site unchanged; integrate through server-side APIs, webhooks, or automation workflows.
3. Back up the primary datastore and attach monitoring before production cutover.
4. Pilot one bounded workflow before making the app a source of truth.

    ## Reverse proxy / gateway pattern
    - Put externally reachable services behind TLS and a deliberate boundary. For Hylono, that generally means **Kong or a simpler reverse proxy first**, with the public Next.js site remaining the customer-facing entrypoint unless the app package explicitly calls for a separate product surface.
    - Keep admin planes private or SSO-protected wherever possible.
    - Route webhooks and callback URLs through stable, documented hostnames; do not depend on local tunnels in production.

    ## Observability hooks
    - Add health checks / uptime checks in Uptime Kuma where appropriate.
    - Export metrics to Prometheus / Grafana when the app becomes operationally important.
    - Log through a centralized approach that avoids leaking secrets or unnecessary personal data.