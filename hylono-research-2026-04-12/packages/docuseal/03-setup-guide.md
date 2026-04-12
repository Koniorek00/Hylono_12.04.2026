# DocuSeal — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Use official on-prem docs if DocuSeal is chosen, but compare directly against Documenso first. [https://www.docuseal.com/docs, 2026-04-12, current]
    - **Deployment methods to prefer:** Supports Docker and other on-prem patterns; operational requirements are similar to Documenso.
    - **Required infrastructure:** Database, file storage, mailer, TLS, and secret management.
    - **Env / secret pattern:** DB settings, app URL, secret keys, storage config, mail, and signing settings.
    - **Persistence / backup requirement:** Back up DB and document storage together.
    - **Upgrade / maintenance focus:** Version upgrades, mail delivery, storage integrity, and signature workflow QA matter.
    - **Common failure points:** Running two e-sign tools or assuming simplest install equals best legal/process fit.

    ## Minimum viable deployment path
    1. Deploy as a separate internal service behind TLS.
2. Integrate SSO when practical, or at minimum restrict local-admin access.
3. Connect only the minimum required data sources or APIs.
4. Pilot with internal users before exposing deeper operational reliance.

    ## Reverse proxy / gateway pattern
    - Put externally reachable services behind TLS and a deliberate boundary. For Hylono, that generally means **Kong or a simpler reverse proxy first**, with the public Next.js site remaining the customer-facing entrypoint unless the app package explicitly calls for a separate product surface.
    - Keep admin planes private or SSO-protected wherever possible.
    - Route webhooks and callback URLs through stable, documented hostnames; do not depend on local tunnels in production.

    ## Observability hooks
    - Add health checks / uptime checks in Uptime Kuma where appropriate.
    - Export metrics to Prometheus / Grafana when the app becomes operationally important.
    - Log through a centralized approach that avoids leaking secrets or unnecessary personal data.