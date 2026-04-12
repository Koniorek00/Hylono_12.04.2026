# Mautic — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Moderate overlap/complexity risk.
- **Security posture note:** Marketing contacts, tracking, and consent handling require strong process governance.
- **Maintenance hotspot:** Deliverability, campaign QA, consent management, and cron reliability matter.
- **Hidden complexity:** Overkill compared to simpler newsletter/transactional stack.
- **EU / GDPR / health-data relevance:** Marketing consent and contact data handling are central.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.