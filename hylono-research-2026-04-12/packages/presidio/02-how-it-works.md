# Presidio — How It Works

## Phase B — Core architecture
- **Runtime model:** Python services/libraries, optional REST services, recognizers, and NLP dependencies. [https://microsoft.github.io/presidio/, 2026-04-12, 2.2.362]
- **Main components:** Analyzer, anonymizer, recognizers, optional image/text pipelines, and REST services via Docker or Python. [https://github.com/microsoft/presidio/releases, 2026-04-12, 2.2.362]
- **Typical deployment model:** Often deployed as internal microservice or embedded library. Operational burden is moderate but narrower than full privacy platforms. [https://microsoft.github.io/presidio/, 2026-04-12, 2.2.362]
- **Runtime dependencies:** Python runtime, NLP models, containers if service-based, and integration to upstream text/data flows.
- **Primary data stores:** None inherently; it processes data in-flight.
- **Auth model:** Depends on how Hylono wraps it (internal service auth, API gateway, etc.).
- **API / integration surface:** Python library APIs and REST service endpoints.
- **Operational complexity:** **Medium**
- **Security / compliance considerations:** Useful for reducing privacy exposure, but should not be mistaken for complete governance or compliance tooling.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service. Keep the Hylono public site as the server-first customer surface and integrate through server-side API routes, webhooks, queued jobs, or SDKs.
- **Integration boundary:** Avoid rewriting the public site around this tool’s frontend unless the package explicitly says the tool should own that surface.
- **Blast-radius note:** Low to moderate; mostly a usefulness question.