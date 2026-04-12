# Temporal — Overview

## Snapshot
- Environment context: **Phase 1C / UNKNOWN**
- Researched as: **Temporal workflow orchestration platform**
- Current version researched: **v1.30.3** — **CONFIRMED** [https://github.com/temporalio/temporal/releases, 2026-04-12, v1.30.3]
- License posture: **MIT / mixed ecosystem licenses** — **PARTLY VERIFIED** [https://docs.temporal.io/, 2026-04-12, current]
- Recommended timing: **LATE / ONLY FOR TRUE DURABLE-WORKFLOW NEEDS**
- Maintenance burden: **High**
- Risk level: **High**

## Phase A — App identity
- **What it is:** Durable workflow orchestration platform for long-running, retryable, stateful business processes in code. [https://docs.temporal.io/, 2026-04-12, current]
- **What it solves:** Reliable orchestration of multi-step business processes that must survive retries, outages, and long waits. [https://github.com/temporalio/temporal/releases, 2026-04-12, v1.30.3]
- **Best-fit users:** Engineering teams building complex, durable workflows in code. [https://docs.temporal.io/, 2026-04-12, current]
- **Where it fits in a modern stack:** Powerful but easy to over-adopt. Hylono should start with n8n and app-native workflows; Temporal becomes interesting only when business-critical long-running workflows outgrow those tools. [https://github.com/temporalio/temporal, 2026-04-12, v1.30.3]

## Hylono fit snapshot
- **Business usefulness:** Could eventually power long-running rental/service/billing workflows in code, but not before n8n/app code hits limits. [https://github.com/temporalio/temporal/releases, 2026-04-12, v1.30.3]
- **Overlap watch:** Partial overlap with n8n and application job queues, but at a different sophistication level.
- **Must verify before implementation:** Identify actual workflows that require Temporal-grade durability and code orchestration.