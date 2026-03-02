# Errors & Resolutions Log

## 2026-03-01 — Batch M (T3 runtime verification continuation: route/auth parity + stability preflight)

### Issue 21
- **Symptom:** Local Playwright runs were intermittently unstable under default parallelism, causing high memory pressure before full-suite verification.
- **Root Cause:** Worker count was not constrained for local development, so test execution could fan out beyond available memory headroom on this machine.
- **Resolution:** Added deterministic worker resolver in `playwright.config.ts` with local default fallback to `1` worker, preserving CI behavior while allowing explicit override via `PLAYWRIGHT_WORKERS`.
- **Outcome:** Local E2E execution now starts from a memory-stable baseline for T3 reruns.

### Issue 22
- **Symptom:** Unauthenticated protected-route access (`/dashboard`, `/account`, `/partner`) did not enforce the required redirect destination contract (`/login`).
- **Root Cause:** Proxy auth gate flow redirected to a generic path instead of the explicit login route expected by runtime verification requirements.
- **Resolution:** Updated `proxy.ts` protected-route branch to redirect to `/login` and preserve full requested path/query via `next` parameter; retained Nosecone header application on redirect response.
- **Outcome:** Auth boundary now routes unauthenticated protected requests to `/login?auth=required&next=...` as required.

### Issue 23
- **Symptom:** E2E route expectations referenced `/store`, but app-layer route parity was incomplete.
- **Root Cause:** Canonical implementation existed in `src/app/store/page.tsx`, but missing wrapper in `app/store/page.tsx` created route mismatch risk.
- **Resolution:** Added app-layer re-export wrapper (`app/store/page.tsx`) for `metadata` and default export from `src/app/store/page`.
- **Outcome:** `/store` route now resolves through the app boundary consistently with E2E expectations.

### Issue 24
- **Symptom:** Proxy auth redirect target `/login` was missing as an explicit route.
- **Root Cause:** Account auth UI existed, but no dedicated `/login` page route was defined at app level.
- **Resolution:** Added `app/login/page.tsx` with server-side metadata via `createPageMetadata` and reused existing `AccountClient` UI.
- **Outcome:** `/login` route now exists and supports protected-route redirect flow end-to-end.

### Verification
- Pending runtime reruns in this batch:
  - `pnpm exec playwright test` (full suite)
  - `pnpm exec playwright test --project=a11y` (if project configured)
  - MCP/browser runtime checks (hydration, CSP/PostHog EU, auth redirect, dynamic route stability, mutation flow)

## 2026-03-01 — Batch L (Final closure sweep + verification stabilization)

### Issue 19
- **Symptom:** Final strict-rule closure one-liner in PowerShell failed repeatedly with parser/binding instability (`ForEach-Object` / `-Raw` composition errors).
- **Root Cause:** Complex nested quoting/escaping in an inline multi-condition command made parameter parsing brittle in Windows PowerShell.
- **Resolution:** Replaced brittle one-liner with deterministic scripted sweep execution (`.tmp_batch_l_sweep.py`) covering all closure checks (client+metadata collision, raw env exceptions, forbidden imports/usages, `middleware.ts` reintroduction), then removed the temporary script after successful execution.
- **Outcome:** Closure sweep now produced stable deterministic output and passed (`BATCH_L_SWEEP_STATUS:PASS`).

### Issue 20
- **Symptom:** `pnpm check` initially failed with Windows Turbopack/Node heap pressure (`Zone Allocation failed - process out of memory`).
- **Root Cause:** Combined check pipeline (`biome check . && next build && vitest run`) intermittently exceeded default Node heap during Turbopack build on this host.
- **Resolution:** Re-ran with explicit memory cap (`NODE_OPTIONS=--max-old-space-size=8192`).
- **Outcome:** `pnpm check` completed successfully with full build/test/biome coverage.

### Verification
- `python .tmp_batch_l_sweep.py` ✅ (`BATCH_L_SWEEP_STATUS:PASS`)
- `pnpm build && pnpm test && pnpm exec biome check .` ✅
- `pnpm check` ✅ (stabilized rerun with `NODE_OPTIONS=--max-old-space-size=8192`)

## 2026-03-01 — Batch K (Non-navigation strict-rule hardening)

### Issue 16
- **Symptom:** Residual raw env access persisted outside `lib/env.ts` in runtime-supporting files (`utils/featureFlags.ts`, `config/featureFlags.ts`, `instrumentation.ts`, `playwright.config.ts`) and tests.
- **Root Cause:** Earlier sweeps prioritized app/runtime paths; legacy utilities and test harness config still relied on direct `process.env` access/mutation.
- **Resolution:** Added centralized env helpers in `lib/env.ts` and migrated affected runtime/test call sites to helper-based env reads/writes.
- **Outcome:** Non-env runtime/test files now use centralized env access boundary, reducing policy drift and improving consistency.

