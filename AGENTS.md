# Repository Agent Rules

If you create or change any public-facing page, route, schema, navigation item, or indexable content in this repo, read `docs/governance/seo-page-production-guide.md` first and follow it.

If the work includes redesign, layout rework, information architecture changes, route reshuffling, or visual simplification of public pages, also read `docs/governance/seo-redesign-priority-map.md`.

If the goal is to recover the old pre-SEO-update visual feel without breaking the current SEO architecture, also read `docs/strategy/seo-visual-restoration-report-2026-03-07.md`.

## Default Entry

- Start normal work in this repo with `Use $universal-project-codex. <task>`.
- Use `Use $select-applicable-skills. <task>` when the task needs a more precise specialist-skill mix.
- Use `Use $split-task-cli. <task>` only for explicit multi-agent fan-out.
- Use `Use $workspace-autopilot. <task>` only when the checkout or folder state itself is unclear.

## SEO Non-Negotiables

- Keep public routes server-first. `app/**/page.tsx` must not become client-only.
- Every route must include a `[DECISION: ...]` annotation and an explicit rendering strategy.
- Use `createPageMetadata` from `lib/seo-metadata.ts` for page metadata.
- Emit JSON-LD only through `src/components/StructuredData.tsx` and helpers in `lib/seo-schema.ts`.
- Do not publish fake studies, fake reviewers, fake experts, fake partners, fake ratings, or unsupported merchant details.
- Health-adjacent pages must show visible ownership, review, and freshness metadata.
- Indexable pages must connect into the canonical topical graph:
  `Condition -> Research -> Product -> Protocol -> Rental/Contact`
- Update sitemap, redirects, and internal links when the public route graph changes.
- Run `pnpm check` before closing SEO-sensitive work.
- Run `pnpm compliance:strict` whenever you change health-adjacent or benefit-oriented copy.

## Canonical Commands

- Install dependencies: `pnpm install`
- Start dev server: `pnpm dev`
- Build the app: `pnpm build`
- Run the main verification suite: `pnpm check`
- Run tests: `pnpm test`
- Run strict compliance: `pnpm compliance:strict`
- Run E2E tests: `pnpm run test:e2e`

## Source Of Truth Files

- `content/evidence.ts`
- `content/research.ts`
- `content/site-entity.ts`
- `content/topical-graph.ts`
- `lib/seo-metadata.ts`
- `lib/seo-schema.ts`
- `app/sitemap.ts`
- `app/robots.ts`
- `config/seo-redirects.ts`

If a new page cannot meet the guide's requirements yet, prefer `noindex,follow` or a redirect until it is ready.

## Review Guidelines

- Default review focus in this repo is regressions, not style.
- Prioritize issues on public routes, canonical tags, metadata, sitemap coverage, robots directives, redirects, JSON-LD, and internal linking.
- Flag any public page that becomes client-only or shifts primary rendering out of the server-first path.
- Flag copy that creates unsupported medical, benefit, review, testimonial, rating, or evidence claims.
- Flag mismatches between content changes and the required source-of-truth files listed above.
- Flag regressions in intake flows tied to `contact`, `booking`, `newsletter`, `order`, or `rental` webhook dispatch.
- For SEO-sensitive review or remediation work, run `pnpm check` before closing.
- For health-adjacent or benefit-oriented copy, run `pnpm compliance:strict` before closing.
- When public UI changes, include targeted Playwright verification in the review flow.
