# Leihs — Overview

## Snapshot
- Environment context: **Phase 1A / STOPPED**
- Researched as: **Leihs equipment lending and inventory system**
- Current version researched: **7.13.0** — **CONFIRMED** [https://github.com/leihs/leihs, 2026-04-12, 7.13.0]
- License posture: **AGPL-3.0 (verify current repo before bundling code)** — **PARTLY VERIFIED** [https://github.com/leihs/leihs-instance, 2026-04-12, current]
- Recommended timing: **PRIORITY CANDIDATE FOR RENTAL OPERATIONS**
- Maintenance burden: **High**
- Risk level: **Medium**

## Phase A — App identity
- **What it is:** Open-source equipment booking, inventory, procurement, and lending system designed around loan workflows. [https://github.com/leihs/leihs-instance, 2026-04-12, current]
- **What it solves:** Reservation, lending, returns, inventory visibility, and operational tracking for equipment that moves between users. [https://github.com/leihs/leihs, 2026-04-12, 7.13.0]
- **Best-fit users:** Organizations managing loaner equipment, libraries, institutions, and structured lending workflows. [https://github.com/leihs/leihs-instance, 2026-04-12, current]
- **Where it fits in a modern stack:** Very strong conceptual fit for Hylono rental/access programs. It is materially closer to Hylono’s lending/rental reality than generic IT asset tools. [https://github.com/leihs/leihs/releases, 2026-04-12, 7.13.0]

## Hylono fit snapshot
- **Business usefulness:** Strong candidate to back rental/access programs, equipment availability, reservation states, and handoff/return operations. Could integrate with Next.js booking flows, CRM, notifications, and billing. [https://github.com/leihs/leihs, 2026-04-12, 7.13.0]
- **Overlap watch:** Preferred over Snipe-IT for lending/rental. Could overlap partly with custom booking flows or Fleetbase logistics later.
- **Must verify before implementation:** Confirm current API/integration surface, multilingual/customer-facing UX suitability, and whether Hylono wants Leihs as the rental source of truth or only as the back-office engine.