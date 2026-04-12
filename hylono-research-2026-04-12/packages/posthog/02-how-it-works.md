# PostHog — How It Works

## Phase B — Core architecture
- **Runtime model:** Large multi-service application with ClickHouse, PostgreSQL, Redis, object storage, workers/plugins, and optional extensive event ingestion. [https://github.com/PostHog/posthog, 2026-04-12, current]
- **Main components:** Web app, plugin server, event ingestion, ClickHouse, PostgreSQL, Redis, object storage, workers, and analytics features. [https://posthog.com/docs/self-host, 2026-04-12, current]
- **Typical deployment model:** Operationally heavy self-hosting. Official docs emphasize hobby/beta self-host paths and recommend cloud for most users. [https://github.com/PostHog/posthog, 2026-04-12, current]
- **Runtime dependencies:** ClickHouse, PostgreSQL, Redis, object storage, background workers, secure ingress, and capacity planning.
- **Primary data stores:** ClickHouse, PostgreSQL, Redis, object storage.
- **Auth model:** Built-in auth/org/project model plus data access controls and API keys.
- **API / integration surface:** Analytics SDKs, APIs, feature flags, data exports, and plugin/event surfaces.
- **Operational complexity:** **High**
- **Security / compliance considerations:** Event pipelines can capture sensitive product and customer context. Data minimization and retention are essential.

## Architecture interpretation for Hylono
- **Control-plane placement:** Treat this as shared infrastructure or platform control-plane. Do not fold it into the public Next.js app. Expose only the minimum required endpoints behind network controls, Kong, and SSO where relevant.
- **Integration boundary:** Integrate via environment configuration, SDKs, webhooks, exporters, or private service URLs rather than UI embedding.
- **Blast-radius note:** Moderate if managed; high if self-hosted.