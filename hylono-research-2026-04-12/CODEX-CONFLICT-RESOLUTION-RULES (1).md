# Codex Conflict Resolution Rules

## Purpose
Codex should use this file whenever the research package, a blueprint, an older guide, and current docs do not fully agree.

## Priority Order
1. current official docs
2. current official releases and changelogs
3. current official example repos
4. maintained community implementations with recent evidence
5. older guides and discussion threads

## Conflict Handling Rules
### If versions conflict
- pick the newest officially supported stable version
- note the conflict in the decision log
- do not silently reuse pinned versions from old Compose files

### If deployment methods conflict
- prefer the officially documented deployment path
- use community Compose or Helm only when official materials are incomplete or clearly dev-focused
- record all deviations from official guidance

### If auth guidance conflicts with Hylono architecture
- preserve the current Next.js public-site boundary unless there is an approved migration plan
- do not collapse all auth flows into a new external service without mapping existing users, sessions, and callbacks

### If an asset is incomplete
- treat it as a scaffold, not a source of truth
- extract only the useful parts: environment variables, service topology, health checks, volumes, ingress patterns
- rebuild the final implementation in Hylono conventions

### If docs are vague
- stop and verify manually rather than guess
- create a missing-information note
- escalate to human review for license, compliance, or identity questions

## Never-Assume Rules for Codex
- never assume two apps with similar features should both be deployed
- never assume self-hosting is operationally cheaper
- never assume default ports and sample env files are production-safe
- never assume a workflow tool should own core business truth
- never assume health-adjacent data can be treated like generic marketing data
