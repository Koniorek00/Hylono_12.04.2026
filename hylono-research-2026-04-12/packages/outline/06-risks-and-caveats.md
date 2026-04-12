# Outline — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Moderate due to license and overlap.
- **Security posture note:** Internal docs may be sensitive. License review and auth/storage hardening matter.
- **Maintenance hotspot:** License tracking, auth integration, storage, and upgrades need attention.
- **Hidden complexity:** Choosing Outline for internal SOPs when BookStack is simpler and more structured.
- **EU / GDPR / health-data relevance:** Mostly internal docs; still personal data if users author/comment.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.