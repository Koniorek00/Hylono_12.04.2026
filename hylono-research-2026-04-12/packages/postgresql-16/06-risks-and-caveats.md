# PostgreSQL 16 — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Low technical risk but high blast radius. Treat as a core platform dependency and isolate backups, monitoring, and access control accordingly.
- **Security posture note:** Tier-0 data service. Encrypt in transit, restrict network exposure, separate app credentials, test restores, and treat backup handling as a compliance control.
- **Maintenance hotspot:** Quarterly minor patching, vacuum/bloat review, replication monitoring, slow query visibility, and capacity checks for connection spikes.
- **Hidden complexity:** Connection exhaustion, slow disks, missing WAL retention, poor backup testing, and shared-cluster blast radius from noisy neighbors.
- **EU / GDPR / health-data relevance:** Will almost certainly hold customer and business data. EU residency, backup geography, encryption, and retention policies matter.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.