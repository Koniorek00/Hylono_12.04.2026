# SEO Maximum + Design Parity Operating Standard â€” v2 (March 2026 Hardened)

_Last updated: 2026-03-10 | Applies to: any future SEO rebuild, refactor, redesign, migration, or route rewrite in this repository_

## 1. Purpose

This document is the operating standard for improving SEO in `F:\ag projects\Hylono_MAIN - SEO BOOST`, which already represents the locked public design baseline and currently matches the old pre-SEO site visually 1:1. SEO work must happen **without changing that public visual experience**:

- `F:\ag projects\OLD\Hylono_MAIN - Copy- BEFORE SEO UPDATE 05.03`

The instruction is explicit:

- the code may change completely
- the architecture may change completely
- rendering strategy may change completely
- metadata, schema, routing internals, data loading, and component boundaries may all change
- the visible design, layout logic, composition, and premium feel of the current `Hylono_MAIN - SEO BOOST` repo must remain unchanged

This is not â€œmake it similar enough.â€
This is â€œrebuild the internals for maximum practical SEO while preserving the old visual product experience as the public-facing contract.â€


Read this together with:

- `docs/governance/seo-page-production-guide.md`
- `docs/governance/seo-redesign-priority-map.md`
- `docs/strategy/seo-visual-restoration-report-2026-03-07.md`
- `SEO_MASTER_PLAN.MD`
- `docs/specs/seo-ai-visibility-reporting.md`
- `docs/governance/seo-final-signoff-checklist.md`

## 2. Core Operating Principle

**SEO must enter the old design. The old design must not be broken apart for SEO.**

If there is a conflict between:

- â€œSEO is easier if we simplify the UIâ€
- and
- â€œthe old premium design must remainâ€

then the agent must solve SEO **inside the old visual shell**, not flatten or redesign the page.

That means preserving:

- visual hierarchy
- hero composition
- major section order
- CTA positions and emphasis
- card geometry and premium product framing
- navigation feel
- store and product-page mood
- product-theater and systems-language presentation

SEO work may change implementation. It may not change the visible experience.

## 3. Evidence Tiers: What Is Google/OpenAI/Bing Truth vs What Is Repo Policy

This document intentionally separates three layers:

### 3.1 External platform truths
These come from current official documentation and should not be overstated.

Examples:

- Google can process JavaScript, but it still recommends crawlable links, reliable rendering, strong canonical control, and accurate structured data.
- Google does **not** guarantee rich results, even when markup is syntactically valid.
- Google primarily generates snippets from page content, and may use meta descriptions when they describe the page better.
- OpenAI search visibility and training controls are separate.
- Bing now exposes AI citation visibility in Webmaster Tools.

### 3.2 Repo policy
These are Hylono operating choices.

Examples:

- public routes should be server-first by default
- SEO-critical content should exist in meaningful HTML
- design parity with the current `Hylono_MAIN - SEO BOOST` visual baseline is mandatory
- faceted navigation cannot ship without a written decision matrix

### 3.3 Internal heuristics
These are preferred patterns, not universal laws.

Examples:

- answer-first blocks near the top of the route
- research bridges inserted in native premium modules
- ownership/freshness styled as micro-metadata rails
- AI-citable answer blocks built into the page language, not bolted on as ugly SEO sections

## 4. Visual Source of Truth

The current `Hylono_MAIN - SEO BOOST` implementation is the active visual baseline because it already matches the old site 1:1. The old backup repo is a control/reference source for verification or dispute resolution only. Do **not** redesign the current implementation while doing SEO work.

### 4.1 Backup reference paths for design verification

Homepage and hero:

- `F:\ag projects\OLD\Hylono_MAIN - Copy- BEFORE SEO UPDATE 05.03\components\Home.tsx`
- `F:\ag projects\OLD\Hylono_MAIN - Copy- BEFORE SEO UPDATE 05.03\components\heroes\HeroConcept1.tsx`

