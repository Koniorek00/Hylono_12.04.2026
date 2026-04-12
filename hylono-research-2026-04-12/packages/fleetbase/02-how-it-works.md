# Fleetbase — How It Works

## Phase B — Core architecture
- **Runtime model:** Laravel/PHP platform with modular extensions, database, web app, API, and infrastructure assets including Docker Compose and Helm. [https://github.com/fleetbase/fleetbase, 2026-04-12, v0.7.29]
- **Main components:** Core platform, extensions, DB, admin UI, APIs, and logistics entities such as vehicles/drivers/orders. [https://github.com/fleetbase/fleetbase/releases, 2026-04-12, v0.7.29]
- **Typical deployment model:** Self-hosting appears well-supported in repo assets (compose, Helm, Caddy). Still only justified if logistics becomes a true internal capability. [https://github.com/fleetbase/fleetbase, 2026-04-12, v0.7.29]
- **Runtime dependencies:** Database, storage, mail, reverse proxy, scheduler/jobs, mapping/tracking integrations depending on use case.
- **Primary data stores:** Relational database plus extension data.
- **Auth model:** Local roles/users and API access; verify SSO options if needed.
- **API / integration surface:** Platform APIs and extension surfaces for logistics workflows.
- **Operational complexity:** **High**
- **Security / compliance considerations:** May include driver/operator data, location data, and customer order context. Strong access control and data minimization are necessary.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service. Keep the Hylono public site as the server-first customer surface and integrate through server-side API routes, webhooks, queued jobs, or SDKs.
- **Integration boundary:** Avoid rewriting the public site around this tool’s frontend unless the package explicitly says the tool should own that surface.
- **Blast-radius note:** High redundancy risk unless logistics is core.