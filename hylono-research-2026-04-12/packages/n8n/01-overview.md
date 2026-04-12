# n8n — Overview

## Snapshot
- Environment context: **Phase 1A / STOPPED**
- Researched as: **n8n workflow automation platform**
- Current version researched: **2.15.1 stable (2.16.0 prerelease observed)** — **CONFIRMED** [https://docs.n8n.io/, 2026-04-12, 2.15.1]
- License posture: **Sustainable Use License / fair-code style; review before bundling or redistribution** — **CONFIRMED** [https://github.com/n8n-io/n8n/releases, 2026-04-12, 2.15.1]
- Recommended timing: **CORE EARLY AUTOMATION LAYER**
- Maintenance burden: **Medium**
- Risk level: **Medium**

## Phase A — App identity
- **What it is:** Workflow automation platform for API orchestration, webhooks, ETL-style workflows, integrations, and agentic automations. [https://github.com/n8n-io/n8n/releases, 2026-04-12, 2.15.1]
- **What it solves:** Low-code/high-flexibility automation across webhooks, SaaS APIs, internal apps, queues, and scheduled tasks without hardcoding every integration into the site. [https://docs.n8n.io/, 2026-04-12, 2.15.1]
- **Best-fit users:** Ops, growth, engineering, and integration teams that need fast automation and event choreography. [https://github.com/n8n-io/n8n/releases, 2026-04-12, 2.15.1]
- **Where it fits in a modern stack:** Very high fit. Hylono already cares about n8n integration, and it is the natural glue between Next.js APIs, Twenty, Novu, Stripe, Cal.com, documents, and internal admin tooling. [https://github.com/n8n-io/n8n, 2026-04-12, 2.15.1]

## Hylono fit snapshot
- **Business usefulness:** First-class fit with Next.js routes, Stripe, Resend, Novu, Twenty, Cal.com, Documenso, Lago, PostHog, Slack/internal alerts, and future AI/ops flows. [https://docs.n8n.io/, 2026-04-12, 2.15.1]
- **Overlap watch:** Overlaps with Node-RED for automation; n8n is the better default for business/system workflows in this stack.
- **Must verify before implementation:** Define clear system boundaries: which automations stay in n8n versus in application code. Decide who owns workflow review and credential governance.