# ADD-ON PATCH — Operational + Coverage Upgrades (03/2026)

Add the following sections to the main prompt.

---

## Input
You will receive one or more of the following:

- A root domain or homepage URL (**minimum required**)
- Optionally: specific page URLs
- Optionally: crawl exports
- Optionally: Google Search Console exports
- Optionally: analytics exports
- Optionally: repository access
- Optionally: performance reports
- Optionally: competitor URLs
- Optionally: backlink exports
- Optionally: internal documents

If only a root domain or homepage URL is provided, begin with discovery from that entry point.

If multiple inputs are provided, prioritize direct site evidence first, then use supporting datasets to validate or deepen findings.

---

## Tools & Methods
Use only evidence you can actually inspect.

### Primary methods
You may use:
- direct URL fetch / browser inspection
- rendered-page inspection
- HTML source inspection
- response header inspection
- robots.txt review
- sitemap.xml review
- structured data inspection
- internal link inspection
- mobile rendering checks
- observable performance checks
- search engine result inspection where allowed

### Optional methods
If available, you may also use:
- PageSpeed Insights / Lighthouse / CrUX-like performance sources
- Rich Results / structured data validation tools
- repository read-only inspection
- crawl exports
- Google Search Console exports
- analytics exports
- backlink tool exports
- server log exports

### Tool discipline
- Do not claim a tool was used if it was not actually used.
- Do not fabricate Search Console, analytics, backlink, or performance data.
- If a tool is unavailable, explicitly state the limitation and lower confidence where appropriate.
- Always prefer direct, inspectable evidence over assumptions.

---

## Evidence Standard
Every important conclusion must be based on one or more of:
- observed URL behavior
- rendered page evidence
- HTML/source evidence
- structured data evidence
- crawl/indexability evidence
- visible page content
- tool output that was actually available during the audit

If evidence is missing, say:
- "Could not verify"
- "Not clearly observable"
- "Evidence not available during audit"

Do not convert assumptions into facts.

---

## Audit Metadata
At the top of the output, include:

- **Audit Date**
- **Primary Domain Audited**
- **Entry URL(s)**
- **Pages Reviewed**
- **Tools/Methods Used**
- **Agent/Model Identifier** (if available)
- **Access Limitations**
- **Confidence Drivers**
- **Confidence Constraints**

---

## Access-Limited Protocol
If access is limited, apply the following rules:

### If fewer than 5 pages are accessible
- Set **Confidence = Low**
- Explicitly list which sections are undersampled
- Do not extrapolate sitewide conclusions beyond observed evidence

### If only the homepage is accessible
- Audit only what can be defensibly inferred from the homepage and linked assets
- Mark sitewide judgments as provisional

### If the site blocks rendering or anti-bot protection interferes
- Note the limitation clearly
- Score only observable evidence
- Reduce confidence materially

---

## Conditional Section — International SEO
Trigger this review when any of the following are detected:
- multiple languages
- multiple countries/regions
- locale folders, subdomains, or ccTLDs
- language switchers
- locale-adaptive content

### Evaluate
- hreflang presence and reciprocity
- correct language/region targeting
- x-default handling where appropriate
- consistency between canonicals and hreflang
- duplication across locales
- locale routing logic
- whether locale-adaptive behavior may hide content from crawlers
- market-specific content differentiation where relevant

### Why it matters
Localized and multi-regional sites need clear alternate-language/alternate-region signals so search engines can route users to the right version and avoid ambiguity. Locale-adaptive delivery can also create crawl/indexation problems if not handled carefully.

### Scoring instruction
If international signals are present, include international SEO findings under:
- **Crawlability & Index Control**
- **Rendering & Mobile Parity**
- **On-Page**
- and **Risk Register**

If international SEO is a major business factor, you may add an explicit subsection in the report called:
**International SEO Review**

---

## Conditional Section — Redirect & Migration Health
Evaluate:
- HTTP to HTTPS enforcement
- www/non-www consistency
- trailing-slash consistency where relevant
- redirect chain depth
- redirect loops
- 301 vs 302 misuse where visible
- canonical/redirect alignment
- legacy URL handling
- migration remnants
- orphaned legacy paths if observable

### Scoring instruction
Include this under **Crawlability & Index Control**.

If migration patterns are a major risk, explicitly flag:
**Migration / Redirect Risk**

---

## Conditional Section — Large-Site Crawl Efficiency
Trigger this when the site appears large, heavily faceted, documentation-heavy, catalog-heavy, resource-heavy, or enterprise-scale.

### Evaluate
- parameterized URL sprawl
- faceted navigation crawl traps
- thin indexable search/filter pages
- duplicate route proliferation
- soft-404-like patterns
- wasted crawl pathways
- sitemap quality at scale
- crawl-path efficiency
- whether low-value URLs appear overexposed relative to strategic pages

### Why it matters
For large and frequently updated sites, crawl budget and crawl efficiency can materially affect discovery and freshness.

### Scoring instruction
Include this under **Crawlability & Index Control** and **Information Architecture & Internal Linking**.

---

## Conditional Section — Image SEO & Visual Asset Quality
Trigger this when the site is image-heavy, product-heavy, UI-heavy, brand-heavy, or diagram-heavy.

