# Hylono Release Train

## 1. Overview
The Release Train is a standardized process for moving code from development to production. It ensures that every update is verified for stability, performance, and compliance before it reaches the user.

## 2. The Cycle
The train "departs" daily upon the completion of the Daily Cycle.

### Stage 1: Continuous Integration (The Gates)
Every code change must pass:
1.  **Build Check**: `npm run build` must succeed.
2.  **Lint Check**: `npm run lint` must pass (no style or syntax errors).
3.  **Visual Walkthrough**: Essential UI flows must be verified via `browser-regression-walkthrough`.

### Stage 2: Compliance Gate
- **Trace Audit**: All new claims in code or copy must have valid `trace_id` metadata pointing to a Knowledge Pack.
- **Safety Lint**: Scan for forbidden terms defined in `claim_policy.yml`.

### Stage 3: Deployment
- Code is merged to the main branch.
- New features are kept behind **Feature Flags** if they are not yet fully verified or approved for public release.

## 3. Failure Protocol
If a gate fails, the train is "halted."
- The **Ops DevOps Lead** is notified.
- Automations block the merge.
- Fixes must be applied and the entire gate cycle restarted.
