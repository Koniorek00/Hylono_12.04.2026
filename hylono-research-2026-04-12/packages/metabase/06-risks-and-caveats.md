# Metabase — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Moderate; high value if permissions are managed well.
- **Security posture note:** Direct database access and shared dashboards require careful permissions and row/table exposure decisions.
- **Maintenance hotspot:** Upgrade metadata DB carefully, manage source permissions, and avoid uncontrolled analyst-level DB access.
- **Hidden complexity:** Connecting it to production databases with overly broad privileges, or using it to paper over poor source-of-truth design.
- **EU / GDPR / health-data relevance:** Dashboards may expose identifiable data; role-based access and minimization matter.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.