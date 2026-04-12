# BookStack — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Low.
- **Security posture note:** Docs may contain sensitive internal procedures. Restrict access and review file upload/storage controls.
- **Maintenance hotspot:** Version upgrades and content governance are straightforward.
- **Hidden complexity:** Using it for public docs when Docusaurus is better, or for complex collaborative docs where Outline might be preferred.
- **EU / GDPR / health-data relevance:** Mostly internal content; personal data risk depends on what users write into pages.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.