# MongoDB 7 — Blueprints and Assets

    ## Phase D — Indexed deployment and implementation assets
    | Asset | Kind | Status | License / usage | Version | Notes |
|---|---|---|---|---|---|
| MongoDB 7.0 release notes | official release notes | indexed-only | MongoDB docs | 7.0 | Primary version line reference. |
| Official Docker image | container image | indexed-only | SSPL | 7.0 | Container baseline for self-hosting. |
| MongoDB exporter | monitoring blueprint | indexed-only | Apache-2.0 | current | Useful for Prometheus-based monitoring. |

    ## Adaptation notes for Codex
    - Prefer **official docs, official repo assets, and official examples** over community guides.
    - Treat every asset listed as **indexed-only unless explicitly downloaded**. Retrieve the exact file/version during implementation to avoid stale copies.
    - Re-check the upstream version and license at coding time before copying templates into Hylono repositories.
    - Use compose / Helm / starter repos as scaffolding, not as architecture truth; adapt them to Hylono’s existing Next.js 16, Auth.js, Postgres, n8n, Novu, and Stripe boundaries.