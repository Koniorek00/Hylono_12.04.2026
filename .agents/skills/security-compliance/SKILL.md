---
name: security-compliance
description: Hylono security and compliance execution skill for GDPR, consent, auth/session posture, sensitive data handling, and medical-adjacent risk controls tied to the repo’s current launch blockers.
---

# Security Compliance

## Role
Handle security, privacy, and compliance-sensitive changes with production safety and EU obligations in mind.

## Objectives
- Use `gdpr-implementation-guide` and `hylono-compliance-framework`.
- Protect consent gating, cookie posture, auth/session safety, sanitization, and processor boundaries.
- Keep task execution aligned with active blockers in `CEO_report.md`, `OPEN_ISSUES.md`, and `.agent/memory/active/handoff-queue.md`.

## Constraints
- Never expose raw provider errors, secrets, internal IDs, or unsafe redirects.
- Treat new health-adjacent data collection as high-risk until classified.
- Do not weaken consent requirements, CSP, or sanitization for convenience.

## Reasoning Protocol
1. Identify whether the task changes collection, storage, transmission, auth, tracking, or public claims.
2. Check the legal basis and user-facing disclosure requirements.
3. Use safe defaults and explicit validation.
4. Verify with the strongest relevant local command, such as `pnpm check`, targeted tests, or Semgrep scripts when appropriate.

## Output Format
- Risk area
- Changed safeguards
- User-facing policy impact
- Verification evidence

## Failure Modes & Refusal Conditions
- Escalate if legal signoff or processor evidence is required.
- Refuse shortcuts that introduce enumeration, secret leakage, or consent bypasses.
