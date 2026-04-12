# Node-RED — How It Works

## Phase B — Core architecture
- **Runtime model:** Node.js runtime hosting flows, connectors, dashboards (if used), and integration nodes. [https://nodered.org/docs/, 2026-04-12, 4.1.8]
- **Main components:** Editor/runtime, flows, nodes/plugins, optional dashboard/UI, and persistence for flow definitions. [https://github.com/node-red/node-red/releases, 2026-04-12, 4.1.8]
- **Typical deployment model:** Docker or simple service deployment is straightforward. Governance matters more than install. [https://nodered.org/docs/, 2026-04-12, 4.1.8]
- **Runtime dependencies:** Persistent storage for flows, broker/API endpoints, optional MQTT, and plugin/node governance.
- **Primary data stores:** Local flow storage or attached storage; optional external systems for state.
- **Auth model:** Admin auth, node credentials, and network/proxy protection.
- **API / integration surface:** HTTP endpoints, MQTT, industrial/IoT protocols, and extensive node ecosystem.
- **Operational complexity:** **Low to Medium**
- **Security / compliance considerations:** Visual automation plus third-party nodes can create hidden attack surface. Restrict editor access and review nodes carefully.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service. Keep the Hylono public site as the server-first customer surface and integrate through server-side API routes, webhooks, queued jobs, or SDKs.
- **Integration boundary:** Avoid rewriting the public site around this tool’s frontend unless the package explicitly says the tool should own that surface.
- **Blast-radius note:** Moderate overlap risk, low infrastructure risk.