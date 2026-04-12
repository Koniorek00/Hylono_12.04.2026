# n8n — How It Works

## Phase B — Core architecture
- **Runtime model:** Node.js automation platform with workflow engine, database, workers/queue mode, webhook ingestion, and credentials store. [https://github.com/n8n-io/n8n/releases, 2026-04-12, 2.15.1]
- **Main components:** Editor/UI, execution engine, DB, optional queue workers, Redis for queue mode, webhooks, credentials store, and integrations/nodes. [https://docs.n8n.io/, 2026-04-12, 2.15.1]
- **Typical deployment model:** Docker is standard; production may use queue mode with Redis, separate workers, persistent database, and public webhook reachability. [https://github.com/n8n-io/n8n/releases, 2026-04-12, 2.15.1]
- **Runtime dependencies:** Database, optional Redis for queue mode, webhook ingress, mail/notifications, secrets handling, and storage for binary data if used.
- **Primary data stores:** Database for workflows/executions plus optional Redis for queue mode.
- **Auth model:** Built-in user auth, API keys, credential vaulting inside n8n, and webhook auth patterns.
- **API / integration surface:** REST API, webhook triggers, MCP trigger, hundreds of nodes/connectors, and import/export of workflows.
- **Operational complexity:** **Medium**
- **Security / compliance considerations:** Extremely powerful blast radius. Protect credentials, isolate environments, restrict who can edit workflows, and avoid sensitive payload sprawl in executions.

## Architecture interpretation for Hylono
- **Control-plane placement:** Treat this as shared infrastructure or platform control-plane. Do not fold it into the public Next.js app. Expose only the minimum required endpoints behind network controls, Kong, and SSO where relevant.
- **Integration boundary:** Integrate via environment configuration, SDKs, webhooks, exporters, or private service URLs rather than UI embedding.
- **Blast-radius note:** Moderate. Huge leverage, but it can create invisible technical debt if not governed.