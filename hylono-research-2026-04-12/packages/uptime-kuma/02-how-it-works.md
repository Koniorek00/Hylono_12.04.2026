# Uptime Kuma — How It Works

## Phase B — Core architecture
- **Runtime model:** Node.js application with local/attached storage and outbound notification integrations. [https://github.com/louislam/uptime-kuma, 2026-04-12, 2.2.1]
- **Main components:** Web UI, monitor definitions, notification channels, persistent storage, and optional public status page. [https://github.com/louislam/uptime-kuma/releases, 2026-04-12, 2.2.1]
- **Typical deployment model:** Docker is the normal path; single-node deployment is common. [https://github.com/louislam/uptime-kuma, 2026-04-12, 2.2.1]
- **Runtime dependencies:** Persistent volume, outbound notification channel, reverse proxy, and backup of monitor configuration.
- **Primary data stores:** Internal application storage (SQLite or configured database depending on deployment mode).
- **Auth model:** Local users; protect with reverse proxy/TLS and strong credentials.
- **API / integration surface:** HTTP checks, notifications, status page URLs, and import/export features.
- **Operational complexity:** **Low**
- **Security / compliance considerations:** Keep the admin UI private, patch regularly, and avoid exposing internal-only endpoints publicly through status pages.

## Architecture interpretation for Hylono
- **Control-plane placement:** Treat this as shared infrastructure or platform control-plane. Do not fold it into the public Next.js app. Expose only the minimum required endpoints behind network controls, Kong, and SSO where relevant.
- **Integration boundary:** Integrate via environment configuration, SDKs, webhooks, exporters, or private service URLs rather than UI embedding.
- **Blast-radius note:** Low. Lightweight and easy to replace if observability matures.