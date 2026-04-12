# CookieConsent — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Integrate directly into the Next.js site if a lightweight consent banner is sufficient. [https://cookieconsent.orestbida.com/, 2026-04-12, v3.1.0]
    - **Deployment methods to prefer:** Very light. Integrates directly into the existing Next.js frontend.
    - **Required infrastructure:** Frontend integration and legal/policy decisions about categories/copy.
    - **Env / secret pattern:** Frontend config values and category definitions.
    - **Persistence / backup requirement:** Consent state in browser or custom server-side logs if implemented.
    - **Upgrade / maintenance focus:** Copy/category maintenance and QA after site changes.
    - **Common failure points:** Treating a banner library as full GDPR compliance.

    ## Minimum viable deployment path
    1. Implement the library in the existing Next.js 16 site behind a narrow client boundary.
2. Gate analytics / third-party scripts based on consent categories.
3. QA SSR hydration, route transitions, localization, and existing analytics behavior.
4. Document legal copy and category decisions.

    ## Reverse proxy / gateway pattern
    - Put externally reachable services behind TLS and a deliberate boundary. For Hylono, that generally means **Kong or a simpler reverse proxy first**, with the public Next.js site remaining the customer-facing entrypoint unless the app package explicitly calls for a separate product surface.
    - Keep admin planes private or SSO-protected wherever possible.
    - Route webhooks and callback URLs through stable, documented hostnames; do not depend on local tunnels in production.

    ## Observability hooks
    - Add health checks / uptime checks in Uptime Kuma where appropriate.
    - Export metrics to Prometheus / Grafana when the app becomes operationally important.
    - Log through a centralized approach that avoids leaking secrets or unnecessary personal data.