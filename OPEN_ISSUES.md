# HYLONO — OPEN ISSUES (Consolidated)
**Last updated:** 2026-02-19 | Consolidated from 7 prior audit/plan files  
**Cross-referenced against:** project-state.md, handoff-queue.md, package.json  
**Rule:** Work items only appear here if NOT already fixed + confirmed in code. Items already tracked in `.agent/memory/active/handoff-queue.md` are noted with their TASK-ID.

---

## 🔴 P0 — Launch Blockers (owner decision required first)

### [→ TASK-018] Architecture Decision: Dead API Layer ✅ DECISION RATIFIED 2026-02-19
`app/api/` contains Next.js `route.ts` handlers — dead code in Vite SPA. Contact forms, newsletter, checkout, bookings, auth all silently fail.
- **Decision:** Option A — Vite SPA + Separate Node API Backend (see `reports/TASK-018_RUNTIME_ARCHITECTURE_DECISION_PACKAGE.md`)
- **Implementation status:** Decision complete, implementation pending
- **Files:** `app/api/` (reference-only), `reports/TASK-018_RUNTIME_ARCHITECTURE_DECISION_PACKAGE.md`, `.agent/memory/decisions.md`
- **Blocks:** All backend tasks below — now unblocked for TASK-019/TASK-020 execution

### ~~[→ TASK-019] Prisma Client Never Generated~~ ✅ COMPLETED 2026-02-19
`prisma generate` has never been run. `src/generated/prisma-client/` does not exist. Any code importing from it will fail at runtime.
- **Fix:** `npx prisma generate` after architecture decision
- **Files:** `prisma/schema.prisma`, `prisma.config.ts`
- **Verification:** Generated to `src/generated/prisma-client/` (2026-02-19); required Prisma 7.x config fix (removed `url` from schema.prisma, now in prisma.config.ts)

### [→ TASK-020] Authentication is 100% Mock
`lib/mockAuth.ts` — no real user system. No passwords are actually verified. No sessions. Blocked on TASK-018.
- **Files:** `lib/mockAuth.ts`, `context/AuthContext.tsx`, `components/AuthComponents.tsx`

---

## 🔴 P0 — Security

### ~~[SEC-01] CSP `unsafe-inline` in `script-src`~~ ✅ FIXED 2026-02-18
`index.html` now has `script-src 'self'` — no `unsafe-inline`. Confirmed in code.

### ~~[SEC-02] Missing `frame-ancestors` in CSP — Clickjacking~~ ✅ FIXED 2026-02-18
`frame-ancestors 'none'` is present in `index.html` CSP meta tag. Confirmed in code.

### ~~[SEC-03] `target="_blank"` Missing `rel="noopener noreferrer"`~~ ✅ FIXED 2026-02-18
All social links in `Layout.tsx` footer and `MeridianPage.tsx` have `rel="noopener noreferrer"` + `aria-label`. Confirmed in code.

### ~~[TASK-001] Stripe Server SDK in `devDependencies`~~ ✅ FIXED 2026-02-19 (Batch 1)
`stripe` was removed from root package manifests. `src/lib/stripe.ts` now explicitly throws a disabled-server-client error until TASK-018 architecture is finalized.
- **Follow-up:** Re-introduce server-side Stripe SDK only in real backend runtime after architecture decision.
- **Files:** `package.json`, `package-lock.json`, `src/lib/stripe.ts`

### ~~[SEC-04] Verify DOMPurify Is Actually Used~~ ✅ FIXED 2026-02-18
Confirmed in code: `BlogArticle.tsx` uses `DOMPurify.sanitize()` via `utils/sanitization.ts`. `ResearchHub.tsx` uses `<SmartText>` component — no `dangerouslySetInnerHTML` present at all.

### [→ TASK-002] CE + ISO 13485 Claims Need Legal Verification
Marketing copy was softened in Batch 1 (`CE Documentation Review`, `ISO 13485 Readiness`), but formal legal substantiation is still required before publishing definitive certification claims.
- **Batch 1 mitigation:** `components/CertificationBadges.tsx` now uses non-definitive wording and explicit verification note.
- **Still required to close:** Notified Body/certification numbers + legal signoff across all public certification surfaces.
- **Files:** `components/CertificationBadges.tsx`, `components/Hero46T2/HeroPhilosophy.tsx`, `components/Hero46T2/HeroEcosystem.tsx`

---

## 🟠 P1 — Accessibility (WCAG 2.1 AA — legal requirement in EU)

### ~~[A11Y-01] Icon Buttons Missing `aria-label` in Layout.tsx~~ ✅ FIXED 2026-02-18
Mobile menu toggle has `aria-label` + `aria-expanded`. Cart + user buttons have `aria-label`. Confirmed in Layout.tsx code.

