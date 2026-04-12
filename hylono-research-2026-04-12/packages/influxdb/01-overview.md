# InfluxDB — Overview

## Snapshot
- Environment context: **Phase 1B / UNKNOWN**
- Researched as: **InfluxDB 3 Core**
- Current version researched: **3.9.0 Core** — **CONFIRMED** [https://docs.influxdata.com/influxdb3/core/, 2026-04-12, 3.9.0]
- License posture: **MIT/Apache mix depending on components; verify current packaging** — **PARTLY VERIFIED** [https://github.com/influxdata/influxdb, 2026-04-12, 3.9.0]
- Recommended timing: **LATER / IF TIME-SERIES NEEDS BECOME REAL**
- Maintenance burden: **Medium**
- Risk level: **Medium**

## Phase A — App identity
- **What it is:** Time-series database for metrics, events, and telemetry workloads. [https://github.com/influxdata/influxdb, 2026-04-12, 3.9.0]
- **What it solves:** High-cardinality time-series storage, device telemetry, and operational event analytics. [https://docs.influxdata.com/influxdb3/core/, 2026-04-12, 3.9.0]
- **Best-fit users:** IoT, observability, and analytics teams. [https://github.com/influxdata/influxdb, 2026-04-12, 3.9.0]
- **Where it fits in a modern stack:** Useful only if Hylono needs device telemetry or a distinct time-series store beyond Prometheus/ClickHouse/Postgres. [https://www.influxdata.com/products/influxdb/, 2026-04-12, 3 Core]

## Hylono fit snapshot
- **Business usefulness:** Useful with device telemetry, Grafana, and IoT stack; not a first-wave business-system dependency. [https://docs.influxdata.com/influxdb3/core/, 2026-04-12, 3.9.0]
- **Overlap watch:** May overlap with Prometheus or Postgres-based event storage for smaller workloads.
- **Must verify before implementation:** Clarify whether Prometheus alone covers observability and whether device telemetry is near-term.