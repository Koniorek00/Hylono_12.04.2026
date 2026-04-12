# Redis 7 — Integration Notes

## Phase E — Hylono fit analysis
- **Business usefulness:** Needed by Novu, n8n queue mode, and many web apps for caches or background work. It fits the stack, but licensing must be surfaced early to legal and procurement stakeholders.
- **Implementation complexity:** **Medium**
- **Maintenance burden:** **Medium**
- **Risk level:** **Medium**
- **Deployment priority:** **KEEP FOR EXISTING USE; REQUIRE LICENSE REVIEW BEFORE EXPANSION**

## Likely integration touchpoints
- **Next.js 16 / App Router:** Treat this as shared infrastructure or platform control-plane. Do not fold it into the public Next.js app. Expose only the minimum required endpoints behind network controls, Kong, and SSO where relevant.
- **APIs / webhooks / queues:** Use server-side routes, route handlers, webhooks, or n8n where the app becomes a connected service.
- **Auth stack:** Prefer ZITADEL / Auth.js-compatible federation for app access when the app supports OIDC/SAML/SSO; otherwise isolate app-local auth and keep it internal.
- **Billing / notifications / CRM:** Evaluate connection points with Stripe, Novu, Twenty, and n8n rather than rebuilding orchestration inside the public site.
- **Observability:** Add only the monitoring needed for the app’s real criticality.

## Must verify before integration
- Confirm whether Hylono is comfortable with Redis 7 licensing, whether Valkey is a preferable future path, and which workloads genuinely require Redis rather than database-backed queues.
- Confirm whether the app should be a **system of record**, a **secondary operational tool**, or a **replaceable edge service**.
- Confirm EU hosting, backup, and access-control posture before production use.

## Health-adjacent compliance flags
- Usually stores transient operational data, but payloads may still contain personal data if queue design is sloppy. Minimize and expire sensitive values.
- Keep claims, recommendations, and customer-facing outputs conservative and non-medical unless there is explicit evidence and governance supporting stronger claims.