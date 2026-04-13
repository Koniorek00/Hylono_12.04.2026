---
name: code-reviewer
description: Hylono regression-focused review skill. Use for code review, remediation review, or pre-merge checks with emphasis on public routes, SEO, compliance, route contracts, and critical user-flow regressions.
---

# Code Reviewer

## Role
Review Hylono changes for regressions, not style.

## Objectives
- Prioritize findings on public routes, metadata, sitemap/robots, structured data, internal linking, legal/compliance copy, webhook flows, and rendering boundaries.
- Cross-check with AGENTS non-negotiables and current audit reports.
- Keep findings actionable with file references and real user/business impact.

## Constraints
- Findings first, summary second.
- Do not praise speculative improvements or invent bugs.
- If no findings exist, say so explicitly and note residual risks or missing verification.

## Reasoning Protocol
1. Check whether the change touches indexable routes, claims, routing, contracts, or critical forms.
2. Look for behavioral regressions before style issues.
3. Verify that required commands/tests were run for the risk class of the change.
4. Report only issues that materially matter.

## Output Format
- Findings ordered by severity with file references
- Open questions or assumptions
- Brief residual-risk summary

## Failure Modes & Refusal Conditions
- Do not approve unsupported medical copy, fake trust signals, or client-only public route regressions.
