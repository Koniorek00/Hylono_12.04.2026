# HYLONO - DEEP STRATEGIC AUDIT REPORT
**Date:** 2026-04-11  
**Auditor:** VIBECODEX 5.4  
**Standard:** 2024-2026 World-Class

## 0.0) REMEDIATION UPDATE LOG - 2026-04-12
- [DONE] `/partners` and `/rewards` now render public preview content for signed-out visitors instead of generic lock screens, and `/partners` includes a working B2B application form wired to `/api/contact`.
- [DONE] Current TypeScript blockers in `components/RentalCheckoutPage.tsx`, `content/rental.ts`, and `lib/mobile-auth.ts` were cleared on 2026-04-12; local `tsc --noEmit` now passes again.
- [VERIFIED OUTDATED] The `/research` build failure cited on 2026-04-11 no longer reproduces in the current `app/research/page.tsx`; the reported line-335 `content` access has already been refactored away.
- [VERIFIED OUTDATED] `/account` already renders a preview dashboard without a session in the current `components/AuthComponents.tsx`; it is not blank anymore.
- [VERIFIED OUTDATED] The `/contact` callback interaction is currently implemented by drafting the chosen slot into the form message and is covered by `tests/components/ContactPage.test.tsx`; it is not silently dropped.
- [VERIFIED] Focused regression checks passed on 2026-04-12: `tests/components/PartnerPortal.test.tsx` and `tests/components/ContactPage.test.tsx`.

## 0) EXECUTIVE SUMMARY
[CONFIRMED] Hylono is a European wellness-technology platform selling and renting oxygen, hydrogen, red-light, PEMF, and related systems, with an unusually strong SEO/content architecture for its size. [CONFIRMED] The crawl covered 125 public routes from the current project runtime, including 97 indexable routes, 25 noindex/disallowed routes, 23 canonical product-detail routes, 43 hydrogen alias routes, 5 condition pages, 3 protocol pages, and 5 blog posts. [CONFIRMED] Core indexable pages already ship strong metadata, canonical tags, JSON-LD coverage, and a real topical graph that connects `Condition -> Research -> Product -> Protocol -> Rental/Contact`.

[CONFIRMED] The biggest gaps are not basic SEO gaps; they are conversion, trust, performance, accessibility, and operational hardening gaps. [UPDATED 2026-04-12] The 2026-04-11 snapshot overstated three issues that have since been rechecked: the reported `/research` build failure no longer reproduces, `/partners` and `/rewards` now render public preview copy, and `/account` already had a preview state. [CONFIRMED] Remaining high-value work is still concentrated in rendering-strategy coverage across public routes, mobile performance on core revenue pages, and stronger proof architecture on commercial surfaces.

[INFERRED] The strategic opportunity is to keep the existing SEO skeleton and upgrade the experience layer into a high-trust, guided, world-class wellness commerce platform. [CONFIRMED] Competitors and adjacent leaders consistently win by combining three things Hylono only partially has today: explicit personalized entry, visible trust/risk reversal, and richer proof ecosystems spanning testimonials, experts, locations, reviews, data, and media. [VERIFY] If the top funnel, product proof layer, planner, and broken gated/noindex pages are rebuilt in that order, Hylono should be able to increase consult-start rate, assisted conversion, and branded trust materially without sacrificing current crawl/index architecture.

## 0.1) PROBLEM FRAMING
[CONFIRMED] Site type: hybrid wellness-commerce + evidence + protocol platform.  
[CONFIRMED] Primary user jobs: compare technologies, understand fit by goal, judge evidence, decide between rent vs buy, and reach a human advisor when needed.  
[CONFIRMED] Business model: assisted commerce with product sales, rental flows, and consultation-driven conversion.  
[CONFIRMED] Known strengths: strong metadata/JSON-LD discipline on core routes, rich route graph, conservative wellness framing, and useful cross-linking between conditions, research, products, and protocols.  
[CONFIRMED] Known unknowns: live public DNS for `https://hylono.eu` was not resolvable from this audit environment, so live PageSpeed Insights could not be run and the primary crawl used the local project runtime at `http://127.0.0.1:3010`.  
[VERIFY] Unknown commercial variables: current traffic mix, assisted close rate, average order value, gross margin by device family, and lead-to-sale conversion benchmarks.

## 0.2) TOP FINDINGS
1. [VERIFIED OUTDATED 2026-04-12] The previously reported production-build failure in [app/research/page.tsx](F:/ag projects/Hylono_MAIN - SEO BOOST/app/research/page.tsx:335) does not reproduce in the current file.
2. [CONFIRMED] The experience layer is materially weaker than the SEO layer: metadata and schema are strong, but guided conversion, trust proof, and visual proof architecture are not yet world-class.
3. [CONFIRMED] Core mobile lab performance is weak on revenue-driving routes: `/product/hbot` scored 36 performance with 9.5s LCP and 0.446 CLS; `/research` scored 40 performance with 9.1s LCP and 0.446 CLS; homepage and contact both scored 53 performance.
4. [PARTIALLY FIXED 2026-04-12] `/partners` and `/rewards` now ship public preview content for signed-out visitors, and `/account` already has a preview state rather than a blank surface. Remaining experience debt is quality, not missing main-copy.
5. [CONFIRMED] Accessibility is a repeat issue, not an edge case: 82 of 125 crawled routes had at least one serious or critical axe issue; the highest-risk problems were color contrast, nested interactive controls, unlabeled buttons, list markup errors, and invalid ARIA usage.
6. [PARTIALLY FIXED 2026-04-12] Hylono already has the right page graph, but many key pages still undersell their category, proof, or next step. The callback interaction on `/contact` is wired as a draft-to-message flow, while heading and proof architecture gaps still remain on the homepage and store hub.
7. [CONFIRMED] World-class competitors consistently expose clearer entry points, stronger trust/risk reversal, real testimonials/media proof, more obvious plan/tiering, and lower-friction consult/quiz/free-scan flows than Hylono currently does.

## 1) SITE INVENTORY - PAGE BY PAGE
[CONFIRMED] Audit basis: `artifacts/deep-audit/route-crawl.json`, targeted follow-up crawl on flaky routes, six mobile Lighthouse runs, build verification, source-governance scan, and a screenshot pack in `artifacts/deep-audit/screens`.  
[INFERRED] Current Score is a heuristic page-health score derived from HTTP status, visible main-copy, heading structure, and serious/critical accessibility issues. It is directionally useful for prioritization, not a replacement for analytics.

### 1.1) Crawl Summary
- [CONFIRMED] Total public routes audited: 125.
- [CONFIRMED] Indexable routes: 97.
- [CONFIRMED] Noindex/disallowed routes: 25.
- [CONFIRMED] Redirect/alias routes: 2 explicit plus 43 hydrogen alias URLs that resolve to canonical PDPs after warm-up.
- [CONFIRMED] Page-type distribution: 66 product-detail routes, 22 secondary content routes, 8 Nexus routes, 5 blog posts, 5 condition details, 4 account-flow routes, 3 protocol details, and 7 core hubs/pages.
- [CONFIRMED] Source-governance scan: 0 public page files missing `[DECISION: ...]`, 59 public page files missing explicit `Rendering strategy:` comments, 65 public `page.tsx` files scanned.

### 1.2) Performance / Accessibility Baseline
| Page | Perf | Access | Best Practices | SEO | LCP ms | TBT ms | CLS | Notes [CONFIRMED/INFERRED] |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `contact` | 53 | 94 | 96 | 100 | 9012 | 944 | 0 | Sub-60 mobile performance; Accessibility under 95; errors-in-console, valid-source-maps, color-contrast |
| `home` | 53 | 94 | 96 | 100 | 7771 | 818 | 0 | Sub-60 mobile performance; Accessibility under 95; errors-in-console, valid-source-maps, color-contrast |
| `product-hbot` | 36 | 91 | 96 | 100 | 9492 | 587 | 0.446 | Sub-60 mobile performance; Accessibility under 95; errors-in-console, valid-source-maps, color-contrast |
| `rental` | 57 | 94 | 96 | 100 | 10219 | 716 | 0 | Sub-60 mobile performance; Accessibility under 95; errors-in-console, valid-source-maps, color-contrast |
| `research` | 40 | 94 | 96 | 100 | 9099 | 593 | 0.446 | Sub-60 mobile performance; Accessibility under 95; errors-in-console, valid-source-maps, color-contrast |
| `store` | 67 | 94 | 96 | 100 | 10446 | 345 | 0 | Accessibility under 95; errors-in-console, valid-source-maps, color-contrast |


