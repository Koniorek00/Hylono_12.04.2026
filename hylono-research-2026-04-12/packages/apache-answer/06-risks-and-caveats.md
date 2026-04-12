# Apache Answer — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Moderate overlap risk.
- **Security posture note:** Public question content, user accounts, moderation, and spam controls require attention.
- **Maintenance hotspot:** Moderation, spam handling, upgrade cadence, and taxonomy/content curation matter.
- **Hidden complexity:** Choosing a Q&A platform when Hylono really needs docs or community discussions instead.
- **EU / GDPR / health-data relevance:** User account and content data require standard privacy handling.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.