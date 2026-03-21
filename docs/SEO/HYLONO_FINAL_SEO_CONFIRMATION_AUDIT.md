# Hylono Final SEO Confirmation Audit

_Audit date: 2026-03-12_

## Verdict

The repository-level SEO implementation is materially stronger than the March 11 baseline, but the project is **not ready for final external SEO sign-off** yet.

The current blockers are not cosmetic:

1. the configured primary host `https://hylono.eu` is still unresolved at DNS level, while `https://hylono.com` is live and serves a different WordPress property
2. invalid blog article URLs still return `200` instead of a true `404`
3. every public route still emits a generic noscript `H1` (`Hylono wellness platform`), which creates duplicate and low-intent heading signals in raw HTML

If the goal is "final confirmation before release," the answer is currently:

- `repo checks`: strong
- `runtime SEO`: mostly improved
- `production host readiness`: blocked
- `final sign-off`: not approved

## Audit Scope

This confirmation pass was performed against the code currently in `F:\ag projects\Hylono_MAIN - SEO BOOST` and a local production runtime started from the same workspace on `http://127.0.0.1:3012`.

Reviewed inputs:

- route metadata and schema helpers
- dynamic route handling for products, conditions, protocols, and blog
- robots, sitemap, RSS, and search/index controls
- local production HTML responses for key routes
- live hostname checks for `hylono.eu` and `hylono.com`
- repo verification commands

Primary source files reviewed:

- `app/layout.tsx`
- `lib/seo-metadata.ts`
- `lib/seo-schema.ts`
- `app/robots.ts`
- `app/sitemap.ts`
- `app/search/page.tsx`
- `app/locator/page.tsx`
- `app/product/[tech]/page.tsx`
- `app/conditions/[slug]/page.tsx`
- `app/protocols/[slug]/page.tsx`
- `app/blog/[slug]/page.tsx`
- `components/BlogArticle.tsx`

## Verification Performed

Passed:

- `pnpm audit:tooling`
- `pnpm audit:page-decisions`
- `pnpm audit:registry-parity`
- `pnpm audit:structured-data`
- `pnpm audit:token-drift`
- `pnpm build`
- `pnpm test`
- `pnpm check`

Failed:

- `pnpm compliance:strict`

Failure summary from `2026-03-12`:

- `48` issues across `31` files
- `7` critical
- `31` high
- failures are mostly broader health-adjacent/compliance wording in legacy content and support modules rather than a single SEO helper failure

Runtime artifacts generated during this pass:

- `.tmp-seo-confirm-runtime.json`
- `.tmp-seo-confirm-runtime-server.log`
- `.tmp-seo-confirm-runtime-server.err`
- `output/seo-confirmation-audit/home-desktop.png`

## What Is Confirmed Fixed

These were real improvements relative to the prior repo audit:

### 1. Dynamic soft-404s were fixed for products, conditions, and protocols

Confirmed in source:

- `app/product/[tech]/page.tsx`
- `app/conditions/[slug]/page.tsx`
- `app/protocols/[slug]/page.tsx`

Confirmed in local production runtime:

- `/product/not-a-real-product` -> `404`
- `/conditions/not-a-real-goal` -> `404`
- `/protocols/not-a-real-protocol` -> `404`

Those routes now emit:

- no canonical
- `noindex`
- real not-found behavior for the three route families above

### 2. Title strategy was upgraded on important indexable routes

Confirmed examples:

- `/store` -> `Wellness Technology Store | Compare Rentals, Prices and Device Specs | Hylono`
- `/research` -> `Hylono Research Hub | Wellness Technology Evidence and Insights`
- `/faq` -> `Hylono FAQ | Device, Rental, Safety, and Support Answers`
- `/about` -> `About Hylono | European Wellness Technology Mission and Team`

This is a clear improvement over earlier generic single-word titles.

### 3. Search/index controls are now more disciplined

Confirmed in source and runtime:

- `/search` is `noindex, follow`
- `/locator` is `noindex, follow`
- `/login` is `noindex, follow`
- `/search` and `/locator` are not included in `app/sitemap.ts`
- `app/robots.ts` still blocks sensitive/auth paths

### 4. Structured data governance is substantially cleaner

Confirmed:

- route modules now emit JSON-LD through the approved canonical component
- `lib/seo-schema.ts` binds schema URLs to `NEXT_PUBLIC_SITE_URL`
- `createWebSiteSchema()` now exposes `SearchAction`
- `app/locator/page.tsx` now emits collection/list schema with location-level business attributes

### 5. Key public pages still expose crawlable HTML

The local production runtime confirms crawlable anchors and server-emitted metadata on the tested routes. The accessibility snapshot for `/` also confirms that the current premium homepage composition is still present, not replaced by a generic SEO template.

## Current Blocking Findings

### 1. Primary public host is still unresolved and inconsistent

Severity: Critical

Confirmed on `2026-03-12`:

- `https://hylono.eu` -> DNS resolution failure (`Non-existent domain`)
- `https://hylono.eu/robots.txt` -> DNS resolution failure
- `https://hylono.com` -> `200`, live HTML from a different WordPress/Divi property
- `https://hylono.com/robots.txt` -> live WordPress-style robots output

Why this blocks sign-off:

- the app canonicals, sitemap, RSS, and schema are all bound to `https://hylono.eu`
- search engines cannot validate that host if it does not resolve
- `.com` currently sends a conflicting public brand/entity signal

Required before final approval:

- restore a live, reachable primary host
- ensure the deployed app is the property served on that host
- 301 every alternate host to the chosen primary

### 2. Invalid blog slugs still behave like soft-404 shells

Severity: Critical

Confirmed in local production runtime:

- `/blog/not-a-real-article` -> `200`
- title -> `Hylono`
- canonical -> none
- robots -> `noindex`
- visible state -> generic shell / not-found experience

Why this still matters:

- it is better than an indexable `200`, but it is still not a true `404`
- the route family remains inconsistent with products, conditions, and protocols
- search crawlers still receive a normal success response for invalid article URLs

Relevant code paths:

- `app/blog/[slug]/page.tsx`
- `components/BlogArticle.tsx`

Required before final approval:

- invalid article slugs must return a real `404` response, not just a `200` page with `noindex`

### 3. Generic noscript H1 is injected across all routes

Severity: High

Confirmed in runtime HTML:

- the first H1 on all tested routes is the same generic fallback:
  `Hylono wellness platform`

Examples:

- `/store` H1s: `Hylono wellness platform`, `Technology + Protocol`
- `/product/hbot` H1s: `Hylono wellness platform`, `HBOT`
- `/research` H1s: `Hylono wellness platform`, `Hylono research hub`, `Scientific research library`
- `/faq` H1s: `Hylono wellness platform`, `Frequently asked questions about Hylono devices and support`, `Help Center`

Root cause:

- `app/layout.tsx` injects a `<noscript>` block with a generic page-level `<h1>`

Why this matters:

- it creates duplicate or triple-H1 pages in raw HTML
- it weakens route-specific intent signals for crawlers that parse the server HTML first
- it makes the page-level heading hierarchy less deterministic than it should be

Recommended fix:

- remove the generic noscript `<h1>` from `app/layout.tsx`
- replace it with a paragraph or route-neutral text block

### 4. Strict compliance gating still fails repo-wide

Severity: High

Confirmed on `2026-03-12`:

- `pnpm compliance:strict` fails with `48` issues across `31` files

Important nuance:

- this is not a pure SEO blocker
- it is still a release/sign-off blocker for a wellness / health-adjacent site because content risk can undermine trust, search quality, and merchant readiness

Representative failure areas:

- aggressive wording in legacy content/constants
- medical/clinical language in components and partner modules
- guarantee/prevent/cure-style wording in supporting UI strings

