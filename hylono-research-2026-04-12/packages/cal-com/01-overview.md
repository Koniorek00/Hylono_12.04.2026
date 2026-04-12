# Cal.com — Overview

## Snapshot
- Environment context: **Phase 1A / STOPPED**
- Researched as: **Cal.com scheduling platform**
- Current version researched: **v6.2.0** — **CONFIRMED** [https://github.com/calcom/cal.com/releases, 2026-04-12, v6.2.0]
- License posture: **AGPL-3.0 / commercial options** — **PARTLY VERIFIED** [https://cal.com/docs, 2026-04-12, current]
- Recommended timing: **EARLY HIGH-VALUE CANDIDATE**
- Maintenance burden: **Medium**
- Risk level: **Medium**

## Phase A — App identity
- **What it is:** Open-source scheduling platform for appointment booking, calendar sync, availability, and event-based booking flows. [https://cal.com/docs, 2026-04-12, current]
- **What it solves:** Booking pages, staff/resource availability, scheduling workflows, and customer self-service appointment selection. [https://github.com/calcom/cal.com/releases, 2026-04-12, v6.2.0]
- **Best-fit users:** Sales, support, clinics, service teams, and operators who need flexible booking flows. [https://cal.com/docs, 2026-04-12, current]
- **Where it fits in a modern stack:** High fit for consultations, onboarding calls, service bookings, demos, and potentially rental/support scheduling across the Hylono site. [https://github.com/calcom/cal.com, 2026-04-12, v6.2.0]

## Hylono fit snapshot
- **Business usefulness:** Excellent fit with Next.js booking flows, Novu reminders, n8n orchestration, Twenty CRM lead creation, Stripe-paid sessions if needed, and analytics. [https://github.com/calcom/cal.com/releases, 2026-04-12, v6.2.0]
- **Overlap watch:** Could overlap partly with custom booking flows in Next.js, but Cal.com is stronger for availability/scheduling logic.
- **Must verify before implementation:** Clarify whether Hylono wants Cal.com as the booking source of truth or just as an embedded scheduling surface fronting internal workflows.