### Issue 17
- **Symptom:** `playwright.config.ts` used `npm run dev`, conflicting with workspace command policy (`pnpm` only).
- **Root Cause:** Legacy Playwright scaffold retained npm default command string.
- **Resolution:** Updated Playwright `webServer.command` to `pnpm dev` while preserving the rest of the config behavior.
- **Outcome:** Test orchestration command policy is now aligned with workspace standards.

### Issue 18
- **Symptom:** E2E partner dashboard assertion depended on env-composed absolute URL fallback, creating brittle behavior across environments.
- **Root Cause:** Assertion logic coupled redirect expectations to a specific base URL composition pattern.
- **Resolution:** Replaced absolute URL comparison with path-based assertion (`new URL(page.url()).pathname`) to validate intended route outcomes consistently.
- **Outcome:** E2E redirect/auth-gate assertion is now environment-agnostic and less fragile.

### Verification
- `pnpm build` ✅
- `pnpm test` ✅ (92/92)
- `pnpm exec biome check .` ✅
- `pnpm check` ✅ (`PNPM_CHECK_LOG_STATUS:PASS`)

## 2026-03-01 — Batch I (Internal navigation compliance hardening)

### Issue 14
- **Symptom:** Internal route links in `components/OrderSuccessPage.tsx` (`/terms`, `/warranty`) were rendered via raw `<a href>`.
- **Root Cause:** Legacy component implementation used anchor tags universally for document links, without differentiating internal App Router navigation.
- **Resolution:** Imported `next/link` and replaced internal document anchors with `<Link href={...}>` for route-aware client navigation.
- **Outcome:** Internal route navigation now follows Next.js App Router conventions in order-success UX flow.

### Issue 15
- **Symptom:** Mega menu link primitives (`TechHoloCard`, `GlassLink`, `SimpleLink`) rendered all provided `href` values as anchors, including internal routes.
- **Root Cause:** Component abstraction prioritized SEO crawlability but did not classify internal-vs-external href behavior.
- **Resolution:** Added `isInternalHref` classifier in `components/MegaMenu/MegaMenuSection.tsx`; internal paths now render via `next/link`, while external/hash/mailto/tel remain `<a>`.
- **Outcome:** Internal mega-menu navigation is App Router compliant without regressing external-link semantics.

### Verification
- `pnpm build` ✅
- `pnpm test` ✅ (92/92)
- `pnpm exec biome check .` ✅
- `pnpm check` ✅ (background log pass: build + tests + biome, no failure markers)

## 2026-03-01 — Batch A (Proxy + Layout hardening)

### Issue 1
- **Symptom:** Arcjet `detectBot` allow-list type mismatch (`string[]` not assignable).
- **Root Cause:** Allow-list was inferred as generic strings, but Arcjet expects bot category literal union.
- **Resolution:** Typed allow-list as `ArcjetBotCategory[]`.
- **Outcome:** Arcjet rule configuration compiles correctly.

### Issue 2
- **Symptom:** Nosecone CSP directive typing error when extending `scriptSrc` with mixed defaults and literals.
- **Root Cause:** Dynamic/function source entries in Nosecone defaults made naive array extension incompatible with strict CSP source types.
- **Resolution:** Kept default `scriptSrc` unchanged and extended only `connectSrc` with explicit valid host sources.
- **Outcome:** CSP configuration type-safe and build passes.

### Issue 3
- **Symptom:** Build failed with blocking-route prerender errors for `/_not-found` and `/learning` after introducing `connection()`.
- **Root Cause:** Uncached per-request boundary impacted layout rendering path without sufficient suspense segmentation for client leaves.
- **Resolution:** Refactored layout to async child (`RootLayoutContent`) wrapped in `<Suspense>`, and wrapped `Header`, `Footer`, `GlobalOverlays` in explicit suspense boundaries.
- **Outcome:** Next.js build completes with route generation and partial prerender intact.

### Verification
- `pnpm build` ✅
- `pnpm test` ✅ (92/92)
- `pnpm exec biome check .` ✅

## 2026-03-01 — Batch G/H (Pre-flight synchronization + PostHog EU endpoint hardening)

### Issue 12
- **Symptom:** Batch G completion was fully reflected in `docs/FINAL_STACK.MD` but not mirrored in all operational logs (`tasks/active_plan.md`, `errors.md`) in the same cycle.
- **Root Cause:** Continuation resumed directly into technical pre-flight sweeps, and log synchronization was deferred instead of being closed atomically.
- **Resolution:** Added explicit Batch G completion section and Batch H plan in `tasks/active_plan.md`; recorded mirrored reconciliation in `errors.md`.
- **Outcome:** Canonical + operational logs are now synchronized for batch continuity.

