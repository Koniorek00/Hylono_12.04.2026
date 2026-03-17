# Component Layer Policy (Canonical)

## Purpose

Define a single, predictable architecture for UI composition in the Next.js App Router workspace and prevent drift between legacy `components/` and modern `src/components/` paths.

## Canonical layering

### 1) Domain/legacy presentation layer — `components/`
- Contains large feature/page presentation modules that are still in active use.
- May include business-heavy UI compositions migrated from earlier architecture phases.
- Should not become the default destination for new shared primitives.

### 2) Canonical app layer — `src/components/`
- **Default location for new shared UI, layout shells, providers, hooks, and design-system aligned primitives.**
- Required for new cross-route reusable components.
- Required for new layout/provider boundary components.

### 3) Route composition layer — `app/**`
- Route entrypoints and thin route-level client wrappers only.
- Route wrappers may compose from either layer during migration, but new reusable logic belongs in `src/components/` or `src/lib/`.

## Placement rules

1. New reusable component used in 2+ routes → `src/components/`.
2. New route-only wrapper (`*Client.tsx`) → keep in `app/**` and delegate logic to shared helpers in `src/lib/` when possible.
3. Legacy `components/` files can be edited for bugfixes, but net-new shared patterns must be introduced in `src/components/`.
4. When touching legacy files, avoid copy/paste duplication; extract common logic into `src/lib/` or `src/components/`.

## Migration policy

- Migrate incrementally, not via massive rewrite.
- Priority order:
  1. shared navigation and interaction helpers,
  2. layout/provider shells,
  3. repeated UI primitives.
- Keep imports stable during migration; avoid breaking route contracts.

## Governance checks

- Registry (`.agent/registry/components.md`) must reflect server/client truth for touched components.
- PRs introducing duplicated route wrapper navigation logic should be rejected in favor of `src/lib/navigation.ts` helpers.
- New design primitives should be introduced only once in canonical layer.

## Runtime boundary terminology note (Next.js 16)

- Root `proxy.ts` is the **canonical** policy boundary for Arcjet/Nosecone request governance.
- Next.js build output may still label this section as "middleware" in logs.
- Treat that log wording as framework terminology only; do **not** introduce `middleware.ts`.
- If security policy changes are needed, update `proxy.ts` and related tests/docs only.