Header and navigation:

- `F:\ag projects\OLD\Hylono_MAIN - Copy- BEFORE SEO UPDATE 05.03\src\components\layout\Header.tsx`
- `F:\ag projects\OLD\Hylono_MAIN - Copy- BEFORE SEO UPDATE 05.03\components\MegaMenu.tsx`
- `F:\ag projects\OLD\Hylono_MAIN - Copy- BEFORE SEO UPDATE 05.03\components\MegaMenu\MegaMenuData.tsx`

Store:

- `F:\ag projects\OLD\Hylono_MAIN - Copy- BEFORE SEO UPDATE 05.03\components\StorePage.tsx`

Product detail / HBOT / merchant presentation:

- `F:\ag projects\OLD\Hylono_MAIN - Copy- BEFORE SEO UPDATE 05.03\components\TechDetail.tsx`
- `F:\ag projects\OLD\Hylono_MAIN - Copy- BEFORE SEO UPDATE 05.03\components\product\detail\TechHero.tsx`
- `F:\ag projects\OLD\Hylono_MAIN - Copy- BEFORE SEO UPDATE 05.03\components\product\detail\TechDetailDeliverySection.tsx`
- `F:\ag projects\OLD\Hylono_MAIN - Copy- BEFORE SEO UPDATE 05.03\components\product\detail\TechDetailTimelineSection.tsx`

### 4.2 What the old visual system actually is

The old design is not generic â€œpremium dark UI.â€ It has a specific identity:

- Swiss-tech / scientific / meditative product theater
- large, centered, sculptural hero compositions
- strong orbital or system-based visual framing
- editorial whitespace with bold product cards
- crisp uppercase micro-labels and futuristic typography accents
- premium buy-vs-rent framing
- rich product exploration, especially for HBOT
- multi-section merchant storytelling instead of a flat catalog page
- a real mega menu with a layered systems/network/company structure

The next agent must preserve this identity.

## 5. Design Freeze: What Must Look the Same

This is the visual no-regression contract.

### 5.1 Global rules

Do not materially change:

- page composition
- section ordering on core routes
- hero silhouette
- nav structure and interaction model
- card sizes and placement logic
- CTA placement hierarchy
- dominant visual mood
- store/product browsing rhythm
- HBOT compare-and-select experience

Allowed:

- semantic markup changes
- server rendering changes
- CSS architecture changes
- component rewrites
- data layer rewrites
- animation implementation swaps if the public output feels the same
- accessibility and performance improvements that do not alter the visual contract

Not allowed:

- flattening the experience into a generic marketing site
- replacing sculptural sections with simple centered text blocks
- moving the old design language to a safer, duller style because â€œSEOâ€
- replacing rich cards with plain grids
- replacing visual product comparison with thin informational copy
- deleting atmosphere, media framing, or premium section rhythm to make implementation easier


### 5.2 Homepage visual contract

The homepage must preserve the old homepage feel from:

- `components/Home.tsx`
- `components/heroes/HeroConcept1.tsx`

The following visual elements are mandatory:

- full-screen hero with central brand-first composition
- orbital ring / systems framing or an equivalent visual that reads the same way
- four modality signposts around the hero system
- centered premium overline, brand wordmark scale, divider, and CTA cluster
- same premium spacing rhythm from hero into subsequent sections
- brand ticker / proof band cadence
- ecosystem section with large system cards, not a flat commodity list
- curated protocol / stack section with strong visual grouping
- premium transition from concept to system exploration

SEO copy that must exist on the homepage must be integrated **inside this visual system**, not appended as a generic SEO block that changes the page personality.

### 5.3 Header and mega menu visual contract

The global header must preserve the old feel from:

- `src/components/layout/Header.tsx`
- `components/MegaMenu.tsx`

Required visual behaviors:

