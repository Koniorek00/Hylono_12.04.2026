# Redis 7 — How It Works

## Phase B — Core architecture
- **Runtime model:** Single process server with persistence options, replication/sentinel/cluster modes, and multiple data structures including lists, streams, and sorted sets. [https://github.com/redis/redis/releases, 2026-04-12, 7.4.8 observed]
- **Main components:** Redis server, persistent volume if AOF/RDB enabled, optional sentinel/cluster peers, application clients, and observability hooks. [https://redis.io/legal/licenses/, 2026-04-12, 7.x/8.x]
- **Typical deployment model:** Single-node with persistence for smaller app clusters; HA or managed equivalent only when justified by queue criticality and recovery targets. [https://github.com/redis/redis/releases, 2026-04-12, 7.4.8 observed]
- **Runtime dependencies:** RAM headroom, persistent storage if durability matters, monitoring, auth/TLS, and app-level retry logic.
- **Primary data stores:** Redis is the datastore; often paired with PostgreSQL or MongoDB.
- **Auth model:** ACLs, passwords, TLS, network segmentation, and client-specific credentials.
- **API / integration surface:** RESP protocol, libraries, pub/sub, streams, queues, and exporter metrics.
- **Operational complexity:** **Medium**
- **Security / compliance considerations:** Network exposure is dangerous. Use TLS or private networking, ACLs, secret rotation, and memory/eviction monitoring.

## Architecture interpretation for Hylono
- **Control-plane placement:** Treat this as shared infrastructure or platform control-plane. Do not fold it into the public Next.js app. Expose only the minimum required endpoints behind network controls, Kong, and SSO where relevant.
- **Integration boundary:** Integrate via environment configuration, SDKs, webhooks, exporters, or private service URLs rather than UI embedding.
- **Blast-radius note:** Moderate platform risk because it can become a hidden dependency and the licensing change affects procurement and redistribution decisions.