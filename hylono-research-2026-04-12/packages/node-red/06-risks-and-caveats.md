# Node-RED — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Moderate overlap risk, low infrastructure risk.
- **Security posture note:** Visual automation plus third-party nodes can create hidden attack surface. Restrict editor access and review nodes carefully.
- **Maintenance hotspot:** Node/plugin review, flow testing, and environment separation matter.
- **Hidden complexity:** Creating two competing automation platforms without a clear reason, or relying on community nodes without security review.
- **EU / GDPR / health-data relevance:** Mostly depends on payloads flowing through it.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.