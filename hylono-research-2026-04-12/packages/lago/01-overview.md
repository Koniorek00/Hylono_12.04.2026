# Lago — Overview

## Snapshot
- Environment context: **Phase 1A / STOPPED**
- Researched as: **Lago billing and metering platform**
- Current version researched: **v1.45.1** — **CONFIRMED** [https://github.com/getlago/lago/releases, 2026-04-12, v1.45.1]
- License posture: **AGPL-3.0 / open-core style review recommended** — **PARTLY VERIFIED** [https://docs.getlago.com/, 2026-04-12, current]
- Recommended timing: **LATER / CONDITIONAL**
- Maintenance burden: **High**
- Risk level: **High**

## Phase A — App identity
- **What it is:** Open-source billing, metering, subscriptions, invoicing, and usage-based pricing platform. [https://docs.getlago.com/, 2026-04-12, current]
- **What it solves:** Usage metering, recurring billing logic, invoices, credits, pricing plans, and finance-facing billing operations that are cumbersome to build from scratch. [https://github.com/getlago/lago/releases, 2026-04-12, v1.45.1]
- **Best-fit users:** SaaS/product operators and finance/ops teams that need sophisticated billing beyond direct Stripe checkout. [https://docs.getlago.com/, 2026-04-12, current]
- **Where it fits in a modern stack:** Potentially useful if Hylono introduces memberships, device access plans, protocol subscriptions, or usage-based/rental billing complexity. For straightforward Stripe commerce it may be heavier than needed. [https://github.com/getlago/lago, 2026-04-12, v1.45.1]

## Hylono fit snapshot
- **Business usefulness:** Could connect to Stripe, Next.js checkout/rental APIs, n8n automation, Twenty CRM account data, Novu notifications, and Metabase finance reporting. [https://github.com/getlago/lago/releases, 2026-04-12, v1.45.1]
- **Overlap watch:** Overlaps partly with Stripe Billing and Invoice Ninja/Akaunting depending on scope.
- **Must verify before implementation:** Define whether Hylono actually needs usage/subscription billing beyond current Stripe capabilities. Decide whether Lago or Invoice Ninja should own invoice generation if both are present.