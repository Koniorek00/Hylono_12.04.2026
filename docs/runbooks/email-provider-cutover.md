# Runbook: Email Provider Cutover

_Last updated: 2026-03-20 | Owner: DevOps_

---

## Purpose

This runbook defines a production-minded but local-safe path for email delivery across the Hylono stack.

The current codebase already separates two concerns:

- `Novu` handles notification orchestration and subscriber sync.
- App routes such as contact, booking, and newsletter currently use `RESEND_API_KEY` for direct outbound mail when it is present.

The goal is to keep local work safe, then cut over to a deliberate provider choice instead of mixing ad hoc mail settings across routes.

---

## Official Provider Guidance

Use the Novu provider guides when wiring the email channel:

- Novu Email Channel: https://docs.novu.co/platform/integrations/email/adding-email
- Novu Custom SMTP: https://docs.novu.co/platform/integrations/email/custom-smtp

If you keep Resend for app mailers, follow the Resend API key and sender guidance:

- Resend API keys: https://resend.com/docs/api-reference/api-keys/create-api-key
- Resend API authentication and transport: https://resend.com/docs/api-reference/
- Resend sender identity: https://resend.com/docs/knowledge-base/how-do-I-create-an-email-address-or-sender-in-resend
- Resend API key handling: https://resend.com/docs/knowledge-base/how-to-handle-api-keys

---

## Recommended Profiles

### Profile A: Local Safe

Use this while you are still iterating locally.

- Novu keeps working for local sync and in-app workflows.
- App mailers can stay disabled or console-only.
- No production SMTP credentials are needed yet.

### Profile B: Resend For App Mailers, SMTP For Novu

Use this if you want the smallest change from the current code.

- App routes keep `RESEND_API_KEY`.
- Novu email delivery uses `Custom SMTP`.
- This gives you one tested transactional sender plane plus Novu orchestration.

### Profile C: Shared SMTP For Everything

Use this when you want one sender stack for both Novu and app mailers.

- App mailers use SMTP.
- Novu uses `Custom SMTP`.
- This is the cleanest long-term model if your provider supports stable SMTP and DKIM.

Do not mix more than one live outbound transport per app route unless you have a clear routing reason. That creates inconsistent sender identities and harder debugging.

---

## Cutover Checklist

1. Pick one profile and write it down before changing credentials.
2. Create a verified sender domain on the provider side.
3. Decide the canonical sender address, such as `notifications@hylono.com`.
4. Set the provider credentials in a local-safe example file first.
5. Validate the environment with `scripts/validate-mail-provider-env.ps1`.
6. Test local delivery with a single address you control.
7. Only then widen the scope to operator inboxes or customer workflows.

---

## Operational Rules

- Never expose mail keys in client-side code.
- Never keep multiple half-configured providers active for the same channel.
- Use one canonical sender identity per product line.
- Keep Novu in-app workflows active even if external email is paused.
- Treat `local-safe` as a deliberate mode, not an error state.

---

## Validation

Run this from the repo root after editing mail-related environment files:

```powershell
.\scripts\validate-mail-provider-env.ps1
```

The validator checks:

- Novu sync secrets
- chosen outbound app-mail profile
- chosen Novu email channel profile
- sender identity fields and basic transport details

---

## Current State In This Repo

- `Novu` sync is already wired through local API secrets and workflow IDs.
- `contact`, `booking`, and `newsletter` currently send outbound mail through Resend when `RESEND_API_KEY` is present.
- The local scaffold below makes that choice explicit so you can keep local work safe, then cut over intentionally.

