# Twenty CRM — Overview

## Snapshot
- Environment context: **Phase 1A / RUNNING**
- Researched as: **Twenty open-source CRM**
- Current version researched: **v1.21.0** — **CONFIRMED** [https://github.com/twentyhq/twenty/releases, 2026-04-12, v1.21.0]
- License posture: **Mostly GPL-3.0 (verify repo licensing scope before bundling code)** — **CONFIRMED / scope review needed** [https://github.com/twentyhq/twenty, 2026-04-12, v1.21.0]
- Recommended timing: **KEEP AND DEEPEN INTEGRATION EARLY**
- Maintenance burden: **Medium**
- Risk level: **Medium**

## Phase A — App identity
- **What it is:** Open-source CRM focused on people, companies, opportunities, pipelines, tasks, and CRM customization. [https://github.com/twentyhq/twenty, 2026-04-12, v1.21.0]
- **What it solves:** Lead and account management, opportunity tracking, relationship context, activity history, and CRM workflow customization. [https://github.com/twentyhq/twenty/releases, 2026-04-12, v1.21.0]
- **Best-fit users:** Revenue teams, founders, operators, and engineering-led teams that want a self-hostable CRM with modern APIs and UI. [https://github.com/twentyhq/twenty, 2026-04-12, v1.21.0]
- **Where it fits in a modern stack:** High fit. Hylono already cares about Twenty integration, and it aligns well with lead capture, partnership tracking, booking-to-sales follow-up, and premium customer lifecycle management. [https://twenty.com/developers, 2026-04-12, current]

## Hylono fit snapshot
- **Business usefulness:** Strong touchpoints with Next.js contact/booking/rental flows, n8n for orchestration, Novu for notifications, Stripe/rental operations, and PostHog or Metabase for lifecycle analytics. [https://github.com/twentyhq/twenty/releases, 2026-04-12, v1.21.0]
- **Overlap watch:** Partial overlap with custom internal admin or lightweight lead tables in the site; Twenty should likely be the primary CRM rather than rebuilding CRM features in Next.js.
- **Must verify before implementation:** Define system-of-record boundaries: what lives in Twenty versus the Hylono core app database, and whether sales workflow customization should be done in CRM or automation layer.