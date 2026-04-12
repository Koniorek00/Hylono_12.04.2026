# Discourse — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Moderate product/ops risk; community tooling needs human stewardship.
- **Security posture note:** Public communities need strong moderation, email security, plugin discipline, and abuse/spam controls.
- **Maintenance hotspot:** Moderation, spam prevention, upgrade cadence, plugin compatibility, and email deliverability are ongoing responsibilities.
- **Hidden complexity:** Launching a forum without community operations capacity, or using a full forum where a lighter Q&A/knowledge base would suffice.
- **EU / GDPR / health-data relevance:** User accounts and posts are personal data. Retention/moderation/export processes matter.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.