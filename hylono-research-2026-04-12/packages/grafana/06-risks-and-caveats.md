# Grafana — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Low to moderate; high value.
- **Security posture note:** Dashboards can expose internal service data. Use RBAC and least-privilege datasource access.
- **Maintenance hotspot:** Datasource governance, dashboard sprawl control, and version/plugin upgrades matter.
- **Hidden complexity:** Letting Grafana become a manual dashboard graveyard without provisioning discipline.
- **EU / GDPR / health-data relevance:** Avoid exposing identifiable data in dashboards unless role-controlled.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.