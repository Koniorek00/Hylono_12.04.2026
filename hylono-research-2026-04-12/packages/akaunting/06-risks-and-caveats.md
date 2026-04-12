# Akaunting — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Moderate with high redundancy risk.
- **Security posture note:** Financial and accounting records create governance obligations beyond ordinary app data.
- **Maintenance hotspot:** Version, extension, and fiscal-rule changes require finance stakeholder oversight.
- **Hidden complexity:** Using it where invoicing-only tooling or external accounting software would be better, and introducing license friction late.
- **EU / GDPR / health-data relevance:** Contains customer and financial records.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.