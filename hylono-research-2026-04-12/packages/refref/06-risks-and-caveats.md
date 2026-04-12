# RefRef — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** High maturity risk.
- **Security posture note:** Contains participant/contact and reward data. Program abuse prevention also matters.
- **Maintenance hotspot:** Program abuse handling, reward reconciliation, and upstream breaking changes are the main risks.
- **Hidden complexity:** Assuming alpha software is ready for customer-facing programs without additional hardening.
- **EU / GDPR / health-data relevance:** Participant and referral-contact data require standard privacy controls.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.