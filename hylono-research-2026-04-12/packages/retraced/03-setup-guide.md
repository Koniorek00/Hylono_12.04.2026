# Retraced — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Only prioritize if Hylono has a real audit-log centralization requirement beyond app-native audit features. [https://github.com/retracedhq/retraced, 2026-04-12, v1.13.1]
    - **Deployment methods to prefer:** Can be self-hosted, but project cadence looks quieter than some alternatives. Maturity and maintenance should be revalidated before adoption.
    - **Required infrastructure:** Database/storage, API ingress, app instrumentation, and auth/access controls.
    - **Env / secret pattern:** Storage/DB config, service secrets, API auth, base URL, and retention settings.
    - **Persistence / backup requirement:** Audit log retention and tamper-resistance expectations should be decided up front.
    - **Upgrade / maintenance focus:** Instrumentation coverage, retention, and access review matter most.
    - **Common failure points:** Adding a separate audit system without actually instrumenting the important actions.

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