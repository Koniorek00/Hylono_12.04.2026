# SEO Strength And Redesign Priority Map

_Last updated: 2026-03-07 | Applies to: redesigns, refactors, navigation changes, and public page rebuilds_

## 1. What This Document Is

This file explains why the current Hylono site scores strongly in the repo's technical SEO and discoverability checks, and what future agents must preserve when redesigning or rebuilding public pages.

This document is intentionally practical. It does not claim that rankings are "guaranteed" or that the site is automatically first in Google. It explains why the current implementation is technically strong, why the audit suite passes, and what would most likely damage SEO if removed during a redesign.

Read this together with:

- `docs/governance/seo-page-production-guide.md`
- `AGENTS.md`

## 2. Why The Current Site Is Strong After Checks

The site currently performs strongly in technical SEO checks because it protects the parts that search engines and AI retrievers actually need.

### 2.1 Public routes are server-first

Important pages render meaningful HTML on the server. The repo actively checks that public routes do not silently drift into client-only shells.

Relevant checks:

- `pnpm audit:page-decisions`
- `pnpm audit:rendering-strategy`
- `pnpm audit:route-client-boundaries`

### 2.2 Indexability is deliberate, not accidental

The site separates indexable routes from `noindex,follow` routes and from permanent redirects. Thin, transactional, search, or duplicate routes do not compete with the main cluster.

Relevant files and checks:

- `lib/seo-metadata.ts`
- `app/sitemap.ts`
- `config/seo-redirects.ts`
- `pnpm audit:seo-crawlability`
- `pnpm audit:dynamic-route-metadata`

### 2.3 Structured data is governed

The site does not scatter random schema across components. JSON-LD is centralized, escaped safely, and tied to visible content only.

Relevant files and checks:

- `src/components/StructuredData.tsx`
- `lib/seo-schema.ts`
- `pnpm audit:structured-data`
- `pnpm audit:jsonld-schema`
- `pnpm audit:breadcrumb-jsonld`
- `pnpm audit:product-commerce-schema`

### 2.4 Evidence and trust are visible

Health-adjacent pages do not rely on vague authority. They are anchored to canonical evidence, visible review ownership, and trust pages such as About, Editorial Policy, Research, Help, FAQ, and Contact.

Relevant files:

- `content/evidence.ts`
- `content/research.ts`
- `content/site-entity.ts`
- `components/content/PageOwnership.tsx`

### 2.5 The internal link graph is intentional

The site is not a pile of isolated landing pages. The main path is explicit:

`Condition -> Research -> Product -> Protocol -> Rental/Contact`

This helps crawlers, users, and AI systems understand how the topics connect.

Relevant file:

- `content/topical-graph.ts`

### 2.6 Product SEO is constrained by visible commerce facts

The site only uses product and offer schema where real, visible commerce information exists. Returns, warranty, and shipping signals are tied to actual public policy pages.

Relevant files:

- `content/products.ts`
- `app/product/[tech]/page.tsx`
- `lib/seo-schema.ts`
- `app/returns/page.tsx`
- `app/shipping/page.tsx`
- `app/warranty/page.tsx`

### 2.7 Measurement exists

The site can measure search and AI acquisition as well as movement through the topical graph, which means redesign decisions can be checked against actual navigation and landing behavior.

Relevant files:

- `docs/specs/seo-ai-visibility-reporting.md`
- `src/components/analytics/TrackedCtaLink.tsx`
- `src/components/providers/RouteAnalyticsTracker.tsx`

### 2.8 Compliance guardrails reduce future ranking risk

Aggressive medical or unsupported claims can create legal and trust problems and often lead to thin or misleading SEO pages. The repo now has a stricter content safety posture.

Relevant checks:

- `pnpm compliance:strict`
- `tests/content/evidenceIntegrity.test.ts`

## 3. Global Redesign Rules

Any redesign may change the visual language, layout system, component styling, spacing, type scale, or motion system.

Any redesign must not remove or hide the SEO-critical substrate listed below.

### 3.1 Never remove these foundations

- server-rendered core content
- clear H1 and above-the-fold answer block
- crawlable internal links
- visible ownership and freshness on health-adjacent pages
- visible citations where evidence is referenced
- visible FAQ content when FAQ schema is present
- visible commerce policies when commerce schema is present
- trust-page access from the main public experience
- canonical route paths and redirect hygiene

### 3.2 Common redesign mistakes that break SEO