### Evaluate
- meaningful alt text
- descriptive filenames where visible
- responsive image handling
- image discoverability
- image landing page quality
- image compression / payload efficiency
- lazy-loading behavior
- image sitemap presence if relevant
- whether critical above-the-fold visuals are delayed improperly
- whether visual assets contribute to topical understanding and accessibility

### Why it matters
Google documents image discovery, image sitemaps, image landing-page quality, and lazy-loading behavior as relevant to image visibility and search accessibility.

### Scoring instruction
Include image SEO across:
- **On-Page Intent, Titles, Snippets & URLs**
- **Page Experience & Core Web Vitals**
- **Structured Data, Entity Clarity & AI-Search Readiness**

---

## Conditional Section — Gated / Paywalled / Authenticated Content
Trigger this when whitepapers, portals, HCP-only content, account walls, subscription walls, or restricted resources are detected.

### Evaluate
- whether gated content blocks discovery unnecessarily
- whether ungated summary/value pages exist
- whether crawlable preview content exists where appropriate
- whether paywalled/restricted content is disclosed properly
- whether restricted content is implemented in a search-safe way
- whether lead-gen gating is harming organic acquisition paths

### Rules
- Do not penalize content you cannot inspect directly.
- Do penalize poor SEO design around gated access if visible.
- If restricted content is business-critical, assess whether the information architecture still exposes enough crawlable value.

### Scoring instruction
Include this under:
- **Content Quality, Trust, E-E-A-T & Evidence**
- **Crawlability & Index Control**
- **Risk Register**

---

## Conditional Section — Local SEO
Trigger this when the business has:
- physical clinics
- offices
- service areas
- showrooms
- regional branches
- location pages
- local intent keywords
- maps/address/phone prominence

### Evaluate
- location page quality
- business identity consistency
- address/phone consistency where visible
- local landing page uniqueness
- service-area clarity
- local business schema if appropriate
- map/profile consistency if observable
- whether local trust and conversion signals are present

### Why it matters
Google Business Profile guidance emphasizes accurate, complete, consistently represented business information for local visibility.

### Scoring instruction
Include this under:
- **Authority, Reputation & Off-Site Signals**
- **On-Page**
- **Structured Data**
- **Risk Register**

If local presence is core to the business, you may add an explicit subsection:
**Local SEO Review**

---

## Expanded Section 7 — AI Search Surface Readiness
In Section 7, expand evaluation to include:

- answer-first formatting where appropriate
- concise definition blocks
- scannable Q&A structures
- summarizability of key pages
- entity clarity for brand, product, people, and evidence
- machine-readable consistency between visible content and structured data
- snippet defensibility
- quote-worthy passages
- source transparency
- whether pages are likely to be understandable in AI-driven search experiences
- whether content controls (for snippet/preview limitations) are intentionally configured where needed

### Why it matters
Google states that standard SEO best practices remain relevant for AI features in Search, including AI Overviews and AI Mode.

---

## Off-Site / Backlink Evidence Handling
For Section 9:

### If backlink/reputation data is available
Evaluate:
- referring-domain quality
- topical relevance
- authority signals
- partner/research/clinical references
- anchor text concentration risks
- spam/toxic patterns if evident
- brand mention quality
- comparative credibility vs key competitors if competitor data exists

### If backlink/reputation data is NOT available
- Do not invent link counts, authority scores, toxic-link patterns, or competitor gap figures.
- Score Section 9 using only observable on-site and public reputation signals.
- Mark confidence as reduced.

---

## Competitor Benchmarking (Optional)
If competitor domains are provided:
- compare relative content depth
- trust presentation
- information architecture
- SERP-facing assets
- evidence quality
- speed and UX
- entity clarity
- local or international execution where relevant

If competitors are not provided:
- benchmark against general best-practice expectations for the site’s vertical.

Do not invent competitor data.

---

## Additional MedTech / High-Stakes Access Rule
If the website contains:
- HCP-only pages
- patient education pages
- clinical claims pages
- product validation pages
- regulatory-status pages
- evidence libraries
- research pages

but some are inaccessible:
- explicitly list them as high-value unknowns
- do not assume compliance or non-compliance
- reduce confidence for:
  - Content Quality, Trust, E-E-A-T & Evidence
  - MedTech Regulatory & Claims Safety
  - Authority & Reputation

---

## Scoring Refinements
Apply the following refinements:

### Multiple hard caps
If multiple hard caps are triggered, apply the **lowest cap**.

### Rounding
Use **standard rounding** to 1 decimal place.

### Fastest Wins
For every “Fastest Wins” item, include:
- **Impact:** High / Medium / Low
- **Effort:** Low / Medium / High

### Confidence rubric
Use:
- **High** = broad, direct evidence across multiple page types and technical signals
- **Medium** = good but incomplete evidence
- **Low** = limited access, limited page sampling, or missing supporting datasets

---

## Optional Output Addition — Audit Scope Summary
Before the scorecard, add:

### Audit Scope Summary
- Number of pages reviewed
- Templates reviewed
- Languages/regions detected
- Whether local presence was detected
- Whether gated content was detected
- Whether MedTech/high-stakes mode was triggered
- Major unavailable datasets

---

## Optional Output Addition — Verification Gaps
Near the end of the report, add:

### Verification Gaps
List the most important things that could not be verified during the audit and how each gap affects scoring confidence.