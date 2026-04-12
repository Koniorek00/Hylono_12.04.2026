# Leihs — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Moderate. Best functional fit for rentals, but likely needs adaptation work and careful UX/process mapping.
- **Security posture note:** Reservation histories and user assignments may include personal data. Access control and auditability matter for rental operations.
- **Maintenance hotspot:** User role mapping, reservation policy tuning, upgrade testing, and reporting/export checks.
- **Hidden complexity:** Underestimating workflow adaptation, ignoring customer-facing UX requirements, and assuming institutional defaults match premium commercial rental operations.
- **EU / GDPR / health-data relevance:** Contains identifiable booking and equipment assignment data; EU hosting is a positive fit if deployed carefully.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.