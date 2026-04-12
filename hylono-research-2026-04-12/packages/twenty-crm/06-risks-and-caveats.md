# Twenty CRM — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Moderate. Valuable and implementable, but CRM data-model ownership can become messy if sync rules are weak.
- **Security posture note:** CRM data will include customer and partner context. Access control, auditability, backup encryption, and GDPR-ready retention matter.
- **Maintenance hotspot:** Track upstream schema changes, API stability, webhook payload changes, and license scope before deep customization.
- **Hidden complexity:** Over-customizing before core schemas stabilize, mixing source-of-truth ownership across systems, and ignoring GDPR retention/export needs.
- **EU / GDPR / health-data relevance:** Contains identifiable customer/prospect data. EU hosting, consent basis, retention, export/delete workflows, and access controls are mandatory.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.