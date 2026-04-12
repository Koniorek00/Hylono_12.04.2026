# Comp AI — Blueprints and Assets

    ## Phase D — Indexed deployment and implementation assets
    | Asset | Kind | Status | License / usage | Version | Notes |
|---|---|---|---|---|---|
| Official repo | source code | indexed-only | AGPL-3.0 core/commercial ee | v1.72.2 observed | Primary code source. |
| Self-hosting doc | official docs | indexed-only | AGPL-3.0 | current | Primary deployment reference. |
| Releases | official releases | indexed-only | see repo | v1.72.2 observed | Version reference. |

    ## Adaptation notes for Codex
    - Prefer **official docs, official repo assets, and official examples** over community guides.
    - Treat every asset listed as **indexed-only unless explicitly downloaded**. Retrieve the exact file/version during implementation to avoid stale copies.
    - Re-check the upstream version and license at coding time before copying templates into Hylono repositories.
    - Use compose / Helm / starter repos as scaffolding, not as architecture truth; adapt them to Hylono’s existing Next.js 16, Auth.js, Postgres, n8n, Novu, and Stripe boundaries.