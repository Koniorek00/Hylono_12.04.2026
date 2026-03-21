# Active Context
> Last updated: 2026-03-04 by architect-orchestrator

## Current Focus
Site-audit remediation closure continuation for M-01, M-04, M-05, and governance hygiene parity in docs/registry/check pipeline. Immediate next focus after this batch remains medium-priority consolidation (MED-01 motion/CSS modularization, MED-03 navigation mapper unification).

## Session State
- Branch: `chore/push-current-state-2026-03-03`
- Blocked by: Nothing
- Waiting on: Nothing

## Recent Changes (last 2-3 sessions only)
- [2026-03-03] HIGH-03 closure reconfirmed via TSX scans (`app/**`, `components/**`, `src/components/**`) with 0 internal `<a href="/...">` matches.
- [2026-03-03] HIGH-04 conversion APIs hardened to Drizzle persistence (`lib/db/schema.ts`, `lib/db/client.ts`, `app/api/{contact,booking,checkout,newsletter,rental}/route.ts`) with degraded-mode responses and test coverage.
- [2026-03-03] HIGH-05 consent parity completed in `components/CookieConsent.tsx` + `tests/components/CookieConsent.test.tsx` (returning-visitor cookie synchronization).
- [2026-03-03] HIGH-06 verified closed (`app/hho-car-kit/page.tsx` uses first-party request hints only, no outbound geolocation API fetch).
- [2026-03-03] HIGH-01 stabilized: legacy SPA shell (`App.tsx`, `components/AppRouter.tsx`, `components/AppProviders.tsx`) marked deprecated and excluded from active compile path in `tsconfig.json`.
- [2026-03-03] HIGH-02 closed: `src/proxy.ts` confirmed shim-only canonical re-export of root `proxy.ts`.
- [2026-03-03] Verification evidence captured from completed background run: `pnpm check` ✅ (`verify-audit-tooling`, Biome, build, Vitest 9 files / 106 tests).
- [2026-03-04] HIGH-01 final closure confirmed: `App.tsx`, `components/AppRouter.tsx`, `components/AppProviders.tsx`, and `components/Layout.tsx` are removed from working tree.
- [2026-03-04] Active boundary verified: `app/login/LoginClient.tsx` and `app/account/AccountClient.tsx` still import `@/components/AuthComponents` (active module, outside removed shell boundary).
- [2026-03-04] CRIT-01/CRIT-02 tooling restoration evidence captured: `.mcp.json` has `semgrep-mcp` + `biomcp` enabled; `node scripts/verify-audit-tooling.cjs` ✅; `pnpm run security:semgrep:local` ✅ command execution.
- [2026-03-04] H3 closed with deterministic governance enforcement: `scripts/check-page-decisions.cjs` validated and all missing route-level `[DECISION: ...]` annotations added across `app/**/page.tsx`.
- [2026-03-04] M2 closed with registry parity automation: `scripts/check-component-registry-parity.cjs` added; `.agent/registry/components.md` corrected for `QuickSupport` and `HomeTestimonialsSection`; missing client directives fixed in `components/CookieConsent.tsx` and `src/components/ui/Multitool/components/PeekTooltip.tsx`.
- [2026-03-04] M3 closed by expanding local Semgrep scan surface in `package.json` to `app`, `components`, `src`, `lib`, and runtime proxy/instrumentation files.
- [2026-03-04] Verification gate passed end-to-end: `pnpm run audit:page-decisions` ✅, `pnpm run audit:registry-parity` ✅, `pnpm run security:semgrep:local` ✅, `pnpm exec biome check .` ✅, `pnpm build` ✅, `pnpm check` ✅ (9 files / 106 tests).
- [2026-03-04] M-01 completed: added tokenized spotlight utility (`.home-science-spotlight`) in `app/styles/base.css`, removed hardcoded rgba motion hover literals from `components/home/HomeScienceSection.tsx` and `components/home/HomeTestimonialsSection.tsx`, and integrated `scripts/check-marketing-token-drift.cjs` into `package.json` (`audit:token-drift` + `check`).
- [2026-03-04] M-04 completed: added explicit Next.js 16 runtime terminology clarification in `docs/component-layer-policy.md` (canonical policy boundary is `proxy.ts`, even if build logs say “middleware”).
- [2026-03-04] M-05 completed: expanded `tests/utils/sanitization.test.ts` with `sanitizeHtml` regression coverage for script/style/iframe payloads, inline event handlers/javascript: URLs, and form submission primitives.
- [2026-03-04] L-02 hygiene hardening: annotated `docs/decisions/ADR-MCP-OPTIMIZATION.md` as historical/non-authoritative with `.clinerules` supersedence note to prevent stale governance interpretation.
- [2026-03-04] Registry sync updated for extracted home modules and testimonials page classification in `.agent/registry/components.md`; `components/TestimonialsPage.tsx` explicitly marked with `"use client"` for parity checks.

## Next Steps (ordered)
1. [ ] Execute MED-01: modularize global motion/CSS scope (`app/styles/motion.css`) and document token/loading boundaries.
2. [ ] Execute MED-03: unify navigation mapping adapters into one typed canonical mapper.
3. [ ] Maintain new audit governance checks (`audit:page-decisions`, `audit:registry-parity`) as non-bypassable quality gates.
4. [ ] Maintain CRIT-01/CRIT-02 baseline discipline in CI and content workflows (no channel regressions).
5. [ ] Re-run full verification (`pnpm check`) after medium-priority implementation changes and synchronize artifacts atomically.

## Active Decisions Pending
- [PENDING: MED-01 modularization boundary — determine highest-level token/loading split that reduces global motion scope without visual regressions.]

## Session Notes
Current audit state in strict sequence: HIGH-01/02/03/04/05/06 closed; CRIT-01 and CRIT-02 tooling restoration closed; medium-priority consolidation remains.

---
⚠️ PRUNING: When this file exceeds 80 lines, move completed items
to project-state.md and delete resolved pending decisions.