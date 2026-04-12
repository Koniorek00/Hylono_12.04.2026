# Metabase — Overview

## Snapshot
- Environment context: **Phase 2 / UNKNOWN**
- Researched as: **Metabase analytics and BI platform**
- Current version researched: **v0.59.5** — **CONFIRMED** [https://github.com/metabase/metabase/releases, 2026-04-12, v0.59.5]
- License posture: **AGPL-3.0 / enterprise layers available** — **PARTLY VERIFIED** [https://www.metabase.com/docs/latest/, 2026-04-12, v0.59.5]
- Recommended timing: **HIGH-VALUE INTERNAL ANALYTICS TOOL**
- Maintenance burden: **Medium**
- Risk level: **Medium**

## Phase A — App identity
- **What it is:** Business intelligence and dashboarding platform for querying databases, building charts, and sharing internal analytics. [https://www.metabase.com/docs/latest/, 2026-04-12, v0.59.5]
- **What it solves:** Self-service reporting for operations, sales, bookings, rentals, finance, and product analytics outside product-embedded dashboards. [https://github.com/metabase/metabase/releases, 2026-04-12, v0.59.5]
- **Best-fit users:** Operators, analysts, finance, and business teams who need database-backed dashboards. [https://www.metabase.com/docs/latest/, 2026-04-12, v0.59.5]
- **Where it fits in a modern stack:** Strong fit for internal business analytics across Hylono’s growing operational systems. [https://github.com/metabase/metabase, 2026-04-12, v0.59.5]

## Hylono fit snapshot
- **Business usefulness:** Excellent for reporting on CRM, bookings, billing, rental operations, and operational KPIs. Pair with Twenty, Lago, Postgres, and other app DBs. [https://github.com/metabase/metabase/releases, 2026-04-12, v0.59.5]
- **Overlap watch:** Some overlap with PostHog for product analytics, but Metabase is broader business reporting.
- **Must verify before implementation:** Decide which source systems become analytics sources and whether derived reporting DBs are needed later.