# SEO, Metadata, and Core Web Vitals Audit Findings

**Date:** 2026-03-05  
**Tier:** T3 (read-only audit cycle)  
**Primary specialist:** seo-performance  
**Secondary specialist:** ceo-auditor

## Scope and Method

This cycle was run as **audit-only** (no product-code remediation applied). The review covered global metadata, route-level metadata patterns (static + dynamic), JSON-LD implementation posture, indexability controls (`sitemap`/`robots`), and Core Web Vitals readiness for key marketing and conversion surfaces.

Primary evidence sources included:

- `app/layout.tsx`
- `lib/seo-metadata.ts`
- `src/components/StructuredData.tsx`
- `components/StructuredData.tsx`
- `app/sitemap.ts`
- `app/robots.ts`
- previously reviewed major route leaves and dynamic route pages (`app/**/page.tsx`)

---

## Verification Snapshot

- ✅ `pnpm build` passed
- ✅ `pnpm check` passed
  - Biome check passed
  - Next build passed
  - Vitest passed: **12 files, 116 tests**
  - Non-fatal warning observed: React `act(...)` warning in `tests/components/MultitoolContainer.test.tsx`

---

## Executive Summary

The platform has a solid baseline for route-level metadata generation via `createPageMetadata(...)`, including canonical URLs, OpenGraph, and Twitter metadata. Dynamic routes have active metadata generation patterns and async request API usage aligns with Next.js 16 requirements.

The most significant SEO/CWV debt is architectural consistency: global metadata baseline is too thin, legacy client-side JSON-LD remains active in places, and indexability controls currently include transactional/private-intent surfaces in the sitemap. Combined with heavy client-rendered marketing surfaces and unclear rendering-strategy declarations, this creates avoidable risk to crawl quality, rich-result reliability, and Core Web Vitals performance.

---

## Prioritized Findings

## High Priority

### H-01 — Global metadata baseline is under-specified
- **Evidence:** `app/layout.tsx` exports only `metadataBase`, `title`, and `description`.
- **Risk:** Inconsistent branding/click-through quality across route metadata; missing strong global defaults (`title.template`, robots defaults, OG/Twitter baseline consistency hooks).
- **Recommendation (Next.js 16):** Expand root `metadata` with template strategy, default robots policy, and default OpenGraph/Twitter baseline fields.

### H-02 — Legacy client-side JSON-LD injection remains active
- **Evidence:** `components/StructuredData.tsx` uses `useEffect` + `document.head.appendChild(...)` for schema injection.
- **Risk:** Lower structured-data reliability for crawlers, duplicate script risk, hydration-timing dependency, and domain/currency drift due hardcoded values.
- **Recommendation (Next.js 16):** Consolidate JSON-LD generation to server-rendered, nonce-safe path (`src/components/StructuredData.tsx`) and phase out client-injected schema for SEO-critical routes.

### H-03 — Sitemap includes low-index-value transactional/account routes
- **Evidence:** `app/sitemap.ts` static routes include `/account`, `/checkout`, `/rental/checkout`, `/wishlist`.
- **Risk:** Crawl budget dilution and mixed search intent signals on non-discovery pages.
- **Recommendation:** Restrict sitemap to index-worthy discovery/education/commercial pages; keep transactional/auth routes out of sitemap by default.

### H-04 — Robots policy is permissive for some non-index-target surfaces
- **Evidence:** `app/robots.ts` disallows only `/api/`, `/admin/`, `/dashboard/`, `/partner/`.
- **Risk:** Non-essential private-intent paths can remain crawlable/indexable depending on page-level defaults.
- **Recommendation:** Align robots and page-level indexing policy for auth/account/checkout funnels.

### H-05 — Rendering-strategy intent not explicit per route where expected
- **Evidence:** Prior scan indicates route comments/reference behavior but no explicit `revalidate`/`dynamic` exports on multiple key routes.
- **Risk:** Unclear cache/index freshness behavior, potentially inconsistent ISR/SSR intent.
- **Recommendation:** Declare route strategy explicitly (`revalidate`, `dynamic`) for high-value pages and dynamic entities.

