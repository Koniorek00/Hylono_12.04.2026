# Redis 7 — Blueprints and Assets

    ## Phase D — Indexed deployment and implementation assets
    | Asset | Kind | Status | License / usage | Version | Notes |
|---|---|---|---|---|---|
| Official license page | license reference | indexed-only | n/a | 7.x/8.x | Critical human-review source for current licensing. |
| Redis official image | container image | indexed-only | see Redis licensing | 7.x | Baseline container artifact. |
| Redis exporter | monitoring blueprint | indexed-only | MIT | current | Useful for Prometheus/Grafana monitoring. |

    ## Adaptation notes for Codex
    - Prefer **official docs, official repo assets, and official examples** over community guides.
    - Treat every asset listed as **indexed-only unless explicitly downloaded**. Retrieve the exact file/version during implementation to avoid stale copies.
    - Re-check the upstream version and license at coding time before copying templates into Hylono repositories.
    - Use compose / Helm / starter repos as scaffolding, not as architecture truth; adapt them to Hylono’s existing Next.js 16, Auth.js, Postgres, n8n, Novu, and Stripe boundaries.