- premium floating header feel
- centered or balanced brand/nav composition
- clear top-level nav
- retained `Explore` style entry into a rich mega menu
- mega menu as a layered premium panel, not a plain dropdown list
- visible trust/support access in header or footer

SEO requirement:

- all important links in the mega menu must be real crawlable `<a href>` links
- the mega menu may be progressive enhancement, but the primary crawl path cannot depend only on JS interactions

### 5.4 Store visual contract

The store must preserve the old feel from:

- `components/StorePage.tsx`

Required visual elements:

- hero with strong editorial framing, not a thin utility header
- premium `Rent` vs `Buy` control with clear state change
- large product cards with strong media/icon hierarchy
- mode-based merchant storytelling
- visible advantage blocks for rental mode
- premium card hover logic and depth cues, even if reimplemented differently
- strong visual distinction between technologies

The store may become more SEO-robust internally, but it must not become a generic category grid.

### 5.5 Product / HBOT visual contract

Product detail pages must preserve the old feel from:

- `components/TechDetail.tsx`
- `components/product/detail/TechHero.tsx`
- `components/product/detail/TechDetailDeliverySection.tsx`
- `components/product/detail/TechDetailTimelineSection.tsx`

Required visual elements:

- product hero with strong left-right composition
- premium product image or hardware profile treatment
- visible buy/rent dual-track framing
- trust badges in product context
- rich product-specific sections, not a flat list of SEO sections
- delivery/setup and timeline sections as real designed modules
- research and protocol bridges that feel native to the product page
- sticky or persistent commerce guidance if present in the old UX

HBOT-specific requirements:

- `/product/hbot` remains one strong canonical hub unless separate model pages become truly unique and justified
- model exploration must remain rich and prominent
- configuration browsing must feel like product discovery, not a thin comparison table
- compare/select flows should stay within the same premium product environment
## 6. SEO Target State: Maximum Practical Level

The target is not â€œbetter tags.â€
The target is a site that is:

- crawlable
- indexation-disciplined
- duplicate-resistant
- technically clean
- richly internally linked
- clearly attributable and trustworthy
- fast enough to protect UX and search performance
- compatible with Search, AI retrieval, and merchant surfaces
- compliant for health-adjacent content

## 7. SEO Non-Negotiables

### 7.1 Rendering and crawlability

Google can render JavaScript, but JavaScript-heavy implementations still create debugging and rendering risk. Therefore, **server-first is a repo policy**, not a false claim that Google only accepts SSR.

Required:

- `app/**/page.tsx` defaults to server-first for public routes unless there is a documented exception
- critical text, headings, links, trust elements, and commerce facts render in HTML
- leaf interactivity is enhancement, not a dependency for understanding the page
- no JS-only navigation for important discovery paths
- no hash-fragment-only routing for indexable content
- meaningful HTTP status codes
- no hidden dependency on client hydration for basic page comprehension

Use and preserve repo governance:

- `[DECISION: ...]` annotations on public routes
- explicit rendering strategy on every public route
- `createPageMetadata(...)`
- JSON-LD only through `src/components/StructuredData.tsx` and `lib/seo-schema.ts`

### 7.2 Crawlable internal links

All important navigational and contextual links must be real crawlable `<a href>` links.

Required:

- mega menu links are real anchors with real destinations
- product, store, condition, research, protocol, rental, and policy routes are discoverable in HTML
- no important route depends on click handlers without usable `href`
- anchor text should be descriptive, concise, and context-aware
- linked images must have meaningful `alt` when the image itself functions as the link text

### 7.3 Canonical control and duplicate prevention

Every searchable intent must resolve to one canonical URL.

Required:

- self-referencing canonical on indexable pages
- sanitized query parameters
- permanent redirects for aliases and retired duplicates
- no redirect chains
- no accidental duplicate routes from legacy pages
- explicit decision for every filter, sort, query-param, and pagination path

For store and product work, the agent must define a **faceted navigation policy before implementation**.

### 7.4 Mandatory faceted decision matrix

