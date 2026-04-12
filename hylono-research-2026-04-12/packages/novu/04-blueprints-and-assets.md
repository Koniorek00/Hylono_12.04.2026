# Novu — Blueprints and Assets

    ## Phase D — Indexed deployment and implementation assets
    | Asset | Kind | Status | License / usage | Version | Notes |
|---|---|---|---|---|---|
| Self-host overview | official docs | indexed-only | docs | current | Primary deployment guidance. |
| Official repo | source code | indexed-only | MIT core/open-core | v3.13.0 | Primary code source. |
| Webhook docs | integration docs | indexed-only | docs | current | Useful for event and workflow integration. |

    ## Adaptation notes for Codex
    - Prefer **official docs, official repo assets, and official examples** over community guides.
    - Treat every asset listed as **indexed-only unless explicitly downloaded**. Retrieve the exact file/version during implementation to avoid stale copies.
    - Re-check the upstream version and license at coding time before copying templates into Hylono repositories.
    - Use compose / Helm / starter repos as scaffolding, not as architecture truth; adapt them to Hylono’s existing Next.js 16, Auth.js, Postgres, n8n, Novu, and Stripe boundaries.