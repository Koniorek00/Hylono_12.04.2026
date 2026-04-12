# Grafana — Overview

## Snapshot
- Environment context: **Phase 1B / UNKNOWN**
- Researched as: **Grafana**
- Current version researched: **12.4.2** — **CONFIRMED** [https://github.com/grafana/grafana/releases, 2026-04-12, 12.4.2]
- License posture: **AGPL-3.0 / enterprise offerings available** — **CONFIRMED** [https://grafana.com/docs/grafana/latest/, 2026-04-12, 12.4.2]
- Recommended timing: **DEPLOY WITH OBSERVABILITY STACK**
- Maintenance burden: **Medium**
- Risk level: **Medium**

## Phase A — App identity
- **What it is:** Visualization and observability UI platform for dashboards, alerts, logs, and multiple data sources. [https://grafana.com/docs/grafana/latest/, 2026-04-12, 12.4.2]
- **What it solves:** Operational dashboards, metrics visualization, logs/traces integration, and shared visibility across technical systems. [https://github.com/grafana/grafana/releases, 2026-04-12, 12.4.2]
- **Best-fit users:** Ops, engineering, and technical stakeholders. [https://grafana.com/docs/grafana/latest/, 2026-04-12, 12.4.2]
- **Where it fits in a modern stack:** Strong fit as the main observability UI once Prometheus and other telemetry sources exist. [https://github.com/grafana/grafana, 2026-04-12, 12.4.2]

## Hylono fit snapshot
- **Business usefulness:** Natural fit with Prometheus, Postgres exporters, Kong, Redis, and infrastructure monitoring. [https://github.com/grafana/grafana/releases, 2026-04-12, 12.4.2]
- **Overlap watch:** Complements rather than replaces Prometheus/Uptime Kuma.
- **Must verify before implementation:** Choose whether dashboards are provisioned as code from day one.