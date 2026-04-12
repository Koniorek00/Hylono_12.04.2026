# ClassroomIO — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** High maturity and ambiguity risk.
- **Security posture note:** Course/community user data and classroom interactions require standard controls.
- **Maintenance hotspot:** Project maturity and deployment support are the main concerns.
- **Hidden complexity:** Implementing a less mature classroom product when simpler content/community/video tools may suffice.
- **EU / GDPR / health-data relevance:** User/classroom data would require standard handling.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.