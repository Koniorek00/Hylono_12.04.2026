# Service Decision Log Template

Use one copy of this template per service or major architecture decision.

---

## Decision Title

## Date

## Owner

## Related Service

## Decision Type
- deploy now
- defer
- replace
- exclude
- pilot only
- architecture change

## Business Need
What concrete problem does this solve for Hylono right now?

## Source Files Reviewed
List the package files, official docs, and any added operator notes reviewed before making the decision.

## Version Selected

## License Status
- acceptable
- needs review
- blocked

## Deployment Method Selected
- docker compose
- kubernetes
- managed service
- other

## Integration Boundaries
What systems will connect to it?
- Next.js app
- PostgreSQL
- Redis
- MongoDB
- Auth system
- Stripe
- Resend
- n8n
- Novu
- Twenty
- Kong
- PostHog
- other

## Data Sensitivity
What data classes will it handle?

## EU and Compliance Notes
Record GDPR, residency, processor, consent, and health-adjacent concerns.

## Operational Owner
Who runs, monitors, patches, and restores it?

## Key Risks
List the biggest implementation and maintenance risks.

## What Must Be Verified Before Go-Live
- [ ] version rechecked
- [ ] license rechecked
- [ ] backups defined
- [ ] restore tested
- [ ] auth/access model approved
- [ ] monitoring defined
- [ ] rollback path written
- [ ] secrets stored correctly

## Final Decision

## Why This Decision Was Chosen

## Follow-Up Tasks
1.
2.
3.

---
