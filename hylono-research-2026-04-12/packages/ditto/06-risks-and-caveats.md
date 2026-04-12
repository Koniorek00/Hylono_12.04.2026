# Ditto — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** High overlap and identity ambiguity.
- **Security posture note:** Campaign tools centralize customer identifiers and event data. Retention, consent, and preference handling matter.
- **Maintenance hotspot:** Deliverability, segmentation correctness, customer data hygiene, and campaign-governance ownership matter more than basic install.
- **Hidden complexity:** Redundant overlap with Novu, Listmonk, Mautic, and direct app logic.
- **EU / GDPR / health-data relevance:** Customer engagement tooling is consent-sensitive by default.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.