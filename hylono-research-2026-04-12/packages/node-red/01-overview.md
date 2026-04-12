# Node-RED — Overview

## Snapshot
- Environment context: **Phase 2 / UNKNOWN**
- Researched as: **Node-RED flow-based programming platform**
- Current version researched: **4.1.8** — **CONFIRMED** [https://github.com/node-red/node-red/releases, 2026-04-12, 4.1.8]
- License posture: **Apache-2.0** — **CONFIRMED** [https://nodered.org/docs/, 2026-04-12, 4.1.8]
- Recommended timing: **LATER / IOT-SPECIFIC**
- Maintenance burden: **Low to Medium**
- Risk level: **Medium**

## Phase A — App identity
- **What it is:** Flow-based programming and automation platform with strong IoT, MQTT, and message-routing heritage. [https://nodered.org/docs/, 2026-04-12, 4.1.8]
- **What it solves:** Event routing, protocol bridging, device automation, MQTT-driven workflows, and low-code integrations. [https://github.com/node-red/node-red/releases, 2026-04-12, 4.1.8]
- **Best-fit users:** IoT, OT, and integration teams that need visual event/message flows. [https://nodered.org/docs/, 2026-04-12, 4.1.8]
- **Where it fits in a modern stack:** Useful later if Hylono builds device telemetry or MQTT-heavy workflows. For current business/process automation, n8n is the better default. [https://github.com/node-red/node-red, 2026-04-12, 4.1.8]

## Hylono fit snapshot
- **Business usefulness:** Best fit with Mosquitto, ThingsBoard, device telemetry, and protocol bridges. Limited need for pure business automation if n8n is already core. [https://github.com/node-red/node-red/releases, 2026-04-12, 4.1.8]
- **Overlap watch:** n8n should remain the default for business workflows; Node-RED is for IoT/protocol-heavy use cases.
- **Must verify before implementation:** Confirm whether device/IoT workflows are near-term enough to justify Node-RED beside n8n.