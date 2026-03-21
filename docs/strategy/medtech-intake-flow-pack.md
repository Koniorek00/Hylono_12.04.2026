# Medtech Intake Flow Pack

Date: 2026-03-20  
Scope: ready-made, source-backed workflow structures for intake, follow-up, consent, and scheduling across `n8n`, `Novu`, `Cal.com`, `Documenso`, and `Twenty`.

## Why this exists

This repo does not need a custom workflow invention layer for every use case. The official docs for the target tools already point to a small set of high-value patterns that are reusable across medtech-like journeys:

- `n8n` for webhook intake and controlled responses
- `Twenty` for CRM record routing, upserts, workflows, and manual forms
- `Novu` for environment-specific notification workflows, subscribers, and topic fan-out
- `Cal.com` for event types, routing forms, and booking webhooks
- `Documenso` for templates, direct links, API-based document creation, and signing certificates

This pack turns those patterns into a practical operating model that can be implemented without rebuilding the same logic from scratch in each app.

## Official-source pattern map

### 1) Intake should be a webhook-first pipeline

Recommended shape:

1. `n8n` receives the event on a stable production webhook path.
2. The webhook response is fast and explicit.
3. A canonical intake payload is normalized.
4. The record is upserted into `Twenty`.
5. Follow-up tasks and notifications are created.

Why this is the right base:

- The `n8n` Webhook node supports test and production URLs, response modes, and response data control.
- The `Respond to Webhook` node lets the workflow return a deliberate response instead of relying on default behavior.
- `Twenty` workflows support `Webhook` triggers, `Record is Created or Updated` triggers, `Upsert Record`, `Search Records`, and `Create Record` actions.

Source anchors:

