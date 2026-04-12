# BigBlueButton — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Only adopt if Hylono needs formal classroom features. Use official install docs on dedicated infrastructure. [https://docs.bigbluebutton.org/administration/install, 2026-04-12, v3.0.x]
    - **Deployment methods to prefer:** Officially prefers a clean dedicated Ubuntu server. This is not a casual sidecar deployment.
    - **Required infrastructure:** Dedicated compute, bandwidth, TURN/STUN, storage for recordings, TLS, and careful capacity planning.
    - **Env / secret pattern:** Domain, TLS, TURN/STUN, recording storage, external auth/integration config, and capacity settings.
    - **Persistence / backup requirement:** Back up configs and recordings as required; recordings can be storage-heavy and privacy-sensitive.
    - **Upgrade / maintenance focus:** Capacity planning, upgrades, TURN/STUN, recording management, and live-ops support are significant.
    - **Common failure points:** Underestimating media ops and using BBB when lighter meeting tooling would suffice.

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