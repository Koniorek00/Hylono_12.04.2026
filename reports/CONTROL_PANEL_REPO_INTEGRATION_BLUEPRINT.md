# CONTROL PANEL REPO INTEGRATION BLUEPRINT

Generated: 2026-02-19  
Project: Hylono Stack (`manifest.json` v5.6)

## 1) Executive Summary

This report maps the full control-panel repository inventory to the current Hylono application state and defines what is still missing to actually utilize each tool/service.

**Inventory covered**
- Infrastructure: **5**
- Services: **54**
- Total operational stack entries: **59**
- R&D references: **5**

**Verified current state anchors**
- Control panel reads the inventory from `manifest.json` (`control-panel/lib/manifest.ts`) and already exposes repo links/flows in stack UI.
- Main app has no live backend runtime for `app/api/*.route.ts` (dead code in Vite context; see `app/api/README.md`).
- PostHog frontend integration exists and is consent-gated (`src/lib/analytics.ts`).
- Stripe server client is intentionally disabled pending architecture decision (`src/lib/stripe.ts`).
- Authentication is still mock/localStorage (`lib/mockAuth.ts`).

## 2) Hard Blockers and Their Impact

### P0 blockers
1. **TASK-018 — dead API layer / architecture decision pending**
2. **TASK-019 — Prisma client not generated**
3. **TASK-020 — authentication is mock-only**

### Additional P0 from handoff queue (separate but relevant)
- **TASK-012 — legal pages still placeholder content (GDPR risk)**

### What these blockers prevent
- Real checkout/rental billing flows
- Real account/session/tenant provisioning
- Real CRM, fleet, onboarding, and support sync
- Most n8n/Temporal flows from `manifest.integrations`

## 3) Cross-Cutting Missing Implementation (Platform Layer)

Before service-by-service integrations, Hylono still needs these platform capabilities:

1. **Backend runtime decision + bootstrap** (Option A/B/C from `app/api/README.md`)
2. **Prisma generation + migration pipeline** (`npx prisma generate`, migration flow)
3. **Real auth/IAM integration** (replace mock auth with Zitadel OIDC + server session strategy)
4. **Integration gateway layer**
   - outbound service clients (Medusa/Lago/Twenty/Cal/etc.)
   - webhook ingestion + signature validation
5. **Event workflow backbone**
   - n8n for glue automations
   - Temporal for long-running/compensated business workflows
6. **Canonical entity model in DB**
   - partner, customer, asset, order, invoice, booking, protocol, telemetry-event
7. **Ops baseline**
   - secrets management, health checks, metrics/logging, incident routing

---

## 4) Full Repository-to-Hylono Mapping (59/59)

Legend:
- **Current fit** = how it connects to code/state today
- **Connect via** = intended integration path in Hylono
- **Build next** = concrete missing implementation
- **Depends on** = blocker prerequisites

## 4.1 Infrastructure (5)

1. **`postgres`**
   - Current fit: Prisma schema exists but client generation/runtime path is blocked.
   - Connect via: Primary relational store for core app data.
   - Build next: DB provisioning, migration lifecycle, generated client wiring in backend.
   - Depends on: TASK-018, TASK-019.

2. **`redis`**
   - Current fit: Not wired yet.
   - Connect via: queue/cache/session primitives (n8n/Temporal/jobs/rate limiting).
   - Build next: Redis client module, key strategy, queue workers, cache invalidation policy.
   - Depends on: TASK-018.

3. **`minio`**
   - Current fit: Not wired yet.
   - Connect via: object storage for docs/media/exports.
   - Build next: signed upload/download service + storage abstraction + retention policy.
   - Depends on: TASK-018.

4. **`mongo`**
   - Current fit: Not used directly in app.
   - Connect via: Novu dependency only.
   - Build next: provision only when Novu is enabled; keep isolated from app domain model.
   - Depends on: Novu rollout.

5. **`uptime-kuma`**
   - Current fit: Not wired yet.
   - Connect via: stack health checks + synthetic probes.
   - Build next: monitor catalog, on-call alert channels, status page policy.
   - Depends on: none (can start now).

## 4.2 Phase 1a — ESSENTIAL (10)

1. **`medusa` (commerce)**
   - Current fit: Store/checkout UX exists, but backend checkout endpoint is dead.
   - Connect via: product/order backend; webhooks to n8n/Lago/Snipe-IT.
   - Build next: Medusa adapter, product sync, order ingestion, checkout orchestration.
   - Depends on: TASK-018, TASK-019.

2. **`lago` (commerce/billing)**
   - Current fit: Stripe server is disabled; no metering/billing backend yet.
   - Connect via: recurring rental billing + usage metering reconciliation.
   - Build next: billing account mapping, invoice/subscription sync, webhook handlers.
   - Depends on: TASK-018, TASK-019.