- [n8n Webhook node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
- [n8n Respond to Webhook node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.respondtowebhook/)
- [Twenty workflow triggers](https://docs.twenty.com/user-guide/workflows/capabilities/workflow-triggers)
- [Twenty workflow actions](https://docs.twenty.com/user-guide/workflows/capabilities/workflow-actions)

### 2) Follow-up should be CRM-native, not spreadsheet-native

Recommended shape:

- `People` for individuals, including leads, patients, caregivers, and partner contacts.
- `Companies` for organizations, clinics, vendors, or employer accounts.
- `Opportunities` for conversion or care-program stages.
- `Tasks` for reminders and operational follow-up.
- `Notes` for structured context and handoff history.

Why this is the right base:

- `Twenty` explicitly recommends `People`, `Companies`, and `Opportunities` as the standard CRM core.
- `Tasks` and `Notes` are first-class objects for follow-up and context.
- Sales pipelines in `Twenty` are Kanban views of `Opportunities`, which makes stage-based follow-up easy to inspect.

Source anchors:

- [Twenty objects](https://docs.twenty.com/user-guide/data-model/objects)
- [Twenty data model](https://docs.twenty.com/user-guide/data-model)
- [Twenty sales pipeline](https://docs.twenty.com/user-guide/views-pipelines/set-up-a-sales-pipeline)

### 3) Consent should use templates and direct links, not one-off documents

Recommended shape:

1. Build one reusable consent template.
2. Use a direct link when the signer may not be known in advance.
3. Use an API-created signing flow when the signer is already in the intake record.
4. Store the completed document and signing metadata back into the CRM record.

Why this is the right base:

- `Documenso` recommends direct templates as the evergreen pattern for repeated signing.
- Direct links are explicitly meant for cases where recipient emails are not known in advance.
- Self-hosted `Documenso` requires a signing certificate, so the local runtime must be provisioned correctly before consent flows can be trusted.

Source anchors:

- [Documenso user guide](https://docs.documenso.com/docs/users)
- [Documenso direct links](https://docs.documenso.com/docs/users/documents/direct-links)
- [Documenso developer guide](https://docs.documenso.com/developers)
- [Documenso signing certificate](https://docs.documenso.com/docs/self-hosting/configuration/signing-certificate)

### 4) Scheduling should be routed before it is booked

Recommended shape:

1. Screen the attendee with a routing form.
2. Route to the right event type or team member.
3. Trigger a booking webhook after confirmation.
4. Update the CRM and notification state from the webhook payload.

Why this is the right base:

- Cal.com event types carry duration, availability, and location settings.
- Routing Forms are explicitly designed to ask screening questions and direct attendees to the right event type or team member.
- Webhooks exist at user, event-type, team, and organization levels, which lets you choose the correct blast radius for the booking flow.

Source anchors:

- [Cal.com event types](https://cal.com/help/event-types/event-types)
- [Cal.com create first event type](https://cal.com/help/event-types/create-first-event)
- [Cal.com routing forms](https://cal.com/routing)
- [Cal.com webhooks](https://cal.com/help/webhooks)

### 5) Notifications should be topic-driven, not one-off per recipient

Recommended shape:

1. Create a workflow for each business event.
2. Use a `subscriberId` for a person or `topicKey` for a group.
3. Use `topics` for fan-out when many people should receive the same class of update.
4. Store subscriber metadata and preferences once, then resolve them in the workflow.

Why this is the right base:

- Novu workflows are environment-specific and versioned.
- Novu topics are designed for group fan-out.
- Novu workflows can be created from templates, duplicated, and customized instead of rebuilt from scratch.

Source anchors:

- [Novu how it works](https://docs.novu.co/platform/how-novu-works)
- [Novu topics](https://docs.novu.co/platform/concepts/topics)
- [Novu subscribers](https://docs.novu.co/platform/concepts/subscribers)
- [Novu create workflow](https://docs.novu.co/platform/workflow/create-a-workflow)

## Recommended reusable flow structures

### Flow A: Intake to CRM to notification

Best for: contact forms, referral intake, partner applications, and referral triage.

Structure:

1. `n8n` webhook receives intake payload.
2. Payload is normalized and deduplicated by a stable external ID.
3. `Twenty` upserts `People` and `Companies`.
4. `Twenty` creates or updates an `Opportunity`.
5. `Twenty` creates a `Task` for owner follow-up.
6. `Novu` sends a role-based notification.

Why this beats custom glue:

- `Upsert Record` in `Twenty` prevents duplicate records.
- `Search Records` before update lets you bridge manually created and API-created records cleanly.
- Novu topics make it easy to notify a care team, ops team, or sales team without loop logic.

### Flow B: Consent-first onboarding

Best for: medtech onboarding, waivers, service agreements, research consent.

Structure:

1. Intake record is created in `Twenty`.
2. A consent template is selected in `Documenso`.
3. The signer is sent a direct link or signing token.
4. Completed signature updates the CRM record and starts the next workflow.
5. Novu sends a confirmation and next-step message.

Recommended default:

- Use direct links when the signer may arrive from a public flow.
- Use signing tokens when the signer is already identified in the system.
- Keep the legal document reusable as a template.

### Flow C: Scheduling qualification

Best for: medtech consults, triage calls, demo calls, equipment onboarding.

Structure:

1. Routing form asks screening questions.
2. Cal.com routes to the right event type.
3. Booking webhook lands in `n8n`.
4. `Twenty` updates the opportunity stage and owner task.
5. `Novu` sends confirmation and reminder workflows.

Recommended default:

- Keep personal and team event types separate.
- Make secret event types for internal or advanced booking paths.
- Use booking webhooks to avoid polling.

### Flow D: Reminder ladder

Best for: no-show reduction, consent completion, onboarding completion.

Structure:

1. Trigger on an overdue `Task` or missing `Documenso` completion.
2. `Novu` sends a first reminder.
3. `n8n` escalates if no response after a delay.
4. `Twenty` updates the record stage or owner.

Why this is the right base:

- Twenty workflows support delays, filters, and manual forms.
- Novu workflows support versioned channel steps and topic-based delivery.

## Ready-made implementation order

If the goal is maximum value with minimum reinvention, implement in this order:

1. Intake webhook skeleton in `n8n`
2. `Twenty` People/Companies/Opportunities/Tasks mapping
3. `Documenso` consent template and direct link
4. `Cal.com` routing form and event types
5. `Novu` notification workflows and topics

## Minimal source-grounded rules

- Use one canonical external ID for dedupe across `n8n`, `Twenty`, `Documenso`, and `Novu`.
- Use `Record is Created or Updated` in `Twenty` when a workflow can be triggered by manual record creation.
- Use `Upsert Record` instead of separate create/update logic whenever the match key is stable.
- Use `Documenso` templates and direct links for repeated consent flows.
- Use Cal.com routing forms before booking when you need qualification.
- Use Novu topics when a message should go to a group, not an individual.
- Keep `n8n` webhook responses fast and explicit.

## What this pack intentionally does not do

- It does not invent a custom, brand-new workflow engine.
- It does not prescribe external providers that are not needed yet.
- It does not require control-panel changes or launcher changes.
- It does not hardcode production secrets.

## Official source list

- [n8n Webhook node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
- [n8n Respond to Webhook node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.respondtowebhook/)
- [n8n workflow templates](https://docs.n8n.io/workflows/templates/)
- [Twenty workflow triggers](https://docs.twenty.com/user-guide/workflows/capabilities/workflow-triggers)
- [Twenty workflow actions](https://docs.twenty.com/user-guide/workflows/capabilities/workflow-actions)
- [Twenty objects](https://docs.twenty.com/user-guide/data-model/objects)
- [Twenty sales pipeline](https://docs.twenty.com/user-guide/views-pipelines/set-up-a-sales-pipeline)
- [Novu how it works](https://docs.novu.co/platform/how-novu-works)
- [Novu topics](https://docs.novu.co/platform/concepts/topics)
- [Novu subscribers](https://docs.novu.co/platform/concepts/subscribers)
- [Novu create workflow](https://docs.novu.co/platform/workflow/create-a-workflow)
- [Cal.com event types](https://cal.com/help/event-types/event-types)
- [Cal.com create first event type](https://cal.com/help/event-types/create-first-event)
- [Cal.com routing forms](https://cal.com/routing-forms)
- [Cal.com webhooks](https://cal.com/help/webhooks)
- [Documenso user guide](https://docs.documenso.com/docs/users)
- [Documenso direct links](https://docs.documenso.com/docs/users/documents/direct-links)
- [Documenso developer guide](https://docs.documenso.com/developers)
- [Documenso signing certificate](https://docs.documenso.com/developers/self-hosting/signing-certificate)
