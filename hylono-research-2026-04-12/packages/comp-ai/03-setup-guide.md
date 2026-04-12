# Comp AI — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Do not prioritize until a formal compliance program has owners, frameworks, and evidence processes. [https://github.com/comp-ai/comp-ai/blob/main/SELF_HOSTING.md, 2026-04-12, current]
    - **Deployment methods to prefer:** Self-host docs exist in repo; production requires careful access control and governance ownership.
    - **Required infrastructure:** Database, storage, auth, mail, and process owners for controls/evidence.
    - **Env / secret pattern:** DB settings, app secrets, storage/auth/mail config, and service-specific env files.
    - **Persistence / backup requirement:** Back up DB and evidence storage.
    - **Upgrade / maintenance focus:** Framework upkeep, evidence lifecycle, and integration maintenance matter more than deployment.
    - **Common failure points:** Deploying compliance software before the organization is ready to operate a real compliance program.

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