No commerce or listing route is implementation-ready without this table:

| URL/state type | Crawl? | Index? | Canonical target | Default handling | Notes |
|---|---:|---:|---|---|---|
| Base category / hub / store route | Yes | Yes | Self | Render normally | Primary landing page |
| Sort parameter only | Usually not needed | No | Strip to base | Preserve UX, prevent index bloat | Prevent duplicate sort permutations |
| Filter state with no unique search intent | Optional / limited | No | Strip to base | JS-only or noindex or blocked crawl per policy | Do not generate infinite crawl space |
| Filter state with unique, curated demand and unique content | Yes | Yes | Self | Treat as true landing page | Must have unique value, not thin inventory slice |
| Pagination page | Yes | Usually yes | Self | Crawlable | Do not canonicalize every page to page 1 by default |
| Internal search result pages | No or tightly limited | No | Base or none | Exclude from index | Avoid indexing internal search spaces |
| Retired / duplicate / alias URL | No long-term | No | Redirect or stronger canonical | Remove duplication | Keep redirect map explicit |
| Out-of-stock but returning product | Yes | Usually yes | Self | Keep live if still useful | Depends on business intent |
| Discontinued with no substitute | Usually no | No | Redirect or retire | Remove thin dead ends | Must decide explicitly |
| Discontinued with clear successor | Limited | No | Redirect to successor or strongest hub | Preserve intent continuity | Avoid zombie pages |

Additional rule:

- canonical tags alone are **not** a sufficient faceted-navigation strategy when crawl waste or infinite spaces are possible

### 7.5 Metadata and snippet discipline

Every indexable page must have:

- unique title
- useful meta description
- correct canonical
- correct Open Graph and social metadata
- stable preview image logic where appropriate

Title rules:

- descriptive, non-generic, non-boilerplate
- aligned to actual page intent
- distinct per route
- not stuffed with repeated keywords

Meta description rules:

- written for click-through and clarity
- not copied across route families
- summarize the real visible page value
- no fake urgency or unsupported claims

Important hierarchy:

- page content quality and answer clarity influence snippets more directly than meta descriptions alone
- therefore answer-first copy, high-value visible context, and strong above-the-fold language matter more than treating meta description as â€œSERP controlâ€

### 7.6 Structured data that matches visible truth

Schema exists to clarify truth, not invent authority.

Required:

- breadcrumb schema on all indexable routes where appropriate
- product/offer schema only where visible offer facts exist
- FAQ schema only where visible FAQ content exists
- organization/site schema from canonical helpers
- no fake ratings, fake aggregate review counts, fake experts, fake certificates, fake documents, or misleading trust objects
- no schema fields that are not backed by visible page content or approved trust pages

Critical rules:

- rich results are never guaranteed
- content in structured data must be visible and representative of the page
- hidden, incomplete, or misleading markup is disallowed
- JSON-LD is preferred unless a specific implementation constraint justifies otherwise

### 7.7 FAQ policy (March 2026 tightened)

FAQ is **not** a universal SEO pattern.

Use FAQ only when all of the following are true:

- the questions are real user questions for that route
- the answers are visible on the page
- the FAQ fits the preserved design language
- the FAQ adds decision support rather than content bulk

Rich-result expectation rule:

- Google states FAQ rich results are only available for well-known, authoritative sites that are government-focused or health-focused
- therefore Hylono must not assume FAQ rich-result eligibility merely because a page is â€œhealth-adjacentâ€
- FAQ on Hylono is allowed for usability, trust, scannability, and extraction value, but not as an assumed rich-result growth tactic

### 7.8 Merchant and policy schema

For ecommerce and rental-adjacent surfaces, policy visibility must be both user-visible and machine-readable.

Required where relevant:

- `Product` / `Offer` markup on true product offer pages
- organization-level `MerchantReturnPolicy` when there is a standard return policy
- organization-level `ShippingService` when there is a standard shipping policy
- offer-level overrides only where a specific product materially differs from the global policy
- visible links to returns, shipping, warranty, delivery, and related policy pages wherever commercial claims depend on them

