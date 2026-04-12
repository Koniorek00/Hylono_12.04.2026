# MinIO — How It Works

## Phase B — Core architecture
- **Runtime model:** Distributed or single-node object storage service with S3 API compatibility, erasure coding, and policy controls. [https://github.com/minio/minio/releases, 2026-04-12, latest observed community release]
- **Main components:** Storage nodes, TLS, access policies, buckets, backup/replication design, and monitoring. [https://min.io/, 2026-04-12, current]
- **Typical deployment model:** Historically container- or Kubernetes-friendly; current official guidance is centered on AIStor and its operator/helm-based patterns. [https://github.com/minio/minio/releases, 2026-04-12, latest observed community release]
- **Runtime dependencies:** Durable disks, network throughput, TLS, backup/replication design, S3-compatible client validation.
- **Primary data stores:** Object data on disk; metadata managed by the service.
- **Auth model:** Access keys, policies, TLS, and admin controls.
- **API / integration surface:** S3-compatible API, console/admin endpoints, replication and lifecycle features.
- **Operational complexity:** **Medium to High**
- **Security / compliance considerations:** Object storage becomes a central data plane. Misconfigured buckets, replication, or lifecycle rules create serious exposure.

## Architecture interpretation for Hylono
- **Control-plane placement:** Treat this as shared infrastructure or platform control-plane. Do not fold it into the public Next.js app. Expose only the minimum required endpoints behind network controls, Kong, and SSO where relevant.
- **Integration boundary:** Integrate via environment configuration, SDKs, webhooks, exporters, or private service URLs rather than UI embedding.
- **Blast-radius note:** High strategic risk for new adoption because of the apparent community/archive/commercial shift.