# Ditto — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Treat product identity as inferred and version as unverified. Re-check before implementation. [https://docs.dittofeed.com/, 2026-04-12, current]
    - **Deployment methods to prefer:** Self-host docs mention Docker Compose and Helm. Production still requires message-provider setup and customer data governance.
    - **Required infrastructure:** Database, queues/workers, storage, provider credentials, and ingestion endpoints.
    - **Env / secret pattern:** DB settings, app URL, secret keys, provider credentials, webhook/event ingestion config, and worker settings.
    - **Persistence / backup requirement:** Back up DB and preserve campaign/template definitions if adopted.
    - **Upgrade / maintenance focus:** Deliverability, segmentation correctness, customer data hygiene, and campaign-governance ownership matter more than basic install.
    - **Common failure points:** Redundant overlap with Novu, Listmonk, Mautic, and direct app logic.

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