### ~~[A11Y-02] Form Inputs Missing `<label>` Associations~~ ✅ FIXED 2026-02-18
All email inputs now have proper `<label htmlFor="...">` associations + `aria-label`. `Newsletter.tsx` has `newsletter-email-footer` + `newsletter-email-section` labels. `ContactPage.tsx` has labels on all wizard step inputs. `MeridianPage.tsx` footer email input now has `id="meridian-footer-email"`, `<label className="sr-only">`, `aria-label`, and subscribe button has `aria-label`. Confirmed in code.

### ~~[A11Y-03] Social Icon Links Missing Accessible Names~~ ✅ FIXED 2026-02-18
All footer social links in `Layout.tsx` have `aria-label` + `rel="noopener noreferrer"`. Confirmed in code.

### ~~[A11Y-04] CookieConsent Missing Granular Categories~~ ✅ FIXED 2026-02-18
`CookieConsent.tsx` has Essential (always-on), Analytics, and Marketing toggles. All non-essential default to `false` (opt-in). Confirmed in code.

### ~~[A11Y-05] CSP `img-src` / `connect-src` Use `https:` Wildcard~~ ✅ FIXED 2026-02-18
`index.html` CSP uses explicit domain allowlist (hylono.com, unsplash, gstatic, qrserver, posthog, etc.). No wildcards. Confirmed in code.

---


---

## 🟡 P2 — Performance

### ~~[PERF-01] No Vite Manual Chunk Splitting~~ ✅ FIXED 2026-02-18
`vite.config.ts` already has `build.rollupOptions.output.manualChunks` configured: `vendor-react`, `vendor-motion`, `vendor-icons`, `vendor-charts`, `vendor-maps`. Confirmed in code.

### [PERF-02] Large Components Never Split
Per component registry — these exceed reasonable size limits:
- `MegaMenu.tsx` — 49KB (split into MegaMenuContent, MegaMenuSection)
- `Hero46T2.tsx` — 61KB (split into HeroSection, HeroAnimation, HeroCTA)
- `HeroGpt.tsx` — 44KB
- `RentalCheckoutPage.tsx` — 43KB

### ~~[PERF-03] HeroGpt Lint Warnings~~ ✅ FIXED 2026-02-18
- `HeroGPT/HeroGPT.tsx` — added `HeroGPTProps` interface, `React.FC<any>` → `React.FC<HeroGPTProps>` ✅
- `HeroGPT/Version1.tsx` — added `WizardData` interface, `useState<any>({})` → `useState<WizardData>({})` ✅
- `wizardStep` — audited, no unused variable found in active files ✅
- `wizardData` — IS used in wizard UI (not unused), now properly typed ✅

---

## 🟡 P2 — Content & Brand

### [CONTENT-01] All Blog Articles are Mock Data
`BlogPage.tsx` + `BlogArticle.tsx` render from constants — no real CMS or articles.
- **Blocked on:** Content strategy + CMS decision

### [CONTENT-02] Fictional Team on About Page
`AboutPage.tsx` references fictional team members. Medtech credibility requires real people.
- **Blocked on:** Owner providing real team info

### [CONTENT-03] Multiple Chamber Page Versions — No Canonical
`HBOTCatalogPage.tsx`, `HBOTCatalogPage3.tsx`, `HBOTCatalogPage4.tsx`, `HBOTCatalogPage5.tsx`, `HBOTCatalogPageV2.tsx` — 5 versions. Unclear which is canonical. Bloat + confusion.
- **Fix:** Owner picks one canonical version; delete the rest

### [CONTENT-04] Orphan Tech Pages Not in Navigation — ✅ DOCUMENTED 2026-02-18
EWOT, EMS, VNS, HYPOXIC, CRYO, SAUNA_BLANKET have no MegaMenu entry point.
- **Routing status VERIFIED:** All 6 tech types ARE reachable via `/product/EWOT`, `/product/EMS`, etc. — `AppRouter.tsx` maps any valid `TechType` value through `TechDetail.tsx`. None are in the 404 list.
- **Current decision:** Intentionally omitted from MegaMenu navigation pending content readiness. Pages function correctly but are "hidden" — accessible by direct URL only.
- **Action required:** Owner to decide when each modality is ready for navigation exposure. When ready, add entry to `components/MegaMenu.tsx` or `components/MegaMenu/` under the appropriate category.
- **Files:** `components/AppRouter.tsx` (routing verified), `components/MegaMenu.tsx` (where to add entries)

### [CONTENT-05 → TASK-023] Research DOI Links Unverified
`ResearchHub.tsx` contains study citations — DOI links may be broken or incorrect.
- **Status update (2026-02-19):** Two DOI entries that returned hard 404 responses were removed from `constants/content.ts` (HBOT study + intermittent hypoxic training study) to avoid linking known-broken citations.
- **Remaining fix:** Verify all remaining DOI entries against PubMed/BioMCP evidence and replace query-only references with record-specific citations where possible.

