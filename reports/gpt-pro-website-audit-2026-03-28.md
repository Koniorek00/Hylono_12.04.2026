# Hylono Website Audit for GPT Pro

Date: 2026-03-28  
Workspace: `F:\ag projects\Hylono_MAIN - SEO BOOST`  
Audit mode: repo-grounded audit with 6 parallel sub-agents + direct main-thread verification  
Scope: public website, content model, route graph, integrations, UX system, and high-value product/app/API opportunities

## 1. Executive Snapshot

Hylono is not a simple brochure site. It is a Next.js 16 / React 19 TypeScript platform that mixes:

- an SEO-first public education and commerce layer
- a guided-planner / rental-first conversion model
- a partially built account and partner workspace
- a larger local operator stack with CRM, notification, workflow, billing, and admin services that are only partly activated in the live app

The strongest parts today:

- the core SEO architecture is serious and above average
- the route graph is broad and intentionally organized
- product, protocol, condition, research, and rental pages are already conceptually connected
- the app already contains hooks for CRM, notifications, workflow automation, consent-aware analytics, and payment orchestration

The biggest weaknesses today:

- the content model is split across multiple competing sources of truth
- the public taxonomy is broader than the canonical product/research content that supports it
- several integrations are only half-finished
- the design language is strong on home/store/product pages but weaker and more generic in supporting flows
- partner/account/rental/admin capabilities exist in code or local stack manifests but are not fully turned into user-facing value

Bottom line:

- This repo already contains the ingredients for a much more powerful site than the live public journey currently delivers.
- The highest-value move is not adding random new apps.
- The highest-value move is activating and unifying the capabilities already present, then adding 3-5 carefully chosen layers that increase guidance, search quality, automation, trust, and post-lead follow-through.

## 2. Technology and Runtime Snapshot

### Core stack

- Main app: Next.js App Router, `next@16.2.0`, `react@19.2.0`, `react-dom@19.2.0`
- Primary language: TypeScript
- Styling: Tailwind CSS v4, custom CSS layers, `motion/react`
- State: React context/local state + Zustand
- Auth: Auth.js / NextAuth v5 beta, credentials provider, JWT sessions
- Database: Drizzle ORM + PostgreSQL / Neon
- Testing: Vitest + Testing Library + Playwright + Axe
- Observability: Sentry, PostHog, Vercel Analytics, Vercel Speed Insights
- Security/runtime boundary: Arcjet, Nosecone, `proxy.ts`

### Other code/runtime layers

- Separate `control-panel/` Next app for admin and operator observability
- Large PowerShell-based local stack orchestration
- Docker and multi-service local operator stack
- Significant markdown/governance/documentation footprint

### Languages and file types in active use

- TypeScript / TSX
- CSS
- JavaScript / Node scripts
- PowerShell scripts
- Markdown
- JSON
- SQL-like schema definitions via Drizzle

### Key repo fact

There are effectively two products in this workspace:

1. the public Hylono website
2. a much larger operator stack and control plane sitting behind it

That matters because many capabilities that look "missing" on the website are already provisioned or scaffolded elsewhere in the repo.

## 3. Public Route Graph

The app contains 49 `app/**/page.tsx` route modules.

### A. Core commerce and conversion routes

- `/`
- `/store`
- `/product/[tech]`
- `/rental`
- `/checkout`
- `/rental/checkout`
- `/wellness-planner`

Role:

- compare products
- decide buy vs rent
- launch guided planner
- start checkout or rental flow

### B. SEO knowledge and education routes

- `/research`
- `/blog`
- `/blog/[slug]`
- `/conditions`
- `/conditions/[slug]`
- `/protocols`
- `/protocols/[slug]`
- `/learning`
- `/search`

Role:

- bring search traffic in
- educate users
- bridge from educational intent to products, protocols, and contact/rental actions

### C. Trust, company, and support routes

