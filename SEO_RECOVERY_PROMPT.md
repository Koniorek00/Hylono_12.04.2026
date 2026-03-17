# HYLONO SEO MAXIMUM RECOVERY PROMPT

You are working in:

F:\ag projects\Hylono_MAIN - SEO BOOST

This repository is already the correct visual baseline.

Your task is NOT to do a light SEO pass.
Your task is to push the current implementation as close as practically possible to 9.5/10 or higher in the project SEO audit model, WITHOUT changing the public-facing design.

You are expected to FIX the implementation, not just review it.

## NON-NEGOTIABLE RULES

Do NOT redesign the site.
Do NOT simplify the UI for SEO.
Do NOT flatten premium sections.
Do NOT replace the current design with generic SEO templates.
Do NOT introduce visible layout changes unless absolutely unavoidable.
Do NOT remove premium visual composition.
Do NOT ship cosmetic SEO tricks instead of real technical fixes.

You MAY change:

- routing internals
- slug validation
- notFound / redirect behavior
- metadata generation
- schema generation
- robots logic
- sitemap / RSS generation
- server/client rendering boundaries
- hidden SEO support layers
- internal linking implementation
- compliance-sensitive public copy
- crawl/index logic

You MAY NOT change:

- visual design system
- layout hierarchy
- public design rhythm
- premium look and feel
- core page composition

## PRIMARY GOAL

Raise the implementation from the current audited state to the highest practical SEO quality level without redesign.

Do not stop at “better”.
Push until the implementation is close to maximum standard.

## CURRENT AUDITED BLOCKERS THAT MUST BE FIXED

You must treat all of the following as mandatory fix targets.

### 1. CRITICAL: BLOG SOFT-404
Current blocker:
- `/blog/[slug]` serves invalid slugs with `200` + not-found/noindex body instead of real `404`

Primary responsibility:
- `app/blog/[slug]/page.tsx`

Required outcome:
- invalid blog slugs must return real `404`
- do not serve `200` not-found pages
- do not use `noindex` fallback as a substitute for a real `404`
- use proper Next.js App Router not-found behavior
- ensure case/legacy variants are handled intentionally:
  - real canonical redirect if valid normalization is intended
  - otherwise real `404`

This is a hard blocker.
Do not close the task while any soft-404 remains.

### 2. CRITICAL: RSS / INDEX QUALITY DRIFT
Current blocker:
- `public/rss.xml` still includes stale numeric blog URLs like `/blog/1` through `/blog/5`

Required outcome:
- RSS must publish only real live canonical article URLs
- no stale numeric routes
- no URLs that do not map to the live slug system
- no invalid URLs that could degrade crawl quality

Primary file:
- `public/rss.xml`

### 3. CRITICAL: PUBLIC-CONTENT COMPLIANCE FAILURES
Current blocker:
`pnpm compliance:strict` fails with critical/high issues in public or SEO-relevant content.

Highest-priority files:
- `components/blog/ArticleReader.tsx`
- `components/ChamberCompare.tsx`
- `components/ChamberCompare5.tsx`
- `components/LegalPages.tsx`
- `constants/chambers.ts`
- `constants/knowledge.ts`
- `content/research.ts`
- `content/evidence.ts`

Required outcome:
- reduce or eliminate critical/high public-content compliance issues
- especially fix issues that affect indexable public copy
- preserve truthful, evidence-aligned, non-fake trust framing
- do not add fake reviews, fake claims, fake experts, fake documents, fake authority, fake commerce signals

This is a major blocker.
Do not declare success while public SEO-facing compliance is still materially failing.

### 4. METADATA QUALITY BELOW MAXIMUM STANDARD
Current blocker:
- metadata is acceptable but not best-in-class
- descriptions are padded by generic suffix logic
- some titles are serviceable rather than strong SERP copy

Primary files:
- `lib/seo-metadata.ts`
- `app/page.tsx`
- `app/store/page.tsx`
- `app/product/[tech]/page.tsx`
- `app/conditions/[slug]/page.tsx`
- `app/protocols/[slug]/page.tsx`
- `app/blog/[slug]/page.tsx`

Required outcome:
- remove generic description padding
- improve title quality
- improve product / condition / protocol / blog SERP phrasing
- preserve canonical consistency
- ensure titles/descriptions remain unique

### 5. AI-READINESS BELOW MAXIMUM STANDARD
Current blocker:
- too much reliance on `sr-only` extraction summaries
- too little visible answer-first structure on key commercial/informational routes

