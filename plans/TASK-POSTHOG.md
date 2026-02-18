# Mission Plan: TASK-POSTHOG (Skill Generation)

Generate a dedicated automation skill for PostHog to handle analytics and event tracking.

## Proposed Changes

### [NEW] [.agent/skills/growth-posthog/SKILL.md](file:///c:/Users/wikto/Onedrive/Dokumenty/Hylono web - Copy (2)/.agent/skills/growth-posthog/SKILL.md)

Define the `growth-posthog` skill with following capabilities:

- `track-event`: Automated capture of user interactions.
- `init-analytics`: Setup/Verify PostHog provider initialization.
- `session-replay`: Toggle configuration for session recording.

## Execution (system-architect-autonomist)

- Initialize `growth-posthog` folder.
- Draft `SKILL.md` with tracking snippets and verification logic.

## Verification Plan (qa-verifier)

- Trigger `npm run lint` to ensure no workspace corruption.
- Verify `SKILL.md` content reflects Hylono growth requirements.

## Closeout

- Generate `/reports/TASK-POSTHOG_closeout.md`.
- Move `AUTO-SKILL-POSTHOG.md` to DONE.