### [TASK-023A] Frontend Contract/Path Consistency (Endpoint + Legal URL) — ✅ FIXED 2026-02-19
Resolved CEO report consistency mismatches between frontend calls/links and documented route contracts.
- **Fixed endpoint mismatch:** `components/BookDemoModal.tsx` now calls `POST /api/booking` (was `/api/book`).
- **Fixed legal link mismatch:** `components/CookieConsent.tsx` now links to `/privacy` (was `/legal/privacy`), matching `AppRouter` route keys.
- **Contract documentation added:** `app/api/README.md` now includes a frontend↔endpoint contract matrix and consistency rules.
- **Verification:** repo search confirms no `/api/book` or `/legal/privacy` usages remain in TSX; `npm run typecheck` passed (`artifacts/task023_typecheck.log`).

---

## 🔵 P3 — Codebase Hygiene

### [HYGIENE-01] Backup Directories Never Cleaned
- `backups/` — unknown contents
- `protected-ui-backup-2026-02-16/` — large backup from 2026-02-16
- **Fix:** Review contents, commit what matters, delete directories

### [HYGIENE-02] Test Coverage Governance Gap (not zero-tests)
Vitest and Playwright are configured **and test files exist** (`tests/` + `e2e/`).
Current gap is governance and depth (coverage thresholds, CI enforcement, and broader high-risk flow coverage), not missing test files.
- **Priority entry points to expand/standardize:** rental flow happy/error paths, partner auth edge cases, legal/compliance smoke assertions
- **Files:** `tests/`, `e2e/`, CI workflow config (`.github/workflows/`)

### [HYGIENE-03] `constants.ts` Root File — Large, Monolithic
23KB single constants file. Should be split by domain:
- `constants/products.ts`, `constants/protocols.ts`, `constants/themes.ts`
- **Files:** `constants.ts` (root)

### [HYGIENE-04] HHO Car Kit + Firesafe Brand Coherence
`HHOCarKitPage.tsx` (automotive) and `FiresafePage.tsx` (industrial) sit alongside premium wellness products. Unclear if intentional product line or leftover.
- **Blocked on:** Owner brand decision

---

## 🔵 P3 — Backend Features (all blocked on TASK-018)

These are **owner-approved backlog items** — implement only when explicitly requested:

| Feature | Status | Blocks |
|---------|--------|--------|
| Stripe checkout (purchase) | BLOCKED | TASK-018 architecture |
| Stripe rental subscription | BLOCKED | TASK-018 architecture |
| Real auth (register/login/sessions) | BLOCKED | TASK-018 architecture |
| Contact form backend | BLOCKED | TASK-018 architecture |
| Newsletter backend | BLOCKED | TASK-018 architecture |
| Booking demo backend | BLOCKED | TASK-018 architecture |
| Partner Hub real data | BLOCKED | TASK-018 + Prisma |
| Order management system | BLOCKED | TASK-018 + Prisma |
| Customer reviews | PENDING | Backend needed |
| Live chat integration | PENDING | Provider choice needed |
| Inventory management | PENDING | Backend needed |
| Email notifications | PENDING | Provider choice needed |
| Return/refund system | PENDING | Backend needed |
| Loyalty program backend | PENDING | Backend needed |
| Training progress tracking | PENDING | Prisma |
| Referral commission system | PENDING | Prisma |

---

## ✅ Confirmed Fixed (not tracked here, moved to project-state.md)

All items below were verified as fixed in actual source files and are recorded in `.agent/memory/project-state.md`:

- Tailwind v4 local install (CDN removed)
- LazyErrorBoundary.tsx created
- PostHog lazy-loaded post-GDPR-consent
- `any` types in AuthContext.tsx + mockAuth.ts
- FDA Cleared claim removed from 6 locations
- HSA/FSA replaced with EU trust signals
- Partner routes auth-gated with GatedView
- Home heroRef crash fixed
- HeroConceptSwitcher DEV-gated
- Press/Careers/LearningHub pages public + routed
- Medical Advisors + Wholesale pages exist + routed
- ConditionsPage disclaimer present
- Warranty page public
- `typecheck` + `format` + `format:check` scripts in package.json
- `@prisma/client` in production dependencies
- `eslint-config-next` not present in devDependencies
- OG images created, hreflang tags added, structured data currency fixed
- Duplicate skip-nav link removed (WCAG 2.4.1)
- Medical disclaimer amber section on Home page
- Testimonials rewritten (no specific outcome percentages)
- Footer entity fixed (removed INC. designation)
- CONSENT_KEY mismatch bug fixed in analytics.ts + CookieConsent.tsx

---

*This is the single source of truth for open issues. Update this file as items are fixed.*  
*Cross-reference: `.agent/memory/active/handoff-queue.md` for task assignments and agent routing.*
