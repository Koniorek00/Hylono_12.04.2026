# Active Stack Verification Snapshot - 2026-04-12

This snapshot captures the current deploy-now set after reconciling:

- the April 12 research bundle
- the live repo compose/runtime footprint
- the current staged rollout shape

Use this file before adding more services to staging or production.

## Active First Wave

| Service | Repo state | Selected version or pin | License status | Recommendation | Status |
| --- | --- | --- | --- | --- | --- |
| PostgreSQL | running locally, core app fallback DB | repo-managed image build | acceptable | keep as the primary structured data plane | CONFIRMED |
| Redis | running locally, shared queue/cache | `7.4.8-alpine` | needs review because Redis 7 licensing still matters | keep for current workloads only | CONFIRMED |
| MongoDB | running locally, Novu dependency | `7.0.31` | needs review because SSPL applies | keep only for required apps | CONFIRMED |
| Uptime Kuma | running locally | `2.2.1` | acceptable | keep in first-wave observability | CONFIRMED |
| Kong | running locally | `3.8` currently pinned in repo envs | acceptable for OSS gateway use | keep as the deliberate HTTP boundary | CONFIRMED |
| Prometheus | running locally | `v2.55.1` currently pinned in repo envs | acceptable | keep for control-plane metrics and probes | CONFIRMED |
| Twenty CRM | running locally and wired to intake routes | `v1.21.0` | needs GPL review before deeper embedding/customization | keep and deepen integration early | CONFIRMED |
| Novu | running locally and wired to intake routes | `3.14.0` in compose | mixed open-core surface, verify before staged expansion | keep as notification orchestration | CONFIRMED |
| n8n | running locally and wired to intake routes | `2.15.1` repo pin | fair-code / sustainable-use review required | keep as orchestration only, not source of truth | CONFIRMED |

## Conditional Later

| Service | Why delayed | Status |
| --- | --- | --- |
| Cal.com | good fit, but booking source-of-truth still needs a clear decision | DELAYED |
| Documenso | signing workflow needs legal classification and retention rules first | DELAYED |
| Zitadel | valuable, but public-site auth migration is not approved; internal-tools-first remains the safer path | DELAYED |
| Metabase | high value after source systems stabilize and read-only analytics permissions are defined | DELAYED |
| Leihs | promising rental back-office engine, but rental system-of-record is not decided yet | DELAYED |

## Explicitly Not In First Wave

| Service | Reason | Status |
| --- | --- | --- |
| Medusa | overlaps with the current site and Stripe-driven flows without a proven commerce gap | DELAYED |
| Lago | billing source-of-truth would be premature without confirmed usage billing needs | DELAYED |
| Snipe-IT | internal asset tracking is not part of the live intake backbone | DELAYED |
| Listmonk | useful later for newsletters, but not part of the current operational backbone | DELAYED |
| Formbricks | useful later for bounded feedback, but not part of current revenue operations | DELAYED |

## Version Drift Notes

- The research bundle is directionally useful, but some versions conflict with current official release pages. Do not upgrade automatically just because the research bundle says so.
- Use current official release notes, official repos, and current deployment docs before changing a pinned service version.
- Keep `Documenso`, `Zitadel`, and `MinIO` out of automatic version-pinning until their release and licensing paths are re-verified for the intended deployment method.

## Go / No-Go

- GO for: reproducibility hardening, pinned image governance, backup/restore verification, staging-doc narrowing, and deeper testing of the existing `Next.js -> n8n/Twenty/Novu` intake path.
- NO-GO for: adding more first-wave services, moving public-site auth into a new IdP, or promoting billing/signing/rental tools without separate decision-log entries.
