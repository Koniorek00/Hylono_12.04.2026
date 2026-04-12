# Presidio — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Use as an internal service/library only if there is a concrete PII-processing need (for example AI assistants, transcript processing, support tooling, or log redaction). [https://microsoft.github.io/presidio/, 2026-04-12, 2.2.362]
    - **Deployment methods to prefer:** Often deployed as internal microservice or embedded library. Operational burden is moderate but narrower than full privacy platforms.
    - **Required infrastructure:** Python runtime, NLP models, containers if service-based, and integration to upstream text/data flows.
    - **Env / secret pattern:** Model/config settings, recognizer config, service port/base URL if containerized.
    - **Persistence / backup requirement:** Stateless by default unless Hylono adds storage around it.
    - **Upgrade / maintenance focus:** Model quality tuning, false positive/negative review, and service versioning matter.
    - **Common failure points:** Assuming out-of-the-box recognizers fully match multilingual or domain-specific data.

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