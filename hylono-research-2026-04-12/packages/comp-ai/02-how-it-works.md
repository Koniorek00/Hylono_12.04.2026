# Comp AI — How It Works

## Phase B — Core architecture
- **Runtime model:** Web platform with database, multiple app components, and evidence/control workflows. [https://github.com/comp-ai/comp-ai/blob/main/SELF_HOSTING.md, 2026-04-12, current]
- **Main components:** Policy/control management, evidence workflows, user/admin surfaces, and integrations. [https://github.com/comp-ai/comp-ai, 2026-04-12, v1.72.2 observed]
- **Typical deployment model:** Self-host docs exist in repo; production requires careful access control and governance ownership. [https://github.com/comp-ai/comp-ai/blob/main/SELF_HOSTING.md, 2026-04-12, current]
- **Runtime dependencies:** Database, storage, auth, mail, and process owners for controls/evidence.
- **Primary data stores:** Relational database plus evidence/document storage.
- **Auth model:** Local users and likely SSO options in enterprise contexts.
- **API / integration surface:** App surfaces and integrations for evidence/control workflows.
- **Operational complexity:** **Medium to High**
- **Security / compliance considerations:** Compliance tooling handles sensitive internal evidence and control data. Access controls and auditability matter.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service. Keep the Hylono public site as the server-first customer surface and integrate through server-side API routes, webhooks, queued jobs, or SDKs.
- **Integration boundary:** Avoid rewriting the public site around this tool’s frontend unless the package explicitly says the tool should own that surface.
- **Blast-radius note:** Moderate to high process mismatch risk.