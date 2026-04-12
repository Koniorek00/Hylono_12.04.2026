# Prometheus — Overview

## Snapshot
- Environment context: **Phase 2 / UNKNOWN**
- Researched as: **Prometheus monitoring system**
- Current version researched: **v3.11.1** — **CONFIRMED** [https://github.com/prometheus/prometheus/releases, 2026-04-12, v3.11.1]
- License posture: **Apache-2.0** — **CONFIRMED** [https://prometheus.io/docs/introduction/overview/, 2026-04-12, v3.11.1]
- Recommended timing: **DEPLOY IN OBSERVABILITY WAVE**
- Maintenance burden: **Medium**
- Risk level: **Medium**

## Phase A — App identity
- **What it is:** Metrics collection, storage, alerting, and query platform for infrastructure and application observability. [https://prometheus.io/docs/introduction/overview/, 2026-04-12, v3.11.1]
- **What it solves:** Infrastructure/app metrics, alerting rules, and time-series visibility across self-hosted services. [https://github.com/prometheus/prometheus/releases, 2026-04-12, v3.11.1]
- **Best-fit users:** Ops and engineering teams running services that need real observability. [https://prometheus.io/docs/introduction/overview/, 2026-04-12, v3.11.1]
- **Where it fits in a modern stack:** Strong fit. Hylono’s stack is large enough that a real metrics layer is justified, especially if self-hosted apps grow. [https://github.com/prometheus/prometheus, 2026-04-12, v3.11.1]

## Hylono fit snapshot
- **Business usefulness:** Backbone for monitoring databases, Kong, app services, n8n, Novu, and infrastructure. [https://github.com/prometheus/prometheus/releases, 2026-04-12, v3.11.1]
- **Overlap watch:** Complements Uptime Kuma rather than replacing it.
- **Must verify before implementation:** Decide whether a simple initial stack is Prometheus + Grafana + exporters + Uptime Kuma, and which services are tier-0.