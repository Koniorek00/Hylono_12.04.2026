# ThingsBoard — How It Works

## Phase B — Core architecture
- **Runtime model:** Java/microservice-style platform with DB, message broker options, telemetry ingestion, and dashboards. [https://thingsboard.io/docs/, 2026-04-12, current]
- **Main components:** Transport/connectivity layer, rule engine, dashboards, device registry, and storage integrations. [https://github.com/thingsboard/thingsboard/releases, 2026-04-12, v4.3.1.1]
- **Typical deployment model:** Self-hosting is mature but operationally meaningful. Production architecture should match actual device scale. [https://thingsboard.io/docs/, 2026-04-12, current]
- **Runtime dependencies:** Databases, brokers/queues, storage, and device/MQTT connectivity.
- **Primary data stores:** PostgreSQL/Cassandra/Timeseries integrations depending on setup; verify chosen architecture carefully.
- **Auth model:** Users, tenants, customers, and device credentials/tokens.
- **API / integration surface:** MQTT/HTTP/CoAP device APIs, REST APIs, dashboards, and rule-chain integrations.
- **Operational complexity:** **High**
- **Security / compliance considerations:** Connected devices and telemetry can create large attack surface and sensitive operational data exposure.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service. Keep the Hylono public site as the server-first customer surface and integrate through server-side API routes, webhooks, queued jobs, or SDKs.
- **Integration boundary:** Avoid rewriting the public site around this tool’s frontend unless the package explicitly says the tool should own that surface.
- **Blast-radius note:** High complexity with uncertain immediate value.