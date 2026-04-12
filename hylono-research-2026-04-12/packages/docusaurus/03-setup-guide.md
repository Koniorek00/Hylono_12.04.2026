# Docusaurus — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Only use if Hylono wants a separate docs property. Otherwise keep docs/content inside the existing Next.js site. [https://docusaurus.io/docs, 2026-04-12, v3.10.0]
    - **Deployment methods to prefer:** Low operational burden. The bigger question is whether it duplicates the existing Next.js site’s content capabilities.
    - **Required infrastructure:** Node/npm, static hosting or CDN, optional search provider, docs-authoring workflow.
    - **Env / secret pattern:** Build-time config, analytics/search keys, base URL, deployment target settings.
    - **Persistence / backup requirement:** Version control is the main persistence model.
    - **Upgrade / maintenance focus:** Content workflows and search/indexing updates matter more than infrastructure.
    - **Common failure points:** Creating a second frontend/docs stack without strong reason.

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