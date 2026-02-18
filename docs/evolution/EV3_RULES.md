# EV3: Autonomy Governance Rules

These rules govern the autonomous decision-making and execution layer of the AntiGravity OS Level 3.

## 1. Execution Boundaries

### Auto-Execution (Autonomous)

- **Condition**: ROI_SCORE >= 5.0 AND Risk == LOW/MEDIUM.
- **Limit**: Max 2 initiatives per cycle.
- **Proof**: Must generate a `walkthrough.md` with visual proof (if UI) or logs (if logic).

### Proposed (Human-in-the-loop)

- **Condition**: Risk == HIGH OR ROI_SCORE < 5.0.
- **Workflow**: Move to `EV3_PORTFOLIO.md` as "Proposed" and Notify User.
- **Execution**: Forbidden until `approval_queue.md` or direct chat confirmation.

## 2. Cycle Governance

- **Review Frequency**: Once per Daily Cycle.
- **Backlog Management**: Initiatives older than 7 days with ROI_SCORE < 4.0 are automatically archived.

## 3. Failure Protocols

- **Circuit Breaker**: If an auto-executed initiative causes a build failure or regression, EV3 is SUSPENDED until a root cause analysis is logged in `LESSONS_LOG.md`.
- **Reversion**: All auto-executed initiatives MUST be committed with a specific `EV3-AUTO` prefix for easy rollback.
