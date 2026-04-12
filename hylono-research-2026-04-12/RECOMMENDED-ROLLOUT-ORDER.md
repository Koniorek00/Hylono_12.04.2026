## Wave 0 — Validate and harden current backbone
- PostgreSQL 16
- Redis 7
- MongoDB 7
- MinIO decision
- Uptime Kuma

**Why:** validate the already-running data plane, settle Redis licensing, and decide whether MinIO remains acceptable for new work.

## Wave 1 — Identity, secrets, gateway, and automation spine
- ZITADEL
- Infisical
- Kong
- n8n
- Novu
- Twenty CRM

**Why:** these tools create the shared control plane and integration backbone for the rest of the stack.

## Wave 2 — Customer operations and internal visibility
- Cal.com
- Documenso
- Leihs
- Prometheus
- Grafana
- Metabase
- Appsmith
- CookieConsent

**Why:** these immediately improve booking, signing, rental operations, monitoring, internal visibility, and front-end consent.

## Wave 3 — Revenue operations and support/content basics
- Lago (only if billing complexity exists)
- Invoice Ninja
- Listmonk
- Chatwoot
- BookStack
- Meilisearch
- Formbricks
- Jitsi

**Why:** these add specific customer and operator value once the backbone is stable.

## Wave 4 — Conditional platform expansion
- Medusa
- Snipe-IT
- CMMS
- Node-RED
- ThingsBoard
- Mosquitto
- InfluxDB
- Discourse / Apache Answer
- Strapi
- Mautic
- Dify

**Why:** these depend on confirmed business needs such as richer commerce, IoT, community, CMS, or AI.

## Wave 5 — Heavy, niche, or strategic-later systems
- DocuSeal
- Fleetbase
- BigBlueButton
- Outline
- Temporal
- Gorse
- Comp AI
- Fides
- Retraced
- Wazuh
- Ditto
- RefRef
- ClassroomIO
- Medplum
- Fasten Health
- Metriport
- Akaunting

**Why:** these are either redundant, operationally heavy, maturity-limited, or outside the current business center of gravity.