# Checklist: Staging Launch

## Before You Start

- [ ] Confirm the local launcher and deep smoke are green.
- [ ] Confirm the staging host is provisioned.
- [ ] Confirm DNS is ready for the staging subdomains.
- [ ] Confirm a reverse proxy will terminate TLS.
- [ ] Confirm `.env.staging` exists and has no placeholder secrets.
- [ ] Run `.\scripts\validate-staging-env.ps1 -Path .\.env.staging` and fix every reported issue.

## Infrastructure

- [ ] Start PostgreSQL, Redis, MongoDB, MinIO, and monitoring.
- [ ] Verify database containers are healthy.
- [ ] Verify storage and cache containers are healthy.
- [ ] Confirm no database ports are exposed publicly.

## App Layer

- [ ] Start Medusa.
- [ ] Start Lago.
- [ ] Start Snipe-IT.
- [ ] Start Cal.com.
- [ ] Start Twenty CRM.
- [ ] Start Documenso.
- [ ] Start Zitadel.
- [ ] Start Novu.
- [ ] Start n8n.

## Operator Baseline

- [ ] Confirm the staging monitoring page is visible.
- [ ] Confirm the CRM baseline exists.
- [ ] Confirm the billing baseline exists.
- [ ] Confirm the scheduling baseline exists.
- [ ] Confirm the notification baseline exists.
- [ ] Confirm the signing certificate path is valid.

## Verification

- [ ] Open each public staging URL in a browser.
- [ ] Confirm `n8n` receives a test intake event.
- [ ] Confirm `Twenty` stores the resulting person or follow-up.
- [ ] Confirm `Novu` receives the subscriber sync.
- [ ] Confirm the operator can reach the control surface.

## Cutover

- [ ] Switch DNS only after verification is green.
- [ ] Keep the old local launcher available for rollback testing.
- [ ] Document the first staging incident and the rollback window.
