# GUARDRAILS — NEURAL CONSTELLATION OS

> **Status**: Absolute Laws | Non-Negotiable | Trust Cluster Enforced
> **Enforcement**: [compliance-gate](file:///c:/Users/wikto/Onedrive/Dokumenty/Hylono%20web%20-%20Copy%20(2)/.agent/clusters/trust/CLUSTER.md) + [qa-verifier](file:///c:/Users/wikto/Onedrive/Dokumenty/Hylono%20web%20-%20Copy%20(2)/.agent/clusters/trust/CLUSTER.md)

---

## 1. Safety & Security (L0 — No Autonomy)

| Rule | Violation = |
|------|-------------|
| **Secure Mode: ON** | All terminal commands, mass file changes require explicit approval |
| **Global Config Lock** | Forbidden: `~/.gemini/*`, `mcp_config.json`, `.env*` modifications |
| **Run-to-Completion** | No infinite loops. Task → Report → STOP |
| **No Hallucinations** | Only real files, functions, data. Uncertainty → Research Queue |

**Consciousness Enforcement**: Meta-Watcher monitors for violations. Repeated violations → agent dissolution.

---

## 2. Compliance & Truth (Trust Cluster Veto)

| Rule | Mechanism |
|------|-----------|
| **Modality Claims → Trace** | Every technology claim MUST have `trace_id` to Knowledge Pack |
| **No Medical Claims** | Forbidden words: "diagnose", "treat", "cure", "heal disease" |
| **Truth-First** | All code changes must pass `build-test-prove` |
| **Source of Truth** | Claims: [claim_policy.yml](file:///c:/Users/wikto/Onedrive/Dokumenty/Hylono%20web%20-%20Copy%20(2)/policies/claim_policy.yml) • Traces: [trace_policy.yml](file:///c:/Users/wikto/Onedrive/Dokumenty/Hylono%20web%20-%20Copy%20(2)/policies/trace_policy.yml) |

**Pathway**: All content → compliance-gate → IF claim detected → trace validation

---

## 3. Resource Stewardship (Ops Cluster)

| Rule | Why |
|------|-----|
| **Browser Discipline** | Close ALL tabs immediately after verification |
| **Local Dev First** | Verify `npm run dev` running before visual tests |
| **Credit Conservation** | Wasteful tasks deduct agent credits |

---

## 4. Verification Split (Dual-Pathway Gate)

```
┌─────────────────────────────────────────────────────────────┐
│ IMPLEMENTATION PATHWAY         VERIFICATION PATHWAY         │
│ (Product/Growth Cluster)       (Trust Cluster)              │
│                                                              │
│     Code Change                     ↓                        │
│         ↓                    qa-verifier                    │
│    eng-lead                  (independent)                  │
│         ↓                           ↓                        │
│         └───────────────────────────┘                        │
│                      ↓                                       │
│               compliance-gate                                │
│              (trace validation)                              │
│                      ↓                                       │
│                   RELEASE                                    │
└─────────────────────────────────────────────────────────────┘
```

**Rule**: Worker ≠ Verifier. Different neural pathways required.

---

## 5. Uncertainty Protocol (Research First)

| Confidence | Action |
|:----------:|--------|
| ≥ 80% | Proceed with implementation |
| 50-79% | Flag uncertainty, proceed with caution |
| < 50% | HALT. Create ticket in [/research/queue.yml](file:///c:/Users/wikto/Onedrive/Dokumenty/Hylono%20web%20-%20Copy%20(2)/research/queue.yml) |

**Flow**: Uncertainty → Research Curator → Knowledge Pack → THEN implement

---

## 6. Evolution Safety (AI Cluster)

| Rule | Enforcement |
|------|-------------|
| **New Skills → Safety Review** | system-architect-autonomist → protocol-assistant-curator |
| **Agent Mutations → Meta-Watcher Approval** | No self-modification without oversight |
| **Pathway Changes → Logged** | All connection_map.yml changes tracked |

---

## 7. Autonomy Boundaries

| Level | Can Do | Cannot Do |
|:-----:|--------|-----------|
| L3 | Deploy, refactor, optimize | Change architecture |
| L2 | Build features, update content | Modify pricing, legal |
| L1 | Suggest changes | Act without approval |
| L0 | Nothing | Everything requires human |

**Override**: Trust Cluster can VETO any action from any level.

---

## Violation Response Matrix

| Severity | Example | Response |
|:--------:|---------|----------|
| **Critical** | Medical claim without trace | Immediate halt, block release |
| **High** | Hallucinated data | Rollback, research queue ticket |
| **Medium** | Browser tabs left open | Warning, credit deduction |
| **Low** | Suboptimal pathway | Log for evolution review |

---

> **These laws are absolute. They exist to protect users, the business, and the integrity of the constellation.**
