# Jitsi — Blueprints and Assets

    ## Phase D — Indexed deployment and implementation assets
    | Asset | Kind | Status | License / usage | Version | Notes |
|---|---|---|---|---|---|
| Official handbook | official docs | indexed-only | Apache-2.0 ecosystem | stable-10888 | Primary docs source. |
| Official docker repo | deployment repo | indexed-only | Apache-2.0 ecosystem | stable-10888 | Primary self-host deployment source. |
| Releases | official releases | indexed-only | see project | stable-10888 | Version source. |

    ## Adaptation notes for Codex
    - Prefer **official docs, official repo assets, and official examples** over community guides.
    - Treat every asset listed as **indexed-only unless explicitly downloaded**. Retrieve the exact file/version during implementation to avoid stale copies.
    - Re-check the upstream version and license at coding time before copying templates into Hylono repositories.
    - Use compose / Helm / starter repos as scaffolding, not as architecture truth; adapt them to Hylono’s existing Next.js 16, Auth.js, Postgres, n8n, Novu, and Stripe boundaries.