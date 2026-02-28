# EV4: Strategic Self-Governance Rules

These rules govern the autonomous strategic decision-making and pruning layer of the AntiGravity OS Level 4.

## 1. Termination Boundaries (Auto-Kill)

### Auto-Kill (Autonomous)

- **Condition**: Initiative has ROI_SCORE < 3.0 for > 48 hours AND drift detection > 60%.
- **Action**: Mark as "Killed" in `EV3_PORTFOLIO.md` and log in `KILL_LOG.md`.
- **Criteria**: Zero revenue impact AND zero critical automation gain.

### Human Veto Required (Irreversible)

- **Condition**: Initiative is revenue-generating OR has manual approval > 24 hours.
- **Workflow**: Propose "Kill" in `KILL_LOG.md` and wait for human confirmation.
- **Criteria**: High risk of customer trust loss or data integrity.

## 2. Strategy Review Cadence

- **Timing**: Triggered at the end of every Cycle K (Daily Protocol).
- **Scope**: Re-evaluate all "Parked" or "Deferred" initiatives based on new context.

## 3. Drift Protocols

- **Trigger**: Delta between `expected_value` and `reality_signal` > 40%.
- **Action**: Trigger `pivot-engine` to generate alternative pathways.

## 4. Failure Mode: "Strategic Gridlock"

- If > 50% of initiatives are killed in a single cycle, EV4 enters "Safe Mode" and pauses all autonomous evolution until a human strategy review is completed.
