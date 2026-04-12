# BigBlueButton — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** High ops burden.
- **Security posture note:** Media, recordings, guest access, and public meeting surfaces require strong operational discipline.
- **Maintenance hotspot:** Capacity planning, upgrades, TURN/STUN, recording management, and live-ops support are significant.
- **Hidden complexity:** Underestimating media ops and using BBB when lighter meeting tooling would suffice.
- **EU / GDPR / health-data relevance:** Recordings and participant data are privacy-sensitive. Retention and consent are critical.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.