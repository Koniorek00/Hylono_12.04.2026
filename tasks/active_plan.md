# Active Plan — 2026-03-01

## Batch A — Proxy/CSP Hardening (Completed)

- Implemented standalone `proxy.ts` security layers (Arcjet + Nosecone + auth route checks + consent cookie propagation) without importing shared app modules.
- Added per-request boundary (`await connection()`) with suspense-safe layout composition in `src/app/layout.tsx`.
- Resolved type/runtime issues encountered during build (Arcjet allow-list typing, Nosecone CSP source typing, blocking-route suspense boundaries).
- Verification gate passed: `pnpm build && pnpm test && pnpm exec biome check .`.

## Next Batch — Batch B

- Normalize non-exact dependency pins in `package.json` per FINAL_STACK Rule 3.
- Audit/remove active Prisma runtime footprint usage and confirm no runtime imports remain.
- Re-run targeted pre-flight checks: async request API await usage, `@slot/default.tsx` coverage, deprecated proxy flags, raw `<img>`, raw `process.env` outside `lib/env.ts`.
- Apply fixes in atomic batches and rerun full verification after each batch.

## Batch B — Exact Pins & Pre-flight Continuation (Completed)

- Normalized remaining ranged versions in `package.json` to exact pins.
- Updated lockfile with `pnpm install --lockfile-only`.
- Re-verified: `pnpm build && pnpm test && pnpm exec biome check .` passes after dependency declaration hardening.

## Next Batch — Batch C

- Validate `@slot/default.tsx` coverage for all parallel routes (if any).
- Continue unresolved FINAL_STACK phases with targeted codebase checks (observability wiring, ADR completion, final compliance sweep).
- Keep atomic batch size ≤5 files and run full verification after each batch.

## Batch C.1 — Continuation Sync & Gap Inventory (Completed)

