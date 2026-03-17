# HYLONO SEO PHASE 2 FIX PROMPT

You are working in:

`F:\ag projects\Hylono_MAIN - SEO BOOST`

## Mission

Execute a source-first SEO remediation pass using the current repo state, not stale assumptions.

This is a focused SEO hardening task for a Next.js 16 application with a premium visual baseline that must remain intact.

Your goal is to move the site from "technically promising but not release-ready" to a state that can earn a clean production SEO sign-off.

This is not a redesign.
This is not a new IA or brand exercise.
This is not an excuse to add obvious SEO furniture to the UI.

---

## Current verified inputs

Treat the following as current repo facts unless you directly verify a newer state:

- latest repo audit report: `reports/seo-audit-2026-03-11.md`
- latest reported score: `4.4 / 10`
- `pnpm compliance:strict` currently fails with `94` issues across `38` files
- `pnpm build` is available
- `pnpm check` is available
- `pnpm compliance:strict` is available

Important source-state observations:

- dynamic route files already contain some `notFound()` and lowercase redirect handling:
  - `app/product/[tech]/page.tsx`
  - `app/conditions/[slug]/page.tsx`
  - `app/protocols/[slug]/page.tsx`
  - `app/blog/[slug]/page.tsx`
- root metadata in `app/layout.tsx` still lacks a branded `title.template`
- product metadata still uses a generic `| Product Details` suffix in `app/product/[tech]/page.tsx`
- `components/partner/ReferralConnect.tsx` still hardcodes a `https://hylono.com/...` referral URL
- `constants/chambers.ts` still contains third-party `oxyhelp.com` asset URLs
- the locator route is still a strategic SEO decision point:
  - `app/locator/page.tsx` uses `forceNoIndex: true`
  - `app/locator/LocatorClient.tsx` keeps the interactive experience client-only
  - the route does include `noscript` content and `ItemList` schema, so do not assume it is unchanged from older audits
- several key routes still rely heavily on `sr-only` SEO summaries rather than visible answer-first copy

Do not blindly re-fix findings that source inspection shows are already addressed.
Verify first, then edit.

---

## Non-negotiable design rule

Do not redesign the site.
Do not flatten premium sections.
Do not replace existing layouts with generic SEO templates.
Do not add visible SEO blocks that feel bolted on.
Do not alter spacing rhythm, information density, or premium tone unless a tiny change is required for visible answer-first clarity.

Any visible copy additions must look native to the current design system.

---

## Non-negotiable compliance rule

This repo operates in a wellness / health-adjacent context.

That means:

- no fake authority
- no fake expert signals
- no fake testimonials or outcomes
- no unsupported medical claims
- no weakening of existing disclaimers just to get a green tool result
- no broad suppression of compliance tooling

If a compliance issue and an SEO improvement conflict, solve both properly or document the blocker.

---

## Execution posture

Use this order of reasoning:

1. Verify whether the claimed issue is still reproducible.
2. If it is still open, implement the smallest durable fix.
3. If it is already fixed in source, prove it with runtime verification and close it.
4. If the issue is external to the repo, document it as a release blocker instead of pretending code can solve it.

Every major finding in the final report must be labeled as one of:

- `fixed in this pass`
- `already fixed in source, verified`
- `external blocker`
- `deferred with reason`

---

## Exact repair scope

### 1. Host integrity and entity consistency

Keep `https://hylono.eu` as the primary host unless the repo owner explicitly changes that policy.

You must:

- remove or normalize remaining wrong-domain internal absolute URLs
- ensure canonical tags, metadata, JSON-LD, robots, sitemap, and internal absolute links consistently reinforce the same primary host
- review third-party media asset URLs and document why they are acceptable if they must remain external
- make sure third-party asset URLs are not being used as brand-host or canonical signals

Known review targets:

- `components/partner/ReferralConnect.tsx`
- `constants/chambers.ts`
- any remaining `hylono.com` references outside historical docs or archived evidence

Important:
The repo audit says public host alignment is still a critical blocker.
Code changes alone do not resolve DNS or deployment drift.
If the app is still not live on the intended host, report it as an external release blocker.

---

### 2. Runtime crawlability verification and soft-404 elimination

This remains the highest-priority code-level SEO risk until proven closed in a production build.

Do not assume the route guards are enough just because they exist in source.
You must prove behavior from a production build / `next start`.

Route families to verify:

- `app/product/[tech]/page.tsx`
- `app/conditions/[slug]/page.tsx`
- `app/protocols/[slug]/page.tsx`
- `app/blog/[slug]/page.tsx`

Required behavior:

- invalid slug => real `404`
- wrong-case slug => either real `404` or an explicit canonical redirect
- no route returns `200` with a visible "not found" body
- invalid routes do not emit indexable metadata
- invalid routes do not emit misleading canonicals or valid-page schema

Example URLs to verify locally against `next start`:

- `/product/not-a-real-tech`
- `/conditions/not-a-real-condition`
- `/protocols/not-a-real-protocol`
- `/blog/not-a-real-post`
- `/product/HBOT`
- `/conditions/Recovery`
- `/protocols/Recovery-Oxygen-Foundation`
- `/blog/Example-Post`

If runtime verification shows the soft-404 issue is already closed, record that clearly and do not over-engineer new routing logic.

---

