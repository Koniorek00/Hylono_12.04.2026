# Prometheus — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Low to moderate; essential as the stack grows.
- **Security posture note:** Metrics can expose internal topology and sensitive labels; protect endpoints and sanitize labels.
- **Maintenance hotspot:** Target discovery, alert tuning, storage sizing, and metrics cardinality control matter.
- **Hidden complexity:** Unbounded cardinality, poor alert hygiene, and exposing metrics publicly.
- **EU / GDPR / health-data relevance:** Metrics should avoid personal data labels.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.