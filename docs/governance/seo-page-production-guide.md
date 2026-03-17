# SEO Page Production Guide

_Last updated: 2026-03-06 | Applies to: all future public page work in this repository_

## 1. Purpose

This guide is the operating standard for future agents and contributors who create or modify public pages in the Hylono website.

The goal is not "good enough SEO." The goal is a truthful, crawlable, evidence-bound, trust-rich site that can rank, be cited by AI systems, and support commerce discovery without publishing unsupported claims or synthetic trust signals.

If you touch any page under `app/` that a search engine or AI crawler could encounter, follow this guide before implementation and again before merge.

For redesign-specific route priorities and what must survive visual rework, also use `docs/governance/seo-redesign-priority-map.md`.

## 2. Core Principle

Every public page must be able to answer all of these questions with "yes":

1. Is the page useful and unique enough to deserve indexing?
2. Is every claim supported by visible content or a real source of truth in the repo?
3. Can a crawler understand the page without executing client-side UI?
4. Does the page connect to the canonical Hylono journey?
5. Does the page make its ownership, review, and trust context visible?

If the answer is "no" to any of the above, do not ship the route as an indexable page yet.

## 3. Source Of Truth Files

Do not invent parallel sources of truth. Use the existing canonical modules:

- `content/evidence.ts`
  Canonical evidence records. Real sources only. No placeholder DOI, no fake journals, no synthetic study summaries.
- `content/research.ts`
  Research library structure and public rendering content built on top of canonical evidence.
- `content/site-entity.ts`
  Organization identity, public trust roles, contact points, and trust-page navigation.
- `content/topical-graph.ts`
  Canonical path relationships between conditions, products, protocols, and supporting nodes.
- `lib/seo-metadata.ts`
  Canonical metadata, canonical URL cleanup, and `noindex,follow` behavior.
- `lib/seo-schema.ts`
  Canonical structured-data helpers.
- `src/components/StructuredData.tsx`
  Only approved JSON-LD output component.
- `components/content/PageOwnership.tsx`
  Visible ownership, review, and freshness UI for health-adjacent content.
- `app/sitemap.ts`
  Canonical indexable route inventory.
- `app/robots.ts`
  Crawl rules.
- `config/seo-redirects.ts`
  Canonical redirect map for legacy or duplicate routes.

If a new page needs data that does not fit one of these modules, extend the canonical model rather than creating an ad hoc duplicate.

## 4. Non-Negotiables

### 4.1 Truthfulness beats coverage

Never publish any of the following:

- fake studies
- placeholder DOI values such as `10.1000/*`
- fake reviewers, experts, clinicians, or bios
- fake partner or location records
- fake ratings, review counts, or testimonials
- fake shipping, warranty, return, availability, or pricing details
- fake product documents or unsupported attachments
- unsupported regulatory or medical claims

If something is not verified, either leave it out, mark the page `noindex,follow`, or redirect to a stronger canonical page.

### 4.2 Server-first rendering is mandatory

All SEO-relevant page routes must render meaningful HTML on the server.

Required patterns:

- `app/**/page.tsx` stays a server component
- interactivity is pushed into leaf client components
- each route declares an explicit rendering strategy
- each route includes a `[DECISION: ...]` annotation explaining why the route is static, ISR-style, or request-time dynamic

The repo enforces this through:

- `pnpm audit:page-decisions`
- `pnpm audit:rendering-strategy`
- `pnpm audit:route-client-boundaries`

### 4.3 Schema must match visible content

Do not add schema because it would be "nice for SEO."
Add schema only when the matching information is visible to users on the page or in linked public policy pages.

Required rules:

- use `src/components/StructuredData.tsx`, never inline JSON-LD scripts
- use helpers from `lib/seo-schema.ts` where possible
- every indexable route should have breadcrumb schema
- FAQ schema is allowed only when the FAQ is visibly rendered
- product and offer schema are allowed only when visible product/offer details exist
- do not reintroduce deprecated `SearchAction`
- do not emit person-level expert schema unless there is an approved public bio and visible person attribution

The repo enforces this through:

- `pnpm audit:structured-data`
- `pnpm audit:product-commerce-schema`
- `pnpm audit:breadcrumb-jsonld`
- `pnpm audit:jsonld-schema`

