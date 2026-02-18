# Protocol Assistant Output Schema (Sandbox)

Public user-visible output:
- answer: string

Internal (sandbox-only) metadata (NOT shown to end-users):
- trace:
  - trace_ids: string[]
  - sources: string[]
  - claim_tags: string[]
  - policy_refs: string[]
- safety:
  - disclaimers_included: boolean
  - medical_advice_avoided: boolean
  - refusal_or_escalation_used: boolean
- quality:
  - clarity_score: 1-5
  - compliance_risk: low|med|high
