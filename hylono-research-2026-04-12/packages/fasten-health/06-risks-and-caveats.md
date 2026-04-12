# Fasten Health — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** High strategic mismatch.
- **Security posture note:** Health records are highly sensitive. Not appropriate to introduce casually in a health-adjacent business stack.
- **Maintenance hotspot:** Connector maintenance and sensitive-data governance are the main issues.
- **Hidden complexity:** Confusing a personal-record product with a business operations platform.
- **EU / GDPR / health-data relevance:** Would involve special-category health data if used.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.