# Medusa — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Moderate to high because commerce replatforming can sprawl.
- **Security posture note:** Commerce systems hold customer/order/payment-adjacent data. Segment responsibilities, harden admin access, and verify tax/price/rental edge cases before rollout.
- **Maintenance hotspot:** Track module compatibility, storefront/backend version alignment, payment webhook correctness, and admin access controls.
- **Hidden complexity:** Prematurely replacing a working server-first site architecture, duplicating catalog/order logic, and underestimating migration work from custom Stripe flows.
- **EU / GDPR / health-data relevance:** Customer/order data and event logs require standard EU data controls; avoid unnecessary duplication between Medusa and the core site DB.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.