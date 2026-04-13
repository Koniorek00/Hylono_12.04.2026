# Ops Non-Negotiables

## Purpose
This file adds the missing operator discipline layer to the research folder. It is intentionally short, strict, and implementation-facing.

## Universal Rules
- Never expose admin surfaces directly to the public internet unless there is a deliberate reason and compensating controls.
- Never deploy a stateful service without backups, restore steps, and ownership.
- Never store secrets in repository files, copied docker-compose files, or ad hoc environment notes.
- Never accept a service into production without health checks and at least basic monitoring.
- Never assume a community Compose file is production-ready.
- Never assume a default config is safe for EU privacy, health-adjacent data, or multi-user internal access.

## Database Rules
- PostgreSQL: use pooling, backup testing, query monitoring, and WAL/disk monitoring.
- Redis: decide explicitly whether it is cache-only or durable; configure persistence accordingly.
- MongoDB: define retention, backup scope, and auth hardening before production use.

## Identity and Access Rules
- Centralize admin identity as early as practical.
- Use role separation for operators, finance, support, and automation.
- Prefer SSO or federated auth for internal tools where supported.
- Maintain an access matrix for every service that stores customer or operational data.

## Integration Rules
- Webhooks must be authenticated, replay-aware, and logged.
- n8n workflows must be documented when they move business-critical data.
- Do not let automation silently mutate customer-facing state without traceability.
- API keys must have owners, purpose labels, and rotation rules.

## Compliance Rules
- Treat all customer wellness, booking, protocol, and usage records as sensitive.
- Avoid medical claims in any automated messaging path.
- Keep EU residency and processor inventory visible.
- Record where signed documents, billing records, and customer communication history are stored.

## Deployment Rules
- One owner per service.
- One rollback path per change.
- One canonical config location per service.
- One decision log entry per material architectural choice.
