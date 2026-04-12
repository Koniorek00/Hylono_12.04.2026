# Documenso — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Moderate to high because signature workflows carry legal/process consequences.
- **Security posture note:** Signed documents, audit trails, and potentially sensitive acknowledgements make this a high-trust system. Protect storage, links, identities, and retention policies carefully.
- **Maintenance hotspot:** Version upgrades, storage migration, email deliverability, and document retention/governance need explicit ownership.
- **Hidden complexity:** Assuming 'open-source e-sign' automatically equals legal sufficiency for every workflow, or mixing signed-doc truth across multiple systems.
- **EU / GDPR / health-data relevance:** Documents may contain identity, addresses, signatures, and possibly health-adjacent acknowledgements. EU hosting and retention controls are important.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.