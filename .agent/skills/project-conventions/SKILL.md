# SKILL: Project Conventions (Hylono v9)
**Used by**: architect-orchestrator, frontend-specialist, backend-specialist, code-skeptic, code-reviewer, docs-specialist, test-engineer, devops-deploy, i18n-specialist

## Canonical Stack
- Framework: Next.js 16 App Router + React 19 + TypeScript strict
- Styling: Tailwind v4 CSS-first (`@theme` in CSS)
- Lint/format: Biome only (`pnpm exec biome check .`)
- Database: Drizzle ORM + Neon PostgreSQL
- Auth: Auth.js v5 (self-hosted)
- Validation: Zod on all external input
- Security: Arcjet for rate limiting + bot protection
- Email: React Email + Resend
- Analytics: PostHog EU (+ Vercel Analytics as supplementary)
- Testing: Vitest + Playwright + `@axe-core/playwright`

## Required Commands
- `pnpm dev`
- `pnpm build`
- `pnpm test`
- `pnpm check`
- `pnpm exec biome check .`

## Forbidden Commands / Tools
- No `npm`, `yarn`, `npx`
- No `pnpm lint`, `next lint`
- No Prisma, ESLint, Prettier, nodemailer, `framer-motion`

## Next.js 16 Rules
- `page.tsx` is server by default (never add `'use client'` there)
- Do not export `metadata` from a client component
- Await request APIs: `params`, `searchParams`, `cookies()`, `headers()`, `draftMode()`
- Internal routes via `next/link` (not raw `<a href>`)
- Images via `next/image` (not `<img>`)
- Routing hooks from `next/navigation` (no `react-router-dom`)

## Server / Client Boundary
- Default to server components
- Use `'use client'` only for interactivity, browser APIs, or client-only libs
- Client components cannot import server components

## Data + API Conventions
- Prefer Server Components for reads
- Prefer Server Actions for mutations
- Use `route.ts` only for webhooks/external integrations
- API envelope: `{ success, data?, error?: { code, message }, meta? }`

## Environment Variables
- Access env only through `lib/env.ts`
- No raw `process.env` outside env module
- Keep secrets out of git

## Quality Gate
Before delivery, run `pnpm check` and ensure:
- build passes
- tests pass
- Biome passes
- no forbidden stack usage introduced