Primary routes/files:
- `app/page.tsx`
- `app/store/page.tsx`
- `app/product/[tech]/page.tsx`
- `app/conditions/[slug]/page.tsx`
- `app/protocols/[slug]/page.tsx`
- `app/blog/[slug]/page.tsx`

Required outcome:
- reduce over-reliance on hidden SEO summary layers
- keep crawlable HTML
- introduce stronger visible answer-first framing inside the existing design
- do not visually redesign pages
- do not inject ugly SEO blocks
- preserve premium presentation

### 6. RENDERING / HTML CLEANLINESS ISSUES
Current blocker:
- extra hidden summary layers may be contributing to duplicate semantics and multiple `<h1>` patterns
- live browser checks showed some loading/client-error behavior on heavier routes

Required outcome:
- keep important pages server-first and crawlable
- reduce semantic duplication where possible
- avoid multiple competing `<h1>` patterns
- keep initial HTML meaningful
- do not regress rendering quality

## REQUIRED EXECUTION ORDER

You must follow this order exactly.

### STEP 1 — FIX ALL HARD BLOCKERS FIRST
Do not work on polish first.

Fix in this order:
1. `/blog/[slug]` real 404 behavior
2. `public/rss.xml`
3. public-content compliance failures
4. metadata quality weaknesses
5. AI-readiness weaknesses
6. rendering / semantic cleanup

### STEP 2 — VERIFY ROUTE FAMILIES
You must explicitly verify:
- `/`
- `/store`
- `/product/[tech]`
- `/product/hbot`
- `/conditions`
- `/conditions/[slug]`
- `/research`
- `/protocols`
- `/protocols/[slug]`
- `/blog/[slug]`

You must re-check:
- real invalid slugs
- case variants
- legacy variants
- canonical normalization behavior
- HTML crawlability
- JSON-LD presence
- metadata output
- visible design parity

### STEP 3 — DO NOT STOP AT THE FIRST GREEN BUILD
A passing build is NOT enough.
A passing `pnpm check` is NOT enough.
You must keep iterating until the site reaches the highest practical SEO standard under the no-redesign constraint.

### STEP 4 — RE-AUDIT AFTER CHANGES
After implementation, you must run a fresh end-to-end re-audit.

Required commands:
- `pnpm build`
- `pnpm check`
- `pnpm compliance:strict`

Required live verification:
- run production with `next start`
- verify live routes on a local production port
- inspect HTML
- inspect status codes
- inspect canonicals
- inspect structured data
- inspect robots/sitemap/RSS
- inspect visual parity on key routes

## SCORING TARGET

Your target is not “improved”.
Your target is:

- highest practical score possible
- ideally `9.5 / 10` or better
- if that is not reached, continue fixing until no material blockers remain

You are NOT allowed to stop with a score below `9.0 / 10` unless you hit a genuine blocker that cannot be solved inside the repo.

If score remains below `9.0 / 10`, you must:
1. explain exactly why
2. identify the remaining blocking files
3. state what still prevents maximum score
4. confirm whether the blocker is fixable in-repo or external

## ABSOLUTE EXIT CRITERIA

You may NOT declare the task complete unless ALL of the following are true:

- invalid blog slugs return real `404`
- no soft-404 remains on public dynamic SEO routes
- RSS only contains real canonical live article URLs
- canonical / robots / sitemap / schema host consistency remains intact
- metadata is unique and improved to high standard
- structured data remains valid
- internal crawl graph remains intact
- visible answer-first quality is materially improved on key routes
- `pnpm build` passes
- `pnpm check` passes
- `pnpm compliance:strict` is either passing or reduced to only clearly non-public / non-SEO residual issues with full explanation
- design parity remains intact
- a fresh post-fix SEO audit is included

If any of the above is not true, do not close the task.

## FINAL OUTPUT FORMAT

Return your final report in this exact structure:

1. What was fixed
2. Which exact files were changed
3. Which critical blockers were eliminated
4. Crawlability result after fixes
5. Metadata result after fixes
6. Structured data result after fixes
7. AI search readiness result after fixes
8. Build / check / compliance results
9. Design parity result
10. Remaining blockers, if any
11. FINAL SEO SCORE (`x / 10`)
12. One of the following exact statements:

- `SEO RECOVERY COMPLETE — READY FOR FINAL SIGN-OFF`
or
- `SEO RECOVERY PARTIAL — BLOCKERS STILL REMAIN`

## IMPORTANT BEHAVIOR RULE

Do not behave like an auditor.
Behave like an implementation owner responsible for getting this repo as close as possible to maximum SEO quality without redesign.
