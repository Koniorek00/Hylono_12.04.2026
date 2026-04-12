# Akaunting — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Do not deploy speculatively. First confirm that an accounting platform belongs in scope and that BSL licensing is acceptable. [https://github.com/akaunting/akaunting, 2026-04-12, 3.1.21]
    - **Deployment methods to prefer:** Standard web-app self-host patterns; use only if Hylono truly wants an accounting system rather than invoicing adjunct.
    - **Required infrastructure:** Database, mailer, storage, cron/jobs, finance process ownership.
    - **Env / secret pattern:** App URL, DB settings, app key, mail, storage, cron, and extension config.
    - **Persistence / backup requirement:** Back up DB and generated financial documents; preserve chart-of-accounts and fiscal settings carefully.
    - **Upgrade / maintenance focus:** Version, extension, and fiscal-rule changes require finance stakeholder oversight.
    - **Common failure points:** Using it where invoicing-only tooling or external accounting software would be better, and introducing license friction late.

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