### 4.4 Health-adjacent copy must stay conservative

Hylono operates in a health-adjacent space. That means educational, evidence-informed, support-oriented copy is acceptable. Strong disease, treatment, cure, prevention, or guaranteed outcome language is not.

Use wording such as:

- "may support"
- "is used in wellness routines"
- "evidence is mixed / early / protocol-specific"
- "review cited research and limitations"

Avoid wording such as:

- "treats"
- "cures"
- "prevents disease"
- "guarantees results"
- "clinically proven" unless that exact claim is justified and visible

When touching health-adjacent copy, run:

- `pnpm compliance:strict`

## 5. The Canonical Topical Graph

The default public content journey in this repo is:

`Condition -> Research -> Product -> Protocol -> Rental/Contact`

This is not optional. Future pages must support this graph.

### 5.1 Required directional links

Condition pages should link to:

- related research evidence
- relevant product hub
- relevant protocol
- rental or contact next step

Research pages should link to:

- product hubs
- protocols
- contact or rental when commercially appropriate

Product hub pages should link to:

- relevant conditions
- cited research
- related protocols
- rental
- contact

Protocol pages should link to:

- supporting product hubs
- related research
- rental or contact

Trust pages should remain reachable from:

- homepage
- header or footer
- relevant commercial and educational pages

Use `content/topical-graph.ts` when wiring or extending these connections.

## 6. Indexability Decision Rules

Before building a new page, decide whether it should be:

- indexable
- `noindex,follow`
- redirected to an existing canonical route

### 6.1 Indexable pages

Indexable pages must be:

- unique
- content-rich
- internally linked
- server-rendered
- clearly owned
- useful without a form submission or login

Examples in this repo:

- homepage
- condition hubs and condition detail pages
- research hub
- product hubs
- protocol hubs and detail pages
- trust pages such as about, editorial policy, help, FAQ, press, contact
- public commerce policy pages such as shipping, returns, warranty

### 6.2 `noindex,follow` pages

Use `noindex,follow` for pages that help users but should not compete in search, such as:

- search pages
- account pages
- cart and checkout
- login and registration
- onboarding flows
- thin experimental tools
- route aliases that should remain accessible but not indexable

Use `createPageMetadata({ forceNoIndex: true })`.
Do not block these routes in a way that prevents internal link discovery unless there is a stronger security or privacy reason.

### 6.3 Redirect instead of competing

If a route duplicates an existing canonical page, redirect it permanently instead of keeping two public versions alive.

Current examples:

- `/support` -> `/help`
- `/guarantee` -> `/returns`

Update `config/seo-redirects.ts` and keep redirects permanent and chain-free.

## 7. Mandatory Build Checklist For Any New Public Page

### 7.1 Route contract

Every new `app/**/page.tsx` must include:

- a `[DECISION: ...]` annotation
- an explicit rendering strategy
- `createPageMetadata(...)`
- a canonical path value

Preferred server-first patterns:

- `'use cache'` with `cacheLife('content')` for indexable editorial pages
- request-time dynamic boundaries only for genuinely transactional or session-bound routes

### 7.2 Above-the-fold answer block

The page must explain, quickly and plainly:

- what the page is about
- who it is for
- what the user can do next
- how it relates to the Hylono topic graph

Do not lead with vague slogans when the route should answer a concrete query.

### 7.3 Ownership and freshness

Health-adjacent and evidence-informed pages must visibly show:

- who wrote the page
- who reviewed it, when applicable
- when it was reviewed or updated
- what the role is

Use `components/content/PageOwnership.tsx` and role definitions from `content/site-entity.ts`.

### 7.4 Internal linking

Every indexable page must link to at least:

- one upstream or sibling hub page
- one downstream next-step page
- trust pages when they are relevant to credibility or conversion

No orphan pages. No dead-end educational content.

### 7.5 Structured data

At minimum, an indexable route should evaluate:

- breadcrumb schema
- page-type schema such as `WebPage`, `CollectionPage`, or `Product`
- FAQ schema if visible FAQs exist
- organization linkage when appropriate

Never create schema that the visible UI cannot justify.

### 7.6 Sitemap and crawl graph

If the page is indexable and canonical, add it to:

- `app/sitemap.ts`

If it should not be indexed, confirm:

