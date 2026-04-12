# Meilisearch — Risks and Caveats

## Phase E/F — Operational and compliance caveats
- **Primary risk:** Low to moderate.
- **Security posture note:** Protect master keys and avoid indexing sensitive internal data into public search endpoints.
- **Maintenance hotspot:** Reindexing strategy, ranking tuning, and index freshness matter.
- **Hidden complexity:** Indexing the wrong data, stale indexes, or exposing privileged search datasets.
- **EU / GDPR / health-data relevance:** Search indexes can duplicate personal data if not curated.

## Reasons to delay, narrow, or avoid
- If the app duplicates another tool in the stack, prefer the overlap-map recommendation instead of running both.
- If the app introduces a new datastore or new identity plane, force an explicit ownership decision before deployment.
- If the app can become a customer-data or signed-document source of truth, require restore tests and retention rules before launch.
- If the package says **UNVERIFIED** or **INFERRED**, re-check the target and current docs at implementation time.