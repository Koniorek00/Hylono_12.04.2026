# Uptime Kuma — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Low. Lightweight and easy to replace if observability matures.
- **Security posture note:** Keep the admin UI private, patch regularly, and avoid exposing internal-only endpoints publicly through status pages.
- **Maintenance hotspot:** Add monitors as new apps go live, test notifications, and patch on release cadence.
- **Hidden complexity:** Treating it as a full observability platform, forgetting backups, or exposing sensitive internal target details on public status pages.
- **EU / GDPR / health-data relevance:** Minimal direct data risk unless notifications or public pages expose user data.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.