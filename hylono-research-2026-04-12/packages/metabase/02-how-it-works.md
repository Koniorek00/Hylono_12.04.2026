# Metabase — How It Works

## Phase B — Core architecture
- **Runtime model:** Java application with metadata DB and connections to source databases/warehouses. [https://www.metabase.com/docs/latest/, 2026-04-12, v0.59.5]
- **Main components:** Web app, metadata DB, source DB connectors, dashboard/query layer, and sharing/permissions. [https://github.com/metabase/metabase/releases, 2026-04-12, v0.59.5]
- **Typical deployment model:** Self-host is mature; production needs metadata DB, SSO decisions, and data-source governance. [https://www.metabase.com/docs/latest/, 2026-04-12, v0.59.5]
- **Runtime dependencies:** Application runtime, metadata DB, source DB connectivity, reverse proxy, and optional SSO.
- **Primary data stores:** Own metadata DB plus connected source DBs (Postgres, etc.).
- **Auth model:** Local auth and SSO options depending on edition/setup.
- **API / integration surface:** REST APIs, embedding options, SQL/native query tools, and dashboard sharing.
- **Operational complexity:** **Medium**
- **Security / compliance considerations:** Direct database access and shared dashboards require careful permissions and row/table exposure decisions.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service or internal hostname. Keep it off the customer-facing surface by default. Integrate with the Next.js site via server-side APIs, webhooks, or deep links; use SSO when possible.
- **Integration boundary:** Prefer subdomain/internal-domain isolation over importing its UI into the public site.
- **Blast-radius note:** Moderate; high value if permissions are managed well.