# Infisical — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Moderate but worth it; benefits compound as the stack grows.
- **Security posture note:** High leverage and high consequence. Root keys, bootstrap process, admin access, and backup recovery must be handled carefully.
- **Maintenance hotspot:** Access review, key rotation, secrets rotation, audit review, and onboarding discipline matter more than raw install complexity.
- **Hidden complexity:** Migrating too many apps at once, mishandling root keys, or assuming every app can ingest secrets the same way.
- **EU / GDPR / health-data relevance:** Mostly credential data, but secrets platform security affects every system that holds personal data.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.