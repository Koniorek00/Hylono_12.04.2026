# PostHog — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Moderate if managed; high if self-hosted.
- **Security posture note:** Event pipelines can capture sensitive product and customer context. Data minimization and retention are essential.
- **Maintenance hotspot:** Event volume, cost/capacity, data retention, schema drift, and privacy controls dominate.
- **Hidden complexity:** Self-hosting for control without resourcing the full data/ops burden, or duplicating analytics across multiple tools.
- **EU / GDPR / health-data relevance:** Analytics data is personal data when identifiable. IP/session replay/feature flags all require careful governance.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.