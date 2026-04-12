# Gorse — How It Works

## Phase B — Core architecture
- **Runtime model:** Go services with cache/storage dependencies and recommendation APIs. [https://gorse.io/docs/, 2026-04-12, v0.5.5]
- **Main components:** Master, worker, server, data store, cache, and recommendation models. [https://github.com/gorse-io/gorse/releases, 2026-04-12, v0.5.5]
- **Typical deployment model:** Self-host is feasible but adds data and relevance-tuning burden. [https://gorse.io/docs/, 2026-04-12, v0.5.5]
- **Runtime dependencies:** Datastore, cache, event data, and recommendation-quality evaluation.
- **Primary data stores:** Databases/caches for feedback, items, and recommendation state.
- **Auth model:** API/service auth patterns; verify current deployment model.
- **API / integration surface:** Recommendation APIs and data import APIs.
- **Operational complexity:** **Medium**
- **Security / compliance considerations:** Main risk is data quality and recommendation misuse rather than infrastructure exposure.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service. Keep the Hylono public site as the server-first customer surface and integrate through server-side API routes, webhooks, queued jobs, or SDKs.
- **Integration boundary:** Avoid rewriting the public site around this tool’s frontend unless the package explicitly says the tool should own that surface.
- **Blast-radius note:** Moderate low-priority complexity.