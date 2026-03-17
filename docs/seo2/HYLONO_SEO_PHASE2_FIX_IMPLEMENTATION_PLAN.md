# HYLONO SEO PHASE 2 FIX IMPLEMENTATION PLAN

This plan turns the latest audit and current source state into a deterministic remediation sequence.

Baseline inputs:

- latest audit report: `reports/seo-audit-2026-03-11.md`
- latest reported score: `4.4 / 10`
- verified compliance baseline: `94` issues across `38` files
- current stack: Next.js 16 App Router

Primary goal:

- eliminate production-blocking SEO defects
- preserve the existing premium UI baseline
- produce a release decision backed by runtime evidence, not assumptions

---

## 0. PRE-FLIGHT: RECONCILE AUDIT VS CURRENT SOURCE

Do this before changing code.

Several older audit claims may already be partially fixed in source. Treat the audit as a high-value lead, not as perfect truth.

### Current high-confidence observations

| Area | Current source state | Required action |
|---|---|---|
| Dynamic route guards | `product`, `conditions`, `protocols`, and `blog` routes already use `notFound()` and lowercase redirect logic | Verify in runtime and only modify if soft-404 behavior still reproduces |
| Root metadata template | `app/layout.tsx` still lacks `title.template` | Fix |
| Product title pattern | `app/product/[tech]/page.tsx` still uses `| Product Details` | Fix |
| Blog / site schema host alignment | `lib/seo-schema.ts` now centralizes schema URLs through `NEXT_PUBLIC_SITE_URL` and includes `SearchAction` | Verify rendered output and close if correct |
| Generic route titles | `/store`, `/research`, `/faq`, and `/about` metadata appear improved in source | Verify and avoid duplicate work |
| Host leakage | `components/partner/ReferralConnect.tsx` still hardcodes `https://hylono.com/...`; `constants/chambers.ts` still contains `oxyhelp.com` media URLs | Fix or document |
| Locator strategy | `app/locator/page.tsx` remains `noindex`, interactive client UI remains client-only, but `noscript` content and `ItemList` schema exist | Make an explicit strategic decision |
| Compliance | `pnpm compliance:strict` still fails with 94 issues across 38 files | Fix |

Output of this step:

- a short list of issues that are still open
- a short list of issues already fixed in source and only needing verification
- a short list of external blockers that code changes cannot resolve

---

## P0. RELEASE BLOCKERS

These items determine whether the site can be called production-ready.

### P0.1. Primary host and deployment alignment

Problem:

- the repo is configured around `https://hylono.eu`
- the audit reported host-level inconsistency and unresolved `.eu` availability

Required work:

- verify `NEXT_PUBLIC_SITE_URL` and every SEO helper point to the intended primary host
- remove internal `.com` leakage from production-facing flows
- verify robots, sitemap, canonicals, and JSON-LD all reinforce the same host
- document any unavoidable third-party asset URLs
- if DNS / deployment still do not match the primary host policy, flag it as an external blocker

Success criteria:

- no misleading internal `.com` URLs remain in active production paths
- primary host policy is internally consistent
- any unresolved public-host problem is clearly labeled as external and blocks release

---

### P0.2. Runtime proof that dynamic routes do not soft-404

Problem:

- soft-404s are historically the most damaging code-level SEO blocker in this repo
- current source suggests partial or full fixes, but runtime proof is required

Required work:

1. Build and run the production app.
2. Test valid, invalid, and wrong-case routes.
3. Inspect:
   - HTTP status
   - final URL after redirects
   - `<title>`
   - canonical
   - robots
   - JSON-LD presence
4. Confirm there is no `200` response serving a visible not-found body.

Route matrix to verify:

| Route family | Valid example | Invalid example | Wrong-case example | Expected outcome |
|---|---|---|---|---|
| Product | `/product/hydrogen` or a real product slug | `/product/not-a-real-tech` | `/product/HBOT` | Valid route renders normally; invalid returns `404`; wrong-case redirects canonically or returns `404` |
| Conditions | `/conditions/recovery` | `/conditions/not-a-real-condition` | `/conditions/Recovery` | Same rule |
| Protocols | `/protocols/recovery-oxygen-foundation` | `/protocols/not-a-real-protocol` | `/protocols/Recovery-Oxygen-Foundation` | Same rule |
| Blog | use a real blog slug from static params | `/blog/not-a-real-post` | `/blog/Example-Post` | Same rule |

Success criteria:

- invalid dynamic routes never return `200`
- wrong-case behavior is deterministic and canonical
- invalid routes do not emit indexable metadata or valid-page schema

---

### P0.3. Compliance clean pass

Problem:

- `pnpm compliance:strict` currently fails
- production sign-off is not valid while critical/high compliance issues remain

Required work:

- rerun `pnpm compliance:strict`
- group issues by language category, not just by file
- fix critical/high severity issues first
- preserve legitimate disclaimers and legal safeguards
- avoid global suppression or tool bypasses

Current highest-attention files:

- `components/blog/ArticleReader.tsx`
- `components/LegalPages.tsx`
- `constants/chambers.ts`
- `constants/knowledge.ts`
- `components/ChamberCompare.tsx`
- `components/ChamberCompare5.tsx`
- `components/RentalConfigurator.tsx`
- `components/partner/PDFTemplates.tsx`
- `hooks/usePartnerStore.ts`
- `utils/searchStorage.ts`

