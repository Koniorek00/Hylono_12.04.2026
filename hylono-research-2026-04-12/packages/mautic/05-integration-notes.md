# Mautic — Integration Notes

## Phase E — Hylono fit analysis
- **Business usefulness:** Can integrate with site forms, CRM, n8n, and analytics if lifecycle marketing becomes strategic.
- **Implementation complexity:** **Medium to High**
- **Maintenance burden:** **High**
- **Risk level:** **Medium**
- **Deployment priority:** **LATER / ONLY IF ADVANCED MARKETING AUTOMATION IS NEEDED**

## Likely integration touchpoints
- **Next.js 16 / App Router:** Deploy as a separate service or internal hostname. Keep it off the customer-facing surface by default. Integrate with the Next.js site via server-side APIs, webhooks, or deep links; use SSO when possible.
- **APIs / webhooks / queues:** Use server-side routes, route handlers, webhooks, or n8n where the app becomes a connected service.
- **Auth stack:** Prefer ZITADEL / Auth.js-compatible federation for app access when the app supports OIDC/SAML/SSO; otherwise isolate app-local auth and keep it internal.
- **Billing / notifications / CRM:** Evaluate connection points with Stripe, Novu, Twenty, and n8n rather than rebuilding orchestration inside the public site.
- **Observability:** Add only the monitoring needed for the app’s real criticality.

## Must verify before integration
- Decide whether advanced marketing automation is really needed beyond Listmonk/Novu/n8n.
- Confirm whether the app should be a **system of record**, a **secondary operational tool**, or a **replaceable edge service**.
- Confirm EU hosting, backup, and access-control posture before production use.

## Health-adjacent compliance flags
- Marketing consent and contact data handling are central.
- Keep claims, recommendations, and customer-facing outputs conservative and non-medical unless there is explicit evidence and governance supporting stronger claims.