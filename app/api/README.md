# ⚠️ REFERENCE ONLY — ARCHITECTURE DECISION RATIFIED

## Status: Option A Selected — Implementation Pending

**DECISION RATIFIED 2026-02-19**: This directory contains Next.js App Router convention handlers that are **reference-only** in the current Vite SPA runtime.

The architecture decision has been made: **Option A — Vite SPA + Separate Node API Backend** (see `reports/TASK-018_RUNTIME_ARCHITECTURE_DECISION_PACKAGE.md`).

These files serve as **specification/reference** for the new backend implementation. They are NOT executed in the current Vite runtime.

---

---

## What's in here (and what's broken)

| Route file | Intended purpose | Status |
|------------|-----------------|--------|
| `contact/route.ts` | Contact form submission | ❌ DEAD |
| `newsletter/route.ts` | Newsletter signup | ❌ DEAD |
| `checkout/route.ts` | Stripe checkout session creation | ❌ DEAD |
| `rental-checkout/route.ts` | Rental subscription initiation | ❌ DEAD |
| `book-demo/route.ts` | Demo booking form | ❌ DEAD |
| `auth/[...nextauth]/route.ts` | NextAuth.js authentication | ❌ DEAD |

## Frontend ↔ Endpoint Contract Matrix (TASK-023)

The table below documents the currently expected frontend route contracts so UI paths stay internally consistent while architecture decision TASK-018 is pending.

> ⚠️ Important: these endpoints remain non-functional at runtime in the current Vite setup until TASK-018 is resolved.

| Frontend component | Frontend call/link | Expected route key | Handler file in repo | Contract status |
|---|---|---|---|---|
| `components/ContactPage.tsx` | `POST /api/contact` | `/api/contact` | `app/api/contact/route.ts` | ✅ Consistent |
| `components/Newsletter.tsx` | `POST /api/newsletter` | `/api/newsletter` | `app/api/newsletter/route.ts` | ✅ Consistent |
| `components/CheckoutPage.tsx` | `POST /api/checkout` | `/api/checkout` | `app/api/checkout/route.ts` | ✅ Consistent |
| `components/BookingModal.tsx` | `POST /api/booking` | `/api/booking` | `app/api/booking/route.ts` | ✅ Consistent |
| `components/BookDemoModal.tsx` | `POST /api/booking` | `/api/booking` | `app/api/booking/route.ts` | ✅ Fixed in TASK-023 (was `/api/book`) |
| `components/CookieConsent.tsx` | `href="/privacy"` | `/privacy` route | `components/AppRouter.tsx` (`currentPage === 'privacy'`) | ✅ Fixed in TASK-023 (was `/legal/privacy`) |

### Contract Rules (until TASK-018 closure)
- Do not introduce new `/api/*` paths in frontend unless matching handler contract is documented.
- Keep legal links aligned to router keys (`/privacy`, `/terms`, `/shipping`, etc.), not alternate prefixes.
- Any contract change must be reflected both in component usage and this matrix.

Authentication is currently handled via `lib/mockAuth.ts` (mock only — no real users).

---

## Architecture Decision Required (Owner/CTO)

Two viable paths forward:

### Option A — Vite SPA + Separate API Server
- Keep the Vite frontend as-is
- Build a separate Express/Fastify/Hono backend (Node.js) or use serverless functions (Vercel, Cloudflare Workers, AWS Lambda)
- Rewrite these route handlers as standard Express routes or Vercel API functions
- Connect via environment variable `VITE_API_BASE_URL`
- **Best for**: teams that want to keep frontend/backend separate, use a dedicated backend language, or already have infrastructure

### Option B — Migrate to Next.js (App Router)
- Migrate the Vite SPA to Next.js 15+
- These `app/api/route.ts` files would then work natively
- Full-stack in one repo, built-in SSR/SSG, Vercel deployment optimized
- **Best for**: solo/small teams, Vercel hosting, wanting a unified codebase
- **Effort**: Medium — most components are already compatible; main work is routing migration

### Option C — Vercel Functions (Minimal Change)
- Keep Vite frontend
- Add `api/` directory at repo root (Vercel convention, NOT `app/api/`)
- Vercel will auto-deploy these as serverless functions
- Rename `route.ts` → `index.ts`, convert to standard Node.js handler format
- **Best for**: teams already planning Vercel deployment with minimal refactor

---

## Blocked Until Decision Made
- Real Stripe payment integration
- Real authentication (replace `mockAuth.ts`)
- Contact/newsletter form functionality
- Demo booking
- Rental checkout flow

---

## DO NOT delete these files yet
They contain the intended business logic and can be reused in whichever architecture is chosen. They serve as a spec for what each endpoint must do.

**Date discovered**: 2026-02-18  
**Discovered by**: Automated audit (Session 4)  
**Priority**: P0 — Core business functionality blocked
