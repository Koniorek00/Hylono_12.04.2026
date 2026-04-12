# MongoDB 7 — Overview

## Snapshot
- Environment context: **Infrastructure / RUNNING**
- Researched as: **MongoDB 7 major line**
- Current version researched: **7.0.x (7.0.31 observed in secondary release tracking)** — **CONFIRMED line / point release partly UNVERIFIED** [https://www.mongodb.com/docs/manual/release-notes/7.0/, 2026-04-12, 7.0]
- License posture: **SSPL** — **CONFIRMED** [https://www.mongodb.com/docs/manual/administration/production-notes/, 2026-04-12, 7.0]
- Recommended timing: **KEEP FOR REQUIRED APPS ONLY**
- Maintenance burden: **Medium**
- Risk level: **Medium**

## Phase A — App identity
- **What it is:** Document database for flexible JSON-like data models, high-ingest workloads, and applications that expect MongoDB specifically. [https://www.mongodb.com/docs/manual/administration/production-notes/, 2026-04-12, 7.0]
- **What it solves:** Schema-flexible application data, event capture, content documents, and vendor apps that are built around MongoDB. [https://www.mongodb.com/docs/manual/release-notes/7.0/, 2026-04-12, 7.0]
- **Best-fit users:** Engineering teams and packaged applications that prefer document-oriented models or require MongoDB for supportability. [https://www.mongodb.com/docs/manual/administration/production-notes/, 2026-04-12, 7.0]
- **Where it fits in a modern stack:** Selective fit. Hylono’s primary site stack is more naturally PostgreSQL-centric, but MongoDB remains relevant because Novu and some app ecosystems expect it. [https://github.com/mongodb/mongo/releases, 2026-04-12, 7.0.x]

## Hylono fit snapshot
- **Business usefulness:** Most relevant as a dependency for Novu or any app that is explicitly Mongo-first. It should not become the default datastore for the Hylono web platform. [https://www.mongodb.com/docs/manual/release-notes/7.0/, 2026-04-12, 7.0]
- **Overlap watch:** Partial overlap with PostgreSQL for general application storage, but not a replacement for Mongo-dependent apps.
- **Must verify before implementation:** Confirm which apps truly require MongoDB and whether those should run in isolated clusters instead of sharing with unrelated workloads.