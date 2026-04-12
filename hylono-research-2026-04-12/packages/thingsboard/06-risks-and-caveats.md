# ThingsBoard — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** High complexity with uncertain immediate value.
- **Security posture note:** Connected devices and telemetry can create large attack surface and sensitive operational data exposure.
- **Maintenance hotspot:** Device lifecycle, telemetry volume, rule-chain correctness, and multi-tenant data separation matter.
- **Hidden complexity:** Deploying a full IoT platform before confirming device telemetry is a strategic requirement.
- **EU / GDPR / health-data relevance:** Telemetry and customer-device linkage can become personal data.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.