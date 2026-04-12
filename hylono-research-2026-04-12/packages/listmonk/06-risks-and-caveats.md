# Listmonk — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Low to moderate.
- **Security posture note:** Subscriber data and marketing consent must be handled carefully; keep admin access tight and double-check unsubscribe/consent flows.
- **Maintenance hotspot:** Deliverability, unsubscribe correctness, bounce handling, and consent-data integrity matter most.
- **Hidden complexity:** Treating it like a full customer-data platform or duplicating preference management poorly with Novu/Mautic/site DB.
- **EU / GDPR / health-data relevance:** Explicit consent, unsubscribe, and retention/delete flows matter.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.