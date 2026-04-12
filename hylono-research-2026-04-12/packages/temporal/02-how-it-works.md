# Temporal — How It Works

## Phase B — Core architecture
- **Runtime model:** Server cluster with history/matching/frontend services plus database and optional search. [https://docs.temporal.io/, 2026-04-12, current]
- **Main components:** Temporal server services, persistence DB, task queues/workers in application code, and visibility/search components. [https://github.com/temporalio/temporal/releases, 2026-04-12, v1.30.3]
- **Typical deployment model:** Self-host Docker/Kubernetes exists, but this is serious platform infrastructure, not a casual utility. [https://docs.temporal.io/, 2026-04-12, current]
- **Runtime dependencies:** PostgreSQL/MySQL/Cassandra depending on deployment, workers in code, monitoring, and durable queue thinking.
- **Primary data stores:** Persistence DB plus visibility/search components depending on setup.
- **Auth model:** Service auth and application-level worker/client auth patterns.
- **API / integration surface:** SDKs for workflow code, gRPC APIs, worker/task queues, and admin tooling.
- **Operational complexity:** **High**
- **Security / compliance considerations:** Workflow payloads can include sensitive business data. Access, retention, and namespace boundaries matter.

## Architecture interpretation for Hylono
- **Control-plane placement:** Treat this as shared infrastructure or platform control-plane. Do not fold it into the public Next.js app. Expose only the minimum required endpoints behind network controls, Kong, and SSO where relevant.
- **Integration boundary:** Integrate via environment configuration, SDKs, webhooks, exporters, or private service URLs rather than UI embedding.
- **Blast-radius note:** High complexity; high payoff only for the right problems.