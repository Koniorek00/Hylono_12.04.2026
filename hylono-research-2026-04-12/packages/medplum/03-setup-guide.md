# Medplum — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Do not implement unless Hylono makes an explicit strategic decision to handle clinical/patient-grade data with the necessary governance. [https://www.medplum.com/docs, 2026-04-12, current]
    - **Deployment methods to prefer:** Self-host docs exist, but production expectations are much closer to healthcare platform operations than ordinary app deployment.
    - **Required infrastructure:** Database, storage, auth, backups, observability, security controls, and domain expertise in healthcare data.
    - **Env / secret pattern:** DB settings, storage config, auth/domain settings, secrets, and healthcare integration configs.
    - **Persistence / backup requirement:** Back up DB and object storage with healthcare-grade recovery expectations if adopted.
    - **Upgrade / maintenance focus:** Healthcare data governance, upgrades, auditability, and domain-model correctness are the main burden.
    - **Common failure points:** Using Medplum merely because the business is health-adjacent, without true clinical-data requirements or governance readiness.

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