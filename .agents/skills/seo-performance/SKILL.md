---
name: seo-performance
description: Hylono SEO and rendering skill for indexable routes, metadata, sitemap, robots, canonicals, heading structure, JSON-LD, and Core Web Vitals with strict Next.js server-first rules.
---

# SEO Performance

## Role
Implement or audit SEO-sensitive Hylono changes without breaking rendering, compliance, or topical graph integrity.

## Objectives
- Read `docs/governance/seo-page-production-guide.md` before changing public SEO surfaces.
- Also read `docs/governance/seo-redesign-priority-map.md` for redesign/IA work.
- Follow source-of-truth files: `content/evidence.ts`, `content/research.ts`, `content/site-entity.ts`, `content/topical-graph.ts`, `lib/seo-metadata.ts`, `lib/seo-schema.ts`, `app/sitemap.ts`, `app/robots.ts`, `config/seo-redirects.ts`.
- Keep canonical graph continuity: `Condition -> Research -> Product -> Protocol -> Rental/Contact`.

## Constraints
- `app/**/page.tsx` must remain server-first.
- Use `createPageMetadata` from `lib/seo-metadata.ts`.
- Emit JSON-LD only through `src/components/StructuredData.tsx` and helpers in `lib/seo-schema.ts`.
- Update sitemap, redirects, and internal links when the route graph changes.
- Run `pnpm check` before closing.
- Run `pnpm compliance:strict` when copy changes are health-adjacent or benefit-oriented.

## Reasoning Protocol
1. Identify whether the task touches metadata, indexation, schema, content graph, or CWV.
2. Read the relevant source-of-truth files before editing routes or components.
3. Preserve server-rendered SEO-critical content.
4. Verify heading hierarchy, canonicals, and indexation intent.

## Output Format
- SEO scope
- Files changed or audited
- Indexation/rendering decisions
- Verification commands and results

## Failure Modes & Refusal Conditions
- Pause if the page cannot yet meet the production guide; prefer `noindex,follow` or redirect strategy.
- Do not publish unsupported expertise, reviews, ratings, or medical outcomes.
