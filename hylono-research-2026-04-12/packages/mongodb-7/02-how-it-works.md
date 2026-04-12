# MongoDB 7 — How It Works

## Phase B — Core architecture
- **Runtime model:** Single database server or replica set/sharded cluster with BSON document storage, indexes, background maintenance, and replication. [https://www.mongodb.com/docs/manual/administration/production-notes/, 2026-04-12, 7.0]
- **Main components:** mongod, optional mongos/shards, persistent storage, backups, metrics, and client libraries. [https://www.mongodb.com/docs/manual/release-notes/7.0/, 2026-04-12, 7.0]
- **Typical deployment model:** Replica set for production durability; single node only for labs or low-risk internal services. [https://www.mongodb.com/docs/manual/administration/production-notes/, 2026-04-12, 7.0]
- **Runtime dependencies:** Fast storage, memory headroom, backups, monitoring, and version-compatible drivers.
- **Primary data stores:** MongoDB is the datastore.
- **Auth model:** SCRAM/X.509, RBAC, TLS, network controls, and app-scoped users.
- **API / integration surface:** Mongo wire protocol, drivers, backup/restore tooling, metrics, and change streams in supported setups.
- **Operational complexity:** **Medium**
- **Security / compliance considerations:** Treat as a production database: TLS, private networking, least-privilege users, and backup encryption.

## Architecture interpretation for Hylono
- **Control-plane placement:** Treat this as shared infrastructure or platform control-plane. Do not fold it into the public Next.js app. Expose only the minimum required endpoints behind network controls, Kong, and SSO where relevant.
- **Integration boundary:** Integrate via environment configuration, SDKs, webhooks, exporters, or private service URLs rather than UI embedding.
- **Blast-radius note:** Moderate. Operationally manageable, but it introduces another database family into the platform.