# Kong — How It Works

## Phase B — Core architecture
- **Runtime model:** Nginx/OpenResty-based gateway with PostgreSQL-backed config or DB-less mode plus plugin ecosystem. [https://github.com/Kong/kong/releases, 2026-04-12, 3.14.0.1]
- **Main components:** Gateway nodes, config store/DB, plugins, admin APIs, declarative config, and observability outputs. [https://docs.konghq.com/gateway/latest/, 2026-04-12, 3.14.0.1]
- **Typical deployment model:** Docker Compose or Kubernetes are common. PostgreSQL-backed mode is practical when plugin/state features are needed. [https://github.com/Kong/kong/releases, 2026-04-12, 3.14.0.1]
- **Runtime dependencies:** PostgreSQL for DB-backed mode, reverse proxy/TLS, plugin config, monitoring, and careful route/policy design.
- **Primary data stores:** PostgreSQL in DB-backed mode, or declarative config in DB-less mode.
- **Auth model:** OIDC, JWT, key auth, ACLs, mTLS, and many plugin-based patterns.
- **API / integration surface:** Admin API, gateway routes/services/plugins, declarative config, metrics, and plugin ecosystem.
- **Operational complexity:** **Medium to High**
- **Security / compliance considerations:** High leverage security boundary. Misconfiguration can expose services or break auth globally.

## Architecture interpretation for Hylono
- **Control-plane placement:** Treat this as shared infrastructure or platform control-plane. Do not fold it into the public Next.js app. Expose only the minimum required endpoints behind network controls, Kong, and SSO where relevant.
- **Integration boundary:** Integrate via environment configuration, SDKs, webhooks, exporters, or private service URLs rather than UI embedding.
- **Blast-radius note:** Moderate but foundationally useful.