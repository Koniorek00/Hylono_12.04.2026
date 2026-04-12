# Grafana — How It Works

## Phase B — Core architecture
- **Runtime model:** Web application with internal metadata DB and connectors to data sources like Prometheus, Loki, InfluxDB, PostgreSQL, etc. [https://grafana.com/docs/grafana/latest/, 2026-04-12, 12.4.2]
- **Main components:** UI, datasource plugins, alerting, dashboards, auth, and metadata store. [https://github.com/grafana/grafana/releases, 2026-04-12, 12.4.2]
- **Typical deployment model:** Straightforward self-hosting; usually paired with Prometheus and exporters. [https://grafana.com/docs/grafana/latest/, 2026-04-12, 12.4.2]
- **Runtime dependencies:** Metadata storage, data-source connectors, auth/SSO, reverse proxy, and alerting config.
- **Primary data stores:** Internal metadata store plus external data sources.
- **Auth model:** Local auth and SSO/OIDC/SAML options depending on edition/setup.
- **API / integration surface:** Dashboard and datasource APIs, plugins, and alerting APIs.
- **Operational complexity:** **Medium**
- **Security / compliance considerations:** Dashboards can expose internal service data. Use RBAC and least-privilege datasource access.

## Architecture interpretation for Hylono
- **Control-plane placement:** Treat this as shared infrastructure or platform control-plane. Do not fold it into the public Next.js app. Expose only the minimum required endpoints behind network controls, Kong, and SSO where relevant.
- **Integration boundary:** Integrate via environment configuration, SDKs, webhooks, exporters, or private service URLs rather than UI embedding.
- **Blast-radius note:** Low to moderate; high value.