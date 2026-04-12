# PostHog — Overview

## Snapshot
- Environment context: **Phase 2 / ALREADY IN STACK**
- Researched as: **PostHog product analytics platform**
- Current version researched: **Current self-host docs reviewed; exact monorepo server version intentionally left UNVERIFIED** — **CONFIRMED product state / exact version UNVERIFIED** [https://posthog.com/docs/self-host, 2026-04-12, current]
- License posture: **MIT / open-core mix depending on components; verify current packaging as needed** — **PARTLY VERIFIED** [https://github.com/PostHog/posthog, 2026-04-12, current]
- Recommended timing: **KEEP CURRENT USE; AVOID SELF-HOST REPLATFORM UNLESS REQUIRED**
- Maintenance burden: **High**
- Risk level: **Medium**

## Phase A — App identity
- **What it is:** Product analytics, feature flags, session replay, experiments, and data warehouse-ish product instrumentation platform. [https://github.com/PostHog/posthog, 2026-04-12, current]
- **What it solves:** Event analytics, funnels, experiments, feature flags, user behavior analysis, and product instrumentation. [https://posthog.com/docs/self-host, 2026-04-12, current]
- **Best-fit users:** Product, growth, and engineering teams. [https://github.com/PostHog/posthog, 2026-04-12, current]
- **Where it fits in a modern stack:** Already in Hylono’s stack and high value. The key question is not adoption but deployment posture: official guidance still positions self-hosting as more advanced/beta while cloud is preferred. [https://posthog.com/docs, 2026-04-12, current]

## Hylono fit snapshot
- **Business usefulness:** Already integrated with the Next.js site. Also useful for feature flags, lifecycle analytics, and internal admin/product instrumentation. [https://posthog.com/docs/self-host, 2026-04-12, current]
- **Overlap watch:** Some overlap with Formbricks for feedback and with Metabase for reporting, but PostHog remains the product analytics anchor.
- **Must verify before implementation:** Confirm whether current managed PostHog already satisfies EU/data and feature requirements. If yes, do not replatform lightly.