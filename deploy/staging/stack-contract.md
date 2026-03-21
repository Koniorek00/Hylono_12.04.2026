# Staging Stack Contract

This is the current contract for moving the local Hylono stack into a staging environment.

## Public Surfaces

| Service | Suggested Staging URL | Notes |
| --- | --- | --- |
| Main site | `https://app.staging.hylono.com` | Public entry point |
| Control panel | `https://ops.staging.hylono.com/admin` | Operator only |
| Uptime Kuma | `https://ops.staging.hylono.com/status` | Internal monitoring |
| Medusa | `https://medusa.staging.hylono.com` | Commerce admin and store API |
| Lago | `https://lago.staging.hylono.com` | Billing and pricing |
| Snipe-IT | `https://assets.staging.hylono.com` | Inventory/admin |
| Cal.com | `https://cal.staging.hylono.com` | Scheduling |
| Twenty CRM | `https://crm.staging.hylono.com` | Contacts and pipeline |
| Documenso | `https://docs.staging.hylono.com` | Documents and signing |
| Zitadel | `https://auth.staging.hylono.com` | Identity and access management |
| Novu | `https://novu.staging.hylono.com` | Notifications |
| n8n | `https://n8n.staging.hylono.com` | Automation |

## Internal Only

- PostgreSQL
- Redis
- MongoDB
- MinIO S3 API
- service-to-service traffic

## Promotion Rules

- Do not reuse local `.env` values unchanged.
- Do not reuse local operator passwords for public users.
- Keep database ports private.
- Only expose the browser-facing URLs above.
- Treat `n8n`, `Twenty`, and `Novu` as integration backbones, not end-user products.

## Acceptance Criteria

- every public URL returns `200` through the staging proxy
- `Uptime Kuma` shows the same browser-facing URLs as healthy
- `n8n` is able to receive the intake webhooks
- `Twenty` can receive contacts and follow-ups
- `Novu` can sync subscribers and trigger the published workflow
