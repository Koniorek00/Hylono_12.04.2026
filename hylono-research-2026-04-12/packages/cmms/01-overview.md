# CMMS — Overview

## Snapshot
- Environment context: **Phase 2 / UNKNOWN**
- Researched as: **Atlas CMMS / Grashjs CMMS [INFERRED]**
- Current version researched: **v1.4.0** — **CONFIRMED for Atlas CMMS target / app identity is INFERRED** [https://github.com/Grashjs/grash/releases, 2026-04-12, v1.4.0]
- License posture: **AGPL-3.0 and commercial** — **CONFIRMED for Atlas CMMS target** [https://github.com/Grashjs/grash, 2026-04-12, v1.4.0]
- Recommended timing: **CONDITIONAL / GOOD FOR SERVICE OPERATIONS**
- Maintenance burden: **Medium**
- Risk level: **Medium**

## Phase A — App identity
- **What it is:** Computerized maintenance management system for assets, preventive maintenance, work orders, and service records. [https://github.com/Grashjs/grash, 2026-04-12, v1.4.0]
- **What it solves:** Maintenance planning, asset service schedules, inspections, spare parts, and technician workflows. [https://github.com/Grashjs/grash/releases, 2026-04-12, v1.4.0]
- **Best-fit users:** Operations, facilities, service, and maintenance teams. [https://github.com/Grashjs/grash, 2026-04-12, v1.4.0]
- **Where it fits in a modern stack:** Useful if Hylono manages serviceable devices, refurbishment cycles, and field maintenance across rental inventory. Stronger fit as an operations tool than as a customer-facing system. [https://docs.atlascmms.com/, 2026-04-12, current]

## Hylono fit snapshot
- **Business usefulness:** Useful alongside Leihs for rental fleet maintenance, with n8n for service alerts and Novu for operational notifications. [https://github.com/Grashjs/grash/releases, 2026-04-12, v1.4.0]
- **Overlap watch:** Overlaps partly with Leihs asset records and Fleetbase operations, but is strongest specifically for maintenance.
- **Must verify before implementation:** Primary unresolved item: confirm that 'CMMS' in your inventory really means Atlas CMMS / Grashjs.