# Dify — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** High complexity if used prematurely.
- **Security posture note:** Prompt/input data, knowledge bases, and provider keys require strong governance and privacy controls.
- **Maintenance hotspot:** Model/provider governance, prompt/version drift, vector/knowledge refresh, and privacy controls matter.
- **Hidden complexity:** Deploying AI infrastructure without defined use cases or data-governance guardrails.
- **EU / GDPR / health-data relevance:** AI workflows can handle personal data; minimization and provider review are critical.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.