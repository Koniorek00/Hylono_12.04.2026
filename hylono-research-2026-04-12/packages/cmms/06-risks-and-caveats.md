# CMMS — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Moderate due to identity ambiguity and process-design dependency.
- **Security posture note:** Operational asset data is not the highest compliance burden, but service histories and assigned personnel data still require access control.
- **Maintenance hotspot:** Preventive-maintenance cadence, data hygiene for asset/service histories, and workflow ownership matter more than raw infrastructure complexity.
- **Hidden complexity:** Using a CMMS before asset/service taxonomy is defined, or overlapping it badly with Leihs/Snipe-IT/Fleetbase.
- **EU / GDPR / health-data relevance:** Mainly operational data, but technician/user assignments can still be personal data.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.