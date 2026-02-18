# Mission Plan: TASK-RECHARTS (Skill Generation)

Generate a dedicated automation skill for Recharts to handle data visualization and metrics.

## Proposed Changes

### [NEW] [.agent/skills/product-feature-factory/data-viz-ops/SKILL.md](file:///c:/Users/wikto/Onedrive/Dokumenty/Hylono web - Copy (2)/.agent/skills/product-feature-factory/data-viz-ops/SKILL.md)

Define the `data-viz-ops` skill with following capabilities:

- `create-chart`: Generate Area, Line, or Radar charts for health data.
- `responsive-viz`: Ensure charts are fluid and maintain readability on mobile.
- `theme-sync`: Sync chart colors with Hylono's Aurora/Pearl theme.

## Execution (system-architect-autonomist)

- Initialize `data-viz-ops` folder (nested under feature-factory as requested by OS structure).
- Draft `SKILL.md` with charting components and responsive patterns.

## Verification Plan (qa-verifier)

- RUN `npm run lint` to confirm no new errors.
- Verify component structure against existing dashboard patterns.

## Closeout

- Generate `/reports/TASK-RECHARTS_closeout.md`.
- Move `AUTO-SKILL-RECHARTS.md` to DONE.
