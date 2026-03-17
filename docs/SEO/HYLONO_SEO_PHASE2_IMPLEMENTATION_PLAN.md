# HYLONO SEO PHASE 2 IMPLEMENTATION PLAN

This phase focuses on SEO hardening without altering the visual design baseline.

The goal is to resolve structural SEO weaknesses detected in the audit while preserving the current UI and layout.

---

## P0 – CRITICAL TECHNICAL FIXES

These changes directly affect indexing and must be resolved first.

### Host normalization

- choose a single primary domain
- align canonical tags to the primary host
- align sitemap host
- align robots configuration
- remove cross-domain schema references

### Soft-404 cleanup

Dynamic routes must return real 404 responses.

Examples:

- `/product/[slug]`
- `/conditions/[slug]`
- `/research/[slug]`

Client fallback pages must not return status 200.

### Rendering stability

Important routes must be server-first:

- homepage
- product pages
- condition pages
- research pages

Ensure that important content exists in HTML output.

### Schema cleanup

Ensure schema integrity across:

- Product
- Article
- Organization
- Breadcrumb

Remove any references to non-primary domains.

---

## P1 – SEO QUALITY IMPROVEMENTS

### Metadata rewrite

Remove generic titles and descriptions.

Titles should include:

- technology name
- treatment context
- product identifier

Descriptions must be unique.

### Locator strategy

If the locator page contains insufficient content:

apply:
noindex,follow


If expanded:

add location structured data.

### Internal linking

Strengthen the canonical graph:

Condition → Research → Product → Protocol

Ensure links are crawlable HTML links.

---

## P2 – ADVANCED VISIBILITY

### AI search readiness

Introduce:

- answer-first summaries
- citation-friendly sections
- clearly structured informational blocks

### Authority signals

Introduce:

- author attribution
- content review signals
- evidence references