# InfluxDB — How It Works

## Phase B — Core architecture
- **Runtime model:** Time-series database server with query engines and data ingest paths. [https://github.com/influxdata/influxdb, 2026-04-12, 3.9.0]
- **Main components:** DB engine, storage, query/API layer, and ingestion endpoints. [https://docs.influxdata.com/influxdb3/core/, 2026-04-12, 3.9.0]
- **Typical deployment model:** Self-host is feasible; choose only when a clear timeseries need exists. [https://github.com/influxdata/influxdb, 2026-04-12, 3.9.0]
- **Runtime dependencies:** Persistent storage, ingest clients, and query/retention planning.
- **Primary data stores:** InfluxDB itself.
- **Auth model:** Tokens/users/org/bucket access controls.
- **API / integration surface:** Write APIs, query APIs, CLI, and integrations.
- **Operational complexity:** **Medium**
- **Security / compliance considerations:** Protect telemetry and auth tokens; retention and bucket policies matter.

## Architecture interpretation for Hylono
- **Control-plane placement:** Treat this as shared infrastructure or platform control-plane. Do not fold it into the public Next.js app. Expose only the minimum required endpoints behind network controls, Kong, and SSO where relevant.
- **Integration boundary:** Integrate via environment configuration, SDKs, webhooks, exporters, or private service URLs rather than UI embedding.
- **Blast-radius note:** Moderate unnecessary-complexity risk.