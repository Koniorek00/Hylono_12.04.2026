# Medusa — Overview

## Snapshot
- Environment context: **Phase 1A / STOPPED**
- Researched as: **Medusa commerce engine**
- Current version researched: **v2.13.6** — **CONFIRMED** [https://github.com/medusajs/medusa/releases, 2026-04-12, v2.13.6]
- License posture: **MIT** — **CONFIRMED** [https://docs.medusajs.com/, 2026-04-12, v2]
- Recommended timing: **LATER / CONDITIONAL**
- Maintenance burden: **High**
- Risk level: **Medium**

## Phase A — App identity
- **What it is:** Open-source commerce platform for carts, checkout, product catalog, orders, inventory, and admin workflows. [https://docs.medusajs.com/, 2026-04-12, v2]
- **What it solves:** Headless commerce backend when Hylono needs richer ecommerce than a marketing-focused Next.js site with basic Stripe checkout. [https://github.com/medusajs/medusa/releases, 2026-04-12, v2.13.6]
- **Best-fit users:** Commerce teams and engineering teams that want a self-hostable backend with custom storefronts and workflows. [https://docs.medusajs.com/, 2026-04-12, v2]
- **Where it fits in a modern stack:** Potentially strong, but conditional. Hylono already has Stripe and server-first Next.js. Medusa is only worth the complexity if product/catalog/order workflows outgrow the current custom site architecture. [https://github.com/medusajs/nextjs-starter-medusa, 2026-04-12, current]

## Hylono fit snapshot
- **Business usefulness:** Strong candidate if Hylono wants deeper catalog, bundles, inventory, and order workflows. Integrates with Stripe, PostHog, Novu, n8n, search, and internal analytics. [https://github.com/medusajs/medusa/releases, 2026-04-12, v2.13.6]
- **Overlap watch:** Overlaps with existing Stripe-powered custom flows; only adopt if Hylono needs a stronger commerce core.
- **Must verify before implementation:** Confirm whether current checkout/rental flows truly require a full commerce backend. Also verify whether rentals fit Medusa cleanly or need custom domain logic outside classic ecommerce.