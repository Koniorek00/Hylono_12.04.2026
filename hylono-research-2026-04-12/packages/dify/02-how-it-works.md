# Dify — How It Works

## Phase B — Core architecture
- **Runtime model:** Multi-service platform with web app, API, workers, vector/relational stores, object storage, and model-provider integrations. [https://docs.dify.ai/, 2026-04-12, v1.13.3]
- **Main components:** App builder, knowledge base/RAG, workers, model connectors, databases, storage, and API surfaces. [https://github.com/langgenius/dify/releases, 2026-04-12, v1.13.3]
- **Typical deployment model:** Self-host quick-start and Helm charts exist, but production adds significant model/vector/storage considerations. [https://docs.dify.ai/, 2026-04-12, v1.13.3]
- **Runtime dependencies:** Databases, caches, object storage, model provider keys, possible vector store, and observability.
- **Primary data stores:** Relational DB, caches, storage, and optional vector/database components.
- **Auth model:** Workspace/user auth and API keys.
- **API / integration surface:** LLM app APIs, workflows, knowledge base, and model integration surfaces.
- **Operational complexity:** **High**
- **Security / compliance considerations:** Prompt/input data, knowledge bases, and provider keys require strong governance and privacy controls.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service. Keep the Hylono public site as the server-first customer surface and integrate through server-side API routes, webhooks, queued jobs, or SDKs.
- **Integration boundary:** Avoid rewriting the public site around this tool’s frontend unless the package explicitly says the tool should own that surface.
- **Blast-radius note:** High complexity if used prematurely.