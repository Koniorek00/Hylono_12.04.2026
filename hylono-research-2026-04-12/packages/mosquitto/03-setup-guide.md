# Mosquitto — Setup Guide

    ## Phase C — Official setup path
    - **Recommended setup path:** Deploy only as part of a confirmed MQTT/device architecture, likely with Node-RED/ThingsBoard/InfluxDB. [https://mosquitto.org/documentation/, 2026-04-12, v2.1.2]
    - **Deployment methods to prefer:** Easy to self-host; governance comes from what devices/flows depend on it.
    - **Required infrastructure:** Persistent storage if durable sessions/messages matter, TLS certs, auth, and client governance.
    - **Env / secret pattern:** Listener ports, persistence, ACLs, TLS certs, bridge config, and auth files.
    - **Persistence / backup requirement:** Back up config and persistence store if using durable state.
    - **Upgrade / maintenance focus:** Client ACLs, connection monitoring, TLS, and broker uptime matter.
    - **Common failure points:** Introducing MQTT infrastructure without an actual MQTT use case.

    ## Minimum viable deployment path
    1. Provision the service on isolated infrastructure or a dedicated shared platform host.
2. Store secrets in Infisical or equivalent; put public or admin ingress behind Kong / private networking as appropriate.
3. Add backups / exporters / health checks before broader rollout.
4. Integrate one real dependent service first, then scale usage.

    ## Reverse proxy / gateway pattern
    - Put externally reachable services behind TLS and a deliberate boundary. For Hylono, that generally means **Kong or a simpler reverse proxy first**, with the public Next.js site remaining the customer-facing entrypoint unless the app package explicitly calls for a separate product surface.
    - Keep admin planes private or SSO-protected wherever possible.
    - Route webhooks and callback URLs through stable, documented hostnames; do not depend on local tunnels in production.

    ## Observability hooks
    - Add health checks / uptime checks in Uptime Kuma where appropriate.
    - Export metrics to Prometheus / Grafana when the app becomes operationally important.
    - Log through a centralized approach that avoids leaking secrets or unnecessary personal data.