# Mosquitto — How It Works

## Phase B — Core architecture
- **Runtime model:** Single broker service with ACLs, bridges, persistence, and TLS. [https://mosquitto.org/documentation/, 2026-04-12, v2.1.2]
- **Main components:** Broker, config, persistence store, ACLs/auth, and optional bridges. [https://github.com/eclipse-mosquitto/mosquitto/releases, 2026-04-12, v2.1.2]
- **Typical deployment model:** Easy to self-host; governance comes from what devices/flows depend on it. [https://mosquitto.org/documentation/, 2026-04-12, v2.1.2]
- **Runtime dependencies:** Persistent storage if durable sessions/messages matter, TLS certs, auth, and client governance.
- **Primary data stores:** Broker persistence files if enabled.
- **Auth model:** Passwords, ACLs, certificates, and plugin-based auth patterns.
- **API / integration surface:** MQTT protocol and broker admin/config surfaces.
- **Operational complexity:** **Low to Medium**
- **Security / compliance considerations:** Broker exposure is risky. Use TLS, ACLs, and network isolation.

## Architecture interpretation for Hylono
- **Control-plane placement:** Treat this as shared infrastructure or platform control-plane. Do not fold it into the public Next.js app. Expose only the minimum required endpoints behind network controls, Kong, and SSO where relevant.
- **Integration boundary:** Integrate via environment configuration, SDKs, webhooks, exporters, or private service URLs rather than UI embedding.
- **Blast-radius note:** Low infrastructure risk, high unnecessary-complexity risk if premature.