# Hylono Elite Stack Standard

This directory defines the target operating standard for the full Hylono self-hosted platform.
The repository already runs the local infrastructure layer and the verified Phase 1A slice.
The standard below is the bar for turning the rest of the manifest into an operator-grade stack instead of a typical homelab.

## Non-Negotiable Platform Decisions

1. Identity is centralized in Zitadel.
   Every browser-facing tool must use Zitadel SSO or a documented exception with an owner and rollback path.
2. Secrets move to Infisical before any public deployment.
   Local `.env` files are allowed for bootstrap only.
3. Kong is the canonical HTTP gateway.
   Public routes are exposed through Kong, not by publishing random container ports.
4. Prometheus plus Uptime Kuma are the minimum observability pair.
   Prometheus owns metrics and alerts. Uptime Kuma owns operator-facing uptime and status pages.
5. PostgreSQL, Redis, MinIO, and MongoDB stay private.
   Only browser-facing applications and the gateway are exposed.
6. n8n and Temporal are orchestration layers, not business frontends.
   They need persistence, backups, RBAC, and monitored queues.
7. Every stateful service needs a backup class.
   Database dump, object storage copy, application data copy, or an explicit documented exception.
8. Every email-capable tool must have a real sender strategy.
   No production launch without aligned SMTP or provider settings, DKIM, SPF, and reply handling.

## Shared Service Profiles

### Control plane

- Kong: DB-less declarative config, local-only admin API, Prometheus plugin enabled, route-by-service rather than route-by-container-port.
- Prometheus: scrape control plane, scrape app metrics where supported, blackbox probe browser surfaces, fire alerts for gateway and key routes.
- Uptime Kuma: seeded operator account, grouped status page, browser-facing monitors only.
- Infisical: becomes the canonical secret store for staging and production.
- Wazuh and Retraced: own security monitoring and audit evidence.

### Data plane

- PostgreSQL 16: separate databases and least-privilege roles per application, pg_partman enabled for Lago, regular dump backups.
- Redis 7: password-protected, AOF enabled, persistence monitored, no public exposure.
- MinIO: browser console private, built-in Prometheus metrics enabled, bucket creation documented per app.
- MongoDB 7: root account private, only apps with a hard dependency use it.

### Integration plane

- n8n: queue mode, persistent volume, worker container, metrics enabled, webhook URL pinned per environment.
- Temporal: reserved for long-running, business-critical workflows that should not live as ad hoc n8n logic.
- Novu: in-app first locally, real provider cutover later, subscriber sync treated as part of the CRM backbone.

## Phase Standards

### Infrastructure

- PostgreSQL 16
- Redis 7
- MinIO
- MongoDB 7
- Uptime Kuma
- Kong
- Prometheus

Required finish line:

- all database and cache ports bound privately
- Kong owns HTTP entry
- Prometheus scrapes the control plane and blackbox probes routed surfaces
- backup automation covers database dumps and stateful app data

### Phase 1A

- Medusa
- Lago
- Snipe-IT
- Leihs
- Cal.com
- Twenty CRM
- Documenso
- Zitadel
- Novu
- n8n

Required finish line:

- deterministic local bootstrap accounts for operator flows
- SMTP and webhook configuration stored outside code before staging
- every service routed through Kong for staging and production
- n8n plus Novu plus Twenty remain the intake backbone

### Phase 1B

- ThingsBoard
- Mosquitto
- InfluxDB
- Grafana
- Meilisearch
- Dify
- Strapi
- Jitsi

Required finish line:

- IoT telemetry isolated from public web traffic
- Grafana SSO through Zitadel
- Meilisearch keys rotated and scoped
- Jitsi media requirements documented before rollout

### Phase 1C

- Chatwoot
- Mautic
- Formbricks
- Gorse
- Temporal
- ClassroomIO
- Metriport
- Wazuh

Required finish line:

- CRM and marketing systems share canonical contact ownership rules
- Temporal owns durable workflows that cross system boundaries
- Wazuh and audit tooling cover admin surfaces and critical hosts
- health-adjacent data flows have privacy and retention owners

### Phase 2

- Invoice Ninja
- Akaunting
- CMMS (Fleetbase)
- Ditto
- Node-RED
- DocuSeal
- RefRef
- Listmonk
- Discourse
- Apache Answer
- BigBlueButton
- BookStack
- Docusaurus
- Outline
- Medplum
- Fasten Health
- Presidio
- Infisical
- Comp AI
- PostHog
- Retraced
- Fides
- CookieConsent
- Metabase
- Appsmith

Required finish line:

- every browser app uses Zitadel SSO where supported
- every stateful app has a backup class and retention policy
- PostHog, Metabase, and Appsmith are treated as internal analytics surfaces, not public sites
- privacy stack is explicit: Presidio for de-identification, Fides for privacy operations, CookieConsent for consent surface, Retraced for audit evidence

## Rollout Order

1. Finish the control plane.
2. Move all public HTTP through Kong.
3. Move secrets to Infisical.
4. Finish Phase 1A hardening and backups.
5. Add Phase 1B and Phase 1C services with SSO, SMTP, and metrics from day one.
6. Only then expand the broader Phase 2 business applications.

## Official Source Baseline

- Docker Compose startup order and service health: <https://docs.docker.com/compose/how-tos/startup-order/>
- n8n queue mode and configuration: <https://docs.n8n.io/hosting/scaling/queue-mode/>
- n8n environment variables: <https://docs.n8n.io/hosting/configuration/environment-variables/>
- Kong DB-less deployments and declarative config: <https://docs.konghq.com/gateway-operator/latest/topologies/dbless/>
- Kong rate limiting and gateway patterns: <https://docs.konghq.com/gateway/latest/get-started/rate-limiting/>
- Prometheus configuration: <https://prometheus.io/docs/prometheus/latest/configuration/configuration/>
- Prometheus blackbox exporter: <https://prometheus.io/docs/guides/multi-target-exporter/>
- PostgreSQL 16 documentation: <https://www.postgresql.org/docs/16/index.html>
- Redis security and ACLs: <https://redis.io/docs/latest/operate/oss_and_stack/management/security/>
- MinIO metrics and monitoring: <https://min.io/docs/minio/linux/operations/monitoring.html>
- Twenty self-hosting: <https://docs.twenty.com/developers/self-host/self-host>
- Medusa documentation: <https://docs.medusajs.com/>
- Cal.com self-hosting docs: <https://cal.com/docs>
- Documenso documentation: <https://documenso.com/docs>
- Novu documentation: <https://docs.novu.co/>

## Current Repository Delta

The repo changes in this pass do four things:

- add Kong and Prometheus to the local infrastructure layer
- harden local-only port exposure and service defaults
- move n8n to a persistent queue-capable topology
- remove the hardcoded Zitadel bootstrap password from compose

That does not finish the entire manifest.
It raises the local control plane substantially and gives the remaining phases a real operating standard instead of a vague wishlist.