### 3. Metadata quality and title system hardening

You must improve metadata quality where the repo is still weak.

Known current targets:

- add a high-quality root `title.template` in `app/layout.tsx`
- replace `| Product Details` in `app/product/[tech]/page.tsx` with a stronger product-detail title pattern

Verify the rest of the metadata surface before editing it.
Some previously generic titles in routes such as `/store`, `/research`, `/faq`, and `/about` appear to have already been upgraded in source.

Requirements:

- maintain unique titles
- maintain unique descriptions
- avoid keyword stuffing
- keep page intent clear
- preserve compliance-safe language

---

### 4. Structured data and entity clarity

Use source review and rendered output to verify schema behavior.

You must:

- confirm blog schema uses the canonical host and real page identifiers
- confirm `WebSite` schema remains aligned with the primary host
- confirm `SearchAction` remains valid
- confirm invalid routes do not emit misleading valid-page schema
- confirm breadcrumb schema reflects real route structure

If a previously reported schema issue is already closed in `lib/seo-schema.ts`, mark it as verified and move on.

---

### 5. AI-search readiness without visual regression

The site still relies too much on hidden extraction hints.

Files and templates to review:

- `app/page.tsx`
- `app/store/page.tsx`
- `app/product/[tech]/page.tsx`
- `app/conditions/[slug]/page.tsx`
- `app/protocols/[slug]/page.tsx`
- `app/blog/[slug]/page.tsx`

Your task:

- reduce overdependence on `sr-only` summaries as the primary answer-first signal
- add small visible context-setting or answer-first copy where needed
- keep additions design-native and minimal
- improve machine extractability without creating obvious SEO slabs
- keep every claim evidence-aligned and compliance-safe

Do not add fake citations, fake experts, or pseudo-medical certainty.

---

### 6. Compliance remediation

This is a release gate, not a nice-to-have.

You must run:

- `pnpm compliance:strict`

Current verified result:

- `94` issues
- `38` files

High-attention files currently include:

- `components/blog/ArticleReader.tsx`
- `components/LegalPages.tsx`
- `constants/chambers.ts`
- `constants/knowledge.ts`
- `components/ChamberCompare.tsx`
- `components/ChamberCompare5.tsx`
- `components/RentalConfigurator.tsx`
- `components/partner/PDFTemplates.tsx`
- `hooks/usePartnerStore.ts`
- `utils/searchStorage.ts`

Requirements:

- classify failures by rule type
- fix the content properly
- preserve legitimate legal and safety language
- do not silence the tool broadly

The end state must pass `pnpm compliance:strict` cleanly.

---

### 7. Locator / local SEO decision gate

The locator is not just a mechanical fix; it needs an explicit SEO decision.

Current state to verify:

- metadata forces `noindex, follow`
- interactive experience is client-only
- route includes a `noscript` listing and `ItemList` schema

You must choose and implement one deliberate path:

1. Keep it non-indexable, with a documented business reason and no contradictory local-SEO expectations.
2. Make it indexable, strengthen server-visible location value, and ensure schema and visible content support that choice.

Do not leave it in an ambiguous half-state.

---

### 8. Design parity verification

You must prove that SEO changes did not visibly damage the experience.

Critical routes:

- `/`
- `/store`
- `/product/hydrogen`
- `/product/hbot`
- `/conditions`
- `/research`
- `/protocols`

Verify:

- layout hierarchy is unchanged
- no obvious SEO-only blocks were introduced
- no spacing artifacts or visual rhythm regressions were introduced
- any visible additions are tiny, intentional, and justified

---

## Required workflow

1. Read the latest audit and inspect the named source files before editing.
2. Reproduce the current runtime behavior from a production build.
3. Categorize each previously reported blocker as open, already fixed, or external.
4. Fix host/entity leakage that is truly inside repo scope.
5. Fix or conclusively verify dynamic-route crawlability.
6. Improve metadata where gaps still exist.
7. Strengthen visible answer-first content in a design-safe way.
8. Resolve compliance failures cleanly.
9. Make an explicit locator/local-SEO decision.
10. Re-run verification.
11. Produce a final remediation report with evidence.

---

## Required final verification

You must run and report:

- `pnpm build`
- `pnpm check`
- `pnpm compliance:strict`
- local production verification from `next start`
- status-code verification for valid and invalid dynamic routes
- canonical verification
- metadata verification
- structured-data verification
- visual parity verification on required routes

Do not treat source inspection alone as sufficient for route or crawlability claims.

---

## Final output format

Your final report must include:

1. Exact files changed
2. A table or list showing each major audit claim as:
   - `fixed in this pass`
   - `already fixed in source, verified`
   - `external blocker`
   - `deferred with reason`
3. What changed for host integrity
4. What changed for crawlability
5. What changed for metadata
6. What changed for structured data / entity clarity
7. What changed for AI-search readiness
8. What changed for compliance
9. What changed for locator / local SEO strategy
10. How design parity was preserved
11. Verification completed
12. Residual risks
13. Final score out of 10
14. One clear closing statement:

`SEO remediation is production-ready`

or

`SEO remediation still requires fixes`

Do not claim production readiness if any of the following remain true:

- primary host is still unresolved or publicly split
- soft-404 behavior is still reproducible
- `pnpm compliance:strict` still fails
- critical design parity regressions were introduced
