# Mosquitto — Overview

## Snapshot
- Environment context: **Phase 1B / UNKNOWN**
- Researched as: **Eclipse Mosquitto MQTT broker**
- Current version researched: **v2.1.2** — **CONFIRMED** [https://github.com/eclipse-mosquitto/mosquitto/releases, 2026-04-12, v2.1.2]
- License posture: **EPL/EDL** — **CONFIRMED** [https://mosquitto.org/documentation/, 2026-04-12, v2.1.2]
- Recommended timing: **DEFER UNTIL MQTT IS NEEDED**
- Maintenance burden: **Low to Medium**
- Risk level: **High**

## Phase A — App identity
- **What it is:** Lightweight MQTT broker for device messaging and pub/sub communication. [https://mosquitto.org/documentation/, 2026-04-12, v2.1.2]
- **What it solves:** MQTT transport for IoT devices, local brokers, event buses, and low-overhead message routing. [https://github.com/eclipse-mosquitto/mosquitto/releases, 2026-04-12, v2.1.2]
- **Best-fit users:** IoT, OT, and integration teams. [https://mosquitto.org/documentation/, 2026-04-12, v2.1.2]
- **Where it fits in a modern stack:** Useful only if Hylono’s device or telemetry roadmap requires MQTT. Not needed for ordinary web/business workflows. [https://github.com/eclipse-mosquitto/mosquitto, 2026-04-12, v2.1.2]

## Hylono fit snapshot
- **Business usefulness:** Best used with device/telemetry tooling, not core business apps. [https://github.com/eclipse-mosquitto/mosquitto/releases, 2026-04-12, v2.1.2]
- **Overlap watch:** Part of the IoT stack; not an overlap with n8n/HTTP systems.
- **Must verify before implementation:** Confirm actual MQTT/device needs first.