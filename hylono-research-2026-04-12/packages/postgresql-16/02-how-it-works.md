# PostgreSQL 16 — How It Works

## Phase B — Core architecture
- **Runtime model:** Single binary database server with WAL, background maintenance, replication options, and a large extension ecosystem. [https://www.postgresql.org/about/news/postgresql-1613-1517-1422-1325-and-1229-released-3066/, 2026-04-12, 16.13]
- **Main components:** Server process, storage volume, WAL archive/backups, optional connection pooler, metrics exporter, and optional replicas. [https://www.postgresql.org/docs/release/16.13/, 2026-04-12, 16.13]
- **Typical deployment model:** Managed service for site data or dedicated self-hosted instances for app groups that need local control, extension freedom, or network isolation. [https://www.postgresql.org/about/news/postgresql-1613-1517-1422-1325-and-1229-released-3066/, 2026-04-12, 16.13]
- **Runtime dependencies:** Fast persistent storage, reliable backups, monitoring, connection pooling for higher concurrency, and disciplined schema migration workflows.
- **Primary data stores:** PostgreSQL is the datastore.
- **Auth model:** Native database roles, password or certificate auth, TLS, network controls, and application-scoped credentials.
- **API / integration surface:** SQL over standard drivers, admin tooling, logical replication, backups/restores, and exporter endpoints for monitoring.
- **Operational complexity:** **Medium**
- **Security / compliance considerations:** Tier-0 data service. Encrypt in transit, restrict network exposure, separate app credentials, test restores, and treat backup handling as a compliance control.

## Architecture interpretation for Hylono
- **Control-plane placement:** Treat this as shared infrastructure or platform control-plane. Do not fold it into the public Next.js app. Expose only the minimum required endpoints behind network controls, Kong, and SSO where relevant.
- **Integration boundary:** Integrate via environment configuration, SDKs, webhooks, exporters, or private service URLs rather than UI embedding.
- **Blast-radius note:** Low technical risk but high blast radius. Treat as a core platform dependency and isolate backups, monitoring, and access control accordingly.