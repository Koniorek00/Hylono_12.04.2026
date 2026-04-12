# Wazuh — Overview

## Snapshot
- Environment context: **Phase 1C / UNKNOWN**
- Researched as: **Wazuh security platform**
- Current version researched: **v4.14.4** — **CONFIRMED** [https://github.com/wazuh/wazuh/releases, 2026-04-12, v4.14.4]
- License posture: **GPL-2.0** — **CONFIRMED** [https://documentation.wazuh.com/current/, 2026-04-12, v4.14.4]
- Recommended timing: **LATER / SECURITY-MATURITY DEPENDENT**
- Maintenance burden: **High**
- Risk level: **High**

## Phase A — App identity
- **What it is:** Open-source security platform / SIEM/XDR-style stack for log analysis, endpoint monitoring, integrity checks, and compliance use cases. [https://documentation.wazuh.com/current/, 2026-04-12, v4.14.4]
- **What it solves:** Security monitoring, alerting, endpoint telemetry, and central security visibility. [https://github.com/wazuh/wazuh/releases, 2026-04-12, v4.14.4]
- **Best-fit users:** Security and infrastructure teams operating many hosts/services. [https://documentation.wazuh.com/current/, 2026-04-12, v4.14.4]
- **Where it fits in a modern stack:** Useful later if Hylono’s self-hosted footprint grows enough to justify centralized security operations. Not a first-wave requirement. [https://github.com/wazuh/wazuh, 2026-04-12, v4.14.4]

## Hylono fit snapshot
- **Business usefulness:** Could later cover hosts running databases, gateways, app clusters, and critical services. [https://github.com/wazuh/wazuh/releases, 2026-04-12, v4.14.4]
- **Overlap watch:** Some overlap with cloud-native security monitoring, but broader self-host visibility if adopted.
- **Must verify before implementation:** Decide when Hylono’s infra/security maturity is ready for central security operations.