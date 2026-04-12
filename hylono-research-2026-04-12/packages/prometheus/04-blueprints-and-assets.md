# Prometheus — Blueprints and Assets

    ## Phase D — Indexed deployment and implementation assets
    | Asset | Kind | Status | License / usage | Version | Notes |
|---|---|---|---|---|---|
| Official docs | official docs | indexed-only | Apache-2.0 | v3.11.1 | Primary docs and architecture intro. |
| Official repo | source code | indexed-only | Apache-2.0 | v3.11.1 | Primary code source. |
| Docker image | container image | indexed-only | Apache-2.0 | v3.11.1 | Common deployment artifact. |

    ## Adaptation notes for Codex
    - Prefer **official docs, official repo assets, and official examples** over community guides.
    - Treat every asset listed as **indexed-only unless explicitly downloaded**. Retrieve the exact file/version during implementation to avoid stale copies.
    - Re-check the upstream version and license at coding time before copying templates into Hylono repositories.
    - Use compose / Helm / starter repos as scaffolding, not as architecture truth; adapt them to Hylono’s existing Next.js 16, Auth.js, Postgres, n8n, Novu, and Stripe boundaries.