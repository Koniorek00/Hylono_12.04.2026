# Medtech Operator Defaults Manifest

Scope: repo-local apply order and artifact registry for the medtech operator configuration track.

## Recommended Apply Order

1. `Twenty CRM` workspace defaults
   - Seeds the canonical supported sources and queue labels reused across the operator stack.
   - Entrypoint: `powershell -ExecutionPolicy Bypass -File .\scripts\seed-twenty-operator-workspace.ps1`
2. `Cal.com` operator baseline
   - Seeds the scheduling surface and stable event slugs for intake, consultation, and follow-up.
   - Entrypoint: `powershell -ExecutionPolicy Bypass -File .\scripts\seed-calcom-operator-baseline.ps1`
3. `Novu` notification pack
   - Seeds canonical operator subscribers plus the event and template contract used by operator notifications.
   - Entrypoint: `powershell -ExecutionPolicy Bypass -File .\scripts\seed-novu-operator-bootstrap.ps1`
4. `n8n` operator workflow pack
   - Import the transformer workflows last and keep them inactive until the downstream CRM and notification layers are ready.
   - Verified import entrypoints:

```powershell
docker cp n8n-workflows/operator-defaults/medtech_intake_triage_router.json hylono-n8n:/tmp/medtech_intake_triage_router.json
docker exec hylono-n8n n8n import:workflow --input=/tmp/medtech_intake_triage_router.json --projectId=qsxWp8D20vB0PcZF
docker cp n8n-workflows/operator-defaults/medtech_followup_digest_escalation.json hylono-n8n:/tmp/medtech_followup_digest_escalation.json
docker exec hylono-n8n n8n import:workflow --input=/tmp/medtech_followup_digest_escalation.json --projectId=qsxWp8D20vB0PcZF
```

## Track Registry

### Twenty CRM

- Artifacts:
  - `scripts/seed-twenty-operator-workspace.ps1`
  - `scripts/data/twenty-operator-workspace.seed.json`
- Required env/config:
  - `TWENTY_API_KEY`
  - `TWENTY_API_BASE_URL` optional, defaults to `http://localhost:8107`
- Optional flags:
  - `-SeedPath`
  - `-ValidateOnly`
- Stable names exported by the seed artifact:
  - Supported sources:
    - `contact:general`
    - `contact:rental`
    - `contact:b2b`
    - `contact:support`
    - `contact:press`
    - `booking:consultation`
    - `booking:demo`
    - `booking:rental-inquiry`
    - `booking:b2b`
    - `checkout:card`
    - `checkout:bank_transfer`
    - `checkout:financing`
    - `rental:pending`
  - Queue names:
    - `Website contact follow-up queue`
    - `Rental request triage queue`
    - `Checkout recovery queue`
    - `Medtech intake triage queue`
    - `Consultation booking readiness queue`
    - `Post-consult follow-up queue`
    - `Consent completion reminder queue`

### Cal.com

- Artifacts:
  - `scripts/seed-calcom-operator-baseline.ps1`
  - `scripts/data/calcom-operator-baseline.template.json`
  - `output/calcom-bootstrap/operator-baseline-state.json`
- Runtime dependency:
  - local `hylono-postgres` and `hylono-calcom` containers running
- Optional flags:
  - `-ConfigPath`
  - `-OperatorEmail`
  - `-OperatorTimeZone`
- Stable booking slugs:
  - `medtech-intake-triage`
  - `medtech-consultation`
  - `post-consult-follow-up`
- Legacy compatibility aliases:
  - `15min`
  - `30min`
  - `secret`
- If another script needs the concrete applied paths or resolved event ids, use `output/calcom-bootstrap/operator-baseline-state.json`.

### Novu

- Artifacts:
  - `scripts/seed-novu-operator-bootstrap.ps1`
  - `scripts/novu/operator-notification-pack.json`
  - `output/novu-bootstrap/operator-bootstrap-state.json`
- Required env/config:
  - `NOVU_API_SECRET`
  - `NOVU_API_BASE_URL` optional, defaults to `http://localhost:18110`
  - `NOVU_WORKFLOW_ID` optional, defaults to `powiadomienia`
- Local runtime requirements:
  - an `ACTIVE` workflow matching `NOVU_WORKFLOW_ID`
  - at least one active `in_app` integration
- Canonical operator events:
  - `operator.intake.received`
  - `operator.booking.confirmed`
  - `operator.followup.reminder`
  - `operator.digest.daily`
  - `operator.escalation.raised`
- Canonical template keys:
  - `intake-received`
  - `booking-confirmed`
  - `followup-reminder`
  - `digest-daily`
  - `escalation-raised`
- Canonical operator subscribers:
  - `ops`
  - `support`
  - `contact`

### n8n

- Artifacts:
  - `n8n-workflows/operator-defaults/medtech_intake_triage_router.json`
  - `n8n-workflows/operator-defaults/medtech_followup_digest_escalation.json`
- Runtime notes:
  - verified against local `n8n 2.12.2`
  - imported workflows are inactive by default after `n8n import:workflow`
  - keep these workflows separate from `scripts/seed-n8n-phase2-workflows.ps1`
- Stable downstream hints emitted by the workflows:
  - Queue names:
    - `Website contact follow-up queue`
    - `Rental request triage queue`
    - `Checkout recovery queue`
  - Topic keys:
    - `operator-intake-general`
    - `operator-rental-triage`
    - `operator-checkout-recovery`
  - Novu event names:
    - `operator.followup.reminder`
    - `operator.escalation.raised`
    - `operator.digest.daily`
  - Novu template keys:
    - `followup-reminder`
    - `escalation-raised`
    - `digest-daily`

## Cross-Track Contract Map

- `Twenty CRM` is the canonical source for supported intake sources and queue labels.
- `Cal.com` is the canonical source for booking slugs and scheduling windows.
- `Novu` is the canonical source for operator subscriber roles plus notification event and template names.
- `n8n` consumes the `Twenty CRM` queue labels and `Novu` identifiers as downstream hints; it does not create CRM records or send notifications directly.
- `operator.booking.confirmed` exists in the Novu pack, but no Task 01 workflow emits it; the expected producer is the booking layer that consumes the Cal.com baseline.

## Integration Assumptions

- This manifest only assembles checked-in artifacts from Tasks 01-04. It does not redefine their behavior.
- `scripts/launch-local-stack.ps1` already invokes `scripts/seed-novu-operator-bootstrap.ps1`; this manifest does not change launchers, smoke scripts, or `control-panel/**`.
- The current application runtime still uses the generic Novu workflow trigger path described in the Novu handoff. The checked-in operator notification pack is the canonical contract, not a caller rewrite.
- The `n8n` workflows are manual-import artifacts and should remain unpublished until the downstream `Twenty CRM` and `Novu` layers are ready to consume their outputs.
