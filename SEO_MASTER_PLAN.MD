# HYLONO - SEO 2026 MASTER ACTION PLAN
### For: Smart Vibe Coder - WHAT to do, not HOW

Status guide:
- `[x]` = verified in repo and covered by passing checks
- `[ ]` = still pending, blocked by missing source data, or requires off-repo execution

---

## 0. CRAWLABILITY & INDEXATION (do this first, everything else is pointless without it)

- [x] **Sitemap: whitelist-only approach** - `app/sitemap.ts` uses an explicit allow-list for marketing/content routes and excludes transactional/auth/API surfaces. Real content dates are wired instead of build-time timestamps.
- [x] **Robots.txt via `app/robots.ts`** - transactional/auth/utility/API routes are disallowed, static assets are allowed, and the sitemap directive is present.
- [x] **Explicit index/noindex on every route** - default `index, follow` is set centrally and non-indexable routes override it explicitly.
- [x] **Canonical tags** - self-referencing canonicals are generated consistently through `lib/seo-metadata.ts`, including parameter sanitization.
- [x] **HTTP status hygiene** - real 404 handling, canonical redirects, and crawlability audits now verify no redirect chains.

---

## 1. KILL LEGACY STRUCTURED DATA AND REBUILD SERVER-SIDE

- [x] **Delete `components/StructuredData.tsx`** - legacy client-side JSON-LD injection is replaced by canonical server rendering through `src/components/StructuredData.tsx`.
- [x] **Remove hardcoded domain/currency** - structured data and metadata resolve environment-driven site URL and commerce settings.
- [ ] **Implement per-route schema**

  | Route | Schema |
  |---|---|
  | Global (`layout.tsx`) | `Organization` + `WebSite` with `SearchAction` |
  | Every page | `BreadcrumbList` |
  | `/products/*` | `Product` + `Offer` + `AggregateRating` (if real reviews exist) |
  | `/rental/*` | `Product` + `Offer` with `businessFunction: LeaseOut` + `UnitPriceSpecification` with `billingDuration` |
  | `/blog/*` | `BlogPosting` with `author`, `datePublished`, `dateModified` |
  | `/research/*` | `MedicalWebPage` or `ScholarlyArticle` with citations |
  | `/team/*` | `Person` with `sameAs` (LinkedIn, ORCID), `jobTitle`, `affiliation` |
  | FAQ sections | `FAQPage` |
  | Video embeds | `VideoObject` + transcript |

  - [x] Global `Organization` + `WebSite` schema ships from `app/layout.tsx`.
  - [x] `BreadcrumbList` schema ships on every indexable route.
  - [x] Product routes ship `Product` + `Offer` + FAQ schema, with `MerchantReturnPolicy` + `hasWarrantyPromise` when commerce data exists.
  - [x] Rental landing ships `Product` + `Offer` with `businessFunction: LeaseOut` + `UnitPriceSpecification`, plus FAQ schema.
  - [x] Blog routes ship `BlogPosting` schema with visible publish/updated dates and citation support.
  - [x] Research route ships `MedicalWebPage` plus citation-backed scholarly references.
  - [ ] `Person` schema remains blocked until real reviewer/team identity data exists.
  - [ ] `VideoObject` remains blocked until real embeds and transcripts are published.
- [x] **Rental-specific schema** - lease-oriented commerce schema is implemented and verified.
- [x] **Schema validation in CI** - JSON-LD validation runs in the audit toolchain.

---

## 2. METADATA LAYER

- [x] **Global metadata in `app/layout.tsx`**
  - Title template is defined.
  - Robots defaults are explicit.
  - Open Graph defaults are present.
  - Twitter card defaults are present.
  - Verification placeholders are wired.
  - `viewport` exports separately.
- [x] **Every dynamic route gets `generateMetadata()`** - dynamic routes now emit unique metadata, canonicals, and route-specific OG images. Locale alternates stay disabled until real locale subfolder routes exist.
- [x] **Dynamic OG image generation** - `next/og` images are generated per dynamic route type.
- [x] **No route falls through to root defaults only** - metadata coverage audit passes across static and dynamic routes.

---

## 3. CORE WEB VITALS

