# API Routes (App Router)

This directory contains **active Next.js App Router route handlers** (`app/api/**/route.ts`) used by the main Hylono application runtime.

## Runtime status

- ✅ Route handlers in this directory are part of the current Next.js runtime.
- ✅ Contracts here are authoritative for frontend integrations that call `/api/*`.
- ✅ Conversion-critical routes are now persistence-backed via Drizzle + Neon with explicit degraded-mode responses.

## Endpoint maturity map

| Route | Purpose | Maturity |
|---|---|---|
| `/api/contact` | Contact inquiry intake and validation | **Production-ready ingest** (Drizzle persistence + ticketing + Resend fallback) |
| `/api/newsletter` | Newsletter subscription intake | **Production-ready ingest** (Drizzle persistence + provider sync tracking) |
| `/api/booking` | Consultation/demo booking intake | **Production-ready ingest** (Drizzle persistence + Resend fallback) |
| `/api/checkout` | Checkout order + payment intent orchestration | **Production-ready core** (trusted pricing + idempotent Stripe intent + order status persistence) |
| `/api/rental` | Rental creation and fetch contract | **Production-ready persistence** (Drizzle-backed create/list flows, no in-memory placeholder) |

## Contract governance

1. Do not introduce new `/api/*` contracts without adding/maintaining corresponding `route.ts` handlers.
2. Keep request validation server-side (Zod) and sanitize input before logging/persisting.
3. Avoid PII in operational logs.
4. For monetary operations, derive economic values from trusted server-side sources.

## Implementation notes

- Database layer standard: **Drizzle + Neon**.
- Email layer standard: **Resend + React Email**.
- Security: keep route handlers aligned with platform guardrails (Arcjet/Nosecone integration strategy at boundary level).

## Operational behavior highlights

- Conversion-critical route handlers require database availability (`DATABASE_URL`) and return explicit `503` responses when persistence cannot be guaranteed.
- Contact and booking flows persist first, then attempt outbound Resend delivery; if delivery fails, API responds with accepted/degraded status instead of dropping the submission.
- Newsletter flow persists subscriber state, then records provider synchronization outcome (`providerSynced`) after Resend audience upsert attempt.
- Checkout flow persists order lifecycle states to support observability and reconciliation across card/offline payment branches.
