# Redis 7 — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Moderate platform risk because it can become a hidden dependency and the licensing change affects procurement and redistribution decisions.
- **Security posture note:** Network exposure is dangerous. Use TLS or private networking, ACLs, secret rotation, and memory/eviction monitoring.
- **Maintenance hotspot:** Memory pressure review, eviction monitoring, persistence checks, replica health, and version/license review before upgrades.
- **Hidden complexity:** OOM kills, silent key eviction, unauthenticated network exposure, and using Redis as a durable queue without operational guardrails.
- **EU / GDPR / health-data relevance:** Usually stores transient operational data, but payloads may still contain personal data if queue design is sloppy. Minimize and expire sensitive values.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.