- Synced current state from latest compliance log and revalidated unresolved scope against source code.
- Confirmed unresolved integration gaps still open in active runtime paths:
  - Missing Sentry runtime files (`instrumentation.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, `instrumentation-client.ts`).
  - Missing `next-safe-action` baseline usage.
  - Missing Uploadthing app router route/core setup.
  - Missing Trigger.dev baseline config file.
  - No explicit Next.js cache API usage (`"use cache"`, `cacheLife()`, `cacheTag()`, `revalidateTag()`, `updateTag()`).
- Confirmed no immediate regressions in pre-flight checks for raw `<img>`, edge runtime declarations, and obvious async API sync misuse in currently sampled routes.

## Next Batch — Batch D

- Implement observability baseline in atomic batch: Sentry instrumentation files + Next config wrapper.
- Run full verification gate after batch: `pnpm build && pnpm test && pnpm exec biome check .`.
- Append mirrored compliance logs to `docs/FINAL_STACK.MD`, `tasks/active_plan.md`, and `errors.md`.

## Batch E/F — Integration Scaffolds + Cache API Baseline (Completed)

- Fixed Trigger.dev configuration compatibility with installed SDK v3:
  - Updated `trigger.config.ts` import path to `@trigger.dev/sdk/v3`.
  - Added required `maxDuration` to satisfy current `TriggerConfig` shape.
- Hardened Uploadthing env usage in `app/api/uploadthing/core.ts` by replacing raw `process.env` check with centralized `env` access from `lib/env.ts`.
- Added `lib/cache/products.ts` and implemented explicit Next.js cache directives:
  - `"use cache"` with `cacheTag('products')`
  - `"use cache: remote"` with `cacheTag('inventory-remote')`
  - `"use cache: private"` with user-scoped session tag
  - cache lifetimes configured via object-based `cacheLife({ stale, revalidate, expire })`
- Updated `src/actions/formActions.ts` to add mutation invalidation semantics:
  - `updateTag('newsletter')`
  - `revalidateTag('newsletter', 'max')`
- Verification gates passed after remediation:
  - `pnpm build && pnpm test && pnpm exec biome check .`
  - `pnpm check`

## Next Batch — Batch G

- Run refreshed FINAL_STACK pre-flight continuation (remaining async API edge cases, `@slot/default.tsx` confirmation, deprecated flags sweep).
- Complete pending architecture/doc obligations (ADR/status consolidation) and keep mirrored logs synchronized across all required files.
- Re-run full verification gate after each atomic batch.

## Batch G — Pre-flight Continuation + ADR Closure (Completed)

- Executed continuation sweep across `app/`, `src/app/`, `components/`, and `lib/` for:
  - async request API misuse (`params`, `searchParams`, `cookies`, `headers`, `draftMode`),
  - `@slot/default.tsx` coverage,
  - deprecated Next.js config flags,
  - forbidden imports/usages (`framer-motion`, raw `<img>`, raw `process.env` outside env schema boundary, Prisma/Nodemailer in active runtime paths).
- Added `docs/decisions/server-action-library.md` (ADR-SA-001) to formalize `next-safe-action` standardization and cache invalidation guardrails.
- Verified all gates after the sweep/documentation update:
  - `pnpm build && pnpm test && pnpm exec biome check .`
  - `pnpm check`

## Next Batch — Batch H

- Enforce strict PostHog EU-only endpoint policy in runtime security headers/CSP surfaces.
- Keep operational/canonical logs synchronized (`docs/FINAL_STACK.MD`, `tasks/active_plan.md`, `errors.md`) in same cycle.
- Re-run full verification gates after remediation and continue long-tail FINAL_STACK alignment.

## Batch H — EU Analytics Endpoint Hardening + Log Synchronization (Completed)

- Removed non-EU PostHog endpoint (`https://us.i.posthog.com`) from runtime security surfaces:
  - `proxy.ts` (`CSP_CONNECT_SOURCES`)
  - `vercel.json` (`Content-Security-Policy` `connect-src`)
- Synchronized Batch G/H continuity notes across operational logs (`tasks/active_plan.md`, `errors.md`) to eliminate drift with canonical `docs/FINAL_STACK.MD` timeline.
- Verification gates completed after runtime CSP endpoint hardening:
  - `pnpm build && pnpm test && pnpm exec biome check .`
  - `pnpm check`

## Next Batch — Batch I

- Continue FINAL_STACK long-tail hardening focused on runtime compliance deltas not yet codified in canonical log.
- Execute another targeted high-risk sweep (server/client boundary, async request APIs, consent-gated analytics paths, route conventions) and remediate in atomic batches.
- Keep all three logs synchronized in the same implementation cycle.

## Batch I — Internal Navigation Compliance Sweep (Completed)

- Modified `components/OrderSuccessPage.tsx`:
  - replaced internal document links (`/terms`, `/warranty`) from raw `<a href>` to `next/link`.
- Modified `components/MegaMenu/MegaMenuSection.tsx`:
  - introduced internal-href classification helper (`isInternalHref`) and route-aware rendering so internal paths use `next/link` while external/hash/mailto/tel semantics remain anchor-based.
- Verified post-remediation gates:
  - `pnpm build && pnpm test && pnpm exec biome check .`
  - `pnpm check` (pass confirmed via background log completion: build + test + biome, no failure markers).

## Next Batch — Batch J

- Continue long-tail route convention hardening by auditing remaining internal `<a href="/...">` occurrences across legacy component surfaces and migrating to `next/link` where applicable.
- Re-run full verification gates after each atomic remediation set and keep canonical/operational logs synchronized in the same cycle.

## Batch J — Internal Anchor Drift Scan (Completed)

- Executed targeted scan across `components/`, `app/`, and `src/app` for residual internal anchor navigation drift.
- Confirmed remaining anchor usage is either:
  - external links (`https://...`),
  - protocol links (`mailto:`, `tel:`),
  - hash navigation (`#section`), or
  - dynamic anchor fallbacks in shared primitives with explicit internal-route routing via `next/link` when href begins with `/`.
- No additional code changes were required in this batch.

## Next Batch — Batch K

- Continue long-tail FINAL_STACK completion toward 100% by auditing remaining non-navigation compliance debt and normalizing any residual drifts in atomic batches.
- Re-run full verification gates after each remediation cycle and keep `docs/FINAL_STACK.MD`, `tasks/active_plan.md`, and `errors.md` synchronized.

## Batch K — Non-Navigation Strict-Rule Hardening (Completed)

- Targeted non-navigation compliance scan completed across active runtime paths (`app/`, `components/`, `src/`, `lib/`, `hooks/`, `utils/`) with explicit classification of generated/test-only noise.
- Remediations applied (atomic):
  - centralized env access helpers in `lib/env.ts` (`readRuntimeEnv`, `readFeatureFlagEnvOverride`, `setFeatureFlagEnvOverrideForTests`),
  - feature-flag env reads migrated from raw `process.env` to env helpers (`utils/featureFlags.ts`, `config/featureFlags.ts`),
  - instrumentation runtime env checks migrated to env helper (`instrumentation.ts`),
  - Playwright policy alignment (`playwright.config.ts`): env helper usage + `npm run dev` -> `pnpm dev`,
  - E2E partner assertion normalized to path-based checks (`e2e/partner-portal.spec.ts`),
  - feature-flag tests updated to env helper-based override writes (`tests/utils/featureFlags.test.ts`).
- Verification gates passed:
  - `pnpm build && pnpm test && pnpm exec biome check .`
  - `pnpm check` (validated via background log marker: `PNPM_CHECK_LOG_STATUS:PASS`).

## Next Batch — Batch L

- Run final closure sweep for remaining long-tail strict-rule deltas and documentation parity.
- Execute consolidated final verification and prepare end-of-cycle compliance handoff.

## Batch L — Final Closure Sweep + Verification Stabilization (Completed)

- Executed full strict-rule closure sweep with deterministic scanner coverage for:
  - `'use client'` + `export const metadata` collisions,
  - raw `process.env` outside approved exceptions (`lib/env.ts`, `proxy.ts`),
  - forbidden imports/usages (`framer-motion`, `react-router-dom`, `nodemailer`, raw `<img>`),
  - forbidden `middleware.ts` reintroduction.
- Sweep result: all checks passed (`BATCH_L_SWEEP_STATUS:PASS`).
- Verification gates completed:
  - `pnpm build && pnpm test && pnpm exec biome check .` ✅
  - `pnpm check` ✅ (re-run with `NODE_OPTIONS=--max-old-space-size=8192` after initial Windows Turbopack OOM condition).
- Removed temporary scan helper artifact (`.tmp_batch_l_sweep.py`) after successful completion.

## Next Batch — None (Cycle Closed)

- FINAL_STACK remediation sequence is complete and ready for consolidated handoff.

## Batch M — Post-Audit Legacy Cleanup (Completed)

- Removed legacy mock authentication artifacts and localStorage auth context:
  - deleted `lib/mockAuth.ts`
  - deleted `context/AuthContext.tsx`
  - migrated client auth consumers to Auth.js `useSession()` / `signIn()` / `signOut()`
  - added Auth.js server config and route handler:
    - `lib/auth.ts`
    - `app/api/auth/[...nextauth]/route.ts`
- Hardened build resilience for Google Fonts in `src/app/layout.tsx` with explicit font fallback and fallback adjustment.
- Updated CI/runtime scripts for compliance:
  - `package.json` now includes `e2e:install` and `test:e2e` with `pnpm exec playwright install --with-deps`
  - added `tsx` dev dependency declaration
  - modernized `.github/workflows/ci.yml` from npm/eslint/prettier flow to pnpm + Biome + Playwright browser install.
- Hardened API behavior to prevent fake-success production responses:
  - `app/api/checkout/route.ts` now returns explicit `501` when Stripe/checkout backend requirements are unavailable
  - `app/api/booking/route.ts` now returns explicit `501` when DB is unavailable
  - `app/api/contact/route.ts` now returns explicit `501` when email provider config is unavailable
- Rewrote `README.md` to remove Vite/SPA references and align stack docs with Next.js 16 App Router architecture.

## Batch M — Verification Status

- Tooling blocker: direct `pnpm` command not available in PATH in this shell session.
- Confirmed `corepack pnpm` is available; verification commands should run through Corepack in this environment.