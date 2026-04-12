# Retraced — How It Works

## Phase B — Core architecture
- **Runtime model:** Service/API with storage backend and query/report surfaces. [https://github.com/retracedhq/retraced, 2026-04-12, v1.13.1]
- **Main components:** Audit ingestion API, storage, query UI/APIs, and deployment manifests including Kubernetes references. [https://github.com/retracedhq/retraced/releases, 2026-04-12, v1.13.1]
- **Typical deployment model:** Can be self-hosted, but project cadence looks quieter than some alternatives. Maturity and maintenance should be revalidated before adoption. [https://github.com/retracedhq/retraced, 2026-04-12, v1.13.1]
- **Runtime dependencies:** Database/storage, API ingress, app instrumentation, and auth/access controls.
- **Primary data stores:** Relational or attached storage depending on deployment.
- **Auth model:** Admin/service auth and API keys.
- **API / integration surface:** Audit log ingestion and query APIs.
- **Operational complexity:** **Medium**
- **Security / compliance considerations:** Audit logs are sensitive and can themselves contain personal or security-relevant details.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service. Keep the Hylono public site as the server-first customer surface and integrate through server-side API routes, webhooks, queued jobs, or SDKs.
- **Integration boundary:** Avoid rewriting the public site around this tool’s frontend unless the package explicitly says the tool should own that surface.
- **Blast-radius note:** Moderate maturity risk.