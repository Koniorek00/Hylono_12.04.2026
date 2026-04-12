# Invoice Ninja — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Moderate. Useful but finance scope must be explicit.
- **Security posture note:** Financial documents and customer details require standard finance-app hardening and role separation.
- **Maintenance hotspot:** Upgrade cautiously around tax/PDF/payment changes; test reminder schedules and webhook flows.
- **Hidden complexity:** Confusing Stripe as source of truth vs Invoice Ninja as source of truth, and duplicating invoice ownership across tools.
- **EU / GDPR / health-data relevance:** Contains customer and financial data; treat as a finance system.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.