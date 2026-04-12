# Invoice Ninja — Overview

## Snapshot
- Environment context: **Phase 2 / UNKNOWN**
- Researched as: **Invoice Ninja invoicing and payments platform**
- Current version researched: **v5.13.10** — **CONFIRMED** [https://github.com/invoiceninja/invoiceninja/releases, 2026-04-12, v5.13.10]
- License posture: **Elastic License / source-available mix; verify current terms before bundling** — **PARTLY VERIFIED** [https://invoiceninja.github.io/, 2026-04-12, v5]
- Recommended timing: **PRIMARY INVOICING CANDIDATE IF NEEDED**
- Maintenance burden: **Medium**
- Risk level: **Medium**

## Phase A — App identity
- **What it is:** Open-source-first invoicing, quotes, payments, client portal, and expense tracking platform. [https://invoiceninja.github.io/, 2026-04-12, v5]
- **What it solves:** Client-facing invoices, quotes, payment links, reminders, and light business-finance workflows without implementing a custom invoicing layer. [https://github.com/invoiceninja/invoiceninja/releases, 2026-04-12, v5.13.10]
- **Best-fit users:** Small businesses, agencies, and operators who need invoicing and collections without a full ERP. [https://invoiceninja.github.io/, 2026-04-12, v5]
- **Where it fits in a modern stack:** Good fit if Hylono needs polished invoices/quotes outside pure Stripe receipts. Stronger direct fit than Akaunting for client-facing invoicing and quote workflows. [https://github.com/invoiceninja/invoiceninja, 2026-04-12, v5.13.10]

## Hylono fit snapshot
- **Business usefulness:** Good fit for quotes, pro forma invoices, recurring invoices, and finance portal workflows. Can integrate with Stripe, n8n, CRM, and Metabase. [https://github.com/invoiceninja/invoiceninja/releases, 2026-04-12, v5.13.10]
- **Overlap watch:** Preferred over Akaunting for focused invoicing/quotes/payments in this stack.
- **Must verify before implementation:** Decide whether Hylono needs separate invoicing/quote workflows beyond Stripe and whether Invoice Ninja or Lago should own invoices if both exist.