- `createPageMetadata` marks it `noindex,follow`
- it is not accidentally added to the sitemap

If it replaces a weaker route:

- add or update a permanent redirect in `config/seo-redirects.ts`

## 8. Content And Claim Rules

### 8.1 Evidence

When a page references studies or research:

- source citations from `content/evidence.ts`
- keep titles, PMID, DOI, source URL, and limitations accurate
- link to the original source
- preserve evidence IDs instead of duplicating citation content in multiple formats

If a blog post, product page, or protocol references evidence, connect it through canonical evidence IDs rather than inventing page-local citation objects.

### 8.2 Reviews, ratings, and testimonials

Do not publish aggregate ratings or review counts unless all of the following are true:

- the reviews are real
- they are visible on the page
- the schema matches what users can see
- the data source is stable and maintainable

The current repo expectation is conservative: no fake aggregate review data on public product records.

### 8.3 Experts and reviewers

Do not create public expert pages or person-level schema unless approved public facts exist.

Default to organization-backed ownership:

- editorial
- review
- compliance
- commerce
- support

All of these roles already live in `content/site-entity.ts`.

### 8.4 Partner and location pages

Do not publish location SEO pages from demo data.

A location or partner page is allowed only when the record is verified and can visibly show:

- real name
- real address
- real contact details
- real offered technologies
- real hours or availability details where appropriate

If verified records do not exist yet, keep the locator informative but do not expand into fake local SEO pages.

## 9. Merchant And Commerce Rules

Product pages in this repo are product-category or technology hubs unless proven otherwise.

Before using `Product` and `Offer` schema, make sure the page visibly includes:

- product or category identity
- real price
- real availability label
- seller identity
- visible return policy path
- visible warranty path
- visible shipping policy path when relevant

If the page does not have those details, prefer a category or informational page model instead of pretending it is a complete merchant listing.

Keep these rules aligned with:

- `lib/seo-schema.ts`
- `content/products.ts`
- `app/product/[tech]/page.tsx`
- `components/TechDetail.tsx`

## 10. Measurement Rules

Search and AI discoverability are part of the product, not an afterthought.

When adding new CTA or cluster-path navigation:

- preserve or extend the PostHog event flow
- use tracked link patterns where important movement should be measurable
- keep key transitions observable, especially:
  - `condition_to_research`
  - `research_to_product`
  - `product_to_protocol`
  - `product_to_rental`
  - `product_to_contact`
  - `citation_opened`

Reference:

- `docs/specs/seo-ai-visibility-reporting.md`
- `src/components/analytics/TrackedCtaLink.tsx`
- `src/components/providers/RouteAnalyticsTracker.tsx`

## 11. Pre-Merge Verification Matrix

### 11.1 Minimum for any public page change

Run:

- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm biome:check`

### 11.2 Required for SEO-sensitive route, metadata, schema, nav, or crawl changes

Run:

- `pnpm check`

This repo-level command includes the SEO, rendering, structured-data, bundle, and test gates.

### 11.3 Required when touching health-adjacent copy or claims

Run:

- `pnpm compliance:strict`

### 11.4 Recommended browser verification when changing the public route graph

Run targeted Playwright coverage such as:

- `pnpm exec playwright test e2e/step8-js-disabled.spec.ts e2e/step8-route-verification.spec.ts --project=chromium`

Use broader e2e coverage when the commercial flow changes materially.

## 12. Failure Triggers That Must Stop Release

Do not merge if any of the following is true:

- the page lacks a route decision annotation
- the page has no explicit rendering strategy
- the page becomes client-only at the route level
- the page is indexable but missing metadata
- the page emits schema unsupported by visible content
- the page introduces fake or placeholder evidence
- the page introduces strong medical claims without support
- the page is indexable but orphaned from the nav, footer, or topical graph
- the page belongs in the sitemap but was not added
- the page should not be in the sitemap but is listed there
- the page changes the public route graph without redirect or internal-link cleanup

## 13. Default Decision Rule When In Doubt

If you are unsure whether a new page is ready for full indexing, choose the safer option:

- publish it as `noindex,follow`, or
- redirect to the stronger canonical route, or
- keep improving the content until it satisfies this guide

In this repo, caution is the correct SEO strategy. Thin or unsupported pages do more damage than fewer but stronger pages.