3. **`snipe-it` (fleet)**
   - Current fit: partner fleet pages are mostly static/mock.
   - Connect via: canonical asset registry for deployed devices.
   - Build next: asset sync jobs, maintenance status APIs, partner dashboard binding.
   - Depends on: TASK-018, TASK-019.

4. **`leihs` (fleet/lending)**
   - Current fit: no current integration.
   - Connect via: lending lifecycle (checkout/return) + downstream billing stop events.
   - Build next: source deploy pipeline, return workflow hooks, conflict resolution model.
   - Depends on: TASK-018, TASK-019.

5. **`calcom` (fleet/scheduling)**
   - Current fit: booking flows in app route to dead API handlers.
   - Connect via: booking engine for demo/maintenance/training slots.
   - Build next: booking endpoint rewrite, webhook bridge to CRM/Temporal.
   - Depends on: TASK-018.

6. **`twenty` (crm)**
   - Current fit: lead/contact flows have no live backend persistence.
   - Connect via: lead/customer CRM source for sales and partner ops.
   - Build next: contact/lead sync, account mapping, CRM event ingestion.
   - Depends on: TASK-018, TASK-019.

7. **`documenso` (crm/contracts)**
   - Current fit: no live signature flow yet.
   - Connect via: partner agreement signing from onboarding workflow.
   - Build next: envelope creation service, webhook verification, signed-doc archival.
   - Depends on: TASK-018, TASK-019.

8. **`zitadel` (security/IAM)**
   - Current fit: auth still `mockAuth.ts`.
   - Connect via: OIDC identity/tenant management across stack.
   - Build next: replace mock auth, token/session validation, role mapping.
   - Depends on: TASK-018, TASK-020.

9. **`novu` (crm/notifications)**
   - Current fit: no unified notifications backend yet.
   - Connect via: email/SMS/in-app notifications from app + workflows.
   - Build next: notification templates, preference center, delivery tracking, retries.
   - Depends on: TASK-018.

10. **`n8n` (platform/automation)**
   - Current fit: integration map exists in manifest; not operationally wired.
   - Connect via: webhook and scheduled automation backbone across services.
   - Build next: workflow deployment repo, credentials vault strategy, idempotency rules.
   - Depends on: TASK-018.

## 4.3 Phase 1b — ESSENTIAL (8)

1. **`thingsboard` (iot)**
   - Current fit: no direct telemetry module in main app yet.
   - Connect via: device telemetry ingest/control-plane.
   - Build next: device auth model, telemetry ingestion APIs, alert thresholds.
   - Depends on: TASK-018, TASK-019.

2. **`mosquitto` (iot)**
   - Current fit: not wired yet.
   - Connect via: MQTT broker for field devices.
   - Build next: topic taxonomy, authN/authZ, bridge to ThingsBoard/n8n.
   - Depends on: IoT rollout baseline.

3. **`influxdb` (iot)**
   - Current fit: no time-series persistence path yet.
   - Connect via: telemetry and wearable time-series store.
   - Build next: retention policies, measurement schema, query layer for dashboards.
   - Depends on: ThingsBoard/Metriport flows.

4. **`grafana` (iot/ops)**
   - Current fit: no dashboard integration yet.
   - Connect via: fleet telemetry + ops observability dashboards.
   - Build next: datasource wiring (Influx/Postgres/Prometheus), RBAC, dashboard packs.
   - Depends on: Influx/Prometheus readiness.

5. **`meilisearch` (ai/search)**
   - Current fit: no app-level search index integration yet.
   - Connect via: fast content/product/protocol search.
   - Build next: indexing pipeline, relevance tuning, incremental updates.
   - Depends on: TASK-018.

6. **`dify` (ai/rag)**
   - Current fit: not connected yet.
   - Connect via: AI assistant/RAG over Strapi/docs/protocols.
   - Build next: retrieval pipelines, prompt guardrails, source attribution UI.
   - Depends on: content backend and auth.

7. **`strapi` (education/cms)**
   - Current fit: blog/content currently mostly constant/mock-driven.
   - Connect via: CMS for blog, education, protocol content.
   - Build next: content types, publish workflow, frontend fetch layer, migration from constants.
   - Depends on: TASK-018.

8. **`jitsi` (health/video)**
   - Current fit: no consult video backend yet.
   - Connect via: teleconsultation sessions for support/partner onboarding.
   - Build next: room provisioning API, secure invite links, recording policy.
   - Depends on: TASK-018 + auth hardening.

## 4.4 Phase 1c — ESSENTIAL (8)

1. **`chatwoot` (crm/support)**
   - Current fit: no live chat integration yet.
   - Connect via: support inbox and customer conversation routing.
   - Build next: widget integration, identity sync, SLA routing and escalation.
   - Depends on: TASK-018.

