# Kong — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Moderate but foundationally useful.
- **Security posture note:** High leverage security boundary. Misconfiguration can expose services or break auth globally.
- **Maintenance hotspot:** Route/plugin testing, certificate handling, upgrade compatibility, and metrics/logging need ownership.
- **Hidden complexity:** Overcomplicating a very small stack, or deploying Kong without a clear API catalog and route ownership model.
- **EU / GDPR / health-data relevance:** Gateway logs may include identifiers; configure logging carefully.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.