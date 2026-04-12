# Novu — Overview

## Snapshot
- Environment context: **Phase 1A / RUNNING**
- Researched as: **Novu notification infrastructure platform**
- Current version researched: **Platform v3.13.0 observed; JS SDK v3.14.0 also current** — **CONFIRMED** [https://github.com/novuhq/novu/releases, 2026-04-12, v3.13.0]
- License posture: **MIT core with commercial/open-core enterprise layers** — **CONFIRMED** [https://docs.novu.co/platform/self-hosting/overview, 2026-04-12, current]
- Recommended timing: **KEEP AND HARDEN EARLY**
- Maintenance burden: **Medium**
- Risk level: **Medium**

## Phase A — App identity
- **What it is:** Notification infrastructure platform for email, SMS, push, in-app, and chat notifications with workflows, providers, and templates. [https://docs.novu.co/platform/self-hosting/overview, 2026-04-12, current]
- **What it solves:** Centralized transactional notification orchestration, provider abstraction, templates, preference handling, and event-driven workflow logic. [https://github.com/novuhq/novu/releases, 2026-04-12, v3.13.0]
- **Best-fit users:** Product teams and platform teams that want one notification layer rather than bespoke channel logic in every application. [https://docs.novu.co/platform/self-hosting/overview, 2026-04-12, current]
- **Where it fits in a modern stack:** Very high fit. Hylono already uses Novu, and it aligns with booking events, checkout updates, rental lifecycle messaging, service reminders, support notifications, and internal ops alerts. [https://github.com/novuhq/novu, 2026-04-12, v3.13.0]

## Hylono fit snapshot
- **Business usefulness:** Direct fit with Next.js API routes, Stripe events, rental flows, Cal.com bookings, CRM updates, n8n workflows, and operational alerting. [https://github.com/novuhq/novu/releases, 2026-04-12, v3.13.0]
- **Overlap watch:** Overlaps with direct Resend sends, basic n8n notifications, Listmonk campaigns, and Mautic journeys, but Novu should remain the transactional notification backbone.
- **Must verify before implementation:** Define which notifications stay in Novu versus Resend-only direct sends, and whether customer preferences live in Novu, the site database, or both.