# Retraced — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Moderate maturity risk.
- **Security posture note:** Audit logs are sensitive and can themselves contain personal or security-relevant details.
- **Maintenance hotspot:** Instrumentation coverage, retention, and access review matter most.
- **Hidden complexity:** Adding a separate audit system without actually instrumenting the important actions.
- **EU / GDPR / health-data relevance:** Audit logs can contain identifiers; retention and access must be controlled.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.