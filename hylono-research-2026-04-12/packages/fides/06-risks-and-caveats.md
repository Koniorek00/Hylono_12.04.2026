# Fides — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Moderate to high process burden.
- **Security posture note:** Handles sensitive privacy inventory and request workflows. Needs careful access control and process ownership.
- **Maintenance hotspot:** Connector maintenance, privacy workflow ownership, legal/policy updates, and access review are ongoing.
- **Hidden complexity:** Deploying a governance platform before the organization has clear privacy processes and data maps.
- **EU / GDPR / health-data relevance:** Directly relevant. Strong tool only if the privacy program is ready to use it.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.