- replacing explanatory text with slogans
- moving critical copy into client-only tabs, sliders, or accordions
- hiding links behind hover-only or JS-only navigation
- removing breadcrumb context because it feels "visually busy"
- collapsing trust, policy, and review information below the threshold of visible usefulness
- redesigning a page as a pure visual hero with very little indexable HTML
- changing URLs without updating sitemap, canonicals, and redirects
- reintroducing fake ratings, fake experts, or exaggerated claims for conversion

### 3.3 If a redesign feels "cleaner" because it deletes content

Assume it is risky until proven otherwise.

For this site, "clean" must mean:

- clearer hierarchy
- faster comprehension
- stronger next-step flow
- better visual polish

It must not mean:

- less crawlable meaning
- fewer internal links
- less trust information
- less evidence visibility

## 4. Attention Score Scale

Use this scale when prioritizing redesign decisions:

- `0/5`: almost no SEO impact
- `1/5`: low SEO risk, mostly cosmetic freedom
- `2/5`: moderate risk, preserve route purpose and metadata
- `3/5`: important, do not weaken meaning or internal links
- `4/5`: very important, redesign must preserve structure, trust, and crawlable content
- `5/5`: mission critical, breaking this route type will likely damage topical authority, crawlability, trust, or commercial discovery

## 5. Route-By-Route Redesign Priorities

### `/`

Attention score: `5/5`

Why it matters:

- It is the strongest authority and orientation page on the domain.
- It introduces the main cluster and routes users into conditions, research, store, rental, and trust pages.

Absolute must keep:

- answer-first hero content, not just brand slogans
- visible links to the main hubs
- trust-page visibility
- server-rendered explanatory content
- schema and canonical metadata

Absolute redesign traps:

- turning the hero into a near-empty brand billboard
- burying store, research, or condition paths below the fold
- replacing real navigation with animation-heavy visual modules only

### `/store`

Attention score: `5/5`

Why it matters:

- This is the main merchant hub.
- It connects product discovery with rental and trust paths.

Absolute must keep:

- crawlable product/category entry points
- clear pricing or offer context where visible
- trust links to shipping, returns, and warranty
- strong internal linking to product hubs

Absolute redesign traps:

- replacing crawlable listings with client-only filtering shells
- hiding pricing context or offer terms that support product pages
- breaking the path from store to product hub to rental/contact

### `/product/[tech]`

Attention score: `5/5`

Why it matters:

- These are primary product-category hubs and commerce entry pages.
- They sit in the middle of the condition -> research -> product -> protocol -> rental/contact journey.

Absolute must keep:

- visible product identity and offer context
- visible links to cited research
- visible links to relevant conditions and protocols
- visible links to rental and contact
- visible commerce policy references
- FAQ visibility if FAQ schema remains

Absolute redesign traps:

- redesigning the page as a gallery with little text
- removing research, protocol, or trust links to make the layout "minimal"
- adding ratings or review schema without real visible data
- turning the route into a generic PLP with no evidence or guidance layer

### `/conditions`

Attention score: `4/5`

Why it matters:

- This is the condition hub and one of the clearest topical-entry surfaces for search.

Absolute must keep:

- crawlable links to condition detail pages
- clear explanation of what the condition cluster covers
- connection to research and product hubs

Absolute redesign traps:

- using cards with almost no supporting copy
- weakening the semantic distinction between the hub and detail pages

### `/conditions/[slug]`

Attention score: `5/5`

Why it matters:

- These pages anchor the topical cluster and match informational search intent.

Absolute must keep:

- a strong answer-first introduction
- visible ownership and review information
- related evidence links
- related product links
- related protocol links
- rental/contact next step

Absolute redesign traps:

- replacing explanatory copy with generic "benefits" blocks
- removing research limitations or safety framing
- treating the page as a thin bridge page with almost no substance

### `/research`

Attention score: `5/5`

Why it matters:

- This is the core evidence hub and a major trust surface for the entire domain.

Absolute must keep:

- canonical study rendering
- visible limitations, not just positive summaries
- links from evidence to products and protocols
- review freshness
- trust and editorial ownership cues

Absolute redesign traps:

- hiding study details behind client interactions only
- reducing the page to marketing claims with a token "research" label
- removing the link between evidence and the rest of the topical graph

### `/protocols`

Attention score: `4/5`

Why it matters:

- This hub organizes the action-oriented layer of the site.

Absolute must keep:

- crawlable links to protocol detail pages
- clear explanation that protocols are guidance frameworks, not medical treatment plans
- connection back to products and research

