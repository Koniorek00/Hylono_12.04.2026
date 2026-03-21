# API & Server Action Registry

| Endpoint/Action | Path | Method/Type | Auth Required | Description |
|---|---|---|---|---|
| Auth.js handlers | `app/api/auth/[...nextauth]/route.ts` | `GET`, `POST` | Yes | NextAuth route handlers exported from `@/lib/auth`. |
| Booking API | `app/api/booking/route.ts` | `POST` (`GET` returns 405) | No | Persists booking requests to Drizzle (`booking_requests`) with context-aware sanitization and returns 202 fallback when outbound Resend delivery is unavailable. |
| Checkout API | `app/api/checkout/route.ts` | `POST` (`GET` returns 405) | No | Persists checkout orders to Drizzle (`checkout_orders`) with trusted server-side pricing, Stripe idempotency keying, and explicit status-driven degraded responses (`pending_card_configuration`, `payment_intent_failed`, `awaiting_offline_payment`). |
| Contact API | `app/api/contact/route.ts` | `POST` (`GET` returns 405) | No | Persists contact inquiries to Drizzle (`contact_inquiries`) with context-aware sanitization, ticket IDs, and Resend notification fallback without dropping captured leads. |
| Newsletter API | `app/api/newsletter/route.ts` | `POST` (`GET` returns 405) | No | Persists newsletter subscriptions to Drizzle (`newsletter_subscriptions`), performs insert-or-update behavior by email, and tracks provider sync state from Resend audience upsert attempts. |
| Rental API | `app/api/rental/route.ts` | `GET`, `POST` | No | Drizzle-backed rental application API (`rental_applications`) with Zod validation, slug-context normalization for identifiers, and filtered non-cancelled rental retrieval by `userId`. |
| Uploadthing route handler | `app/api/uploadthing/route.ts` | `GET`, `POST` | No | Uploadthing route handler created with `createRouteHandler`. |
| submitContactFormAction | `src/actions/formActions.ts` | Server Action (`'use server'`) | No | Validates and handles contact form action payload. |
| submitNewsletterFormAction | `src/actions/formActions.ts` | Server Action (`'use server'`) | No | Validates newsletter form action payload and revalidates tags. |
| submitBookingFormAction | `src/actions/formActions.ts` | Server Action (`'use server'`) | No | Validates and handles booking form action payload. |
| submitCheckoutFormAction | `src/actions/formActions.ts` | Server Action (`'use server'`) | No | Validates checkout payload and resolves totals from trusted catalog IDs (no client price trust). |
| submitNewsletterSafeAction | `src/actions/formActions.ts` | `next-safe-action` | No | Typed safe action for newsletter submission flow. |
