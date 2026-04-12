# Medusa — How It Works

## Phase B — Core architecture
- **Runtime model:** Node.js commerce engine with admin, APIs, database, workers/modules, and optional separate storefront. [https://docs.medusajs.com/, 2026-04-12, v2]
- **Main components:** Backend server, admin dashboard, PostgreSQL, Redis (depending on modules/workers), file storage, and a separate Next.js storefront or custom frontend. [https://github.com/medusajs/medusa/releases, 2026-04-12, v2.13.6]
- **Typical deployment model:** Self-host backend separately from the public site; use the official Next.js starter as reference, not a reason to refactor the whole public marketing app into a commerce monolith. [https://docs.medusajs.com/, 2026-04-12, v2]
- **Runtime dependencies:** PostgreSQL, optional Redis, storage provider, payment connectors (Stripe), search/indexing if scale grows, and admin/auth configuration.
- **Primary data stores:** PostgreSQL primary; optional Redis and external storage/search integrations.
- **Auth model:** Admin/customer auth model plus API keys and provider integrations.
- **API / integration surface:** REST/GraphQL-style commerce APIs, webhooks/events, admin APIs, storefront SDKs, payment/shipping integrations.
- **Operational complexity:** **Medium to High**
- **Security / compliance considerations:** Commerce systems hold customer/order/payment-adjacent data. Segment responsibilities, harden admin access, and verify tax/price/rental edge cases before rollout.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service. Keep the Hylono public site as the server-first customer surface and integrate through server-side API routes, webhooks, queued jobs, or SDKs.
- **Integration boundary:** Avoid rewriting the public site around this tool’s frontend unless the package explicitly says the tool should own that surface.
- **Blast-radius note:** Moderate to high because commerce replatforming can sprawl.