2. **`mautic` (marketing)**
   - Current fit: no campaign automation backend yet.
   - Connect via: nurture/lead scoring integrated to CRM.
   - Build next: event feed from app, campaign model, consent enforcement.
   - Depends on: TASK-018 + legal consent posture.

3. **`formbricks` (marketing/surveys)**
   - Current fit: no feedback collector integration yet.
   - Connect via: NPS/experience surveys feeding CRM.
   - Build next: survey trigger rules, response ingestion, sentiment dashboard.
   - Depends on: TASK-018.

4. **`gorse` (ai/recommendations)**
   - Current fit: recommendation layer not active.
   - Connect via: personalized product/protocol ranking.
   - Build next: interaction event stream, recommendation API adapter, fallback logic.
   - Depends on: Medusa events + analytics quality.

5. **`temporal` (platform/workflows)**
   - Current fit: long-running workflow engine not implemented.
   - Connect via: onboarding, returns, billing exceptions, document/signature orchestration.
   - Build next: workflow definitions, compensation rules, activity workers.
   - Depends on: TASK-018 + stable service contracts.

6. **`classroomio` (education/lms)**
   - Current fit: no LMS integration yet.
   - Connect via: partner certification and training progression.
   - Build next: SSO, enrollment automation, completion sync to partner profile.
   - Depends on: Zitadel + Temporal workflows.

7. **`metriport` (health/wearables)**
   - Current fit: no wearable data connector yet.
   - Connect via: wearable ingest to Influx + protocol dashboards.
   - Build next: connector setup, data normalization, consent + retention controls.
   - Depends on: TASK-018 + IoT baseline.

8. **`wazuh` (security monitoring)**
   - Current fit: no SIEM pipeline yet.
   - Connect via: host/security event monitoring with alert fanout.
   - Build next: agent rollout, rule packs, Novu incident notification chain.
   - Depends on: infrastructure hardening.

## 4.5 Phase 2 — RECOMMENDED (28)

1. **`invoiceninja`** — Connect Lago billing events to customer-facing invoice portal. Build: invoice sync jobs, payment-state reconciliation UI. Depends on TASK-018.
2. **`akaunting`** — Optional accounting back-office. Build: chart-of-accounts mapping + export pipelines. Depends on finance process definition.
3. **`cmms`** — Maintenance planning. Build: scheduled maintenance workflow + asset linkage. Depends on Snipe-IT/Twenty IDs.
4. **`fleetbase`** — Advanced fleet ops. Build: dispatch/route integration if logistics expands. Depends on fleet maturity.
5. **`eclipse-ditto`** — Digital twin layer. Build: twin models + IoT command orchestration. Depends on ThingsBoard baseline.
6. **`node-red`** — Additional low-code automation surface. Build: governance boundary vs n8n to avoid duplication. Depends on integration governance.
7. **`docuseal`** — Alternate e-sign stack. Build: choose between Documenso vs DocuSeal by legal/ops criteria. Depends on product decision.
8. **`refref`** — Referral workflows. Build: referral model + reward attribution + anti-fraud logic. Depends on auth + billing.
9. **`listmonk`** — Newsletter ops alternative. Build: segmentation + unsubscribe + consent-sync. Depends on legal consent pipeline.
10. **`discourse`** — Community forum. Build: SSO + moderation + knowledge capture loops. Depends on IAM.
11. **`answer`** — Q&A knowledge portal alternative. Build: choose Discourse vs Answer to avoid overlap. Depends on community strategy.
12. **`bigbluebutton`** — Education webinar platform. Build: deploy + LMS tie-in if Jitsi insufficient. Depends on education roadmap.
13. **`bookstack`** — Internal/external docs hub. Build: docs migration plan + SSO + permissions. Depends on IAM.
14. **`docusaurus`** — Public documentation portal. Build: docs pipeline and versioned publishing. Depends on content team process.
15. **`outline`** — Internal wiki. Build: knowledge governance and workspace roles. Depends on IAM.
16. **`medplum`** — FHIR/clinical interoperability option. Build: compliance/legal review, PHI boundaries, integration scope. Depends on regulatory decision.
17. **`fasten`** — Personal health record integration option. Build: connector boundary and data ownership model. Depends on legal + security.
18. **`presidio`** — PII detection/redaction. Build: ingestion gateways and redaction workflows for support/content exports. Depends on data policy.
19. **`infisical`** — Secrets manager. Build: secret rotation policy + CI/CD integration. Depends on infra ops maturity.
20. **`comp`** — Compliance operations automation. Build: control mapping + evidence collection workflows. Depends on compliance program owner.
21. **`posthog`** — Self-hosted analytics path (currently using hosted consent-gated frontend SDK). Build: decide hosted vs self-hosted, unify event contracts. Depends on analytics architecture decision.
22. **`retraced`** — Audit trail pipeline. Build: immutable audit event model + retention + query UI. Depends on backend event architecture.
23. **`fides`** — Privacy request automation. Build: DSAR workflow, data map, deletion/export orchestration. Depends on data inventory completion.
24. **`cookieconsent`** — External JS library option; current app already has custom consent component. Build: only if replacing in-house component; otherwise keep as reference. Depends on consent strategy decision.
25. **`kong`** — API gateway. Build: route policies, auth plugins, rate limits, service discovery. Depends on backend service mesh.
26. **`prometheus`** — Metrics backbone. Build: scrape configs, SLO dashboards, alert rules. Depends on service deployment baseline.
27. **`metabase`** — BI dashboarding. Build: warehouse views, metrics definitions, role-scoped reporting. Depends on canonical analytics schema.
28. **`appsmith`** — Internal ops tooling. Build: admin apps over Postgres/CRM/fleet APIs with RBAC. Depends on API stabilization.

