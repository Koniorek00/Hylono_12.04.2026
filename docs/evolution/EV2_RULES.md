# EV2 Rules — Self-Evolution Governance

## 1. Scope of Autonomy

Evolution Level 2 (EV2) allows the OS to proactively improve its own capabilities.

### Auto-Improvement (LOW/MEDIUM Risk)

- **Skills**: Refinement of `SKILL.md`, adding new commands, or improving proof artifacts.
- **Templates**: Updating `/templates/*` for better consistency.
- **CI Gates**: Strengthening lint rules or adding automated test cases.
- **Documentation**: Updating technical docs, architecture notes, or scoreboard metrics.

### Restricted (HIGH Risk - Requires Review)

- **Auth/Security**: Any change to login flows, encryption, or permissions.
- **Payments**: Modifications to Stripe integration or pricing logic.
- **Global Configs**: Changes to `.env`, `package.json` dependencies (major versions), or core framework config.
- **Policies**: Changes to `/policies/*` (Claim Policy, etc.).

## 2. Risk Classification

| Risk Level | Definition | Action |
| :--- | :--- | :--- |
| **LOW** | Cosmetic, documentation, or non-functional skill updates. | Auto-implement + Log. |
| **MEDIUM** | New non-critical skills, UI polish, or unit test additions. | Auto-implement + Log. |
| **HIGH** | Structural changes, security, payments, or data-loss risks. | Create `/tasks/queued/AUTO-XXXX.md` for User Review. |

## 3. Failure Protocol

If an EV2 process causes a regression:

1. The `post-run-review` must identify the failure pattern.
2. Log it in `LESSONS_LOG.md` with "CRITICAL" status.
3. Propose a "Hardened Rule" in `.agent/rules/` to prevent recurrence.
