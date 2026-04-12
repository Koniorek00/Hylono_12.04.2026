# n8n — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Moderate. Huge leverage, but it can create invisible technical debt if not governed.
- **Security posture note:** Extremely powerful blast radius. Protect credentials, isolate environments, restrict who can edit workflows, and avoid sensitive payload sprawl in executions.
- **Maintenance hotspot:** Webhook delivery, failed execution handling, credential rotation, workflow versioning, and worker scaling.
- **Hidden complexity:** Using it as an ungoverned shadow backend, leaking secrets into workflow nodes, and failing to test webhook callbacks end to end.
- **EU / GDPR / health-data relevance:** Workflow payloads can capture personal data. Apply retention controls, redact where possible, and choose EU-hosted deployment.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.