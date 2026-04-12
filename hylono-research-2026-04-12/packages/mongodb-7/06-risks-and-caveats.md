# MongoDB 7 — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Moderate. Operationally manageable, but it introduces another database family into the platform.
- **Security posture note:** Treat as a production database: TLS, private networking, least-privilege users, and backup encryption.
- **Maintenance hotspot:** Patch within the 7.0 line, review slow queries/indexes, monitor replication lag, and capacity-plan storage.
- **Hidden complexity:** Undersized storage, replica misconfiguration, index sprawl, and using MongoDB where relational guarantees were actually needed.
- **EU / GDPR / health-data relevance:** Any personal data stored here requires the same EU residency, encryption, and retention discipline as PostgreSQL.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.