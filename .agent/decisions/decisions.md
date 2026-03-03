# Decision Log

## Format
[DECISION-YYYY-MM-DD-NNN]: What | Why | Reverse if | Role | Tier

## Decisions

[DECISION-2026-02-15-001]: next-safe-action for Server Actions |
Type-safe validation + consistent error handling | If performance overhead >5ms p99 |
architect-orchestrator | T3

[DECISION-2026-02-20-002]: ISR with 1hr revalidation for /products |
Product data changes weekly, not realtime | If inventory goes real-time |
frontend-specialist | T2

[DECISION-2026-03-02-003]: Consolidate ghost memory artifacts into canonical v12 memory files |
`.clinerules` memory contracts are authoritative; ghost files create drift and stale guidance | If memory-system contract is redesigned with new canonical targets |
architect-orchestrator | T3

[DECISION-2026-03-02-004]: Archive non-canonical mode files into `.agent/modes/archive/` instead of deleting |
Preserves historical context while enforcing active-mode parity with `.clinerules § AGENT ROLES` | If archive volume becomes maintenance burden and historical value is exhausted |
architect-orchestrator | T3

[DECISION-2026-03-02-005]: Rename `api-design-zod-old-orm` skill directory to `api-design-zod-drizzle` |
Skill content is Drizzle-aligned; legacy ORM naming contradicted workspace guardrails and caused policy ambiguity | If workspace ORM policy changes from Drizzle-only |
architect-orchestrator | T3

[DECISION-2026-03-02-006]: Keep `src/generated/prisma-client/` for now and do not delete |
Static audit found one live import in `lib/rbac/permissions.ts` (`UserRole` from `../../src/generated/prisma-client`), so deletion would break type resolution; queued Drizzle migration handoff first | If that import is migrated to Drizzle-safe role types/enums and no remaining references exist |
backend-specialist | T2

[DECISION-2026-03-02-007]: Create system-architect governance layer (`.agent/modes/system-architect.md`, `.agent/skills/system-architect/SKILL.md`, `.agent/evolution/*`) |
User-provided implementation plan required a dedicated meta-agent and evolution workspace for system integrity cycles | If governance model is replaced by a different canonical system-management architecture |
skill-architect | T3

[DECISION-2026-03-02-012]: Canonicalize system skill path to `system-architect` and retire `system-architecture` |
User explicitly required a single authoritative invocation/maintenance target to prevent routing ambiguity and stale updates | If user defines a different canonical naming contract |
system-architect | T1

[DECISION-2026-03-02-008]: Adapt system-architect scan targets to real project paths (`app/`, `components/`, `lib/actions` optional) while preserving intent |
Workspace uses `app/` and `components/` roots (not `src/`) and has no `lib/db/schema.ts`; strict literal paths would create false-positive drift | If repository is migrated back to `src/` canonical layout and Drizzle schema file is introduced |
skill-architect | T3

[DECISION-2026-03-02-009]: Treat missing pnpm runtime as environment-blocked verification and create handoff instead of product/system workaround |
`pnpm` is unavailable in current shell, making mandatory checks non-executable; forcing alternate tooling would violate workspace command policy | If pnpm is restored in PATH and verification can run normally |
system-architect | T3

[DECISION-2026-03-02-010]: Apply system-architect hardening package v1.1.0 across mode/skill/evolution contracts |
User-provided fix spec requires structural safeguards (health formula, safe mode, integrity checks, failure classification, semantic checks, watchlist/metrics upgrades, role boundary) and explicit self-hardening cycle output | If user supersedes this governance model with a newer canonical hardening spec |
system-architect | T3

[DECISION-2026-03-02-011]: Normalize system verification runtime to allow `corepack pnpm` fallback when direct `pnpm` shim is unavailable |
Environment proved `pnpm` PATH shim can be absent while `corepack pnpm` is functional; fallback preserves pnpm-only policy and prevents false blocked cycles | If direct `pnpm` shim is consistently restored across all agent shells and fallback is no longer needed |
system-architect | T1

[DECISION-2026-03-03-013]: Add intent-level acceptance verification and Type E partial-success failure classification to system-architect contracts |
User-reported backup incident proved command exit success can mask scope failure; system must validate artifact scope + quantitative sanity before completion claims | If a stronger cross-role verification framework supersedes this rule set |
system-architect | T1