# TASK-018 — Runtime Architecture Decision Package

Date: 2026-02-19  
Owner: architect-orchestrator  
Status: DECISION RATIFIED (Implementation pending)

---

## 1) Problem Statement (Verified)

`app/api/*/route.ts` uses Next.js App Router handlers, but Hylono runs as a Vite SPA. Therefore these handlers are dead at runtime and key business flows (contact, newsletter, checkout, booking, rental) do not execute server-side.

This is a P0 launch blocker and the direct dependency for TASK-019 (Prisma runtime readiness) and TASK-020 (real auth).

---

## 2) Options Evaluated

### Option A — Vite SPA + Separate Node API Backend
- Keep current Vite frontend.
- Add dedicated backend service (`server/`) using Node runtime (Express/Hono/Fastify acceptable).
- Move active API contracts to backend endpoints and route frontend via `VITE_API_BASE_URL`.

### Option B — Migrate App to Next.js (App Router)
- Convert frontend runtime and routing to Next.js so `app/api` conventions become executable.

### Option C — Vercel Functions While Keeping Vite
- Keep Vite frontend and move handlers into root `api/` Vercel-function format.

---

## 3) Decision

## ✅ Selected: Option A — Vite SPA + Separate Node API Backend

### Why this was selected
1. **Fastest unblock of P0 core flows** without large frontend migration risk.
2. **Preserves current Vite frontend investment** and existing component/routing structure.
3. **Clean dependency chain** for immediate TASK-019 and TASK-020 execution.
4. **Portable runtime** (not locked to a single serverless vendor convention).

### Trade-offs accepted
- Additional backend service ownership (deployment + ops overhead).
- Cross-origin/API contract governance needed from day one.
- Temporary dual-spec period while `app/api/*` remains as reference logic.

### Explicitly deferred
- Full Next.js migration (Option B) is deferred unless future SSR/SEO constraints justify re-evaluation.
- Vercel-function-first model (Option C) is deferred to avoid platform coupling as the primary architecture choice.

---

## 4) Migration Map (Execution Waves)

## Wave 0 — Foundation (Immediate)
**Goal:** Stand up executable backend baseline.

Deliverables:
- `server/` bootstrap with health endpoint: `GET /health`.
- CORS, JSON body parsing, request validation baseline.
- Shared API error envelope contract.

Owner: backend-specialist

---

## Wave 1 — Form/Commerce Endpoint Lift (TASK-018 core)
**Goal:** Replace dead `app/api` paths with live backend equivalents.

Endpoint target mapping:
- `POST /contact`
- `POST /newsletter`
- `POST /booking`
- `POST /checkout/session`
- `POST /rental-checkout/session`

Frontend changes:
- Replace direct `/api/*` calls with `${VITE_API_BASE_URL}/...` helper-driven endpoints.

Owners:
- backend-specialist (API handlers)
- api-contract-manager (contract governance)
- frontend-specialist (frontend rewiring)

---

## Wave 2 — Data Readiness (TASK-019)
**Goal:** Operational Prisma runtime and DB-backed handlers.

Deliverables:
- `prisma validate` + `prisma generate` in selected backend runtime.
- Initial migration workflow and connectivity validation.
- Replace transient/mock persistence in lifted endpoints.

Owners:
- data-architect
- backend-specialist

---

## Wave 3 — Real Auth Cutover (TASK-020)
**Goal:** Remove mock auth from active flow.

Deliverables:
- Server-backed auth/session strategy (OIDC/provider integration per selected IAM plan).
- Frontend `AuthContext` switched from `mockAuth.ts` to backend auth API.
- Role checks enforced server-side for protected routes.

Owners:
- backend-specialist
- security-compliance

---

## Wave 4 — Reliability Hardening
**Goal:** Make new runtime production-safe.

Deliverables:
- Idempotency and webhook signature verification for payment-sensitive routes.
- Structured logging + monitoring baseline.
- CI checks for backend route health and critical API contracts.

Owners:
- backend-specialist
- release-manager
- code-skeptic

---

## 5) Interface Contract Rules (Effective Immediately)

1. New frontend network calls must use backend base URL abstraction; no new raw `/api/*` calls.
2. `app/api/*` remains reference-only until migration completes; no assumption of runtime execution.
3. Any endpoint path change requires synchronized update in:
   - frontend caller(s),
   - contract documentation,
   - regression checks.

---

## 6) Acceptance Criteria for TASK-018 Closure

- [x] Architecture option selected and documented.
- [x] Migration map and ownership defined.
- [x] Dependencies for TASK-019 and TASK-020 explicitly unblocked.
- [ ] Backend baseline deployed and health endpoint live.
- [ ] Frontend no longer depends on dead `app/api/*` runtime paths.

TASK-018 status in this package: **Decision complete; implementation in progress.**

---

## 7) Immediate Next 24h Deliverables

1. Backend bootstrap PR (`server/` + `/health`).
2. First endpoint lift PR (`/contact`, `/newsletter`, `/booking`).
3. Frontend API base URL adapter PR.
4. Prisma generation readiness check PR for backend runtime.
