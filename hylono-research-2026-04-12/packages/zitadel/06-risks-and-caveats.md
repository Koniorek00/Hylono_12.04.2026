# ZITADEL — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** High consequence but high leverage. Worth doing carefully and early if cross-app SSO is a priority.
- **Security posture note:** This is a tier-0 identity system. Key management, domain/TLS correctness, email/SMS trust chains, and upgrade discipline are critical.
- **Maintenance hotspot:** Version upgrades, OIDC client management, key rotation, domain verification, email deliverability, and incident response preparedness.
- **Hidden complexity:** Treating identity as a side project, underestimating migration from existing Auth.js/NextAuth flows, and misconfiguring redirect URIs or external domains.
- **EU / GDPR / health-data relevance:** Identity data is personal data. EU hosting, auditability, retention, and breach response are central.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.