Do not force merchant policy schema onto pages that do not actually carry commerce or shipping/return logic.

### 7.9 Helpful content, evidence, ownership, and freshness

This repo operates in a health-adjacent / YMYL-like space.

Required:

- visible ownership where the topic warrants it
- visible freshness/update logic where the topic warrants it
- conservative claim language
- evidence visibility where evidence is referenced
- real editorial/trust pages accessible from the public experience
- preserved bridge between condition, research, product, protocol, and rental/contact layers
- no fake people, fake medical review, fake partner proof, fake user proof

Content quality rules:

- answer the query early
- be people-first, not keyword-first
- write for clarity, not density theater
- avoid scaled thin pages
- avoid boilerplate condition or location pages unless truly unique and justified
- state limitations where evidence is mixed, early, or incomplete

### 7.10 Internal linking and topical graph

The canonical graph must remain legible:

`Condition -> Research -> Product -> Protocol -> Rental/Contact`

Required:

- conditions link into research, products, protocols, rental/contact
- research links into products and protocols
- products link into research, conditions, protocols, rental, contact, and policy pages where appropriate
- protocols link back into product and research context
- trust pages remain discoverable from core navigation or footer
- important links remain visible and crawlable in HTML

Do not create SEO islands.
No important page should depend on only one entry path.

### 7.11 Media SEO without breaking the design

The old design is media-heavy and visual. That is not an excuse to weaken image or video SEO.

Required for images:

- descriptive filenames
- useful alt text tied to what is actually shown
- responsive sizing
- explicit width/height or aspect-ratio to protect CLS
- above-the-fold media prioritized only where it is truly the LCP candidate
- no decorative images with content-bearing alt text

Required for video if present:

- a real watch surface or embedded visible video block
- transcript or equivalent textual context when material
- poster/thumbnail discipline
- `VideoObject` only when the content is real and visible

### 7.12 Core Web Vitals and performance

SEO wins can be canceled by performance regressions.

Required:

- preserve premium motion, but implement it without unnecessary first-load JS
- optimize hero media and fonts
- avoid heavy animation logic where CSS or smaller islands can achieve the same output
- keep layout shifts near zero
- avoid hidden performance debt caused by client-only wrappers
- protect bundle budgets for homepage, store, and product hubs

Targets:

- LCP: ideally under `2.5s` in realistic field conditions
- INP: under `200ms`
- CLS: under `0.1`

### 7.13 AI visibility and agent-readiness

Treat AI visibility as a second distribution layer built on top of strong web SEO, not as a separate trick system.

The correct target is:

- stronger citation eligibility
- stronger source attribution
- stronger extractability
- stronger trust and entity consistency

Do **not** promise:

- guaranteed appearance in ChatGPT search
- guaranteed recommendation frequency
- guaranteed â€œAI rankingsâ€

Required:

- if pages should be available in ChatGPT search surfaces, do not block `OAI-SearchBot`
- if pages should be excluded from possible training, manage that separately through `GPTBot`
- if you use `noindex`, remember crawlers must be allowed to access the page to read the meta tag
- keep entity names, product names, protocols, and supporting facts consistent across headings, body copy, metadata, schema, images, and internal links
- keep important pages readable without client-side execution
- use concise answer blocks, clear headings, and comparison structures where they naturally fit the old design
- keep evidence, limitations, and freshness visible on pages that may be cited for health-adjacent topics

Accessibility and agent-readiness rule:

- meaningful labels, roles, states, and accessible interaction patterns improve machine understanding and agent usability
- this is an implementation-quality requirement, not a guarantee of higher citation rates

Measurement rules:

- review ChatGPT and other AI referral landings in analytics
- review Bing Webmaster Tools AI Performance where available
- identify which specific URLs are being cited and strengthen those pages intentionally

