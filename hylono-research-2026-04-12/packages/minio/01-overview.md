# MinIO — Overview

## Snapshot
- Environment context: **Infrastructure / UNKNOWN**
- Researched as: **MinIO object storage**
- Current version researched: **Community repo archived; AIStor docs active** — **CONFIRMED strategic change / exact CE status requires human review** [https://min.io/, 2026-04-12, current]
- License posture: **Historically AGPLv3 for community code; current AIStor materials emphasize commercial licensing** — **CONFIRMED strategic licensing shift / exact packaging requires human review** [https://github.com/minio/minio/releases, 2026-04-12, latest observed community release]
- Recommended timing: **DO NOT EXPAND UNTIL PRODUCT/LICENSE DIRECTION IS DECIDED**
- Maintenance burden: **High**
- Risk level: **High**

## Phase A — App identity
- **What it is:** S3-compatible object storage previously common in self-hosted stacks for files, backups, and media. [https://github.com/minio/minio/releases, 2026-04-12, latest observed community release]
- **What it solves:** Internal object storage for uploads, documents, backups, artifacts, and application binary payloads. [https://min.io/, 2026-04-12, current]
- **Best-fit users:** Infrastructure teams that need S3-compatible storage under their own control. [https://github.com/minio/minio/releases, 2026-04-12, latest observed community release]
- **Where it fits in a modern stack:** Technically useful, but strategically risky for new standardization because the public community repo appears archived and the official site/docs now center on commercial AIStor. [https://docs.min.io/, 2026-04-12, current]

## Hylono fit snapshot
- **Business usefulness:** Would be useful for Documenso/DocuSeal documents, Medusa assets, Listmonk media, backups, and possibly Next.js uploads—but only after the product/licensing direction is settled. [https://min.io/, 2026-04-12, current]
- **Overlap watch:** Can be replaced by managed S3-compatible storage or alternative self-hosted object stores.
- **Must verify before implementation:** Verify whether Hylono already uses MinIO, whether that deployment is supportable, and whether a different object storage platform is preferable for new rollout work.