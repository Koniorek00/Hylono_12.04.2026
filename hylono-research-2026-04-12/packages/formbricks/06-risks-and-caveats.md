# Formbricks — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Low to moderate.
- **Security posture note:** Survey responses may contain personal or sensitive health-adjacent feedback. Scope surveys carefully.
- **Maintenance hotspot:** Survey targeting, consent/context, and response analysis ownership matter.
- **Hidden complexity:** Using it to collect sensitive health-like data without proper framing and governance.
- **EU / GDPR / health-data relevance:** Survey responses can become personal data or special-category adjacent depending on questions.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.