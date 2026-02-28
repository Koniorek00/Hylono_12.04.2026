# Traceability Standard (Modality Claims)

## What requires trace
Any public-facing or user-facing statement that implies benefits/effects/outcomes of a modality:
- HBOT, PEMF, RLT/NIR, Molecular Hydrogen, etc.
Examples: “supports recovery”, “improves sleep”, “helps inflammation”, etc.

## What counts as a valid trace
A claim must reference:
1) Knowledge Pack section: /research/packs/RQ-xxxx_*.md#...
2) Policy entry: /policies/claim_policy.yml (and /policies/trace_policy.yml)

## Where the trace lives
- MD content: frontmatter fields (trace_id, sources)
- TSX/UI copy: nearby comment block or metadata object in the same file
- AI Protocol Assistant: sandbox logs / structured debug metadata

## Gate enforcement
- Compliance rejects claims without trace.
- QA rejects changes without trace proof.
- Content Linter blocks merges/releases if trace is missing.

## Minimal metadata schema
trace:
  trace_ids: [RQ-0002]
  sources:
    - "/research/packs/RQ-0002_hbot_claims.md#claim-classification"
    - "/policies/claim_policy.yml#HBOT"
  claim_tags: ["HBOT", "education-only", "no-medical-claims"]
