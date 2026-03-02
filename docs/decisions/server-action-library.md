# ADR-SA-001: Standardize on next-safe-action for Server Actions
Status: Accepted | Date: 2026-03-01

## Context
The project runs on Next.js 16 App Router with strict TypeScript and server-first boundaries. Native Server Actions are flexible, but without a shared guardrail layer they can diverge in validation, error handling, and mutation invalidation behavior.

The FINAL_STACK remediation requires a documented decision for a server action library and implementation that is compatible with:

- strict schema validation (Zod)
- Server Action-only mutation boundaries
- cache invalidation semantics (`updateTag`, `revalidateTag`)
- predictable typed input/output contracts

## Decision
Adopt `next-safe-action` as the default abstraction for application-level Server Actions.

Implementation baseline:

- `lib/safe-action.ts` exports a shared `actionClient` created via `createSafeActionClient()`.
- New typed actions use `.inputSchema(...)` and `.action(...)`.
- Mutating actions must explicitly define cache invalidation behavior where relevant.

## Initial Adoption Scope

- Newsletter flow now includes a typed safe action (`submitNewsletterSafeAction`) with schema-validated input.
- Existing server action module (`src/actions/formActions.ts`) includes cache invalidation semantics for newsletter mutations.

## Consequences

### Positive

- Uniform validation and typed input contracts across server actions.
- Lower regression risk from ad-hoc form-data parsing.
- Clear extension point for auth/permissions middleware in future action pipelines.

### Trade-offs

- One additional abstraction layer over native Server Actions.
- Team must consistently use `actionClient` instead of introducing parallel patterns.

## Guardrails

- No raw `process.env` access in action implementations (use `lib/env.ts`).
- Keep mutation logic server-side; client components only invoke actions.
- Prefer explicit cache invalidation (`updateTag`, `revalidateTag`) for read-your-writes behavior.