### LCP (target: < 2.0s)
- [x] **Hero images: `priority` + explicit `sizes`** - above-the-fold hero media is configured and audited.
- [x] **Font: `next/font` with `display: 'swap'`** - no external Google Fonts CSS imports remain.
- [x] **Image formats: WebP/AVIF enforced** - Next image formats are configured and verified.

### INP (target: < 150ms)
- [ ] **Audit every `'use client'` on marketing routes** - major SEO surfaces (`/`, `/product/[tech]`, `/rental`, `/blog/[slug]`, `/research`, and legal policy routes) now render through server-first shells, but remaining client-heavy marketing routes still need follow-up.
- [ ] **Isolate animation libs** - some motion-heavy legacy surfaces still need deeper client-island isolation.
- [x] **`React.startTransition`** - non-urgent state/router updates now use transition-wrapped flows where implemented.

### CLS (target: < 0.05)
- [ ] **Explicit `width`/`height` or `aspect-ratio`** on all images, videos, iframes.
- [ ] **Cookie consent** must have pre-allocated space.
- [ ] **No dynamic content injection above the fold.**

### Performance
- [x] **Bundle audit** - `@next/bundle-analyzer` is wired in, the production bundle budget gate is in place, and route-class budgets now verify a `139.10 kB` gzip shared first-load baseline across representative marketing routes.
- [ ] **CDN with EU edge nodes** - requires hosting/runtime configuration outside the repo.
- [ ] **Brotli + cache headers** - still needs explicit verification/documentation at the hosting layer.
- [x] **RUM monitoring** - consent-aware `web-vitals` reporting now captures route/template field data.

---

## 4. NEXT.JS RENDERING STRATEGY

- [x] **Explicit rendering on EVERY route**
  - Marketing/content -> static or ISR.
  - Products -> hourly ISR.
  - Transactional flows -> dynamic/noindex.
- [x] **`generateStaticParams`** for all prebuilt dynamic routes.
- [x] **Server-first shared marketing shell** - root chrome is server-rendered and global overlays are deferred.
- [x] **Shared-shell navigation via `<Link>` with real `href`** - navigation is link-first outside interactive app flows.
- [x] **Move API calls out of client `useEffect`** - content routes no longer depend on client fetch for primary render.

---

## 5. E-E-A-T (THE RANKING CEILING FOR YMYL HEALTH)

### Experience
- [ ] **Original first-party data** - requires real studies/usage datasets.
- [ ] **Real user testimonials** - requires approved identities, media, and consent.
- [ ] **Product demos** - requires real video/photo production assets.

### Expertise
- [ ] **Author pages for all health/science content** - blocked until real team/reviewer identities are available.
- [ ] **"Medically reviewed by [Name], [Credentials]" + "Last reviewed: [Date]"** - blocked until verified reviewer data exists.
- [x] **`/editorial-policy` page** - implemented.
- [x] **Inline source citations** - blog/article templates now surface evidence references where repo data exists.

### Authority
- [ ] **Entity building for Knowledge Graph** - requires off-repo business profile and directory work.
- [ ] **Branded search growth** - requires distribution/marketing execution.
- [ ] **Quality backlinks** - requires outreach and earned coverage.
- [ ] **Unlinked brand mentions** - requires off-repo awareness work.

### Trust
- [ ] **EU regulatory signals visible** - requires verified compliance artifacts and public verification targets.
- [x] **`MerchantReturnPolicy` + `hasWarrantyPromise`** in Product schema.
- [x] **Contact info in footer** on every page.
- [x] **GDPR privacy policy** linked sitewide with compliant consent controls.
- [ ] **Transparent rental pricing** - needs a final content/commercial decision across all rental surfaces.

---

## 6. AI SEARCH OPTIMIZATION (GEO - THE 2026 MULTIPLIER)

- [ ] **Answer-first structure** - implemented on key routes, but not yet across every informational page.
- [ ] **Claim-based writing** - still needs broader repo-wide editorial standardization.
- [ ] **Extraction-friendly formats** - partially present, not yet consistent across all target pages.
- [ ] **Question-based H2s** matching real queries - still needs broader content pass.
- [x] **FAQ sections + `FAQPage` schema** on product, science, blog pages - real FAQ sections and schema now ship on product, research, and blog routes where source-backed FAQ content exists.
- [x] **`speakable` structured data** on key content sections - product, blog, and research routes now emit `SpeakableSpecification` for answer-first sections.
- [ ] **Short paragraphs** - still needs a broader editorial pass.