### 5. Runtime noise is still present on the homepage

Severity: Medium

Observed during Playwright review of `/`:

- `500` error on `/api/auth/session`
- React hydration/runtime errors in the browser console
- missing `favicon.ico` request

Why it matters:

- this is not currently breaking crawlability
- it is still a quality signal problem and can complicate client hydration on core routes

## Route Confirmation Summary

### Confirmed healthy enough for current code baseline

- `/`
- `/store`
- `/product/hbot`
- `/product/pemf`
- `/conditions/recovery`
- `/protocols/recovery-oxygen-foundation`
- `/research`
- `/faq`
- `/about`

What was confirmed on those routes:

- route-specific title present
- canonical present on intended indexable routes
- `noindex` applied correctly on `search`, `locator`, and `login`
- structured data emitted
- crawlable anchors present in server HTML
- route-specific page content still exists in the rendered experience

### Confirmed still problematic

- `/blog/not-a-real-article` -> `200` soft-404 shell

### Confirmed intentionally non-indexable

- `/locator`
- `/search?q=hbot`
- `/login`

## Production Runtime Snapshot

Selected local production results from `.tmp-seo-confirm-runtime.json`:

| Route | Status | Robots | Canonical | Notes |
|---|---:|---|---|---|
| `/` | 200 | `index, follow` | `https://hylono.eu` | title is route-specific; homepage still renders premium sections |
| `/store` | 200 | `index, follow` | `https://hylono.eu/store` | improved store title; collection schema present |
| `/product/hbot` | 200 | `index, follow` | `https://hylono.eu/product/hbot` | product schema present |
| `/research` | 200 | `index, follow` | `https://hylono.eu/research` | medical/research schema present |
| `/locator` | 200 | `noindex, follow` | `https://hylono.eu/locator` | noindex is correct; locator schema present |
| `/search?q=hbot` | 200 | `noindex, follow` | `https://hylono.eu/search` | internal search is correctly excluded from indexing |
| `/product/not-a-real-product` | 404 | `noindex` | none | fixed |
| `/conditions/not-a-real-goal` | 404 | `noindex` | none | fixed |
| `/protocols/not-a-real-protocol` | 404 | `noindex` | none | fixed |
| `/blog/not-a-real-article` | 200 | `noindex` | none | still not fixed |

## Sign-Off Decision

### Approved items

- repo audit scripts are in place and passing
- metadata/canonical helper usage is consistent
- product/condition/protocol soft-404 behavior is fixed
- search and locator index control is correct
- structured data governance is materially improved
- important route titles are better than the previous audit state

### Not approved yet

- final production SEO sign-off
- host/canonical sign-off
- final content/compliance sign-off

## Required Next Actions

1. Fix the host strategy first.
   Make the actual deployed app reachable on the chosen primary host and redirect alternates.

2. Fix invalid blog route status handling.
   `noindex` is not enough here; invalid article slugs must return `404`.

3. Remove the global generic noscript H1 from `app/layout.tsx`.
   Keep the fallback message, but do not inject a duplicate generic H1 across the entire site.

4. Clear `pnpm compliance:strict`.
   That does not need to happen in the same PR as SEO mechanics, but it does need to happen before full sign-off for a health-adjacent public launch.

5. Clean up homepage runtime noise.
   Resolve the `/api/auth/session` error and hydration/runtime console noise on the homepage.

## Final Statement

As of `2026-03-12`, this project has a credible SEO implementation baseline at the repository level, and several of the most serious code-path issues identified earlier are now fixed.

However, the work is **not fully confirmed for final launch** because:

- the intended primary host is still unresolved
- invalid blog slugs still return `200`
- the layout still emits a generic duplicate H1 across all routes
- strict compliance gating still fails

The correct current state is:

- **implementation improved**
- **confirmation audit completed**
- **final SEO sign-off blocked pending the items above**
