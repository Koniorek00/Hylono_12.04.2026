# Medusa — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Use official backend install/self-host path plus the official Next.js starter only as a reference implementation. Keep Medusa isolated behind APIs until it proves necessary. [https://docs.medusajs.com/, 2026-04-12, v2]
    - **Deployment methods to prefer:** Self-host backend separately from the public site; use the official Next.js starter as reference, not a reason to refactor the whole public marketing app into a commerce monolith.
    - **Required infrastructure:** PostgreSQL, optional Redis, storage provider, payment connectors (Stripe), search/indexing if scale grows, and admin/auth configuration.
    - **Env / secret pattern:** DATABASE_URL, REDIS_URL if used, STRIPE keys, storage credentials, admin/auth secrets, base URLs, and worker config.
    - **Persistence / backup requirement:** Back up PostgreSQL and file storage; preserve migration discipline and admin config.
    - **Upgrade / maintenance focus:** Track module compatibility, storefront/backend version alignment, payment webhook correctness, and admin access controls.
    - **Common failure points:** Prematurely replacing a working server-first site architecture, duplicating catalog/order logic, and underestimating migration work from custom Stripe flows.

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