# Presidio — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Low to moderate; mostly a usefulness question.
- **Security posture note:** Useful for reducing privacy exposure, but should not be mistaken for complete governance or compliance tooling.
- **Maintenance hotspot:** Model quality tuning, false positive/negative review, and service versioning matter.
- **Hidden complexity:** Assuming out-of-the-box recognizers fully match multilingual or domain-specific data.
- **EU / GDPR / health-data relevance:** Helpful for GDPR minimization but not a complete compliance program.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.