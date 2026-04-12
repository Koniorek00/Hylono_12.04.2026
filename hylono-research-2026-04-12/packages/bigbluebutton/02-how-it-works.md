# BigBlueButton — How It Works

## Phase B — Core architecture
- **Runtime model:** Multi-service stack on dedicated Ubuntu with media services, TURN/STUN, recordings, and web application components. [https://docs.bigbluebutton.org/administration/install, 2026-04-12, v3.0.x]
- **Main components:** Web app, SFU/media services, recording stack, Redis/DB/services, TURN/STUN, and optional integrations. [https://github.com/bigbluebutton/bigbluebutton/releases, 2026-04-12, v3.0.23]
- **Typical deployment model:** Officially prefers a clean dedicated Ubuntu server. This is not a casual sidecar deployment. [https://docs.bigbluebutton.org/administration/install, 2026-04-12, v3.0.x]
- **Runtime dependencies:** Dedicated compute, bandwidth, TURN/STUN, storage for recordings, TLS, and careful capacity planning.
- **Primary data stores:** Application services with DB/storage and recording artifacts.
- **Auth model:** Meeting/user roles and integrations with external systems/LMS/auth depending on deployment.
- **API / integration surface:** Meeting APIs, recordings, integrations, and web conferencing endpoints.
- **Operational complexity:** **High**
- **Security / compliance considerations:** Media, recordings, guest access, and public meeting surfaces require strong operational discipline.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service. Keep the Hylono public site as the server-first customer surface and integrate through server-side API routes, webhooks, queued jobs, or SDKs.
- **Integration boundary:** Avoid rewriting the public site around this tool’s frontend unless the package explicitly says the tool should own that surface.
- **Blast-radius note:** High ops burden.