Absolute redesign traps:

- making the hub visually attractive but text-thin
- losing the distinction between educational protocol guidance and clinical treatment language

### `/protocols/[slug]`

Attention score: `5/5`

Why it matters:

- These pages convert topic interest into structured usage paths and commercial next steps.

Absolute must keep:

- visible ownership and review details
- links to supporting products
- links to supporting evidence
- clear safety and suitability language
- contact or rental next step

Absolute redesign traps:

- making the page read like a treatment prescription
- deleting the evidence and trust context in favor of a simplified visual plan

### `/blog`

Attention score: `3/5`

Why it matters:

- This hub supports freshness, long-tail discoverability, and internal linking into the main cluster.

Absolute must keep:

- crawlable article links
- clear categorization or relevance cues
- visible path into conditions, research, and products

Absolute redesign traps:

- turning it into a magazine facade with weak crawlable text
- leaving articles isolated from the rest of the site

### `/blog/[slug]`

Attention score: `4/5`

Why it matters:

- Articles support long-tail queries and AI citation potential.

Absolute must keep:

- canonical evidence references where applicable
- visible authorship/review context
- internal links into conditions, research, products, or protocols
- a clear match between title, intro, and actual article intent

Absolute redesign traps:

- replacing citations with generic "studies show" phrasing
- removing article-body links to the main cluster
- making the article mostly decorative layout with little semantic content

### `/rental`

Attention score: `5/5`

Why it matters:

- This is the main commercial next-step page for visitors not ready to purchase.

Absolute must keep:

- a clear explanation of how rental works
- visible connections from product hubs and protocols
- trust and support pathways
- policy-linked expectations

Absolute redesign traps:

- making the route feel like a dead-end form
- hiding the commercial terms or what happens next
- separating it from product pages and contact support

### `/locator`

Attention score: `4/5`

Why it matters:

- It supports partner or local discovery and must stay crawlable if it remains public.

Absolute must keep:

- server-rendered explanatory content
- only verified partner/location information
- no fake local SEO entries

Absolute redesign traps:

- turning the page back into a client-only map shell
- publishing location pages or cards from placeholder data

### `/about`

Attention score: `4/5`

Why it matters:

- It is a core entity-trust page for users, crawlers, and AI systems.

Absolute must keep:

- clear company identity
- what Hylono does
- organizational ownership
- trust-page cross-links

Absolute redesign traps:

- turning the page into vague brand storytelling
- adding unsupported company history, stats, or personnel claims

### `/editorial-policy`

Attention score: `5/5`

Why it matters:

- It protects the credibility of health-adjacent and evidence-informed content.

Absolute must keep:

- the editorial/review/compliance ownership model
- evidence and claim standards
- update/review logic

Absolute redesign traps:

- reducing the page to a short "we care about accuracy" paragraph
- removing operational detail about sourcing and review

### `/help`

Attention score: `4/5`

Why it matters:

- It is a trust and support page that also helps search engines understand post-click usefulness and support quality.

Absolute must keep:

- clear support pathways
- links to contact and relevant policies
- useful server-rendered answers

Absolute redesign traps:

- replacing helpful content with a contact-only wall
- hiding support answers in client-only accordions without meaningful SSR content

### `/faq`

Attention score: `4/5`

Why it matters:

- It supports direct-answer search behavior and can back visible FAQ schema.

Absolute must keep:

- visibly rendered questions and answers
- concise but substantive responses
- alignment between visible FAQ copy and schema

Absolute redesign traps:

- keeping FAQ schema after hiding or removing the visible FAQs
- rewriting answers into slogan-like non-answers

### `/contact`

Attention score: `5/5`

Why it matters:

- It is the main trust and conversion fallback page across the whole cluster.

Absolute must keep:

- real contact details
- support context
- clear next-step expectations
- trust adjacency to help, FAQ, policies, and commerce pages

Absolute redesign traps:

- reducing the page to a blank form
- hiding phone/email/context details that support entity trust

### `/press`

Attention score: `2/5`

Why it matters:

- It is supportive trust inventory rather than a core ranking page.

Absolute must keep:

- only verified press facts
- links back into trust pages and company identity

Absolute redesign traps:

- publishing unsupported media logos, quotes, or coverage claims

### `/shipping`

Attention score: `4/5`

Why it matters:

- It supports merchant clarity and product/offer trust.

Absolute must keep:

- visible shipping expectations
- alignment with any shipping-related schema or product references

Absolute redesign traps:

