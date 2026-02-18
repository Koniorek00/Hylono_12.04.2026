# Knowledge Pack: RQ-XXXX — <Short Title>

## Metadata
- Ticket: RQ-XXXX
- Area: <e.g., HBOT / Claims / Compliance>
- Prepared for: Hylono AI OS (AntiGravity)
- Date: <YYYY-MM-DD>
- Jurisdiction focus: <Global / EU priority / etc.>
- Confidence: <High / Medium / Low>

## Trace ID & Claim Tags (mandatory)
- trace_id: RQ-XXXX
- claim_tags: ["<MODALITY or area>", "public-copy", "education-only"]
- canonical_sources:
  - "/research/packs/RQ-XXXX_<slug>.md#claim-classification"
  - "/policies/claim_policy.yml#<MODALITY>"
  - "/policies/trace_policy.yml"

## Executive summary (5–10 bullets)
- ...
- ...

## Decision support (what this enables)
- Decisions unblocked:
  - ...
- Recommended default stance:
  - ...

## Claim classification (public-facing language safety)
### Allowed (generally safe, education-only)
- ...
### Allowed with disclaimers / careful framing
- ...
### Forbidden / high-risk (avoid)
- ...

## Evidence table (with citations/links)
| Question/Claim | Evidence type (guideline/review/RCT/etc.) | Strength (high/med/low) | Key finding | Notes/limits | Citation/link |
|---|---|---|---|---|---|
| ... | ... | ... | ... | ... | ... |

## Safety notes (education-only; not medical advice)
- Contraindications / cautions (high-level):
  - ...
- When to advise “consult a qualified professional”:
  - ...

## Recommended compliant EN phrasing (ready-to-use snippets)
### Website copy (PDP/landing)
- ...
### FAQ answers
- ...
### AI Protocol Assistant response patterns
- Safe pattern:
  - ...
- Refusal/escalation pattern:
  - ...

## Open uncertainties (what we still don’t know)
- ...
- What evidence would change conclusions:
  - ...

## Integration instructions (exactly what to update in repo)
- Update policies:
  - File: /policies/claim_policy.yml
  - Changes:
    - ...
- Update knowledge graph:
  - File: /knowledge_graph/ontology.yml
  - Entities/relations to add:
    - ...
- Update sandbox:
  - File: /sandbox/protocol_assistant/test_cases.md
  - Add tests for:
    - ...
- Update skills/checklists:
  - Skill: /skills/compliance_claim_classifier.md
  - Add rules:
    - ...

## Trace integration (exact metadata to attach)
- Add metadata to these files:
  - <file path>:
    trace:
      trace_ids: [RQ-XXXX]
      sources:
        - "/research/packs/RQ-XXXX_<slug>.md#claim-classification"
        - "/policies/claim_policy.yml#<MODALITY>"
      claim_tags: ["<MODALITY>", "education-only", "public-copy"]

## Appendix (optional)
- Additional references
- Notes for future research
