# Local Phase 2 Intake Workflows

This folder documents the first local Phase 2 bridge between the Hylono web app and `n8n`.

The app now emits best-effort webhook events for:

- `contact.created`
- `booking.requested`
- `newsletter.subscribed`
- `order.created`
- `rental.requested`

## Active local wiring

The local stack is now wired to these production webhook URLs:

```env
N8N_CONTACT_WEBHOOK_URL=http://localhost:5678/webhook/hylono/contact-created
N8N_BOOKING_WEBHOOK_URL=http://localhost:5678/webhook/hylono/booking-requested
N8N_NEWSLETTER_WEBHOOK_URL=http://localhost:5678/webhook/hylono/newsletter-subscribed
N8N_ORDER_WEBHOOK_URL=http://localhost:5678/webhook/hylono/order-created
N8N_RENTAL_WEBHOOK_URL=http://localhost:5678/webhook/hylono/rental-requested
N8N_WEBHOOK_SIGNING_KEY=<local shared secret>
N8N_WEBHOOK_TIMEOUT_MS=5000
```

The current operator login for the local `n8n` UI is:

- email: `wiktormyszor@proton.me`
- password: `HylonoN8N123!`

## Active local workflows

- `contact_created` -> `http://localhost:5678/webhook/hylono/contact-created`
- `booking_requested` -> `http://localhost:5678/webhook/hylono/booking-requested`
- `newsletter_subscribed` -> `http://localhost:5678/webhook/hylono/newsletter-subscribed`
- `order_created` -> `http://localhost:5678/webhook/hylono/order-created`
- `rental_requested` -> `http://localhost:5678/webhook/hylono/rental-requested`

Exported working definitions are stored in:

- `n8n-workflows/phase-2-local/contact_created.json`
- `n8n-workflows/phase-2-local/booking_requested.json`
- `n8n-workflows/phase-2-local/newsletter_subscribed.json`
- `n8n-workflows/phase-2-local/order_created.json`
- `n8n-workflows/phase-2-local/rental_requested.json`

The local operator reconcile script is:

- `scripts/seed-n8n-phase2-workflows.ps1`

That script now:

- reimports the versioned workflow JSON files one by one into the live local project
- republishes the desired five workflows
- unpublishes stale legacy workflows that should not stay active
- moves the desired workflows into the `Core` folder
- tags them as `local`, `phase-2`, and `intake`
- exports a fresh backup snapshot under `output/n8n-backups/`

## Minimal workflow shape

For each workflow in `n8n`:

1. Add a `Webhook` trigger node.
2. Copy the production webhook URL into the matching env variable above.
3. Add an `IF` or `Code` node to verify the `x-hylono-signature` header if you set `N8N_WEBHOOK_SIGNING_KEY`.
4. Route the payload to the next local system:
   - contact -> `Twenty` lead/contact creation
   - booking -> `Twenty` plus `Cal.com` or internal follow-up
   - newsletter -> `Novu`, CRM tagging, or nurture automation
   - order -> `Medusa`, billing follow-up, or internal order orchestration
   - rental -> CRM qualification, asset review, or financing handoff
5. Finish with a lightweight success response so the app gets a fast `2xx`.

## Event envelope

The app sends a JSON body shaped like this:

```json
{
  "eventId": "uuid",
  "eventType": "contact.created",
  "environment": "development",
  "occurredAt": "2026-03-19T15:00:00.000Z",
  "source": "hylono-web",
  "payload": {
    "ticketId": "HYL-ABC123",
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

Headers include:

- `x-hylono-event-id`
- `x-hylono-event-type`
- `x-hylono-signature` when a signing key is configured

## Local verification

After configuring the webhook URLs, submit one real form from the running local app and verify:

- the record is still persisted in the app database
- the corresponding workflow execution appears in `n8n`
- the workflow responds fast enough to stay under the configured timeout
