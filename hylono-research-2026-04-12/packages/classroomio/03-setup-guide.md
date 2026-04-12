# ClassroomIO — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Do not prioritize without a firm educational-product requirement and fresh verification. [https://github.com/classroomio/classroomio/releases, 2026-04-12, UNVERIFIED]
    - **Deployment methods to prefer:** Self-hosting appears possible, but maturity and release/version clarity are weak compared with other tools in this stack.
    - **Required infrastructure:** Node 22+, Docker, Supabase-related tooling, and further architecture validation.
    - **Env / secret pattern:** Node, Docker, Supabase/local env config, app secrets, and deployment-specific settings.
    - **Persistence / backup requirement:** Depends on backend choice; verify architecture first.
    - **Upgrade / maintenance focus:** Project maturity and deployment support are the main concerns.
    - **Common failure points:** Implementing a less mature classroom product when simpler content/community/video tools may suffice.

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