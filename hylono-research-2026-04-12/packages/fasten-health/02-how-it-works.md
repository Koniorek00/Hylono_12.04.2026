# Fasten Health — How It Works

## Phase B — Core architecture
- **Runtime model:** Self-hosted consumer app with healthcare account connectors and record storage. [https://github.com/fastenhealth/fasten-onprem, 2026-04-12, v1.1.x]
- **Main components:** Web app, data import/connectors, storage, auth, and personal-record management. [https://github.com/fastenhealth/fasten-onprem/releases, 2026-04-12, v1.1.3 observed]
- **Typical deployment model:** Self-hostable, but strategic value for Hylono is low unless the business moves into patient-controlled records. [https://github.com/fastenhealth/fasten-onprem, 2026-04-12, v1.1.x]
- **Runtime dependencies:** Storage, auth, healthcare connectors, and data persistence.
- **Primary data stores:** App database/storage for records.
- **Auth model:** End-user account model.
- **API / integration surface:** Consumer-focused import/connectivity surfaces; not a strong business integration target here.
- **Operational complexity:** **Medium**
- **Security / compliance considerations:** Health records are highly sensitive. Not appropriate to introduce casually in a health-adjacent business stack.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service. Keep the Hylono public site as the server-first customer surface and integrate through server-side API routes, webhooks, queued jobs, or SDKs.
- **Integration boundary:** Avoid rewriting the public site around this tool’s frontend unless the package explicitly says the tool should own that surface.
- **Blast-radius note:** High strategic mismatch.