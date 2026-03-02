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