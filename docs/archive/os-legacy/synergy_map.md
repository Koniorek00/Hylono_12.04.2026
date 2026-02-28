# AntiGravity Synergy Map

This document defines how agents work together to achieve complex goals.

## 1. The Growth & Content Loop (Vibration & Trust)
```mermaid
graph TD
    SEO["SEO EIC"] -- "Content Brief" --> PMM["Product Marketing"]
    PMM -- "Copy Draft" --> COMP["Compliance Gate"]
    COMP -- "Approved Text" --> QA["QA Authority"]
    QA -- "Verified Post" --> PUB["DevOps (Publish)"]
    PUB -- "Live Metrics" --> ANA["Analytics Lead"]
    ANA -- "Optimization Ideas" --> SEO
```

## 2. The Product & Engineering Loop (Build & Verify)
```mermaid
graph TD
    PO["Chief Product"] -- "Feature Spec" --> ARCH["Eng Architect"]
    ARCH -- "Arch Design" --> ENG["Engineering Agent"]
    ENG -- "Implementation" --> QA["QA Authority"]
    QA -- "Testing/Proof" --> OPS["DevOps Manager"]
    OPS -- "Flag Rollout" --> PO
```

## 3. The Research & Feedback Loop (The Brain)
```mermaid
graph TD
    CX["CX Lead"] -- "User Feedback" --> CUR["Knowledge Curator"]
    CUR -- "Knowledge Gaps" --> RES["Research Agent"]
    RES -- "Knowledge Pack" --> VAL["Pack Validation"]
    VAL -- "Safe Logic" --> COMP["Compliance Gate"]
    COMP -- "Updated Policy" --> PO
```

## 4. Master Control (The Governor)
- **Executive Orchestrator** monitors all loops via `/docs/os/scoreboard.md`.
- **Daily Program Manager** triggers cycles via `daily-cycle-run`.
- **Security Steward** monitors all directories (`/tasks/`, `/research/`) for access violations.
