# Medplum — How It Works

## Phase B — Core architecture
- **Runtime model:** Node/TypeScript healthcare platform with database, auth, FHIR APIs, object storage, and operational services. [https://www.medplum.com/docs, 2026-04-12, current]
- **Main components:** FHIR server, auth, web app/components, storage, messaging/forms/workflows, and healthcare-specific APIs. [https://github.com/medplum/medplum/releases, 2026-04-12, v5.1.6]
- **Typical deployment model:** Self-host docs exist, but production expectations are much closer to healthcare platform operations than ordinary app deployment. [https://www.medplum.com/docs, 2026-04-12, current]
- **Runtime dependencies:** Database, storage, auth, backups, observability, security controls, and domain expertise in healthcare data.
- **Primary data stores:** Relational database plus object storage and healthcare resources.
- **Auth model:** Integrated auth/identity plus healthcare-facing access controls and APIs.
- **API / integration surface:** FHIR APIs, auth, forms, bots/hooks, and developer SDKs.
- **Operational complexity:** **High**
- **Security / compliance considerations:** This is PHI-capable infrastructure. Security, auditing, compliance, and incident readiness become central if used.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service. Keep the Hylono public site as the server-first customer surface and integrate through server-side API routes, webhooks, queued jobs, or SDKs.
- **Integration boundary:** Avoid rewriting the public site around this tool’s frontend unless the package explicitly says the tool should own that surface.
- **Blast-radius note:** Very high compliance and operational burden.