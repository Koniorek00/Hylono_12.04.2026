# Lago — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** High domain-model risk if introduced too early.
- **Security posture note:** Billing systems directly affect revenue and customer trust. Webhook integrity, tax/invoice correctness, and finance-process controls matter.
- **Maintenance hotspot:** Version upgrades require billing regression checks, webhook validation, and finance-side acceptance criteria.
- **Hidden complexity:** Overlapping responsibilities with Stripe, introducing invoice truth conflicts, and deploying metering before the business pricing model is stable.
- **EU / GDPR / health-data relevance:** Contains customer billing data; treat as financial system of record if adopted.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.