Success criteria:

- `pnpm compliance:strict` passes cleanly

---

## P1. HIGH-IMPACT QUALITY IMPROVEMENTS

### P1.1. Root metadata template and product-title rewrite

Problem:

- site-level metadata still lacks a strong branded title template
- product detail titles remain generic

Required work:

- add `title.default` and `title.template` behavior in `app/layout.tsx`
- replace `| Product Details` with a more descriptive product-detail pattern
- verify titles remain unique and match visible page intent

Success criteria:

- root metadata establishes a consistent title system
- no product page uses `| Product Details`

---

### P1.2. Host leakage cleanup in active source

Problem:

- some active source files still leak the wrong host or third-party brand domains in ways that may confuse entity integrity

Required work:

- replace `.com` URLs that should be internal Hylono URLs
- review `oxyhelp.com` asset usage in `constants/chambers.ts`
- keep third-party assets only when necessary, and document them as third-party media dependencies rather than canonical signals

Success criteria:

- active production-facing source contains no accidental wrong-domain internal URLs
- third-party assets are explicitly justified if retained

---

### P1.3. Structured-data verification and cleanup

Problem:

- schema quality has improved in source, but must be proven in rendered output

Required work:

- verify Organization, WebSite, BlogPosting, Breadcrumb, Product, and relevant WebPage schema on rendered pages
- confirm `mainEntityOfPage`, `url`, and breadcrumb items use the primary host
- confirm invalid routes do not emit misleading schema

Success criteria:

- schema is host-consistent and page-consistent on sampled routes

---

## P2. ANSWER-FIRST QUALITY AND INDEXABLE CONTENT CLARITY

### P2.1. Reduce overreliance on hidden summaries

Problem:

- key routes still lean on `sr-only` summaries for machine extraction

Required work:

- review the homepage, store, product, condition, protocol, and blog templates
- add minimal visible context-setting copy where hidden summaries are currently doing most of the SEO work
- ensure additions feel like part of the original design

Success criteria:

- answer-first meaning is visible on key templates
- hidden text is supplemental rather than the primary explanation layer

---

### P2.2. Locator / local SEO decision

Problem:

- the locator is neither a fully indexable local-content hub nor a clearly excluded utility page from an SEO-goals standpoint

Required work:

- decide whether `/locator` should remain `noindex`
- if it stays `noindex`, document the business reason and keep expectations aligned
- if it becomes indexable, add stronger server-visible local value and schema support

Success criteria:

- locator strategy is explicit, consistent, and reflected in metadata plus visible content

---

## P3. VERIFICATION AND PARITY

### P3.1. Production verification pass

Required commands:

- `pnpm build`
- `pnpm start`
- `pnpm check`
- `pnpm compliance:strict`

Required route verification:

- homepage
- store
- valid and invalid dynamic routes
- research
- protocols
- locator
- at least one real blog route

Required evidence to capture:

- status-code results for route matrix
- sampled titles and canonicals
- sampled schema presence
- compliance output result

---

### P3.2. Visual parity pass

Critical routes:

- `/`
- `/store`
- `/product/hydrogen`
- `/product/hbot`
- `/conditions`
- `/research`
- `/protocols`

Verify:

- layout rhythm is unchanged
- no obvious SEO-only blocks appear
- no spacing regressions appear
- any visible additions are small and justified

---

## FILE-BY-FILE EXECUTION NOTES

### `app/layout.tsx`

Focus:

- root title template
- consistent branded metadata system

### `app/product/[tech]/page.tsx`

Focus:

- runtime crawlability verification
- product title rewrite
- visible answer-first support if hidden-only text is carrying too much weight

### `app/conditions/[slug]/page.tsx`

Focus:

- runtime crawlability verification
- visible answer-first support if needed

### `app/protocols/[slug]/page.tsx`

Focus:

- runtime crawlability verification
- visible answer-first support if needed

### `app/blog/[slug]/page.tsx`

Focus:

- runtime crawlability verification
- schema verification
- visible answer-first support if needed

### `app/locator/page.tsx` and `app/locator/LocatorClient.tsx`

Focus:

- explicit local SEO strategy
- indexability decision
- server-visible value vs utility-only rationale

### `components/partner/ReferralConnect.tsx`

Focus:

- wrong-host internal URL cleanup

### `constants/chambers.ts`

Focus:

- third-party media justification
- compliance language cleanup

### Compliance-flagged files

Focus:

- replace risky claims with compliant wording
- keep the content persuasive without sounding medical or absolute

---

## DEFINITION OF DONE

This pass is done only when all of the following are true:

- the remaining SEO blockers have been categorized as fixed, already fixed and verified, external, or deferred with reason
- invalid dynamic routes no longer soft-404 in runtime verification
- host/entity leakage inside repo scope has been resolved or documented
- root metadata template exists
- product titles are stronger than `| Product Details`
- answer-first support is visible on key templates without design regression
- locator strategy is explicit
- `pnpm build` passes
- `pnpm check` passes
- `pnpm compliance:strict` passes
- design parity remains intact
- the final report gives a credible release decision

If host resolution or deployment alignment remains unresolved outside the repo, the report must say so plainly and block release.
