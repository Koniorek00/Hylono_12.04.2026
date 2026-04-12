# Metriport — How It Works

## Phase B — Core architecture
- **Runtime model:** Healthcare integration platform with API services, data normalization, and provider/network connectors. [https://docs.metriport.com/, 2026-04-12, current]
- **Main components:** API layer, healthcare connectors, data normalization pipelines, and auth/integration management. [https://github.com/metriport/metriport/releases, 2026-04-12, v5.84.0 observed]
- **Typical deployment model:** Self-hosting is possible but domain-specific and compliance-heavy. [https://docs.metriport.com/, 2026-04-12, current]
- **Runtime dependencies:** Healthcare connectivity, auth, secure storage, and domain expertise.
- **Primary data stores:** Healthcare data stores and integration metadata.
- **Auth model:** API auth and healthcare-integration credential handling.
- **API / integration surface:** FHIR/C-CDA/PDF-related APIs and provider connectivity endpoints.
- **Operational complexity:** **High**
- **Security / compliance considerations:** Potential PHI and regulated-health data. Very high governance burden.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service. Keep the Hylono public site as the server-first customer surface and integrate through server-side API routes, webhooks, queued jobs, or SDKs.
- **Integration boundary:** Avoid rewriting the public site around this tool’s frontend unless the package explicitly says the tool should own that surface.
- **Blast-radius note:** Very high strategic mismatch.