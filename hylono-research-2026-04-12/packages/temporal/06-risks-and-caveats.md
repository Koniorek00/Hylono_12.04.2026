# Temporal — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** High complexity; high payoff only for the right problems.
- **Security posture note:** Workflow payloads can include sensitive business data. Access, retention, and namespace boundaries matter.
- **Maintenance hotspot:** Server upgrades, SDK compatibility, namespace management, and worker reliability matter.
- **Hidden complexity:** Using Temporal because it is powerful rather than because durable coded workflows are clearly needed.
- **EU / GDPR / health-data relevance:** Workflow histories may store personal data; retention and minimization matter.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.