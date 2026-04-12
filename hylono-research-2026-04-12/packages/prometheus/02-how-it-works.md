# Prometheus — How It Works

## Phase B — Core architecture
- **Runtime model:** Single binary/server with TSDB, scrape configs, service discovery, and alert rules. [https://prometheus.io/docs/introduction/overview/, 2026-04-12, v3.11.1]
- **Main components:** Prometheus server, exporters, alerting rules, and usually Alertmanager/Grafana around it. [https://github.com/prometheus/prometheus/releases, 2026-04-12, v3.11.1]
- **Typical deployment model:** Straightforward container/Kubernetes deployment. Design scrape targets and retention deliberately. [https://prometheus.io/docs/introduction/overview/, 2026-04-12, v3.11.1]
- **Runtime dependencies:** Persistent storage, exporters, service discovery config, and alert routing.
- **Primary data stores:** Prometheus local TSDB plus remote-write options if needed.
- **Auth model:** Usually protected behind network/reverse proxy; core Prometheus auth is limited.
- **API / integration surface:** PromQL, HTTP APIs, scrape endpoints, federation, and remote write/read.
- **Operational complexity:** **Medium**
- **Security / compliance considerations:** Metrics can expose internal topology and sensitive labels; protect endpoints and sanitize labels.

## Architecture interpretation for Hylono
- **Control-plane placement:** Treat this as shared infrastructure or platform control-plane. Do not fold it into the public Next.js app. Expose only the minimum required endpoints behind network controls, Kong, and SSO where relevant.
- **Integration boundary:** Integrate via environment configuration, SDKs, webhooks, exporters, or private service URLs rather than UI embedding.
- **Blast-radius note:** Low to moderate; essential as the stack grows.