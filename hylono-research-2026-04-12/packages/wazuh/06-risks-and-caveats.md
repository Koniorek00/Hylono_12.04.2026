# Wazuh — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** High ops burden if premature.
- **Security posture note:** Security tooling itself becomes critical infrastructure; access and update hygiene matter.
- **Maintenance hotspot:** Rule tuning, false positives, agent lifecycle, and incident workflows dominate.
- **Hidden complexity:** Deploying SIEM tooling before there is a team/process to operate it.
- **EU / GDPR / health-data relevance:** Security logs can contain personal/system identifiers; retention/access matter.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.