# Execution Playbook - First 30 Days

## Goal
Turn the research folder into a controlled implementation program without forcing unnecessary rewrites of the existing Next.js 16 application.

## Guiding Rule
Do not start by deploying every app. Start by reducing uncertainty around identity, secrets, observability, database safety, and integration boundaries.

## Week 1 - Hardening and Verification
### Outcomes
- running infrastructure verified
- current versions rechecked before any change
- backup and restore path documented
- one implementation decision log started

### Work
1. Validate PostgreSQL, Redis, and MongoDB against the package notes.
2. Confirm backup ownership, backup schedule, and restore test procedure.
3. Confirm EU hosting and data residency choices for all stateful services.
4. Decide whether Redis remains acceptable from a licensing and procurement perspective.
5. Decide whether MinIO remains the object storage target or should be reconsidered.
6. Create a working issue list using `SERVICE-DECISION-LOG-TEMPLATE.md`.

## Week 2 - Control Plane First
### Outcomes
- secrets, identity, and gateway direction chosen
- automation and notifications placed on clean boundaries

### Priority sequence
1. Infisical or existing secrets strategy finalized
2. ZITADEL deployment decision finalized
3. Kong deployment decision finalized
4. n8n deployment path selected
5. Novu deployment boundary selected

### Deliverables
- identity architecture note
- secret naming convention
- webhook ingress policy
- internal service hostname convention
- service-to-service auth plan

## Week 3 - Revenue and Operations Path
### Outcomes
- first business-facing operational apps chosen without overlap waste

### Priority sequence
1. Twenty CRM integration stabilization
2. Cal.com decision and booking flow scope
3. Documenso decision for signing
4. Leihs decision for rental operations
5. Metabase for internal reporting only after source systems are stable

### Rules
- Do not implement Medusa before the commerce gap is explicit.
- Do not implement Lago unless usage-based billing is a confirmed commercial need.
- Do not deploy both Leihs and Snipe-IT for the same core job without a written split of responsibilities.

## Week 4 - Production Readiness Gate
### Required checks before expansion
- backups tested
- alerting routed
- logs accessible
- health checks defined
- onboarding docs written
- rollback path written for every new service
- reverse proxy and TLS path verified
- secrets stored in one approved system

## Stop Conditions
Pause rollout if any of the following is true:
- no restore test has been performed
- no identity boundary has been agreed
- no operator ownership exists for a service
- no monitoring path exists for a stateful service
- the business owner cannot explain why an app is needed now

## What Not to Do in the First 30 Days
- do not self-host every interesting tool because it is open source
- do not move public-site auth logic into a new IdP without a migration plan
- do not add overlapping documentation platforms
- do not add healthcare-adjacent tools without a real data-governance decision
- do not let n8n become the undocumented source of truth for core business logic
