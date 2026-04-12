# Metriport — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Very high strategic mismatch.
- **Security posture note:** Potential PHI and regulated-health data. Very high governance burden.
- **Maintenance hotspot:** Connector maintenance and compliance would dominate.
- **Hidden complexity:** Confusing health-adjacent wellness operations with healthcare interoperability needs.
- **EU / GDPR / health-data relevance:** Would imply health-data handling and possibly cross-border transfer issues.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.