- `/about`
- `/contact`
- `/help`
- `/faq`
- `/press`
- `/shipping`
- `/returns`
- `/warranty`
- `/privacy`
- `/terms`
- `/cookie-policy`
- `/careers`
- `/support` (redirect-style alias)
- `/guarantee` (redirect-style alias)

Role:

- reduce hesitation
- answer operational questions
- support compliance
- strengthen legitimacy

### D. Partner / B2B / network routes

- `/partners`
- `/affiliate`
- `/locator`

Role:

- clinics
- affiliates
- distribution/partner discovery
- center/location finding

Important note:

- these exist publicly but are intentionally de-emphasized for standard indexing

### E. Special campaign / microsite-style routes

- `/meridian`
- `/firesafe`
- `/hho-car-kit`

Role:

- special products or adjacent campaigns
- currently feel more like microsites than integrated store taxonomy

### F. Account and user-state routes

- `/login`
- `/account`
- `/wishlist`
- `/rewards`
- `/onboarding`

Role:

- retention
- personalization
- account lifecycle

### G. Nexus workspace routes

- `/nexus`
- `/nexus/academy`
- `/nexus/clients`
- `/nexus/docs`
- `/nexus/fleet`
- `/nexus/studio`
- `/nexus/supplies`
- `/nexus/team`

Role:

- partner/operator workspace
- clinic/admin/fleet/resource tooling

### Route grouping summary

The real information architecture is:

`Home -> Conditions -> Research / Protocols -> Product -> Rental / Contact / Checkout`

with side systems for:

- account / rewards / onboarding
- partner locator and affiliate
- Nexus partner workspace

## 4. Content and Category Map

## 4.1 Canonical public content sources

The intended SEO-governed public content layer lives in:

- `content/conditions.ts`
- `content/protocols.ts`
- `content/research.ts`
- `content/evidence.ts`
- `content/products.ts`
- `content/help-faq.ts`
- `content/rental.ts`
- `content/site-entity.ts`

Important governance gap:

- the guide expects a canonical `content/topical-graph.ts`
- that file is missing

So the topical graph is real, but it is distributed across several files rather than centralized.

## 4.2 Condition categories

Current condition/goal pages:

- Recovery
- Sleep
- Stress
- Comfort
- Vitality

Each condition page includes:

- ranked modalities
- stack tiers
- evidence references
- linked protocols
- FAQs

Important limitation:

- these are actually "goal" pages, not a deeper condition taxonomy
- adjacent demand areas like pain, skin, longevity, cognitive performance, strength, and similar topics exist in the broader repo language but do not have canonical public hubs yet

## 4.3 Protocol categories

Live canonical protocols:

- `recovery-oxygen-foundation`
- `stress-balance-h2-foundation`
- `vitality-dual-stack`

Observation:

- all canonical protocols are HBOT and/or Hydrogen led
- there are no equally mature canonical protocol programs centered on RLT or PEMF

## 4.4 Research categories

Current research hub filters:

- All
- HBOT
- H2

Canonical research studies in `content/research.ts`: 4  
Canonical evidence records in `content/evidence.ts`: 6

Observation:

- the research/evidence surface is materially narrower than the public modality language used elsewhere
- this creates mismatch when the site prominently discusses RLT, PEMF, and other modalities without equally strong canonical research support in the live content layer

## 4.5 Product categories

There are two competing product taxonomies.

### Canonical content product layer

In `content/products.ts`, there are only 2 concrete products:

- HBOT ST1700
- Hydrogen HOP-450

### Public route/store taxonomy

The store/product route system and `TECH_DETAILS` model support a broader universe:

- HBOT
- PEMF
- RLT
- HYDROGEN
- EWOT
- SAUNA_BLANKET
- EMS
- VNS
- HYPOXIC
- CRYO

This is one of the single most important structural findings in the repo:

- the public route graph is broader than the canonical product content layer that is supposed to support it

## 4.6 Blog categories

Canonical blog categories inferred from `constants/content.ts`:

