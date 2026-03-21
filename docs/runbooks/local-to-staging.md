# Runbook: Local to Staging Handoff

_Owner: DevOps / Operator_

## Purpose

This runbook converts the current local operator stack into a staging-ready deployment plan.
It does not change application logic. It defines the launch shape, the secret model, and the verification order.

## Current Local Baseline

The local launcher already proves the following:

- the browser-facing services respond on `localhost`
- the operator accounts and baseline data are seeded locally
- the intake routes persist to the local database
- `n8n`, `Twenty`, and `Novu` are wired for the local intake path
- the control panel shows the current local operator state

## What Moves To Staging

Move these pieces together:

- public domains and TLS
- the same app/runtime services already exercised locally
- a staging-specific `.env`
- a staging reverse proxy
- smoke checks and rollback paths

Keep these separate from staging:

- local-only launcher shortcuts
- local operator credentials
- any hardcoded `localhost` URLs
- test data that should not be visible to real users

## Recommended Staging Model

Use the same container architecture as local, but deploy on a server with:

- a private host network for databases and caches
- a reverse proxy for all public traffic
- staging-specific URLs for each browser-facing service
- secrets stored outside the repo

## Promotion Order

1. Provision DNS and TLS.
2. Copy `/.env.staging.example` to `.env.staging` and fill every placeholder.
3. Start infrastructure first.
4. Start the Phase 1A app layer.
5. Apply the staging-only bootstrap data that is safe to publish.
6. Run a full smoke check.
7. Cut traffic only after the smoke passes.

## Baseline State To Keep

The staging baseline should include:

- a working homepage and control surface
- a seeded monitoring page
- seeded CRM, billing, scheduling, and notification defaults
- no private test credentials that came from the local machine

## Rollback

If staging fails verification:

- revert DNS cutover
- stop the app layer before touching infrastructure
- keep databases intact unless data corruption is confirmed
- re-run the smoke only after the server is back to a known state

## Exit Criteria

Staging handoff is ready when:

- all public URLs resolve on the staging host
- the monitoring page reports healthy services
- the operator can sign in without using local-only secrets
- the intake path still reaches `n8n`, `Twenty`, and `Novu`