### Issue 13
- **Symptom:** Non-EU PostHog endpoint (`https://us.i.posthog.com`) remained in CSP/connect allowlists (`proxy.ts` + `vercel.json`), conflicting with strict EU analytics routing expectations.
- **Root Cause:** Legacy CSP templates carried forward mixed-region PostHog hosts during earlier security hardening.
- **Resolution:** Removed `https://us.i.posthog.com` from `proxy.ts` `CSP_CONNECT_SOURCES` and `vercel.json` CSP `connect-src`.
- **Outcome:** Runtime security surfaces are aligned to EU PostHog host policy (`https://eu.i.posthog.com`) while preserving existing build/test checks.

### Verification
- `pnpm build` ✅
- `pnpm test` ✅ (92/92)
- `pnpm exec biome check .` ✅
- `pnpm check` ✅

## 2026-03-01 — Batch E/F (Trigger + Uploadthing + Cache baseline)

### Issue 8
- **Symptom:** Build failed with `Module '"@trigger.dev/sdk"' has no exported member 'defineConfig'` in `trigger.config.ts`.
- **Root Cause:** Installed SDK (`@trigger.dev/sdk@3.3.17`) exposes `defineConfig` through the v3 subpath, not the root package export used initially.
- **Resolution:** Switched import to `@trigger.dev/sdk/v3`.
- **Outcome:** Trigger config helper resolves correctly and TypeScript import error is eliminated.

### Issue 9
- **Symptom:** Build failed with `TriggerConfig` type error requiring `maxDuration`.
- **Root Cause:** Current Trigger config schema in installed SDK version requires a default `maxDuration` field.
- **Resolution:** Added `maxDuration: 300` to `trigger.config.ts`.
- **Outcome:** Trigger config now satisfies required `TriggerConfig` shape.

### Issue 10
- **Symptom:** Build failed with `cacheLife('feed')` overload mismatch.
- **Root Cause:** In this runtime/types combination, string profile signature was not accepted for `cacheLife`; object profile overload was expected.
- **Resolution:** Replaced string profile call with explicit object form (`cacheLife({ stale, revalidate, expire })`).
- **Outcome:** Cache baseline compiles cleanly while preserving intended lifetime semantics.

### Issue 11
- **Symptom:** Compliance drift remained in Uploadthing middleware due to raw `process.env` usage.
- **Root Cause:** Newly added scaffold was not fully aligned with strict env boundary rule (`lib/env.ts` only).
- **Resolution:** Imported `env` from `@/lib/env` and replaced raw env access in `app/api/uploadthing/core.ts`.
- **Outcome:** Uploadthing scaffold now follows central env validation boundary.

### Verification
- `pnpm build` ✅
- `pnpm test` ✅ (92/92)
- `pnpm exec biome check .` ✅
- `pnpm check` ✅

## 2026-03-01 — Batch C.1 (Continuation sync + unresolved scope confirmation)

### Issue 6
- **Symptom:** Batch continuation notes were partially logged only in `docs/FINAL_STACK.MD`, leaving operational drift across required task logs.
- **Root Cause:** Prior remediation pass updated the canonical stack log but did not mirror entries into `tasks/active_plan.md` and `errors.md` in the same cycle.
- **Resolution:** Synchronized continuation state in `tasks/active_plan.md` and documented this reconciliation step in `errors.md` before resuming implementation batches.
- **Outcome:** Batch tracking is now aligned across all required log files for downstream remediation.

### Issue 7
- **Symptom:** Observability/integration remediation scope for Batch D was not fully codified in the active plan, risking duplicate discovery work.
- **Root Cause:** Gap inventory was gathered ad-hoc through searches but not consolidated into a single execution checkpoint.
- **Resolution:** Consolidated unresolved items into Batch C.1 / Next Batch D plan entries (Sentry runtime files, safe-action baseline, Uploadthing, Trigger.dev, cache API usage).
- **Outcome:** Implementation can proceed in atomic batches with deterministic targets and verification gates.

## 2026-03-01 — Batch B (Exact pin normalization)

### Issue 4
- **Symptom:** Dependency policy non-compliance persisted (`^`/`~` ranges remained in `package.json`).
- **Root Cause:** Earlier migrations focused on runtime fixes and package set completeness, but did not enforce exact versions uniformly.
- **Resolution:** Rewrote all ranged dependency/devDependency specs to exact versions and synchronized `pnpm-lock.yaml`.
- **Outcome:** Dependency declarations now satisfy FINAL_STACK exact pin standard.

### Issue 5
- **Symptom:** `pnpm install --lockfile-only` reported a peer warning (`@trigger.dev/sdk` expects `zod@^3`, workspace uses Zod 4).
- **Root Cause:** Upstream peer range lag for Trigger SDK vs current project schema stack.
- **Resolution:** Preserved project-mandated Zod 4, validated runtime/build/test stability, and documented warning as non-blocking.
- **Outcome:** Verification gate remains green; warning tracked for future dependency upgrade window.

### Verification
- `pnpm build` ✅
- `pnpm test` ✅ (92/92)
- `pnpm exec biome check .` ✅