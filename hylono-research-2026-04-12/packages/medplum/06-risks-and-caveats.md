# Medplum — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Very high compliance and operational burden.
- **Security posture note:** This is PHI-capable infrastructure. Security, auditing, compliance, and incident readiness become central if used.
- **Maintenance hotspot:** Healthcare data governance, upgrades, auditability, and domain-model correctness are the main burden.
- **Hidden complexity:** Using Medplum merely because the business is health-adjacent, without true clinical-data requirements or governance readiness.
- **EU / GDPR / health-data relevance:** If used for health data, risk level rises sharply; GDPR plus health-data special-category rules apply.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.