# Staging Handoff Scaffold

This folder is the handoff layer between the current local operator stack and a real staging host.

## What This Scaffold Covers

- domain and URL mapping for staging
- the minimum secret set needed to run the stack outside `localhost`
- promotion order from local verification to staging launch
- operator checks for cutover and rollback

## What Stays Local For Now

- the desktop launcher and local operator bootstrap
- the current local compose files under `docker/infrastructure` and `docker/phase-1a`
- the local control-panel workflow on port `3005`

## Recommended Staging Shape

Use one Linux host with:

- Docker and Docker Compose
- a reverse proxy on `80/443`
- the same service grouping already used locally
- a staging-specific env file, not the local `.env`
- the active first-wave stack first, with conditional business apps added only after separate decision logs

## Handoff Files

- `/.env.staging.example`
- `docs/runbooks/local-to-staging.md`
- `docs/runbooks/staging-launch-checklist.md`
- `deploy/staging/stack-contract.md`

## Launch Order

1. Prepare DNS and TLS.
2. Provision secrets and `.env.staging`.
3. Start infrastructure.
4. Start the app layer.
5. Run smoke checks.
6. Cut traffic only after verification is clean.
