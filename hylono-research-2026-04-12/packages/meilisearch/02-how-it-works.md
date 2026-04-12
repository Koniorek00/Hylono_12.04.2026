# Meilisearch — How It Works

## Phase B — Core architecture
- **Runtime model:** Rust service with index storage, REST API, and API keys. [https://www.meilisearch.com/docs, 2026-04-12, v1.38.2]
- **Main components:** Search engine, indexes, API keys, optional sync/indexing pipelines, and front-end clients. [https://github.com/meilisearch/meilisearch/releases, 2026-04-12, v1.38.2]
- **Typical deployment model:** Operationally light compared with Elasticsearch-class systems. [https://www.meilisearch.com/docs, 2026-04-12, v1.38.2]
- **Runtime dependencies:** Persistent storage, indexing pipeline, API key governance, and monitoring.
- **Primary data stores:** Internal Meilisearch indexes.
- **Auth model:** Master/search/private API keys and tenant tokens.
- **API / integration surface:** REST search/index APIs and SDKs.
- **Operational complexity:** **Low to Medium**
- **Security / compliance considerations:** Protect master keys and avoid indexing sensitive internal data into public search endpoints.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service. Keep the Hylono public site as the server-first customer surface and integrate through server-side API routes, webhooks, queued jobs, or SDKs.
- **Integration boundary:** Avoid rewriting the public site around this tool’s frontend unless the package explicitly says the tool should own that surface.
- **Blast-radius note:** Low to moderate.