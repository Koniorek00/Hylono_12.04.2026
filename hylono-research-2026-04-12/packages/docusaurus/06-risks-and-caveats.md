# Docusaurus — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Low infrastructure risk, moderate duplication risk.
- **Security posture note:** Mostly content/hosting security. Much lower ops burden than dynamic apps.
- **Maintenance hotspot:** Content workflows and search/indexing updates matter more than infrastructure.
- **Hidden complexity:** Creating a second frontend/docs stack without strong reason.
- **EU / GDPR / health-data relevance:** Minimal direct risk unless analytics/comment systems are added.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.