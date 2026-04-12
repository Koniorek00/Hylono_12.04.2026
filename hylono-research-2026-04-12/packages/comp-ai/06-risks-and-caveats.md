# Comp AI — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Moderate to high process mismatch risk.
- **Security posture note:** Compliance tooling handles sensitive internal evidence and control data. Access controls and auditability matter.
- **Maintenance hotspot:** Framework upkeep, evidence lifecycle, and integration maintenance matter more than deployment.
- **Hidden complexity:** Deploying compliance software before the organization is ready to operate a real compliance program.
- **EU / GDPR / health-data relevance:** Mostly internal governance data, but may contain sensitive evidence and access data.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.