This layer must be implemented **inside the preserved old design language**.
Do not add ugly GEO blocks, robotic Q&A dumps, or generic â€œAI optimizedâ€ sections that break the premium experience.

### 7.14 Validation and post-launch verification

A technically good implementation is not complete until external verification is done.

Required after meaningful SEO changes:

- inspect changed URLs in Google Search Console
- verify selected canonical, indexability, crawl result, and rendered content
- inspect coverage/indexing issues
- review Bing Webmaster Tools for parallel visibility
- verify Merchant Center if commercial offer surfaces changed
- review analytics flow through the canonical topical graph

Required structured-data validation:

- run Rich Results Test on routes using Google rich-result-eligible schema
- run Schema Markup Validator for non-Google schema sanity checks where useful
- use URL Inspection when rendered HTML or blocked resources may affect Googleâ€™s interpretation

## 8. How To Add SEO Without Changing the Design

This is the practical operating model.

### 8.1 Preserve output, rewrite internals

The agent should think in this order:

1. Keep the old page composition.
2. Rebuild the route as server-first.
3. Rebuild metadata and schema.
4. Rewire canonical data sources.
5. Improve copy clarity inside the same visual modules.
6. Add internal links, trust, and evidence in ways that look native to the old design.

### 8.2 Integrate SEO content into existing visual modules

Do not bolt SEO copy under the page as a generic text dump.

Instead:

- place answer-first content inside the old hero and first supporting section
- place trust and ownership/freshness context in premium badges, metadata rails, or designed info rows
- place citations in designed evidence modules
- place FAQ in styled accordions only if the visible content remains real and useful
- place policy links in the commerce areas where they make sense visually
- place internal links in existing cards, side rails, comparison modules, and next-step sections

### 8.3 Safe enhancement pattern

Safe pattern:

- server-render meaningful HTML
- enhance with motion, selection state, or richer interaction after that

Unsafe pattern:

- build a beautiful client-only shell and hope crawlers figure it out later

### 8.4 If new visible elements are required

They are allowed only when they feel like they belonged to the old system all along.

Acceptable additions:

- ownership/freshness line styled like premium micro-metadata
- research/citation modules styled like scientific cards
- merchant policy links integrated into the existing commerce rail
- short direct answer blocks integrated into the established section rhythm
- evidence/trust/ownership rail inserted where the visual grammar supports it

Unacceptable additions:

- plain gray SEO text blocks
- giant compliance paragraphs dropped between hero and product content
- generic accordion stacks replacing old premium layouts
- robotic â€œAI optimizedâ€ modules
- flattened template sections that fight the existing visual rhythm

## 9. Route-Level Implementation Contract

### 9.1 `/`
Must keep old homepage composition and hero feel.

SEO implementation must ensure:

- clear H1 and intent clarity
- crawlable links to key hubs
- visible trust-page access
- meaningful server-rendered content above the fold
- preserved premium systems narrative
- short answer-first support copy integrated into the same design system

### 9.2 `/store`
Must keep the old premium merchant experience.

SEO implementation must ensure:

- crawlable product/category entry points
- stable canonical behavior
- faceted navigation policy written before implementation
- visible product context and policy links
- no JS-only listing shell for core discovery
- no degeneration into a generic category grid

### 9.3 `/product/[tech]`
Must keep the old premium PDP feel.

SEO implementation must ensure:

- unique route metadata per product hub
- rich server-rendered content
- research, protocol, rental/contact linking
- visible offer context where schema depends on it
- FAQ only if visible, useful, and policy-compliant
- research bridge, trust/evidence/ownership, and policy links inserted in native visual slots
- HBOT model exploration without thin-page sprawl

### 9.4 `/conditions` and `/conditions/[slug]`
These may be less visually theatrical than product/store, but they must still align with the same premium language.

SEO implementation must ensure:

