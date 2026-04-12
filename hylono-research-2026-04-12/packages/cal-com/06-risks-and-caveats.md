# Cal.com — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Moderate. High user-facing value, but calendar sync and scheduling edge cases create support load.
- **Security posture note:** Bookings can expose personal contact details and availability data. Harden admin/user access and validate webhook/auth flows carefully.
- **Maintenance hotspot:** Cron reliability, calendar webhook delivery, timezone correctness, and provider API quota/permission review.
- **Hidden complexity:** Broken calendar sync, timezone mistakes, and over-embedding without testing SSR/security behavior in the main site.
- **EU / GDPR / health-data relevance:** Stores identifiable booking data and calendar context. EU hosting, retention, and third-party calendar provider handling matter.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.