### 1.3) Full Route Inventory
| Page | Type | Purpose [CONFIRMED] | Current Score [INFERRED] | Critical Issues [CONFIRMED/INFERRED] |
| --- | --- | --- | ---: | --- |
| `/` | homepage | Brand/category entry | 88 | 1 serious/critical axe issues |
| `/about` | content-page | Secondary content route | 88 | 1 serious/critical axe issues |
| `/account` | account-flow | Gated account flow | 58 | No visible main-copy detected; Missing H1; 1 serious/critical axe issues |
| `/affiliate` | content-page | Secondary content route | 88 | 1 serious/critical axe issues |
| `/blog` | blog-hub | Editorial archive | 88 | 1 serious/critical axe issues |
| `/blog/hydrogen-water-the-smallest-antioxidant` | blog-detail | Editorial article | 88 | 1 serious/critical axe issues |
| `/blog/pemf-therapy-recharging-your-cellular-batteries` | blog-detail | Editorial article | 88 | 1 serious/critical axe issues |
| `/blog/red-light-therapy-for-skin-regeneration` | blog-detail | Editorial article | 88 | 1 serious/critical axe issues |
| `/blog/the-science-behind-hyperbaric-oxygen-therapy` | blog-detail | Editorial article | 88 | 1 serious/critical axe issues |
| `/blog/the-superhuman-protocol-combining-pemf-hbot-and-rlt` | blog-detail | Editorial article | 88 | 1 serious/critical axe issues |
| `/careers` | content-page | Secondary content route | 88 | 1 serious/critical axe issues |
| `/catalog/omega-3` | content-page | Secondary content route | 88 | 1 serious/critical axe issues |
| `/checkout` | checkout | Purchase flow | 88 | 1 serious/critical axe issues |
| `/conditions` | condition-hub | Problem/goal hub | 88 | 1 serious/critical axe issues |
| `/conditions/comfort` | condition-detail | Goal-to-solution page | 76 | 2 serious/critical axe issues |
| `/conditions/recovery` | condition-detail | Goal-to-solution page | 76 | 2 serious/critical axe issues |
| `/conditions/sleep` | condition-detail | Goal-to-solution page | 76 | 2 serious/critical axe issues |
| `/conditions/stress` | condition-detail | Goal-to-solution page | 76 | 2 serious/critical axe issues |
| `/conditions/vitality` | condition-detail | Goal-to-solution page | 76 | 2 serious/critical axe issues |
| `/contact` | contact | Lead capture / support | 75 | Thin visible copy; No H2 structure; 1 serious/critical axe issues |
| `/cookie-policy` | content-page | Secondary content route | 88 | 1 serious/critical axe issues |
| `/faq` | support-content | Support knowledge base | 88 | 1 serious/critical axe issues |
| `/firesafe` | content-page | Secondary content route | 88 | 1 serious/critical axe issues |
| `/guarantee` | content-page | Secondary content route | 88 | Redirects to canonical returns page |
| `/help` | support-content | Support knowledge base | 88 | 1 serious/critical axe issues |
| `/hho-car-kit` | content-page | Secondary content route | 76 | 2 serious/critical axe issues |
| `/learning` | content-page | Secondary content route | 88 | 1 serious/critical axe issues |
| `/locator` | content-page | Secondary content route | 88 | 1 serious/critical axe issues |
| `/login` | account-flow | Gated account flow | 76 | Missing H1; 1 serious/critical axe issues |
| `/meridian` | content-page | Secondary content route | 88 | 1 serious/critical axe issues |
| `/nexus` | nexus | Partner/ops workspace | 76 | 2 serious/critical axe issues |
| `/nexus/academy` | nexus | Partner/ops workspace | 76 | 2 serious/critical axe issues |
| `/nexus/clients` | nexus | Partner/ops workspace | 64 | Missing H1; 2 serious/critical axe issues |
| `/nexus/docs` | nexus | Partner/ops workspace | 52 | Missing H1; 3 serious/critical axe issues |
| `/nexus/fleet` | nexus | Partner/ops workspace | 64 | Missing H1; 2 serious/critical axe issues |
| `/nexus/studio` | nexus | Partner/ops workspace | 76 | 2 serious/critical axe issues |
| `/nexus/supplies` | nexus | Partner/ops workspace | 76 | 2 serious/critical axe issues |
| `/nexus/team` | nexus | Partner/ops workspace | 52 | Missing H1; 3 serious/critical axe issues |
| `/onboarding` | account-flow | Gated account flow | 76 | Missing H1; 1 serious/critical axe issues |
| `/partners` | content-page | Secondary content route | 58 | No visible main-copy detected; Missing H1; 1 serious/critical axe issues |
| `/press` | content-page | Secondary content route | 88 | 1 serious/critical axe issues |
| `/privacy` | content-page | Secondary content route | 88 | 1 serious/critical axe issues |
| `/product/cryo` | product-detail | PDP or model detail | 88 | 1 serious/critical axe issues |
| `/product/ems` | product-detail | PDP or model detail | 88 | 1 serious/critical axe issues |
| `/product/ewot` | product-detail | PDP or model detail | 88 | 1 serious/critical axe issues |
| `/product/hbot` | product-detail | PDP or model detail | 64 | 3 serious/critical axe issues |
| `/product/hydrogen` | product-detail | PDP or model detail | 88 | 1 serious/critical axe issues |
| `/product/hydrogen/aq-b300` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/aq-b300-b600` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/aq-b4500` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/aq-b600` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/aq-pw3000` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/aq-s1300` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/aq-s1300-s2000` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/aq-s2000` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/os-h150` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/os-h200` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/os-h200-300` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/os-h200-h300` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/os-h300` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/os-ho450-p` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/pr-h600` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/pr-ho1500` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/pr-ho1800` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/pr-ho1800-p` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/pr-ho3000-p` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/pr-ho450-p` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/pr-ho900` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/pr-ho900-1800` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/pr-ho900-ho1500-ho1800` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/pr-ho900-p` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/pr-ho900-p-ho1800-p-ho3000-p` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/pr-ho-p-family` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/wo-b300` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/wo-b300-b600` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/wo-b4500` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/wo-b600` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/wo-pw3000` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/wo-s1300` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/wo-s1300-s2000` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/wo-s2000` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/za-ho3000` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/za-ho3000-3600` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/za-ho3000-b` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/za-ho3000-b-4500-b` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/za-ho3000-b-ho4500-b` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/za-ho3000-ho3600` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/za-ho3600` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/za-ho4500-b` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hydrogen/za-ho6000` | product-detail | Legacy hydrogen alias | 70 | Alias route redirecting to canonical PDP |
| `/product/hypoxic` | product-detail | PDP or model detail | 88 | 1 serious/critical axe issues |
| `/product/os-h150` | product-detail | PDP or model detail | 88 | 1 serious/critical axe issues |
| `/product/os-h200-h300` | product-detail | PDP or model detail | 88 | 1 serious/critical axe issues |
| `/product/os-ho450-p` | product-detail | PDP or model detail | 88 | 1 serious/critical axe issues |
| `/product/pemf` | product-detail | PDP or model detail | 88 | 1 serious/critical axe issues |
| `/product/pr-h600` | product-detail | PDP or model detail | 88 | 1 serious/critical axe issues |
| `/product/pr-ho900-ho1500-ho1800` | product-detail | PDP or model detail | 88 | 1 serious/critical axe issues |
| `/product/pr-ho900-p-ho1800-p-ho3000-p` | product-detail | PDP or model detail | 88 | 1 serious/critical axe issues |
| `/product/rlt` | product-detail | PDP or model detail | 88 | 1 serious/critical axe issues |
| `/product/sauna_blanket` | product-detail | PDP or model detail | 88 | 1 serious/critical axe issues |
| `/product/vns` | product-detail | PDP or model detail | 88 | 1 serious/critical axe issues |
| `/product/wo-b300-b600` | product-detail | PDP or model detail | 88 | 1 serious/critical axe issues |
| `/product/wo-b4500` | product-detail | PDP or model detail | 88 | 1 serious/critical axe issues |
| `/product/wo-pw3000` | product-detail | PDP or model detail | 88 | 1 serious/critical axe issues |
| `/product/wo-s1300-s2000` | product-detail | PDP or model detail | 88 | 1 serious/critical axe issues |
| `/product/za-ho3000-b-ho4500-b` | product-detail | PDP or model detail | 88 | 1 serious/critical axe issues |
| `/product/za-ho3000-ho3600` | product-detail | PDP or model detail | 88 | 1 serious/critical axe issues |
| `/product/za-ho6000` | product-detail | PDP or model detail | 88 | 1 serious/critical axe issues |
| `/protocols` | protocol-hub | Protocol library | 88 | 1 serious/critical axe issues |
| `/protocols/recovery-oxygen-foundation` | protocol-detail | Usage playbook | 88 | 1 serious/critical axe issues |
| `/protocols/stress-balance-h2-foundation` | protocol-detail | Usage playbook | 88 | 1 serious/critical axe issues |
| `/protocols/vitality-dual-stack` | protocol-detail | Usage playbook | 88 | 1 serious/critical axe issues |
| `/rental` | rental-hub | Rental conversion hub | 88 | 1 serious/critical axe issues |
| `/rental/checkout` | checkout | Purchase flow | 88 | 1 serious/critical axe issues |
| `/research` | research-hub | Evidence hub | 88 | 1 serious/critical axe issues |
| `/returns` | content-page | Secondary content route | 88 | 1 serious/critical axe issues |
| `/rewards` | content-page | Secondary content route | 58 | No visible main-copy detected; Missing H1; 1 serious/critical axe issues |
| `/search` | content-page | Secondary content route | 88 | 1 serious/critical axe issues |
| `/shipping` | content-page | Secondary content route | 88 | 1 serious/critical axe issues |
| `/store` | store-hub | Commerce comparison hub | 83 | No H2 structure; 1 serious/critical axe issues |
| `/support` | content-page | Secondary content route | 88 | Redirects to canonical help support tab |
| `/terms` | content-page | Secondary content route | 88 | 1 serious/critical axe issues |
| `/warranty` | content-page | Secondary content route | 88 | 1 serious/critical axe issues |
| `/wellness-planner` | content-page | Secondary content route | 88 | 1 serious/critical axe issues |
| `/wishlist` | account-flow | Gated account flow | 88 | 1 serious/critical axe issues |


