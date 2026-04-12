# Jitsi — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Use official docker-jitsi-meet releases and handbook. Good candidate if Hylono needs self-hosted meetings but not full classroom tooling. [https://jitsi.github.io/handbook/docs/intro/, 2026-04-12, current]
    - **Deployment methods to prefer:** Official Docker deployment is the practical path. Still requires media-capacity and TURN/STUN planning.
    - **Required infrastructure:** Compute, bandwidth, TURN/STUN, storage for recordings if enabled, TLS, and auth integration.
    - **Env / secret pattern:** Public URL, TURN/STUN, auth/JWT, media ports, recording settings, and TLS.
    - **Persistence / backup requirement:** Back up config and recording storage if recordings are used.
    - **Upgrade / maintenance focus:** Capacity, NAT/TURN, upgrades, and meeting-access controls matter.
    - **Common failure points:** Underestimating media ops or exposing meetings without proper auth.

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