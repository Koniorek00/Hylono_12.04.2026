# InfluxDB — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Moderate unnecessary-complexity risk.
- **Security posture note:** Protect telemetry and auth tokens; retention and bucket policies matter.
- **Maintenance hotspot:** Cardinality, retention, storage, and query costs matter.
- **Hidden complexity:** Adding a separate timeseries database before proving its necessity.
- **EU / GDPR / health-data relevance:** Depends on telemetry content and identifiers.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.