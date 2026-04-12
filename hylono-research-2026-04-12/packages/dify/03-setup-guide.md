# Dify — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Only prioritize after core business systems are stable and a real AI product/internal-assistant use case is defined. [https://docs.dify.ai/, 2026-04-12, v1.13.3]
    - **Deployment methods to prefer:** Self-host quick-start and Helm charts exist, but production adds significant model/vector/storage considerations.
    - **Required infrastructure:** Databases, caches, object storage, model provider keys, possible vector store, and observability.
    - **Env / secret pattern:** DB/cache/storage/model settings, app secrets, vector store config, and URLs.
    - **Persistence / backup requirement:** Back up metadata DB and storage; knowledge bases may be reproducible but ingestion pipelines matter.
    - **Upgrade / maintenance focus:** Model/provider governance, prompt/version drift, vector/knowledge refresh, and privacy controls matter.
    - **Common failure points:** Deploying AI infrastructure without defined use cases or data-governance guardrails.

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