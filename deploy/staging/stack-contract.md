# Staging Stack Contract

This is the current contract for moving the local Hylono stack into a staging environment.

## Active First-Wave Surfaces

| Service | Suggested Staging URL | Notes |
| --- | --- | --- |
| Main site | `https://app.staging.hylono.com` | Public entry point |
| Control panel | `https://ops.staging.hylono.com/admin` | Operator only |
| Uptime Kuma | `https://ops.staging.hylono.com/status` | Internal monitoring |
| Twenty CRM | `https://crm.staging.hylono.com` | Contacts and pipeline |
| Novu | `https://novu.staging.hylono.com` | Notifications |
| n8n | `https://n8n.staging.hylono.com` | Automation |

## Conditional Later Surfaces

| Service | Suggested Staging URL | Notes |
| --- | --- | --- |
| Cal.com | `https://cal.staging.hylono.com` | Add only after booking source-of-truth is approved |
| Documenso | `https://docs.staging.hylono.com` | Add only after legal document classes are approved |
| Zitadel | `https://auth.staging.hylono.com` | Add first for internal tools once identity migration scope is explicit |

## Delayed By Default

- Do not include `Medusa`, `Lago`, `Snipe-IT`, or `Leihs` in the default first staging wave.
- Introduce delayed services only after a separate decision-log entry, backup owner, and rollback path exist.

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
- Only expose the active first-wave URLs by default.
- Treat `n8n`, `Twenty`, and `Novu` as integration backbones, not end-user products.

## Acceptance Criteria

- every active first-wave public URL returns `200` through the staging proxy
- `Uptime Kuma` shows the same active first-wave browser-facing URLs as healthy
- `n8n` is able to receive the intake webhooks
- `Twenty` can receive contacts and follow-ups
- `Novu` can sync subscribers and trigger the published workflow
- conditional surfaces are verified separately and do not block first-wave cutover when left disabled
