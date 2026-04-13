# Checklist: Staging Launch

## Before You Start

- [ ] Confirm the local launcher and deep smoke are green.
- [ ] Confirm the staging host is provisioned.
- [ ] Confirm DNS is ready for the staging subdomains.
- [ ] Confirm a reverse proxy will terminate TLS.
- [ ] Confirm `.env.staging` exists and has no placeholder secrets.
- [ ] Run `node scripts/check-stack-version-governance.cjs`.
- [ ] Run `.\scripts\validate-staging-env.ps1 -Path .\.env.staging` and fix every reported issue.
- [ ] Uncomment and fill the conditional service keys in `.env.staging` only for the services that are intentionally part of this wave.

## Infrastructure

- [ ] Start PostgreSQL, Redis, MongoDB, MinIO, and monitoring.
- [ ] Verify database containers are healthy.
- [ ] Verify storage and cache containers are healthy.
- [ ] Confirm no database ports are exposed publicly.

## App Layer

- [ ] Start the main site and control panel.
- [ ] Start Twenty CRM.
- [ ] Start Novu.
- [ ] Start n8n.

## Conditional Later App Layer

- [ ] Start Cal.com only if booking ownership is approved for this wave.
- [ ] Start Documenso only if the document class and retention policy are approved.
- [ ] Start Zitadel only if internal-tools SSO is part of this wave.
- [ ] Keep Medusa, Lago, Snipe-IT, and Leihs disabled unless a separate decision log explicitly approves them.

## Operator Baseline

- [ ] Confirm the staging monitoring page is visible.
- [ ] Confirm the CRM baseline exists.
- [ ] Confirm the notification baseline exists.
- [ ] Confirm optional baselines only for the conditional services that were intentionally enabled.

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