## 2) PAGE-BY-PAGE GAP ANALYSIS
### Home (`/`)
**Present:**
- [CONFIRMED] 842 words of main-copy, 9 sections, 3 hero CTAs, and `Organization`, `WebSite`, `WebPage`, and `BreadcrumbList` schema.
- [CONFIRMED] The page already links into the canonical graph through store, protocols, consultation, and research-adjacent pathways.
- [CONFIRMED] The homepage visibly references shipping, warranty, returns, and privacy in the footer ecosystem.

**MISSING CRITICAL:**
- [CONFIRMED] Category clarity is too weak in the primary headline. The H1 is only `HYLONO`, so the page under-explains what the company actually sells before the user scrolls.
- [CONFIRMED] Proof pack - Articles: [Announcing Baseline in action](https://web.dev/blog/announcing-baseline-in-action) argues that modern UX should use now-safe platform patterns to reduce friction, and [Mobile Accessibility Barriers For Assistive Technology Users](https://www.smashingmagazine.com/2024/02/mobile-accessibility-barriers-assistive-technology-users/) lists low contrast, small targets, and poor labeling as top blockers.
- [CONFIRMED] Proof pack - User pains: homepage has 24 contrast-failing nodes and only a brand-name H1; mobile Lighthouse performance is 53 with 7.8s LCP and 818ms TBT.
- [CONFIRMED] Proof pack - Competitor examples: [Next Health](https://www.next-health.com/) leads with `Your Partner for Vitality, Longevity, and Personalized Health` plus a complimentary consult, while [Upgrade Labs](https://upgradelabs.com/) leads with a free body composition scan and a personalized walkthrough.
- [CONFIRMED] There is no early founder/expert trust, real named testimonials, press-logo block, or guided personalization entry above the fold.

**MISSING VS TOP 10%:**
- [CONFIRMED] No quiz, free scan, free consult, or member-trial style entry path like [Healf](https://healf.com/), [Next Health](https://www.next-health.com/), [WHOOP](https://www.whoop.com/), or [Oura](https://ouraring.com/it).
- [CONFIRMED] No above-the-fold media/social proof strip like [Next Health](https://www.next-health.com/) or [Upgrade Labs](https://upgradelabs.com/).
- [CONFIRMED] No category-level tiering or membership logic visible on page one.

**Impact:**
- [VERIFY] Reframing the hero around the category, adding a guided consult/quiz CTA, and adding hard proof above the fold should improve qualified consult starts by roughly 12-28% in the first 12 months.

### Store Hub (`/store`)
**Present:**
- [CONFIRMED] 683 words of copy, 10 product cards, and useful links to planner, rental, research, and contact.
- [CONFIRMED] Strong schema coverage via `DefinedTermSet`, `ItemList`, `CollectionPage`, and breadcrumb data.

**MISSING CRITICAL:**
- [CONFIRMED] The H1 `Technology + Protocol` is too abstract for a buying hub and the page has no H2 structure at all.
- [CONFIRMED] Proof pack - Articles: [Announcing Baseline in action](https://web.dev/blog/announcing-baseline-in-action) supports replacing JS-heavy friction with supported interaction patterns, and [New Front-End Features For Designers In 2025](https://www.smashingmagazine.com/2024/12/new-front-end-features-for-designers-in-2025/) highlights native accordions, late validation, and smoother view transitions that reduce interface friction.
- [CONFIRMED] Proof pack - User pains: store hub exposes 10 cards but gives each item the same generic `Explore` CTA and no visible comparison layer; mobile Lighthouse performance is only 67 and accessibility is 94 with contrast issues.
- [CONFIRMED] Proof pack - Competitor examples: [Healf](https://healf.com/) categorizes entry by `Eat / Move / Mind / Sleep` and leads with `365 Day Returns`, while [Oura](https://ouraring.com/it) and [WHOOP](https://www.whoop.com/) present clearer tiering and product-selection pathways.
- [CONFIRMED] The hub lacks a real comparison matrix, filter system, `best for` segmentation, shipping/returns/warranty/finance trust ribbon near the decision zone, and visible proof of outcomes or buyers.

**MISSING VS TOP 10%:**
- [CONFIRMED] No plan comparison, price anchoring, or tier-selection behavior.
- [CONFIRMED] No financing/risk-reversal strip in the first screen.
- [CONFIRMED] No user-review, testimonial, or media-proof layer.

**Impact:**
- [VERIFY] Rebuilding `/store` as a guided comparison hub should increase product-detail clickthrough by 10-24% and reduce indecision-driven drop-off on assisted commerce pages.

### Rental Hub (`/rental`)
**Present:**
- [CONFIRMED] Rental hub already includes `FAQPage`, `HowTo`, `Product`, and `Service` schema, 7 sections, a table, and links into product, planner, advisor, and contact paths.
- [CONFIRMED] The page is already better structured than the store hub for action-oriented navigation.

**MISSING CRITICAL:**
- [CONFIRMED] There is no instant eligibility estimator, availability signal, or lead-time calculator.
- [CONFIRMED] Proof pack - Articles: [New Front-End Features For Designers In 2025](https://www.smashingmagazine.com/2024/12/new-front-end-features-for-designers-in-2025/) shows low-friction disclosure and validation patterns that fit rental qualification flows, and [Mobile Accessibility Barriers For Assistive Technology Users](https://www.smashingmagazine.com/2024/02/mobile-accessibility-barriers-assistive-technology-users/) explicitly warns about hidden errors and small interactive targets in forms.
- [CONFIRMED] Proof pack - User pains: the page has only one serious accessibility issue today but still lacks a true rental calculator or decision-tree despite being the rent-vs-buy hub; mobile Lighthouse LCP is 10.2s.
- [CONFIRMED] Proof pack - Competitor examples: [Next Health](https://www.next-health.com/) publishes memberships with price and included value, while [Upgrade Labs](https://upgradelabs.com/) makes first-visit entry free and explains the first-visit sequence clearly.
- [CONFIRMED] The page needs stronger operational proof: shipping windows, onboarding timeline, cancellation logic, deposit/payment rules, and logistics visuals.

**MISSING VS TOP 10%:**
- [CONFIRMED] No `start here` recommendation engine for rental suitability.
- [CONFIRMED] No availability proof, delivery region grid, or live wait-time band.
- [CONFIRMED] No named customer stories or use-case proof.

**Impact:**
- [VERIFY] A better rental qualification and logistics layer should lift advisor-contact intent by 8-20% and cut wasted rental inquiries by 10-18%.

### Canonical PDP Template (`/product/*`, sampled on `/product/hbot`)
**Present:**
- [CONFIRMED] The sample HBOT page is content-rich: 1,520 words, 21 sections, policy links, FAQ schema, breadcrumb data, and direct graph connections to condition, protocol, research, rental, and contact pages.
- [CONFIRMED] The PDP architecture is materially stronger than the site-average and already behaves like a serious canonical search landing page.

**MISSING CRITICAL:**
- [CONFIRMED] Accessibility debt is too high on the core PDP template: `/product/hbot` has serious/critical issues for color contrast, nested interactive controls, and broken list markup.
- [CONFIRMED] Proof pack - Articles: [Mobile Accessibility Barriers For Assistive Technology Users](https://www.smashingmagazine.com/2024/02/mobile-accessibility-barriers-assistive-technology-users/) highlights unlabeled/low-contrast and hard-to-operate controls as top blockers, and [Announcing Baseline in action](https://web.dev/blog/announcing-baseline-in-action) promotes modern supported interaction patterns that can replace brittle UI complexity.
- [CONFIRMED] Proof pack - User pains: `/product/hbot` scored only 36 performance in mobile Lighthouse, with 9.5s LCP and 0.446 CLS; the PDP also has 39 contrast-failing nodes.
- [CONFIRMED] Proof pack - Competitor examples: [OxyHelp](https://oxyhelp.com/) exposes safety mechanisms, worldwide shipping, FAQ depth, and manufacturer contact paths, while [Hydrogen for Health](https://hydrogen4health.com/) exposes setup video, financing, FAQs, and product pricing directly on the homepage.
- [CONFIRMED] The template still lacks a world-class sticky CTA layer, financing/risk-reversal block near the buy action, richer spec/comparison visuals, install/setup video, and stronger verified outcome proof.

**MISSING VS TOP 10%:**
- [CONFIRMED] No comparison mode between Hylono devices on the PDP.
- [CONFIRMED] No verified review/testimonial system on the buying surface.
- [CONFIRMED] No `first consult`, `book demo`, or `configure my setup` experience integrated into a persistent sticky layer.

**Impact:**
- [VERIFY] Cleaning interaction/accessibility debt and adding better proof, pricing, and CTA persistence should improve PDP-to-contact or PDP-to-cart intent by 9-22%.

### Hydrogen Model PDP Cluster (`/product/os-h150` etc.)
**Present:**
- [CONFIRMED] Canonical hydrogen model pages are rich, and targeted follow-up confirmed `/product/os-h150` resolves correctly with H1, canonical URL, and 2,316 visible words.
- [CONFIRMED] These pages already outperform the generic alias layer in depth.

**MISSING CRITICAL:**
- [CONFIRMED] There are 43 hydrogen alias URLs under `/product/hydrogen/*` that redirect to canonical static PDPs. The first automated crawl surfaced these as unstable because the browser context was destroyed during redirect, which means they should be treated as a route hygiene layer rather than a content layer.
- [CONFIRMED] Proof pack - User pains: alias pages created the largest volume of crawl noise in the first pass and are not independently valuable landing pages.
- [CONFIRMED] Proof pack - Competitor examples: [OxyHelp](https://oxyhelp.com/) and [Hydrogen for Health](https://hydrogen4health.com/) keep canonical device discovery much flatter and more obvious.

**MISSING VS TOP 10%:**
- [CONFIRMED] Alias/canonical simplification, clearer canonical discoverability, and a more obvious comparison ladder between hydrogen models.

**Impact:**
- [VERIFY] This is mostly a maintenance/clarity initiative, but it reduces crawl noise and prevents duplicate-intent confusion across hydrogen pages.

### Conditions Hub and Detail Cluster (`/conditions`, `/conditions/*`)
**Present:**
- [CONFIRMED] Condition pages are one of Hylono's strongest structural assets: 623 words on the sampled detail route, technology comparison, protocol connections, research links, stack options, and CTA paths into planner, consultation, and rental.
- [CONFIRMED] The condition-detail template aligns well with the repo's canonical topical graph requirement.

**MISSING CRITICAL:**
- [CONFIRMED] Health-adjacent condition pages still do not show a strong visible reviewer/owner/freshness block high on the page, even though the repo rules require visible ownership, review, and freshness metadata.
- [CONFIRMED] Proof pack - Articles: [Mobile Accessibility Barriers For Assistive Technology Users](https://www.smashingmagazine.com/2024/02/mobile-accessibility-barriers-assistive-technology-users/) calls out low contrast and unlabeled controls, and [New Front-End Features For Designers In 2025](https://www.smashingmagazine.com/2024/12/new-front-end-features-for-designers-in-2025/) shows supported accordion/validation patterns that fit condition-to-protocol decision flows.
- [CONFIRMED] Proof pack - User pains: all five condition pages show serious accessibility issues for `aria-prohibited-attr` plus color contrast; the sample page exposes clinical framing but not strong visible review metadata.
- [CONFIRMED] Proof pack - Competitor examples: [Next Health](https://www.next-health.com/) pairs treatment/service pages with doctor/expert framing and consult entry, while [Upgrade Labs](https://upgradelabs.com/) pairs each technology set with scan-led personalization.
- [CONFIRMED] The template also lacks evidence-strength grading, severity or budget fork paths, and richer social proof for people choosing based on a real condition/goal.

**MISSING VS TOP 10%:**
- [CONFIRMED] No `good / better / best` decision ladder.
- [CONFIRMED] No explicit evidence-strength labeling or study-quality filter.
- [CONFIRMED] No strong visible reviewer/date module high on the page.

**Impact:**
- [VERIFY] Tightening trust and decision guidance on condition pages should raise assisted conversion quality and lower uncertainty-driven exits by 8-18%.

### Protocol Hub and Detail Cluster (`/protocols`, `/protocols/*`)
**Present:**
- [CONFIRMED] Protocol pages already work as a strong bridge between evidence, devices, and next steps; the sampled detail page includes `HowTo` and `Course` schema, required devices, schedules, and relevant conversion exits.

**MISSING CRITICAL:**
- [CONFIRMED] Protocol pages still feel like static reference pages instead of active planning tools.
- [CONFIRMED] Proof pack - Articles: [Announcing Baseline in action](https://web.dev/blog/announcing-baseline-in-action) and [New Front-End Features For Designers In 2025](https://www.smashingmagazine.com/2024/12/new-front-end-features-for-designers-in-2025/) both support lighter-weight native interactions for guides, planners, and disclosure-heavy content.
- [CONFIRMED] Proof pack - User pains: protocol pages expose no save/resume/share flow, no progress checklist, and no printable or emailed protocol artifact.
- [CONFIRMED] Proof pack - Competitor examples: [Next Health](https://www.next-health.com/) operationalizes journeys into measurable steps, and [WHOOP](https://www.whoop.com/) turns ongoing guidance into membership logic and progress framing.
- [CONFIRMED] The protocol layer needs timeline estimation, printable checklists, saved progress, and smoother transition into planner or advisor-assisted planning.

**MISSING VS TOP 10%:**
- [CONFIRMED] No progress tracking or protocol passport.
- [CONFIRMED] No calendar sync, reminder, or saved-plan artifact.
- [CONFIRMED] No video or interactive setup support.

**Impact:**
- [VERIFY] Converting protocols from static education into reusable planning artifacts should increase return visits and planner starts by 7-16%.

### Research Hub (`/research`)
**Present:**
- [CONFIRMED] Research hub is strong conceptually: 970 visible words, 76 links, direct source studies, product/protocol/condition graph links, and `MedicalWebPage` + `ItemList` schema.
- [CONFIRMED] This page is one of the best examples of Hylono's SEO architecture working as intended.

**MISSING CRITICAL:**
- [CONFIRMED] The production build currently fails on [app/research/page.tsx](F:/ag projects/Hylono_MAIN - SEO BOOST/app/research/page.tsx:335), which makes this page an operational blocker even though the runtime route loads.
- [CONFIRMED] Proof pack - User pains: duplicate main-landmark accessibility issues are present on the page, and mobile Lighthouse performance scored only 40 with 9.1s LCP.
- [CONFIRMED] Proof pack - Competitor examples: [Leela Quantum](https://leelaq.com/) exposes `Research`, `Press`, `Podcasts`, `Events`, and study-count proof, while [OxyHelp](https://oxyhelp.com/) makes FAQ, contact, safety, and shipping obvious from the same journey.
- [CONFIRMED] The page lacks evidence-strength filters, recency controls, comparison/export tooling, stronger reviewer/date surfacing, and a clearer `what should I do next` panel for different visitor intents.

**MISSING VS TOP 10%:**
- [CONFIRMED] No evidence filter by modality, study type, or quality.
- [CONFIRMED] No downloadable synthesis or cited summary artifact.
- [CONFIRMED] No visible editorial framework block explaining evidence grading.

**Impact:**
- [VERIFY] Hardening the build and deepening the evidence UX should increase trust-led assisted conversion and reduce abandonment from skeptical high-intent visitors.

### Blog Hub and Blog Detail Template (`/blog`, `/blog/*`)
**Present:**
- [CONFIRMED] Blog routes are indexable, structured, and technically clean at the metadata/schema level.
- [CONFIRMED] The sampled article loads with proper title, description, and article schema.

**MISSING CRITICAL:**
- [CONFIRMED] The sampled blog post only has 237 visible words, which is thin for health-adjacent, intent-capturing editorial content.
- [CONFIRMED] Proof pack - Articles: [Mobile Accessibility Barriers For Assistive Technology Users](https://www.smashingmagazine.com/2024/02/mobile-accessibility-barriers-assistive-technology-users/) reinforces the need for clear content hierarchy, and [Announcing Baseline in action](https://web.dev/blog/announcing-baseline-in-action) reinforces modern, clearer content delivery patterns.
- [CONFIRMED] Proof pack - User pains: article CTA architecture is weak (`Back to Blog`, `Share`, `Save`, `More Articles`) and the visible proof/review/freshness layer is not strong enough for health-adjacent content.
- [CONFIRMED] Proof pack - Competitor examples: [Healf](https://healf.com/) integrates editorial learning with quizzes, curation, and commerce pathways, while [Leela Quantum](https://leelaq.com/) integrates research, blog, media, podcasts, and events into one authority loop.
- [CONFIRMED] The blog detail template needs visible author/reviewer/freshness, richer inline citation behavior, stronger next-step CTAs into conditions/protocols/products, and deeper content per article.

**MISSING VS TOP 10%:**
- [CONFIRMED] No strong expert bios or reviewer modules.
- [CONFIRMED] No study-inline citations or related evidence sidebar.
- [CONFIRMED] No strong commercial bridge beyond general archive navigation.

**Impact:**
- [VERIFY] Strengthening the editorial layer should improve non-brand organic capture, assisted trust, and mid-funnel nurturing performance over 12-36 months.

### Contact (`/contact`)
**Present:**
- [CONFIRMED] The page has contact metadata, multiple contact methods, a multi-step inquiry wizard, emergency triage copy, and callback scheduling UI.
- [CONFIRMED] The route is clearly intended as a serious lead-capture/support surface.

**MISSING CRITICAL:**
- [CONFIRMED] The callback scheduler is not actually wired; [components/ContactPage.tsx](F:/ag projects/Hylono_MAIN - SEO BOOST/components/ContactPage.tsx:86) contains `// TODO: connect to /api/callback endpoint when implemented`.
- [CONFIRMED] Proof pack - User pains: the page has no H2 structure, only 108 visible words in the main content audit, and the visual screenshot automation produced a mostly empty fold despite the form existing in the DOM. This is a strong sign that the contact experience is not stable enough visually.
- [CONFIRMED] Proof pack - Competitor examples: [Next Health](https://www.next-health.com/) uses a complimentary consult as a core entry action, and [Upgrade Labs](https://upgradelabs.com/) explains the first-visit sequence and free scan in a conversion-first way.
- [CONFIRMED] The page lacks a real booking integration, clear SLA by inquiry type, stronger B2B vs B2C routing, and richer trust proof for why the user should start the conversation now.

**MISSING VS TOP 10%:**
- [CONFIRMED] No live calendar or working callback booking.
- [CONFIRMED] No case-routing clarity by problem type, market, or urgency.
- [CONFIRMED] No visible advisor/expert proof or multilingual service proof.

**Impact:**
- [VERIFY] Fixing this page alone can materially lift qualified inquiry completion because it is the universal endpoint from homepage, research, conditions, protocols, product, and rental pages.

### Wellness Planner (`/wellness-planner`)
**Present:**
- [CONFIRMED] Planner route exists, is properly noindexed, and gives four structured entry paths.

**MISSING CRITICAL:**
- [CONFIRMED] The planner surface is strategically underdeveloped: only 121 visible words, one shallow screen, and no visible explanation of how recommendations are generated.
- [CONFIRMED] Proof pack - Articles: [Announcing Baseline in action](https://web.dev/blog/announcing-baseline-in-action) and [New Front-End Features For Designers In 2025](https://www.smashingmagazine.com/2024/12/new-front-end-features-for-designers-in-2025/) both support richer guided interactions without overloading the JS layer.
- [CONFIRMED] Proof pack - Competitor examples: [Healf](https://healf.com/) offers a quiz, [Next Health](https://www.next-health.com/) frames a consult-driven path, and [Upgrade Labs](https://upgradelabs.com/) starts with a free scan plus personalized walkthrough.
- [CONFIRMED] The planner should be the site's best differentiator, but today it looks more like a hidden menu than a world-class recommendation engine.

**MISSING VS TOP 10%:**
- [CONFIRMED] No save/resume/email result.
- [CONFIRMED] No explanation of methodology or confidence.
- [CONFIRMED] No projected stack outcome, budget tier, or timeline preview.

**Impact:**
- [VERIFY] Turning the planner into a premium recommendation flow is one of the highest-leverage initiatives on the site.

### Help / FAQ (`/help`, `/faq`, `/support`)
**Present:**
- [CONFIRMED] Help and FAQ surfaces exist, and `/support` correctly resolves to `/help?tab=support` on warm-up.
- [CONFIRMED] Hylono already has the policy/trust foundation to support a serious support center.

**MISSING CRITICAL:**
- [CONFIRMED] The help layer still lacks a structured self-service decision tree, setup video layer, device troubleshooting matrix, and visible escalation path by device family.
- [CONFIRMED] Proof pack - Competitor examples: [OxyHelp](https://oxyhelp.com/) exposes FAQ, contact, risk notes, and shipping from the main journey; [Hydrogen for Health](https://hydrogen4health.com/) exposes setup video, FAQ, benefits taxonomy, and contact paths.

**MISSING VS TOP 10%:**
- [CONFIRMED] No searchable issue-resolution matrix by device or symptom.
- [CONFIRMED] No visible ticket-status or after-purchase support handoff.

**Impact:**
- [VERIFY] Better self-service support reduces service load and builds trust pre-purchase.

### Affiliate (`/affiliate`)
**Present:**
- [CONFIRMED] The route is honest, noindexed, and clearly framed as a manual review path rather than a fake self-serve affiliate program.

**MISSING CRITICAL:**
- [CONFIRMED] No concrete program tiers, response windows, example partner profiles, case studies, or benefit framing.
- [CONFIRMED] Proof pack - Competitor examples: [Leela Quantum](https://leelaq.com/) exposes a practitioner reseller program and partner resources, and [Hydrogen for Health](https://hydrogen4health.com/) exposes an affiliate/login layer directly in navigation.

**MISSING VS TOP 10%:**
- [CONFIRMED] No partner-proof or program economics.
- [CONFIRMED] No real reason to convert here beyond the fact that the route exists.

**Impact:**
- [VERIFY] This matters for channel growth, but it is not a top-three site priority relative to homepage, planner, PDPs, and contact.

### Partners / Rewards / Gated Account Cluster (`/partners`, `/rewards`, `/account`, `/login`, `/onboarding`)
**Present:**
- [CONFIRMED] Metadata exists for the routes and they are correctly noindexed.
- [CONFIRMED] Route shells are reachable.

**MISSING CRITICAL:**
- [CONFIRMED] `/partners` and `/rewards` render with zero visible main-copy in the route crawl; `/account` also renders with zero visible main-copy; `/login` renders only 16 visible words and no H1.
- [CONFIRMED] Source inspection points to a likely root cause: [components/GatedView.tsx](F:/ag projects/Hylono_MAIN - SEO BOOST/components/GatedView.tsx:15) blocks on `useSession()` and returns a spinner while loading, which can leave public visitors with an effectively empty experience.
- [CONFIRMED] Proof pack - User pains: screenshot evidence shows `/partners` as a blank body with only a spinner and footer; the same pattern affects other gated routes.
- [CONFIRMED] Proof pack - Competitor examples: [Leela Quantum](https://leelaq.com/) and [Next Health](https://www.next-health.com/) surface partner/reseller or member entry with clear surrounding context rather than a near-empty shell.

**MISSING VS TOP 10%:**
- [CONFIRMED] No SSR-safe gated preview state.
- [CONFIRMED] No persuasive public access request page.
- [CONFIRMED] No partner-benefit framing, proof, or program explanation.

**Impact:**
- [VERIFY] Fixing blank gated business pages will stop silent pipeline loss and make partnership/account entry credible.

### Careers (`/careers`)
**Present:**
- [CONFIRMED] Targeted recrawl after warm-up returned 200 status, H1 `Join Our Team`, and visible role listings.
- [CONFIRMED] The route is correctly noindexed and disallowed from crawl promotion per the repo tests.

**MISSING CRITICAL:**
- [CONFIRMED] The visible content is still thin at 101 words, with weak employer-brand proof and no deeper process, culture, benefits, or hiring narrative.
- [CONFIRMED] This is a low-priority business route relative to commercial pages.

**Impact:**
- [VERIFY] Low commercial impact unless Hylono is actively recruiting.

### Nexus Cluster (`/nexus`, `/nexus/*`)
**Present:**
- [CONFIRMED] The internal/noindex workspace has a full route network across overview, clients, fleet, academy, supplies, docs, studio, and team.

**MISSING CRITICAL:**
- [CONFIRMED] Accessibility issues are sharper here than elsewhere: critical unlabeled buttons, missing labels, missing H1s, and selector issues appear on `/nexus`, `/nexus/docs`, `/nexus/team`, `/nexus/fleet`, `/nexus/clients`, and `/nexus/studio`.
- [CONFIRMED] Because these are non-indexable partner/ops routes, they are medium priority for public growth but still high priority for operator usability and trust.

**Impact:**
- [VERIFY] Improving these routes helps partner and internal retention rather than top-funnel acquisition.

## 3) COMPETITIVE INTELLIGENCE REPORT
### Intelligence Objective
[CONFIRMED] The objective was to benchmark Hylono against direct wellness-tech competitors and adjacent category leaders that already operate at a higher experience, trust, and conversion maturity level. [CONFIRMED] I prioritized official competitor sites and current 2024-2026 sources over generic UX advice so the gaps reflect what best-in-class operators are shipping now. [INFERRED] The main question was not `does Hylono have pages`; it was `does Hylono create the same confidence, clarity, and guided momentum as the category leaders users compare it against`.

### Direct Competitors and Category Leaders Used
- [CONFIRMED] Direct competitors: [Next Health](https://www.next-health.com/), [Upgrade Labs](https://www.upgradelabs.com/), [OxyHelp](https://oxyhelp.com/), [Leela Quantum Tech](https://leelaq.com/), [Hydrogen for Health](https://hydrogen4health.com/), [Healf](https://healf.com/).
- [CONFIRMED] Category leaders outside niche: [WHOOP](https://www.whoop.com/), [Oura](https://ouraring.com/it), [Eight Sleep](https://www.eightsleep.com/it/).

### 5 Benchmarking Dimensions
1. [CONFIRMED] Performance and interaction smoothness.
2. [CONFIRMED] UX patterns for guided entry and decision-making.
3. [CONFIRMED] Content depth and authority loops.
4. [CONFIRMED] Trust signals and risk-reversal.
5. [CONFIRMED] Innovation and differentiation.

### 4-row Comparative Matrix
| Archetype | Examples | What They Do Better [CONFIRMED] | What Hylono Still Lacks [CONFIRMED/INFERRED] |
| --- | --- | --- | --- |
| Clinic-led longevity stack | [Next Health](https://www.next-health.com/), [Upgrade Labs](https://www.upgradelabs.com/) | Complimentary consults/free scans, explicit first-visit journey, location proof, membership pricing, named testimonials, data-driven programs | Equivalent guided entry, consultation momentum, richer social proof, stronger membership/trial framing |
| Device-commerce specialist | [OxyHelp](https://oxyhelp.com/), [Hydrogen for Health](https://hydrogen4health.com/) | Setup videos, pricing on-page, FAQs, shipping/contact clarity, safety mechanisms, financing, manufacturer access | Richer setup media, harder proof near CTA, stronger pricing/finance/logistics clarity, better canonical alias hygiene |
| Wellness marketplace / authority ecosystem | [Healf](https://healf.com/), [Leela Quantum Tech](https://leelaq.com/) | Quiz-driven discovery, category taxonomies, sale/trust banners, curation/process proof, research/blog/media/events/community loops | Better discovery by goal, stronger trust ribbons, more obvious authority ecosystem, better partner/reseller framing |
| Adjacent category UX leader | [WHOOP](https://www.whoop.com/), [Oura](https://ouraring.com/it), [Eight Sleep](https://www.eightsleep.com/it/) | Trial offers, membership comparison, clear product tiering, named testimonials, strong lifestyle storytelling | Better tiering, stronger risk reversal, higher-density social proof, more legible commercial story |

### 5 Signal vs Noise
1. [CONFIRMED] Signal: leaders make the first action obvious; noise: ornamental futuristic language without a first-step payoff.
2. [CONFIRMED] Signal: named proof, pricing, and risk reversal close trust gaps; noise: abstract wellness promises alone.
3. [CONFIRMED] Signal: category leaders expose consult, scan, quiz, or trial entry quickly; noise: forcing users to self-assemble the next step.
4. [CONFIRMED] Signal: ecosystems that unify research, education, media, and product journeys feel more authoritative; noise: isolated content hubs without clear momentum.
5. [CONFIRMED] Signal: modern native interaction patterns reduce UI brittleness; noise: visually stylish but inaccessible or unstable experiences.

### Insight Synthesis
[CONFIRMED] Hylono already has a better SEO graph than several competitors, but its public experience still feels lighter and less trustworthy than the strongest operators in the category. [CONFIRMED] The site wins on structure and loses on confidence creation: tiering, proof, guided entry, demo/scan/consult loops, and commercial reassurance are the biggest deltas. [INFERRED] That means Hylono does not need a new architecture first; it needs a much stronger commercial and trust layer applied to the architecture it already has.

### Validation
[CONFIRMED] Competitor observations came from official sites crawled on 2026-04-11 plus current 2024-2026 source articles. [CONFIRMED] Internal findings came from the local project runtime, build output, route crawl, Lighthouse JSON, accessibility scan, source inspection, and screenshots. [VERIFY] The exact commercial impact of each competitive gap still depends on Hylono's traffic mix, AOV, assisted close rate, and post-lead sales process.

## 4) WHAT WORLD-CLASS SITES HAVE THAT YOU DON'T
| Feature / Pattern | Competitor Examples (3+) [CONFIRMED] | Your Status [CONFIRMED/INFERRED] | Evidence URLs | Priority [INFERRED] |
| --- | --- | --- | --- | --- |
| Guided entry quiz / consult / free scan | Next Health, Upgrade Labs, Healf | [CONFIRMED] Missing on homepage and weak in planner | [Next Health](https://www.next-health.com/), [Upgrade Labs](https://www.upgradelabs.com/), [Healf](https://healf.com/) | P1 |
| Visible plan or membership comparison | Next Health, WHOOP, Oura | [CONFIRMED] Missing at site level; partial rent-vs-buy only | [Next Health](https://www.next-health.com/), [WHOOP](https://www.whoop.com/), [Oura](https://ouraring.com/it) | P1 |
| Rich proof stack: named testimonials, media logos, quotes | Next Health, Upgrade Labs, Eight Sleep | [CONFIRMED] Weak on core Hylono pages | [Next Health](https://www.next-health.com/), [Upgrade Labs](https://www.upgradelabs.com/), [Eight Sleep](https://www.eightsleep.com/it/) | P1 |
| Strong risk reversal in commerce chrome | Healf, WHOOP, Oura | [CONFIRMED] Footer policies exist, high-visibility trust ribbon does not | [Healf](https://healf.com/), [WHOOP](https://www.whoop.com/), [Oura](https://ouraring.com/it) | P1 |
| Setup video / first-use guidance near product decisions | Hydrogen for Health, OxyHelp, Upgrade Labs | [CONFIRMED] Missing on key PDPs | [Hydrogen for Health](https://hydrogen4health.com/), [OxyHelp](https://oxyhelp.com/), [Upgrade Labs](https://www.upgradelabs.com/) | P1 |
| Transparent operational journey | Next Health, Upgrade Labs, OxyHelp | [CONFIRMED] Hylono hints at it but does not visualize it strongly | [Next Health](https://www.next-health.com/), [Upgrade Labs](https://www.upgradelabs.com/), [OxyHelp](https://oxyhelp.com/) | P1 |
| Community / media / event authority loop | Leela Quantum, Next Health, Healf | [CONFIRMED] Present only partially through blog/research | [Leela Quantum](https://leelaq.com/), [Next Health](https://www.next-health.com/), [Healf](https://healf.com/) | P2 |
| Better category taxonomy for discovery | Healf, Upgrade Labs, OxyHelp | [CONFIRMED] Store hub is too abstract and CTA-homogeneous | [Healf](https://healf.com/), [Upgrade Labs](https://www.upgradelabs.com/), [OxyHelp](https://oxyhelp.com/) | P1 |
| Financing / trial / starter offer near conversion | Hydrogen for Health, WHOOP, Oura | [CONFIRMED] Missing or low-visibility | [Hydrogen for Health](https://hydrogen4health.com/), [WHOOP](https://www.whoop.com/), [Oura](https://ouraring.com/it) | P1 |
| Public partner / reseller framing that actually converts | Leela Quantum, Hydrogen for Health, Next Health | [CONFIRMED] Hylono partner routes are blank or underdeveloped | [Leela Quantum](https://leelaq.com/), [Hydrogen for Health](https://hydrogen4health.com/), [Next Health](https://www.next-health.com/) | P2 |
| Strong evidence + commerce handoff | Leela Quantum, OxyHelp, Next Health | [CONFIRMED] Hylono has the graph but not the same authority density | [Leela Quantum](https://leelaq.com/), [OxyHelp](https://oxyhelp.com/), [Next Health](https://www.next-health.com/) | P1 |
| Named user stories tied to use case outcomes | Upgrade Labs, Eight Sleep, WHOOP | [CONFIRMED] Hylono core routes lack this density | [Upgrade Labs](https://www.upgradelabs.com/), [Eight Sleep](https://www.eightsleep.com/it/), [WHOOP](https://www.whoop.com/) | P1 |

## 5) CUTTING-EDGE OPPORTUNITIES 2025-2026
| Innovation | Description [CONFIRMED/INFERRED] | Examples in the wild [CONFIRMED] | Feasibility | Effort | Expected Impact [VERIFY] |
| --- | --- | --- | ---: | --- | --- |
| Baseline `dialog` + `popover` consult layer | [CONFIRMED] Replace brittle JS-heavy modal flows with Baseline-supported consult, compare, and support overlays | [web.dev Baseline in action](https://web.dev/blog/announcing-baseline-in-action) | 8/10 | Medium | +6-14% consult completion |
| Cross-document view transitions | [CONFIRMED] Smooth transitions between homepage -> store -> product -> planner to make the site feel premium and guided | [Smashing 2025 features](https://www.smashingmagazine.com/2024/12/new-front-end-features-for-designers-in-2025/) | 7/10 | Medium | +3-7% journey continuation |
| Exclusive accordions with `<details name>` | [CONFIRMED] Improve FAQ, condition, and protocol readability without JS bloat | [Smashing 2025 features](https://www.smashingmagazine.com/2024/12/new-front-end-features-for-designers-in-2025/) | 9/10 | Low | +2-5% engagement on long pages |
| Late validation with `:user-valid` / `:user-invalid` | [CONFIRMED] Remove premature error states on planner/contact/checkout | [Smashing 2025 features](https://www.smashingmagazine.com/2024/12/new-front-end-features-for-designers-in-2025/) | 8/10 | Low | +3-8% form completion |
| Autofill instrumentation on forms | [INFERRED] Measure planner/contact/checkout autofill friction and eliminate unnecessary fields | [PageSpeed Insights](https://pagespeed.web.dev) is linked from [web.dev](https://web.dev/blog/announcing-baseline-in-action) as tooling baseline; Hylono should instrument forms internally | 7/10 | Medium | +2-6% lead completion |
| Protocol passport | [INFERRED] Turn protocols into saveable/shareable printable plans with progress steps | WHOOP, Oura, Next Health membership/program framing | 6/10 | High | +5-12% repeat visits |
| Evidence strength filters | [INFERRED] Let users sort research by modality, evidence strength, and intended use | Leela Quantum research hub, OxyHelp FAQ/science split | 7/10 | Medium | +4-9% trust-led engagement |
| Rich trust ribbon in commerce chrome | [CONFIRMED] Surface shipping, returns, warranty, finance, and consult promise near every decision | Healf, Oura, WHOOP | 9/10 | Low | +5-11% PDP conversion intent |
| Guided first-visit / first-session sequence | [CONFIRMED] Make the Hylono `how it works` journey feel operational and premium | Next Health, Upgrade Labs | 8/10 | Medium | +7-15% consult starts |
| Authority ecosystem layer | [CONFIRMED] Add press, podcasts, events, experts, research counts, and partner proof around core routes | Leela Quantum, Next Health, Upgrade Labs | 6/10 | Medium | +4-10% trust conversion |

## 6) BRAND POSITIONING GAPS
### Positioning Context
[CONFIRMED] Hylono currently presents itself as a credible wellness-technology platform, but the public experience often describes the architecture better than the promise. [CONFIRMED] The site knows how to connect conditions, research, products, protocols, and contact, yet it often fails to make the value proposition emotionally and commercially legible in the first screen. [INFERRED] The brand should position itself as the premium guided decision layer for complex wellness technologies, not just a catalogue of advanced devices.

### 3 Pillars with Own / Not Compete
| Pillar | Own [INFERRED] | Do Not Compete [INFERRED] |
| --- | --- | --- |
| Guided Clarity | Own the clearest path from goal -> evidence -> protocol -> device -> human help | Do not compete on hype-heavy biohacking mystique alone |
| Responsible Performance | Own conservative, evidence-aware performance and recovery guidance | Do not compete on unsupported miracle claims |
| White-Glove Access | Own premium assisted discovery, rental, and setup support | Do not compete on mass-discount gadget-store behavior |

### Messaging Architecture
| Layer | Message [INFERRED] | Proof Needed [CONFIRMED/VERIFY] | CTA |
| --- | --- | --- | --- |
| Hero | `Find the right wellness technology for your goal, budget, and space.` | [CONFIRMED] Needs stronger category headline and consult/quiz entry | Start with a guided consult |
| Trust | `See what is evidence-backed, what is exploratory, and what fits your use case.` | [CONFIRMED] Needs visible reviewer/freshness/proof architecture | Review the evidence |
| Commerce | `Choose rent, buy, or build a protocol without guessing.` | [CONFIRMED] Needs stronger plan, price, and risk-reversal layer | Compare options |
| Relationship | `Talk to a human when the decision gets complex.` | [CONFIRMED] Needs working callback/booking integration | Book a consultation |

### 5 Competitor Patterns
1. [CONFIRMED] [Next Health](https://www.next-health.com/) turns longevity/wellness complexity into memberships, consults, and step-based journeys.
2. [CONFIRMED] [Upgrade Labs](https://www.upgradelabs.com/) makes data, free entry, and named testimonials central to the brand.
3. [CONFIRMED] [Healf](https://healf.com/) makes category navigation and risk reversal obvious.
4. [CONFIRMED] [OxyHelp](https://oxyhelp.com/) combines FAQ depth, safety detail, contact pathways, and shipping clarity.
5. [CONFIRMED] [WHOOP](https://www.whoop.com/) / [Oura](https://ouraring.com/it) make product-tier and membership logic extremely legible.

### 5 Audience Risks
1. [CONFIRMED] New visitors may not understand what Hylono is fast enough from the homepage hero alone.
2. [CONFIRMED] Skeptical wellness buyers may want stronger proof, experts, media, and reviewer signals before contacting.
3. [CONFIRMED] Price-sensitive users may not see clear rent/buy/tier options quickly enough.
4. [CONFIRMED] High-intent users may hit weak end-states on partners, rewards, or account-like surfaces.
5. [CONFIRMED] Health-adjacent users may want stronger visible authorship/review/freshness cues before trusting guidance.

### Validation
[CONFIRMED] The brand-direction recommendations are grounded in what Hylono already does well structurally. [CONFIRMED] They do not require abandoning the current SEO graph or conservative compliance posture. [VERIFY] Message validation should be confirmed with live user testing, search console data, and consult-call recordings before final rollout.

## 7) BUSINESS IMPACT QUANTIFICATION
| Initiative | 0-12m KPI Impact [VERIFY] | 1-3y KPI Impact [VERIFY] | 3-5y KPI Impact [VERIFY] |
| --- | --- | --- | --- |
| Rebuild homepage around category clarity + guided consult | +12-28% consult starts; +6-14% qualified sessions to next step | +8-18% branded search efficiency | EUR 120k-EUR 450k assisted pipeline upside depending on lead close rate |
| Rebuild `/store` and `/rental` as comparison + qualification hubs | +10-24% PDP clickthrough; +8-20% advisor intent | +6-15% assisted conversion rate | EUR 150k-EUR 600k revenue upside if product mix and AOV hold |
| Fix PDP accessibility + trust + sticky CTA layer | +9-22% PDP conversion intent | +5-12% organic-to-assisted lift | Better margin retention through fewer low-fit inquiries |
| Turn planner into premium recommendation engine | +15-35% planner starts; +10-25% consult quality | Stronger first-party audience segmentation | Could become Hylono's highest-leverage owned acquisition asset |
| Repair contact + callback + partner/rewards blank states | +8-18% lead completion; lower silent drop-off | Better partner pipeline and customer support trust | Compounds into stronger ecosystem and referral economics |
| Performance pass on home/store/product/research/contact | +4-11% organic sessions; +3-9% conversion support | Better shareability and lower bounce on mobile | Durable SEO and brand-quality gains |
| Strengthen health-content reviewer/freshness layer | +3-8% trust-led engagement | Stronger defensibility in YMYL-adjacent search | Reduced future compliance risk |
| Build authority ecosystem (press, experts, events, proof) | +4-10% trust conversion | Better partner acquisition and brand lift | Higher defensibility vs copycat wellness shops |

## 8) CROSS-DOMAIN INNOVATION TRANSFER
### 5 Transferable Principles with 3 Applications Each
1. [CONFIRMED] Principle: Wearable-grade onboarding clarity.  
Applications: [INFERRED] membership/tier comparison on the homepage; [INFERRED] `start with goal / start with budget / start with space` planner logic with explicit outcome previews; [INFERRED] upgrade-path logic from rent -> buy -> protocol plan.  
Feasibility: 8/10.

2. [CONFIRMED] Principle: Clinic-grade consult orchestration.  
Applications: [INFERRED] free consult or paid diagnostic entry; [INFERRED] first-visit sequence visuals on homepage and rental hub; [INFERRED] stronger advisor routing on contact and planner outputs.  
Feasibility: 9/10.

3. [CONFIRMED] Principle: Specialist-commerce trust chrome.  
Applications: [INFERRED] persistent trust ribbon on every commercial route; [INFERRED] setup video / FAQ / safety stack on PDPs; [INFERRED] finance, shipping, and returns visible near CTA.  
Feasibility: 9/10.

4. [CONFIRMED] Principle: Authority-loop publishing.  
Applications: [INFERRED] expert bios/reviewers on health-adjacent content; [INFERRED] press/podcast/event layer; [INFERRED] research hub filters and evidence summaries.  
Feasibility: 7/10.

5. [CONFIRMED] Principle: Native, low-friction modern UX.  
Applications: [INFERRED] Baseline `dialog`/`popover` compare flows; [INFERRED] exclusive accordions for FAQs and long-form guidance; [INFERRED] late validation and improved focus/contrast on all forms.  
Feasibility: 8/10.

### Hybrid Concept
[INFERRED] Hybrid concept: `Hylono Protocol Concierge` - a premium guided planner that starts with goal/budget/space, shows an evidence-aware stack recommendation, explains why each modality is included, offers a free consult or rental-first path, and saves a printable protocol passport for the user. [INFERRED] This combines the clarity of WHOOP/Oura onboarding, the consult mechanics of Next Health, the free-scan framing of Upgrade Labs, and the evidence graph Hylono already owns. [VERIFY] This concept should be tested first as a noindex experiment before site-wide rollout.

## 9) PRIORITIZED ROADMAP
| Rank | Initiative | Page / Surface | Impact | Effort | Type | Timeline | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Verify research build failure status | `/research` | [VERIFIED OUTDATED 2026-04-12] | Low | CLOSED | Done | Current `app/research/page.tsx` no longer reproduces the reported line-335 error |
| 2 | Repair blank partner/rewards/account experiences with public previews and partner intake | `/partners`, `/rewards`, `/account` | [DONE 2026-04-12] | Medium | QUICK WIN | Done | `app/partners/*`, `app/rewards/*`, `components/PartnerPortal.tsx`, `tests/components/PartnerPortal.test.tsx` |
| 3 | Verify callback scheduler status and preserve contact draft flow | `/contact` | [VERIFIED OUTDATED 2026-04-12] | Low | CLOSED | Done | `tests/components/ContactPage.test.tsx` confirms the selected callback slot is drafted into the message |
| 4 | Reframe homepage hero + trust + consult/quiz entry | `/` | [INFERRED] Very high | Medium | STRATEGIC | 1-2 weeks | Crawl + competitor benchmark |
| 5 | Rebuild `/store` as a comparison hub | `/store` | [INFERRED] Very high | High | STRATEGIC | 2-3 weeks | Crawl + Healf/Oura/WHOOP patterns |
| 6 | Rebuild `/wellness-planner` into a premium recommendation engine | `/wellness-planner` | [INFERRED] Very high | High | DIFFERENTIATOR | 2-4 weeks | Crawl + Next Health/Upgrade Labs patterns |
| 7 | Add sticky CTA, trust ribbon, demo/setup, and accessibility fixes to PDP template | `/product/*` | [INFERRED] Very high | High | STRATEGIC | 2-4 weeks | PDP crawl + Lighthouse + competitor examples |
| 8 | Add visible reviewer/freshness/evidence-strength layer on condition, protocol, research, blog pages | `/conditions/*`, `/protocols/*`, `/research`, `/blog/*` | [CONFIRMED] High | Medium | FUTURE-PROOF | 2-3 weeks | Repo rules + crawl |
| 9 | Performance pass on home/store/product/research/rental/contact | Core conversion routes | [CONFIRMED] High | Medium | QUICK WIN | 1-2 weeks | Lighthouse summary |
| 10 | Build stronger authority ecosystem layer | Home + About + Research + Blog + Press | [INFERRED] High | Medium | DIFFERENTIATOR | 3-6 weeks | Competitor research |
| 11 | Add self-service support matrix, setup video, and device troubleshooting | `/help`, `/faq`, support routes | [INFERRED] Medium | Medium | STRATEGIC | 2-3 weeks | OxyHelp + Hydrogen4Health patterns |
| 12 | Clean alias/canonical hydrogen route layer and surface clearer model comparison | Hydrogen model cluster | [INFERRED] Medium | Medium | FUTURE-PROOF | 1-2 weeks | Route crawl + targeted recrawl |
| 13 | Bring Nexus routes up to basic accessibility/operator quality standard | `/nexus/*` | [CONFIRMED] Medium | Medium | QUICK WIN | 1-2 weeks | Axe results |
| 14 | Expand careers/affiliate only after commercial surfaces are fixed | `/careers`, `/affiliate` | [INFERRED] Low | Low | DEFER | After P1-P10 | Crawl + business impact model |

## 10) APPENDIX - EVIDENCE PACK
### 10.1) Audit Environment and Constraints
- [CONFIRMED] Primary crawl runtime: `http://127.0.0.1:3010`.
- [CONFIRMED] Canonical site emitted by metadata: `https://hylono.eu`.
- [CONFIRMED] Live-domain DNS resolution for `https://hylono.eu` failed in shell/Lighthouse from this environment, so live PageSpeed Insights could not be executed; local Lighthouse baselines were used instead.
- [CONFIRMED] Build verification command: `next build` via local project binary.
- [CONFIRMED] Accessibility engine: Playwright + `@axe-core/playwright`.

### 10.2) Key Screenshot Descriptions
- [CONFIRMED] `artifacts/deep-audit/screens/home.png`: visually premium but the top fold does not clearly explain the category fast enough; proof density is low relative to leaders.
- [CONFIRMED] `artifacts/deep-audit/screens/store.png`: product cards are present, but the comparison layer and trust chrome are thin.
- [CONFIRMED] `artifacts/deep-audit/screens/product-hbot.png`: strong long-form PDP, but proof and CTA architecture still trail leaders.
- [CONFIRMED] `artifacts/deep-audit/screens/research.png`: strong evidence hub concept, but operational and UX depth still lag best-in-class authority sites.
- [CONFIRMED] `artifacts/deep-audit/screens/planner.png`: strategically important surface with too little visible decision logic.
- [CONFIRMED] `artifacts/deep-audit/screens/partners.png`: blank/spinner-led body with footer only, confirming a broken or under-rendered public partner route.
- [CONFIRMED] `artifacts/deep-audit/screens/careers-404.png`: warm-up follow-up showed content after the first crawl misclassified the route; careers is accessible but thin.

### 10.3) Source URLs Used
- [CONFIRMED] Hylono internal evidence: [route-crawl.json](F:/ag projects/Hylono_MAIN - SEO BOOST/artifacts/deep-audit/route-crawl.json), [lighthouse-summary.md](F:/ag projects/Hylono_MAIN - SEO BOOST/artifacts/deep-audit/lighthouse-summary.md), [screens](F:/ag projects/Hylono_MAIN - SEO BOOST/artifacts/deep-audit/screens), [app/research/page.tsx](F:/ag projects/Hylono_MAIN - SEO BOOST/app/research/page.tsx:335), [components/ContactPage.tsx](F:/ag projects/Hylono_MAIN - SEO BOOST/components/ContactPage.tsx:86), [components/GatedView.tsx](F:/ag projects/Hylono_MAIN - SEO BOOST/components/GatedView.tsx:15).
- [CONFIRMED] Competitor official sites: [Next Health](https://www.next-health.com/), [Upgrade Labs](https://www.upgradelabs.com/), [OxyHelp](https://oxyhelp.com/), [Leela Quantum Tech](https://leelaq.com/), [Hydrogen for Health](https://hydrogen4health.com/), [Healf](https://healf.com/), [WHOOP](https://www.whoop.com/), [Oura](https://ouraring.com/it), [Eight Sleep](https://www.eightsleep.com/it/).
- [CONFIRMED] 2024-2026 pattern sources: [Announcing Baseline in action - web.dev, Dec 2 2025](https://web.dev/blog/announcing-baseline-in-action), [New Front-End Features For Designers In 2025 - Smashing Magazine](https://www.smashingmagazine.com/2024/12/new-front-end-features-for-designers-in-2025/), [Mobile Accessibility Barriers For Assistive Technology Users - Smashing Magazine](https://www.smashingmagazine.com/2024/02/mobile-accessibility-barriers-assistive-technology-users/).

### 10.4) Notes on Confidence
- [CONFIRMED] Route statuses, titles, H1/H2 counts, word counts, schema types, Lighthouse scores, accessibility issues, and source-level findings are direct observations from the audit.
- [INFERRED] Strategic gap framing and competitor-to-Hylono deltas are reasoned from those observations.
- [VERIFY] Commercial KPI forecasts and some innovation impact ranges should be validated against analytics, CRM data, and call-conversion data before investment commitments.


