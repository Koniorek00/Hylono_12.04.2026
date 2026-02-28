# Release Strategy & Multi-World

## Release Trains
- **Continuous**: Low-risk content/docs updates (Auto-approved if Lint passes).
- **Daily Train**: Standard features (QA verified).
- **Weekly Train**: Major architectural changes (Council approved).

## Feature Flags
- Staged rollout (0% -> Internal -> 10% -> 100%).
- Safe fallback behavior required for all new logic.

## Multi-World Strategy
**Goal**: Balance stability with innovation.

| World | Focus | Risk Level | Target Audience |
| :--- | :--- | :--- | :--- |
| **World A** | Conservative. Stability & Revenue. | Low | General Public (Default) |
| **World B** | Aggressive. Experimentation. | Medium | Beta Users / Traffic Slice |
| **World C** | Moonshot. Category-defining. | High | Internal / Invite-only |

*Council chooses the blend; Ops Agent configures the routing.*
