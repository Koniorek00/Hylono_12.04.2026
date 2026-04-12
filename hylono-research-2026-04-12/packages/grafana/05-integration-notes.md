# Grafana — Integration Notes

## Phase E — Hylono fit analysis
- **Business usefulness:** Natural fit with Prometheus, Postgres exporters, Kong, Redis, and infrastructure monitoring.
- **Implementation complexity:** **Medium**
- **Maintenance burden:** **Medium**
- **Risk level:** **Medium**
- **Deployment priority:** **DEPLOY WITH OBSERVABILITY STACK**

## Likely integration touchpoints
- **Next.js 16 / App Router:** Treat this as shared infrastructure or platform control-plane. Do not fold it into the public Next.js app. Expose only the minimum required endpoints behind network controls, Kong, and SSO where relevant.
- **APIs / webhooks / queues:** Use server-side routes, route handlers, webhooks, or n8n where the app becomes a connected service.
- **Auth stack:** Prefer ZITADEL / Auth.js-compatible federation for app access when the app supports OIDC/SAML/SSO; otherwise isolate app-local auth and keep it internal.
- **Billing / notifications / CRM:** Evaluate connection points with Stripe, Novu, Twenty, and n8n rather than rebuilding orchestration inside the public site.
- **Observability:** Add only the monitoring needed for the app’s real criticality.

## Must verify before integration
- Choose whether dashboards are provisioned as code from day one.
- Confirm whether the app should be a **system of record**, a **secondary operational tool**, or a **replaceable edge service**.
- Confirm EU hosting, backup, and access-control posture before production use.

## Health-adjacent compliance flags
- Avoid exposing identifiable data in dashboards unless role-controlled.
- Keep claims, recommendations, and customer-facing outputs conservative and non-medical unless there is explicit evidence and governance supporting stronger claims.