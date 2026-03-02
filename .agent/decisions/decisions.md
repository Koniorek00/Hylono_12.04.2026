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