### H-06 — LCP prioritization is available but not consistently enforced on hero media
- **Evidence:** shared image wrapper supports `priority`, but prior usage scan did not confirm systematic `priority={true}` on above-the-fold marketing LCP visuals.
- **Risk:** Elevated LCP and slower first visual stability on conversion-critical pages.
- **Recommendation:** Tag single LCP element per route with explicit priority and tuned `sizes`.

## Medium Priority

### M-01 — Legacy schema helpers use hardcoded domain/currency assumptions
- **Evidence:** `components/StructuredData.tsx` includes hardcoded `https://hylono.com` and USD fields.
- **Risk:** Canonical/entity mismatch vs env domain strategy and EU market positioning.
- **Recommendation:** Parameterize schema sources from validated env and route context.

### M-02 — Sitemap `lastModified` value is uniform per generation run
- **Evidence:** `app/sitemap.ts` uses one runtime `new Date()` for all entries.
- **Risk:** Low update signal quality for crawlers and weak freshness hints.
- **Recommendation:** Use content-derived timestamps where available for blog/research/product entries.

### M-03 — Semantic heading hierarchy quality likely uneven on client-heavy pages
- **Evidence:** Major SEO surfaces are heavily client-composed; prior audit flagged hierarchy consistency risk.
- **Risk:** Reduced topical clarity and accessibility/SEO semantic quality.
- **Recommendation:** Perform route-level heading map QA (single `h1`, logical `h2-h3` progression, semantic sectioning).

### M-04 — Dynamic slug routes need robust invalid-slug handling standardization
- **Evidence:** Prior dynamic route scan flagged limited explicit `notFound()` usage.
- **Risk:** Thin/soft-404 indexing risk on invalid slug requests.
- **Recommendation:** Ensure dynamic route guards return `notFound()` for unknown entities.

## Low Priority

### L-01 — Global internationalization metadata opportunity
- **Evidence:** current baseline does not expose language alternates/hreflang strategy.
- **Risk:** Lower discoverability for multi-market EU expansion.
- **Recommendation:** Add `alternates.languages` once locale routing is finalized.

---

## High-Impact vs Low-Effort Matrix

## High Impact + Low Effort (do first)
1. **Prune sitemap transactional/auth routes** (`/account`, `/checkout`, `/wishlist`, etc.).
2. **Tighten robots policy** to match intended indexability.
3. **Add stronger root metadata defaults** (`title.template`, default robots, OG/Twitter baseline).
4. **Remove hardcoded domain/currency from legacy schema utilities**.

## High Impact + Medium Effort
1. **Migrate remaining client-side JSON-LD to server path** for reliable crawler visibility.
2. **Enforce explicit rendering strategy declarations** on key routes.
3. **Formalize LCP image priority policy** on key marketing/commercial pages.

## Medium Impact + Low Effort
1. **Content-derived `lastModified` in sitemap** for high-value content.
2. **Route-level heading hierarchy QA checklist** for top traffic pages.

---

## Recommended Execution Sequence (Post-Audit)

### Phase A (Fast SEO Wins)
- Sitemap pruning + robots alignment
- Root metadata baseline expansion
- Canonical/entity consistency cleanup in schema helpers

### Phase B (Structured Data and Route Reliability)
- Server-first JSON-LD consolidation
- Dynamic route invalid-slug hardening (`notFound()` pattern)

### Phase C (CWV + Semantic Depth)
- LCP priority/sizes enforcement
- Heading/semantic hierarchy pass on high-traffic pages

---

## Required Handoffs

- **content-product-writer**: fill metadata/copy gaps for route-level descriptions and E-E-A-T-aligned trust messaging (support/assist framing only).
- **frontend-specialist**: execute semantic/heading cleanup, LCP prioritization, and server-first structured-data migration.

---

## Decision Log

- [DECISION: Keep this cycle read-only because `SEO_ADIT.MD` explicitly defines an audit-only phase; reverse only if a separate remediation task is issued.]