## 4.6 R&D Repositories (5)

1. **`litos`** — Potential PBM hardware control sandbox; integrate only behind separate R&D environment and safety gating.
2. **`bloodlight`** — PPG firmware testbed reference; use for prototype telemetry studies, not production claims.
3. **`project-apollo`** — O₂ concentrator reference implementation; potential firmware architecture input.
4. **`m19o2`** — O₂ concentrator docs baseline; useful for engineering documentation and BOM benchmarking.
5. **`openo2`** — Open medical O₂ firmware reference; evaluate for learnings, not direct clinical deployment.

---

## 5) Integration Flows Already Declared in Manifest (What to Operationalize)

The manifest already defines key source→target data flows (Medusa→Lago, Leihs→Snipe-IT/Lago/Twenty, ThingsBoard→Influx/n8n/Lago, Temporal→Documenso/Zitadel/ClassroomIO/Novu, etc.).

**Current reality:** these flow definitions are architectural intent, not yet operational runtime.

**Needed to operationalize:**
1. Event contract schemas (payload versioning, idempotency keys)
2. Signed webhook validation for ingress
3. Retry + dead-letter handling for failed automations
4. End-to-end observability per flow (trace IDs)
5. Reconciliation jobs for eventual consistency gaps

---

## 6) Recommended Implementation Waves

## Wave 0 — Decision & Foundation (Immediate)
- Finalize TASK-018 architecture choice.
- Generate Prisma client and establish migration workflow (TASK-019).
- Replace mock auth with real IAM integration design (TASK-020 plan).

## Wave 1 — Core Revenue Spine (Phase 1a first)
- Services: `medusa`, `lago`, `twenty`, `snipe-it`, `calcom`, `documenso`, `zitadel`, `novu`, `n8n`.
- Goal: real commerce + billing + CRM + onboarding + notifications.

## Wave 2 — Workflow Reliability + Fleet Depth
- Services: `temporal`, `leihs`, plus hardening for `snipe-it` and `lago` loops.
- Goal: reliable returns, exception handling, partner onboarding automation.

## Wave 3 — IoT + Observability
- Services: `thingsboard`, `mosquitto`, `influxdb`, `grafana`, `wazuh`, `prometheus`.
- Goal: telemetry pipeline + operational awareness.

## Wave 4 — Content/Engagement Intelligence
- Services: `strapi`, `dify`, `meilisearch`, `mautic`, `formbricks`, `gorse`, `chatwoot`.
- Goal: CMS-backed content, search, AI assist, engagement loops.

## Wave 5 — Recommended Extensions (Phase 2 portfolio)
- Prioritize based on business pull: finance (`invoiceninja`/`akaunting`), privacy/security (`fides`/`presidio`/`infisical`), BI/internal tools (`metabase`/`appsmith`), community/docs (`discourse`/`bookstack`/`docusaurus`).

---

## 7) Immediate Next 2-Week Execution List

1. Choose architecture option (A/B/C) and lock API runtime.
2. Stand up backend skeleton with health endpoint, auth middleware, and Prisma wiring.
3. Implement first three real adapters: Medusa, Lago, Twenty.
4. Deploy n8n baseline and ship first two workflows:
   - Medusa order → Lago billing event
   - Cal.com booking → Twenty CRM activity
5. Replace mock auth entrypoints with Zitadel-backed login/session bootstrap.
6. Add observability starter pack: Uptime Kuma + Prometheus + baseline alerts.

---

## 8) Coverage Check

This report includes explicit mapping entries for:
- **All 5 infrastructure IDs**
- **All 54 service IDs**
- **All 5 R&D IDs**

No manifest repository entry is intentionally omitted.
