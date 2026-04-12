# Snipe-IT — Blueprints and Assets

    ## Phase D — Indexed deployment and implementation assets
    | Asset | Kind | Status | License / usage | Version | Notes |
|---|---|---|---|---|---|
| Official docs | official docs | indexed-only | docs | v8.4.1 | Primary install/configuration guidance. |
| Official repo | source code | indexed-only | AGPL-3.0 | v8.4.1 | Primary code source. |
| Docker docs | deployment docs | indexed-only | docs | current | Useful for self-host deployment. |

    ## Adaptation notes for Codex
    - Prefer **official docs, official repo assets, and official examples** over community guides.
    - Treat every asset listed as **indexed-only unless explicitly downloaded**. Retrieve the exact file/version during implementation to avoid stale copies.
    - Re-check the upstream version and license at coding time before copying templates into Hylono repositories.
    - Use compose / Helm / starter repos as scaffolding, not as architecture truth; adapt them to Hylono’s existing Next.js 16, Auth.js, Postgres, n8n, Novu, and Stripe boundaries.