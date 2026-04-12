# Formbricks — Integration Notes

## Phase E — Hylono fit analysis
- **Business usefulness:** Can integrate with Next.js site, PostHog, n8n, CRM, and email/notification systems.
- **Implementation complexity:** **Low to Medium**
- **Maintenance burden:** **Low to Medium**
- **Risk level:** **Medium**
- **Deployment priority:** **GOOD LATER FEEDBACK TOOL**

## Likely integration touchpoints
- **Next.js 16 / App Router:** Deploy as a separate service. Keep the Hylono public site as the server-first customer surface and integrate through server-side API routes, webhooks, queued jobs, or SDKs.
- **APIs / webhooks / queues:** Use server-side routes, route handlers, webhooks, or n8n where the app becomes a connected service.
- **Auth stack:** Prefer ZITADEL / Auth.js-compatible federation for app access when the app supports OIDC/SAML/SSO; otherwise isolate app-local auth and keep it internal.
- **Billing / notifications / CRM:** Evaluate connection points with Stripe, Novu, Twenty, and n8n rather than rebuilding orchestration inside the public site.
- **Observability:** Add only the monitoring needed for the app’s real criticality.

## Must verify before integration
- Define exactly what feedback loops Hylono needs and what data should never be asked.
- Confirm whether the app should be a **system of record**, a **secondary operational tool**, or a **replaceable edge service**.
- Confirm EU hosting, backup, and access-control posture before production use.

## Health-adjacent compliance flags
- Survey responses can become personal data or special-category adjacent depending on questions.
- Keep claims, recommendations, and customer-facing outputs conservative and non-medical unless there is explicit evidence and governance supporting stronger claims.