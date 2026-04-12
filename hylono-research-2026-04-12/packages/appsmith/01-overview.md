# Appsmith — Overview

## Snapshot
- Environment context: **Phase 2 / UNKNOWN**
- Researched as: **Appsmith internal tools platform**
- Current version researched: **v1.98** — **CONFIRMED** [https://github.com/appsmithorg/appsmith/releases, 2026-04-12, v1.98]
- License posture: **Apache-2.0 / enterprise extensions exist** — **PARTLY VERIFIED** [https://docs.appsmith.com/, 2026-04-12, current]
- Recommended timing: **HIGH-VALUE INTERNAL TOOLING CANDIDATE**
- Maintenance burden: **Medium**
- Risk level: **Medium**

## Phase A — App identity
- **What it is:** Low-code platform for building internal tools, dashboards, CRUD apps, and operator consoles. [https://docs.appsmith.com/, 2026-04-12, current]
- **What it solves:** Rapid internal tooling without shipping every admin surface into the customer-facing Next.js codebase. [https://github.com/appsmithorg/appsmith/releases, 2026-04-12, v1.98]
- **Best-fit users:** Ops, support, engineering, and business teams needing internal interfaces over data and APIs. [https://docs.appsmith.com/, 2026-04-12, current]
- **Where it fits in a modern stack:** Strong fit. Hylono will likely need internal admin/ops tools, and Appsmith can absorb that need without bloating the public site. [https://github.com/appsmithorg/appsmith, 2026-04-12, v1.98]

## Hylono fit snapshot
- **Business usefulness:** Excellent for internal CRM/rental/ops dashboards over Twenty, Postgres, APIs, and workflow systems. [https://github.com/appsmithorg/appsmith/releases, 2026-04-12, v1.98]
- **Overlap watch:** Overlaps with building custom internal admin UIs in Next.js; Appsmith is faster for many internal ops surfaces.
- **Must verify before implementation:** Decide which internal tools should live in Appsmith versus custom Next.js admin surfaces.