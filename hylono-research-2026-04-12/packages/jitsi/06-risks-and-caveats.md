# Jitsi — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Moderate.
- **Security posture note:** Meeting access, media traffic, recording storage, and public exposure need careful configuration.
- **Maintenance hotspot:** Capacity, NAT/TURN, upgrades, and meeting-access controls matter.
- **Hidden complexity:** Underestimating media ops or exposing meetings without proper auth.
- **EU / GDPR / health-data relevance:** Calls and recordings can be sensitive; consent and retention matter.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.