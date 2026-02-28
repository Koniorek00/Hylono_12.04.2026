# AntiGravity OS: ROI Scoring Model (EV3)

This model provides a deterministic way to calculate the Return on Investment (ROI) for any autonomous initiative proposed by the OS.

## 1. Scoring Dimensions

Each dimension is scored from **0 to 10**.

### A. Business Impact (BI)

- **10**: Direct revenue generation or P0 customer trust improvement.
- **5**: Indirect growth support or compliance safeguarding.
- **1**: Minor internal efficiency improvement.

### B. Automation Gain (AG)

- **10**: Eliminates a high-frequency manual bottleneck (>5x/day).
- **5**: Significant increase in automation coverage (+5% total).
- **1**: Slight reduction in manual overhead.

### C. Technical Risk (TR)

- **10**: No risk of data loss, zero regression potential (Pure addition).
- **5**: Moderate risk, affects core components but with high test coverage.
- **1**: High risk, modifies sensitive logic or external state (e.g., Delete/Stripe).
*Note: This is inverted in the formula (Higher TR = Lower Risk).*

### D. Effort (EF)

- **10**: Very Low (<5 min, single tool call).
- **5**: Moderate (Build/Test/Verify required).
- **1**: High (Multi-file refactor, complex simulation).
*Note: This is also inverted in the formula (Higher EF = Lower Effort).*

## 2. ROI_SCORE Formula

The ROI_SCORE is the weighted average of the dimensions:

```text
ROI_SCORE = ((BI * 0.4) + (AG * 0.3) + (TR * 0.2) + (EF * 0.1))
```

| Score Range | Classification | Action |
| :--- | :--- | :--- |
| **8.0 - 10.0** | **Critical Efficiency** | Auto-execute immediately |
| **5.0 - 7.9** | **High Value** | Select top 2 per cycle |
| **0.0 - 4.9** | **Low Value** | Parked / Backlog |

## 3. Risk Thresholds

- **LOW RISK**: TR Score >= 8
- **MEDIUM RISK**: TR Score 5 - 7
- **HIGH RISK**: TR Score < 5 (Requires Manual Approval)
