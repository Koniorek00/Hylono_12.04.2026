# Trace Coverage KPI

## Why
Ensures every modality/outcome claim is auditable and compliant.

## Definition
Trace Coverage (%) =
(claims with valid trace metadata) / (total detected modality/outcome claims) × 100

## Valid trace requires
- trace_ids >= 1
- sources >= 2 including:
  - /research/packs/...#...
  - /policies/claim_policy.yml#...
- reference to /policies/trace_policy.yml

## Scope
- Public content (MD/TSX/UI strings)
- Protocol Assistant sandbox outputs (JSON logs)

## Targets
- Protocol Assistant + HBOT pages: 100%
- Overall: >= 95% with explicit exceptions list + remediation plan
