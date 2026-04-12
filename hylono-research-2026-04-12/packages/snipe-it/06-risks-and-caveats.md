# Snipe-IT — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Low to moderate if scoped internally; poor fit if stretched into rental operations.
- **Security posture note:** Contains inventory records, user assignments, and audit data. Standard web-app hardening and backup controls are required.
- **Maintenance hotspot:** Laravel/PHP upgrades, cron reliability, import quality, and access-role review.
- **Hidden complexity:** Trying to bend it into a customer rental system, or letting asset ownership drift between Snipe-IT and other systems.
- **EU / GDPR / health-data relevance:** Mostly operational asset data, but assigned-user records still count as personal data.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.