- clear condition intent
- visible bridge into evidence and products
- no thin or boilerplate condition pages
- strong linking into the product and protocol graph

### 9.5 `/research`
Must remain trustworthy and evidence-led.

SEO implementation must ensure:

- citation-backed content where claims depend on evidence
- visible freshness and ownership where appropriate
- strong bridges into product and protocol pages
- extraction-friendly structure for both Search and AI systems

### 9.6 `/protocols` and `/protocols/[slug]`
Must feel like premium system guidance, not a thin appendix.

SEO implementation must ensure:

- clear protocol purpose
- connection to required products and supporting evidence
- links into commerce/contact when appropriate
- enough unique content for indexability

### 9.7 Trust and policy pages
These do not need the same theatrical depth as store/HBOT, but they must visually belong to the brand.

SEO implementation must ensure:

- discoverability from main public surfaces
- accurate policy/trust details
- clean metadata and schema where relevant
- support for merchant, return, shipping, warranty, and company trust interpretation where applicable

## 10. Anti-Patterns That Must Never Happen Again

Do not:

- redesign the site into a flatter, safer, more generic SEO layout
- remove or shrink key product-theater sections to make room for utility content
- push critical meaning into client-only tabs, sliders, drawers, or hidden flows
- hide important internal links behind hover-only or JS-only states
- create duplicate store/product/filter URLs without a written canonical strategy
- publish thin model pages or thin condition pages
- add fake trust signals
- let titles/descriptions/default OG tags fall back to generic templates on important routes
- ship media-heavy pages without image/video SEO discipline
- assume FAQ rich results will appear because a page is merely â€œhealth-adjacentâ€
- assume canonical tags alone solve faceted crawl waste
- skip Rich Results Test or URL Inspection after structured-data changes

## 11. Required Workflow for the Next Agent

Before implementing anything, the next agent must:

1. read this document and the existing repo SEO governance docs
2. inspect the current `F:\ag projects\Hylono_MAIN - SEO BOOST` implementation first as the active visual baseline
3. capture reference screenshots from the current `Hylono_MAIN - SEO BOOST` implementation for desktop and mobile for at least:
   - `/`
   - `/store`
   - `/product/hbot`
   - one additional non-HBOT product route
4. identify which current routes/components define the locked visual contract for each route
5. inspect the old backup repo at `F:\ag projects\OLD\Hylono_MAIN - Copy- BEFORE SEO UPDATE 05.03` only as a control/reference source if any visual parity question appears
6. define the canonical SEO/data architecture that will sit under those locked visuals
7. fill the faceted decision matrix for any listing/store route
8. define metadata, schema, crawler-control, and validation requirements per route
9. write down any unavoidable visual deviations before coding
10. before closing the task, complete `docs/governance/seo-final-signoff-checklist.md`

If the agent cannot preserve a core visual contract, they must say so explicitly before implementation.
They must not silently redesign the page while claiming to â€œimprove SEO.â€

## 12. Acceptance Criteria

The work is only done when **all** of the following are true:

### 12.1 Design parity

- desktop and mobile screenshots still read as the same old design system
- same route-level composition and hierarchy remain intact
- store and HBOT still feel like premium product experiences, not SEO templates
- homepage still feels like the old Hylono concept presentation
- mega menu/header still feel like the old premium navigation model
- SEO additions look native to the old design language

### 12.2 Technical SEO

- `pnpm check` passes
- `pnpm compliance:strict` passes when health-adjacent or benefit-oriented copy changed
- build passes
- canonicals are correct
- sitemap and redirects are correct
- schema matches visible content
- internal graph remains intact
- no route-client boundary regressions on public pages
- faceted states behave according to the written matrix
- titles and meta descriptions are route-specific and non-generic
- crawlable links exist for all important discovery paths

### 12.3 Validation

