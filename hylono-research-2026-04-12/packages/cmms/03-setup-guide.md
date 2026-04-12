# CMMS — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Treat app identity as inferred and re-verify before implementation. If Atlas CMMS is correct, start from official docs and self-host guidance. [https://github.com/Grashjs/grash, 2026-04-12, v1.4.0]
    - **Deployment methods to prefer:** Self-host via official docs or repo guidance; production needs database, mail, backups, and operations ownership.
    - **Required infrastructure:** Database, mail, storage, scheduler/background jobs, and operational process definition.
    - **Env / secret pattern:** DB settings, app URL, mail, storage, scheduler config, and secrets.
    - **Persistence / backup requirement:** Back up maintenance DB and any documents/images linked to work orders.
    - **Upgrade / maintenance focus:** Preventive-maintenance cadence, data hygiene for asset/service histories, and workflow ownership matter more than raw infrastructure complexity.
    - **Common failure points:** Using a CMMS before asset/service taxonomy is defined, or overlapping it badly with Leihs/Snipe-IT/Fleetbase.

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