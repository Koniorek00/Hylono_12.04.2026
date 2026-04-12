# Wazuh — How It Works

## Phase B — Core architecture
- **Runtime model:** Manager/indexer/dashboard/agent architecture with significant operational footprint. [https://documentation.wazuh.com/current/, 2026-04-12, v4.14.4]
- **Main components:** Agents, manager, indexer, dashboard, rules, and security analytics pipelines. [https://github.com/wazuh/wazuh/releases, 2026-04-12, v4.14.4]
- **Typical deployment model:** Self-hostable but operationally heavy. Best introduced when there are enough systems to secure centrally. [https://documentation.wazuh.com/current/, 2026-04-12, v4.14.4]
- **Runtime dependencies:** Compute/storage, agent management, network design, rules tuning, and security operations ownership.
- **Primary data stores:** Indexer/search cluster and associated metadata.
- **Auth model:** Dashboard/admin auth and agent trust relationships.
- **API / integration surface:** Security APIs, agent communication, alerting, and dashboards.
- **Operational complexity:** **High**
- **Security / compliance considerations:** Security tooling itself becomes critical infrastructure; access and update hygiene matter.

## Architecture interpretation for Hylono
- **Control-plane placement:** Treat this as shared infrastructure or platform control-plane. Do not fold it into the public Next.js app. Expose only the minimum required endpoints behind network controls, Kong, and SSO where relevant.
- **Integration boundary:** Integrate via environment configuration, SDKs, webhooks, exporters, or private service URLs rather than UI embedding.
- **Blast-radius note:** High ops burden if premature.