- changed URLs inspected in Google Search Console
- canonical selection verified
- indexing status checked
- Rich Results Test run where relevant
- Schema Markup Validator used where relevant
- Bing Webmaster Tools reviewed for major changes
- Merchant Center reviewed if product/rental offer surfaces changed
- AI referral and citation visibility reviewed where instrumentation exists
- `docs/governance/seo-final-signoff-checklist.md` was completed before closing

## 13. Tradeoff Protocol

Use this decision order:

1. preserve truthfulness and compliance
2. preserve the old visual contract
3. preserve crawlability and canonical clarity
4. preserve performance
5. add enhancement-only interaction after the above are secure

If a page cannot meet SEO quality and visual parity at the same time yet:

- prefer `noindex,follow`
- or temporarily redirect to the stronger canonical route

Do **not** ship a flattened public page just because it is easier to audit.

## 14. Practical Summary

The correct strategy for Hylono is:

- keep the current premium visual and product experience in `Hylono_MAIN - SEO BOOST`, which already mirrors the old backup 1:1
- rebuild the internals for server-first SEO
- strengthen metadata, schema, canonicals, crawlability, trust, evidence, media SEO, and monitoring
- formalize faceted-navigation decisions before shipping
- use FAQ narrowly and honestly
- support merchant visibility with visible policy links and relevant policy schema
- support AI visibility with accessible, extractable, truthful pages and proper crawler controls
- preserve the canonical topical graph
- never again use SEO as an excuse to redesign the whole site into a different product

## 15. Official Reference Set

Use these as the external benchmark when decisions are unclear:

- Google Search Central: Link best practices for Google  
  <https://developers.google.com/search/docs/crawling-indexing/links-crawlable>
- Google Search Central: JavaScript SEO basics  
  <https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics>
- Google Search Central: Fix Search-related JavaScript problems  
  <https://developers.google.com/search/docs/crawling-indexing/javascript/fix-search-javascript>
- Google Search Central: Title links  
  <https://developers.google.com/search/docs/appearance/title-link>
- Google Search Central: Control snippets in search results  
  <https://developers.google.com/search/docs/appearance/snippet>
- Google Search Central: URL structure best practices / faceted URL guidance  
  <https://developers.google.com/search/docs/crawling-indexing/url-structure>
- Google Search Central: Consolidate duplicate URLs  
  <https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls>
- Google Search Central: General structured data guidelines  
  <https://developers.google.com/search/docs/appearance/structured-data/sd-policies>
- Google Search Central: FAQPage structured data  
  <https://developers.google.com/search/docs/appearance/structured-data/faqpage>
- Google Search Central: Product structured data  
  <https://developers.google.com/search/docs/appearance/structured-data/product>
- Google Search Central: Merchant return policy structured data  
  <https://developers.google.com/search/docs/appearance/structured-data/return-policy>
- Google Search Central: Merchant shipping policy structured data  
  <https://developers.google.com/search/docs/appearance/structured-data/shipping-policy>
- Google Search Central: Google Images best practices  
  <https://developers.google.com/search/docs/appearance/google-images>
- Google Search Central: Video best practices  
  <https://developers.google.com/search/docs/appearance/video>
- Google Search Central: Helpful, reliable, people-first content  
  <https://developers.google.com/search/docs/fundamentals/creating-helpful-content>
- Google Search Central: Test your structured data / Rich Results Test  
  <https://developers.google.com/search/docs/appearance/structured-data>
- Google Search Console Help: URL Inspection Tool  
  <https://support.google.com/webmasters/answer/9012289>
- OpenAI Help Center: Publishers and Developers FAQ  
  <https://help.openai.com/en/articles/12627856-publishers-and-developers-faq>
- OpenAI Help Center: ChatGPT Search  
  <https://help.openai.com/en/articles/9237897-chatgpt-search>
- Bing Webmaster Tools: AI Performance  
  <https://www.bing.com/webmasters/help/9f8e7d6c>
- Bing Webmaster Blog: AI Performance in Bing Webmaster Tools  
  <https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview>




