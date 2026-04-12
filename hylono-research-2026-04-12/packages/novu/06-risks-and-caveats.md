# Novu — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Moderate. High leverage, but notification systems fail noisily if payload ownership, templates, or provider ops are weak.
- **Security posture note:** Notification payloads can contain PII and order/service context. Keep provider creds in a secrets system, scope API keys, and minimize sensitive data in templates.
- **Maintenance hotspot:** Watch queue backlogs, provider failures, webhook retries, payload drift, and version compatibility across API/dashboard/workers.
- **Hidden complexity:** Assuming provider abstraction removes deliverability work, under-sizing worker/queue capacity, and storing too much sensitive context in notification payloads.
- **EU / GDPR / health-data relevance:** Contains user contact details and event context. Respect consent/preferences, minimize sensitive content, and prefer EU-hosted supporting infrastructure where possible.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.