- hiding or weakening the policy while product pages still imply shipping structure

### `/returns`

Attention score: `4/5`

Why it matters:

- It supports merchant return-policy trust and product schema.

Absolute must keep:

- visible return terms
- route stability
- clear connection to store and product pages

Absolute redesign traps:

- changing the policy surface without updating commerce schema assumptions

### `/warranty`

Attention score: `4/5`

Why it matters:

- It supports warranty-related merchant trust and offer context.

Absolute must keep:

- visible warranty coverage information
- consistency with product-page references

Absolute redesign traps:

- turning the page into marketing fluff instead of a factual policy surface

### `/privacy`, `/terms`, `/cookie-policy`

Attention score: `2/5`

Why they matter:

- They are trust and compliance surfaces, but not primary topical authority pages.

Absolute must keep:

- route stability
- crawlable legal content
- links from footer and trust surfaces

Absolute redesign traps:

- moving them behind app chrome, login, or inaccessible modal systems

### `/careers`

Attention score: `2/5`

Why it matters:

- It is a light-trust route, not a main acquisition hub.

Absolute must keep:

- truthful hiring status
- clear company identity

Absolute redesign traps:

- adding fake openings or inflated employer-brand claims

### `/search`

Attention score: `3/5`

Why it matters:

- It helps users and internal discovery but should not compete in the index.

Absolute must keep:

- `noindex,follow`
- real GET-based search behavior
- useful result linking into the main cluster

Absolute redesign traps:

- accidentally making the route indexable
- blocking followability or making it a dead-end

### Transactional pages: `/account`, `/checkout`, `/login`, `/onboarding`, `/rental/checkout`, `/wishlist`

Attention score: `4/5`

Why they matter:

- Their SEO value comes mostly from not leaking into the public index incorrectly.

Absolute must keep:

- `noindex,follow`
- request-time or session-aware rendering where needed
- exclusion from the sitemap

Absolute redesign traps:

- treating transactional flows like marketing pages
- accidentally exposing thin indexable pages to crawlers

### Experimental or support-light `noindex` pages: `/affiliate`, `/learning`, `/meridian`, `/rewards`, `/wellness-planner`

Attention score: `3/5`

Why they matter:

- They should not compete with the canonical cluster unless they are fully rebuilt to a higher standard.

Absolute must keep:

- `noindex,follow`
- clear separation from the primary SEO cluster

Absolute redesign traps:

- adding them to nav, footer, or sitemap without upgrading their content model

### Legacy `noindex` satellites: `/firesafe`, `/hho-car-kit`, `/partners`

Attention score: `3/5`

Why they matter:

- They are public but intentionally not part of the main SEO growth graph.

Absolute must keep:

- `noindex,follow` until they are rebuilt to canonical standards
- factual, limited scope
- no competition with the main cluster

Absolute redesign traps:

- promoting them as major SEO landing pages without trust, evidence, or route-graph support

## 6. Redirect Integrity That Must Survive Redesign

These route aliases protect canonical consolidation and must not be broken:

- `/products` -> `/store`
- `/products/:tech` -> `/product/:tech`
- `/shop` -> `/store`
- `/journal` -> `/blog`
- `/journal/:slug` -> `/blog/:slug`
- `/science` -> `/research`
- `/sign-in` -> `/login`
- `/signin` -> `/login`
- `/account/login` -> `/login`
- `/support` -> `/help`
- `/guarantee` -> `/returns`

If a redesign proposes new slugs or information architecture changes, update redirects and canonicals in the same change set. Never create redirect chains.

## 7. What To Review Before Approving Any Redesign

Before accepting a redesign, verify all of the following:

1. The page still answers the target query above the fold.
2. The route remains server-rendered with meaningful HTML.
3. Metadata and canonicals are still correct.
4. Structured data still matches visible content.
5. The route still links into the topical graph.
6. Trust, ownership, or policy signals were not removed.
7. `noindex` routes did not accidentally become indexable.
8. Redirected routes still resolve canonically.
9. Health-adjacent copy did not become stronger or less defensible.
10. The redesign still passes the repo checks.

## 8. Required Verification After SEO-Sensitive Redesign Work

Run:

- `pnpm check`

If health-adjacent copy changed, also run:

- `pnpm compliance:strict`

If major public route layouts changed, also run targeted browser checks such as:

- `pnpm exec playwright test e2e/step8-js-disabled.spec.ts e2e/step8-route-verification.spec.ts --project=chromium`

If these checks fail, the redesign is not SEO-safe yet.
