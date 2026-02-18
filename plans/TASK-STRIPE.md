# Mission Plan: TASK-STRIPE (Skill Generation)

Generate a dedicated automation skill for Stripe to handle e-commerce and subscription flows.

## Proposed Changes

### [NEW] [.agent/skills/growth-stripe/SKILL.md](file:///c:/Users/wikto/Onedrive/Dokumenty/Hylono web - Copy (2)/.agent/skills/growth-stripe/SKILL.md)

Define the `growth-stripe` skill with following capabilities:

- `create-checkout`: Generate session links for rentals or purchases.
- `manage-subscription`: End-to-end flow for upgrading/cancelling plans.
- `verify-webhook`: Logic for testing Stripe webhook integration locally.

## Execution (system-architect-autonomist)

- Initialize `growth-stripe` folder.
- Draft `SKILL.md` with payment snippets and verification logic.

## Verification Plan (qa-verifier)

- RUN `npm run lint` to confirm zero-error state.
- Verify `SKILL.md` content against Hylono business model (Sales + Rental).

## Closeout

- Generate `/reports/TASK-STRIPE_closeout.md`.
- Move `AUTO-SKILL-STRIPE.md` to DONE.