- HBOT
- PEMF
- RLT
- Hydrogen
- Protocols

Current canonical post count: 5

## 4.7 Help/support categories

FAQ/help is organized into:

- About Hylono
- Science and Protocols
- Products and Purchasing
- Shipping and Support

## 5. Existing Integrations, APIs, and Automation Surface

### Already integrated in the app runtime

- Drizzle + PostgreSQL / Neon
- NextAuth credentials auth
- Stripe PaymentIntent creation
- Resend
- n8n webhooks
- Twenty CRM sync
- Novu subscriber sync + workflow trigger
- UploadThing
- PostHog
- Vercel Analytics / Speed Insights
- Sentry
- Arcjet
- Nosecone

### Public API routes already implemented

- `/api/contact`
- `/api/newsletter`
- `/api/booking`
- `/api/checkout`
- `/api/rental`
- `/api/auth/[...nextauth]`
- `/api/uploadthing`

### What these flows already do

- form submission
- validation
- DB persistence
- fan-out to automation/CRM/notification layers
- degraded success handling when downstream services fail

### What is present in the wider local/operator stack but not fully realized in the public app

Based on `manifest.json`, scripts, and control-panel files, the repo also provisions or references:

- Cal.com
- Documenso
- Medusa
- Lago
- Snipe-IT
- Zitadel
- MinIO
- Mongo
- Redis
- Uptime Kuma
- n8n
- Novu
- Twenty

This means the repo is already aiming at a larger operating system than the public website currently exposes.

## 6. UX and Visual Read

## 6.1 Current visual language

The strongest public visual language is:

- scientific premium
- clean white/light surfaces
- dark proof bands
- cyan primary accent
- rounded premium cards
- blur, glow, grain, glass, and motion

It is not generic SaaS, and it is not soft lifestyle wellness either. It is closer to "Swiss-tech wellness theater."

## 6.2 Strong visual/conversion surfaces

Best current surfaces:

- homepage
- store
- product detail
- protocols

Why these work:

- richer motion system
- stronger storytelling
- clearer CTA structure
- more obvious buy/rent guidance
- more integrated trust/proof patterns

## 6.3 Weaker or less unified surfaces

Weaker relative surfaces:

- conditions
- rental
- planner
- help/contact support flows

These often feel flatter and more generic than the premium home/store/product system.

## 6.4 Important UX/code issues

- `GlobalOverlays` exists but is not mounted by the main shell, so the consent / exit intent / multitool layer appears disconnected from the actual live layout
- `/help`, `/faq`, `/support`, and `/contact` do not feel fully unified into one support mental model
- there is visible prototype residue and legacy component drift

## 7. Highest-Value Gaps

These are the biggest practical gaps right now.

### 1. Taxonomy and source-of-truth drift

- missing canonical `content/topical-graph.ts`
- route/store taxonomy broader than canonical product content
- research/evidence narrower than the modality language used across the site
- multiple overlapping content systems

### 2. Half-activated business systems

- booking stores intent but is not truly calendar-routed
- Stripe is only partly realized at the UI/runtime level
- rental contract/billing stack is thin
- auth is minimal compared to the surrounding stack ambitions

### 3. Trust and freshness mismatch

- schema contains more ownership/review/freshness logic than visible HTML
- health-adjacent trust markers should be more visible on-page, not just in metadata

### 4. UX continuity problems

- premium product theater on home/store/PDP does not fully carry through into condition/rental/support flows
- some internal tools and overlays look conceptually planned but not fully mounted

### 5. Underused automation stack

- n8n, Twenty, Novu, control panel, and broader operator services exist, but the public app only uses a narrower slice of them

## 8. Best Next Additions: Apps, APIs, and Integrations

The recommendations below are prioritized by practical fit with this repo, likely customer value, and how much existing groundwork is already present.

## Priority 1: Activate what the repo already points toward

### A. Real advisor routing and booking

Why:

