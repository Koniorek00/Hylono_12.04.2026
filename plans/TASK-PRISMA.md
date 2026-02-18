# Mission Plan: TASK-PRISMA (Skill Generation)

Generate a dedicated automation skill for Prisma ORM to handle database operations.

## Proposed Changes

### [NEW] [.agent/skills/prisma-ops/SKILL.md](file:///c:/Users/wikto/Onedrive/Dokumenty/Hylono web - Copy (2)/.agent/skills/prisma-ops/SKILL.md)

Define the `prisma-ops` skill with following capabilities:

- `db push` (Sync schema)
- `generate` (Update client)
- `studio` (Open data viewer)
- `validate` (Check schema integrity)

## Execution (system-architect-autonomist)

- Initialize `prisma-ops` folder.
- Draft `SKILL.md` with triggers, commands, and proof artifacts.

## Verification Plan (qa-verifier)

- Trigger `npx prisma --version` to ensure environment check.
- RUN `npm run lint` to ensure no workspace corruption.
- Verify `SKILL.md` content against the standard template.

## Closeout

- Generate `/reports/TASK-PRISMA_closeout.md`.
- Move `AUTO-SKILL-PRISMA.md` to DONE.
