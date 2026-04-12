# Appsmith — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Moderate but very useful if governed.
- **Security posture note:** Internal tooling can become a privileged data surface. Restrict connectors, credentials, and publishing/admin rights carefully.
- **Maintenance hotspot:** Connector governance, environment separation, and role/access review matter.
- **Hidden complexity:** Letting Appsmith become an uncontrolled privileged UI over every production system.
- **EU / GDPR / health-data relevance:** Can expose personal data from many systems, so permissioning is key.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.