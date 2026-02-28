# Hylono Context (Next.js 16)

> Last updated: 2026-02-28 (Step 6.16)
> Canonical governance source: `.clinerules`

## Project Snapshot

Hylono is an EU-focused medtech ecommerce and education platform built on a server-first Next.js App Router architecture. The application supports rental-first and purchase journeys for non-invasive wellness technologies (oxygen/mHBOT, hydrogen, light, and signal modalities), with supporting content, checkout, account, and partner-facing workflows.

## Verified Stack

- Next.js 16.1.6 (App Router, Turbopack default)
- React 19.2.4
- React DOM 19.2.4
- TypeScript 5.8.x (strict)
- Prisma 7.x + PostgreSQL (Supabase)
- Tailwind CSS v4
- Vitest + Playwright

## Core Commands

- `pnpm dev` — Start Next.js dev server (Turbopack default)
- `pnpm build` — Production build
- `pnpm start` — Start production server
- `pnpm lint` — ESLint CLI (no `next lint`)
- `pnpm test` — Test suite
- `pnpm check` — Lint + build + test

## New/Current v16 Patterns

1. **Server-first by default**
   - `page.tsx` remains server component unless interactivity requires a separate `*Client.tsx` leaf.

2. **Async request APIs are mandatory**
   - `params`, `searchParams`, `cookies()`, `headers()`, and `draftMode()` must be awaited.

3. **Proxy boundary at project root**
   - `proxy.ts` is active and verified in build output (`ƒ Proxy (Middleware)`).

4. **Updated cache API naming**
   - Use stable `cacheLife` / `cacheTag` (no `unstable_` prefix).

5. **Tooling and runtime updates**
   - Turbopack is default in v16.
   - React Compiler is enabled (`reactCompiler: true`).
   - ESLint runs through direct CLI commands.

## Documentation Cross-References

- Upgrade progress ledger: `docs/upgrade-v16-progress.md`
- Migration inventory: `docs/migration-inventory.md`
- Live project state: `.agent/memory/project-state.md`
- Workspace rules and architecture guardrails: `.clinerules`
