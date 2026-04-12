# CookieConsent — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Low.
- **Security posture note:** Main concern is legal/config correctness, not infrastructure.
- **Maintenance hotspot:** Copy/category maintenance and QA after site changes.
- **Hidden complexity:** Treating a banner library as full GDPR compliance.
- **EU / GDPR / health-data relevance:** Relevant for consent UX, but only one piece of compliance.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.