---

## 7. CONTENT ARCHITECTURE AND TOPICAL AUTHORITY

- [ ] **Topic clusters with pillar pages**
  - `/hydrogen-therapy` (pillar) -> `/how-it-works`, `/benefits`, `/safety`, `/research`, `/faq`
  - Same pattern for each core theme: recovery, sleep, pain support, longevity
  - Bidirectional internal links between cluster and pillar
- [ ] **Passage-level optimization** - some sections improved, but not yet systematically across the site.
- [ ] **Zero cannibalization** - keyword-to-URL governance is still needed.
- [ ] **Content depth (YMYL minimum)** - still needs page-by-page editorial verification.
- [ ] **Compliance vocabulary** - enforcement still needs a formal glossary/check gate.
- [ ] **Content freshness** - visible dates and schema exist on key routes, but not yet across all health content.
- [ ] **Internal linking** - still needs a broader contextual-linking pass.

---

## 8. MULTIMODAL CONTENT

- [ ] **Short video on every key product page** - blocked until real videos/transcripts exist.
- [ ] **Image SEO** - filenames/alt coverage still need a dedicated pass beyond format optimization.
- [ ] **Interactive engagement elements** - still requires net-new product/quiz/comparison work.

---

## 9. INTERNATIONAL SEO (EU-FIRST)

- [ ] **Hreflang on all pages** - intentionally disabled until real locale routes exist.
- [ ] **Subfolder structure** (`/de/`, `/fr/`, `/nl/`) - not implemented.
- [ ] **Localized content** - requires native-language editorial and review workflows.
- [ ] **Localized metadata** - depends on real localized routes/content.

---

## 10. SEMANTIC HTML AND ACCESSIBILITY

- [ ] **One `<h1>` per page** with primary keyword - needs a full route-by-route audit.
- [ ] **Semantic elements** - needs a broader semantic markup audit.
- [ ] **Accessibility = SEO** - significant baseline work exists, but this checklist item is not yet fully verified across all pages.
- [ ] **Mobile-first** - still needs explicit cross-route/mobile QA signoff.

---

## 11. SECURITY HEADERS

- [x] **Via `proxy.ts` security middleware** - HSTS, CSP with nonces, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and `Permissions-Policy` are handled in the proxy layer.

---

## 12. MONITORING (set up once, review weekly)

- [ ] **GSC** - requires external verification and ongoing review.
- [ ] **Bing Webmaster Tools** - requires external setup.
- [ ] **Cannibalization map** maintained and audited.
- [ ] **CTR optimization** - requires GSC data review and editorial iteration.
- [ ] **Content decay detection** - requires ongoing editorial monitoring.
- [ ] **Backlink monitoring** + toxic link disavowal.
- [x] **Lighthouse CI in deploy pipeline** - local Windows runs use the existing temp-cleanup bypass, and CI remains configured to fail below threshold.
- [ ] **Log file analysis** - requires hosting/log access and ongoing analysis.

---

## EXECUTION ORDER

**Phase 1 - Technical Foundation:**
1. Sitemap whitelist + robots.txt
2. Kill legacy client StructuredData, consolidate server-side
3. Full metadata layer + `generateMetadata()` everywhere
4. Explicit rendering strategy on every route
5. LCP hero fixes (priority, sizes, server component)

**Phase 2 - Authority and Schema:**
6. Complete per-route structured data (especially rental schema)
7. Author pages + Person schema + reviewer badges
8. Editorial policy + About page + Organization schema
9. Entity building (`sameAs`, business profiles, directories)

**Phase 3 - Content and AI:**
10. Answer-first content restructuring
11. Topic clusters with pillar pages
12. FAQ sections + FAQPage schema
13. Video embeds + VideoObject schema
14. Hreflang + localized content

**Phase 4 - Polish:**
15. Security headers
16. Accessibility audit
17. Monitoring infrastructure
18. CI/CD schema validation + Lighthouse gates
