# Hylono — `to_fix_yet.md`

Generated: 2026-02-18 (reconciliation pass)
Scope: unresolved/not-yet-fixed items extracted from reviewed audit/report docs and cross-verified against current code where feasible.

## Processed source documents
- `F:\ag projects\Hylono - fresh\FILE_LOCATION_REMEDIATION_REPORT.md`
- `F:\ag projects\Hylono - fresh\VERIFICATION_REPORT.md`
- `F:\ag projects\Hylono - fresh\reports\CEO_AUDIT_V1_2026-02-17.md`
- `F:\ag projects\Hylono - fresh\reports\CEO_AUDIT_V1_2026-02-18.md`
- `F:\ag projects\Hylono - fresh\reports\CEO_AUDIT_V2_2026-02-17.md`
- `F:\ag projects\Hylono - fresh\reports\CEO_AUDIT_V3_2026-02-17.md`
- `F:\ag projects\Hylono - fresh\OPEN_ISSUES.md` (canonical unresolved tracker; retained)

---

## Unresolved items (reconciled)

| ID | Item | Priority | Source references | Current code verification |
|---|---|---|---|---|
| TFY-001 | Team page uses anonymous placeholders (E-E-A-T gap) | High | CEO_AUDIT_V1_2026-02-17 (Critical #1), CEO_AUDIT_V3_2026-02-17 (Critical #1), OPEN_ISSUES `[CONTENT-02]` | **Unresolved.** `components/AboutPage.tsx` still has placeholder profiles (`Founder & CEO`, `CTO`) instead of real names/credentials. |
| TFY-002 | API layer architecture mismatch (`app/api/route.ts` dead in Vite SPA) | P0 | OPEN_ISSUES `[TASK-018]`, CEO_AUDIT_V1/V2/V3 API audit items | **Unresolved/blocker.** `app/api/README.md` explicitly states current route handlers are dead without architecture decision. |
| TFY-003 | Prisma client not generated (`src/generated/prisma-client` missing) | P0 | OPEN_ISSUES `[TASK-019]` | **Unresolved.** `src/generated` is empty in current directory listing; generation still pending architecture direction. |
| TFY-004 | Auth is still mock-only | P0 | OPEN_ISSUES `[TASK-020]` | **Unresolved.** `lib/mockAuth.ts` remains localStorage/mock-session based. |
| TFY-005 | Stripe server SDK in `devDependencies` while backend remains unresolved | High | OPEN_ISSUES `[TASK-001]` | **Resolved (Batch 1, 2026-02-19).** `stripe` removed from root package manifests; `src/lib/stripe.ts` now hard-fails intentionally until TASK-018 backend architecture is decided. |
| TFY-006 | CE / ISO 13485 claims require legal substantiation | High | OPEN_ISSUES `[TASK-002]` | **Risk mitigated (Batch 1).** `components/CertificationBadges.tsx` now uses non-definitive wording (`CE Documentation Review`, `ISO 13485 Readiness`). Final legal substantiation remains required before publishing formal certification claims. |
| TFY-007 | Cookie consent shown with 2-second delay (timing compliance risk) | Medium | CEO_AUDIT_V1/V2/V3 cookie timing findings | **Resolved (Batch 1, 2026-02-19).** `components/CookieConsent.tsx` no longer delays consent prompt; banner now appears immediately when consent is missing/invalid/corrupt. |
| TFY-008 | Accessibility compliance evidence not documented (axe/WCAG proof gap) | Medium | CEO_AUDIT_V1/V2/V3 accessibility findings | **Partially resolved (governance scaffold added).** `reports/A11Y_BASELINE_2026-02-19.md` now documents baseline evidence protocol; automated scans + manual verification still pending. |
| TFY-009 | Mobile navigation lacks recorded real-device verification evidence | Medium | CEO_AUDIT_V1/V2 mobile nav findings | **Unresolved (verification gap).** No explicit iOS/Android verification evidence found in reviewed docs. |
| TFY-010 | Footer tech links use string paths instead of typed nav API | Low | CEO_AUDIT_V1_2026-02-18 (Low backlog #6) | **Resolved (Batch 1, 2026-02-19).** `components/Layout.tsx` footer technology links now use typed `TechType` navigation via `setCurrentPage('detail', tech)`. |
| TFY-011 | Performance budget / Lighthouse CI governance not implemented | Low | CEO_AUDIT_V1/V2/V3 perf findings, OPEN_ISSUES `[PERF-02]` | **Partially resolved (governance scaffold added).** `lighthouserc.json` and `reports/PERFORMANCE_GOVERNANCE_2026-02-19.md` added; CI wiring + baseline runs still pending. |

---

## Older audit claims now considered outdated / already addressed

These were reviewed and excluded from unresolved list because current code evidence indicates they are already fixed or no longer accurate:

1. Missing hreflang tags → `index.html` includes alternates (`en`, `de`, `pl`, `nl`, `x-default`).
2. Missing server-side security headers → `vercel.json` includes HSTS, `X-Frame-Options`, `X-Content-Type-Options`.
3. Rental messaging absent from homepage/hero → rental CTA/messaging exists in current hero/home flow.
4. Clinical review date metadata missing → `TechDetail.tsx` renders review metadata and `constants.ts` includes `lastReviewed`/`reviewedBy` on core entries.
5. Structured data missing reviews/ratings → `components/StructuredData.tsx` includes `review` and `aggregateRating` support.
6. Blank-page/dead-CTA routing incidents from 2026-02-18 audit → documented as fixed in `reports/CEO_AUDIT_V1_2026-02-18.md`.

---

## Notes
- `FILE_LOCATION_REMEDIATION_REPORT.md` and `VERIFICATION_REPORT.md` are infrastructure/control-panel checks and both report successful status for their scope.
- `OPEN_ISSUES.md` remains the canonical active tracker and should be maintained as the source of truth moving forward.

## Batch 1 verification snapshot (2026-02-19)
- ✅ `npm run typecheck` passes for the Vite workspace after isolating the separate `control-panel` Next.js workspace in root `tsconfig.json`.
- ✅ `npm run build` passes (warnings only).
- ⚠️ `npm run lint` now executes (no zod/react-hooks crash), but still reports large pre-existing baseline issues outside this fix batch.
