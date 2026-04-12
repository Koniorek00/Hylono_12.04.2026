# RefRef — Blueprints and Assets

    ## Phase D — Indexed deployment and implementation assets
    | Asset | Kind | Status | License / usage | Version | Notes |
|---|---|---|---|---|---|
| Official repo | source code | indexed-only | AGPL-3.0 | current alpha | Primary code source. |
| Self-host docs | docs in repo | indexed-only | AGPL-3.0 | current | Deployment and project docs live in repo. |
| Releases page | release state | indexed-only | AGPL-3.0 | no stable releases observed | Signals maturity risk. |

    ## Adaptation notes for Codex
    - Prefer **official docs, official repo assets, and official examples** over community guides.
    - Treat every asset listed as **indexed-only unless explicitly downloaded**. Retrieve the exact file/version during implementation to avoid stale copies.
    - Re-check the upstream version and license at coding time before copying templates into Hylono repositories.
    - Use compose / Helm / starter repos as scaffolding, not as architecture truth; adapt them to Hylono’s existing Next.js 16, Auth.js, Postgres, n8n, Novu, and Stripe boundaries.