- booking is currently mostly lead capture, not a real routing engine
- the site already frames itself as guided selection, so real routing is high leverage

What to add:

- Cal.com routing forms
- round-robin advisor/team routing
- clinic / partner / modality / country / language matching
- embedded or headless routing from existing forms

Why this fits the repo:

- Cal.com is already present in the broader stack
- partner/clinic flows already exist
- booking intent fields already exist

[VERIFIED] Official reference: [Cal.com routing with round robin and attribute matching](https://cal.com/help/routing/routing-with-attributes)

## B. Full CRM and follow-up activation

Why:

- the site already collects leads, bookings, newsletter signups, and rental applications
- the missing value is structured follow-through, not more forms

What to add:

- proper pipeline stages
- opportunity creation by source and modality
- task automation by lead type
- lifecycle dashboards
- AI-assisted follow-up drafting for staff

Why this fits the repo:

- Twenty integration already exists
- n8n already emits intake events
- Novu can already trigger workflows

[VERIFIED] Official reference: [Twenty APIs](https://docs.twenty.com/developers/extend/api)  
[VERIFIED] Official reference: [Twenty user guide overview](https://docs.twenty.com/)

## C. Post-submit automation and notification lifecycle

Why:

- current intake flows are functional but thin
- customers need clearer next-step visibility
- staff need less manual triage

What to add:

- lead scoring
- enrichment
- reminder chains
- "we received your request" journey
- advisor handoff alerts
- in-app or email status updates

Why this fits the repo:

- n8n is already wired
- Novu is already wired
- the local stack includes richer workflow assets than the public app currently uses

[VERIFIED] Official reference: [OpenAI tools guide](https://developers.openai.com/api/docs/guides/tools)  
Note: this can also support AI-assisted triage inside automation flows.

## Priority 2: Add high-value customer experience layers

### D. Grounded AI concierge and recommendation assistant

Why:

- this site has a lot of educational and comparative intent
- users likely need help choosing technologies, understanding suitability, and knowing what to do next
- the current planner is useful, but a guided conversational layer could increase clarity and lead quality

What to build:

- grounded Hylono concierge
- answers from internal content only
- product/protocol/condition bridging
- clear safety boundaries and escalation to human help
- optional lead capture and booking handoff

Recommended implementation shape:

- use OpenAI Responses API
- use file search / retrieval against internal content
- use tool/function calls to link to product, protocol, booking, and contact actions
- optionally add web search only for controlled external knowledge or partner lookup

Why this fits the repo:

- the content graph already exists
- the planner and support flows already exist
- there is already an operator/control stack to support escalation

[VERIFIED] Official reference: [OpenAI tools guide](https://developers.openai.com/api/docs/guides/tools)

### E. Real search and discovery layer

Why:

- current `/search` is a simple text filter across a small set of sources
- the public route graph and modality model are already larger than the current internal search experience

What to add:

- faceted search
- autocomplete
- typo tolerance
- searchable conditions/protocols/blog/products/help content
- recommendation blocks and cross-links

Recommended app/API:

- Algolia React InstantSearch

Why this fits the repo:

- React stack already in place
- existing content objects are structured enough to index
- useful for both public discovery and internal operator search later

[VERIFIED] Official reference: [Algolia React InstantSearch](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/react)

## Priority 3: Finish commerce and rental credibility

### F. Complete checkout, billing, contract, and rental stack

Why:

- payment and rental intent are already present, but the end-to-end customer trust loop is incomplete

What to add:

- Stripe Elements / confirmation / webhook completion
- proper order state reconciliation
- contract signing with Documenso
- recurring rental billing or subscription logic
- clearer order/rental status view in account area

Why this fits the repo:

- Stripe already exists in API layer
- Documenso exists in operator stack
- Lago / Medusa are already part of the broader environment

Potential outcome:

- Hylono becomes meaningfully stronger as a rental-first guided commerce experience, not just a lead form with pricing

## Priority 4: Trust, experimentation, and conversion optimization

### G. Activate experimentation, surveys, and replay

Why:

- current analytics exist, but the site is at the stage where qualitative and conversion feedback loops matter as much as raw traffic

What to add:

- experiments on CTA framing, planner entry points, buy-vs-rent copy, contact triggers
- in-product or on-site surveys
- session replay tied to funnel drop-off

Why this fits the repo:

- PostHog is already installed and consent-aware

[VERIFIED] Official reference: [PostHog Surveys](https://posthog.com/surveys)

### H. Make trust markers visible, not just structural

Why:

- review/freshness/ownership metadata exists more strongly in schema than in visible UI

What to add:

- visible reviewer cards
- updated dates
- methodology notes
- evidence-strength markers
- page owner or editorial accountability panels

This does not require a new vendor. It requires better use of the content and SEO system already present.

## Priority 5: Expand retention and customer portal value

### I. Make account and rewards actually useful

Why:

- account, rewards, onboarding, and wishlist routes exist
- this is the natural place to deepen retention

What to add:

- saved planner results
- saved comparisons
- rental/order status timeline
- document vault
- notification preferences
- protocol reminders
- follow-up check-ins

Suggested supporting tools:

- existing auth layer, upgraded
- Novu lifecycle notifications
- Twenty relationship history
- Documenso / uploads for documents

## 9. Strongest Recommendation Roadmap

If the goal is to maximize effectiveness and customer added value without wasting effort, do this in order:

### Phase 1

- unify the content graph and fix source-of-truth drift
- finish real booking/routing
- complete Stripe + rental + contract flow
- mount overlays and fix obvious UX disconnects

### Phase 2

- activate Twenty + n8n + Novu as a real lifecycle system
- launch grounded AI concierge
- replace basic internal search with real search/discovery

### Phase 3

- strengthen visible trust/freshness and expert ownership
- turn account/rewards/onboarding into a real post-purchase portal
- activate partner/Nexus/operator surfaces as a coherent second product

## 10. Questions GPT Pro Should Focus On

If another AI is going to critique or extend this work, it should focus on:

1. Which of the current route groups should remain public/indexable, and which should be restructured?
2. How should the canonical product/content graph be consolidated so store, conditions, protocols, research, and rental all share one source of truth?
3. Which of the already-present operator stack services should be officially adopted vs removed?
4. What is the best UX for a grounded AI concierge in a health-adjacent, compliance-sensitive site?
5. Should Hylono lean harder into guided rental-first commerce, partner distribution, or premium DTC device education?

## 11. Handoff Prompt for GPT Pro

Use this repo audit as authoritative context for the current Hylono website.  
Do not re-summarize the report unless necessary.  
Instead:

1. Identify the 10 highest-leverage improvements.
2. Separate them into:
   - quick wins
   - medium-complexity improvements
   - major strategic builds
3. For each improvement, explain:
   - user value
   - business value
   - technical complexity
   - dependencies
   - risks
   - whether it should use an existing repo capability or a new external app/API
4. Call out anything that is missing, duplicated, or structurally incoherent in the current website model.
5. Propose a prioritized roadmap for the next 90 days.

## Appendix A: Full Public Route Inventory

```text
/
/about
/account
/affiliate
/blog
/blog/[slug]
/careers
/checkout
/conditions
/conditions/[slug]
/contact
/cookie-policy
/faq
/firesafe
/guarantee
/help
/hho-car-kit
/learning
/locator
/login
/meridian
/nexus
/nexus/academy
/nexus/clients
/nexus/docs
/nexus/fleet
/nexus/studio
/nexus/supplies
/nexus/team
/onboarding
/partners
/press
/privacy
/product/[tech]
/protocols
/protocols/[slug]
/rental
/rental/checkout
/research
/returns
/rewards
/search
/shipping
/store
/support
/terms
/warranty
/wellness-planner
/wishlist
```

